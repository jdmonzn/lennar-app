import type { ReactElement } from 'react';
import type { SignupContent } from '../../content/heroContent';
import type { SignupFormStatus } from '../../domain/signup/signupTypes';
import { assertNever } from '../../shared/lib/assertNever';
import { cn } from '../../shared/lib/cn';
import { Button } from '../../ui/Button';
import { FOCUS_RING_ON_DARK } from '../../ui/focusRing';
import { Text } from '../../ui/Text';
import { TextInput } from '../../ui/TextInput';
import type { SignupForm as SignupFormState } from './useSignupForm';

const EMAIL_MAX_LENGTH = 254;

type SignupFormViewProps = Readonly<{
  content: SignupContent;
  state: SignupFormState;
}>;

function statusMessage(status: SignupFormStatus, content: SignupContent): string | null {
  switch (status.status) {
    case 'idle':
    case 'submitting':
      return null;
    case 'success':
      return content.successMessage;
    case 'error':
      return content.signupErrors[status.error.kind];
    default:
      return assertNever(status);
  }
}

/** Email signup form markup: stacked below `lg`, horizontal from `lg`; state comes from `useSignupForm`. */
export function SignupFormView({ content, state }: SignupFormViewProps): ReactElement {
  const { email, fieldError, status, handleEmailChange, handleEmailBlur, handleSubmit } = state;

  return (
    <form
      id={content.formId}
      noValidate
      onSubmit={handleSubmit}
      className="w-full lg:max-w-[576px]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="w-full lg:flex-1">
          <TextInput
            label={content.emailLabel}
            isLabelHidden
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            maxLength={EMAIL_MAX_LENGTH}
            spellCheck={false}
            required
            placeholder={content.emailPlaceholder}
            value={email}
            onChange={(event) => {
              handleEmailChange(event.target.value);
            }}
            onBlur={handleEmailBlur}
            error={fieldError === null ? undefined : content.fieldErrors[fieldError]}
          />
        </div>
        <div className="w-full lg:w-[139px] lg:shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={status.status === 'submitting'}
          >
            {content.submitLabel}
          </Button>
        </div>
      </div>
      <p aria-live="polite" className="text-sm text-white not-empty:mt-4">
        {statusMessage(status, content)}
      </p>
      <div className="mt-4 text-gray-300">
        <Text as="p" variant="helper">
          {content.helper.beforeLink}
          <a
            href={content.helper.link.href}
            className={cn('rounded-sm font-medium text-white', FOCUS_RING_ON_DARK)}
          >
            {content.helper.link.label}
          </a>
          {content.helper.afterLink}
        </Text>
      </div>
    </form>
  );
}
