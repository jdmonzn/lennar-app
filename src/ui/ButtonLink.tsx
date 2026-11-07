import type { ComponentPropsWithRef, ReactElement } from 'react';
import { buttonClassName, type ButtonSize, type ButtonVariant } from './Button';

type ButtonLinkProps = Readonly<
  Omit<ComponentPropsWithRef<'a'>, 'className' | 'style' | 'href'> & {
    href: string;
    variant: ButtonVariant;
    size: ButtonSize;
    fullWidth?: boolean;
  }
>;

/** A link that looks like a `Button`, for calls to action that navigate. */
export function ButtonLink({
  variant,
  size,
  fullWidth = false,
  children,
  ...anchorProps
}: ButtonLinkProps): ReactElement {
  return (
    <a {...anchorProps} className={buttonClassName({ element: 'link', variant, size, fullWidth })}>
      {children}
    </a>
  );
}
