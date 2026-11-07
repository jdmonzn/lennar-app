import type { ReactElement } from 'react';
import type { SignupContent } from '../../content/heroContent';
import { SignupFormView } from './SignupFormView';
import { useSignupForm } from './useSignupForm';
import { useSignupService } from './SignupServiceContext';

/** Connects the signup form markup to `useSignupForm` and the injected `SignupService`. */
export function SignupForm({ content }: Readonly<{ content: SignupContent }>): ReactElement {
  const service = useSignupService();
  const state = useSignupForm(service);

  return <SignupFormView content={content} state={state} />;
}
