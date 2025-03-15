import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  NewQuestData, 
  QuestDifficulty, 
  QuestType,
  HabitFrequency
} from '../../types/quest';
import { createQuest, getQuestById } from '../../services/questService';
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  Repeat, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const QuestForm: React.FC = () => {
  const navigate = useNavigate();
  const { questId } = useParams<{ questId: string }>();
  const isEditing = !!questId;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questType, setQuestType] = useState<QuestType>('one-time');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [isHabit, setIsHabit] = useState(false);
  const [habitFrequency, setHabitFrequency] = useState<HabitFrequency>('daily');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // If editing, fetch quest data
  useEffect(() => {
    if (isEditing && questId) {
      fetchQuestData(questId);
    }
  }, [isEditing, questId]);
  
  // Update the useEffect hook to set default frequency when isHabit changes
  useEffect(() => {
    // Set a default frequency when habit type is selected
    if (isHabit && !habitFrequency) {
      setHabitFrequency('daily');
    }
  }, [isHabit, habitFrequency]);
  
  // Fetch quest data for editing
  const fetchQuestData = async (id: string) => {
    try {
      setLoading(true);
      const quest = await getQuestById(id);
      
      if (!quest) {
        setError('Quest not found');
        return;
      }
      
      // Populate form fields
      setTitle(quest.title);
      setDescription(quest.description);
      setQuestType(quest.type);
      setDifficulty(quest.difficulty);
      setIsHabit(quest.isHabit);
      
      if (quest.frequency) {
        setHabitFrequency(quest.frequency);
      }
      
      if (quest.endDate) {
        // Format date as YYYY-MM-DD for input
        const date = quest.endDate.toDate();
        const formattedDate = date.toISOString().split('T')[0];
        setDueDate(formattedDate);
      }
      
    } catch (err) {
      console.error('Error fetching quest data:', err);
      setError('Failed to load quest data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a title for your quest');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description for your quest');
      return;
    }
    
    if (isHabit && !habitFrequency) {
      setError('Please select a frequency for your habit');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create quest data with proper handling of optional fields
      const questData: NewQuestData = {
        title: title.trim(),
        description: description.trim(),
        type: questType,
        difficulty,
        isHabit
      };
      
      // Only add frequency for habits
      if (isHabit) {
        questData.frequency = habitFrequency;
      }
      
      // Only add end date if specified
      if (dueDate) {
        questData.endDate = new Date(dueDate);
      }
      
      if (isEditing && questId) {
        // TODO: Implement updateQuest in questService and call it here
        // await updateQuest(questId, questData);
        alert('Editing quests is not yet implemented');
      } else {
        await createQuest(questData);
      }
      
      // Redirect back to quest journal
      navigate('/quests');
    } catch (err) {
      console.error('Error saving quest:', err);
      setError(`Failed to save quest: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Get difficulty label and color
  const getDifficultyInfo = (level: QuestDifficulty) => {
    const info = {
      easy: { label: 'Easy', color: 'bg-green-500', xp: '50 XP' },
      medium: { label: 'Medium', color: 'bg-yellow-500', xp: '100 XP' },
      hard: { label: 'Hard', color: 'bg-orange-500', xp: '150 XP' },
      epic: { label: 'Epic', color: 'bg-purple-500', xp: '250 XP' }
    };
    
    return info[level];
  };
  
  // Render difficulty selector
  const renderDifficultySelector = () => {
    const difficulties: QuestDifficulty[] = ['easy', 'medium', 'hard', 'epic'];
    
    return (
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Difficulty <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          {difficulties.map(level => {
            const { label, color, xp } = getDifficultyInfo(level);
            const isSelected = difficulty === level;
            
            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  console.log(`Setting difficulty to ${level}`);
                  setDifficulty(level);
                }}
                className={`relative flex-1 p-3 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${color} mb-1`}></div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500">{xp}</div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <HelpCircle className="h-3 w-3 mr-1" />
          Higher difficulty = more XP reward but requires more effort
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/quests')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Quest Journal
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Quest' : 'Create New Quest'}
        </h1>
        
        {loading && !error ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">
              {isEditing ? 'Loading quest data...' : 'Creating your quest...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Quest Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formSubmitted && !title.trim() ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="What do you want to accomplish?"
                maxLength={100}
              />
              {formSubmitted && !title.trim() && (
                <p className="mt-1 text-red-500 text-sm">Title is required</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formSubmitted && !description.trim() ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe this quest in more detail..."
                rows={4}
                maxLength={500}
              />
              {formSubmitted && !description.trim() && (
                <p className="mt-1 text-red-500 text-sm">Description is required</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Quest Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    console.log('Setting to one-time quest');
                    setQuestType('one-time');
                    setIsHabit(false);
                  }}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center transition-all ${
                    !isHabit 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Star className={`h-5 w-5 mr-2 ${!isHabit ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="font-medium">One-Time Quest</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    console.log('Setting to habit quest');
                    setQuestType('habit');
                    setIsHabit(true);
                    // Ensure a default frequency is set
                    setHabitFrequency('daily');
                  }}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isHabit 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Repeat className={`h-5 w-5 mr-2 ${isHabit ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="font-medium">Recurring Habit</span>
                </button>
              </div>
            </div>
            
            {isHabit && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Habit Frequency <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['daily', 'weekly', 'monthly'] as HabitFrequency[]).map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => {
                        console.log(`Setting frequency to ${freq}`);
                        setHabitFrequency(freq);
                      }}
                      className={`p-3 rounded-lg border flex items-center justify-center transition-all ${
                        habitFrequency === freq 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium capitalize">{freq}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500 flex items-start">
                  <HelpCircle className="h-3 w-3 mr-1 mt-0.5" />
                  <span>
                    {habitFrequency === 'daily' && 'Complete this habit every day to maintain your streak'}
                    {habitFrequency === 'weekly' && 'Complete this habit at least once per week to maintain your streak'}
                    {habitFrequency === 'monthly' && 'Complete this habit at least once per month to maintain your streak'}
                  </span>
                </div>
              </div>
            )}
            
            {renderDifficultySelector()}
            
            {!isHabit && (
              <div className="mb-6">
                <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due Date <span className="text-gray-500 text-sm ml-1">(Optional)</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  console.log('Navigating back to quests');
                  navigate('/quests');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={(e) => {
                  console.log('Create/Update button clicked');
                  handleSubmit(e);
                }}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Quest' : 'Create Quest'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestForm; 