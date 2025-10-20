import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-gold text-text-primary hover:bg-gold-light active:bg-gold-dark focus:ring-gold shadow-sm',
    secondary:
      'bg-white text-text-primary border border-border-default hover:bg-bg-secondary active:bg-bg-tertiary focus:ring-gold',
    outline:
      'border border-border-default bg-white text-text-primary hover:bg-bg-secondary focus:ring-gold',
    ghost: 'text-blue hover:bg-blue-muted focus:ring-blue',
    destructive:
      'bg-red text-white hover:bg-red-light active:bg-red-dark focus:ring-red',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
