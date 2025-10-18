'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function OnboardingWelcome() {
  const { startOnboarding, getProgress } = useOnboardingStore();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Welcome to Alva!
        </h1>
        <p className="text-secondary-600 mb-6">
          Let's create your personalized marketing plan in just 5 minutes
        </p>
        <div className="bg-primary-100 rounded-lg p-4 mb-6">
          <p className="text-primary-800 font-medium">{progress.total} cards • 5 minutes</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => {
              startOnboarding();
              window.location.href = '/onboarding/1';
            }}
            className="w-full bg-primary-500 text-white"
          >
            Let's Go
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
