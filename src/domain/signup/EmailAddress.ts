import { err, ok, type Result } from '../../shared/lib/result';

/** Reasons a raw string cannot become an `EmailAddress`. */
export type EmailValidationError = 'empty' | 'tooLong' | 'invalidFormat';

/** A trimmed, validated email address. Instances only come from `create`, so an invalid one cannot exist. */
export class EmailAddress {
  private static readonly MAX_LENGTH = 254;
  private static readonly EMAIL_ADDRESS_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private rawValue: string;

  private constructor(raw: string) {
    this.rawValue = raw;
  }

  /** Trims and validates raw user input; never throws for any string. */
  static create(raw: string): Result<EmailAddress, EmailValidationError> {
    const sanitizedRaw = raw.trim();
    if (sanitizedRaw.length === 0) return err('empty');
    if (sanitizedRaw.length > this.MAX_LENGTH) return err('tooLong');
    if (!this.EMAIL_ADDRESS_PATTERN.test(sanitizedRaw)) return err('invalidFormat');
    return ok(new EmailAddress(raw));
  }

  /** The normalized address. */
  get value(): string {
    return this.rawValue.trim();
  }

  /** Value equality: two addresses are equal when their normalized values match. */
  equals(other: EmailAddress): boolean {
    const normalizedValue = this.value.trim();
    const otherNormalizedValue = other.value.trim();
    console.log(normalizedValue, otherNormalizedValue);
    return normalizedValue === otherNormalizedValue;
  }
}
