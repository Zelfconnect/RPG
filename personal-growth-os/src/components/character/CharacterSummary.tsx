import React, { useEffect } from 'react';
import { CharacterData } from '../../services/characterService';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../types/user';

interface CharacterSummaryProps {
  characterData: CharacterData;
  onComplete: () => void;
  onBack?: () => void;
}

// Helper function to make attribute names more readable
const formatAttributeName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Helper function to get stat description
const getStatDescription = (stat: string, value: number): string => {
  switch (stat) {
    case 'strength':
      return value >= 8
        ? 'You have exceptional physical capabilities.'
        : value >= 6
        ? 'You have strong physical abilities.'
        : value >= 4
        ? 'You have average physical strength.'
        : value >= 2
        ? 'Your physical strength is developing.'
        : 'Your physical strength could use improvement.';
    case 'intelligence':
      return value >= 8
        ? 'Your mental capacity is remarkable.'
        : value >= 6
        ? 'Your intellectual abilities are strong.'
        : value >= 4
        ? 'You have average mental capabilities.'
        : value >= 2
        ? 'Your intellectual pursuits are developing.'
        : 'Your intellectual pursuits need more focus.';
    case 'creativity':
      return value >= 8
        ? 'Your creative abilities are extraordinary.'
        : value >= 6
        ? 'You have strong creative thinking.'
        : value >= 4
        ? 'You have average creative capabilities.'
        : value >= 2
        ? 'Your creative expression is developing.'
        : 'Your creative expression could be enhanced.';
    case 'discipline':
      return value >= 8
        ? 'Your self-discipline is exceptional.'
        : value >= 6
        ? 'You have strong self-control.'
        : value >= 4
        ? 'You have average discipline.'
        : value >= 2
        ? 'Your self-discipline is developing.'
        : 'Your willpower needs strengthening.';
    case 'vitality':
      return value >= 8
        ? 'Your energy levels and health are exceptional.'
        : value >= 6
        ? 'Your vitality and health are strong.'
        : value >= 4
        ? 'You have average vitality and health.'
        : value >= 2
        ? 'Your vitality is developing.'
        : 'Your health and vitality require attention.';
    case 'social':
      return value >= 8
        ? 'Your social skills are exceptional.'
        : value >= 6
        ? 'Your social capabilities are strong.'
        : value >= 4
        ? 'You have average social skills.'
        : value >= 2
        ? 'Your social connections are developing.'
        : 'Your social connections could be expanded.';
    default:
      return 'This attribute reflects your abilities.';
  }
};

const CharacterSummary: React.FC<CharacterSummaryProps> = ({
  characterData,
  onComplete,
  onBack,
}) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch the latest stats from the user profile
    const fetchStats = async () => {
      if (currentUser) {
        try {
          // No need to set loading state if we're not using it
          // setIsLoading(true);
          // No need to fetch and store stats if we're not using them
          // const userProfile = await getUserProfile(currentUser.uid);
          // if (userProfile) {
          //   setStats(userProfile.stats);
          // }
        } catch (error) {
          console.error('Error fetching user stats:', error);
        } finally {
          // setIsLoading(false);
        }
      }
    };

    fetchStats();
  }, [currentUser]);

  // Safely ensure we have all required objects with defensive programming
  // This ensures we handle cases where properties might be undefined
  const futureVision = characterData?.futureVision || {
    description: '',
    keyHabits: [],
    majorGoal: '',
  };

  const currentState = characterData?.currentState || {
    description: '',
    strengths: [],
    challenges: [],
  };

  const statsData = characterData?.currentStats || {
    strength: 1,
    intelligence: 1,
    creativity: 1,
    discipline: 1,
    vitality: 1,
    social: 1,
  };

  // Get growth areas if available
  const growthAreas = characterData?.growthAreas || {};

  // Function to get a color class based on stat value (updated for 0-10 scale)
  const getStatColorClass = (value: number) => {
    if (value >= 8) return 'bg-emerald-500';
    if (value >= 6) return 'bg-green-500';
    if (value >= 4) return 'bg-blue-500';
    if (value >= 2) return 'bg-indigo-500';
    return 'bg-purple-500';
  };

  // Return null or a loading state if characterData is null or undefined
  if (!characterData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading character data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {!characterData ? (
        <div className="text-center py-8">
          <p>Loading your character data...</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-primary mb-4">Your Character Summary</h2>
          <p className="text-gray-600 mb-6">
            Great job! Here's a summary of your character based on what you've shared. This will be your starting point for growth.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Overview</h3>
            <p className="text-gray-700">
              You're starting from where you are today and working toward becoming your future self. The journey ahead will
              help you develop in key areas and track your progress over time.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Your Character Overview</h3>
            <p className="text-gray-600 mb-4">
              Based on your current state and your vision for the future, here's how your character looks.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Current State</h4>
                <p className="text-gray-600 mb-3">{currentState.description}</p>
                
                {Array.isArray(currentState.strengths) && currentState.strengths.length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-600 mb-1">Current Strengths:</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {currentState.strengths.map((strength, index) => (
                        <li key={`strength-${index}`}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {Array.isArray(currentState.challenges) && currentState.challenges.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-600 mb-1">Current Challenges:</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {currentState.challenges.map((challenge, index) => (
                        <li key={`challenge-${index}`}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Future Vision</h4>
                <p className="text-gray-600 mb-3">{futureVision.description}</p>
                
                {Array.isArray(futureVision.keyHabits) && futureVision.keyHabits.length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-600 mb-1">Key Habits:</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {futureVision.keyHabits.map((habit, index) => (
                        <li key={`habit-${index}`}>{habit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {futureVision.majorGoal && (
                  <div>
                    <h5 className="font-medium text-gray-600 mb-1">Major Goal:</h5>
                    <p className="text-gray-600">{futureVision.majorGoal}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Your Attributes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(statsData || {}).map(([stat, value]) => {
                const statKey = stat as keyof UserProfile['stats'];
                const growthArea = (growthAreas || {})[statKey];
                
                // Ensure value is a number
                const numericValue = typeof value === 'number' ? value : 1;
                
                // Use the getStatColorClass function to apply the appropriate color
                const colorClass = getStatColorClass(numericValue);
                
                return (
                  <div key={stat} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{formatAttributeName(stat)}</h4>
                      <span className="text-lg font-bold text-primary">{numericValue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className={`${colorClass} h-2.5 rounded-full`}
                        style={{ width: `${(numericValue / 10) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{getStatDescription(stat, numericValue)}</p>
                    
                    {growthArea && (
                      <div className="mt-2 text-xs">
                        <p className="text-blue-600">
                          Growth potential: {growthArea.current} → {growthArea.target}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              This is your starting point. As you complete quests and develop habits, your character will grow and
              evolve. Your future vision will guide your journey, but remember that growth is not linear - embrace the
              challenges as opportunities to level up your character.
            </p>
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
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
                type="button"
                onClick={onComplete}
                className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary font-medium shadow-sm"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterSummary; 