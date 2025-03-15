import React, { useState, useEffect } from 'react';
import { Quest, QuestStatus, QuestType } from '../../types/quest';
import { getUserQuests, completeQuest, trackHabitCompletion } from '../../services/questService';
import QuestCard from './QuestCard';
import { Plus, Filter, Search, ArrowRightCircle, Repeat, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestJournal: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<QuestStatus | 'all'>('active');
  const [typeFilter, setTypeFilter] = useState<QuestType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDueOnly, setShowDueOnly] = useState(false);
  
  const navigate = useNavigate();

  // Fetch quests on component mount
  useEffect(() => {
    fetchQuests();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [quests, statusFilter, typeFilter, searchQuery, showDueOnly]);
  
  // Fetch quests from Firestore
  const fetchQuests = async () => {
    try {
      setLoading(true);
      const fetchedQuests = await getUserQuests();
      setQuests(fetchedQuests);
      setError(null);
    } catch (err) {
      setError('Failed to load quests. Please try again later.');
      console.error('Error fetching quests:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters to the quests
  const applyFilters = () => {
    let filtered = [...quests];
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quest => quest.status === statusFilter);
    }
    
    // Filter by type
    if (typeFilter === 'one-time') {
      filtered = filtered.filter(quest => !quest.isHabit);
    } else if (typeFilter === 'habit') {
      filtered = filtered.filter(quest => quest.isHabit);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        quest => quest.title.toLowerCase().includes(query) || 
                quest.description.toLowerCase().includes(query)
      );
    }
    
    // Filter for "due today" habits
    if (showDueOnly) {
      const today = new Date();
      filtered = filtered.filter(quest => {
        if (!quest.isHabit) return false;
        
        // Check if it's due based on frequency and last completion
        const lastCompleted = quest.lastCompletedAt?.toDate();
        if (!lastCompleted) return true; // Never completed, so it's due
        
        if (quest.frequency === 'daily') {
          // Due if not completed today
          return lastCompleted.getDate() !== today.getDate() || 
                 lastCompleted.getMonth() !== today.getMonth() || 
                 lastCompleted.getFullYear() !== today.getFullYear();
        } else if (quest.frequency === 'weekly') {
          // Due if last completed more than a week ago
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          return lastCompleted <= weekAgo;
        } else if (quest.frequency === 'monthly') {
          // Due if not completed this month
          return lastCompleted.getMonth() !== today.getMonth() || 
                 lastCompleted.getFullYear() !== today.getFullYear();
        }
        
        return false;
      });
    }
    
    setFilteredQuests(filtered);
  };
  
  // Handle marking a quest as complete
  const handleCompleteQuest = async (quest: Quest) => {
    try {
      if (quest.isHabit) {
        // For habits, update streak
        const result = await trackHabitCompletion(quest.id);
        
        // Update quest in the local state
        setQuests(prevQuests => 
          prevQuests.map(q => 
            q.id === quest.id 
              ? { 
                  ...q, 
                  currentStreak: result.currentStreak,
                  streakBonusMultiplier: result.bonusMultiplier,
                  lastCompletedAt: new Date() as any // Type hack for simplicity
                } 
              : q
          )
        );
        
        // If streak increased, show celebration
        if (result.streakIncreased && result.currentStreak > 1) {
          // TODO: Add streak celebration animation/notification
          alert(`🔥 Streak increased to ${result.currentStreak}! Bonus multiplier: ${result.bonusMultiplier.toFixed(2)}x`);
        }
      } else {
        // For one-time quests, mark as completed
        await completeQuest(quest.id);
        
        // Update quest in the local state
        setQuests(prevQuests => 
          prevQuests.map(q => 
            q.id === quest.id 
              ? { ...q, status: 'completed', progress: 100 } 
              : q
          )
        );
        
        // Show completion notification
        alert(`✅ Quest completed: ${quest.title}`);
      }
    } catch (err) {
      console.error('Error completing quest:', err);
      setError('Failed to complete quest. Please try again.');
    }
  };
  
  // Handle quest card click - show details
  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
  };
  
  // Handle creating a new quest
  const handleCreateQuest = () => {
    navigate('/create-quest');
  };
  
  // Calculate streaks summary
  const getStreaksSummary = () => {
    const habitQuests = quests.filter(q => q.isHabit);
    
    if (habitQuests.length === 0) return null;
    
    const activeStreaks = habitQuests.filter(q => q.currentStreak > 0).length;
    const longestStreak = Math.max(...habitQuests.map(q => q.longestStreak), 0);
    
    return (
      <div className="bg-amber-50 p-3 rounded-lg mb-4 border border-amber-200">
        <h3 className="text-amber-800 font-medium mb-1">Habit Streaks</h3>
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Active: </span>
            <span className="font-medium">{activeStreaks} habit{activeStreaks !== 1 ? 's' : ''}</span>
          </div>
          <div>
            <span className="text-gray-600">Longest streak: </span>
            <span className="font-medium">{longestStreak} day{longestStreak !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the QuestJournal component
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quest Journal</h1>
        <button
          onClick={handleCreateQuest}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          New Quest
        </button>
      </div>
      
      {getStreaksSummary()}
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as QuestStatus | 'all')}
              className="border rounded px-2 py-1 text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as QuestType | 'all')}
              className="border rounded px-2 py-1 text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="one-time">One-Time</option>
              <option value="habit">Habits</option>
            </select>
          </div>
          
          <div className="flex items-center ml-auto">
            <label className="flex items-center text-sm text-gray-600">
              <input 
                type="checkbox" 
                checked={showDueOnly}
                onChange={(e) => setShowDueOnly(e.target.checked)}
                className="mr-1"
              />
              Due Today
            </label>
          </div>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading quests...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p>{error}</p>
          <button 
            onClick={fetchQuests}
            className="mt-2 text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No quests found matching your filters.</p>
          <button
            onClick={handleCreateQuest}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center mx-auto"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Your First Quest
          </button>
        </div>
      ) : (
        <div>
          {typeFilter === 'habit' || typeFilter === 'all' ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-blue-600" />
                Habits
              </h2>
              {filteredQuests.filter(q => q.isHabit).length === 0 ? (
                <p className="text-gray-500 text-sm">No habit quests found.</p>
              ) : (
                filteredQuests
                  .filter(q => q.isHabit)
                  .map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => handleQuestClick(quest)}
                      onComplete={() => handleCompleteQuest(quest)}
                    />
                  ))
              )}
            </div>
          ) : null}
          
          {typeFilter === 'one-time' || typeFilter === 'all' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                One-Time Quests
              </h2>
              {filteredQuests.filter(q => !q.isHabit).length === 0 ? (
                <p className="text-gray-500 text-sm">No one-time quests found.</p>
              ) : (
                filteredQuests
                  .filter(q => !q.isHabit)
                  .map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => handleQuestClick(quest)}
                      onComplete={() => handleCompleteQuest(quest)}
                    />
                  ))
              )}
            </div>
          ) : null}
        </div>
      )}
      
      {/* Quest Details Sidebar - implement as needed */}
      {selectedQuest && (
        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Quest Details</h2>
            <button 
              onClick={() => setSelectedQuest(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowRightCircle className="h-6 w-6" />
            </button>
          </div>
          
          {/* Quest details go here */}
          <h3 className="font-bold text-xl mb-2">{selectedQuest.title}</h3>
          <p className="text-gray-700 mb-4">{selectedQuest.description}</p>
          
          {/* Additional quest details UI - implement as needed */}
          
          <button
            onClick={() => handleCompleteQuest(selectedQuest)}
            className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center mt-4"
            disabled={selectedQuest.status === 'completed'}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {selectedQuest.isHabit ? 'Complete for Today' : 'Mark as Complete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestJournal; 