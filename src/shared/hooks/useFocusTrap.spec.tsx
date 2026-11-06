import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { useFocusTrap } from './useFocusTrap';

type TrapHarnessProps = Readonly<{ isActive: boolean; shouldReturnFocus?: boolean }>;

function TrapHarness({ isActive, shouldReturnFocus = true }: TrapHarnessProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(containerRef, isActive, shouldReturnFocus ? triggerRef : undefined);

  return (
    <>
      <button ref={triggerRef} type="button">
        Trigger
      </button>
      <div ref={containerRef}>
        <a href="#first">First</a>
        <button type="button" disabled>
          Disabled
        </button>
        <button type="button">Middle</button>
        <button type="button" tabIndex={-1}>
          Not tabbable
        </button>
        <input aria-label="Last" />
      </div>
      <button type="button">Outside after</button>
    </>
  );
}

function focusElement(element: HTMLElement): void {
  act(() => {
    element.focus();
  });
}

describe('useFocusTrap', () => {
  it('moves focus to the first focusable element when activated', () => {
    const { rerender } = render(<TrapHarness isActive={false} />);
    focusElement(screen.getByRole('button', { name: 'Trigger' }));

    rerender(<TrapHarness isActive />);

    expect(screen.getByRole('link', { name: 'First' })).toHaveFocus();
  });

  it('does not move focus while inactive', () => {
    render(<TrapHarness isActive={false} />);
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    focusElement(trigger);

    expect(trigger).toHaveFocus();
  });

  it('moves through the container in order on Tab, skipping disabled and tabindex=-1 elements', async () => {
    const user = userEvent.setup();
    render(<TrapHarness isActive />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Middle' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Last' })).toHaveFocus();
  });

  it('wraps from the last element to the first on Tab', async () => {
    const user = userEvent.setup();
    render(<TrapHarness isActive />);
    focusElement(screen.getByRole('textbox', { name: 'Last' }));

    await user.tab();

    expect(screen.getByRole('link', { name: 'First' })).toHaveFocus();
  });

  it('wraps from the first element to the last on Shift+Tab', async () => {
    const user = userEvent.setup();
    render(<TrapHarness isActive />);

    await user.tab({ shift: true });

    expect(screen.getByRole('textbox', { name: 'Last' })).toHaveFocus();
  });

  it('never lets focus reach elements outside the container', async () => {
    const user = userEvent.setup();
    render(<TrapHarness isActive />);

    for (let step = 0; step < 6; step += 1) {
      await user.tab();
      expect(screen.getByRole('button', { name: 'Outside after' })).not.toHaveFocus();
      expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
    }
  });

  it('returns focus to returnFocusRef when deactivated', () => {
    const { rerender } = render(<TrapHarness isActive />);
    expect(screen.getByRole('link', { name: 'First' })).toHaveFocus();

    rerender(<TrapHarness isActive={false} />);

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
  });

  it('stops trapping Tab once deactivated', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TrapHarness isActive shouldReturnFocus={false} />);
    rerender(<TrapHarness isActive={false} shouldReturnFocus={false} />);
    focusElement(screen.getByRole('textbox', { name: 'Last' }));

    await user.tab();

    expect(screen.getByRole('button', { name: 'Outside after' })).toHaveFocus();
  });
});
