'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Progress';
import {
  HeadingPage,
  HeadingCard,
  BodyDefault,
  BodySmall,
  Caption,
} from '@/components/ui/Typography';
import { Grid, Stack } from '@/components/ui/Layout';
import { MainLayout } from '@/components/layout/MainLayout';

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
    const fetchQuickWins = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          const plan = plans[0];
          const quickWinsData = plan.quickWins || plan.tasks?.slice(0, 3) || [];
          setQuickWins(quickWinsData);
        } else {
          // Fallback to mock data
          setQuickWins([
            {
              id: '1',
              title: 'Set up Google Analytics',
              description:
                'Install Google Analytics tracking code on your website',
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
        }
      } catch (error) {
        console.error('Failed to fetch quick wins:', error);
        // Fallback to mock data
        setQuickWins([
          {
            id: '1',
            title: 'Set up Google Analytics',
            description:
              'Install Google Analytics tracking code on your website',
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
      } finally {
        setLoading(false);
      }
    };

    fetchQuickWins();
  }, []);

  const handleStartTask = (taskId: string) => {
    // TODO: Update task status
    console.log('Starting task:', taskId);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stack spacing="lg">
          <div>
            <HeadingPage>Dashboard</HeadingPage>
            <BodyDefault className="mt-2">
              Welcome back! Here's what's on your agenda today.
            </BodyDefault>
          </div>

          <Grid cols={3} gap="lg">
            {/* Quick Wins Card */}
            <div className="lg:col-span-2">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <HeadingCard>Daily Quick Wins</HeadingCard>
                    <Badge variant="gold">⚡ High Impact</Badge>
                  </div>
                </CardHeader>

                <CardBody>
                  <Stack spacing="md">
                    {loading ? (
                      <div className="space-y-4">
                        <div className="h-20 bg-bg-tertiary rounded-lg animate-pulse"></div>
                        <div className="h-20 bg-bg-tertiary rounded-lg animate-pulse"></div>
                      </div>
                    ) : (
                      quickWins.map((win) => (
                        <Card
                          key={win.id}
                          variant="interactive"
                          className="p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <HeadingCard className="text-base">
                                {win.title}
                              </HeadingCard>
                              <BodySmall className="mt-1">
                                {win.description}
                              </BodySmall>
                              <Badge variant="gold" size="sm" className="mt-2">
                                {win.estimatedTime} min
                              </Badge>
                            </div>
                            <Button
                              onClick={() => handleStartTask(win.id)}
                              variant="primary"
                              size="sm"
                            >
                              Start Task
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </Stack>
                </CardBody>
              </Card>
            </div>

            {/* Plan Overview */}
            <div>
              <Card variant="elevated">
                <CardHeader>
                  <HeadingCard>Plan Overview</HeadingCard>
                </CardHeader>
                <CardBody>
                  <Stack spacing="md">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold">12</div>
                      <Caption>Tasks Planned</Caption>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green">3</div>
                      <Caption>Completed</Caption>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue">10h</div>
                      <Caption>Weekly Capacity</Caption>
                    </div>
                  </Stack>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => (window.location.href = '/dashboard/plan')}
                  >
                    View Full Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Grid>
        </Stack>
      </div>
    </MainLayout>
  );
}
