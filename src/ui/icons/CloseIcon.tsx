import type { ReactElement } from 'react';
import { SvgIcon, type IconProps } from './SvgIcon';

/** 24 × 24 close (X) icon for the mobile drawer. */
export function CloseIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon width={24} height={24} {...props}>
      <path
        d="M6 18L12 12M12 12L18 6M12 12L6 6M12 12L18 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </SvgIcon>
  );
}
