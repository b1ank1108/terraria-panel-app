import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'dark';
}

export function Card({ className = '', children, variant = 'default', ...props }: CardProps) {
  const variantStyles = {
    default: 'terra-card',
    gold: 'terra-card !border-terra-gold',
    dark: 'terra-card !bg-terra-bg-light !border-terra-wood-dark',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
