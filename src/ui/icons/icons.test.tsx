import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';
import { ChevronRightIcon } from './ChevronRightIcon';
import { CloseIcon } from './CloseIcon';
import { LogoMark } from './LogoMark';
import { MenuIcon } from './MenuIcon';
import type { IconProps } from './SvgIcon';

const ICONS: ReadonlyArray<
  Readonly<{ name: string; Icon: ComponentType<IconProps>; size: string }>
> = [
  { name: 'LogoMark', Icon: LogoMark, size: '0 0 44 40' },
  { name: 'MenuIcon', Icon: MenuIcon, size: '0 0 24 24' },
  { name: 'CloseIcon', Icon: CloseIcon, size: '0 0 24 24' },
  { name: 'ChevronRightIcon', Icon: ChevronRightIcon, size: '0 0 20 20' },
];

describe.each(ICONS)('$name', ({ Icon, size }) => {
  it('is hidden from assistive technology by default', () => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('becomes a labeled image when given a title', () => {
    render(<Icon title="Your Company" />);
    const image = screen.getByRole('img', { name: 'Your Company' });

    expect(image).not.toHaveAttribute('aria-hidden');
  });

  it('keeps the original viewBox', () => {
    const { container } = render(<Icon />);

    expect(container.querySelector('svg')).toHaveAttribute('viewBox', size);
  });

  it('paints only with currentColor', () => {
    const { container } = render(<Icon />);

    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(container.innerHTML).toContain('currentColor');
  });

  it('accepts a className for sizing and color', () => {
    const { container } = render(<Icon className="h-8 w-auto text-indigo-500" />);

    expect(container.querySelector('svg')).toHaveClass('h-8', 'w-auto', 'text-indigo-500');
  });
});
