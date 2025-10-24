/**
 * @fileoverview Analytics utility for tracking user interactions and conversions
 */

interface GtagEvent {
  event_category: string;
  event_label: string;
  value?: number;
  custom_map?: Record<string, string>;
}

interface GtagConfig {
  page_title: string;
  page_location: string;
}

/**
 * @description Checks if gtag is available in the browser environment
 * @returns True if gtag is available
 */
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * @description Analytics tracking utilities for user interactions
 */
export const analytics = {
  /**
   * @description Tracks user signup events
   * @param email - User email address
   */
  trackSignup: (email: string): void => {
    if (isGtagAvailable()) {
      const eventData: GtagEvent = {
        event_category: 'engagement',
        event_label: 'email_signup',
        value: 1,
      };
      window.gtag('event', 'signup', eventData);
    }
  },

  /**
   * @description Tracks user login events
   * @param email - User email address
   */
  trackLogin: (email: string): void => {
    if (isGtagAvailable()) {
      const eventData: GtagEvent = {
        event_category: 'engagement',
        event_label: 'magic_link_login',
        value: 1,
      };
      window.gtag('event', 'login', eventData);
    }
  },

  /**
   * @description Tracks page view events
   * @param page - Page identifier
   */
  trackPageView: (page: string): void => {
    if (isGtagAvailable()) {
      const configData: GtagConfig = {
        page_title: page,
        page_location: window.location.href,
      };
      window.gtag('config', 'GA_MEASUREMENT_ID', configData);
    }
  },

  /**
   * @description Tracks button click events
   * @param buttonName - Name of the button clicked
   * @param location - Location where button was clicked
   */
  trackButtonClick: (buttonName: string, location: string): void => {
    if (isGtagAvailable()) {
      const eventData: GtagEvent = {
        event_category: 'button',
        event_label: buttonName,
        custom_map: {
          location: location,
        },
      };
      window.gtag('event', 'click', eventData);
    }
  },
};

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: GtagConfig | GtagEvent) => void;
  }
}
