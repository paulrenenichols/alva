/**
 * @fileoverview Reusable feature card component with icon, title, and description
 */

'use client';

import { HeadingCard, BodyDefault } from './Typography';
import {
  Brain,
  Clock,
  Target,
  BarChart3,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  clock: Clock,
  target: Target,
  chart: BarChart3,
  users: Users,
  zap: Zap,
};

/**
 * @description Renders a feature card with icon, title, and description
 * @param icon - Icon identifier to map to Lucide icon component
 * @param title - Feature title text
 * @param description - Feature description text
 * @param className - Optional additional CSS classes
 */
export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    throw new Error(`Icon "${icon}" not found in iconMap`);
  }

  return (
    <div
      className={`bg-bg-elevated rounded-lg p-6 shadow-sm border border-border-subtle ${className}`}
    >
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
        <IconComponent className="w-6 h-6 text-text-inverse" />
      </div>
      <HeadingCard className="mb-2">{title}</HeadingCard>
      <BodyDefault className="text-text-secondary">{description}</BodyDefault>
    </div>
  );
}
