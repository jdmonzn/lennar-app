/** Outcome of an operation that can fail in an expected way: a value or a typed error. */
export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

/** Wraps a value in a successful `Result`. */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/** Wraps an error in a failed `Result`. */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
