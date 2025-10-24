/**
 * @fileoverview Reusable badge component with color variants and sizes
 */

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'blue' | 'green' | 'red' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

const BASE_BADGE_CLASSES = 'inline-flex items-center font-medium rounded-full';

const BADGE_VARIANT_CLASSES = {
  default: 'bg-bg-tertiary text-text-primary',
  gold: 'bg-gold text-text-primary',
  blue: 'bg-blue text-white',
  green: 'bg-green text-white',
  red: 'bg-red text-white',
  gray: 'bg-text-tertiary text-white',
};

const BADGE_SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

/**
 * @description Renders a badge with customizable variants and sizes
 * @param children - Badge content
 * @param variant - Badge color variant (default, gold, blue, green, red, gray)
 * @param size - Badge size (sm, md)
 * @param className - Additional CSS classes
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const badgeClasses = cn(
    BASE_BADGE_CLASSES,
    BADGE_VARIANT_CLASSES[variant],
    BADGE_SIZE_CLASSES[size],
    className
  );

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
}
