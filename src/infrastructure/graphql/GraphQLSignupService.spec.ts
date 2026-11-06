import { afterEach, describe, expect, it, vi } from 'vitest';
import { EmailAddress } from '../../domain/signup/EmailAddress';
import { GraphQLSignupService } from './GraphQLSignupService';

const ENDPOINT = 'https://graphql.test/api';
const RAW_EMAIL = 'jane.doe@example.com';

function emailFor(raw: string): EmailAddress {
  const result = EmailAddress.create(raw);
  if (!result.ok) {
    throw new Error(`Test setup produced an invalid email: ${raw}`);
  }
  return result.value;
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sentBody(fetchMock: ReturnType<typeof stubFetch>): Record<string, unknown> {
  const body = fetchMock.mock.calls[0]?.[1]?.body;
  const parsed: unknown = typeof body === 'string' ? JSON.parse(body) : undefined;
  if (!isRecord(parsed)) {
    throw new Error('Expected a JSON object request body');
  }
  return parsed;
}

const CREATED_USER = { data: { createUser: { id: '101', name: 'jane.doe', email: RAW_EMAIL } } };

describe('GraphQLSignupService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('request', () => {
    it('POSTs to the injected endpoint', async () => {
      const fetchMock = respondWith(CREATED_USER);

      await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL));

      expect(fetchMock.mock.calls[0]?.[0]).toBe(ENDPOINT);
      expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    });

    it('sends a createUser mutation without interpolating the email into the query', async () => {
      const fetchMock = respondWith(CREATED_USER);

      await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL));

      const { query } = sentBody(fetchMock);
      expect(typeof query).toBe('string');
      expect(String(query)).toMatch(/mutation[\s\S]*createUser/);
      expect(String(query)).not.toContain(RAW_EMAIL);
    });

    it('sends name, username and email derived from the email in variables.input', async () => {
      const fetchMock = respondWith(CREATED_USER);

      await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL));

      const { variables } = sentBody(fetchMock);
      const input = isRecord(variables) ? variables['input'] : undefined;
      const name = isRecord(input) ? input['name'] : undefined;

      expect(input).toMatchObject({ username: 'jane.doe', email: RAW_EMAIL });
      expect(typeof name === 'string' && name.trim().length > 0).toBe(true);
    });
  });

  describe('success', () => {
    it('resolves with the created user id and email', async () => {
      respondWith(CREATED_USER);

      expect(await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL))).toEqual({
        ok: true,
        value: { id: '101', email: RAW_EMAIL },
      });
    });
  });

  describe('error mapping', () => {
    it.each([400, 500, 503])('maps HTTP %i to a server error', async (status) => {
      respondWith({ errors: [{ message: 'Server exploded' }] }, status);

      expect(await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL))).toEqual({
        ok: false,
        error: { kind: 'server' },
      });
    });

    it('maps a GraphQL errors array to a server error', async () => {
      respondWith({ data: null, errors: [{ message: 'Validation failed' }] });

      expect(await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL))).toEqual({
        ok: false,
        error: { kind: 'server' },
      });
    });

    it('maps a fetch rejection to a network error', async () => {
      stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));

      expect(await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL))).toEqual({
        ok: false,
        error: { kind: 'network' },
      });
    });

    it('maps a non-JSON body to invalidResponse', async () => {
      stubFetch(() => Promise.resolve(new Response('not json', { status: 200 })));

      expect(await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL))).toEqual({
        ok: false,
        error: { kind: 'invalidResponse' },
      });
    });

    it.each([
      { data: null },
      { data: {} },
      { data: { createUser: null } },
      { data: { createUser: { name: 'jane.doe', email: RAW_EMAIL } } },
      { data: { createUser: { id: '101', name: 'jane.doe' } } },
    ])('maps an unexpected data shape to invalidResponse: %j', async (body) => {
      respondWith(body);

      expect(await new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL))).toEqual({
        ok: false,
        error: { kind: 'invalidResponse' },
      });
    });

    it('maps a 10 second stall to a timeout error', async () => {
      vi.useFakeTimers();
      stubFetch(waitForAbort);
      const pending = new GraphQLSignupService(ENDPOINT).signUp(emailFor(RAW_EMAIL));

      await vi.advanceTimersByTimeAsync(10_000);

      expect(await pending).toEqual({ ok: false, error: { kind: 'timeout' } });
    });
  });

  describe('cancellation', () => {
    it('aborts the fetch and resolves with an error when the caller aborts', async () => {
      const fetchMock = stubFetch(waitForAbort);
      const controller = new AbortController();
      const pending = new GraphQLSignupService(ENDPOINT).signUp(
        emailFor(RAW_EMAIL),
        controller.signal,
      );

      controller.abort();
      const result = await pending;

      expect(result.ok).toBe(false);
      expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
    });
  });
});
