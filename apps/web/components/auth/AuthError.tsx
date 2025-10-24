'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeadingSection, BodyDefault } from '@/components/ui/Typography';

interface AuthErrorProps {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}

export function AuthError({ error, onRetry, onClose }: AuthErrorProps) {
  const getErrorMessage = (error: string) => {
    if (error.includes('network')) {
      return 'Please check your internet connection and try again.';
    }
    if (error.includes('email')) {
      return 'Please enter a valid email address.';
    }
    if (error.includes('exists')) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    return 'Something went wrong. Please try again.';
  };

  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-danger-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>
      <HeadingSection className="mb-4">Oops!</HeadingSection>
      <BodyDefault className="mb-6">{getErrorMessage(error)}</BodyDefault>
      <div className="flex gap-3 justify-center">
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </div>
    </div>
  );
}
