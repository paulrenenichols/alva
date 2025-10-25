/**
 * @fileoverview Reusable button component with variants, sizes, and loading states
 */

'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50';

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active font-semibold',
  secondary:
    'bg-bg-secondary text-text-primary border border-border-default hover:bg-bg-tertiary',
  ghost: 'text-text-primary hover:bg-bg-secondary',
  destructive:
    'bg-danger text-text-inverse hover:bg-danger-hover active:bg-danger-active',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-8 text-base',
};

/**
 * @description Renders a button with customizable variants, sizes, and loading states
 * @param variant - Button style variant (primary, secondary, ghost, destructive)
 * @param size - Button size (sm, md, lg)
 * @param loading - Whether to show loading spinner
 * @param className - Additional CSS classes
 * @param children - Button content
 * @param disabled - Whether button is disabled
 * @param props - Additional button HTML attributes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonClasses = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
