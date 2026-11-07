import type { ReactElement } from 'react';
import { cn } from '../../shared/lib/cn';

type MenuOverlayProps = Readonly<{ isOpen: boolean; onClose: () => void }>;

/**
 * Full-bleed gray-500/75 scrim behind the mobile drawer; tapping it closes the menu.
 * Hidden from assistive technology: keyboard users close the menu with Esc or the close button.
 */
export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps): ReactElement {
  return (
    <div
      aria-hidden="true"
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-10 bg-gray-500/75 transition-opacity ease-in-out motion-reduce:transition-none md:hidden',
        isOpen ? 'opacity-100 duration-500' : 'pointer-events-none opacity-0 duration-300',
      )}
    />
  );
}
