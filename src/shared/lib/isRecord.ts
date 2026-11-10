/** Narrows an `unknown` value to an object whose properties can be read safely. */
export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null;
}
