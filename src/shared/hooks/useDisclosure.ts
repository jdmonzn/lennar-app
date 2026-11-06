/** Open/closed state plus stable handlers to change it. */
export type Disclosure = Readonly<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}>;

/** Tracks whether something (a menu, a dialog) is open. Handlers keep the same identity across renders. */
export function useDisclosure(_initialOpen?: boolean): Disclosure {
  throw new Error('Not implemented: useDisclosure (human-owned)');
}
