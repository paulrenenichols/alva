'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// import { apiClient } from '@alva/api-client';

interface QuickWin {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
}

export default function DashboardPage() {
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch quick wins from API
    setQuickWins([
      {
        id: '1',
        title: 'Set up Google Analytics',
        description: 'Install Google Analytics tracking code on your website',
        estimatedTime: 15,
        priority: 'high',
        status: 'planned',
      },
      {
        id: '2',
        title: 'Create Facebook Business Page',
        description: 'Set up your business presence on Facebook',
        estimatedTime: 20,
        priority: 'medium',
        status: 'planned',
      },
    ]);
    setLoading(false);
  }, []);

  const handleStartTask = (taskId: string) => {
    // TODO: Update task status
    console.log('Starting task:', taskId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's on your agenda today.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Wins Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Daily Quick Wins
              </h2>
              <span className="text-sm text-gray-500">⚡ High Impact</span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ) : (
                quickWins.map((win) => (
                  <div
                    key={win.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{win.title}</h3>
                      <p className="text-sm text-gray-600">{win.description}</p>
                      <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {win.estimatedTime} min
                      </span>
                    </div>
                    <Button
                      onClick={() => handleStartTask(win.id)}
                      className="bg-primary-500 text-white"
                    >
                      Start Task
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Plan Overview */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Overview
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">12</div>
                <div className="text-sm text-gray-600">Tasks Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10h</div>
                <div className="text-sm text-gray-600">Weekly Capacity</div>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-primary-500 text-white"
              onClick={() => (window.location.href = '/dashboard/plan')}
            >
              View Full Plan
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
