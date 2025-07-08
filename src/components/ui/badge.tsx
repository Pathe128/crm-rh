import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'accent' | 'info' | 'neutral';
  className?: string;
}

const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium';
const variantClasses = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  outline: 'border border-gray-300 text-gray-800',
  ghost: 'bg-transparent text-gray-800',
  accent: 'bg-green-200 text-green-900',
  info: 'bg-cyan-100 text-cyan-800',
  neutral: 'bg-gray-200 text-gray-700',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[
          baseClasses,
          variantClasses[variant],
          className,
        ].join(' ')}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge'; 