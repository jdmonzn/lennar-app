import { useId, type ReactElement, type ReactNode } from 'react';

/** Props shared by every icon: an optional `title` makes it a labeled image, otherwise it is decorative. */
export type IconProps = Readonly<{
  title?: string;
  className?: string;
}>;

type SvgIconProps = IconProps &
  Readonly<{
    width: number;
    height: number;
    children: ReactNode;
  }>;

/** Renders an inline SVG that is `aria-hidden` by default, or a labeled `img` when given a `title`. */
export function SvgIcon({ title, className, width, height, children }: SvgIconProps): ReactElement {
  const titleId = useId();
  const isLabeled = title !== undefined && title !== '';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      fill="none"
      className={className}
      role={isLabeled ? 'img' : undefined}
      aria-labelledby={isLabeled ? titleId : undefined}
      aria-hidden={isLabeled ? undefined : true}
    >
      {isLabeled && <title id={titleId}>{title}</title>}
      {children}
    </svg>
  );
}
