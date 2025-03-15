import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary-light text-white',
    secondary: 'bg-secondary-light text-white',
    accent: 'bg-accent-light text-gray-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Rounded style
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // Combine all classes
  const badgeClasses = `
    inline-flex items-center justify-center font-medium
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClasses}
    ${className}
  `;
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge; 