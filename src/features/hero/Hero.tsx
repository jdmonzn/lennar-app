import type { ReactElement, ReactNode } from 'react';
import type { HeroSectionContent } from '../../content/heroContent';
import { Container } from '../../ui/Container';
import { Text } from '../../ui/Text';
import { CalloutPill } from './CalloutPill';
import { HeroIllustration } from './HeroIllustration';

type HeroProps = Readonly<{
  content: HeroSectionContent;
  signupForm: ReactNode;
}>;

/** Hero section: callout, display heading, supporting copy and the signup form beside the illustration. */
export function Hero({ content, signupForm }: HeroProps): ReactElement {
  return (
    <section className="pt-10 pb-14 md:pt-8">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          <div className="md:py-24">
            <CalloutPill content={content.callout} />
            <div className="mt-4 md:mt-6">
              <Text as="h1" variant="display">
                <span className="block">{content.heading.lead}</span>{' '}
                <span className="block text-indigo-400">{content.heading.highlight}</span>
              </Text>
            </div>
            <div className="mt-3 md:mt-5">
              <Text as="p" variant="bodyLarge">
                {content.body}
              </Text>
            </div>
            <div className="mt-10 md:mt-12">{signupForm}</div>
          </div>
          <HeroIllustration />
        </div>
      </Container>
    </section>
  );
}
