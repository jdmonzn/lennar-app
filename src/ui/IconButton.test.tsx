import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MenuIcon } from './icons/MenuIcon';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('is named by its visually hidden label', () => {
    render(
      <IconButton label="Open main menu" surface="dark">
        <MenuIcon />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Open main menu' })).toBeInTheDocument();
    expect(screen.getByText('Open main menu')).toHaveClass('sr-only');
  });

  it('is a 40 × 40 type="button"', () => {
    render(
      <IconButton label="Open main menu" surface="dark">
        <MenuIcon />
      </IconButton>,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('size-10');
  });

  it.each([
    { surface: 'dark', offset: 'focus-visible:ring-offset-gray-900' },
    { surface: 'light', offset: 'focus-visible:ring-offset-white' },
  ] as const)('uses the $surface focus ring offset', ({ surface, offset }) => {
    render(
      <IconButton label="Close" surface={surface}>
        <MenuIcon />
      </IconButton>,
    );

    expect(screen.getByRole('button')).toHaveClass(offset);
  });

  it('calls onClick and forwards ref and aria attributes', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton
        ref={ref}
        label="Open main menu"
        surface="dark"
        aria-expanded={false}
        aria-controls="drawer"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Open main menu' });

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'drawer');
  });
});
