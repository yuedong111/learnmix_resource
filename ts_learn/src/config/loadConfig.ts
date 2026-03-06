import type { AppConfig, LogLevel, Mode } from "./schema";
import { FEATURE_KEYS } from "./schema";
import { defaultFeatureFlags, type FeatureFlags } from "./features";
import { Err, Ok, type Result } from "./result";
import { decodeNumberFromString, decodeOneOf, decodeNonEmptyString } from "./decode";
import { withDefault } from "./defaults";

const MODES = ["dev", "prod"] as const;
const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;

function decodeMode(u: unknown): Result<Mode> {
  return decodeOneOf(u, MODES, "config.mode");
}

function decodeLogLevel(u: unknown): Result<LogLevel> {
  return decodeOneOf(u, LOG_LEVELS, "config.logLevel");
}

function decodePort(u: unknown): Result<number> {
  return decodeNumberFromString(u, "config.port");
}

/**
 * featureFlags 来源：通常来自 env/json/cli
 * 这里先给你一个“简单版本”：只支持 FEATURE_<KEY>=true/false
 * 例如：FEATURE_cache=true
 */
function readFeatureFlagsFromEnv(env: NodeJS.ProcessEnv): unknown {
  const out: Record<string, unknown> = {};
  for (const k of FEATURE_KEYS) {
    const raw = env[`FEATURE_${k}`];
    if (raw !== undefined) out[k] = raw; // raw 是 string
  }
  return out;
}

function decodeBooleanFromString(u: unknown, path: string): Result<boolean> {
  if (typeof u === "boolean") return Ok(u);
  if (typeof u !== "string") return Err(`${path} expected boolean`);
  const s = u.toLowerCase();
  if (s === "true") return Ok(true);
  if (s === "false") return Ok(false);
  return Err(`${path} expected boolean (true/false)`);
}

function decodeFeatureFlags(u: unknown): Result<FeatureFlags> {
  // u 可能是 {} / undefined / 或某个对象
  if (u === undefined) return Ok(defaultFeatureFlags);

  if (typeof u !== "object" || u === null) {
    return Err("config.featureFlags expected object");
  }

  const obj = u as Record<string, unknown>;
  const out: any = { ...defaultFeatureFlags };

  for (const k of FEATURE_KEYS) {
    if (obj[k] !== undefined) {
      const r = decodeBooleanFromString(obj[k], `config.featureFlags.${k}`);
      if (!r.ok) return r;
      out[k] = r.data;
    }
  }

  return Ok(out as FeatureFlags);
}

export function loadConfig(): Result<AppConfig> {
  const env = process.env;

  // 1) 来源：unknown
  const rawPort: unknown = env.PORT;
  const rawMode: unknown = env.MODE;
  const rawLogLevel: unknown = env.LOG_LEVEL;
  const rawFeatureFlags: unknown = readFeatureFlagsFromEnv(env);

  // 2) 解码：unknown -> typed（带路径报错）
  const portR = withDefault(rawPort, 3000, decodePort);
  if (!portR.ok) return portR;

  const modeR = withDefault(rawMode, "dev" as const, decodeMode);
  if (!modeR.ok) return modeR;

  const logR = withDefault(rawLogLevel, "info" as const, decodeLogLevel);
  if (!logR.ok) return logR;

  const flagsR = decodeFeatureFlags(rawFeatureFlags);
  if (!flagsR.ok) return flagsR;

  // 3) 产物：强类型 AppConfig
  return Ok({
    port: portR.data,
    mode: modeR.data,
    logLevel: logR.data,
    featureFlags: flagsR.data,
  });
}