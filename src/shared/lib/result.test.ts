import { describe, expect, it } from 'vitest';
import { err, ok, type Result } from './result';

function parsePositive(input: number): Result<number, 'notPositive'> {
  return input > 0 ? ok(input) : err('notPositive');
}

describe('Result', () => {
  it('wraps a value with ok', () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });

  it('wraps an error with err', () => {
    expect(err('boom')).toEqual({ ok: false, error: 'boom' });
  });

  it('narrows to the value on the success branch', () => {
    const result = parsePositive(3);

    expect(result.ok && result.value).toBe(3);
  });

  it('narrows to the error on the failure branch', () => {
    const result = parsePositive(-1);

    expect(!result.ok && result.error).toBe('notPositive');
  });
});
