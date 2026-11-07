import type { ReactElement, ReactNode } from 'react';

/** Hides content visually while keeping it available to assistive technology. */
export function VisuallyHidden({ children }: Readonly<{ children: ReactNode }>): ReactElement {
  return <span className="sr-only">{children}</span>;
}
