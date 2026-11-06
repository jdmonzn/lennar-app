import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import type { EmailAddress } from '../../domain/signup/EmailAddress';
import type { SignupService } from '../../domain/signup/SignupService';
import type {
  SignupConfirmation,
  SignupError,
  SignupFormStatus,
} from '../../domain/signup/signupTypes';
import { assertNever } from '../../shared/lib/assertNever';
import { err, ok, type Result } from '../../shared/lib/result';
import { useSignupForm } from './useSignupForm';

type SignupCall = Readonly<{
  email: EmailAddress;
  signal: AbortSignal | undefined;
  resolve: (result: Result<SignupConfirmation, SignupError>) => void;
}>;

function createControlledService(): Readonly<{ service: SignupService; calls: Array<SignupCall> }> {
  const calls: Array<SignupCall> = [];
  const service: SignupService = {
    signUp: (email, signal) =>
      new Promise((resolve) => {
        calls.push({ email, signal, resolve });
      }),
  };
  return { service, calls };
}

function describeStatus(status: SignupFormStatus): string {
  switch (status.status) {
    case 'idle':
      return 'idle';
    case 'submitting':
      return 'submitting';
    case 'success':
      return `success:${status.confirmation.id}`;
    case 'error':
      return `error:${status.error.kind}`;
    default:
      return assertNever(status);
  }
}

function SignupHarness({ service }: Readonly<{ service: SignupService }>): ReactElement {
  const { email, fieldError, status, handleEmailChange, handleEmailBlur, handleSubmit } =
    useSignupForm(service);

  return (
    <form aria-label="Sign up" noValidate onSubmit={handleSubmit}>
      <input
        aria-label="Email"
        value={email}
        onChange={(event) => {
          handleEmailChange(event.target.value);
        }}
        onBlur={handleEmailBlur}
      />
      <button type="submit">Submit</button>
      <p data-testid="field-error">{fieldError ?? 'none'}</p>
      <p data-testid="status">{describeStatus(status)}</p>
    </form>
  );
}

function renderForm() {
  const controlled = createControlledService();
  const user = userEvent.setup();
  const view = render(<SignupHarness service={controlled.service} />);
  return {
    ...controlled,
    ...view,
    user,
    input: screen.getByRole('textbox', { name: 'Email' }),
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    fieldError: () => screen.getByTestId('field-error').textContent,
    status: () => screen.getByTestId('status').textContent,
  };
}

const CONFIRMATION: SignupConfirmation = { id: '101', email: 'jane@example.com' };

describe('useSignupForm', () => {
  it('starts with an empty email, no field error and an idle status', () => {
    const { input, fieldError, status } = renderForm();

    expect(input).toHaveValue('');
    expect(fieldError()).toBe('none');
    expect(status()).toBe('idle');
  });

  it('reflects what the user types', async () => {
    const { user, input } = renderForm();

    await user.type(input, 'jane@example.com');

    expect(input).toHaveValue('jane@example.com');
  });

  it('shows invalidFormat on blur when the email is malformed', async () => {
    const { user, input, fieldError } = renderForm();

    await user.type(input, 'not-an-email');
    await user.tab();

    expect(fieldError()).toBe('invalidFormat');
  });

  it('shows no field error on blur when the email is valid', async () => {
    const { user, input, fieldError } = renderForm();

    await user.type(input, 'jane@example.com');
    await user.tab();

    expect(fieldError()).toBe('none');
  });

  it('clears the field error when the user edits the email', async () => {
    const { user, input, fieldError } = renderForm();
    await user.type(input, 'not-an-email');
    await user.tab();
    expect(fieldError()).toBe('invalidFormat');

    await user.type(input, 'x');

    expect(fieldError()).toBe('none');
  });

  it('prevents the native form submission', () => {
    renderForm();

    const isNotPrevented = fireEvent.submit(screen.getByRole('form', { name: 'Sign up' }));

    expect(isNotPrevented).toBe(false);
  });

  it.each([
    { typed: '', expectedError: 'empty' },
    { typed: '   ', expectedError: 'empty' },
    { typed: 'jane@', expectedError: 'invalidFormat' },
  ])(
    'shows $expectedError and does not call the service when submitting "$typed"',
    async ({ typed, expectedError }) => {
      const { user, input, submitButton, calls, fieldError, status } = renderForm();

      if (typed !== '') {
        await user.type(input, typed);
      }
      await user.click(submitButton);

      expect(fieldError()).toBe(expectedError);
      expect(calls).toHaveLength(0);
      expect(status()).toBe('idle');
    },
  );

  it('submits the trimmed EmailAddress with an abort signal and shows submitting', async () => {
    const { user, input, submitButton, calls, status } = renderForm();

    await user.type(input, '  jane@example.com  ');
    await user.click(submitButton);

    expect(status()).toBe('submitting');
    expect(calls).toHaveLength(1);
    expect(calls[0]?.email.value).toBe('jane@example.com');
    expect(calls[0]?.signal).toBeInstanceOf(AbortSignal);
    expect(calls[0]?.signal?.aborted).toBe(false);
  });

  it('shows success with the confirmation when the service succeeds', async () => {
    const { user, input, submitButton, calls, status } = renderForm();
    await user.type(input, 'jane@example.com');
    await user.click(submitButton);

    await act(async () => {
      calls[0]?.resolve(ok(CONFIRMATION));
      await Promise.resolve();
    });

    expect(status()).toBe('success:101');
  });

  it.each<SignupError['kind']>(['network', 'timeout', 'server', 'invalidResponse'])(
    'shows the %s error when the service fails',
    async (kind) => {
      const { user, input, submitButton, calls, status } = renderForm();
      await user.type(input, 'jane@example.com');
      await user.click(submitButton);

      await act(async () => {
        calls[0]?.resolve(err({ kind }));
        await Promise.resolve();
      });

      expect(status()).toBe(`error:${kind}`);
    },
  );

  it('blocks double submits while a request is in flight', async () => {
    const { user, input, submitButton, calls } = renderForm();
    await user.type(input, 'jane@example.com');

    await user.click(submitButton);
    await user.click(submitButton);
    await user.type(input, '{Enter}');

    expect(calls).toHaveLength(1);
  });

  it('allows a new submission after an error', async () => {
    const { user, input, submitButton, calls, status } = renderForm();
    await user.type(input, 'jane@example.com');
    await user.click(submitButton);
    await act(async () => {
      calls[0]?.resolve(err({ kind: 'network' }));
      await Promise.resolve();
    });

    await user.click(submitButton);

    expect(calls).toHaveLength(2);
    expect(status()).toBe('submitting');
  });

  it('aborts the in-flight request on unmount', async () => {
    const { user, input, submitButton, calls, unmount } = renderForm();
    await user.type(input, 'jane@example.com');
    await user.click(submitButton);

    unmount();

    expect(calls[0]?.signal?.aborted).toBe(true);
  });
});
