/**
 * @fileoverview Email capture form component for collecting user email addresses
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authClient } from '@alva/auth-client';

export function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authClient.register(email);
      // Redirect to onboarding welcome
      window.location.href = '/onboarding/welcome';
    } catch (err) {
      setError('Please enter a valid email address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Get Started'}
        </Button>
      </div>
      {error && <p className="text-danger mt-2 text-sm">{error}</p>}
    </form>
  );
}
