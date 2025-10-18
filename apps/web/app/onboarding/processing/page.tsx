'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { apiClient } from '@alva/api-client';

export default function ProcessingScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Analyzing your responses...');
  const { responses, completeOnboarding } = useOnboardingStore();

  useEffect(() => {
    const processOnboarding = async () => {
      try {
        // Step 1: Finalize client profile
        setProgress(25);
        setStatus('Creating your profile...');

        const profileResult = await apiClient.finalizeOnboarding(responses);

        // Step 2: Generate marketing plan
        setProgress(50);
        setStatus('Generating your marketing plan...');

        const planResult = await apiClient.generatePlan(profileResult.profile);

        // Step 3: Processing complete
        setProgress(100);
        setStatus('Complete!');

        // Redirect to summary
        setTimeout(() => {
          completeOnboarding();
          window.location.href = '/onboarding/summary';
        }, 2000);
      } catch (error) {
        console.error('Processing error:', error);
        setStatus('Something went wrong. Please try again.');
      }
    };

    processOnboarding();
  }, [responses, completeOnboarding]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Crunching your answers...
          </h1>
          <p className="text-secondary-600 mb-6">{status}</p>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-secondary-500">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
}
