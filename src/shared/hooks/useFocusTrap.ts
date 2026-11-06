import type { RefObject } from 'react';

/**
 * While `isActive`, moves focus into the container and keeps Tab / Shift+Tab cycling inside it.
 * On deactivation, returns focus to `returnFocusRef` when one is given.
 */
export function useFocusTrap(
  _containerRef: RefObject<HTMLElement | null>,
  _isActive: boolean,
  _returnFocusRef?: RefObject<HTMLElement | null>,
): void {
  throw new Error('Not implemented: useFocusTrap (human-owned)');
}
