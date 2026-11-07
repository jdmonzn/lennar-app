import type { ReactElement, ReactNode } from 'react';

/** Centered 1280px max-width layout container: 16px side padding on mobile, 32px from `md` up. */
export function Container({ children }: Readonly<{ children: ReactNode }>): ReactElement {
  return <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8">{children}</div>;
}
