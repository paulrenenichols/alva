'use client';

import { useState, useEffect } from 'react';
import { Hero, HowItWorks, Modal } from '@/components/ui';
import { AuthForm, LoginSuccess, AuthError } from '@/components/auth';
import { Features } from '@/components/landing/Features';
import { SocialProof } from '@/components/landing/SocialProof';
import { Footer } from '@/components/landing/Footer';
import { useAuthStore } from '@/stores/authStore';
import { analytics } from '@/lib/analytics';

const howItWorksSteps = [
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

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  // Track page view
  useEffect(() => {
    analytics.trackPageView('landing-page');
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, user]);

  const handleSignupClick = () => {
    analytics.trackButtonClick('get-started-free', 'hero-section');
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLoginClick = () => {
    analytics.trackButtonClick('sign-in', 'hero-section');
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (email?: string) => {
    if (authMode === 'login' && email) {
      setUserEmail(email);
      setShowSuccess(true);
    } else {
      setShowAuthModal(false);
    }
  };

  const handleAuthError = (error: string) => {
    setShowError(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setShowSuccess(false);
    setShowError(false);
  };

  const handleRetry = () => {
    setShowError(false);
  };

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
      <HowItWorks steps={howItWorksSteps} />
      <SocialProof />
      <Footer />

      {showAuthModal && (
        <Modal isOpen={showAuthModal} onClose={handleCloseModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {authMode === 'signup' ? 'Get Started Free' : 'Sign In'}
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
