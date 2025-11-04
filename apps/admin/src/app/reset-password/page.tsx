'use client';

/**
 * @fileoverview Password reset page for admin first-time login
 */

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { getAuthUrl } from '@/lib/api-config';

// Force dynamic rendering to prevent prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('[AdminResetPassword] Reset password request initiated', {
      tokenPrefix: token ? token.substring(0, 8) + '***' : 'missing',
      passwordLength: password.length,
      timestamp: new Date().toISOString(),
    });

    if (password !== confirmPassword) {
      console.warn('[AdminResetPassword] Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      console.warn('[AdminResetPassword] Password too short', {
        passwordLength: password.length,
      });
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const authUrl = getAuthUrl();
      console.log('[AdminResetPassword] Calling auth service', {
        url: `${authUrl}/auth/reset-password`,
        tokenPrefix: token ? token.substring(0, 8) + '***' : 'missing',
      });

      const response = await fetch(`${authUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      console.log('[AdminResetPassword] Auth service response', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        tokenPrefix: token ? token.substring(0, 8) + '***' : 'missing',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[AdminResetPassword] Auth service error response', {
          status: response.status,
          error: data.error,
          tokenPrefix: token ? token.substring(0, 8) + '***' : 'missing',
        });
        throw new Error(data.error);
      }

      console.log('[AdminResetPassword] Password reset successful', {
        message: data.message,
        hasAccessToken: !!data.accessToken,
        tokenPrefix: token ? token.substring(0, 8) + '***' : 'missing',
      });

      setSuccess(true);
      setTimeout(() => router.push('/login?message=Password reset successful'), 2000);
    } catch (err: unknown) {
      console.error('[AdminResetPassword] Password reset failed', {
        error: err instanceof Error ? err.message : String(err),
        errorType: err instanceof Error ? err.constructor.name : typeof err,
        tokenPrefix: token ? token.substring(0, 8) + '***' : 'missing',
      });
      setError(err instanceof Error ? err.message : 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="bg-bg-elevated rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">Set Your Password</h1>
        <p className="text-text-secondary mb-6">This is your first login. Please set a new password.</p>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            Password reset successful! Redirecting to login...
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium text-text-primary">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded bg-bg-input text-text-primary border-border-default focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-tertiary"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-text-secondary hover:text-text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-text-primary">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded bg-bg-input text-text-primary border-border-default focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-tertiary"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-text-secondary hover:text-text-primary"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-primary-hover font-medium"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

