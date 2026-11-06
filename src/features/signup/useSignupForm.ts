import type { SubmitEvent } from 'react';
import type { EmailValidationError } from '../../domain/signup/EmailAddress';
import type { SignupService } from '../../domain/signup/SignupService';
import type { SignupFormStatus } from '../../domain/signup/signupTypes';

/** State and handlers the signup form binds to. */
export type SignupForm = Readonly<{
  email: string;
  fieldError: EmailValidationError | null;
  status: SignupFormStatus;
  handleEmailChange: (value: string) => void;
  handleEmailBlur: () => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}>;

/**
 * Drives the email signup form: validates on blur and submit through `EmailAddress`,
 * blocks double submits, and aborts an in-flight request on unmount.
 */
export function useSignupForm(_service: SignupService): SignupForm {
  throw new Error('Not implemented: useSignupForm (human-owned)');
}
