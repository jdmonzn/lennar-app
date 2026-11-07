import { useEffect, useId, useRef, type ReactElement } from 'react';
import type { NavigationContent } from '../../content/heroContent';
import { cn } from '../../shared/lib/cn';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import { useEscapeKey } from '../../shared/hooks/useEscapeKey';
import { useFocusTrap } from '../../shared/hooks/useFocusTrap';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { useScrollLock } from '../../shared/hooks/useScrollLock';
import { Container } from '../../ui/Container';
import { FOCUS_RING_ON_DARK } from '../../ui/focusRing';
import { IconButton } from '../../ui/IconButton';
import { LogoMark } from '../../ui/icons/LogoMark';
import { MenuIcon } from '../../ui/icons/MenuIcon';
import { DesktopNav } from './DesktopNav';
import { MenuOverlay } from './MenuOverlay';
import { MobileMenu } from './MobileMenu';

const TABLET_UP_QUERY = '(min-width: 48rem)';

/**
 * Site header. Owns the mobile menu state and its behavior: Esc closes it, page scroll is locked and
 * focus is trapped while it is open, focus returns to the trigger, and it closes from tablet up.
 */
export function NavBar({ content }: Readonly<{ content: NavigationContent }>): ReactElement {
  const { isOpen, open, close } = useDisclosure();
  const isTabletUp = useMediaQuery(TABLET_UP_QUERY);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerId = useId();

  useEscapeKey(close, isOpen);
  useScrollLock(isOpen);
  useFocusTrap(drawerRef, isOpen, triggerRef);

  useEffect(() => {
    if (isTabletUp) {
      close();
    }
  }, [isTabletUp, close]);

  return (
    <header className="pt-6">
      <Container>
        <nav aria-label={content.label} className="flex items-center justify-between">
          <a href={content.home.href} className={cn('rounded-sm', FOCUS_RING_ON_DARK)}>
            <LogoMark
              title={content.home.label}
              className="h-8 w-[35px] text-indigo-500 md:h-10 md:w-[43.75px]"
            />
          </a>
          <DesktopNav content={content} />
          <div className="md:hidden">
            <IconButton
              ref={triggerRef}
              label={content.openMenuLabel}
              surface="dark"
              aria-expanded={isOpen}
              aria-controls={drawerId}
              onClick={open}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </nav>
      </Container>
      <MenuOverlay isOpen={isOpen} onClose={close} />
      <MobileMenu ref={drawerRef} id={drawerId} isOpen={isOpen} onClose={close} content={content} />
    </header>
  );
}
