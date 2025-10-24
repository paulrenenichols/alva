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

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function AuthForm({
  mode,
  onSuccess,
  onError,
  className,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { isLoading, error, setLoading, setError, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    clearError();

    // Email validation
    if (!email || !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await authClient.register(email);
        analytics.trackSignup(email);
        // Redirect to onboarding welcome
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

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            error={!!(emailError || error)}
            helperText={emailError || error || undefined}
            required
          />
        </div>

        <Button type="submit" loading={isLoading} className="w-full">
          {mode === 'signup' ? 'Get Started Free' : 'Send Magic Link'}
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
