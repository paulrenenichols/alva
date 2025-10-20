'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { apiClient } from '@alva/api-client';
import { useRouter } from 'next/navigation';

export default function ProcessingPage() {
  const [status, setStatus] = useState<'processing' | 'completed' | 'error'>(
    'processing'
  );
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { responses, clearResponses } = useOnboardingStore();

  useEffect(() => {
    const generatePlan = async () => {
      try {
        setProgress(20);

        // Map onboarding responses to client profile
        const clientProfile = mapResponsesToProfile(responses);
        setProgress(40);

        // Generate marketing plan
        const result = await apiClient.generatePlan({ clientProfile });
        setProgress(80);

        if (result.success) {
          setProgress(100);
          setStatus('completed');

          // Clear onboarding data
          clearResponses();

          // Redirect to summary
          setTimeout(() => {
            router.push('/onboarding/summary');
          }, 2000);
        } else {
          throw new Error(result.error || 'Failed to generate plan');
        }
      } catch (error) {
        console.error('Plan generation error:', error);
        setStatus('error');
      }
    };

    generatePlan();
  }, [responses, clearResponses, router]);

  const mapResponsesToProfile = (responses: Record<string, any>) => {
    return {
      user_profile: {
        business_name: responses['business-name'] || '',
        description: responses['business-description'] || '',
      },
      brand_identity: {
        vibe_tags: responses['brand-vibe'] || [],
      },
      goals_growth: {
        top_goals: responses['focus-areas'] || [],
      },
      constraints_tools: {
        weekly_time_commitment: responses['weekly-time-commitment'] || '10',
        marketing_budget: responses['marketing-budget'] || '1000',
      },
      content_social: {
        competitor_analysis: responses['dream-customers'] || '',
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-primary-500 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Crunching your answers...
        </h1>

        <p className="text-secondary-600 mb-8">
          Our AI is analyzing your responses to create your personalized
          marketing plan.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500">{progress}% Complete</p>

        {status === 'error' && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
