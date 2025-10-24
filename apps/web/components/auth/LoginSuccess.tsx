'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  HeadingSection,
  BodyDefault,
  BodySmall,
} from '@/components/ui/Typography';

interface LoginSuccessProps {
  email: string;
  onClose: () => void;
}

export function LoginSuccess({ email, onClose }: LoginSuccessProps) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-success-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>
      <HeadingSection className="mb-4">Check Your Email</HeadingSection>
      <BodyDefault className="mb-4">
        We've sent a magic link to <strong>{email}</strong>
      </BodyDefault>
      <BodySmall className="text-text-secondary mb-6">
        Click the link in your email to sign in. The link will expire in 15
        minutes.
      </BodySmall>
      <Button onClick={onClose} variant="secondary">
        Close
      </Button>
    </div>
  );
}
