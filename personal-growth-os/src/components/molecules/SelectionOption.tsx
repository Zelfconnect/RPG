import React from 'react';

interface SelectionOptionProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const SelectionOption: React.FC<SelectionOptionProps> = ({
  label,
  isSelected = false,
  onClick,
  icon
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-full transition-all duration-200 border ${
        isSelected 
          ? 'border-primary bg-primary bg-opacity-5 text-primary' 
          : 'border-gray-200 hover:border-gray-300 text-gray-800'
      } mb-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 flex items-center justify-between`}
    >
      <span className="font-medium">{label}</span>
      
      {isSelected ? (
        <div className="bg-primary rounded-full p-1 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      ) : (
        icon && <span className="text-gray-400">{icon}</span>
      )}
    </button>
  );
};

export default SelectionOption; 