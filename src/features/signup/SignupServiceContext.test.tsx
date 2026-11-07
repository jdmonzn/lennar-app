import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { SignupService } from '../../domain/signup/SignupService';
import { err } from '../../shared/lib/result';
import { SignupServiceProvider, useSignupService } from './SignupServiceContext';

const FAKE_SERVICE: SignupService = {
  signUp: () => Promise.resolve(err({ kind: 'server' })),
};

describe('useSignupService', () => {
  it('returns the service injected by SignupServiceProvider', () => {
    const { result } = renderHook(() => useSignupService(), {
      wrapper: ({ children }: Readonly<{ children: ReactNode }>) => (
        <SignupServiceProvider service={FAKE_SERVICE}>{children}</SignupServiceProvider>
      ),
    });

    expect(result.current).toBe(FAKE_SERVICE);
  });

  it('throws a descriptive error outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useSignupService())).toThrow(
      'useSignupService must be used inside a SignupServiceProvider',
    );
  });
});
