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

export class AuthClientImpl implements AuthClient {
  async register(email: string): Promise<void> {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
  }

  async sendMagicLink(email: string): Promise<void> {
    const response = await fetch(`${AUTH_BASE_URL}/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send magic link');
    }
  }

  async verifyMagicLink(token: string): Promise<User> {
    const response = await fetch(`${AUTH_BASE_URL}/auth/verify-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Verification failed');
    }

    return response.json();
  }
}

export const authClient = new AuthClientImpl();
