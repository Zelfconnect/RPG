import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, usersCollection } from './firebase';
import { UserProfile, calculateLevelFromXP, calculateXPForLevel } from '../types/user';

/**
 * Get a user's profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(usersCollection, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Create a default user profile for a new user
 */
export const createDefaultUserProfile = (user: User): UserProfile => {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || '',
    photoURL: user.photoURL || '',
    createdAt: Timestamp.now(),
    
    // Default character stats (on 0-10 scale)
    level: 1,
    experience: 0,
    nextLevelExperience: 100, // BASE_XP_LEVEL from user.ts
    stats: {
      strength: 5,     // Starting at middle of 0-10 scale
      intelligence: 5,
      creativity: 5,
      discipline: 5,
      vitality: 5,
      social: 5,
    },
    
    // Default game progress
    questsCompleted: 0,
    achievementsUnlocked: 0,
    skillPoints: 3,
    
    // Character narrative (empty by default)
    originStory: '',
    currentChapter: '',
    futureVision: '',
    
    // Character development with new structure
    currentState: {
      description: '',
      strengths: [],
      challenges: []
    },
    
    // Empty character structure for additional data
    character: {
      futureVision: {
        description: '',
        keyHabits: [],
        majorGoal: ''
      },
      currentState: {
        description: '',
        strengths: [],
        challenges: []
      }
    }
  };
};

/**
 * Update a user's profile in Firestore
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Add experience points to a user and handle level ups
 */
export const addExperience = async (
  userId: string,
  xpAmount: number
): Promise<{ newLevel: number; leveledUp: boolean }> => {
  try {
    // Get current user profile
    const userProfile = await getUserProfile(userId);
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    // Calculate new experience and level
    const currentXp = userProfile.experience || 0;
    const currentLevel = userProfile.level || 1;
    const newXp = currentXp + xpAmount;
    
    // Use the level calculation function from user.ts
    const newLevel = calculateLevelFromXP(newXp);
    const leveledUp = newLevel > currentLevel;
    
    // Calculate XP needed for next level
    const nextLevelXP = calculateXPForLevel(newLevel + 1);
    
    // Update user profile with new XP and level
    await updateUserProfile(userId, {
      experience: newXp,
      level: newLevel,
      nextLevelExperience: nextLevelXP,
      // If leveled up, add skill points
      skillPoints: leveledUp 
        ? (userProfile.skillPoints || 0) + (newLevel - currentLevel) 
        : userProfile.skillPoints,
    });
    
    return {
      newLevel,
      leveledUp,
    };
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
}; 