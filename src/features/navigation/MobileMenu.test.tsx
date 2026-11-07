import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { HERO_CONTENT } from '../../content/heroContent';
import { MobileMenu } from './MobileMenu';

const CONTENT = HERO_CONTENT.navigation;

function renderMenu(isOpen: boolean, onClose = vi.fn()) {
  const ref = createRef<HTMLDivElement>();
  const view = render(
    <MobileMenu ref={ref} id="mobile-menu" isOpen={isOpen} onClose={onClose} content={CONTENT} />,
  );
  return { ...view, ref, onClose };
}

describe('MobileMenu', () => {
  it('is a modal dialog labelled by its title', () => {
    renderMenu(true);

    const dialog = screen.getByRole('dialog', { name: 'Main menu' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('id', 'mobile-menu');
  });

  it('forwards ref to the dialog element', () => {
    const { ref } = renderMenu(true);

    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  it('is interactive and slides in over 500ms when open', () => {
    renderMenu(true);
    const dialog = screen.getByRole('dialog');

    expect(dialog).not.toHaveAttribute('inert');
    expect(dialog).toHaveClass('translate-y-0', 'opacity-100', 'duration-500', 'ease-in-out');
  });

  it('stays mounted but inert, and slides out over 300ms when closed', () => {
    renderMenu(false);
    const dialog = screen.getByRole('dialog', { hidden: true });

    expect(dialog).toHaveAttribute('inert');
    expect(dialog).toHaveClass('-translate-y-full', 'opacity-0', 'duration-300');
  });

  it('animates only transform and opacity, and not under reduced motion', () => {
    renderMenu(true);

    expect(screen.getByRole('dialog')).toHaveClass(
      'transition-[translate,opacity]',
      'motion-reduce:transition-none',
    );
  });

  it('calls onClose from the close button', async () => {
    const user = userEvent.setup();
    const { onClose } = renderMenu(true);

    await user.click(screen.getByRole('button', { name: 'Close main menu' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders every navigation item as a gray-700 link', () => {
    renderMenu(true);

    for (const item of CONTENT.items) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAttribute('href', item.href);
      expect(link).toHaveClass('text-gray-700');
    }
  });

  it('renders the full-width trial CTA', () => {
    renderMenu(true);

    const cta = screen.getByRole('link', { name: 'Start free trial' });
    expect(cta).toHaveAttribute('href', CONTENT.cta.href);
    expect(cta).toHaveClass('bg-indigo-600', 'w-full');
  });

  it('renders the existing customer prompt with a login link', () => {
    renderMenu(true);

    expect(screen.getByText('Existing customer?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
      'href',
      CONTENT.mobileLogin.href,
    );
  });
});
