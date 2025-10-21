import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
  helperText?: string;
  label?: string;
}

export function Input({
  className,
  error,
  helperText,
  label,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'block w-full px-3 py-2 h-11 border rounded-md bg-bg-elevated text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-colors disabled:bg-bg-tertiary disabled:cursor-not-allowed',
          error
            ? 'border-danger focus:ring-danger focus:border-danger'
            : 'border-border-default',
          className
        )}
        {...props}
      />
      {helperText && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-danger' : 'text-text-secondary'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
