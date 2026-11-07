import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 *
 * @param container - The container element to get the focusable elements from.
 * @returns A ReadOnly array of focusable elements.
 */
function getFocusableElements(container: HTMLElement): ReadonlyArray<HTMLElement> {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex], :not([disabled])',
  );
  const focusableElementsArray = Array.from(focusableElements).filter(
    (element) => element.tabIndex >= 0,
  );
  return focusableElementsArray;
}

/**
 * While `isActive`, moves focus into the container and keeps Tab / Shift+Tab cycling inside it.
 * On deactivation, returns focus to `returnFocusRef` when one is given.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  returnFocusRef?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;
    const returnFocusElement = returnFocusRef?.current;
    const focusableElements = getFocusableElements(container);

    const firstFocusableElement = focusableElements.at(0);
    firstFocusableElement?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const firstFocus = focusableElements.at(0);
      const lastFocus = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstFocus) {
        event.preventDefault();
        lastFocus?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocus) {
        event.preventDefault();
        firstFocus?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (returnFocusElement) returnFocusElement.focus();
    };
  }, [containerRef, isActive, returnFocusRef]);
}
