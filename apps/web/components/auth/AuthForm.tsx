/**
 * @fileoverview Authentication form component supporting both signup and login modes
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HeadingSection, BodyDefault } from '@/components/ui/Typography';
import { useAuthStore } from '@/stores/authStore';
import { authClient } from '@alva/auth-client';
import { analytics } from '@/lib/analytics';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @description Validates email format using regex pattern
 * @param email - Email string to validate
 * @returns True if email format is valid
 */
const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * @description Renders authentication form with email input and submit button
 * @param mode - Authentication mode: 'login' or 'signup'
 * @param onSuccess - Optional callback for successful authentication
 * @param onError - Optional callback for authentication errors
 * @param className - Optional additional CSS classes
 */
export function AuthForm({
  mode,
  onSuccess,
  onError,
  className,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { isLoading, error, setLoading, setError, clearError } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError('');
    clearError();

    if (!email || !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await authClient.register(email);
        analytics.trackSignup(email);
        window.location.href = '/onboarding/welcome';
      } else {
        await authClient.sendMagicLink(email);
        analytics.trackLogin(email);
        onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage =
        error.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const buttonText = mode === 'signup' ? 'Get Started Free' : 'Send Magic Link';
  const hasError = !!(emailError || error);
  const helperText = emailError || error || undefined;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            error={hasError}
            helperText={helperText}
            required
          />
        </div>

        <Button type="submit" loading={isLoading} className="w-full">
          {buttonText}
        </Button>

        {mode === 'login' && (
          <BodyDefault className="text-text-secondary text-center">
            We'll send you a magic link to sign in
          </BodyDefault>
        )}
      </div>
    </form>
  );
}
