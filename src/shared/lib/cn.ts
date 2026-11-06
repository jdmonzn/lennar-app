/** A class name, or a falsy value produced by an inline condition. */
export type ClassName = string | false | null | undefined;

/** Joins class names into one `className` string, skipping falsy entries so conditions can be inlined. */
export function cn(...classNames: ReadonlyArray<ClassName>): string {
  return classNames.filter(Boolean).join(' ');
}
