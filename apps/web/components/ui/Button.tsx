'use client';

import { cn } from '@/lib/utils';
import React from 'react';

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
      'text-black hover:bg-yellow-300 active:bg-yellow-400 active:scale-95',
    secondary:
      'bg-white text-black border border-gray-300 hover:bg-gray-50 active:bg-gray-100 active:scale-95',
    outline:
      'border border-gray-300 bg-white text-black hover:bg-gray-50 active:scale-95',
    ghost: 'text-blue-600 hover:bg-blue-50 active:scale-95',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 active:scale-95',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-8',
    md: 'px-5 py-2.5 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#FFD700', // gold
      color: '#1F1F1F', // text-primary
    },
    secondary: {
      backgroundColor: '#FFFFFF', // bg-primary
      color: '#1F1F1F', // text-primary
      borderColor: '#CCCCCC', // border-default
    },
    outline: {
      backgroundColor: '#FFFFFF', // bg-primary
      color: '#1F1F1F', // text-primary
      borderColor: '#CCCCCC', // border-default
    },
    ghost: {
      color: '#007BFF', // blue
      backgroundColor: 'transparent',
    },
    destructive: {
      backgroundColor: '#D32F2F', // red
      color: '#FFFFFF', // text-inverse
    },
  };

  const hoverStyles = {
    primary: { backgroundColor: '#FFE44D' }, // gold-light
    secondary: { backgroundColor: '#FAFAFA' }, // bg-secondary
    outline: { backgroundColor: '#FAFAFA' }, // bg-secondary
    ghost: { backgroundColor: '#CCE5FF' }, // blue-muted
    destructive: { backgroundColor: '#EF5350' }, // red-light
  };

  const activeStyles = {
    primary: { backgroundColor: '#E6C200' }, // gold-dark
    secondary: { backgroundColor: '#F0F0F0' }, // bg-tertiary
    outline: { backgroundColor: '#F0F0F0' }, // bg-tertiary
    ghost: { backgroundColor: '#CCE5FF' }, // blue-muted
    destructive: { backgroundColor: '#B71C1C' }, // red-dark
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={
        {
          ...variantStyles[variant],
          '--hover-bg': hoverStyles[variant].backgroundColor,
          '--active-bg': activeStyles[variant].backgroundColor,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          hoverStyles[variant].backgroundColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          variantStyles[variant].backgroundColor;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.backgroundColor =
          activeStyles[variant].backgroundColor;
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.backgroundColor =
          hoverStyles[variant].backgroundColor;
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
