/**
 * @fileoverview Radio selector component for single-choice options in onboarding forms
 */

'use client';

import { cn } from '@/lib/utils';

interface RadioSelectorProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioSelector({
  options,
  value,
  onChange,
  className,
}: RadioSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-bg-secondary"
        >
          <input
            type="radio"
            name="radio-group"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-primary border-border-default focus:ring-primary"
          />
          <span className="text-text-primary">{option}</span>
        </label>
      ))}
    </div>
  );
}
