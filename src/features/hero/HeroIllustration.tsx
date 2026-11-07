import type { ReactElement } from 'react';
import heroIllustrationUrl from '../../assets/images/hero-illustration.svg';

/** Decorative 626 × 624 illustration that scales with its column; explicit size prevents layout shift. */
export function HeroIllustration(): ReactElement {
  return (
    <div className="overflow-clip">
      <img
        src={heroIllustrationUrl}
        alt=""
        width={626}
        height={624}
        decoding="async"
        className="h-auto w-full"
      />
    </div>
  );
}
