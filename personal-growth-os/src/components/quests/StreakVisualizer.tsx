import React from 'react';

interface StreakVisualizerProps {
  streak: number;
  maxDisplay?: number;
}

/**
 * StreakVisualizer component displays a chain of flame icons to represent a streak
 */
const StreakVisualizer: React.FC<StreakVisualizerProps> = ({ 
  streak, 
  maxDisplay = 7 
}) => {
  // Don't render anything if streak is 0
  if (streak === 0) return null;
  
  // Calculate how many flames to show
  const displayStreak = Math.min(streak, maxDisplay);
  
  // If streak is greater than maxDisplay, show the actual number
  const showCounter = streak > maxDisplay;
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {Array.from({ length: displayStreak }).map((_, index) => (
          <div 
            key={index}
            className={`text-amber-500 mx-0.5 text-lg ${
              // Make the flames progressively more intense
              index < displayStreak / 3 ? 'opacity-60' : 
              index < displayStreak * 2/3 ? 'opacity-80' : 
              'opacity-100'
            }`}
          >
            🔥
          </div>
        ))}
      </div>
      
      {showCounter && (
        <div className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
          {streak}
        </div>
      )}
    </div>
  );
};

/**
 * Compact version for smaller spaces like cards
 */
export const CompactStreakVisualizer: React.FC<StreakVisualizerProps> = ({
  streak
}) => {
  if (streak === 0) return null;
  
  return (
    <div className="flex items-center text-sm">
      <div className="text-amber-500 mr-1">🔥</div>
      <div className="font-medium">{streak}</div>
    </div>
  );
};

export default StreakVisualizer; 