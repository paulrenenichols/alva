'use client';

interface MultiSelectorProps {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

export function MultiSelector({ options, selected, onChange, maxSelections }: MultiSelectorProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      if (maxSelections && selected.length >= maxSelections) {
        return; // Don't add if max selections reached
      }
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      {maxSelections && (
        <div className="text-sm text-gray-600 mb-3">
          Select up to {maxSelections} options ({selected.length}/{maxSelections} selected)
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors ${
              selected.includes(option)
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              disabled={!selected.includes(option) && !!(maxSelections && selected.length >= maxSelections)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50"
            />
            <span className="font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
