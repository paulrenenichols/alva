import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('w-px h-full bg-border-subtle', className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <hr
      className={cn('border-0 h-px bg-border-subtle', className)}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
