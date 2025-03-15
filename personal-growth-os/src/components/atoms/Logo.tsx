import React from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  let sizeClass = '';
  
  switch (size) {
    case 'small':
      sizeClass = 'app-logo-small';
      break;
    case 'large':
      sizeClass = 'app-logo-large';
      break;
    default:
      sizeClass = 'app-logo';
      break;
  }
  
  return (
    <div className={`app-logo-container ${className}`}>
      <svg 
        className={sizeClass}
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        fill="#5E35B1" // Primary color
      >
        <path d="M100 0L200 100L100 200L0 100L100 0Z" />
      </svg>
    </div>
  );
};

export default Logo; 