/**
 * @fileoverview Onboarding summary page displaying collected information before plan generation
 */

'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@alva/api-client';

export default function SummaryPreview() {
  const { responses } = useOnboardingStore();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    // Fetch the latest generated plan
    const fetchPlan = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          setPlan(plans[0]); // Get the most recent plan
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
        // Fallback to mock data
        setPlan({
          tasks: [
            {
              id: 'task_1',
              title: 'Set up Google Ads account',
              description: 'Create and configure Google Ads account',
              estimated_hours: 2,
              priority: 'high',
              status: 'planned',
            },
          ],
        });
      }
    };

    fetchPlan();
  }, []);

  const summarySections = [
    {
      title: 'Business Profile',
      data: {
        'Business Name': responses['business-name'] || 'Not provided',
        Description: responses['business-description'] || 'Not provided',
        'Brand Vibe': Array.isArray(responses['brand-vibe'])
          ? responses['brand-vibe'].join(', ')
          : 'Not provided',
        'Dream Customers': responses['dream-customers'] || 'Not provided',
        'Focus Areas': Array.isArray(responses['focus-areas'])
          ? responses['focus-areas'].join(', ')
          : 'Not provided',
      },
    },
    {
      title: 'Marketing Goals',
      data: {
        'Primary Goal': responses['primary-goal'] || 'Not provided',
        'Secondary Goals': Array.isArray(responses['secondary-goals'])
          ? responses['secondary-goals'].join(', ')
          : 'Not provided',
        'Success Metrics': Array.isArray(responses['success-metrics'])
          ? responses['success-metrics'].join(', ')
          : 'Not provided',
        'Current Challenges': Array.isArray(responses['current-challenges'])
          ? responses['current-challenges'].join(', ')
          : 'Not provided',
      },
    },
    {
      title: 'Resources & Timeline',
      data: {
        'Monthly Budget': responses['monthly-budget'] || 'Not provided',
        'Team Size': responses['team-size'] || 'Not provided',
        'Time Commitment': responses['time-commitment'] || 'Not provided',
        'Project Timeline': responses['project-timeline'] || 'Not provided',
        'Priority Areas': Array.isArray(responses['priority-areas'])
          ? responses['priority-areas'].join(', ')
          : 'Not provided',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Your Marketing Plan is Ready!
            </h1>
            <p className="text-secondary-600">
              Here's a summary of what we learned about your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {summarySections.map((section, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm font-medium text-secondary-700">
                        {key}:
                      </span>
                      <p className="text-sm text-secondary-600 mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {plan && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Your Marketing Plan Preview
              </h3>
              <div className="space-y-3">
                {plan.tasks?.slice(0, 3).map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        {task.title}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {task.description}
                      </p>
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {task.estimated_hours}h
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="text-center space-y-4">
            <Button
              onClick={() => (window.location.href = '/verify')}
              className="bg-primary-500 text-white px-8 py-3"
            >
              Verify Email & Access Full Plan
            </Button>
            <div>
              <Button
                variant="ghost"
                onClick={() =>
                  (window.location.href = '/onboarding/1')
                }
                className="text-secondary-600"
              >
                Edit My Answers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
