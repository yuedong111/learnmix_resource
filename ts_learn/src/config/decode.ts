import { Err, Ok, type Result } from "./result";

export type Path = string; // 新手先用 string，后面可升级成 string[]

export function decodeString(u: unknown, path: Path): Result<string> {
  if (typeof u === "string") return Ok(u);
  return Err(`${path} expected string`);
}

export function decodeNonEmptyString(u: unknown, path: Path): Result<string> {
  if (typeof u === "string" && u.length > 0) return Ok(u);
  return Err(`${path} expected non-empty string`);
}

export function decodeNumberFromString(u: unknown, path: Path): Result<number> {
  // env 通常是 string，所以这里专门从 string parse number
  if (typeof u !== "string" || u.length === 0) return Err(`${path} expected string number`);
  const n = Number(u);
  if (Number.isFinite(n)) return Ok(n);
  return Err(`${path} expected number`);
}

export function decodeOneOf<const T extends readonly string[]>(
  u: unknown,
  allowed: T,
  path: Path
): Result<T[number]> {
  if (typeof u !== "string") return Err(`${path} expected string`);
  // includes 对 string[] ok；用 as readonly string[] 避免类型噪音
  if ((allowed as readonly string[]).includes(u)) return Ok(u as T[number]);
  return Err(`${path} expected one of ${allowed.join(" | ")}`);
}
