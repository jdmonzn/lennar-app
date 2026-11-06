/** Marks the end of an exhaustive `switch`; fails to compile if a case is unhandled and throws if reached at runtime. */
export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}
