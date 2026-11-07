import { useId, type ComponentPropsWithRef, type ReactElement } from 'react';
import { cn } from '../shared/lib/cn';
import { FOCUS_RING_ON_DARK } from './focusRing';
import { VisuallyHidden } from './VisuallyHidden';

type TextInputProps = Readonly<
  Omit<ComponentPropsWithRef<'input'>, 'className' | 'style'> & {
    label: string;
    isLabelHidden?: boolean;
    error?: string | undefined;
  }
>;

const INPUT_CLASSES = cn(
  'h-12 w-full rounded-md border-0 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500',
  FOCUS_RING_ON_DARK,
);

/**
 * Labeled text input. The error is announced politely and linked through `aria-describedby`,
 * alongside any description id the caller passes.
 */
export function TextInput({
  label,
  isLabelHidden = false,
  error,
  id,
  'aria-describedby': describedBy,
  ...inputProps
}: TextInputProps): ReactElement {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hasError = error !== undefined && error !== '';
  const labelElement = (
    <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
      {label}
    </label>
  );

  return (
    <div className="w-full">
      {isLabelHidden ? <VisuallyHidden>{labelElement}</VisuallyHidden> : labelElement}
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={cn(describedBy, hasError && errorId) || undefined}
        className={INPUT_CLASSES}
      />
      <p id={errorId} aria-live="polite" className="text-sm text-white not-empty:mt-2">
        {hasError ? error : null}
      </p>
    </div>
  );
}
