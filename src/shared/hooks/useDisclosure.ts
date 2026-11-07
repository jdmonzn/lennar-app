import { useState, useCallback } from 'react';

/** Open/closed state plus stable handlers to change it. */
export type Disclosure = Readonly<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}>;

/** Tracks whether something (a menu, a dialog) is open. Handlers keep the same identity across renders. */
export function useDisclosure(initialOpen?: boolean): Disclosure {
  const [isOpen, setIsOpen] = useState(initialOpen ?? false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  const toggle = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
