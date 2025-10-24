/**
 * @fileoverview Module card component for displaying and managing marketing modules
 */

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

const CARD_BASE_CLASSES = 'p-6 transition-all';
const CARD_ACTIVE_CLASSES = 'ring-2 ring-primary-500';
const HEADER_CONTAINER_CLASSES = 'flex items-start justify-between mb-4';
const ICON_CONTAINER_CLASSES = 'flex items-center space-x-3';
const ICON_WRAPPER_CLASSES = 'w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center';
const TITLE_CLASSES = 'text-lg font-semibold text-gray-900';
const DESCRIPTION_CLASSES = 'text-sm text-gray-600';
const PROGRESS_CONTAINER_CLASSES = 'mb-4';
const PROGRESS_HEADER_CLASSES = 'flex justify-between text-sm text-gray-600 mb-1';
const PROGRESS_TRACK_CLASSES = 'w-full bg-gray-200 rounded-full h-2';
const PROGRESS_FILL_CLASSES = 'bg-primary-500 h-2 rounded-full transition-all';
const BUTTON_CLASSES = 'w-full';

/**
 * @description Renders a module card with activation controls and progress tracking
 * @param id - Unique module identifier
 * @param title - Module title
 * @param description - Module description
 * @param icon - Module icon component
 * @param isActive - Whether the module is currently active
 * @param onToggle - Callback for toggling module activation
 * @param tasks - Total number of tasks in the module
 * @param completed - Number of completed tasks
 */
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
  const hasTasks = tasks > 0;
  const shouldShowProgress = isActive && hasTasks;

  /**
   * @description Handles module toggle action
   */
  const handleToggle = (): void => {
    onToggle(id, !isActive);
  };

  /**
   * @description Gets the CSS classes for the card based on active state
   * @returns Combined CSS classes for the card
   */
  const getCardClasses = (): string => {
    return `${CARD_BASE_CLASSES} ${isActive ? CARD_ACTIVE_CLASSES : ''}`;
  };

  /**
   * @description Gets the button variant based on active state
   * @returns Button variant string
   */
  const getButtonVariant = (): 'primary' | 'secondary' => {
    return isActive ? 'secondary' : 'primary';
  };

  /**
   * @description Gets the button text based on active state
   * @returns Button text string
   */
  const getButtonText = (): string => {
    return isActive ? 'Deactivate' : 'Activate';
  };

  /**
   * @description Gets the badge variant based on active state
   * @returns Badge variant string
   */
  const getBadgeVariant = (): 'success' | 'default' => {
    return isActive ? 'success' : 'default';
  };

  return (
    <Card className={getCardClasses()}>
      <div className={HEADER_CONTAINER_CLASSES}>
        <div className={ICON_CONTAINER_CLASSES}>
          <div className={ICON_WRAPPER_CLASSES}>
            {icon}
          </div>
          <div>
            <h3 className={TITLE_CLASSES}>{title}</h3>
            <p className={DESCRIPTION_CLASSES}>{description}</p>
          </div>
        </div>
        <Badge variant={getBadgeVariant()}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {shouldShowProgress && (
        <div className={PROGRESS_CONTAINER_CLASSES}>
          <div className={PROGRESS_HEADER_CLASSES}>
            <span>Progress</span>
            <span>
              {completed}/{tasks} tasks
            </span>
          </div>
          <div className={PROGRESS_TRACK_CLASSES}>
            <div
              className={PROGRESS_FILL_CLASSES}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Button
        variant={getButtonVariant()}
        onClick={handleToggle}
        className={BUTTON_CLASSES}
      >
        {getButtonText()} Module
      </Button>
    </Card>
  );
}
