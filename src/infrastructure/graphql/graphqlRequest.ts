import type { Result } from '../../shared/lib/result';
import type { GraphQLRequestError, GraphQLRequestOptions } from './graphqlTypes';

/**
 * POSTs `{ query, variables }` with `fetch` and narrows the response `data` with `isData`.
 * Times out after `timeoutMs` (default 10 000 ms). Every failure resolves as an `err`; it never rejects.
 */
export function graphqlRequest<TData>(
  _options: GraphQLRequestOptions,
  _isData: (data: unknown) => data is TData,
): Promise<Result<TData, GraphQLRequestError>> {
  throw new Error('Not implemented: graphqlRequest (human-owned)');
}
