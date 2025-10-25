/**
 * @fileoverview Storybook decorators for page stories with comprehensive mocking
 */

import React from 'react';
import { Decorator } from '@storybook/react';

/**
 * @description Decorator for page stories that sets up comprehensive mocking
 */
export const withPageMocks: Decorator = (Story, context) => {
  // Mock global objects that pages might use
  React.useEffect(() => {
    // Mock fetch if not already mocked
    if (!global.fetch) {
      global.fetch = () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('OK'),
      } as any);
    }

    // Mock window.location if needed
    if (typeof window !== 'undefined' && !window.location.assign) {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000',
          pathname: '/',
          search: '',
          hash: '',
          assign: () => {},
          replace: () => {},
          reload: () => {},
        },
        writable: true,
      });
    }

    // Mock localStorage if needed
    if (typeof window !== 'undefined' && !window.localStorage.getItem) {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
        },
        writable: true,
      });
    }

    // Mock sessionStorage if needed
    if (typeof window !== 'undefined' && !window.sessionStorage.getItem) {
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
        },
        writable: true,
      });
    }

    // Mock window.location.reload if needed
    if (typeof window !== 'undefined' && !window.location.reload) {
      Object.defineProperty(window.location, 'reload', {
        value: () => {},
        writable: true,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Story />
    </div>
  );
};

/**
 * @description Decorator for pages that need authentication context
 */
export const withAuthContext: Decorator = (Story, context) => {
  const { args } = context;
  const isAuthenticated = args.isAuthenticated ?? true;
  const user = args.user ?? { id: 'user-123', email: 'test@example.com' };

  React.useEffect(() => {
    // Set up auth-related mocks
    if (typeof window !== 'undefined') {
      // Mock user data in localStorage
      window.localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Story />
    </div>
  );
};

/**
 * @description Decorator for onboarding pages that need specific card context
 */
export const withOnboardingContext: Decorator = (Story, context) => {
  const { args } = context;
  const cardNumber = args.cardNumber ?? 1;
  const responses = args.responses ?? {};

  React.useEffect(() => {
    // Set up onboarding-related mocks
    if (typeof window !== 'undefined') {
      // Mock onboarding data in localStorage
      window.localStorage.setItem('onboarding-responses', JSON.stringify(responses));
      window.localStorage.setItem('current-card', cardNumber.toString());
    }
  }, [cardNumber, responses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Story />
    </div>
  );
};

/**
 * @description Decorator for dashboard pages with loading states
 */
export const withDashboardContext: Decorator = (Story, context) => {
  const { args } = context;
  const isLoading = args.isLoading ?? false;
  const hasData = args.hasData ?? true;

  React.useEffect(() => {
    // Set up dashboard-related mocks
    if (typeof window !== 'undefined') {
      // Mock dashboard data in localStorage
      window.localStorage.setItem('dashboard-loading', isLoading.toString());
      window.localStorage.setItem('dashboard-has-data', hasData.toString());
    }
  }, [isLoading, hasData]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Story />
    </div>
  );
};