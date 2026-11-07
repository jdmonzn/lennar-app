import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('renders its children', () => {
    render(<Container>Content</Container>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('centers a 1280px max-width box with 16px mobile and 32px md padding', () => {
    render(<Container>Content</Container>);

    expect(screen.getByText('Content')).toHaveClass(
      'mx-auto',
      'w-full',
      'max-w-[1280px]',
      'px-4',
      'md:px-8',
    );
  });
});
