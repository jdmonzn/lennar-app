import type { EmailAddress } from '../../domain/signup/EmailAddress';
import type { SignupService } from '../../domain/signup/SignupService';
import type { SignupConfirmation, SignupError } from '../../domain/signup/signupTypes';
import { err, ok, type Result } from '../../shared/lib/result';

const DEFAULT_DELAY_MS = 800;

/** In-memory `SignupService` that always succeeds after a short delay; aborting resolves with a network error. */
export class MockSignupService implements SignupService {
  readonly #delayMs: number;

  /** @param delayMs Simulated network latency. */
  constructor(delayMs: number = DEFAULT_DELAY_MS) {
    this.#delayMs = delayMs;
  }

  /** Resolves with a confirmation for `email` once the delay has elapsed. */
  signUp(
    email: EmailAddress,
    signal?: AbortSignal,
  ): Promise<Result<SignupConfirmation, SignupError>> {
    return new Promise((resolve) => {
      if (signal?.aborted) {
        resolve(err({ kind: 'network' }));
        return;
      }

      const handleAbort = (): void => {
        clearTimeout(timeoutId);
        resolve(err({ kind: 'network' }));
      };

      const timeoutId = setTimeout(() => {
        signal?.removeEventListener('abort', handleAbort);
        resolve(ok({ id: crypto.randomUUID(), email: email.value }));
      }, this.#delayMs);

      signal?.addEventListener('abort', handleAbort, { once: true });
    });
  }
}
