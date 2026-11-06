import type { Result } from '../../shared/lib/result';

/** Reasons a raw string cannot become an `EmailAddress`. */
export type EmailValidationError = 'empty' | 'tooLong' | 'invalidFormat';

/** A trimmed, validated email address. Instances only come from `create`, so an invalid one cannot exist. */
export class EmailAddress {
  private constructor() {
    throw new Error('Not implemented: EmailAddress (human-owned)');
  }

  /** Trims and validates raw user input; never throws for any string. */
  static create(_raw: string): Result<EmailAddress, EmailValidationError> {
    throw new Error('Not implemented: EmailAddress.create (human-owned)');
  }

  /** The normalized address. */
  get value(): string {
    throw new Error('Not implemented: EmailAddress.value (human-owned)');
  }

  /** Value equality: two addresses are equal when their normalized values match. */
  equals(_other: EmailAddress): boolean {
    throw new Error('Not implemented: EmailAddress.equals (human-owned)');
  }
}
