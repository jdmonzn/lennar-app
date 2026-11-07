import type { ReactElement } from 'react';
import { SvgIcon, type IconProps } from './SvgIcon';

/** 24 × 24 hamburger icon for the mobile menu trigger. */
export function MenuIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon width={24} height={24} {...props}>
      <path
        d="M4 6H20M4 12H20M4 18H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </SvgIcon>
  );
}
