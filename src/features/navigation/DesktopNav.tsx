import type { ReactElement } from 'react';
import type { NavigationContent } from '../../content/heroContent';
import { ButtonLink } from '../../ui/ButtonLink';
import { NavLink } from './NavLink';

/** Horizontal nav from `md` up: page links on the left, "Log in" and the trial CTA on the right. */
export function DesktopNav({ content }: Readonly<{ content: NavigationContent }>): ReactElement {
  return (
    <div className="hidden md:ml-10 md:flex md:flex-1 md:items-center md:justify-between">
      <div className="flex items-center gap-8">
        {content.items.map((item) => (
          <NavLink key={item.id} link={item} />
        ))}
      </div>
      <div className="flex items-center gap-6">
        <NavLink link={content.login} />
        <ButtonLink href={content.cta.href} variant="secondary" size="md">
          {content.cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
