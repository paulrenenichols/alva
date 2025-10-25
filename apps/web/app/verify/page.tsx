/**
 * @fileoverview Email verification page for magic link authentication
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@alva/auth-client';
import { useAuthStore } from '@/stores/authStore';

const REDIRECT_DELAY = 2000; // 2 seconds

const PAGE_CONTAINER_CLASSES = 'min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center';
const CONTENT_CONTAINER_CLASSES = 'max-w-md w-full text-center';
const ICON_CONTAINER_CLASSES = 'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center';
const VERIFYING_ICON_CLASSES = 'bg-primary';
const SUCCESS_ICON_CLASSES = 'bg-success';
const ERROR_ICON_CLASSES = 'bg-danger';
const SPINNER_CLASSES = 'w-6 h-6 border-4 border-text-inverse border-t-transparent rounded-full animate-spin';
const CHECKMARK_CLASSES = 'w-8 h-8 text-text-inverse';
const CROSS_CLASSES = 'w-8 h-8 text-text-inverse';
const TITLE_CLASSES = 'text-2xl font-bold text-text-primary mb-2';
const SUBTITLE_CLASSES = 'text-text-secondary';
const ERROR_TEXT_CLASSES = 'text-danger mb-6';
const BACK_BUTTON_CLASSES = 'bg-primary text-text-inverse px-6 py-2 rounded-lg';

type VerificationStatus = 'verifying' | 'success' | 'error';

/**
 * @description Main content component for email verification page
 */
function VerifyPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  /**
   * @description Verifies the magic link token and handles authentication
   */
  const verifyEmail = async (): Promise<void> => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    try {
      const user = await authClient.verifyMagicLink(token);
      setUser(user);
      setStatus('success');

      // Redirect to dashboard after delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, REDIRECT_DELAY);
    } catch (error) {
      setStatus('error');
      setError('Verification failed. Please try again.');
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, setUser]);

  /**
   * @description Handles navigation back to home page
   */
  const handleBackToHome = (): void => {
    window.location.href = '/';
  };

  return (
    <div className={PAGE_CONTAINER_CLASSES}>
      <div className={CONTENT_CONTAINER_CLASSES}>
        {status === 'verifying' && (
          <>
            <div className={`${ICON_CONTAINER_CLASSES} ${VERIFYING_ICON_CLASSES}`}>
              <div className={SPINNER_CLASSES} />
            </div>
            <h1 className={TITLE_CLASSES}>
              Verifying your email...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={`${ICON_CONTAINER_CLASSES} ${SUCCESS_ICON_CLASSES}`}>
              <svg className={CHECKMARK_CLASSES} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className={TITLE_CLASSES}>
              Email verified successfully!
            </h1>
            <p className={SUBTITLE_CLASSES}>
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={`${ICON_CONTAINER_CLASSES} ${ERROR_ICON_CLASSES}`}>
              <svg className={CROSS_CLASSES} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className={TITLE_CLASSES}>
              Verification failed
            </h1>
            <p className={ERROR_TEXT_CLASSES}>{error}</p>
            <button onClick={handleBackToHome} className={BACK_BUTTON_CLASSES}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * @description Loading fallback component for Suspense
 */
function LoadingFallback() {
  return (
    <div className={PAGE_CONTAINER_CLASSES}>
      <div className="text-center">
        <div className={`${ICON_CONTAINER_CLASSES} ${VERIFYING_ICON_CLASSES}`}>
          <div className={SPINNER_CLASSES} />
        </div>
        <h1 className={TITLE_CLASSES}>
          Loading...
        </h1>
      </div>
    </div>
  );
}

/**
 * @description Email verification page with Suspense boundary
 */
export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyPageContent />
    </Suspense>
  );
}
