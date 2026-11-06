import { describe, expect, it } from 'vitest';
import { cn, type ClassName } from './cn';

type CnCase = Readonly<{ classNames: ReadonlyArray<ClassName>; expected: string }>;

const CASES: ReadonlyArray<CnCase> = [
  { classNames: ['a', 'b'], expected: 'a b' },
  { classNames: ['a', false, 'b'], expected: 'a b' },
  { classNames: [null, 'a', undefined], expected: 'a' },
  { classNames: ['', 'a'], expected: 'a' },
  { classNames: [false, null, undefined], expected: '' },
  { classNames: [], expected: '' },
];

describe('cn', () => {
  it.each(CASES)('joins $classNames into "$expected"', ({ classNames, expected }) => {
    expect(cn(...classNames)).toBe(expected);
  });

  it.each([
    { isActive: true, expected: 'base active' },
    { isActive: false, expected: 'base' },
  ])('includes a conditional class only when isActive is $isActive', ({ isActive, expected }) => {
    expect(cn('base', isActive && 'active')).toBe(expected);
  });
});
