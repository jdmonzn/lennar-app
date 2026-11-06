import type { Result } from '../../shared/lib/result';
import type { EmailAddress } from './EmailAddress';
import type { SignupConfirmation, SignupError } from './signupTypes';

/** Port for signing a user up; implemented by the mock and GraphQL adapters. */
export interface SignupService {
  /** Signs up the given email. Expected failures resolve as `err`; aborting via `signal` cancels the request. */
  signUp(
    email: EmailAddress,
    signal?: AbortSignal,
  ): Promise<Result<SignupConfirmation, SignupError>>;
}
