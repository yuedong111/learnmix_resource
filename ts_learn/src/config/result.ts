export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export const Ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const Err = (error: string): Result<never> => ({ ok: false, error });

export function map<T, R>(r: Result<T>, fn: (t: T) => R): Result<R> {
  return r.ok ? Ok(fn(r.data)) : r;
}
