import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO_CONTENT } from '../../content/heroContent';
import { CalloutPill } from './CalloutPill';

const CONTENT = HERO_CONTENT.hero.callout;

describe('CalloutPill', () => {
  it('is one link combining the badge and the careers copy', () => {
    render(<CalloutPill content={CONTENT} />);

    expect(
      screen.getByRole('link', { name: "We're hiring Visit our careers page" }),
    ).toHaveAttribute('href', CONTENT.link.href);
  });

  it('renders the badge with the uppercase badge typography', () => {
    render(<CalloutPill content={CONTENT} />);

    expect(screen.getByText("We're hiring")).toHaveClass('uppercase', 'text-xs/5', 'tracking-wide');
  });

  it('uses the black 14px-radius pill with white text', () => {
    render(<CalloutPill content={CONTENT} />);

    expect(screen.getByRole('link')).toHaveClass('bg-black', 'rounded-[14px]', 'text-white');
  });

  it('keeps the chevron decorative', () => {
    const { container } = render(<CalloutPill content={CONTENT} />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
