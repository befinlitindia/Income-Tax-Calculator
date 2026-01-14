import React from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  tooltip?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "0",
  tooltip,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, '');
    const numericValue = parseInt(val, 10);
    onChange(isNaN(numericValue) ? 0 : numericValue);
  };

  const formatDisplayValue = (num: number): string => {
    if (num === 0) return '';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {label}
        {tooltip && (
          <span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-muted text-muted-foreground cursor-help" title={tooltip}>
            ?
          </span>
        )}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
        <input
          type="text"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-field pl-8"
        />
      </div>
    </div>
  );
};
