/** What the backend returns once a user has been signed up. */
export type SignupConfirmation = Readonly<{ id: string; email: string }>;

/** Expected ways a signup request can fail; mapped to fixed, user-safe copy in the UI. */
export type SignupError =
  | { readonly kind: 'network' }
  | { readonly kind: 'timeout' }
  | { readonly kind: 'server' }
  | { readonly kind: 'invalidResponse' };

/** Lifecycle of the signup form submission. */
export type SignupFormStatus =
  | { readonly status: 'idle' }
  | { readonly status: 'submitting' }
  | { readonly status: 'success'; readonly confirmation: SignupConfirmation }
  | { readonly status: 'error'; readonly error: SignupError };
