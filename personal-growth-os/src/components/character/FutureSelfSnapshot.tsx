import React, { useState } from 'react';
import { CharacterData } from '../../services/characterService';

interface FutureSelfSnapshotProps {
  initialData?: CharacterData['futureVision'];
  onSave: (data: CharacterData['futureVision']) => void;
  onBack?: () => void;
}

const FutureSelfSnapshot: React.FC<FutureSelfSnapshotProps> = ({ 
  initialData,
  onSave,
  onBack 
}) => {
  // Provide default values if initialData is undefined
  const defaultData = {
    description: '',
    keyHabits: [''],
    majorGoal: ''
  };
  
  // Ensure initialData is properly handled
  const safeInitialData = initialData && typeof initialData === 'object' ? initialData : defaultData;
  
  // Make sure keyHabits is always an array
  if (!Array.isArray(safeInitialData.keyHabits) || safeInitialData.keyHabits.length === 0) {
    safeInitialData.keyHabits = [''];
  }
  
  const [futureVision, setFutureVision] = useState<CharacterData['futureVision']>(safeInitialData);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    description?: string;
    keyHabits?: string[];
    majorGoal?: string;
  }>({});

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: typeof errors = {};
    
    if (!futureVision.description?.trim()) {
      newErrors.description = 'Future vision description is required';
    }
    
    // Check if at least one habit is filled
    const filledHabits = (futureVision.keyHabits || []).filter(habit => habit?.trim() !== '');
    if (filledHabits.length === 0) {
      newErrors.keyHabits = ['At least one key habit is required'];
    }
    
    if (!futureVision.majorGoal?.trim()) {
      newErrors.majorGoal = 'Major goal is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Submit form
    setIsSubmitting(true);
    
    // Filter out empty habits
    const cleanedData = {
      ...futureVision,
      description: futureVision.description || '',
      majorGoal: futureVision.majorGoal || '',
      keyHabits: (futureVision.keyHabits || []).filter(habit => habit?.trim() !== '')
    };
    
    onSave(cleanedData);
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('keyHabit-')) {
      const index = parseInt(name.split('-')[1], 10);
      if (isNaN(index)) return; // Safety check
      
      const newHabits = [...(futureVision.keyHabits || [''])];
      newHabits[index] = value;
      
      setFutureVision(prev => ({
        ...prev,
        keyHabits: newHabits
      }));
    } else {
      setFutureVision(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add a new habit field
  const addHabitField = () => {
    if (!Array.isArray(futureVision.keyHabits)) {
      setFutureVision(prev => ({
        ...prev,
        keyHabits: ['']
      }));
      return;
    }
    
    if (futureVision.keyHabits.length < 5) {
      setFutureVision(prev => ({
        ...prev,
        keyHabits: [...(prev.keyHabits || []), '']
      }));
    }
  };

  // Remove habit field
  const removeHabitField = (index: number) => {
    if (!Array.isArray(futureVision.keyHabits) || futureVision.keyHabits.length <= 1) {
      return;
    }
    
    setFutureVision(prev => ({
      ...prev,
      keyHabits: prev.keyHabits.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Envision Your Future Self
      </h2>
      
      <p className="text-gray-600 mb-6">
        Now, let's imagine your ideal future. What would your life look like if everything went well?
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label 
            htmlFor="description" 
            className="block text-gray-700 font-medium mb-1"
          >
            How do you see yourself in the future?
          </label>
          <textarea
            id="description"
            name="description"
            value={futureVision.description || ''}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Share your vision of your ideal future self..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium mb-1">
            What key habits will help you get there?
          </label>
          
          <div className="space-y-2">
            {Array.isArray(futureVision.keyHabits) && futureVision.keyHabits.map((habit, index) => (
              <div key={`habit-${index}`} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={habit || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Daily exercise, Regular study, Consistent practice..."
                />
                
                {Array.isArray(futureVision.keyHabits) && futureVision.keyHabits.length > 1 && (
                  <button
                    type="button"
                    className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                    onClick={() => removeHabitField(index)}
                    aria-label="Remove habit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {(!Array.isArray(futureVision.keyHabits) || futureVision.keyHabits.length < 5) && (
            <button
              type="button"
              onClick={addHabitField}
              className="inline-flex items-center px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-primary bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Habit
            </button>
          )}
          
          {errors.keyHabits && (
            <p className="text-red-500 text-sm mt-1">{errors.keyHabits}</p>
          )}
          
          <p className="text-xs text-gray-500">
            What 1-5 key habits would your future self have developed?
          </p>
        </div>
        
        <div className="space-y-3">
          <label 
            htmlFor="majorGoal" 
            className="block text-gray-700 font-medium mb-1"
          >
            What's your most important goal?
          </label>
          <input
            type="text"
            id="majorGoal"
            name="majorGoal"
            value={futureVision.majorGoal || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Run a marathon, Start a business, Master a language..."
          />
          {errors.majorGoal && (
            <p className="text-red-500 text-sm mt-1">{errors.majorGoal}</p>
          )}
          <p className="text-xs text-gray-500">
            What's one significant goal you've achieved in this future vision?
          </p>
        </div>
        
        <div className="rounded-lg bg-primary-light/10 p-4 text-center">
          <span className="text-sm text-primary-dark">
            This vision represents about a 3-year growth journey
          </span>
        </div>
        
        <div className="flex justify-between pt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FutureSelfSnapshot; 