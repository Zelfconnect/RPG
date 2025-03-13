import React, { useState } from 'react';
import { CharacterData, ActivityFrequency } from '../../services/characterService';

interface CurrentStateAssessmentProps {
  onSave: (currentState: CharacterData['currentState']) => void;
  onBack?: () => void;
  initialData?: CharacterData['currentState'];
}

// Map of attributes to their friendly display names
const attributeLabels: Record<string, string> = {
  strength: 'Physical Strength',
  intelligence: 'Mental Acuity',
  creativity: 'Creative Expression',
  discipline: 'Self-Discipline',
  vitality: 'Health & Vitality',
  social: 'Social Connection'
};

// Map of activity types to their descriptions
const activityDescriptions: Record<string, string> = {
  physical: 'Physical exercise or sports',
  mental: 'Reading, learning, or intellectual challenges',
  creative: 'Creative work like art, writing, or music',
  routine: 'Following routines or habits consistently',
  wellness: 'Meditation, yoga, or health practices',
  social: 'Social gatherings or connecting with others'
};

// Frequency options and their display values
const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'never', label: 'Never' }
];

const CurrentStateAssessment: React.FC<CurrentStateAssessmentProps> = ({ 
  onSave, 
  onBack,
  initialData 
}) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [strengths, setStrengths] = useState<string[]>(initialData?.strengths || ['']);
  const [challenges, setChallenges] = useState<string[]>(initialData?.challenges || ['']);
  
  // Initialize self-ratings with default moderate values or from initialData
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>(
    initialData?.selfRatings || {
      strength: 5,
      intelligence: 5,
      creativity: 5,
      discipline: 5,
      vitality: 5,
      social: 5
    }
  );
  
  // Initialize activity frequency with defaults or from initialData
  const [activityFrequency, setActivityFrequency] = useState<Record<string, string>>(
    initialData?.activityFrequency || {
      physical: 'weekly',
      mental: 'weekly',
      creative: 'weekly',
      routine: 'weekly',
      wellness: 'weekly',
      social: 'weekly'
    }
  );
  
  const handleAddStrength = () => {
    setStrengths([...strengths, '']);
  };
  
  const handleUpdateStrength = (index: number, value: string) => {
    const newStrengths = [...strengths];
    newStrengths[index] = value;
    setStrengths(newStrengths);
  };
  
  const handleRemoveStrength = (index: number) => {
    if (strengths.length > 1) {
      setStrengths(strengths.filter((_, i) => i !== index));
    }
  };
  
  const handleAddChallenge = () => {
    setChallenges([...challenges, '']);
  };
  
  const handleUpdateChallenge = (index: number, value: string) => {
    const newChallenges = [...challenges];
    newChallenges[index] = value;
    setChallenges(newChallenges);
  };
  
  const handleRemoveChallenge = (index: number) => {
    if (challenges.length > 1) {
      setChallenges(challenges.filter((_, i) => i !== index));
    }
  };
  
  const handleSelfRatingChange = (attribute: string, value: number) => {
    setSelfRatings({
      ...selfRatings,
      [attribute]: value
    });
  };
  
  const handleFrequencyChange = (activity: string, value: string) => {
    setActivityFrequency({
      ...activityFrequency,
      [activity]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out any empty entries
    const filteredStrengths = strengths.filter(s => s.trim() !== '');
    const filteredChallenges = challenges.filter(c => c.trim() !== '');
    
    // Create a properly typed selfRatings object
    const typedSelfRatings = {
      strength: selfRatings.strength || 5,
      intelligence: selfRatings.intelligence || 5,
      creativity: selfRatings.creativity || 5,
      discipline: selfRatings.discipline || 5,
      vitality: selfRatings.vitality || 5,
      social: selfRatings.social || 5
    };
    
    // Create a properly typed activityFrequency object
    const typedActivityFrequency: ActivityFrequency = {
      physical: (activityFrequency.physical as 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily') || 'weekly',
      mental: (activityFrequency.mental as 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily') || 'weekly',
      creative: (activityFrequency.creative as 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily') || 'weekly',
      routine: (activityFrequency.routine as 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily') || 'weekly',
      wellness: (activityFrequency.wellness as 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily') || 'weekly',
      social: (activityFrequency.social as 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily') || 'weekly'
    };
    
    onSave({
      description: description.trim(),
      strengths: filteredStrengths,
      challenges: filteredChallenges,
      selfRatings: typedSelfRatings,
      activityFrequency: typedActivityFrequency
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Your Current State</h2>
      <p className="text-gray-600 mb-6">
        Before we look to the future, let's get a picture of where you are today. This helps us create a more accurate
        starting point for your character and identify your true growth areas.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentDescription">
            Describe your current situation and lifestyle (in 2-3 sentences)
          </label>
          <textarea
            id="currentDescription"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your current daily life, habits, and situation..."
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            What are your current strengths? (activities, habits, or areas you excel in)
          </label>
          
          {strengths.map((strength, index) => (
            <div key={`strength-${index}`} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={strength}
                onChange={(e) => handleUpdateStrength(index, e.target.value)}
                placeholder="e.g., running regularly, reading, organization, etc."
              />
              
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveStrength(index)}
                aria-label="Remove strength"
                disabled={strengths.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          <button
            type="button"
            className="mt-2 text-primary hover:text-primary-dark flex items-center"
            onClick={handleAddStrength}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Strength
          </button>
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            What challenges are you currently facing? (areas you want to improve)
          </label>
          
          {challenges.map((challenge, index) => (
            <div key={`challenge-${index}`} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={challenge}
                onChange={(e) => handleUpdateChallenge(index, e.target.value)}
                placeholder="e.g., procrastination, lack of focus, unhealthy eating, etc."
              />
              
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveChallenge(index)}
                aria-label="Remove challenge"
                disabled={challenges.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          <button
            type="button"
            className="mt-2 text-primary hover:text-primary-dark flex items-center"
            onClick={handleAddChallenge}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Challenge
          </button>
        </div>
        
        {/* Self-Rating Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Rate Your Current Abilities</h3>
          <p className="text-gray-600 mb-4">
            On a scale of 0-10, how would you rate yourself in these different areas?
          </p>
          
          <div className="space-y-6">
            {Object.keys(selfRatings).map((attribute) => (
              <div key={attribute} className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-gray-700 text-sm font-medium" htmlFor={`rating-${attribute}`}>
                    {attributeLabels[attribute]}
                  </label>
                  <span className="text-primary font-medium">{selfRatings[attribute]}</span>
                </div>
                <input
                  id={`rating-${attribute}`}
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={selfRatings[attribute]}
                  onChange={(e) => handleSelfRatingChange(attribute, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activity Frequency Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Activity Frequency</h3>
          <p className="text-gray-600 mb-4">
            How often do you engage in the following types of activities?
          </p>
          
          <div className="space-y-4">
            {Object.keys(activityFrequency).map((activity) => (
              <div key={activity} className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={`freq-${activity}`}>
                  {activityDescriptions[activity]}
                </label>
                <select
                  id={`freq-${activity}`}
                  value={activityFrequency[activity]}
                  onChange={(e) => handleFrequencyChange(activity, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurrentStateAssessment; 