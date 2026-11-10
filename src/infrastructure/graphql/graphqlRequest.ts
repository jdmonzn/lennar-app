import { isRecord } from '../../shared/lib/isRecord';
import { err, ok, type Result } from '../../shared/lib/result';
import type { GraphQLRequestError, GraphQLRequestOptions } from './graphqlTypes';

const DEFAULT_TIMEOUT_MS = 10_000;

function parseJson(text: string): unknown {
  try {
    const value: unknown = JSON.parse(text);
    return value;
  } catch {
    return undefined;
  }
}

function hasGraphQLErrors(body: Readonly<Record<string, unknown>>): boolean {
  const { errors } = body;
  return Array.isArray(errors) && errors.length > 0;
}

function toResult<TData>(
  body: unknown,
  isData: (data: unknown) => data is TData,
): Result<TData, GraphQLRequestError> {
  if (!isRecord(body)) return err({ kind: 'invalidResponse' });
  if (hasGraphQLErrors(body)) return err({ kind: 'graphql' });

  const { data } = body;
  if (!isData(data)) return err({ kind: 'invalidResponse' });
  return ok(data);
}

/**
 * POSTs `{ query, variables }` with `fetch` and narrows the response `data` with `isData`.
 * Times out after `timeoutMs` (default 10 000 ms). Every failure resolves as an `err`; it never rejects.
 */
export async function graphqlRequest<TData>(
  options: GraphQLRequestOptions,
  isData: (data: unknown) => data is TData,
): Promise<Result<TData, GraphQLRequestError>> {
  const { endpoint, query, variables, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  if (signal?.aborted) return err({ kind: 'aborted' });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  const abortFromCaller = () => {
    controller.abort();
  };
  signal?.addEventListener('abort', abortFromCaller);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    if (!response.ok) return err({ kind: 'http', status: response.status });

    const text = await response.text();
    return toResult(parseJson(text), isData);
  } catch {
    if (signal?.aborted) return err({ kind: 'aborted' });
    if (controller.signal.aborted) return err({ kind: 'timeout' });
    return err({ kind: 'network' });
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}
