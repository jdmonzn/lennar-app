import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useEscapeKey } from './useEscapeKey';

type HookProps = Readonly<{ onEscape: () => void; isActive: boolean }>;

function renderEscapeKey(initialProps: HookProps) {
  return renderHook(
    ({ onEscape, isActive }: HookProps) => {
      useEscapeKey(onEscape, isActive);
    },
    { initialProps },
  );
}

describe('useEscapeKey', () => {
  it('calls onEscape when Escape is pressed while active', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    renderEscapeKey({ onEscape, isActive: true });

    await user.keyboard('{Escape}');

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('does not call onEscape while inactive', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    renderEscapeKey({ onEscape, isActive: false });

    await user.keyboard('{Escape}');

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('ignores other keys', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    renderEscapeKey({ onEscape, isActive: true });

    await user.keyboard('{Enter}a{Tab}');

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('starts and stops listening when isActive changes', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    const { rerender } = renderEscapeKey({ onEscape, isActive: false });

    rerender({ onEscape, isActive: true });
    await user.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalledTimes(1);

    rerender({ onEscape, isActive: false });
    await user.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('calls the latest onEscape after a rerender with a new callback', async () => {
    const user = userEvent.setup();
    const firstOnEscape = vi.fn();
    const latestOnEscape = vi.fn();
    const { rerender } = renderEscapeKey({ onEscape: firstOnEscape, isActive: true });

    rerender({ onEscape: latestOnEscape, isActive: true });
    await user.keyboard('{Escape}');

    expect(firstOnEscape).not.toHaveBeenCalled();
    expect(latestOnEscape).toHaveBeenCalledTimes(1);
  });

  it('stops listening after unmount', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    const { unmount } = renderEscapeKey({ onEscape, isActive: true });

    unmount();
    await user.keyboard('{Escape}');

    expect(onEscape).not.toHaveBeenCalled();
  });
});
