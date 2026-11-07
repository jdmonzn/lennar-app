import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonLink } from './ButtonLink';

describe('ButtonLink', () => {
  it('renders a link with its label and href', () => {
    render(
      <ButtonLink href="#signup" variant="secondary" size="md">
        Start free trial
      </ButtonLink>,
    );

    expect(screen.getByRole('link', { name: 'Start free trial' })).toHaveAttribute(
      'href',
      '#signup',
    );
  });

  it('shares the button look but uses plain hover, since links cannot be :enabled', () => {
    render(
      <ButtonLink href="#signup" variant="menuCta" size="lg" fullWidth>
        Start free trial
      </ButtonLink>,
    );
    const link = screen.getByRole('link');

    expect(link).toHaveClass('bg-indigo-600', 'shadow-xs', 'h-12', 'w-full', 'hover:bg-indigo-700');
    expect(link).not.toHaveClass('enabled:hover:bg-indigo-700');
  });

  it('uses the 42px size for the nav button', () => {
    render(
      <ButtonLink href="#signup" variant="secondary" size="md">
        Start free trial
      </ButtonLink>,
    );

    expect(screen.getByRole('link')).toHaveClass('bg-gray-600', 'h-[42px]', 'hover:bg-gray-700');
  });
});
