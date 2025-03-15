import React from 'react';
import { Quest } from '../../types/quest';
import { formatDistance } from 'date-fns';
import { ChevronRight, CheckCircle, Star, Repeat, Calendar } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
  onComplete?: () => void;
}

// Map difficulty to color
const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-orange-100 text-orange-800',
  epic: 'bg-purple-100 text-purple-800'
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick, onComplete }) => {
  // Format the date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate();
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get appropriate icon for quest type
  const getQuestIcon = () => {
    if (quest.isHabit) {
      return <Repeat className="h-5 w-5 mr-2" />;
    } else {
      return <Star className="h-5 w-5 mr-2" />;
    }
  };
  
  // Handle click on complete button
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick of the card
    if (onComplete) {
      onComplete();
    }
  };
  
  // Calculate streak label
  const getStreakLabel = () => {
    if (!quest.isHabit || quest.currentStreak === 0) return null;
    
    return (
      <div className="flex items-center text-amber-600 font-medium">
        <div className="text-amber-600 mr-1">🔥</div>
        <div>{quest.currentStreak} day streak</div>
      </div>
    );
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            {getQuestIcon()}
            <h3 className="font-semibold text-gray-800">{quest.title}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[quest.difficulty]}`}>
              {quest.difficulty}
            </span>
            
            {quest.isHabit && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {quest.frequency}
              </span>
            )}
          </div>
          
          {quest.isHabit ? (
            <>
              {getStreakLabel()}
              <div className="text-xs text-gray-500 mt-1">
                {quest.lastCompletedAt ? 
                  `Last completed ${formatDate(quest.lastCompletedAt)}` : 
                  'Not started yet'}
              </div>
            </>
          ) : (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {quest.endDate ? `Due ${formatDate(quest.endDate)}` : 'No due date'}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          {quest.status !== 'completed' ? (
            <button 
              onClick={handleComplete}
              className="text-green-600 hover:text-green-800"
              aria-label="Complete quest"
            >
              <CheckCircle className="h-6 w-6" />
            </button>
          ) : (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
          <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
        </div>
      </div>
      
      {/* Progress bar for one-time quests */}
      {!quest.isHabit && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${quest.progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default QuestCard; 