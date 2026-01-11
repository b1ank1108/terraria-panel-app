import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-terra-gold mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`terra-input w-full px-3 py-2 ${error ? '!border-terra-red' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-terra-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
