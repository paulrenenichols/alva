'use client';

interface RadioSelectorProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioSelector({ options, selected, onChange, name }: RadioSelectorProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={selected === option}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
          />
          <span className="text-gray-700 font-medium">{option}</span>
        </label>
      ))}
    </div>
  );
}
