import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

type ChangeListener = (event: Readonly<{ matches: boolean }>) => void;

type FakeMediaQueryList = {
  readonly media: string;
  matches: boolean;
  readonly listeners: Set<ChangeListener>;
  addEventListener: (type: 'change', listener: ChangeListener) => void;
  removeEventListener: (type: 'change', listener: ChangeListener) => void;
};

const mediaQueryLists = new Map<string, FakeMediaQueryList>();

function fakeMediaQueryList(media: string): FakeMediaQueryList {
  const existing = mediaQueryLists.get(media);
  if (existing) {
    return existing;
  }
  const listeners = new Set<ChangeListener>();
  const created: FakeMediaQueryList = {
    media,
    matches: false,
    listeners,
    addEventListener: (_type, listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type, listener) => {
      listeners.delete(listener);
    },
  };
  mediaQueryLists.set(media, created);
  return created;
}

function setMatches(media: string, matches: boolean): void {
  const list = fakeMediaQueryList(media);
  list.matches = matches;
  for (const listener of list.listeners) {
    listener({ matches });
  }
}

const TABLET = '(min-width: 768px)';
const LAPTOP = '(min-width: 1024px)';

describe('useMediaQuery', () => {
  beforeEach(() => {
    mediaQueryLists.clear();
    vi.stubGlobal('matchMedia', vi.fn(fakeMediaQueryList));
  });

  it('returns false when the query does not match', () => {
    const { result } = renderHook(() => useMediaQuery(TABLET));

    expect(result.current).toBe(false);
  });

  it('returns true when the query already matches on first render', () => {
    setMatches(TABLET, true);

    const { result } = renderHook(() => useMediaQuery(TABLET));

    expect(result.current).toBe(true);
  });

  it('updates when the media query starts and stops matching', () => {
    const { result } = renderHook(() => useMediaQuery(TABLET));

    act(() => {
      setMatches(TABLET, true);
    });
    expect(result.current).toBe(true);

    act(() => {
      setMatches(TABLET, false);
    });
    expect(result.current).toBe(false);
  });

  it('switches to the new query when the argument changes', () => {
    setMatches(LAPTOP, true);
    const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: TABLET },
    });
    expect(result.current).toBe(false);

    rerender({ query: LAPTOP });

    expect(result.current).toBe(true);
    expect(fakeMediaQueryList(TABLET).listeners.size).toBe(0);
  });

  it('subscribes with a change listener and removes it on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery(TABLET));
    expect(fakeMediaQueryList(TABLET).listeners.size).toBe(1);

    unmount();

    expect(fakeMediaQueryList(TABLET).listeners.size).toBe(0);
  });
});
