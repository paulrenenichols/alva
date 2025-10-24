// Analytics utility for tracking user interactions
export const analytics = {
  trackSignup: (email: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'signup', {
        event_category: 'engagement',
        event_label: 'email_signup',
        value: 1,
      });
    }
  },

  trackLogin: (email: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'login', {
        event_category: 'engagement',
        event_label: 'magic_link_login',
        value: 1,
      });
    }
  },

  trackPageView: (page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: page,
        page_location: window.location.href,
      });
    }
  },

  trackButtonClick: (buttonName: string, location: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'button',
        event_label: buttonName,
        custom_map: {
          location: location,
        },
      });
    }
  },
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
