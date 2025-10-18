const AUTH_BASE_URL =
  process.env['NEXT_PUBLIC_AUTH_URL'] || 'http://localhost:3002';

export class AuthClient {
  async register(email: string) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async verifyMagicLink(token: string) {
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

export const authClient = new AuthClient();
