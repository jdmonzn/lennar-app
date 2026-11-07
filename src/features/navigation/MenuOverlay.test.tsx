import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MenuOverlay } from './MenuOverlay';

function overlayElement(container: HTMLElement): HTMLElement {
  const overlay = container.firstElementChild;
  if (!(overlay instanceof HTMLElement)) {
    throw new Error('MenuOverlay did not render an element');
  }
  return overlay;
}

describe('MenuOverlay', () => {
  it('closes the menu when the overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<MenuOverlay isOpen onClose={onClose} />);

    await user.click(overlayElement(container));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<MenuOverlay isOpen onClose={vi.fn()} />);

    expect(overlayElement(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('is a full-bleed gray-500/75 scrim', () => {
    const { container } = render(<MenuOverlay isOpen onClose={vi.fn()} />);

    expect(overlayElement(container)).toHaveClass('fixed', 'inset-0', 'bg-gray-500/75');
  });

  it('fades in over 500ms when open', () => {
    const { container } = render(<MenuOverlay isOpen onClose={vi.fn()} />);

    expect(overlayElement(container)).toHaveClass('opacity-100', 'duration-500', 'ease-in-out');
  });

  it('fades out over 300ms and ignores pointer events when closed', () => {
    const { container } = render(<MenuOverlay isOpen={false} onClose={vi.fn()} />);

    expect(overlayElement(container)).toHaveClass(
      'opacity-0',
      'duration-300',
      'pointer-events-none',
    );
  });

  it('skips the transition under reduced motion', () => {
    const { container } = render(<MenuOverlay isOpen onClose={vi.fn()} />);

    expect(overlayElement(container)).toHaveClass('motion-reduce:transition-none');
  });
});
