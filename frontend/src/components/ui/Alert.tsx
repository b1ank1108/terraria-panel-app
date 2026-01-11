import type { HTMLAttributes } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export function Alert({ variant = 'info', className = '', children, ...props }: AlertProps) {
  const styles = {
    info: 'bg-terra-blue border-terra-gold text-white',
    success: 'bg-terra-green border-terra-gold text-white',
    warning: 'bg-amber-600 border-terra-gold text-white',
    error: 'bg-terra-red border-terra-gold text-white',
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 border-2 shadow-terra-sm ${styles[variant]} ${className}`}
      style={{
        borderStyle: 'solid',
        borderWidth: '3px',
        borderColor: '#FFD700',
      }}
      {...props}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-terra-gold" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
