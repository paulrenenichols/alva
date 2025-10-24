/**
 * @fileoverview Form field components for consistent form styling and validation
 */

import { cn } from '@/lib/utils';
import { Input } from './Input';

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FORM_FIELD_CONTAINER_CLASSES = 'space-y-2';
const FORM_LABEL_CLASSES = 'block text-sm font-medium text-text-primary';
const REQUIRED_INDICATOR_CLASSES = 'text-danger ml-1';
const ERROR_TEXT_CLASSES = 'text-sm text-danger flex items-center gap-1';
const ERROR_ICON_CLASSES = 'w-4 h-4';
const HELPER_TEXT_CLASSES = 'text-sm text-text-secondary';

/**
 * @description Renders a form field with label, error handling, and helper text
 * @param label - Field label text
 * @param error - Error message to display
 * @param helperText - Helper text to display when no error
 * @param required - Whether the field is required
 * @param children - Form input element
 * @param className - Additional CSS classes
 */
export function FormField({
  label,
  error,
  helperText,
  required,
  children,
  className,
}: FormFieldProps) {
  const hasError = !!error;
  const shouldShowHelperText = !!helperText && !hasError;

  return (
    <div className={cn(FORM_FIELD_CONTAINER_CLASSES, className)}>
      {label && (
        <label className={FORM_LABEL_CLASSES}>
          {label}
          {required && <span className={REQUIRED_INDICATOR_CLASSES}>*</span>}
        </label>
      )}
      {children}
      {hasError && (
        <p className={ERROR_TEXT_CLASSES}>
          <svg
            className={ERROR_ICON_CLASSES}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {shouldShowHelperText && (
        <p className={HELPER_TEXT_CLASSES}>{helperText}</p>
      )}
    </div>
  );
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @description Renders a standalone label element
 * @param children - Label content
 * @param className - Additional CSS classes
 */
export function Label({ children, className }: LabelProps) {
  return (
    <label className={cn(FORM_LABEL_CLASSES, className)}>{children}</label>
  );
}

interface ErrorTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @description Renders error text with an error icon
 * @param children - Error message content
 * @param className - Additional CSS classes
 */
export function ErrorText({ children, className }: ErrorTextProps) {
  return (
    <p className={cn(ERROR_TEXT_CLASSES, className)}>
      <svg
        className={ERROR_ICON_CLASSES}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </p>
  );
}

interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @description Renders helper text for form fields
 * @param children - Helper text content
 * @param className - Additional CSS classes
 */
export function HelperText({ children, className }: HelperTextProps) {
  return <p className={cn(HELPER_TEXT_CLASSES, className)}>{children}</p>;
}
