import { Err, Ok, type Result } from "./result";

export function withDefault<T>(u: unknown, def: T, decode: (x: unknown) => Result<T>): Result<T> {
  if (u === undefined) return Ok(def);
  return decode(u);
}

export function required<T>(u: unknown, path: string, decode: (x: unknown) => Result<T>): Result<T> {
  if (u === undefined) return Err(`${path} is required`);
  return decode(u);
}
