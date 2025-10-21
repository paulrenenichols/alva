import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlighted' | 'interactive';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const baseClasses = 'bg-bg-elevated rounded-lg';

  const variantClasses = {
    default: 'border border-border-subtle shadow-none',
    elevated: 'border-transparent shadow-md',
    highlighted:
      'border-l-4 border-l-primary border-y border-r border-border-subtle shadow-none',
    interactive:
      'border border-border-subtle hover:bg-bg-secondary hover:shadow-md transition-all duration-150 cursor-pointer',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('p-6 py-4', className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn('p-6 pt-4', className)}>{children}</div>;
}
