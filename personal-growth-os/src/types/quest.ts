import { Timestamp } from 'firebase/firestore';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type QuestStatus = 'active' | 'completed' | 'failed' | 'abandoned';
export type QuestType = 'one-time' | 'habit';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  progress: number; // 0-100
  xpReward: number;
  statRewards: {
    [key: string]: number;
  };
  relatedSkills: string[];
  startDate: Timestamp;
  endDate?: Timestamp;
  completedDate?: Timestamp;
  
  // Habit tracking fields
  isHabit: boolean;
  frequency?: HabitFrequency;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: Timestamp;
  completionHistory: {
    date: Timestamp;
    completed: boolean;
  }[];
  streakBonusMultiplier: number; // Increases with streak length
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NewQuestData {
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  isHabit: boolean;
  frequency?: HabitFrequency;
  statRewards?: {
    [key: string]: number;
  };
  relatedSkills?: string[];
  endDate?: Date;
}

// Helper functions

// Calculate XP reward based on difficulty
export function calculateXpReward(difficulty: QuestDifficulty): number {
  const baseXp = 50;
  const multipliers = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'epic': 5
  };
  
  return baseXp * multipliers[difficulty];
}

// Calculate streak bonus based on current streak
export function calculateStreakBonus(currentStreak: number): number {
  // Base is 1.0, each week adds 0.05 (5%) up to a maximum of 2.0 (100% bonus)
  return Math.min(1.0 + (currentStreak * 0.05), 2.0);
}

// Check if a habit is due today
export function isHabitDueToday(quest: Quest): boolean {
  if (!quest.isHabit) return false;
  
  const today = new Date();
  const lastCompleted = quest.lastCompletedAt?.toDate();
  
  if (!lastCompleted) return true; // Never completed, so it's due
  
  switch (quest.frequency) {
    case 'daily':
      // Due if last completed was before today (not same day)
      return lastCompleted.getDate() !== today.getDate() || 
             lastCompleted.getMonth() !== today.getMonth() || 
             lastCompleted.getFullYear() !== today.getFullYear();
    
    case 'weekly':
      // Due if last completed was more than 7 days ago
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return lastCompleted <= weekAgo;
    
    case 'monthly':
      // Due if last completed was in a different month
      return lastCompleted.getMonth() !== today.getMonth() || 
             lastCompleted.getFullYear() !== today.getFullYear();
    
    default:
      return false;
  }
} 