'use client';

interface PillSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  maxSelections?: number;
}

export function PillSelector({
  options,
  selected,
  onChange,
  multiSelect = true,
  maxSelections,
}: PillSelectorProps) {
  const handleToggle = (option: string) => {
    if (multiSelect) {
      const newSelected = selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option];

      if (!maxSelections || newSelected.length <= maxSelections) {
        onChange(newSelected);
      }
    } else {
      onChange([option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected.includes(option)
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
