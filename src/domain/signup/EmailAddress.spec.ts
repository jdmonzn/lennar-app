import { describe, expect, it } from 'vitest';
import { EmailAddress, type EmailValidationError } from './EmailAddress';

const MAX_LENGTH = 254;

function addressOfLength(length: number): string {
  const domain = `${'b'.repeat(61)}.${'c'.repeat(61)}.${'d'.repeat(61)}.com`;
  return `${'a'.repeat(length - domain.length - 1)}@${domain}`;
}

function createValid(raw: string): EmailAddress {
  const result = EmailAddress.create(raw);
  if (!result.ok) {
    throw new Error(`Expected "${raw}" to be valid, got ${result.error}`);
  }
  return result.value;
}

describe('EmailAddress.create', () => {
  it.each([
    'jane@example.com',
    'jane.doe@example.com',
    'jane+newsletter@example.com',
    'jane_doe-99@sub.example.co.uk',
    'a@b.co',
    'JANE@EXAMPLE.COM',
  ])('accepts %s', (raw) => {
    expect(createValid(raw).value).toBe(raw);
  });

  it.each([
    { raw: '  jane@example.com  ', expected: 'jane@example.com' },
    { raw: '\tjane@example.com\n', expected: 'jane@example.com' },
  ])('trims surrounding whitespace from $raw', ({ raw, expected }) => {
    expect(createValid(raw).value).toBe(expected);
  });

  it.each<{ raw: string; error: EmailValidationError }>([
    { raw: '', error: 'empty' },
    { raw: '   ', error: 'empty' },
    { raw: '\t\n', error: 'empty' },
    { raw: addressOfLength(MAX_LENGTH + 1), error: 'tooLong' },
    { raw: 'a'.repeat(400), error: 'tooLong' },
    { raw: 'plainaddress', error: 'invalidFormat' },
    { raw: '@example.com', error: 'invalidFormat' },
    { raw: 'jane@', error: 'invalidFormat' },
    { raw: 'jane@example', error: 'invalidFormat' },
    { raw: 'jane@@example.com', error: 'invalidFormat' },
    { raw: 'jane@exa@mple.com', error: 'invalidFormat' },
    { raw: 'jane doe@example.com', error: 'invalidFormat' },
    { raw: 'jane@exa mple.com', error: 'invalidFormat' },
    { raw: 'jane\t@example.com', error: 'invalidFormat' },
    { raw: 'jane@example.com\nbcc@evil.com', error: 'invalidFormat' },
    { raw: 'jane\u0000@example.com', error: 'invalidFormat' },
    { raw: 'jane\u0007@example.com', error: 'invalidFormat' },
    { raw: 'jane@example.com\u007f', error: 'invalidFormat' },
  ])('rejects $raw with $error', ({ raw, error }) => {
    expect(EmailAddress.create(raw)).toEqual({ ok: false, error });
  });

  it('accepts an address of exactly 254 characters', () => {
    const raw = addressOfLength(MAX_LENGTH);

    expect(raw).toHaveLength(MAX_LENGTH);
    expect(createValid(raw).value).toBe(raw);
  });

  it('measures the length after trimming', () => {
    const raw = `   ${addressOfLength(MAX_LENGTH)}   `;

    expect(EmailAddress.create(raw).ok).toBe(true);
  });

  it('reports tooLong before checking the format', () => {
    expect(EmailAddress.create(`${'a'.repeat(MAX_LENGTH)} @`)).toEqual({
      ok: false,
      error: 'tooLong',
    });
  });

  it.each([
    `${'a'.repeat(240)}!`,
    `a@${'a.'.repeat(120)}!`,
    `${'a.'.repeat(120)}@a`,
    `a@${'-'.repeat(240)}`,
    'a@'.repeat(120),
  ])('validates adversarial input in linear time (no ReDoS): %#', (raw) => {
    const startedAt = performance.now();
    EmailAddress.create(raw);

    expect(performance.now() - startedAt).toBeLessThan(50);
  });
});

describe('EmailAddress.equals', () => {
  it('is true for two addresses with the same value', () => {
    expect(createValid('jane@example.com').equals(createValid('jane@example.com'))).toBe(true);
  });

  it('is true when the inputs differ only by surrounding whitespace', () => {
    expect(createValid(' jane@example.com ').equals(createValid('jane@example.com'))).toBe(true);
  });

  it('is false for different addresses', () => {
    expect(createValid('jane@example.com').equals(createValid('john@example.com'))).toBe(false);
  });
});
