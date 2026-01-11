import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'terra-btn inline-flex items-center justify-center';

    const variantStyles = {
      primary: 'terra-btn-primary',
      secondary: 'terra-btn-secondary',
      danger: 'terra-btn-danger',
    };

    const sizeStyles = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
