/**
 * @fileoverview Dashboard tasks page for managing marketing tasks and progress
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@alva/api-client';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  estimatedHours?: number;
  category?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'todo' | 'in-progress' | 'completed'
  >('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          const plan = plans[0];
          const tasksData = plan.tasks || [];
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) => filter === 'all' || task.status === filter
  );

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 1 week from now
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const getPriorityColor = (priority: Task['priority']) => {
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-muted text-success';
      case 'in-progress':
        return 'bg-secondary-muted text-secondary';
      case 'todo':
        return 'bg-bg-tertiary text-text-primary';
      default:
        return 'bg-bg-tertiary text-text-primary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tasks & To-Do</h1>
          <p className="text-text-secondary">Loading your tasks...</p>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tasks & To-Do</h1>
          <p className="text-text-secondary">
            Manage your marketing tasks and track progress
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-text-inverse"
        >
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="p-4">
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button
              onClick={handleAddTask}
              className="bg-primary text-text-inverse"
            >
              Add
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'todo', 'in-progress', 'completed'] as const).map(
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

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-text-secondary">
              <p className="text-lg mb-2">No tasks found</p>
              <p className="text-sm">Add a task to get started!</p>
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className={`text-lg font-semibold ${
                        task.status === 'completed'
                          ? 'line-through text-text-secondary'
                          : 'text-text-primary'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority} priority
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-text-secondary mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    {task.dueDate && (
                      <span>
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.estimatedHours && (
                      <span>⏱️ {task.estimatedHours}h estimated</span>
                    )}
                    {task.category && <span>📂 {task.category}</span>}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {task.status === 'todo' && (
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                      className="bg-primary text-text-inverse"
                    >
                      Start
                    </Button>
                  )}
                  {task.status === 'in-progress' && (
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                      className="bg-success text-text-inverse"
                    >
                      Complete
                    </Button>
                  )}
                  {task.status === 'completed' && (
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'todo')}
                      variant="secondary"
                    >
                      Reopen
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    variant="secondary"
                    className="text-danger hover:text-danger-hover"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
