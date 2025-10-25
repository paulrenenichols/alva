/**
 * @fileoverview Main landing page component with hero, features, and authentication flow
 */

'use client';

import { useState, useEffect } from 'react';
import { Hero, HowItWorks, Modal } from '@/components/ui';
import { AuthForm, LoginSuccess, AuthError } from '@/components/auth';
import { Features } from '@/components/landing/Features';
import { SocialProof } from '@/components/landing/SocialProof';
import { Footer } from '@/components/landing/Footer';
import { useAuthStore } from '@/stores/authStore';
import { analytics } from '@/lib/analytics';

interface Step {
  number: number;
  title: string;
  description: string;
}

const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: 1,
    title: 'Tell Us About Your Business',
    description:
      'Answer a few quick questions about your business, goals, and target audience.',
  },
  {
    number: 2,
    title: 'Get Your AI Strategy',
    description:
      'Receive a personalized marketing strategy tailored to your specific needs and objectives.',
  },
  {
    number: 3,
    title: 'Execute & Optimize',
    description:
      'Implement your strategy with ongoing AI-powered optimization and performance tracking.',
  },
];

/**
 * @description Main landing page component with authentication flow and analytics tracking
 */
export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    analytics.trackPageView('landing-page');
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, user]);

  /**
   * @description Handles signup button click, tracks analytics and opens auth modal
   */
  const handleSignupClick = () => {
    analytics.trackButtonClick('get-started-free', 'hero-section');
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  /**
   * @description Handles login button click, tracks analytics and opens auth modal
   */
  const handleLoginClick = () => {
    analytics.trackButtonClick('sign-in', 'hero-section');
    setAuthMode('login');
    setShowAuthModal(true);
  };

  /**
   * @description Handles successful authentication, shows success modal for login or closes modal for signup
   * @param email - Optional email address for login success display
   */
  const handleAuthSuccess = (email?: string) => {
    if (authMode === 'login' && email) {
      setUserEmail(email);
      setShowSuccess(true);
    } else {
      setShowAuthModal(false);
    }
  };

  /**
   * @description Handles authentication errors by showing error modal
   * @param error - Error message from authentication attempt
   */
  const handleAuthError = (error: string) => {
    setShowError(true);
  };

  /**
   * @description Closes all modals and resets modal state
   */
  const handleCloseModal = () => {
    setShowAuthModal(false);
    setShowSuccess(false);
    setShowError(false);
  };

  /**
   * @description Retries authentication by hiding error modal
   */
  const handleRetry = () => {
    setShowError(false);
  };

  const modalTitle = authMode === 'signup' ? 'Get Started Free' : 'Sign In';

  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero
        headline="Your personal marketing director is ready"
        subhead="Alva works with you 24/7 to build and execute a strategy tailored to your business"
        primaryCTA="Get Started Free"
        secondaryCTA="Sign In"
        onPrimaryClick={handleSignupClick}
        onSecondaryClick={handleLoginClick}
      />

      <Features />
      <HowItWorks steps={HOW_IT_WORKS_STEPS} />
      <SocialProof />
      <Footer />

      {showAuthModal && (
        <Modal isOpen={showAuthModal} onClose={handleCloseModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {modalTitle}
            </h2>
            <AuthForm
              mode={authMode}
              onSuccess={() => handleAuthSuccess()}
              onError={handleAuthError}
            />
          </div>
        </Modal>
      )}

      {showSuccess && (
        <Modal isOpen={showSuccess} onClose={handleCloseModal}>
          <LoginSuccess email={userEmail} onClose={handleCloseModal} />
        </Modal>
      )}

      {showError && (
        <Modal isOpen={showError} onClose={handleCloseModal}>
          <AuthError
            error="Something went wrong"
            onRetry={handleRetry}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
}
