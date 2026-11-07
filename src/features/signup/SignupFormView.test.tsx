import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HERO_CONTENT } from '../../content/heroContent';
import type { EmailValidationError } from '../../domain/signup/EmailAddress';
import type { SignupError, SignupFormStatus } from '../../domain/signup/signupTypes';
import { SignupFormView } from './SignupFormView';
import type { SignupForm as SignupFormState } from './useSignupForm';

const CONTENT = HERO_CONTENT.signup;

function createState(overrides: Partial<SignupFormState> = {}): SignupFormState {
  return {
    email: '',
    fieldError: null,
    status: { status: 'idle' },
    handleEmailChange: vi.fn(),
    handleEmailBlur: vi.fn(),
    handleSubmit: vi.fn(),
    ...overrides,
  };
}

function renderView(overrides: Partial<SignupFormState> = {}) {
  const state = createState(overrides);
  render(<SignupFormView content={CONTENT} state={state} />);
  return {
    state,
    input: screen.getByRole('textbox', { name: CONTENT.emailLabel }),
    submitButton: screen.getByRole('button', { name: CONTENT.submitLabel }),
  };
}

function liveRegion(): Element {
  const region = document.querySelector('form > p[aria-live="polite"]');
  if (region === null) {
    throw new Error('Missing form status live region');
  }
  return region;
}

describe('SignupFormView', () => {
  it('renders a hidden-label email input with the required attributes', () => {
    const { input } = renderView();

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('inputmode', 'email');
    expect(input).toHaveAttribute('maxlength', '254');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
    expect(input).toBeRequired();
  });

  it('opts out of native validation and carries the id the CTAs link to', () => {
    renderView();
    const form = document.querySelector('form');

    expect(form).toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('id', CONTENT.formId);
  });

  it('shows the current email value', () => {
    const { input } = renderView({ email: 'jane@example.com' });

    expect(input).toHaveValue('jane@example.com');
  });

  it('reports typing and blur to the form state', async () => {
    const user = userEvent.setup();
    const { input, state } = renderView();

    await user.type(input, 'j');
    await user.tab();

    expect(state.handleEmailChange).toHaveBeenCalledWith('j');
    expect(state.handleEmailBlur).toHaveBeenCalledTimes(1);
  });

  it('hands submission to the form state', () => {
    const { state } = renderView();

    fireEvent.submit(screen.getByRole('button', { name: CONTENT.submitLabel }));

    expect(state.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it.each<EmailValidationError>(['empty', 'tooLong', 'invalidFormat'])(
    'shows the %s field error under the input and marks it invalid',
    (fieldError) => {
      const { input } = renderView({ fieldError });

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription(CONTENT.fieldErrors[fieldError]);
    },
  );

  it('has no field error by default', () => {
    const { input } = renderView();

    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('keeps the status region empty while idle', () => {
    renderView();

    expect(liveRegion()).toBeEmptyDOMElement();
  });

  it('marks the submit button busy and keeps its label while submitting', () => {
    const { submitButton } = renderView({ status: { status: 'submitting' } });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
    expect(liveRegion()).toBeEmptyDOMElement();
  });

  it('announces success', () => {
    const status: SignupFormStatus = {
      status: 'success',
      confirmation: { id: '101', email: 'jane@example.com' },
    };
    renderView({ status });

    expect(liveRegion()).toHaveTextContent(CONTENT.successMessage);
  });

  it.each<SignupError['kind']>(['network', 'timeout', 'server', 'invalidResponse'])(
    'announces the fixed %s error copy',
    (kind) => {
      renderView({ status: { status: 'error', error: { kind } } });

      expect(liveRegion()).toHaveTextContent(CONTENT.signupErrors[kind]);
    },
  );

  it('renders the helper copy with the terms of service link', () => {
    renderView();

    expect(screen.getByRole('link', { name: 'terms of service' })).toHaveAttribute(
      'href',
      CONTENT.helper.link.href,
    );
    expect(screen.getByText(/Start your free 14-day trial/)).toHaveTextContent(
      'Start your free 14-day trial, no credit card necessary. By providing your email, you agree to our terms of service.',
    );
  });
});
