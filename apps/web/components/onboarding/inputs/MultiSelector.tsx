'use client';

import { cn } from '@/lib/utils';

interface MultiSelectorProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function MultiSelector({
  options,
  value,
  onChange,
  maxSelections,
  className,
}: MultiSelectorProps) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (maxSelections === undefined || value.length < maxSelections) {
      onChange([...value, option]);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
        >
          <input
            type="checkbox"
            checked={value.includes(option)}
            onChange={() => handleToggle(option)}
            disabled={
              !value.includes(option) &&
              maxSelections !== undefined &&
              value.length >= maxSelections
            }
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
}
