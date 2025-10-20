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
          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
        >
          <input
            type="radio"
            name="radio-group"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
}
