import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { EmailAddress, type EmailValidationError } from '../../domain/signup/EmailAddress';
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
export function useSignupForm(service: SignupService): SignupForm {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<EmailValidationError | null>(null);
  const [status, setStatus] = useState<SignupFormStatus>({ status: 'idle' });
  const [controller, setController] = useState<AbortController | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(
    () => () => {
      controller?.abort();
    },
    [controller],
  );

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setFieldError(null);
  };
  const handleEmailBlur = () => {
    const emailResult = EmailAddress.create(email);
    setFieldError(emailResult.ok ? null : emailResult.error);
  };
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const emailResult = EmailAddress.create(email);
    if (!emailResult.ok) {
      setFieldError(emailResult.error);
      return;
    }

    isSubmittingRef.current = true;
    const requestController = new AbortController();
    setController(requestController);
    setStatus({ status: 'submitting' });

    service
      .signUp(emailResult.value, requestController.signal)
      .then((result) => {
        if (requestController.signal.aborted) return;
        if (result.ok) {
          setStatus({ status: 'success', confirmation: result.value });
        } else {
          setStatus({ status: 'error', error: result.error });
        }
      })
      .catch(() => {
        if (requestController.signal.aborted) return;
        setStatus({ status: 'error', error: { kind: 'network' } });
      })
      .finally(() => {
        isSubmittingRef.current = false;
      });
  };
  return {
    email,
    fieldError,
    status,
    handleEmailChange,
    handleEmailBlur,
    handleSubmit,
  };
}
