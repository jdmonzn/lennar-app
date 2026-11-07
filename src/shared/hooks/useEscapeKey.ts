import { useEffect } from 'react';
/** Calls the latest `onEscape` whenever Escape is pressed while `isActive` is true. */
export function useEscapeKey(onEscape: () => void, isActive: boolean): void {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onEscape, isActive]);
}
