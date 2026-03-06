import { Err, Ok, type Result } from "../config/result";
import { decodeNumberFromString, decodeOneOf, decodeNonEmptyString } from "../config/decode";
import { FEATURE_KEYS } from "../config/schema";
import type { Action } from "./actions";

const MODES = ["dev", "prod"] as const;
const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;

function parseKV(s: string): Result<{ key: string; value: string }> {
  const idx = s.indexOf("=");
  if (idx <= 0) return Err(`cli expected k=v, got "${s}"`);
  return Ok({ key: s.slice(0, idx), value: s.slice(idx + 1) });
}

export function decodeActionFromArgv(argv: string[]): Result<Action | null> {
  // 例子：
  // ["node","dist/main.js","set","port=4000"]
  const cmd = argv[2] as unknown;
  if (cmd === undefined) return Ok(null);

  if (cmd === "set") {
    const kvRaw: unknown = argv[3];
    const kv1 = decodeNonEmptyString(kvRaw, "cli.kv");
    if (!kv1.ok) return kv1;

    const kv = parseKV(kv1.data);
    if (!kv.ok) return kv;

    if (kv.data.key === "port") {
      const r = decodeNumberFromString(kv.data.value, "config.port");
      return r.ok ? Ok({ type: "setPort", port: r.data }) : r;
    }

    if (kv.data.key === "mode") {
      const r = decodeOneOf(kv.data.value, MODES, "config.mode");
      return r.ok ? Ok({ type: "setMode", mode: r.data }) : r;
    }

    if (kv.data.key === "logLevel") {
      const r = decodeOneOf(kv.data.value, LOG_LEVELS, "config.logLevel");
      return r.ok ? Ok({ type: "setLogLevel", logLevel: r.data }) : r;
    }

    return Err(`cli.set unknown key "${kv.data.key}" (expected port|mode|logLevel)`);
  }

  if (cmd === "feature") {
    const kvRaw: unknown = argv[3];
    const kv1 = decodeNonEmptyString(kvRaw, "cli.featureKV");
    if (!kv1.ok) return kv1;

    const kv = parseKV(kv1.data);
    if (!kv.ok) return kv;

    // key 必须来自固定集合（字符串域）
    if (!(FEATURE_KEYS as readonly string[]).includes(kv.data.key)) {
      return Err(`config.featureFlags.${kv.data.key} is not allowed`);
    }

    // value 必须是 true/false
    const v = kv.data.value.toLowerCase();
    if (v !== "true" && v !== "false") {
      return Err(`config.featureFlags.${kv.data.key} expected boolean (true/false)`);
    }

    return Ok({
      type: "toggleFeature",
      key: kv.data.key as any,
      value: v === "true",
    });
  }

  return Err(`cli unknown command "${String(cmd)}" (expected set|feature)`);
}