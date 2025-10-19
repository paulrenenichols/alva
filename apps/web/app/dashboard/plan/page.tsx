'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { apiClient } from '@alva/api-client';

interface Task {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  status: 'planned' | 'in-progress' | 'completed';
  category:
    | 'setup'
    | 'content'
    | 'ads'
    | 'analytics'
    | 'social'
    | 'email'
    | 'blog';
}

export default function MarketingPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          setPlan(plans[0]);
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading your marketing plan...</p>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No marketing plan found. Please complete the onboarding to generate one.
        <Button
          onClick={() => (window.location.href = '/onboarding/welcome')}
          className="mt-4 bg-primary-500 text-white"
        >
          Start Onboarding
        </Button>
      </Card>
    );
  }

  const tasksByCategory = (plan.tasks || []).reduce(
    (acc: Record<string, Task[]>, task: Task) => {
      if (!acc[task.category]) acc[task.category] = [];
      acc[task.category].push(task);
      return acc;
    },
    {}
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blog':
        return '📝';
      case 'email':
        return '📧';
      case 'social':
        return '📱';
      case 'ads':
        return '🎯';
      case 'analytics':
        return '📊';
      case 'setup':
        return '⚙️';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Your Marketing Plan
        </h1>
        <p className="text-gray-600">
          A comprehensive strategy across all marketing channels
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks:</span>
                  <span className="font-medium">{plan.tasks?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Hours:</span>
                  <span className="font-medium">
                    {plan.tasks?.reduce(
                      (sum: number, task: Task) => sum + task.estimated_hours,
                      0
                    ) || 0}
                    h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Capacity:</span>
                  <span className="font-medium">
                    {plan.plan?.weekly_capacity_hours || 10}h
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {plan.tasks?.filter((t: Task) => t.status === 'completed')
                      .length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-medium text-blue-600">
                    {plan.tasks?.filter((t: Task) => t.status === 'in-progress')
                      .length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned:</span>
                  <span className="font-medium text-gray-600">
                    {plan.tasks?.filter((t: Task) => t.status === 'planned')
                      .length || 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Modules Active
              </h3>
              <div className="space-y-2">
                {plan.meta?.modules_merged?.map((module: string) => (
                  <div key={module} className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    <span className="text-sm capitalize">{module}</span>
                  </div>
                )) || <span className="text-gray-500">No modules active</span>}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(tasksByCategory).map(([category, tasks]) => (
              <Card key={category} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {task.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {task.description}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{task.estimated_hours}h</span>
                        <span>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Task Timeline
            </h3>
            <div className="space-y-4">
              {plan.tasks
                ?.sort(
                  (a: Task, b: Task) =>
                    new Date(a.due_date).getTime() -
                    new Date(b.due_date).getTime()
                )
                .map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.estimated_hours}h
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blog Module
              </h3>
              <p className="text-gray-600 mb-4">
                Generate blog content and manage your content calendar
              </p>
              <Button className="bg-primary-500 text-white">
                Generate Blog Post
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Email Module
              </h3>
              <p className="text-gray-600 mb-4">
                Create email campaigns and automate your email marketing
              </p>
              <Button className="bg-primary-500 text-white">
                Create Email Campaign
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Social Media Module
              </h3>
              <p className="text-gray-600 mb-4">
                Generate social media content for all platforms
              </p>
              <Button className="bg-primary-500 text-white">
                Generate Social Content
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Analytics Module
              </h3>
              <p className="text-gray-600 mb-4">
                Track performance and optimize your marketing efforts
              </p>
              <Button className="bg-primary-500 text-white">
                View Analytics
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
