'use client';

/**
 * @fileoverview Page for sending new invites
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvitePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch('http://localhost:3002/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invite');
      }

      setSuccess(true);
      setTimeout(() => router.push('/invites'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-text-primary">Send New Invite</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            Invite sent successfully! Redirecting...
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-bg-elevated rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-500 text-text-inverse px-6 py-3 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="bg-bg-secondary text-text-primary px-6 py-3 rounded hover:bg-bg-tertiary font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

