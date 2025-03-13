import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, usersCollection } from './firebase';
import { UserProfile } from '../types/user';

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
    
    // Default character stats
    level: 1,
    experience: 0,
    stats: {
      strength: 1,
      intelligence: 1,
      creativity: 1,
      discipline: 1,
      vitality: 1,
      social: 1,
    },
    
    // Default game progress
    questsCompleted: 0,
    achievementsUnlocked: 0,
    skillPoints: 3,
    
    // Character narrative (empty by default)
    originStory: '',
    currentChapter: '',
    futureVision: '',
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
    
    // Simple leveling formula: level = 1 + floor(sqrt(xp / 100))
    const newLevel = 1 + Math.floor(Math.sqrt(newXp / 100));
    const leveledUp = newLevel > currentLevel;
    
    // Update user profile with new XP and level
    await updateUserProfile(userId, {
      experience: newXp,
      level: newLevel,
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