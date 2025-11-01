'use client';

/**
 * @fileoverview Admin recovery page for requesting a password reset link
 */

import { useState } from 'react';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await fetch('http://localhost:3002/auth/recovery-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      // Show generic success; don't reveal details
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="bg-bg-elevated rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-text-primary">
          Admin Account Recovery
        </h1>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            If an account exists for that email, a recovery link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded bg-bg-elevated text-text-primary border-border-default focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] placeholder:text-text-tertiary"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-text-inverse px-6 py-3 rounded hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending…' : 'Send recovery link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
