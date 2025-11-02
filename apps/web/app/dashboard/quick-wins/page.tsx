/**
 * @fileoverview Dashboard quick wins page displaying actionable marketing opportunities
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@alva/api-client';

interface QuickWin {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
  category?: string;
}

export default function QuickWinsPage() {
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'planned' | 'in-progress' | 'completed'
  >('all');

  useEffect(() => {
    const fetchQuickWins = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          const plan = plans[0];
          const quickWinsData = plan.quickWins || [];
          setQuickWins(quickWinsData);
        }
      } catch (error) {
        console.error('Failed to fetch quick wins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickWins();
  }, []);

  const filteredWins = quickWins.filter(
    (win) => filter === 'all' || win.status === filter
  );

  const handleUpdateStatus = async (
    winId: string,
    newStatus: QuickWin['status']
  ) => {
    // TODO: Update task status via API
    setQuickWins((prev) =>
      prev.map((win) =>
        win.id === winId ? { ...win, status: newStatus } : win
      )
    );
  };

  const getPriorityColor = (priority: QuickWin['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-muted text-danger';
      case 'medium':
        return 'bg-warning-muted text-warning';
      case 'low':
        return 'bg-success-muted text-success';
      default:
        return 'bg-bg-tertiary text-text-primary';
    }
  };

  const getStatusColor = (status: QuickWin['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-muted text-success';
      case 'in-progress':
        return 'bg-secondary-muted text-secondary';
      case 'planned':
        return 'bg-bg-tertiary text-text-primary';
      default:
        return 'bg-bg-tertiary text-text-primary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Daily Quick Wins</h1>
          <p className="text-text-secondary">Loading your quick wins...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-bg-tertiary rounded-lg"></div>
          <div className="h-24 bg-bg-tertiary rounded-lg"></div>
          <div className="h-24 bg-bg-tertiary rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Daily Quick Wins</h1>
        <p className="text-text-secondary">
          High-impact tasks you can complete in 30 minutes or less
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'planned', 'in-progress', 'completed'] as const).map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'secondary'}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status.replace('-', ' ')}
            </Button>
          )
        )}
      </div>

      {/* Quick Wins List */}
      <div className="grid gap-4">
        {filteredWins.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-text-tertiary">
              <p className="text-lg mb-2">No quick wins found</p>
              <p className="text-sm">
                Complete your onboarding to generate personalized quick wins!
              </p>
            </div>
          </Card>
        ) : (
          filteredWins.map((win) => (
            <Card key={win.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {win.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        win.priority
                      )}`}
                    >
                      {win.priority} priority
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        win.status
                      )}`}
                    >
                      {win.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-3">{win.description}</p>
                  <div className="flex items-center gap-4 text-sm text-text-tertiary">
                    <span>⏱️ {win.estimatedTime} minutes</span>
                    {win.category && <span>📂 {win.category}</span>}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {win.status === 'planned' && (
                    <Button
                      onClick={() => handleUpdateStatus(win.id, 'in-progress')}
                      className="bg-primary text-text-inverse"
                    >
                      Start
                    </Button>
                  )}
                  {win.status === 'in-progress' && (
                    <Button
                      onClick={() => handleUpdateStatus(win.id, 'completed')}
                      className="bg-success text-text-inverse"
                    >
                      Complete
                    </Button>
                  )}
                  {win.status === 'completed' && (
                    <Button
                      onClick={() => handleUpdateStatus(win.id, 'planned')}
                      variant="secondary"
                    >
                      Restart
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
