import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  
  // Character stats
  level: number;
  experience: number;
  stats: {
    strength: number;
    intelligence: number;
    creativity: number;
    discipline: number;
    vitality: number;
    social: number;
  };
  
  // Game progress
  questsCompleted: number;
  achievementsUnlocked: number;
  skillPoints: number;
  
  // Character narrative
  originStory?: string;
  currentChapter?: string;
  futureVision?: string;
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'milestone';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  status: 'active' | 'completed' | 'failed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  dueDate?: Timestamp;
  xpReward: number;
  statBoosts: {
    [key: string]: number;
  };
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  unlockedAt: Timestamp;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  category: string;
  prerequisites: string[];
  statBoosts: {
    [key: string]: number;
  };
  unlocked: boolean;
} 