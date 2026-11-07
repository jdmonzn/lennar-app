import { useId, type ReactElement, type Ref } from 'react';
import type { NavigationContent } from '../../content/heroContent';
import { cn } from '../../shared/lib/cn';
import { ButtonLink } from '../../ui/ButtonLink';
import { CloseIcon } from '../../ui/icons/CloseIcon';
import { LogoMark } from '../../ui/icons/LogoMark';
import { FOCUS_RING_ON_LIGHT } from '../../ui/focusRing';
import { IconButton } from '../../ui/IconButton';
import { Text } from '../../ui/Text';
import { MobileMenuLink } from './MobileMenuLink';

type MobileMenuProps = Readonly<{
  ref: Ref<HTMLDivElement>;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  content: NavigationContent;
}>;

/**
 * Mobile drawer dialog. It stays mounted so the close animation can play: it slides down and fades in
 * over 500ms, slides up and fades out over 300ms, and is `inert` while closed.
 */
export function MobileMenu({ ref, id, isOpen, onClose, content }: MobileMenuProps): ReactElement {
  const titleId = useId();

  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      inert={!isOpen}
      className={cn(
        'fixed inset-x-0 top-0 z-20 p-2 transition-[translate,opacity] ease-in-out motion-reduce:transition-none md:hidden',
        isOpen
          ? 'translate-y-0 opacity-100 duration-500'
          : '-translate-y-full opacity-0 duration-300',
      )}
    >
      <div className="rounded-lg bg-white shadow-lg ring-1 ring-black/5">
        <h2 id={titleId} className="sr-only">
          {content.menuTitle}
        </h2>
        <div className="flex h-14 items-center justify-between px-5 pt-4">
          <LogoMark className="h-8 w-[35px] text-indigo-500" />
          <IconButton label={content.closeMenuLabel} surface="light" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex flex-col gap-6 pt-5 pb-6">
          <div className="flex flex-col gap-1 px-2">
            {content.items.map((item) => (
              <MobileMenuLink key={item.id} link={item} />
            ))}
          </div>
          <div className="px-5">
            <ButtonLink href={content.cta.href} variant="menuCta" size="lg" fullWidth>
              {content.cta.label}
            </ButtonLink>
          </div>
          <p className="flex justify-center gap-1 px-5 text-gray-500">
            <Text as="span" variant="nav">
              {content.existingCustomerPrompt}
            </Text>{' '}
            <a
              href={content.mobileLogin.href}
              className={cn('rounded-sm text-gray-900', FOCUS_RING_ON_LIGHT)}
            >
              <Text as="span" variant="nav">
                {content.mobileLogin.label}
              </Text>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
