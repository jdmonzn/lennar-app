import { describe, expect, it } from 'vitest';
import { isRecord } from './isRecord';

describe('isRecord', () => {
  it.each([{}, { id: '1' }, []])('accepts the object %j', (value) => {
    expect(isRecord(value)).toBe(true);
  });

  it.each([null, undefined, 42, 'text', true])('rejects %j', (value) => {
    expect(isRecord(value)).toBe(false);
  });
});
