/**
 * @fileoverview Progress components including progress bars, dots, and spinners
 */

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  total: number;
  current: number;
  label?: string;
  className?: string;
}

const PROGRESS_CONTAINER_CLASSES = 'space-y-2';
const PROGRESS_LABEL_CONTAINER_CLASSES = 'flex justify-between items-center';
const PROGRESS_LABEL_CLASSES = 'text-sm font-medium text-text-primary';
const PROGRESS_COUNT_CLASSES = 'text-sm text-text-secondary';
const PROGRESS_TRACK_CLASSES = 'w-full bg-border-subtle rounded-full h-1.5';
const PROGRESS_FILL_CLASSES =
  'bg-primary h-1.5 rounded-full transition-all duration-300 ease-out';

/**
 * @description Renders a progress bar with optional label and current/total count
 * @param total - Total number of items/steps
 * @param current - Current progress number
 * @param label - Optional label for the progress bar
 * @param className - Additional CSS classes
 */
export function ProgressBar({
  total,
  current,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={cn(PROGRESS_CONTAINER_CLASSES, className)}>
      {label && (
        <div className={PROGRESS_LABEL_CONTAINER_CLASSES}>
          <span className={PROGRESS_LABEL_CLASSES}>{label}</span>
          <span className={PROGRESS_COUNT_CLASSES}>
            {current} of {total}
          </span>
        </div>
      )}
      <div className={PROGRESS_TRACK_CLASSES}>
        <div
          className={PROGRESS_FILL_CLASSES}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ProgressDotsProps {
  steps: number;
  current: number;
  className?: string;
}

const DOTS_CONTAINER_CLASSES = 'flex items-center gap-2';
const DOT_BASE_CLASSES = 'w-2 h-2 rounded-full transition-all duration-200';
const DOT_ACTIVE_CLASSES = 'bg-primary';
const DOT_INACTIVE_CLASSES = 'bg-border-subtle';

/**
 * @description Renders progress dots indicating current step in a multi-step process
 * @param steps - Total number of steps
 * @param current - Current step number (0-based)
 * @param className - Additional CSS classes
 */
export function ProgressDots({ steps, current, className }: ProgressDotsProps) {
  return (
    <div className={cn(DOTS_CONTAINER_CLASSES, className)}>
      {Array.from({ length: steps }, (_, index) => {
        const isActive = index < current;
        const dotClasses = cn(
          DOT_BASE_CLASSES,
          isActive ? DOT_ACTIVE_CLASSES : DOT_INACTIVE_CLASSES
        );

        return <div key={index} className={dotClasses} />;
      })}
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'gray';
  className?: string;
}

const SPINNER_BASE_CLASSES =
  'animate-spin rounded-full border-2 border-current border-t-transparent';

const SPINNER_SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-12 h-12',
};

const SPINNER_COLOR_CLASSES = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  gray: 'text-text-secondary',
};

/**
 * @description Renders a loading spinner with customizable size and color
 * @param size - Spinner size (sm, md, lg)
 * @param color - Spinner color (primary, secondary, gray)
 * @param className - Additional CSS classes
 */
export function Spinner({
  size = 'md',
  color = 'primary',
  className,
}: SpinnerProps) {
  const spinnerClasses = cn(
    SPINNER_BASE_CLASSES,
    SPINNER_SIZE_CLASSES[size],
    SPINNER_COLOR_CLASSES[color],
    className
  );

  return (
    <div className={spinnerClasses} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
