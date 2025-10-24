'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function OnboardingWelcome() {
  const { startOnboarding, getProgress } = useOnboardingStore();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 text-center" variant="elevated">
          {/* Logo/Brand Area */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-text-inverse">A</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Welcome to Alva!
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Let's create your personalized marketing plan in just 5 minutes
            </p>
          </div>

          {/* Progress Info */}
          <div className="bg-primary-muted rounded-lg p-4 mb-6">
            <p className="text-text-primary font-medium text-sm">
              {progress.total} cards • 5 minutes
            </p>
            <p className="text-text-secondary text-xs mt-1">
              I'll guide you step-by-step. You won't need to guess your next
              move again.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                startOnboarding();
                setTimeout(() => {
                  window.location.href = '/onboarding/1';
                }, 100);
              }}
              size="lg"
              className="w-full"
            >
              Let's Go
            </Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-text-tertiary text-xs">
            Bringing your marketing into the light.
          </p>
        </div>
      </div>
    </div>
  );
}
