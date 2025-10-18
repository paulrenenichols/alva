'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@alva/api-client';

interface MarketingPlan {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  sections: {
    overview: {
      businessName: string;
      industry: string;
      targetAudience: string;
      goals: string[];
    };
    strategy: {
      channels: string[];
      budget: number;
      timeline: string;
      keyMessages: string[];
    };
    tactics: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
    metrics: {
      kpis: string[];
      successCriteria: string[];
    };
  };
}

export default function PlanPage() {
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'strategy' | 'tactics' | 'metrics'>('overview');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          setPlan(plans[0]);
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
        // Fallback to mock data
        setPlan({
          id: '1',
          title: 'My Marketing Plan',
          description: 'Personalized marketing strategy based on your business needs',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: {
            overview: {
              businessName: 'My Business',
              industry: 'Technology',
              targetAudience: 'Small business owners',
              goals: ['Increase brand awareness', 'Generate leads', 'Improve customer retention'],
            },
            strategy: {
              channels: ['Social Media', 'Content Marketing', 'Email Marketing'],
              budget: 5000,
              timeline: '6 months',
              keyMessages: ['Innovation', 'Reliability', 'Customer Success'],
            },
            tactics: {
              immediate: ['Set up social media accounts', 'Create content calendar'],
              shortTerm: ['Launch email campaign', 'Optimize website'],
              longTerm: ['Expand to new markets', 'Develop partnerships'],
            },
            metrics: {
              kpis: ['Website traffic', 'Lead generation', 'Social media engagement'],
              successCriteria: ['20% increase in traffic', '100 new leads per month'],
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📊' },
    { id: 'strategy', title: 'Strategy', icon: '🎯' },
    { id: 'tactics', title: 'Tactics', icon: '⚡' },
    { id: 'metrics', title: 'Metrics', icon: '📈' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Plan</h1>
          <p className="text-gray-600">Loading your plan...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Plan</h1>
          <p className="text-gray-600">No plan found</p>
        </div>
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No marketing plan available</p>
            <p className="text-sm mb-4">Complete your onboarding to generate a personalized marketing plan!</p>
            <Button
              onClick={() => (window.location.href = '/onboarding/welcome')}
              className="bg-primary-500 text-white"
            >
              Start Onboarding
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const renderSection = () => {
    const section = plan.sections[activeSection] as any;
    
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Business Name:</span>
                    <p className="text-gray-600">{section.businessName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Industry:</span>
                    <p className="text-gray-600">{section.industry}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Target Audience:</span>
                    <p className="text-gray-600">{section.targetAudience}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Goals</h3>
                <div className="space-y-2">
                  {section.goals.map((goal: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Channels</h3>
                <div className="space-y-2">
                  {section.channels.map((channel: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{channel}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Monthly Budget:</span>
                    <p className="text-gray-600">${section.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Timeline:</span>
                    <p className="text-gray-600">{section.timeline}</p>
                  </div>
                </div>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Messages</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {section.keyMessages.map((message: string, index: number) => (
                  <div key={index} className="bg-primary-50 p-4 rounded-lg text-center">
                    <span className="text-primary-800 font-medium">{message}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'tactics':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions (0-30 days)</h3>
              <div className="space-y-3">
                {section.immediate.map((tactic: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{tactic}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Short-term Goals (1-3 months)</h3>
              <div className="space-y-3">
                {section.shortTerm.map((tactic: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{tactic}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Long-term Vision (3-12 months)</h3>
              <div className="space-y-3">
                {section.longTerm.map((tactic: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{tactic}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="space-y-3">
                {section.kpis.map((kpi: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{kpi}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Criteria</h3>
              <div className="space-y-3">
                {section.successCriteria.map((criteria: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{criteria}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSection === section.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {renderSection()}
    </div>
  );
}
