import type { ReactElement } from 'react';
import type { CalloutContent } from '../../content/heroContent';
import { cn } from '../../shared/lib/cn';
import { ChevronRightIcon } from '../../ui/icons/ChevronRightIcon';
import { FOCUS_RING_ON_DARK } from '../../ui/focusRing';
import { Text } from '../../ui/Text';

/** Black pill linking to the careers page, with an indigo "We're hiring" badge. */
export function CalloutPill({ content }: Readonly<{ content: CalloutContent }>): ReactElement {
  return (
    <a
      href={content.link.href}
      className={cn(
        'inline-flex items-center gap-4 rounded-[14px] bg-black py-1 pr-2 pl-1 text-white',
        FOCUS_RING_ON_DARK,
      )}
    >
      <span className="flex rounded-[10px] bg-indigo-500 px-3 py-0.5">
        <Text as="span" variant="badge">
          {content.badge}
        </Text>
      </span>{' '}
      <span className="flex items-center gap-2">
        <Text as="span" variant="helper">
          {content.link.label}
        </Text>
        <ChevronRightIcon className="size-5 text-gray-500" />
      </span>
    </a>
  );
}
