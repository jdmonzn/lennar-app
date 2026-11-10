import type { ReactElement } from 'react';
import { HERO_CONTENT } from '../content/heroContent';
import { Hero } from '../features/hero/Hero';
import { NavBar } from '../features/navigation/NavBar';
import { SignupForm } from '../features/signup/SignupForm';
import { SignupServiceProvider } from '../features/signup/SignupServiceContext';
import { GraphQLSignupService } from '../infrastructure/graphql/GraphQLSignupService';

const DEFAULT_GRAPHQL_ENDPOINT = 'https://graphqlzero.almansi.me/api';

const signupService = new GraphQLSignupService(
  import.meta.env.VITE_GRAPHQL_ENDPOINT ?? DEFAULT_GRAPHQL_ENDPOINT,
);

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
