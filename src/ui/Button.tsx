import type { ComponentPropsWithRef, ReactElement } from 'react';
import { cn } from '../shared/lib/cn';
import { FOCUS_RING_ON_DARK, FOCUS_RING_ON_LIGHT } from './focusRing';

/** `primary` = indigo-500 submit, `secondary` = gray-600 nav, `menuCta` = indigo-600 drawer CTA. */
export type ButtonVariant = 'primary' | 'secondary' | 'menuCta';

/** `md` = 42px nav button, `lg` = 48px. */
export type ButtonSize = 'md' | 'lg';

type ButtonProps = Readonly<
  Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> & {
    variant: ButtonVariant;
    size: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
  }
>;

const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-md text-base font-medium whitespace-nowrap text-white disabled:cursor-not-allowed disabled:opacity-75';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-indigo-500 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.10)] enabled:hover:bg-indigo-600',
    FOCUS_RING_ON_DARK,
  ),
  secondary: cn('bg-gray-600 enabled:hover:bg-gray-700', FOCUS_RING_ON_DARK),
  menuCta: cn('bg-indigo-600 shadow-xs enabled:hover:bg-indigo-700', FOCUS_RING_ON_LIGHT),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-[42px] px-[17px] py-[9px]',
  lg: 'h-12 px-4 py-3',
};

/** Base button. While `isLoading` it is disabled and `aria-busy`, and keeps its label. */
export function Button({
  variant,
  size,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  children,
  ...buttonProps
}: ButtonProps): ReactElement {
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
      )}
    >
      {children}
    </button>
  );
}
