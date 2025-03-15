import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp,
  increment,
  FirestoreError
} from 'firebase/firestore';
import { db, auth, questsCollection } from './firebase';
import { 
  Quest, 
  NewQuestData, 
  QuestStatus, 
  calculateXpReward, 
  calculateStreakBonus,
  isHabitDueToday 
} from '../types/quest';

// Error handling
class QuestServiceError extends Error {
  code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'QuestServiceError';
    this.code = code;
  }
}

// Create a new quest
export const createQuest = async (questData: NewQuestData): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    // Calculate XP reward if not provided
    const xpReward = questData.statRewards?.xp || calculateXpReward(questData.difficulty);
    
    // Prepare the document with proper handling of optional fields
    const questDoc: any = {
      userId: user.uid,
      title: questData.title,
      description: questData.description,
      type: questData.type,
      difficulty: questData.difficulty,
      status: 'active' as QuestStatus,
      progress: 0,
      xpReward,
      statRewards: questData.statRewards || {},
      relatedSkills: questData.relatedSkills || [],
      startDate: Timestamp.now(),
      endDate: questData.endDate ? Timestamp.fromDate(questData.endDate) : null,
      
      // Habit tracking fields - only include if this is a habit
      isHabit: questData.isHabit,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedAt: null,
      completionHistory: [],
      streakBonusMultiplier: 1.0,
      
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Only include frequency for habit quests
    if (questData.isHabit && questData.frequency) {
      questDoc.frequency = questData.frequency;
    }
    
    // Add to Firestore
    const docRef = await addDoc(questsCollection, questDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating quest:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to create quest',
      (error as FirestoreError).code
    );
  }
};

// Get all quests for current user
export const getUserQuests = async (filters?: {
  status?: QuestStatus;
  type?: string;
  isDue?: boolean;
}): Promise<Quest[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    // Start with simpler base query to avoid complex index requirements
    let q = query(
      questsCollection, 
      where('userId', '==', user.uid)
    );
    
    // Only apply status filter if provided (to simplify query)
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    // Execute query
    const snapshot = await getDocs(q);
    
    // Format results
    let quests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Quest[];
    
    // Apply client-side filtering for type
    if (filters?.type) {
      if (filters.type === 'one-time') {
        quests = quests.filter(quest => !quest.isHabit);
      } else if (filters.type === 'habit') {
        quests = quests.filter(quest => quest.isHabit);
      }
    }
    
    // Sort by updatedAt (client-side) to avoid index requirement
    quests.sort((a, b) => {
      const dateA = a.updatedAt?.toDate() || new Date(0);
      const dateB = b.updatedAt?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime(); // descending order
    });
    
    // Apply "due today" filter if requested (client-side filtering)
    if (filters?.isDue) {
      quests = quests.filter(quest => isHabitDueToday(quest));
    }
    
    return quests;
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to fetch quests',
      (error as FirestoreError).code
    );
  }
};

// Get a single quest by ID
export const getQuestById = async (questId: string): Promise<Quest | null> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    const docRef = doc(db, 'quests', questId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const questData = docSnap.data();
    
    // Ensure the quest belongs to the current user
    if (questData.userId !== user.uid) {
      throw new QuestServiceError('Access denied: Quest belongs to another user', 'permission-denied');
    }
    
    return {
      id: docSnap.id,
      ...questData
    } as Quest;
  } catch (error) {
    console.error('Error fetching quest:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to fetch quest',
      (error as FirestoreError).code
    );
  }
};

// Update quest progress
export const updateQuestProgress = async (questId: string, progress: number): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    // Validate progress value
    if (progress < 0 || progress > 100) {
      throw new QuestServiceError('Progress must be between 0 and 100', 'invalid-argument');
    }
    
    // Get the quest first to validate ownership
    const quest = await getQuestById(questId);
    if (!quest) {
      throw new QuestServiceError('Quest not found', 'not-found');
    }
    
    // Update the progress
    const docRef = doc(db, 'quests', questId);
    await updateDoc(docRef, {
      progress,
      updatedAt: serverTimestamp()
    });
    
    // If progress is 100%, mark as completed
    if (progress === 100) {
      await completeQuest(questId);
    }
  } catch (error) {
    console.error('Error updating quest progress:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to update quest progress',
      (error as FirestoreError).code
    );
  }
};

// Mark a one-time quest as completed
export const completeQuest = async (questId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    // Get the quest first to validate ownership and check if it's a habit
    const quest = await getQuestById(questId);
    if (!quest) {
      throw new QuestServiceError('Quest not found', 'not-found');
    }
    
    const docRef = doc(db, 'quests', questId);
    
    if (quest.isHabit) {
      // For habits, we update the streak, but keep the quest active
      await trackHabitCompletion(questId);
    } else {
      // For one-time quests, mark as completed
      await updateDoc(docRef, {
        status: 'completed',
        progress: 100,
        completedDate: Timestamp.now(),
        updatedAt: serverTimestamp()
      });
      
      // TODO: Award XP and stat rewards to user (would be implemented in userService)
    }
  } catch (error) {
    console.error('Error completing quest:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to complete quest',
      (error as FirestoreError).code
    );
  }
};

// Track habit completion and manage streaks
export const trackHabitCompletion = async (questId: string): Promise<{ 
  currentStreak: number; 
  streakIncreased: boolean;
  bonusMultiplier: number;
}> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    // Get the quest
    const quest = await getQuestById(questId);
    if (!quest) {
      throw new QuestServiceError('Quest not found', 'not-found');
    }
    
    if (!quest.isHabit) {
      throw new QuestServiceError('Not a habit quest', 'invalid-argument');
    }
    
    const now = Timestamp.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Prepare updates
    let currentStreak = quest.currentStreak;
    let longestStreak = quest.longestStreak;
    let streakIncreased = false;
    
    // Check if already completed today
    const lastCompletedDate = quest.lastCompletedAt?.toDate();
    if (lastCompletedDate) {
      const lastCompletedDay = new Date(lastCompletedDate);
      lastCompletedDay.setHours(0, 0, 0, 0);
      
      // If already completed today, don't update streak
      if (lastCompletedDay.getTime() === today.getTime()) {
        return { 
          currentStreak: quest.currentStreak, 
          streakIncreased: false,
          bonusMultiplier: quest.streakBonusMultiplier
        };
      }
      
      // Check if streak is broken
      const daysDifference = Math.floor(
        (today.getTime() - lastCompletedDay.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Streak is maintained if completed on consecutive days for daily habits
      // or within frequency period for other frequencies
      let streakMaintained = false;
      
      switch (quest.frequency) {
        case 'daily':
          streakMaintained = daysDifference === 1;
          break;
        case 'weekly':
          streakMaintained = daysDifference <= 7;
          break;
        case 'monthly':
          // Check if last completion was in the previous month
          const previousMonth = lastCompletedDay.getMonth();
          const currentMonth = today.getMonth();
          const previousYear = lastCompletedDay.getFullYear();
          const currentYear = today.getFullYear();
          
          streakMaintained = 
            (currentMonth === ((previousMonth + 1) % 12)) && 
            (currentYear === previousYear || 
              (currentMonth === 0 && previousMonth === 11 && currentYear === previousYear + 1));
          break;
        default:
          streakMaintained = false;
      }
      
      if (streakMaintained) {
        currentStreak += 1;
        streakIncreased = true;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        // Streak broken
        currentStreak = 1;
      }
    } else {
      // First completion
      currentStreak = 1;
      streakIncreased = true;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    }
    
    // Calculate streak bonus multiplier
    const streakBonusMultiplier = calculateStreakBonus(currentStreak);
    
    // Add to completion history
    const completionRecord = {
      date: now,
      completed: true
    };
    
    // Update the document
    const docRef = doc(db, 'quests', questId);
    await updateDoc(docRef, {
      currentStreak,
      longestStreak,
      lastCompletedAt: now,
      completionHistory: [...quest.completionHistory, completionRecord],
      streakBonusMultiplier,
      updatedAt: serverTimestamp()
    });
    
    // TODO: Award XP and stat rewards to user with streak bonus (would be implemented in userService)
    
    return { 
      currentStreak, 
      streakIncreased,
      bonusMultiplier: streakBonusMultiplier
    };
  } catch (error) {
    console.error('Error tracking habit completion:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to track habit completion',
      (error as FirestoreError).code
    );
  }
};

// Delete a quest
export const deleteQuest = async (questId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new QuestServiceError('User must be authenticated', 'auth/not-authenticated');
    
    // Get the quest first to validate ownership
    const quest = await getQuestById(questId);
    if (!quest) {
      throw new QuestServiceError('Quest not found', 'not-found');
    }
    
    // Delete the quest
    const docRef = doc(db, 'quests', questId);
    await updateDoc(docRef, {
      status: 'abandoned',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting quest:', error);
    throw new QuestServiceError(
      (error as FirestoreError).message || 'Failed to delete quest',
      (error as FirestoreError).code
    );
  }
}; 