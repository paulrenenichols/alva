/**
 * @fileoverview Reusable textarea component with consistent styling
 */

import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const BASE_TEXTAREA_CLASSES = 'block w-full px-3 py-2 border border-border-default rounded-lg bg-bg-input text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-colors';

/**
 * @description Renders a textarea input with consistent styling
 * @param className - Additional CSS classes
 * @param props - Additional textarea HTML attributes
 */
export function Textarea({ className, ...props }: TextareaProps) {
  const textareaClasses = cn(BASE_TEXTAREA_CLASSES, className);

  return (
    <textarea
      className={textareaClasses}
      {...props}
    />
  );
}