import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-terra-gold mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`terra-input w-full px-3 py-2 ${error ? '!border-terra-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-terra-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
