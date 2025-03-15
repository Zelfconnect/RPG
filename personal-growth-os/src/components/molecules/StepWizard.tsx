import React, { useState, ReactNode } from 'react';
import Button from '../atoms/Button';

export interface StepProps {
  title: string;
  description?: string;
  children: ReactNode;
  isSkippable?: boolean;
  progressValue?: number;
}

interface StepWizardProps {
  steps: StepProps[];
  onComplete: () => void;
  onSkip?: () => void;
  progressBarColor?: string;
}

const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  onComplete,
  onSkip,
  progressBarColor = '#5E35B1' // Primary color
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  
  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      // If no skip handler provided, just go to the next step
      handleNext();
    }
  };
  
  // Calculate progress percentage based on current step
  const progressPercentage = currentStep.progressValue || 
    ((currentStepIndex + 1) / steps.length) * 100;
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: progressBarColor
          }}
        />
      </div>
      
      {/* Step content */}
      <div className="p-6">
        {/* Back button and step indicator */}
        <div className="flex items-center mb-6">
          {currentStepIndex > 0 && (
            <button 
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
          )}
          
          <div className="flex-1 h-1 bg-gray-100 mx-2">
            <div 
              className="h-full"
              style={{ 
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                backgroundColor: '#FFB300' // Accent color
              }}
            />
          </div>
          
          <span className="text-sm text-gray-500">
            {currentStepIndex + 1}/{steps.length}
          </span>
        </div>
        
        {/* Step title and description */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{currentStep.title}</h2>
        {currentStep.description && (
          <p className="text-gray-600 mb-6">{currentStep.description}</p>
        )}
        
        {/* Step content */}
        <div className="mb-6">
          {currentStep.children}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
          >
            {isLastStep ? 'Complete' : 'Next'}
          </Button>
          
          {currentStep.isSkippable && (
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 py-2 hover:text-gray-700"
            >
              Skip this step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepWizard; 