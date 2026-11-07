import { useEffect } from 'react';

/** Prevents the page body from scrolling while `isLocked`, restoring the previous overflow afterwards. */
export function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}
