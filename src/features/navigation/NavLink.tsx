import type { ReactElement } from 'react';
import type { LinkContent } from '../../content/heroContent';
import { cn } from '../../shared/lib/cn';
import { FOCUS_RING_ON_DARK } from '../../ui/focusRing';
import { Text } from '../../ui/Text';

/** White navbar link that turns gray-300 on hover. */
export function NavLink({ link }: Readonly<{ link: LinkContent }>): ReactElement {
  return (
    <a
      href={link.href}
      className={cn('rounded-sm text-white hover:text-gray-300', FOCUS_RING_ON_DARK)}
    >
      <Text as="span" variant="nav">
        {link.label}
      </Text>
    </a>
  );
}
