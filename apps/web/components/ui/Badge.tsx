import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-primary-500 text-white',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-300 text-gray-700',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
}
