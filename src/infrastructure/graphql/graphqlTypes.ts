/** Input for a single GraphQL POST request. `variables` carry all user input; it is never interpolated into `query`. */
export type GraphQLRequestOptions = Readonly<{
  endpoint: string;
  query: string;
  variables: Readonly<Record<string, unknown>>;
  signal?: AbortSignal | undefined;
  timeoutMs?: number | undefined;
}>;

/** Expected ways a GraphQL request can fail. */
export type GraphQLRequestError =
  | { readonly kind: 'network' }
  | { readonly kind: 'timeout' }
  | { readonly kind: 'aborted' }
  | { readonly kind: 'http'; readonly status: number }
  | { readonly kind: 'graphql' }
  | { readonly kind: 'invalidResponse' };
