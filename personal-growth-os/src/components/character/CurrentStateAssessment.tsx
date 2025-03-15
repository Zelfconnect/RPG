import React, { useState } from 'react';
import { CharacterData, ActivityFrequency } from '../../services/characterService';

// Define frequency options
type FrequencyValue = 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';

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

// Map of attributes to their emoji icons
const attributeEmojis: Record<string, string> = {
  strength: '💪',
  intelligence: '🧠',
  creativity: '🎨',
  discipline: '⏰',
  vitality: '❤️',
  social: '👋'
};

// Map of attributes to their descriptions
const attributeDescriptions: Record<string, string> = {
  strength: 'Your physical power and fitness level',
  intelligence: 'Your mental capabilities and knowledge',
  creativity: 'Your ability to generate novel ideas',
  discipline: 'Your consistency and self-control',
  vitality: 'Your energy and overall health',
  social: 'Your relationships and social interaction'
};

// Get rating level descriptions based on value
const getRatingDescription = (attribute: string, value: number): string => {
  if (value >= 9) return 'Exceptional';
  if (value >= 7) return 'Advanced';
  if (value >= 5) return 'Proficient';
  if (value >= 3) return 'Developing';
  return 'Beginner';
};

// Get style classes for rating level
const getRatingClasses = (value: number): string => {
  if (value >= 9) return 'text-purple-700 font-bold';
  if (value >= 7) return 'text-blue-600 font-bold';
  if (value >= 5) return 'text-green-600';
  if (value >= 3) return 'text-yellow-600';
  return 'text-red-500';
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

// Activity types to their emoji icons
const activityEmojis: Record<string, string> = {
  physical: '🏃‍♂️',
  mental: '📚',
  creative: '🎨',
  routine: '📅',
  wellness: '🧘‍♀️',
  social: '🤝'
};

// Frequency options and their display values
const frequencyOptions = [
  { value: 'daily', label: 'Daily', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'weekly', label: 'Weekly', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'monthly', label: 'Monthly', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'rarely', label: 'Rarely', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'never', label: 'Never', color: 'bg-red-100 text-red-800 border-red-200' }
];

// Build frequency impact descriptions
const buildFrequencyImpactDescription = (activity: string, frequency: string): string => {
  if (frequency === 'daily') {
    if (activity === 'physical') return 'Significant boost to Strength and Vitality';
    if (activity === 'mental') return 'Significant boost to Intelligence and some Creativity';
    if (activity === 'creative') return 'Significant boost to Creativity and some Intelligence';
    if (activity === 'routine') return 'Significant boost to Discipline';
    if (activity === 'wellness') return 'Significant boost to Vitality and some Discipline';
    if (activity === 'social') return 'Significant boost to Social ability';
  }
  
  if (frequency === 'weekly') {
    if (activity === 'physical') return 'Good improvement to Strength and some Vitality';
    if (activity === 'mental') return 'Good improvement to Intelligence';
    if (activity === 'creative') return 'Good improvement to Creativity';
    if (activity === 'routine') return 'Good improvement to Discipline';
    if (activity === 'wellness') return 'Good improvement to Vitality';
    if (activity === 'social') return 'Good improvement to Social ability';
  }
  
  if (frequency === 'monthly') {
    if (activity === 'physical') return 'Modest effect on Strength';
    if (activity === 'mental') return 'Modest effect on Intelligence';
    if (activity === 'creative') return 'Modest effect on Creativity';
    if (activity === 'routine') return 'Modest effect on Discipline';
    if (activity === 'wellness') return 'Modest effect on Vitality';
    if (activity === 'social') return 'Modest effect on Social ability';
  }
  
  if (frequency === 'rarely' || frequency === 'never') {
    return frequency === 'rarely' 
      ? 'Minimal contribution to attributes' 
      : 'No contribution to attributes';
  }
  
  return 'No impact data available';
};

const CurrentStateAssessment: React.FC<CurrentStateAssessmentProps> = ({ 
  onSave, 
  onBack,
  initialData 
}) => {
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [strengths, setStrengths] = useState<string[]>(initialData?.strengths || ['']);
  const [challenges, setChallenges] = useState<string[]>(initialData?.challenges || ['']);
  
  // Default self-ratings
  const defaultRatings = {
    strength: 5,
    intelligence: 5,
    creativity: 5,
    discipline: 5,
    vitality: 5,
    social: 5
  };
  
  // Initialize self-ratings safely
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>(() => {
    try {
      if (initialData?.selfRatings) {
        return {
          ...defaultRatings,
          ...initialData.selfRatings
        };
      }
    } catch (e) {
      console.error('Error initializing selfRatings:', e);
    }
    return defaultRatings;
  });
  
  // Default activity frequency
  const defaultFrequency = {
    physical: 'weekly' as FrequencyValue,
    mental: 'weekly' as FrequencyValue,
    creative: 'weekly' as FrequencyValue,
    routine: 'weekly' as FrequencyValue,
    wellness: 'weekly' as FrequencyValue,
    social: 'weekly' as FrequencyValue
  };
  
  // Initialize activity frequency safely
  const [activityFrequency, setActivityFrequency] = useState<Record<string, string>>(() => {
    try {
      if (initialData?.activityFrequency) {
        return {
          ...defaultFrequency,
          ...initialData.activityFrequency
        };
      }
    } catch (e) {
      console.error('Error initializing activityFrequency:', e);
    }
    return defaultFrequency;
  });
  
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
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSave) {
      try {
        // Create properly typed activity frequency
        const typedActivityFrequency: ActivityFrequency = {
          physical: (activityFrequency.physical || 'weekly') as FrequencyValue,
          mental: (activityFrequency.mental || 'weekly') as FrequencyValue,
          creative: (activityFrequency.creative || 'weekly') as FrequencyValue,
          routine: (activityFrequency.routine || 'weekly') as FrequencyValue,
          wellness: (activityFrequency.wellness || 'weekly') as FrequencyValue,
          social: (activityFrequency.social || 'weekly') as FrequencyValue
        };
        
        const savedData = {
          description,
          strengths: strengths.filter(s => s.trim() !== ''),
          challenges: challenges.filter(c => c.trim() !== ''),
          selfRatings: {
            strength: selfRatings.strength || 5,
            intelligence: selfRatings.intelligence || 5,
            creativity: selfRatings.creativity || 5,
            discipline: selfRatings.discipline || 5,
            vitality: selfRatings.vitality || 5,
            social: selfRatings.social || 5
          },
          activityFrequency: typedActivityFrequency
        };
        
        onSave(savedData);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">Tell Us About Yourself Today</h2>
      <p className="text-gray-600 mb-6">
        Let's start by understanding where you are now. This helps us tailor your experience.
      </p>
      
      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="currentDescription">
            Describe your current situation and lifestyle
          </label>
          <textarea
            id="currentDescription"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share a bit about your daily routine and habits..."
            required
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium mb-1">
            What are you great at right now?
          </label>
          
          <div className="space-y-2">
            {strengths?.map((strength, index) => (
              <div key={`strength-${index}`} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={strength || ''}
                  onChange={(e) => handleUpdateStrength(index, e.target.value)}
                  placeholder="e.g., running regularly, reading, organization, etc."
                />
                
                {strengths.length > 1 && (
                  <button
                    type="button"
                    className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                    onClick={() => handleRemoveStrength(index)}
                    aria-label="Remove strength"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-primary bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={handleAddStrength}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Strength
          </button>
        </div>
        
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium mb-1">
            What areas do you want to work on?
          </label>
          
          <div className="space-y-2">
            {challenges?.map((challenge, index) => (
              <div key={`challenge-${index}`} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={challenge || ''}
                  onChange={(e) => handleUpdateChallenge(index, e.target.value)}
                  placeholder="e.g., procrastination, lack of focus, unhealthy eating, etc."
                />
                
                {challenges.length > 1 && (
                  <button
                    type="button"
                    className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                    onClick={() => handleRemoveChallenge(index)}
                    aria-label="Remove challenge"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-primary bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={handleAddChallenge}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Challenge
          </button>
        </div>
        
        {/* Self-rating section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Self-Rating</h3>
          <p className="text-gray-600 mb-6">
            How would you rate yourself in these areas? Drag the sliders to indicate your current level.
            These ratings will help establish your starting point.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(attributeLabels).map(attribute => (
              <div key={attribute} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center gap-2 font-medium">
                    <span className="text-xl">{attributeEmojis[attribute]}</span>
                    {attributeLabels[attribute] || attribute}
                  </label>
                  <div className="flex flex-col items-end">
                    <span className={getRatingClasses(selfRatings?.[attribute] || 0)}>
                      {selfRatings?.[attribute] || 0}/10
                    </span>
                    <span className="text-xs text-gray-500">
                      {getRatingDescription(attribute, selfRatings?.[attribute] || 0)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {attributeDescriptions[attribute]}
                </p>
                
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={selfRatings?.[attribute] || 0}
                  onChange={e => {
                    const newValue = parseInt(e.target.value);
                    setSelfRatings(prev => ({
                      ...prev,
                      [attribute]: newValue
                    }));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activity Frequency Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Activity Frequency</h3>
          <p className="text-gray-600 mb-6">
            How often do you engage in these activities? Your choices will affect your starting character attributes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(activityDescriptions).map(activity => {
              const selectedFrequency = activityFrequency[activity] || 'never';
              const frequencyOption = frequencyOptions.find(option => option.value === selectedFrequency);
              
              return (
                <div key={activity} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{activityEmojis[activity]}</span>
                    <span className="font-medium">{activityDescriptions[activity]}</span>
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm text-gray-700 mb-2">How often do you engage in this?</label>
                    <select
                      value={selectedFrequency}
                      onChange={e => {
                        const value = e.target.value;
                        setActivityFrequency(prev => ({
                          ...prev,
                          [activity]: value
                        }));
                      }}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedFrequency && (
                    <div className={`mt-3 p-2 rounded text-sm ${frequencyOption?.color || 'bg-gray-100'}`}>
                      <p>{buildFrequencyImpactDescription(activity, selectedFrequency)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-end pt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mr-4 px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary font-medium shadow-sm"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurrentStateAssessment; 