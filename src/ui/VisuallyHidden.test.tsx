import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('keeps its content in the accessibility tree', () => {
    render(
      <button type="button">
        <VisuallyHidden>Open main menu</VisuallyHidden>
      </button>,
    );

    expect(screen.getByRole('button', { name: 'Open main menu' })).toBeInTheDocument();
  });

  it('hides its content visually with the sr-only utility', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);

    expect(screen.getByText('Hidden text')).toHaveClass('sr-only');
  });
});
