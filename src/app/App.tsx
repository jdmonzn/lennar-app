import type { ReactElement } from 'react';
import { HERO_CONTENT } from '../content/heroContent';
import { Hero } from '../features/hero/Hero';
import { NavBar } from '../features/navigation/NavBar';
import { SignupForm } from '../features/signup/SignupForm';
import { SignupServiceProvider } from '../features/signup/SignupServiceContext';
import { MockSignupService } from '../infrastructure/mock/MockSignupService';

const signupService = new MockSignupService();

/** Composition root: picks the concrete `SignupService` and hands copy down to the page sections. */
export function App(): ReactElement {
  return (
    <SignupServiceProvider service={signupService}>
      <NavBar content={HERO_CONTENT.navigation} />
      <main>
        <Hero
          content={HERO_CONTENT.hero}
          signupForm={<SignupForm content={HERO_CONTENT.signup} />}
        />
      </main>
    </SignupServiceProvider>
  );
}
