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
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
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

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & To-Do</h1>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & To-Do</h1>
          <p className="text-gray-600">
            Manage your marketing tasks and track progress
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-500 text-white"
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
            <Button onClick={handleAddTask} className="bg-primary-500 text-white">
              Add
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'todo', 'in-progress', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'outline'}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status.replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
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
                    <h3 className={`text-lg font-semibold ${
                      task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority} priority
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
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
                      className="bg-primary-500 text-white"
                    >
                      Start
                    </Button>
                  )}
                  {task.status === 'in-progress' && (
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                      className="bg-green-500 text-white"
                    >
                      Complete
                    </Button>
                  )}
                  {task.status === 'completed' && (
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'todo')}
                      variant="outline"
                    >
                      Reopen
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
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
