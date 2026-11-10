import type { EmailAddress } from '../../domain/signup/EmailAddress';
import type { SignupService } from '../../domain/signup/SignupService';
import type { SignupConfirmation, SignupError } from '../../domain/signup/signupTypes';
import { assertNever } from '../../shared/lib/assertNever';
import { isRecord } from '../../shared/lib/isRecord';
import { err, ok, type Result } from '../../shared/lib/result';
import { graphqlRequest } from './graphqlRequest';
import type { GraphQLRequestError } from './graphqlTypes';

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
    }
  }
`;

type CreateUserData = Readonly<{ createUser: SignupConfirmation }>;

function isCreateUserData(data: unknown): data is CreateUserData {
  if (!isRecord(data)) return false;
  const { createUser } = data;
  return (
    isRecord(createUser) &&
    typeof createUser['id'] === 'string' &&
    typeof createUser['email'] === 'string'
  );
}

function localPartOf(email: EmailAddress): string {
  return email.value.slice(0, email.value.indexOf('@'));
}

function toSignupError(error: GraphQLRequestError): SignupError {
  switch (error.kind) {
    case 'network':
    case 'aborted':
      return { kind: 'network' };
    case 'timeout':
      return { kind: 'timeout' };
    case 'http':
    case 'graphql':
      return { kind: 'server' };
    case 'invalidResponse':
      return { kind: 'invalidResponse' };
    default:
      return assertNever(error);
  }
}

/** `SignupService` adapter that sends the `createUser` mutation to a GraphQL endpoint. */
export class GraphQLSignupService implements SignupService {
  private readonly endpoint: string;

  /** @param endpoint GraphQL endpoint URL, injected by the composition root. */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /** Creates a user whose `name` and `username` are derived from the email's local part. */
  async signUp(
    email: EmailAddress,
    signal?: AbortSignal,
  ): Promise<Result<SignupConfirmation, SignupError>> {
    const localPart = localPartOf(email);
    const result = await graphqlRequest(
      {
        endpoint: this.endpoint,
        query: CREATE_USER_MUTATION,
        variables: { input: { name: localPart, username: localPart, email: email.value } },
        signal,
      },
      isCreateUserData,
    );

    if (!result.ok) return err(toSignupError(result.error));
    const { id, email: createdEmail } = result.value.createUser;
    return ok({ id, email: createdEmail });
  }
}
