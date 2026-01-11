import { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={`mt-1 w-5 h-5 accent-terra-gold bg-terra-bg-light border-2 border-terra-wood-dark rounded focus:ring-2 focus:ring-terra-gold ${className}`}
            {...props}
          />
          <div className="flex-1">
            {label && (
              <span className="block text-sm font-bold text-terra-gold">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-slate-300 mt-0.5">
                {description}
              </span>
            )}
          </div>
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
