import type { EmailValidationError } from '../domain/signup/EmailAddress';
import type { SignupError } from '../domain/signup/signupTypes';

/** The only URL shapes the page links to; rules out `javascript:` and other schemes at compile time. */
export type SafeHref = `#${string}` | `/${string}` | `https://${string}`;

/** A labeled link. */
export type LinkContent = Readonly<{ label: string; href: SafeHref }>;

/** A navigation entry with a stable id for React keys. */
export type NavItem = Readonly<{ id: string; label: string; href: SafeHref }>;

/** Copy and links for the navbar and the mobile menu. */
export type NavigationContent = Readonly<{
  label: string;
  home: LinkContent;
  items: ReadonlyArray<NavItem>;
  login: LinkContent;
  cta: LinkContent;
  openMenuLabel: string;
  closeMenuLabel: string;
  menuTitle: string;
  existingCustomerPrompt: string;
  mobileLogin: LinkContent;
}>;

/** Copy for the "We're hiring" callout pill. */
export type CalloutContent = Readonly<{ badge: string; link: LinkContent }>;

/** Copy for the hero text column. */
export type HeroSectionContent = Readonly<{
  callout: CalloutContent;
  heading: Readonly<{ lead: string; highlight: string }>;
  body: string;
}>;

/** Copy for the email signup form, including every validation and request error. */
export type SignupContent = Readonly<{
  formId: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  helper: Readonly<{ beforeLink: string; link: LinkContent; afterLink: string }>;
  fieldErrors: Readonly<Record<EmailValidationError, string>>;
  signupErrors: Readonly<Record<SignupError['kind'], string>>;
  successMessage: string;
}>;

const SIGNUP_FORM_ID = 'signup';
const SIGNUP_HREF: SafeHref = `#${SIGNUP_FORM_ID}`;
const SERVER_ERROR_MESSAGE = 'Something went wrong on our side. Please try again.';

/** All user-facing copy on the page. */
export const HERO_CONTENT: Readonly<{
  navigation: NavigationContent;
  hero: HeroSectionContent;
  signup: SignupContent;
}> = {
  navigation: {
    label: 'Main',
    home: { label: 'Home', href: '/' },
    items: [
      { id: 'product', label: 'Product', href: '#' },
      { id: 'features', label: 'Features', href: '#' },
      { id: 'marketplace', label: 'Marketplace', href: '#' },
      { id: 'company', label: 'Company', href: '#' },
    ],
    login: { label: 'Log in', href: '#' },
    cta: { label: 'Start free trial', href: SIGNUP_HREF },
    openMenuLabel: 'Open main menu',
    closeMenuLabel: 'Close main menu',
    menuTitle: 'Main menu',
    existingCustomerPrompt: 'Existing customer?',
    mobileLogin: { label: 'Login', href: '#' },
  },
  hero: {
    callout: { badge: "We're hiring", link: { label: 'Visit our careers page', href: '#' } },
    heading: { lead: 'A better way to', highlight: 'ship web apps' },
    body: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.',
  },
  signup: {
    formId: SIGNUP_FORM_ID,
    emailLabel: 'Email address',
    emailPlaceholder: 'Enter your email',
    submitLabel: 'Start free trial',
    helper: {
      beforeLink:
        'Start your free 14-day trial, no credit card necessary. By providing your email, you agree to our ',
      link: { label: 'terms of service', href: '#' },
      afterLink: '.',
    },
    fieldErrors: {
      empty: 'Enter your email address.',
      tooLong: 'That email is too long.',
      invalidFormat: 'Enter a valid email address.',
    },
    signupErrors: {
      network: "We couldn't reach the server. Check your connection and try again.",
      timeout: 'That took too long. Please try again.',
      server: SERVER_ERROR_MESSAGE,
      invalidResponse: SERVER_ERROR_MESSAGE,
    },
    successMessage: 'Thanks! Check your inbox to get started.',
  },
};
