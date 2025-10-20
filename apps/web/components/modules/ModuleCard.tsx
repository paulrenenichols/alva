'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: (id: string, active: boolean) => void;
  tasks?: number;
  completed?: number;
}

export function ModuleCard({
  id,
  title,
  description,
  icon,
  isActive,
  onToggle,
  tasks = 0,
  completed = 0,
}: ModuleCardProps) {
  const progress = tasks > 0 ? (completed / tasks) * 100 : 0;

  return (
    <Card
      className={`p-6 transition-all ${
        isActive ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {isActive && tasks > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {completed}/{tasks} tasks
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <Button
        variant={isActive ? 'outline' : 'default'}
        onClick={() => onToggle(id, !isActive)}
        className="w-full"
      >
        {isActive ? 'Deactivate' : 'Activate'} Module
      </Button>
    </Card>
  );
}
