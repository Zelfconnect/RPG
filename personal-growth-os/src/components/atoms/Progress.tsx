import React from 'react';

type ProgressVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'gray';
type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

interface ProgressProps {
  value: number; // 0-100
  max?: number; // default is 100
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
  animation?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  className = '',
  valueClassName = '',
  animation = true,
}) => {
  // Calculate percentage (ensure it's within 0-100)
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    gray: 'bg-gray-500',
  };
  
  // Size-specific classes
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  // Animation classes
  const animationClasses = animation ? 'transition-all duration-300 ease-in-out' : '';
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className={`text-sm font-medium text-gray-500 ${valueClassName}`}>
              {value} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} ${animationClasses} rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default Progress; 