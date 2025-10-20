import { cn } from '@/lib/utils';

interface ProgressBarProps {
  total: number;
  current: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  total,
  current,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <span className="text-sm text-text-secondary">
            {current} of {total}
          </span>
        </div>
      )}
      <div className="w-full bg-border-subtle rounded-full h-1.5">
        <div
          className="bg-gold h-1.5 rounded-full transition-all duration-300 ease-out"
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

export function ProgressDots({ steps, current, className }: ProgressDotsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: steps }, (_, index) => (
        <div
          key={index}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-200',
            index < current ? 'bg-gold' : 'bg-border-subtle'
          )}
        />
      ))}
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'blue' | 'gray';
  className?: string;
}

export function Spinner({
  size = 'md',
  color = 'gold',
  className,
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    gold: 'text-gold',
    blue: 'text-blue',
    gray: 'text-text-secondary',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
