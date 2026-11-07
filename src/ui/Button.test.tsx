import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

describe('Button', () => {
  it('renders its label as the accessible name', () => {
    render(
      <Button variant="primary" size="lg">
        Start free trial
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Start free trial' })).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(
      <Button variant="primary" size="lg">
        Go
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit"', () => {
    render(
      <Button variant="primary" size="lg" type="submit">
        Go
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it.each<[ButtonVariant, string, string]>([
    ['primary', 'bg-indigo-500', 'enabled:hover:bg-indigo-600'],
    ['secondary', 'bg-gray-600', 'enabled:hover:bg-gray-700'],
    ['menuCta', 'bg-indigo-600', 'enabled:hover:bg-indigo-700'],
  ])('renders the %s variant with its background and hover', (variant, background, hover) => {
    render(
      <Button variant={variant} size="lg">
        Go
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass(background, hover);
  });

  it.each<[ButtonVariant, string]>([
    ['primary', 'focus-visible:ring-offset-gray-900'],
    ['secondary', 'focus-visible:ring-offset-gray-900'],
    ['menuCta', 'focus-visible:ring-offset-white'],
  ])('gives the %s variant a focus ring offset matching its surface', (variant, offset) => {
    render(
      <Button variant={variant} size="lg">
        Go
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass('focus-visible:ring-2', offset);
  });

  it.each<[ButtonSize, string]>([
    ['md', 'h-[42px]'],
    ['lg', 'h-12'],
  ])('renders the %s size at its spec height', (size, height) => {
    render(
      <Button variant="secondary" size={size}>
        Go
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass(height);
  });

  it('stretches to full width only when fullWidth is set', () => {
    const { rerender } = render(
      <Button variant="menuCta" size="lg">
        Go
      </Button>,
    );
    expect(screen.getByRole('button')).not.toHaveClass('w-full');

    rerender(
      <Button variant="menuCta" size="lg" fullWidth>
        Go
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="lg" onClick={handleClick}>
        Go
      </Button>,
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and ignores clicks when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="lg" disabled onClick={handleClick}>
        Go
      </Button>,
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled, aria-busy and keeps its label while loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="lg" isLoading onClick={handleClick}>
        Start free trial
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Start free trial' });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('omits aria-busy when not loading', () => {
    render(
      <Button variant="primary" size="lg">
        Go
      </Button>,
    );

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });

  it('forwards ref to the native button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button variant="primary" size="lg" ref={ref}>
        Go
      </Button>,
    );

    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('passes native attributes through', () => {
    render(
      <Button variant="secondary" size="md" aria-controls="mobile-menu" aria-expanded={false}>
        Menu
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });
});
