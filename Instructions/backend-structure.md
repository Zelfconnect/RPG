# Backend Structure: Personal Growth OS

For Personal Growth OS, we'll use Firebase as our backend platform. This approach is ideal for beginners as it eliminates the need to set up and manage a traditional server while providing all the necessary functionality.

## API Design

Since we're using Firebase, our "API" will primarily consist of interactions with Firebase services via the Firebase SDK. We'll structure these interactions in a clean, organized way to maintain code quality and scalability.

### Service Structure

We'll create service modules that encapsulate all Firebase interactions:

```
/src
  /services
    /auth.js         # Authentication methods
    /firestore.js    # Database interaction utilities
    /quests.js       # Quest-specific operations
    /characters.js   # Character management
    /skills.js       # Skill tree operations
    /chapters.js     # Monthly chapter operations
```

### Request/Response Formats

Since we're working directly with Firebase instead of a traditional REST API, we'll standardize how we structure data going to and from Firestore:

```javascript
// services/quests.js
import { db } from './firestore';
import { getCurrentUser } from './auth';

/**
 * Creates a new quest for the current user
 * 
 * @param {Object} questData - The quest data
 * @returns {Promise<string>} - The ID of the created quest
 */
export async function createQuest(questData) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User must be authenticated');
    
    // Prepare the document
    const questDoc = {
      userId: user.uid,
      title: questData.title,
      description: questData.description,
      type: questData.type,
      difficulty: questData.difficulty,
      status: 'active',
      progress: 0,
      xpReward: questData.xpReward || calculateXpReward(questData.difficulty),
      statRewards: questData.statRewards || {},
      relatedSkills: questData.relatedSkills || [],
      startDate: questData.startDate || new Date(),
      endDate: questData.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to Firestore
    const docRef = await db.collection('quests').add(questDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating quest:', error);
    throw error;
  }
}

/**
 * Fetches quests for the current user
 * 
 * @param {Object} options - Filtering options
 * @returns {Promise<Array>} - Array of quest objects
 */
export async function getUserQuests({ status, type } = {}) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User must be authenticated');
    
    // Start with base query
    let query = db.collection('quests').where('userId', '==', user.uid);
    
    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    // Execute query
    const snapshot = await query.get();
    
    // Format the response
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to JS Dates
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      completedDate: doc.data().completedDate?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw error;
  }
}

// Helper function to calculate XP reward based on difficulty
function calculateXpReward(difficulty) {
  const baseXp = 50;
  return baseXp * difficulty;
}
```

### Error Handling Approach

We'll implement consistent error handling across the application:

```javascript
// services/errorUtils.js
export class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export function handleFirebaseError(error) {
  // Map Firebase error codes to user-friendly messages
  const errorMap = {
    'auth/user-not-found': 'No user found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'This email is already registered',
    // Add more mappings as needed
  };
  
  const message = errorMap[error.code] || error.message || 'An unknown error occurred';
  return new AppError(message, error.code || 'unknown');
}

// Usage in services
import { handleFirebaseError } from './errorUtils';

export async function signIn(email, password) {
  try {
    // Firebase auth code
  } catch (error) {
    throw handleFirebaseError(error);
  }
}
```

## Data Models

### Schema Definitions

Below are the core data models for the application, defined as Firestore collections:

#### Users Collection

```javascript
/**
 * User profile document
 */
interface User {
  uid: string;              // Firebase Auth user ID
  email: string;            // User's email address
  displayName: string;      // User's display name
  photoURL?: string;        // Optional profile picture URL
  createdAt: Timestamp;     // When the account was created
  lastLogin: Timestamp;     // Last login timestamp
  settings: {               // User preferences
    theme: 'light' | 'dark' | 'rpg';
    emailNotifications: boolean;
    // Other settings
  }
}
```

#### Characters Collection

```javascript
/**
 * Character document - represents user's personal development "character"
 */
interface Character {
  userId: string;           // Reference to user
  name: string;             // Character name (often same as user name)
  level: number;            // Current character level
  xp: number;               // Current experience points
  stats: {                  // Core attributes
    mind: number;           // Intelligence, learning, creativity
    body: number;           // Physical health, fitness
    heart: number;          // Emotional, social
    spirit: number;         // Purpose, mindfulness
    craft: number;          // Professional skills
    influence: number;      // Leadership, communication
  };
  originStory: string;      // Character backstory from onboarding
  currentChapter: string;   // Current narrative context
  futureVision: string;     // Long-term aspirations
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Quests Collection

```javascript
/**
 * Quest document - represents goals and tasks
 */
interface Quest {
  userId: string;           // Reference to user
  title: string;            // Quest name
  description: string;      // Detailed description
  narrative: string;        // Story context for this quest
  type: 'main' | 'side' | 'daily' | 'challenge' | 'guild';  // Quest category
  difficulty: number;       // 1-5 scale
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  progress: number;         // 0-100 percentage
  xpReward: number;         // XP gained on completion
  statRewards: {            // Stat increases on completion
    [statName: string]: number;
  };
  relatedSkills: string[];  // Skills this quest helps develop
  startDate: Timestamp;
  endDate: Timestamp;       // Due date
  completedDate?: Timestamp;// When it was completed
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Skills Collection

```javascript
/**
 * Skill document - represents abilities in the skill tree
 */
interface Skill {
  userId: string;           // Reference to user
  name: string;             // Skill name
  description: string;      // What this skill represents
  category: 'mind' | 'body' | 'heart' | 'spirit' | 'craft' | 'influence';
  level: number;            // Current skill level
  progress: number;         // Progress to next level (0-100)
  maxLevel: number;         // Maximum possible level
  benefits: string[];       // Benefits of developing this skill
  prerequisites: {          // Skills required before this one
    skillId: string;
    requiredLevel: number;
  }[];
  position: {               // Position in skill tree visualization
    x: number;
    y: number;
    branch: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### MonthlyChapters Collection

```javascript
/**
 * MonthlyChapter document - tracks monthly cycles
 */
interface MonthlyChapter {
  userId: string;           // Reference to user
  month: number;            // 1-12
  year: number;             // Year
  title: string;            // Chapter title
  narrative: string;        // Narrative summary
  focusAreas: string[];     // Primary focus skills/stats
  completedQuests: {        // Quests completed this month
    questId: string;
    title: string;
    completedDate: Timestamp;
  }[];
  reflections: {            // End-of-month reflections
    achievements: string;
    challenges: string;
    insights: string;
    nextFocus: string;
  };
  statsAtStart: {           // Snapshot of stats at month start
    [statName: string]: number;
  };
  statsGained: {            // Stats gained during month
    [statName: string]: number;
  };
  xpGained: number;         // XP earned this month
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Validation Rules

We'll implement validation in Firebase security rules and in our application code:

```javascript
// Firestore security rules (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is accessing their own data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Validate quest data
    function isValidQuest(quest) {
      return quest.title.size() > 0 && 
             quest.title.size() <= 100 &&
             quest.difficulty >= 1 && 
             quest.difficulty <= 5;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }
    
    // Characters collection
    match /characters/{characterId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId) && 
                      request.resource.data.level == 1 && 
                      request.resource.data.xp == 0;
      allow update: if isOwner(resource.data.userId);
    }
    
    // Quests collection
    match /quests/{questId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId) && 
                      isValidQuest(request.resource.data);
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Similar rules for other collections
  }
}
```

### Client-side Validation

```javascript
// utils/validation.js
export const validators = {
  // Quest validation
  quest: {
    title: (value) => {
      if (!value) return 'Title is required';
      if (value.length > 100) return 'Title must be 100 characters or less';
      return null;
    },
    description: (value) => {
      if (!value) return 'Description is required';
      if (value.length > 500) return 'Description must be 500 characters or less';
      return null;
    },
    difficulty: (value) => {
      if (!value) return 'Difficulty is required';
      if (value < 1 || value > 5) return 'Difficulty must be between 1 and 5';
      return null;
    },
    // Other validations
  },
  
  // Character validation
  character: {
    name: (value) => {
      if (!value) return 'Name is required';
      if (value.length > 50) return 'Name must be 50 characters or less';
      return null;
    },
    // Other validations
  }
};

export function validateForm(data, validatorSet) {
  const errors = {};
  
  for (const [field, validator] of Object.entries(validatorSet)) {
    if (data[field] !== undefined) {
      const error = validator(data[field]);
      if (error) errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Usage
import { validators, validateForm } from '../utils/validation';

function createQuest(questData) {
  const { isValid, errors } = validateForm(questData, validators.quest);
  
  if (!isValid) {
    throw new Error(JSON.stringify(errors));
  }
  
  // Proceed with creating quest
}
```

## Authentication & Authorization

### User Authentication Flow

We'll use Firebase Authentication for a complete authentication system:

```javascript
// services/auth.js
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firestore';

const auth = getAuth();

/**
 * Register a new user
 */
export async function registerUser(email, password, displayName) {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      settings: {
        theme: 'light',
        emailNotifications: true
      }
    });
    
    // Initialize character
    await setDoc(doc(db, 'characters', user.uid), {
      userId: user.uid,
      name: displayName,
      level: 1,
      xp: 0,
      stats: {
        mind: 1,
        body: 1,
        heart: 1,
        spirit: 1,
        craft: 1,
        influence: 1
      },
      originStory: '',
      currentChapter: '',
      futureVision: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

/**
 * Sign in existing user
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
```

### React Context for Auth

```javascript
// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Protected Routes

```javascript
// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Usage in router
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## Business Logic

### Service Layer Organization

Our business logic will be organized into service modules by feature area. Each service will encapsulate the logic for a specific domain:

```javascript
// services/characterProgression.js
import { db } from './firestore';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Award XP to a character and handle level-ups
 */
export async function awardXP(userId, amount) {
  try {
    const characterRef = doc(db, 'characters', userId);
    const characterSnap = await getDoc(characterRef);
    
    if (!characterSnap.exists()) {
      throw new Error('Character not found');
    }
    
    const character = characterSnap.data();
    const newXP = character.xp + amount;
    const nextLevelXP = calculateXpForNextLevel(character.level);
    
    // Check if should level up
    if (newXP >= nextLevelXP) {
      const newLevel = character.level + 1;
      
      // Update character
      await updateDoc(characterRef, {
        xp: newXP - nextLevelXP,  // Remaining XP after level up
        level: newLevel,
        updatedAt: new Date()
      });
      
      // Return level up info
      return {
        leveledUp: true,
        newLevel,
        remainingXp: newXP - nextLevelXP
      };
    } else {
      // Just update XP
      await updateDoc(characterRef, {
        xp: newXP,
        updatedAt: new Date()
      });
      
      return {
        leveledUp: false,
        newLevel: character.level,
        remainingXp: newXP
      };
    }
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
}

/**
 * Calculate XP required for next level
 */
function calculateXpForNextLevel(currentLevel) {
  // RPG-style exponential progression
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
}

/**
 * Increase a specific stat
 */
export async function increaseStat(userId, statName, amount) {
  try {
    const characterRef = doc(db, 'characters', userId);
    
    // Use atomic increment operation
    await updateDoc(characterRef, {
      [`stats.${statName}`]: increment(amount),
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error(`Error increasing ${statName}:`, error);
    throw error;
  }
}
```

### Quest Management

```javascript
// services/questManager.js
import { db } from './firestore';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { awardXP, increaseStat } from './characterProgression';

/**
 * Complete a quest and award rewards
 */
export async function completeQuest(userId, questId) {
  try {
    const questRef = doc(db, 'quests', questId);
    const questSnap = await getDoc(questRef);
    
    if (!questSnap.exists()) {
      throw new Error('Quest not found');
    }
    
    const quest = questSnap.data();
    
    // Verify quest belongs to user
    if (quest.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Update quest status
    await updateDoc(questRef, {
      status: 'completed',
      progress: 100,
      completedDate: new Date(),
      updatedAt: new Date()
    });
    
    // Award XP
    const xpResult = await awardXP(userId, quest.xpReward);
    
    // Award stat increases
    const statPromises = [];
    for (const [stat, amount] of Object.entries(quest.statRewards)) {
      statPromises.push(increaseStat(userId, stat, amount));
    }
    await Promise.all(statPromises);
    
    // Update related skills
    if (quest.relatedSkills && quest.relatedSkills.length > 0) {
      await updateSkillsFromQuest(userId, quest.relatedSkills);
    }
    
    // Add to current monthly chapter
    await addQuestToCurrentChapter(userId, {
      questId,
      title: quest.title,
      completedDate: new Date()
    });
    
    // Return completion results
    return {
      xpAwarded: quest.xpReward,
      levelUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      statsIncreased: quest.statRewards
    };
  } catch (error) {
    console.error('Error completing quest:', error);
    throw error;
  }
}

/**
 * Update progress on skills related to a quest
 */
async function updateSkillsFromQuest(userId, skillIds) {
  try {
    const skillsRef = collection(db, 'skills');
    const q = query(
      skillsRef,
      where('userId', '==', userId),
      where('id', 'in', skillIds)
    );
    
    const snapshot = await getDocs(q);
    
    const updatePromises = snapshot.docs.map(doc => {
      const skill = doc.data();
      const newProgress = Math.min(skill.progress + 20, 100);
      
      // Check if skill should level up
      if (newProgress === 100 && skill.level < skill.maxLevel) {
        return updateDoc(doc.ref, {
          level: skill.level + 1,
          progress: 0,
          updatedAt: new Date()
        });
      } else {
        return updateDoc(doc.ref, {
          progress: newProgress,
          updatedAt: new Date()
        });
      }
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating skills:', error);
    throw error;
  }
}

/**
 * Add completed quest to current monthly chapter
 */
async function addQuestToCurrentChapter(userId, questInfo) {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();
    
    // Find current chapter
    const chaptersRef = collection(db, 'monthlyChapters');
    const q = query(
      chaptersRef,
      where('userId', '==', userId),
      where('month', '==', currentMonth),
      where('year', '==', currentYear)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.warn('No current monthly chapter found');
      return;
    }
    
    const chapterDoc = snapshot.docs[0];
    const chapter = chapterDoc.data();
    
    // Add quest to completed quests
    const completedQuests = chapter.completedQuests || [];
    completedQuests.push(questInfo);
    
    await updateDoc(chapterDoc.ref, {
      completedQuests,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error adding quest to chapter:', error);
    // We don't throw here to prevent failing the overall completion
    // just because we couldn't update the chapter
  }
}
```

### Monthly Chapter Management

```javascript
// services/chapterManager.js
import { db } from './firestore';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';

/**
 * Start a new monthly chapter
 */
export async function startNewChapter(userId, chapterData) {
  try {
    // Get character data for stats snapshot
    const characterRef = doc(db, 'characters', userId);
    const characterSnap = await getDoc(characterRef);
    
    if (!characterSnap.exists()) {
      throw new Error('Character not found');
    }
    
    const character = characterSnap.data();
    
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();
    
    // Check if chapter already exists for this month
    const chaptersRef = collection(db, 'monthlyChapters');
    const q = query(
      chaptersRef,
      where('userId', '==', userId),
      where('month', '==', month),
      where('year', '==', year)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error('Chapter already exists for this month');
    }
    
    // Calculate start and end dates
    const startDate = new Date(year, month - 1, 1); // First day of month
    let endDate = new Date(year, month, 0); // Last day of month
    
    // Create new chapter
    const newChapter = {
      userId,
      month,
      year,
      title: chapterData.title || `Chapter ${month}, ${year}`,
      narrative: chapterData.narrative || '',
      focusAreas: chapterData.focusAreas || [],
      completedQuests: [],
      reflections: {
        achievements: '',
        challenges: '',
        insights: '',
        nextFocus: ''
      },
      statsAtStart: { ...character.stats },
      statsGained: {
        mind: 0,
        body: 0,
        heart: 0,
        spirit: 0,
        craft: 0,
        influence: 0
      },
      xpGained: 0,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'monthlyChapters'), newChapter);
    
    return {
      id: docRef.id,
      ...newChapter
    };
  } catch (error) {
    console.error('Error starting new chapter:', error);
    throw error;
  }
}

/**
 * Get active chapter for current month
 */
export async function getCurrentChapter(userId) {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();
    
    const chaptersRef = collection(db, 'monthlyChapters');
    const q = query(
      chaptersRef,
      where('userId', '==', userId),
      where('month', '==', currentMonth),
      where('year', '==', currentYear)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null; // No current chapter
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting current chapter:', error);
    throw error;
  }
}

/**
 * Complete monthly chapter with reflections
 */
export async function completeChapter(chapterId, reflections) {
  try {
    const chapterRef = doc(db, 'monthlyChapters', chapterId);
    
    await updateDoc(chapterRef, {
      'reflections.achievements': reflections.achievements || '',
      'reflections.challenges': reflections.challenges || '',
      'reflections.insights': reflections.insights || '',
      'reflections.nextFocus': reflections.nextFocus || '',
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error completing chapter:', error);
    throw error;
  }
}
```

## Performance Considerations

### Caching Strategy

We'll implement a simple caching approach to reduce Firestore reads:

```javascript
// services/cacheService.js
import { useState, useEffect } from 'react';

// In-memory cache
const cache = {
  data: {},
  timestamp: {}
};

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data or fetch from source
 * 
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch data if not cached
 * @param {number} expiryTime - Custom expiry time in ms
 */
export async function getWithCache(key, fetchFunction, expiryTime = CACHE_EXPIRY) {
  const now = Date.now();
  
  // Check if data exists and is not expired
  if (cache.data[key] && (now - cache.timestamp[key]) < expiryTime) {
    return cache.data[key];
  }
  
  // Fetch fresh data
  const data = await fetchFunction();
  
  // Update cache
  cache.data[key] = data;
  cache.timestamp[key] = now;
  
  return data;
}

/**
 * Invalidate cache for a specific key
 */
export function invalidateCache(key) {
  delete cache.data[key];
  delete cache.timestamp[key];
}

/**
 * Hook for cached data
 */
export function useCachedData(key, fetchFunction, deps = [], expiryTime = CACHE_EXPIRY) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getWithCache(key, fetchFunction, expiryTime);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        console.error(`Error fetching ${key}:`, err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, deps);
  
  return { data, loading, error };
}

// Usage example
function CharacterProfile() {
  const { data: character, loading, error } = useCachedData(
    `character_${userId}`,
    () => getCharacter(userId),
    [userId]
  );
  
  // Component implementation
}
```

### Database Optimization

Since we're using Firestore, we'll follow these optimization patterns:

1. **Denormalization**: Store frequently accessed data together to reduce multiple reads
2. **Collection Structure**: Design collections for query efficiency
3. **Indexing**: Create composite indexes for common queries
4. **Batched Writes**: Use batched operations for related updates

```javascript
// Example of batched writes
import { writeBatch } from 'firebase/firestore';

async function completeQuestWithUpdates(userId, questId) {
  try {
    const batch = writeBatch(db);
    
    // Update quest
    const questRef = doc(db, 'quests', questId);
    batch.update(questRef, {
      status: 'completed',
      completedDate: new Date()
    });
    
    // Update character stats
    const characterRef = doc(db, 'characters', userId);
    batch.update(characterRef, {
      xp: increment(50),
      'stats.mind': increment(1)
    });
    
    // Update monthly chapter
    const chapterRef = doc(db, 'monthlyChapters', chapterId);
    batch.update(chapterRef, {
      completedQuests: arrayUnion({ questId, completedDate: new Date() })
    });
    
    // Commit all changes in one batch
    await batch.commit();
    
    return true;
  } catch (error) {
    console.error('Error in batch update:', error);
    throw error;
  }
}
```

### Rate Limiting

For a beginner application, Firebase's default rate limits should be sufficient initially. However, we can implement some basic protection:

```javascript
// services/rateLimiter.js
const actionLimits = {
  createQuest: {
    count: 0,
    lastReset: Date.now(),
    max: 10,  // Max 10 quests per hour
    resetInterval: 60 * 60 * 1000  // 1 hour
  }
};

export function checkRateLimit(action) {
  if (!actionLimits[action]) {
    return true; // No limit for this action
  }
  
  const limit = actionLimits[action];
  const now = Date.now();
  
  // Reset counter if interval passed
  if (now - limit.lastReset > limit.resetInterval) {
    limit.count = 0;
    limit.lastReset = now;
  }
  
  // Check if limit reached
  if (limit.count >= limit.max) {
    return false;
  }
  
  // Increment counter
  limit.count++;
  return true;
}

// Usage
function createQuest(questData) {
  if (!checkRateLimit('createQuest')) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  // Create quest code
}
```

## Security Measures

### Input Validation

In addition to the validation we've already covered, we'll implement defensive coding practices:

```javascript
// utils/safeData.js

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(text) {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Ensure value is a number or fallback to default
 */
export function ensureNumber(value, defaultValue = 0) {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely access nested properties
 */
export function safeGet(obj, path, defaultValue = null) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
}
```

### Data Protection

We'll implement backup and data protection functions:

```javascript
// services/dataExport.js
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firestore';

/**
 * Export user data to JSON
 */
export async function exportUserData(userId) {
  try {
    const userData = {
      user: null,
      character: null,
      quests: [],
      skills: [],
      chapters: []
    };
    
    // Get user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      userData.user = userDoc.data();
    }
    
    // Get character
    const characterDoc = await getDoc(doc(db, 'characters', userId));
    if (characterDoc.exists()) {
      userData.character = characterDoc.data();
    }
    
    // Get quests
    const questsQuery = query(
      collection(db, 'quests'),
      where('userId', '==', userId)
    );
    const questsSnap = await getDocs(questsQuery);
    questsSnap.forEach(doc => {
      userData.quests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Similar queries for skills and chapters
    
    return userData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}

/**
 * Delete user account and all associated data
 */
export async function deleteUserAccount(userId) {
  try {
    const batch = writeBatch(db);
    
    // Delete user document
    batch.delete(doc(db, 'users', userId));
    
    // Delete character
    batch.delete(doc(db, 'characters', userId));
    
    // Find and delete all quests
    const questsQuery = query(
      collection(db, 'quests'),
      where('userId', '==', userId)
    );
    const questsSnap = await getDocs(questsQuery);
    questsSnap.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Similar code for skills and chapters
    
    // Commit all deletions
    await batch.commit();
    
    // Delete Firebase Auth user
    await deleteUser(auth.currentUser);
    
    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}
```

### Security Headers

Since we're using Firebase Hosting, we can configure security headers in firebase.json:

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://firebasestorage.googleapis.com data:; connect-src 'self' https://*.firebase.com https://*.firebaseio.com;"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  }
}
```

## Implementation Approach

For a beginner implementation, we'll start with the core authentication and database interactions:

1. Create Firebase project and initialize configuration
2. Implement authentication with Firebase Auth
3. Set up Firestore database with basic security rules
4. Create service modules for database interactions
5. Develop data models and CRUD operations
6. Integrate with React components

We'll structure Firebase setup in a simple, reusable way:

```javascript
// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

With this framework in place, beginners can focus on implementing the core features without getting overwhelmed by backend complexities.