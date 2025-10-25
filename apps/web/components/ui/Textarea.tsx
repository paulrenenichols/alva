/**
 * @fileoverview Reusable textarea component with consistent styling
 */

import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const BASE_TEXTAREA_CLASSES = 'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

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