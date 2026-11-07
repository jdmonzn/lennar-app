import { err, ok, type Result } from '../../shared/lib/result';

/** Reasons a raw string cannot become an `EmailAddress`. */
export type EmailValidationError = 'empty' | 'tooLong' | 'invalidFormat';

/** A trimmed, validated email address. Instances only come from `create`, so an invalid one cannot exist. */
export class EmailAddress {
  private static readonly MAX_LENGTH = 254;
  private static readonly EMAIL_ADDRESS_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly normalizedValue: string;

  private constructor(normalizedValue: string) {
    this.normalizedValue = normalizedValue;
  }

  /** Trims and validates raw user input; never throws for any string. */
  static create(raw: string): Result<EmailAddress, EmailValidationError> {
    const trimmed = raw.trim();
    if (trimmed.length === 0) return err('empty');
    if (trimmed.length > EmailAddress.MAX_LENGTH) return err('tooLong');
    if (!EmailAddress.EMAIL_ADDRESS_PATTERN.test(trimmed)) return err('invalidFormat');
    return ok(new EmailAddress(trimmed));
  }

  /** The normalized address. */
  get value(): string {
    return this.normalizedValue;
  }

  /** Value equality: two addresses are equal when their normalized values match. */
  equals(other: EmailAddress): boolean {
    return this.normalizedValue === other.normalizedValue;
  }
}
