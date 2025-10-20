import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlighted' | 'interactive';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const baseClasses = 'bg-bg-primary rounded-lg';

  const variantClasses = {
    default: 'border border-border-subtle shadow-none',
    elevated: 'border-transparent shadow-md',
    highlighted:
      'border-l-4 border-l-gold border-y border-r border-border-subtle shadow-none',
    interactive:
      'border border-border-subtle hover:bg-bg-secondary hover:shadow-md transition-all duration-150 cursor-pointer',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}
