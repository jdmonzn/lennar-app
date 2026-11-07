import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { cn } from '../shared/lib/cn';
import { FOCUS_RING_ON_DARK, FOCUS_RING_ON_LIGHT } from './focusRing';
import { VisuallyHidden } from './VisuallyHidden';

/** Background the button sits on, which decides the focus ring offset color. */
export type IconButtonSurface = 'dark' | 'light';

type IconButtonProps = Readonly<
  Omit<ComponentPropsWithRef<'button'>, 'className' | 'style' | 'children' | 'aria-label'> & {
    label: string;
    surface: IconButtonSurface;
    children: ReactNode;
  }
>;

const SURFACE_CLASSES: Record<IconButtonSurface, string> = {
  dark: FOCUS_RING_ON_DARK,
  light: FOCUS_RING_ON_LIGHT,
};

/** 40 × 40 icon-only button with a visually hidden text label. */
export function IconButton({
  label,
  surface,
  type = 'button',
  children,
  ...buttonProps
}: IconButtonProps): ReactElement {
  return (
    <button
      {...buttonProps}
      type={type}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-md text-gray-400',
        SURFACE_CLASSES[surface],
      )}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </button>
  );
}
