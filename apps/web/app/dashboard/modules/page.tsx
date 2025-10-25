/**
 * @fileoverview Dashboard modules page for managing marketing modules and features
 */

'use client';

import { useState, useEffect } from 'react';
import { ModuleCard } from '@/components/modules/ModuleCard';
import { apiClient } from '@alva/api-client';

interface Module {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  tasks: number;
  completed: number;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const modulesData = await apiClient.getModules();
      setModules(modulesData);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      // Fallback to default modules
      setModules([
        {
          id: 'email',
          title: 'Email Marketing',
          description: 'Automated email campaigns and newsletters',
          isActive: false,
          tasks: 0,
          completed: 0,
        },
        {
          id: 'social',
          title: 'Social Media',
          description: 'Content creation and social media management',
          isActive: false,
          tasks: 0,
          completed: 0,
        },
        {
          id: 'blog',
          title: 'Blog Content',
          description: 'SEO-optimized blog posts and content strategy',
          isActive: false,
          tasks: 0,
          completed: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (id: string, active: boolean) => {
    try {
      await apiClient.toggleModule(id, active);
      setModules((prev) =>
        prev.map((module) =>
          module.id === id ? { ...module, isActive: active } : module
        )
      );
    } catch (error) {
      console.error('Failed to toggle module:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Marketing Modules
        </h1>
        <p className="text-gray-600">
          Activate the marketing modules that align with your business goals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            {...module}
            icon={<ModuleIcon id={module.id} />}
            onToggle={handleToggleModule}
          />
        ))}
      </div>
    </div>
  );
}

function ModuleIcon({ id }: { id: string }) {
  const icons = {
    email: '📧',
    social: '📱',
    blog: '📝',
  };

  return (
    <span className="text-xl">{icons[id as keyof typeof icons] || '📦'}</span>
  );
}
