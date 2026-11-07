import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO_CONTENT } from '../../content/heroContent';
import { DesktopNav } from './DesktopNav';

const CONTENT = HERO_CONTENT.navigation;

describe('DesktopNav', () => {
  it('renders every navigation item as a link', () => {
    render(<DesktopNav content={CONTENT} />);

    for (const item of CONTENT.items) {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
  });

  it('renders the log in link and the trial CTA', () => {
    render(<DesktopNav content={CONTENT} />);

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
      'href',
      CONTENT.login.href,
    );
    expect(screen.getByRole('link', { name: 'Start free trial' })).toHaveAttribute(
      'href',
      CONTENT.cta.href,
    );
  });

  it('styles nav links white with a gray-300 hover', () => {
    render(<DesktopNav content={CONTENT} />);

    expect(screen.getByRole('link', { name: 'Product' })).toHaveClass(
      'text-white',
      'hover:text-gray-300',
    );
  });

  it('only shows from md up', () => {
    const { container } = render(<DesktopNav content={CONTENT} />);

    expect(container.firstElementChild).toHaveClass('hidden', 'md:flex');
  });
});
