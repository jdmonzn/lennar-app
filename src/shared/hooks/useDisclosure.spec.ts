import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDisclosure } from './useDisclosure';

describe('useDisclosure', () => {
  it('starts closed by default', () => {
    const { result } = renderHook(() => useDisclosure());

    expect(result.current.isOpen).toBe(false);
  });

  it('starts open when initialOpen is true', () => {
    const { result } = renderHook(() => useDisclosure(true));

    expect(result.current.isOpen).toBe(true);
  });

  it('opens and closes', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('keeps open and close idempotent', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.open();
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('toggles between open and closed', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('applies consecutive toggles in the same batch against the latest state', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.toggle();
      result.current.toggle();
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('keeps the same handler references across renders', () => {
    const { result } = renderHook(() => useDisclosure());
    const { open, close, toggle } = result.current;

    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toBe(open);
    expect(result.current.close).toBe(close);
    expect(result.current.toggle).toBe(toggle);
  });
});
