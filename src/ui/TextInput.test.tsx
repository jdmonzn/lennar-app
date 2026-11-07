import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('associates the visible label with the input', () => {
    render(<TextInput label="Email address" />);

    expect(screen.getByLabelText('Email address')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByText('Email address')).toBeVisible();
  });

  it('keeps a hidden label as the accessible name but renders it visually hidden', () => {
    render(<TextInput label="Email address" isLabelHidden />);

    expect(screen.getByRole('textbox', { name: 'Email address' })).toBeInTheDocument();
    expect(screen.getByText('Email address').closest('.sr-only')).not.toBeNull();
  });

  it('is not marked invalid and has no description without an error', () => {
    render(<TextInput label="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('marks the input invalid and describes it with the error message', () => {
    render(<TextInput label="Email" error="Enter a valid email address." />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email address.');
  });

  it('treats an empty error string as no error', () => {
    render(<TextInput label="Email" error="" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
  });

  it('announces errors through a polite live region that exists before the error appears', () => {
    const { rerender } = render(<TextInput label="Email" />);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeEmptyDOMElement();

    rerender(<TextInput label="Email" error="Enter a valid email address." />);

    expect(document.querySelector('[aria-live="polite"]')).toBe(liveRegion);
    expect(liveRegion).toHaveTextContent('Enter a valid email address.');
  });

  it('keeps a caller-provided description alongside the error', () => {
    render(
      <>
        <p id="email-help">We never share your email.</p>
        <TextInput label="Email" aria-describedby="email-help" error="Required." />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'We never share your email. Required.',
    );
  });

  it('generates distinct ids for separate inputs', () => {
    render(
      <>
        <TextInput label="First" />
        <TextInput label="Second" />
      </>,
    );

    expect(screen.getByLabelText('First').id).not.toBe(screen.getByLabelText('Second').id);
  });

  it('uses a caller-provided id', () => {
    render(<TextInput label="Email" id="signup-email" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'signup-email');
  });

  it('passes native attributes through and accepts typing', async () => {
    const user = userEvent.setup();
    render(
      <TextInput
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        placeholder="Enter your email"
        required
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });

    await user.type(input, 'jane@example.com');

    expect(input).toHaveValue('jane@example.com');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('inputmode', 'email');
    expect(input).toHaveAttribute('maxlength', '254');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
    expect(input).toBeRequired();
  });

  it('forwards ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput label="Email" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });
});
