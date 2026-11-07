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

type ButtonElement = 'button' | 'link';

const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-md text-base font-medium whitespace-nowrap text-white disabled:cursor-not-allowed disabled:opacity-75';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-indigo-500 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.10)]',
    FOCUS_RING_ON_DARK,
  ),
  secondary: cn('bg-gray-600', FOCUS_RING_ON_DARK),
  menuCta: cn('bg-indigo-600 shadow-xs', FOCUS_RING_ON_LIGHT),
};

const HOVER_CLASSES: Record<ButtonElement, Record<ButtonVariant, string>> = {
  button: {
    primary: 'enabled:hover:bg-indigo-600',
    secondary: 'enabled:hover:bg-gray-700',
    menuCta: 'enabled:hover:bg-indigo-700',
  },
  link: {
    primary: 'hover:bg-indigo-600',
    secondary: 'hover:bg-gray-700',
    menuCta: 'hover:bg-indigo-700',
  },
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'h-[42px] px-[17px] py-[9px]',
  lg: 'h-12 px-4 py-3',
};

type ButtonStyleOptions = Readonly<{
  element: ButtonElement;
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
}>;

/** Class list shared by `Button` and `ButtonLink`; disabled buttons get no hover change. */
export function buttonClassName({ element, variant, size, fullWidth }: ButtonStyleOptions): string {
  return cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    HOVER_CLASSES[element][variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
  );
}

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
      className={buttonClassName({ element: 'button', variant, size, fullWidth })}
    >
      {children}
    </button>
  );
}
