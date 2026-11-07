import type { ReactElement, ReactNode } from 'react';

/** Elements `Text` may render. */
export type TextElement = 'h1' | 'h2' | 'p' | 'span';

/** Typographic roles from the design spec. */
export type TextVariant = 'display' | 'bodyLarge' | 'body' | 'nav' | 'helper' | 'badge';

type TextProps = Readonly<{
  as: TextElement;
  variant: TextVariant;
  children: ReactNode;
}>;

const VARIANT_CLASSES: Record<TextVariant, string> = {
  display:
    'text-4xl font-extrabold tracking-tight text-white md:text-5xl md:tracking-[-0.04em] lg:text-6xl lg:tracking-tight xl:text-7xl xl:tracking-normal',
  bodyLarge: 'text-base text-gray-300 md:text-lg lg:text-xl xl:text-2xl/7',
  body: 'text-base',
  nav: 'text-base font-medium',
  helper: 'text-sm text-gray-300',
  badge: 'text-xs/5 font-medium tracking-wide uppercase',
};

/**
 * Typography primitive. Variants carry the responsive size, weight and tracking; `display`,
 * `bodyLarge` and `helper` also carry their single spec color, the others inherit color from context.
 */
export function Text({ as: Element, variant, children }: TextProps): ReactElement {
  return <Element className={VARIANT_CLASSES[variant]}>{children}</Element>;
}
