import type { EmailAddress } from '../../domain/signup/EmailAddress';
import type { SignupService } from '../../domain/signup/SignupService';
import type { SignupConfirmation, SignupError } from '../../domain/signup/signupTypes';
import type { Result } from '../../shared/lib/result';

/** `SignupService` adapter that sends the `createUser` mutation to a GraphQL endpoint. */
export class GraphQLSignupService implements SignupService {
  /** @param _endpoint GraphQL endpoint URL, injected by the composition root. */
  constructor(_endpoint: string) {
    throw new Error('Not implemented: GraphQLSignupService (human-owned)');
  }

  /** Creates a user whose `name` and `username` are derived from the email's local part. */
  signUp(
    _email: EmailAddress,
    _signal?: AbortSignal,
  ): Promise<Result<SignupConfirmation, SignupError>> {
    throw new Error('Not implemented: GraphQLSignupService.signUp (human-owned)');
  }
}
