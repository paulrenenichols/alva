/**
 * @fileoverview Reusable input component with label, error states, and helper text
 */

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
  helperText?: string;
  label?: string;
}

const BASE_INPUT_CLASSES = 'block w-full px-3 py-2 h-11 border rounded-md bg-bg-input text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-colors disabled:bg-bg-tertiary disabled:cursor-not-allowed';

const ERROR_INPUT_CLASSES = 'border-danger focus:ring-danger focus:border-danger';
const DEFAULT_INPUT_CLASSES = 'border-border-default';

const LABEL_CLASSES = 'block text-sm font-medium text-text-primary mb-2';

const HELPER_TEXT_CLASSES = 'mt-1 text-sm';
const ERROR_HELPER_CLASSES = 'text-danger';
const DEFAULT_HELPER_CLASSES = 'text-text-secondary';

/**
 * @description Renders an input field with optional label, error state, and helper text
 * @param className - Additional CSS classes
 * @param error - Whether to show error styling
 * @param helperText - Helper text to display below input
 * @param label - Label text for the input
 * @param props - Additional input HTML attributes
 */
export function Input({
  className,
  error,
  helperText,
  label,
  ...props
}: InputProps) {
  const inputClasses = cn(
    BASE_INPUT_CLASSES,
    error ? ERROR_INPUT_CLASSES : DEFAULT_INPUT_CLASSES,
    className
  );

  const helperTextClasses = cn(
    HELPER_TEXT_CLASSES,
    error ? ERROR_HELPER_CLASSES : DEFAULT_HELPER_CLASSES
  );

  return (
    <div className="w-full">
      {label && (
        <label className={LABEL_CLASSES}>
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {helperText && (
        <p className={helperTextClasses}>
          {helperText}
        </p>
      )}
    </div>
  );
}
