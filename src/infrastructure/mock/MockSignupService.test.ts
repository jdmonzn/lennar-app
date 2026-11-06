import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailAddress } from '../../domain/signup/EmailAddress';
import { MockSignupService } from './MockSignupService';

vi.mock('../../domain/signup/EmailAddress', () => ({
  EmailAddress: {
    create: (raw: string) => ({ ok: true, value: { value: raw } }),
  },
}));

function emailFor(raw: string): EmailAddress {
  const result = EmailAddress.create(raw);
  if (!result.ok) {
    throw new Error(`Test setup produced an invalid email: ${raw}`);
  }
  return result.value;
}

function trackSettlement(promise: Promise<unknown>): () => boolean {
  let isSettled = false;
  void promise.then(() => {
    isSettled = true;
  });
  return () => isSettled;
}

describe('MockSignupService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves with a confirmation for the email after 800ms', async () => {
    const pending = new MockSignupService().signUp(emailFor('jane@example.com'));
    const isSettled = trackSettlement(pending);

    await vi.advanceTimersByTimeAsync(799);
    expect(isSettled()).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    const result = await pending;

    expect(result.ok && result.value.email).toBe('jane@example.com');
    expect(result.ok && result.value.id).not.toBe('');
  });

  it('honors a custom delay', async () => {
    const pending = new MockSignupService(50).signUp(emailFor('jane@example.com'));

    await vi.advanceTimersByTimeAsync(50);

    expect((await pending).ok).toBe(true);
  });

  it('gives each signup a different id', async () => {
    const service = new MockSignupService(0);
    const first = service.signUp(emailFor('a@example.com'));
    const second = service.signUp(emailFor('b@example.com'));

    await vi.advanceTimersByTimeAsync(0);
    const [firstResult, secondResult] = await Promise.all([first, second]);

    expect(
      firstResult.ok && secondResult.ok && firstResult.value.id !== secondResult.value.id,
    ).toBe(true);
  });

  it('resolves with a network error and cancels its timer when aborted mid-flight', async () => {
    const controller = new AbortController();
    const pending = new MockSignupService().signUp(emailFor('jane@example.com'), controller.signal);

    await vi.advanceTimersByTimeAsync(400);
    controller.abort();

    expect(await pending).toEqual({ ok: false, error: { kind: 'network' } });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('resolves immediately with a network error when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    const result = await new MockSignupService().signUp(
      emailFor('jane@example.com'),
      controller.signal,
    );

    expect(result).toEqual({ ok: false, error: { kind: 'network' } });
    expect(vi.getTimerCount()).toBe(0);
  });
});
