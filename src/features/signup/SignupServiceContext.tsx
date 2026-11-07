import { createContext, use, type ReactElement, type ReactNode } from 'react';
import type { SignupService } from '../../domain/signup/SignupService';

const SignupServiceContext = createContext<SignupService | null>(null);

type SignupServiceProviderProps = Readonly<{ service: SignupService; children: ReactNode }>;

/** Injects the concrete `SignupService` chosen by the composition root. */
export function SignupServiceProvider({
  service,
  children,
}: SignupServiceProviderProps): ReactElement {
  return <SignupServiceContext value={service}>{children}</SignupServiceContext>;
}

/** Returns the injected `SignupService`; throws when used outside `SignupServiceProvider`. */
export function useSignupService(): SignupService {
  const service = use(SignupServiceContext);
  if (service === null) {
    throw new Error('useSignupService must be used inside a SignupServiceProvider');
  }
  return service;
}
