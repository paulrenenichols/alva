'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@alva/auth-client';
import { useAuthStore } from '@/stores/authStore';

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const user = await authClient.verifyMagicLink(token!);
        setUser(user);
        setStatus('success');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } catch (error) {
        setStatus('error');
        setError('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Verifying your email...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-success rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-inverse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Email verified successfully!
            </h1>
            <p className="text-text-secondary">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-danger rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-inverse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Verification failed
            </h1>
            <p className="text-danger mb-6">{error}</p>
            <button
              onClick={() => (window.location.href = '/')}
              className="bg-primary text-text-inverse px-6 py-2 rounded-lg"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Loading...
            </h1>
          </div>
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}
