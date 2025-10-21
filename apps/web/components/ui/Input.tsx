import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'block w-full px-3 py-2 h-11 border border-border-default rounded-lg bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-150 disabled:bg-bg-tertiary disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}
