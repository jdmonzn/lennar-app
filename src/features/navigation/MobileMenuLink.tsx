import type { ReactElement } from 'react';
import type { LinkContent } from '../../content/heroContent';
import { cn } from '../../shared/lib/cn';
import { FOCUS_RING_ON_LIGHT } from '../../ui/focusRing';
import { Text } from '../../ui/Text';

/** 40px-tall gray-700 link inside the mobile drawer. */
export function MobileMenuLink({ link }: Readonly<{ link: LinkContent }>): ReactElement {
  return (
    <a
      href={link.href}
      className={cn('block rounded-md px-3 py-2 text-gray-700', FOCUS_RING_ON_LIGHT)}
    >
      <Text as="span" variant="body">
        {link.label}
      </Text>
    </a>
  );
}
