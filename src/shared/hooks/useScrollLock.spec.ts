import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useScrollLock } from './useScrollLock';

function renderScrollLock(isLocked: boolean) {
  return renderHook(
    ({ isLocked: locked }: Readonly<{ isLocked: boolean }>) => {
      useScrollLock(locked);
    },
    { initialProps: { isLocked } },
  );
}

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('hides body overflow while locked', () => {
    renderScrollLock(true);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('leaves body overflow untouched while unlocked', () => {
    document.body.style.overflow = 'auto';
    renderScrollLock(false);

    expect(document.body.style.overflow).toBe('auto');
  });

  it('restores the previous overflow value when unlocked', () => {
    document.body.style.overflow = 'scroll';
    const { rerender } = renderScrollLock(true);
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ isLocked: false });

    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restores the previous overflow value on unmount', () => {
    const { unmount } = renderScrollLock(true);

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('locks again after being unlocked', () => {
    const { rerender } = renderScrollLock(true);

    rerender({ isLocked: false });
    rerender({ isLocked: true });

    expect(document.body.style.overflow).toBe('hidden');
  });
});
