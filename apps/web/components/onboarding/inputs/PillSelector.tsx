/**
 * @fileoverview Pill selector component for tag-like selection in onboarding forms
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PillSelectorProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function PillSelector({
  options,
  value,
  onChange,
  maxSelections,
  className,
}: PillSelectorProps) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (maxSelections === undefined || value.length < maxSelections) {
      onChange([...value, option]);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleToggle(option)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            value.includes(option)
              ? 'bg-primary text-text-inverse'
              : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
