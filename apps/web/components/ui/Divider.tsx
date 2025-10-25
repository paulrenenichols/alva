/**
 * @fileoverview Divider component for visual separation of content
 */

import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const VERTICAL_DIVIDER_CLASSES = 'w-px h-full bg-border-subtle';
const HORIZONTAL_DIVIDER_CLASSES = 'border-0 h-px bg-border-subtle';

/**
 * @description Renders a divider line for visual separation
 * @param orientation - Divider orientation (horizontal or vertical)
 * @param className - Additional CSS classes
 */
export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps) {
  const isVertical = orientation === 'vertical';

  if (isVertical) {
    return (
      <div
        className={cn(VERTICAL_DIVIDER_CLASSES, className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <hr
      className={cn(HORIZONTAL_DIVIDER_CLASSES, className)}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
