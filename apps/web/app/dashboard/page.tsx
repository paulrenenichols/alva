/**
 * @fileoverview Dashboard page displaying quick wins and plan overview
 */

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
import { apiClient } from '@alva/api-client';

interface QuickWin {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
}

const PAGE_CONTAINER_CLASSES = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
const QUICK_WINS_CARD_SPAN = 'lg:col-span-2';
const LOADING_SKELETON_CLASSES = 'h-20 bg-bg-tertiary rounded-lg animate-pulse';
const QUICK_WIN_CARD_CLASSES = 'p-4';
const QUICK_WIN_CONTENT_CLASSES = 'flex items-center justify-between';
const QUICK_WIN_DETAILS_CLASSES = 'flex-1';
const QUICK_WIN_TITLE_CLASSES = 'text-base';
const QUICK_WIN_DESCRIPTION_CLASSES = 'mt-1';
const QUICK_WIN_TIME_BADGE_CLASSES = 'mt-2';
const PLAN_OVERVIEW_CONTAINER_CLASSES = 'text-center';
const PLAN_METRIC_CLASSES = 'text-2xl font-bold';
const PLAN_METRIC_GOLD_CLASSES = 'text-gold';
const PLAN_METRIC_GREEN_CLASSES = 'text-green';
const PLAN_METRIC_BLUE_CLASSES = 'text-blue';
const PLAN_BUTTON_CLASSES = 'w-full';

const MOCK_QUICK_WINS: QuickWin[] = [
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
];

/**
 * @description Dashboard page component displaying quick wins and plan overview
 */
export default function DashboardPage() {
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @description Fetches quick wins data from API or falls back to mock data
   */
  const fetchQuickWins = async (): Promise<void> => {
    try {
      const plans = await apiClient.getUserPlans();
      const hasPlans = plans.length > 0;
      
      if (hasPlans) {
        const plan = plans[0];
        const quickWinsData = plan.quickWins || plan.tasks?.slice(0, 3) || [];
        setQuickWins(quickWinsData);
      } else {
        setQuickWins(MOCK_QUICK_WINS);
      }
    } catch (error) {
      console.error('Failed to fetch quick wins:', error);
      setQuickWins(MOCK_QUICK_WINS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickWins();
  }, []);

  /**
   * @description Handles starting a task
   * @param taskId - ID of the task to start
   */
  const handleStartTask = (taskId: string): void => {
    // TODO: Update task status
    console.log('Starting task:', taskId);
  };

  /**
   * @description Handles navigation to full plan view
   */
  const handleViewFullPlan = (): void => {
    window.location.href = '/dashboard/plan';
  };

  /**
   * @description Renders loading skeleton for quick wins
   * @returns Loading skeleton JSX
   */
  const renderLoadingSkeleton = (): JSX.Element => (
    <div className="space-y-4">
      <div className={LOADING_SKELETON_CLASSES} />
      <div className={LOADING_SKELETON_CLASSES} />
    </div>
  );

  /**
   * @description Renders a quick win card
   * @param win - Quick win data
   * @returns Quick win card JSX
   */
  const renderQuickWinCard = (win: QuickWin): JSX.Element => (
    <Card key={win.id} variant="interactive" className={QUICK_WIN_CARD_CLASSES}>
      <div className={QUICK_WIN_CONTENT_CLASSES}>
        <div className={QUICK_WIN_DETAILS_CLASSES}>
          <HeadingCard className={QUICK_WIN_TITLE_CLASSES}>
            {win.title}
          </HeadingCard>
          <BodySmall className={QUICK_WIN_DESCRIPTION_CLASSES}>
            {win.description}
          </BodySmall>
          <Badge variant="gold" size="sm" className={QUICK_WIN_TIME_BADGE_CLASSES}>
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
  );

  /**
   * @description Renders plan overview metrics
   * @returns Plan overview JSX
   */
  const renderPlanOverview = (): JSX.Element => (
    <Card variant="elevated">
      <CardHeader>
        <HeadingCard>Plan Overview</HeadingCard>
      </CardHeader>
      <CardBody>
        <Stack spacing="md">
          <div className={PLAN_OVERVIEW_CONTAINER_CLASSES}>
            <div className={`${PLAN_METRIC_CLASSES} ${PLAN_METRIC_GOLD_CLASSES}`}>12</div>
            <Caption>Tasks Planned</Caption>
          </div>
          <div className={PLAN_OVERVIEW_CONTAINER_CLASSES}>
            <div className={`${PLAN_METRIC_CLASSES} ${PLAN_METRIC_GREEN_CLASSES}`}>3</div>
            <Caption>Completed</Caption>
          </div>
          <div className={PLAN_OVERVIEW_CONTAINER_CLASSES}>
            <div className={`${PLAN_METRIC_CLASSES} ${PLAN_METRIC_BLUE_CLASSES}`}>10h</div>
            <Caption>Weekly Capacity</Caption>
          </div>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          className={PLAN_BUTTON_CLASSES}
          onClick={handleViewFullPlan}
        >
          View Full Plan
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <MainLayout>
      <div className={PAGE_CONTAINER_CLASSES}>
        <Stack spacing="lg">
          <div>
            <HeadingPage>Dashboard</HeadingPage>
            <BodyDefault className="mt-2">
              Welcome back! Here's what's on your agenda today.
            </BodyDefault>
          </div>

          <Grid cols={3} gap="lg">
            {/* Quick Wins Card */}
            <div className={QUICK_WINS_CARD_SPAN}>
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <HeadingCard>Daily Quick Wins</HeadingCard>
                    <Badge variant="gold">⚡ High Impact</Badge>
                  </div>
                </CardHeader>

                <CardBody>
                  <Stack spacing="md">
                    {isLoading ? renderLoadingSkeleton() : quickWins.map(renderQuickWinCard)}
                  </Stack>
                </CardBody>
              </Card>
            </div>

            {/* Plan Overview */}
            <div>
              {renderPlanOverview()}
            </div>
          </Grid>
        </Stack>
      </div>
    </MainLayout>
  );
}
