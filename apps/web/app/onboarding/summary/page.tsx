'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SummaryPreview() {
  const { responses } = useOnboardingStore();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch generated plan
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
      },
    },
    {
      title: 'Marketing Goals',
      data: {
        'Top Goals': Array.isArray(responses['top-goals'])
          ? responses['top-goals'].join(', ')
          : 'Not provided',
        'Growth Focus': Array.isArray(responses['growth-focus'])
          ? responses['growth-focus'].join(', ')
          : 'Not provided',
      },
    },
    {
      title: 'Resources',
      data: {
        'Weekly Time': responses['weekly-time-commitment'] || 'Not provided',
        Budget: responses['marketing-budget'] || 'Not provided',
        'Existing Tools': Array.isArray(responses['existing-tools'])
          ? responses['existing-tools'].join(', ')
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
                  (window.location.href = '/onboarding/brand-clarity/1')
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
