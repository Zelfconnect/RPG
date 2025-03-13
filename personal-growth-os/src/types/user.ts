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
  nextLevelExperience: number;
  stats: {
    strength: number;     // Physical strength, fitness (0-10 scale)
    intelligence: number; // Mental acuity, learning capacity (0-10 scale)
    creativity: number;   // Innovation, artistic ability (0-10 scale)
    discipline: number;   // Consistency, habit formation (0-10 scale)
    vitality: number;     // Energy, health, resilience (0-10 scale)
    social: number;       // Communication, relationships (0-10 scale)
  };
  
  // Game progress
  questsCompleted: number;
  achievementsUnlocked: number;
  skillPoints: number;
  
  // Character narrative
  originStory?: string;
  currentChapter?: string;
  futureVision?: string;
  
  // Character development
  currentState: {
    description: string;
    strengths: string[];
    challenges: string[];
    selfRatings?: {
      strength: number;
      intelligence: number;
      creativity: number;
      discipline: number;
      vitality: number;
      social: number;
    };
    activityFrequency?: {
      physical: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
      mental: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
      creative: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
      routine: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
      wellness: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
      social: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
    };
  };
  growthAreas?: string;
  character?: {
    futureVision?: {
      description: string;
      keyHabits: string[];
      majorGoal: string;
    };
    currentState?: {
      description: string;
      strengths: string[];
      challenges: string[];
    };
    growthAreas?: {
      [key in keyof UserProfile['stats']]?: {
        current: number;
        target: number;
        gap: number;
      }
    };
  };
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

// Level calculation constants (adjusted for 0-10 scale)
export const BASE_XP_LEVEL = 100;
export const XP_MULTIPLIER = 1.5;

// Calculate XP needed for a level
export function calculateXPForLevel(level: number): number {
  return Math.round(BASE_XP_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

// Calculate level based on XP
export function calculateLevelFromXP(xp: number): number {
  let level = 1;
  let xpForNextLevel = BASE_XP_LEVEL;
  
  while (xp >= xpForNextLevel) {
    level++;
    xpForNextLevel += calculateXPForLevel(level);
  }
  
  return level;
} 