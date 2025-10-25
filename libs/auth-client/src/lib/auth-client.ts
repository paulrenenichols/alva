/**
 * @fileoverview Authentication client for API communication with auth service
 */

/**
 * @fileoverview Authentication client library for user authentication
 */

const AUTH_BASE_URL =
  process.env['NEXT_PUBLIC_AUTH_URL'] || 'http://localhost:3002';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthClient {
  register: (email: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<User>;
}

/**
 * @description Validates email format before making API calls
 * @param email - Email address to validate
 * @throws Error if email format is invalid
 */
const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

/**
 * @description Handles API response errors consistently
 * @param response - Fetch response object
 * @param defaultMessage - Default error message if response doesn't contain one
 * @throws Error with appropriate message
 */
const handleApiError = async (response: Response, defaultMessage: string): Promise<never> => {
  try {
    const errorData = await response.json();
    throw new Error(errorData.message || defaultMessage);
  } catch {
    throw new Error(defaultMessage);
  }
};

/**
 * @description Authentication client implementation for API communication
 */
export class AuthClientImpl implements AuthClient {
  /**
   * @description Registers a new user with email
   * @param email - User email address
   * @throws Error if registration fails
   */
  async register(email: string): Promise<void> {
    validateEmail(email);

    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      await handleApiError(response, 'Registration failed');
    }
  }

  /**
   * @description Sends magic link to user's email for authentication
   * @param email - User email address
   * @throws Error if magic link sending fails
   */
  async sendMagicLink(email: string): Promise<void> {
    validateEmail(email);

    const response = await fetch(`${AUTH_BASE_URL}/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to send magic link');
    }
  }

  /**
   * @description Verifies magic link token and returns user data
   * @param token - Magic link verification token
   * @returns User object with id, email, and optional name
   * @throws Error if verification fails
   */
  async verifyMagicLink(token: string): Promise<User> {
    if (!token || token.trim().length === 0) {
      throw new Error('Token is required for verification');
    }

    const response = await fetch(`${AUTH_BASE_URL}/auth/verify-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      await handleApiError(response, 'Verification failed');
    }

    return response.json();
  }
}

export const authClient = new AuthClientImpl();
