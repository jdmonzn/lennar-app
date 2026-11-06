import { afterEach, describe, expect, it, vi } from 'vitest';
import { graphqlRequest } from './graphqlRequest';
import type { GraphQLRequestOptions } from './graphqlTypes';

type UserData = Readonly<{ user: Readonly<{ id: string }> }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUserData(data: unknown): data is UserData {
  return isRecord(data) && isRecord(data['user']) && typeof data['user']['id'] === 'string';
}

const ENDPOINT = 'https://graphql.test/api';
const QUERY = 'query User($id: ID!) { user(id: $id) { id } }';
const OPTIONS: GraphQLRequestOptions = { endpoint: ENDPOINT, query: QUERY, variables: { id: '1' } };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function stubFetch(
  handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): ReturnType<typeof vi.fn<typeof fetch>> {
  const fetchMock = vi.fn<typeof fetch>(handler);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function respondWith(body: unknown, status = 200): ReturnType<typeof stubFetch> {
  return stubFetch(() => Promise.resolve(jsonResponse(body, status)));
}

function waitForAbort(_input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    });
  });
}

function trackSettlement(promise: Promise<unknown>): () => boolean {
  let isSettled = false;
  void promise.then(() => {
    isSettled = true;
  });
  return () => isSettled;
}

describe('graphqlRequest', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('request', () => {
    it('POSTs { query, variables } as JSON to the endpoint', async () => {
      const fetchMock = respondWith({ data: { user: { id: '1' } } });

      await graphqlRequest(OPTIONS, isUserData);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [input, init] = fetchMock.mock.calls[0] ?? [];
      expect(input).toBe(ENDPOINT);
      expect(init?.method).toBe('POST');
      expect(new Headers(init?.headers).get('Content-Type')).toContain('application/json');
      const body: unknown = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
      expect(body).toEqual({ query: QUERY, variables: { id: '1' } });
    });

    it('passes an AbortSignal to fetch', async () => {
      const fetchMock = respondWith({ data: { user: { id: '1' } } });

      await graphqlRequest(OPTIONS, isUserData);

      expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
    });
  });

  describe('success', () => {
    it('returns the narrowed data', async () => {
      respondWith({ data: { user: { id: '1' } } });

      expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
        ok: true,
        value: { user: { id: '1' } },
      });
    });

    it('treats an empty errors array as success', async () => {
      respondWith({ data: { user: { id: '1' } }, errors: [] });

      expect((await graphqlRequest(OPTIONS, isUserData)).ok).toBe(true);
    });

    it('clears its timeout once the response arrives', async () => {
      vi.useFakeTimers();
      respondWith({ data: { user: { id: '1' } } });

      await graphqlRequest(OPTIONS, isUserData);

      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('failures', () => {
    it.each([400, 404, 500, 503])('returns an http error with status %i', async (status) => {
      respondWith({ data: { user: { id: '1' } } }, status);

      expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
        ok: false,
        error: { kind: 'http', status },
      });
    });

    it('returns a graphql error when the response has an errors array', async () => {
      respondWith({ data: null, errors: [{ message: 'Something broke' }] });

      expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
        ok: false,
        error: { kind: 'graphql' },
      });
    });

    it('returns a graphql error even when partial data is present', async () => {
      respondWith({ data: { user: { id: '1' } }, errors: [{ message: 'Partial failure' }] });

      expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
        ok: false,
        error: { kind: 'graphql' },
      });
    });

    it('returns invalidResponse when the body is not JSON', async () => {
      stubFetch(() => Promise.resolve(new Response('<html>Bad gateway</html>', { status: 200 })));

      expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
        ok: false,
        error: { kind: 'invalidResponse' },
      });
    });

    it.each([null, 42, 'text', [], true])(
      'returns invalidResponse when the body is %j',
      async (body) => {
        respondWith(body);

        expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
          ok: false,
          error: { kind: 'invalidResponse' },
        });
      },
    );

    it.each([{}, { data: null }, { data: { user: { id: 1 } } }, { data: { nobody: true } }])(
      'returns invalidResponse when data fails the type guard: %j',
      async (body) => {
        respondWith(body);

        expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
          ok: false,
          error: { kind: 'invalidResponse' },
        });
      },
    );

    it('returns a network error when fetch rejects', async () => {
      stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));

      expect(await graphqlRequest(OPTIONS, isUserData)).toEqual({
        ok: false,
        error: { kind: 'network' },
      });
    });
  });

  describe('timeout and cancellation', () => {
    it('times out after 10 seconds by default and aborts the fetch', async () => {
      vi.useFakeTimers();
      const fetchMock = stubFetch(waitForAbort);
      const pending = graphqlRequest(OPTIONS, isUserData);
      const isSettled = trackSettlement(pending);

      await vi.advanceTimersByTimeAsync(9_999);
      expect(isSettled()).toBe(false);

      await vi.advanceTimersByTimeAsync(1);

      expect(await pending).toEqual({ ok: false, error: { kind: 'timeout' } });
      expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
    });

    it('honors a custom timeoutMs', async () => {
      vi.useFakeTimers();
      stubFetch(waitForAbort);
      const pending = graphqlRequest({ ...OPTIONS, timeoutMs: 500 }, isUserData);

      await vi.advanceTimersByTimeAsync(500);

      expect(await pending).toEqual({ ok: false, error: { kind: 'timeout' } });
    });

    it('returns aborted when the caller aborts', async () => {
      vi.useFakeTimers();
      const fetchMock = stubFetch(waitForAbort);
      const controller = new AbortController();
      const pending = graphqlRequest({ ...OPTIONS, signal: controller.signal }, isUserData);

      controller.abort();

      expect(await pending).toEqual({ ok: false, error: { kind: 'aborted' } });
      expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
      expect(vi.getTimerCount()).toBe(0);
    });

    it('returns aborted when the caller signal is already aborted', async () => {
      stubFetch(waitForAbort);
      const controller = new AbortController();
      controller.abort();

      expect(await graphqlRequest({ ...OPTIONS, signal: controller.signal }, isUserData)).toEqual({
        ok: false,
        error: { kind: 'aborted' },
      });
    });
  });
});
