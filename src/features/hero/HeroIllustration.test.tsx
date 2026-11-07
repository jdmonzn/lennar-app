import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroIllustration } from './HeroIllustration';

function imageElement(container: HTMLElement): HTMLImageElement {
  const image = container.querySelector('img');
  if (image === null) {
    throw new Error('HeroIllustration did not render an image');
  }
  return image;
}

describe('HeroIllustration', () => {
  it('is decorative', () => {
    const { container } = render(<HeroIllustration />);

    expect(imageElement(container)).toHaveAttribute('alt', '');
  });

  it('declares its intrinsic size to avoid layout shift', () => {
    const { container } = render(<HeroIllustration />);
    const image = imageElement(container);

    expect(image).toHaveAttribute('width', '626');
    expect(image).toHaveAttribute('height', '624');
    expect(image).toHaveClass('w-full', 'h-auto');
  });

  it('decodes asynchronously and is not lazy-loaded', () => {
    const { container } = render(<HeroIllustration />);
    const image = imageElement(container);

    expect(image).toHaveAttribute('decoding', 'async');
    expect(image).not.toHaveAttribute('loading', 'lazy');
  });

  it('clips overflow in its container', () => {
    const { container } = render(<HeroIllustration />);

    expect(container.firstElementChild).toHaveClass('overflow-clip');
  });
});
