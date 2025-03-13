import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, usersCollection } from './firebase';
import { UserProfile } from '../types/user';

// Define the ActivityFrequency type for use throughout the application
export type ActivityFrequency = {
  physical: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
  mental: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
  creative: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
  routine: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
  wellness: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
  social: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
};

// Define the GrowthArea type for better type safety
export interface GrowthArea {
  current: number;
  target: number;
  gap: number;
}

export interface CharacterData {
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
    activityFrequency?: ActivityFrequency;
  };
  futureVision: {
    description: string;
    keyHabits: string[];
    majorGoal: string;
  };
  growthAreas?: Record<string, GrowthArea>;
  attributes?: {
    strength: number;
    intelligence: number;
    creativity: number;
    discipline: number;
    vitality: number;
    social: number;
  };
  currentStats?: UserProfile['stats'];
}

/**
 * Save future vision data for a user
 */
export const saveFutureVision = async (
  userId: string, 
  futureVision: CharacterData['futureVision']
): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      futureVision: JSON.stringify(futureVision),
      'character.futureVision': futureVision
    });
  } catch (error) {
    console.error('Error saving future vision:', error);
    throw error;
  }
};

/**
 * Save current state data for a user
 */
export const saveCurrentState = async (
  userId: string,
  currentState: CharacterData['currentState']
): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      currentState: JSON.stringify(currentState),
      'character.currentState': currentState
    });
  } catch (error) {
    console.error('Error saving current state:', error);
    throw error;
  }
};

/**
 * Calculate and save growth areas based on current and future state
 */
export const calculateAndSaveGrowthAreas = async (
  userId: string,
  currentState: CharacterData['currentState'],
  futureVision: CharacterData['futureVision']
): Promise<void> => {
  try {
    // Calculate current attributes
    const currentAttributes = calculateAttributesFromCurrentState(currentState);
    
    // Calculate target attributes based on future vision
    const targetAttributes = calculateAttributesFromVision(futureVision);
    
    // Calculate growth areas and gaps
    const growthAreas: Record<string, GrowthArea> = {};
    
    (Object.keys(currentAttributes) as Array<keyof UserProfile['stats']>).forEach(key => {
      growthAreas[key] = {
        current: currentAttributes[key],
        target: targetAttributes[key],
        gap: targetAttributes[key] - currentAttributes[key]
      };
    });
    
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      growthAreas: JSON.stringify(growthAreas),
      'character.growthAreas': growthAreas,
      // Update stats with a balanced view taking into account both current and target
      stats: calculateBalancedAttributes(currentAttributes, targetAttributes)
    });
  } catch (error) {
    console.error('Error calculating growth areas:', error);
    throw error;
  }
};

/**
 * Get character data for a user
 */
export const getCharacterData = async (userId: string): Promise<CharacterData | null> => {
  try {
    const userRef = doc(usersCollection, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      
      // Initialize with the correct types
      const defaultFutureVision: CharacterData['futureVision'] = { 
        description: '', 
        keyHabits: [], 
        majorGoal: '' 
      };
      
      const defaultCurrentState: CharacterData['currentState'] = { 
        description: '', 
        strengths: [], 
        challenges: [] 
      };
      
      let futureVision = { ...defaultFutureVision };
      let currentState = { ...defaultCurrentState };
      let growthAreas = {};
      
      // Handle futureVision which could be a string or an object
      if (userData.futureVision) {
        if (typeof userData.futureVision === 'string') {
          // If it's a string, try to parse it as JSON
          try {
            const parsed = JSON.parse(userData.futureVision);
            futureVision = {
              description: parsed.description || '',
              keyHabits: Array.isArray(parsed.keyHabits) ? parsed.keyHabits : [],
              majorGoal: parsed.majorGoal || ''
            };
          } catch (e) {
            // If parsing fails, use it as description
            futureVision = { 
              ...defaultFutureVision,
              description: userData.futureVision
            };
          }
        } else if (typeof userData.futureVision === 'object') {
          // If it's already an object, ensure it has the right shape
          const fv = userData.futureVision as any;
          futureVision = {
            description: fv.description || '',
            keyHabits: Array.isArray(fv.keyHabits) ? fv.keyHabits : [],
            majorGoal: fv.majorGoal || ''
          };
        }
      }
      
      // Handle currentState which could be a string or an object
      if (userData.currentState) {
        if (typeof userData.currentState === 'string') {
          // If it's a string, try to parse it as JSON
          try {
            const parsed = JSON.parse(userData.currentState);
            currentState = {
              description: parsed.description || '',
              strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
              challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
              // Handle optional properties if they exist
              selfRatings: parsed.selfRatings,
              activityFrequency: parsed.activityFrequency
            };
          } catch (e) {
            // If parsing fails, use it as description
            currentState = {
              ...defaultCurrentState,
              description: userData.currentState
            };
          }
        } else if (typeof userData.currentState === 'object') {
          // If it's already an object, ensure it has the right shape
          const cs = userData.currentState as any;
          currentState = {
            description: cs.description || '',
            strengths: Array.isArray(cs.strengths) ? cs.strengths : [],
            challenges: Array.isArray(cs.challenges) ? cs.challenges : [],
            // Handle optional properties if they exist
            selfRatings: cs.selfRatings,
            activityFrequency: cs.activityFrequency
          };
        }
      }
      
      // Handle growthAreas which could be a string or an object
      if (userData.growthAreas) {
        if (typeof userData.growthAreas === 'string') {
          // If it's a string, try to parse it as JSON
          try {
            growthAreas = JSON.parse(userData.growthAreas);
          } catch (e) {
            growthAreas = {};
          }
        } else if (typeof userData.growthAreas === 'object') {
          // If it's already an object, use it directly
          growthAreas = userData.growthAreas;
        }
      }
      
      return {
        futureVision,
        currentState,
        growthAreas,
        currentStats: userData.stats
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting character data:', error);
    return null;
  }
};

// Function to calculate attribute scores from activity frequency
export function calculateActivityFrequencyScores(activityFrequency: ActivityFrequency) {
  const frequencyValues = {
    'never': 0,
    'rarely': 3,
    'monthly': 5,
    'weekly': 7,
    'daily': 10
  };
  
  // Initialize scores for each attribute
  const scores = {
    strength: 0,
    intelligence: 0,
    creativity: 0,
    discipline: 0,
    vitality: 0,
    social: 0
  };
  
  // Map activity categories to attributes
  scores.strength += frequencyValues[activityFrequency.physical];
  scores.intelligence += frequencyValues[activityFrequency.mental];
  scores.creativity += frequencyValues[activityFrequency.creative];
  scores.discipline += frequencyValues[activityFrequency.routine];
  scores.vitality += frequencyValues[activityFrequency.wellness];
  scores.social += frequencyValues[activityFrequency.social];
  
  // Return normalized scores (on 0-10 scale)
  return scores;
}

// Main attribute calculation function that combines all components
export function calculateAttributesFromCurrentState(currentState: CharacterData['currentState']) {
  // Initialize attributes with moderate values
  const attributes = {
    strength: 5,
    intelligence: 5,
    creativity: 5,
    discipline: 5,
    vitality: 5,
    social: 5
  };
  
  // Weight for each component
  const weights = {
    selfRating: 0.6,    // 60% weight for self-ratings
    frequency: 0.3,     // 30% weight for activity frequency
    textAnalysis: 0.1   // 10% weight for text analysis
  };
  
  // 1. Process self-ratings if available (60% weight)
  if (currentState.selfRatings) {
    Object.entries(currentState.selfRatings).forEach(([attr, value]) => {
      if (attr in attributes) {
        attributes[attr as keyof typeof attributes] = 
          (attributes[attr as keyof typeof attributes] * (1 - weights.selfRating)) + 
          (value * weights.selfRating);
      }
    });
  }
  
  // 2. Process activity frequency if available (30% weight)
  if (currentState.activityFrequency) {
    const frequencyScores = calculateActivityFrequencyScores(currentState.activityFrequency as ActivityFrequency);
    Object.entries(frequencyScores).forEach(([attr, value]) => {
      if (attr in attributes) {
        attributes[attr as keyof typeof attributes] = 
          (attributes[attr as keyof typeof attributes] * (1 - weights.frequency)) + 
          (value * weights.frequency);
      }
    });
  }
  
  // 3. Process text analysis (10% weight)
  // Combine text data into a single string for analysis
  const combinedText = currentState.description + ' ' + currentState.strengths.join(' ');
  
  // Analyze strengths and description for keywords
  const strengthScore = analyzeTextForAttributes(combinedText);
  
  // Apply text analysis scores with 10% weight
  Object.entries(strengthScore).forEach(([attr, value]) => {
    if (attr in attributes) {
      attributes[attr as keyof typeof attributes] = 
        (attributes[attr as keyof typeof attributes] * (1 - weights.textAnalysis)) + 
        (value * weights.textAnalysis);
    }
  });
  
  // Round all attribute values to 1 decimal place
  Object.keys(attributes).forEach(key => {
    attributes[key as keyof typeof attributes] = 
      Math.round(attributes[key as keyof typeof attributes] * 10) / 10;
  });
  
  return attributes;
}

/**
 * Calculate character attributes based on future vision
 * This is a simple implementation that will be enhanced later
 */
export const calculateAttributesFromVision = (
  futureVision: CharacterData['futureVision']
): UserProfile['stats'] => {
  // Start with moderate values on 0-10 scale
  const attributes = {
    strength: 5,
    intelligence: 5,
    creativity: 5,
    discipline: 5,
    vitality: 5,
    social: 5
  };
  
  if (!futureVision) return attributes;
  
  // Simple keyword matching for demonstration
  const text = `${futureVision.description} ${futureVision.majorGoal} ${futureVision.keyHabits.join(' ')}`.toLowerCase();
  
  // Apply attribute boosts on 0-10 scale
  if (text.includes('fit') || text.includes('strong') || text.includes('exercise') || text.includes('gym')) {
    attributes.strength += 3;
    attributes.vitality += 2;
  }
  
  if (text.includes('read') || text.includes('learn') || text.includes('study') || text.includes('knowledge')) {
    attributes.intelligence += 3;
  }
  
  if (text.includes('art') || text.includes('write') || text.includes('create') || text.includes('design')) {
    attributes.creativity += 3;
  }
  
  if (text.includes('routine') || text.includes('habit') || text.includes('consistent') || text.includes('discipline')) {
    attributes.discipline += 3;
  }
  
  if (text.includes('health') || text.includes('sleep') || text.includes('nutrition') || text.includes('meditate')) {
    attributes.vitality += 3;
  }
  
  if (text.includes('friend') || text.includes('socialize') || text.includes('connect') || text.includes('network')) {
    attributes.social += 3;
  }
  
  // Analyze the key habits for additional context
  futureVision.keyHabits.forEach(habit => {
    const habitText = habit.toLowerCase();
    
    // Check for physical habits
    if (habitText.includes('workout') || habitText.includes('gym') || habitText.includes('run') || 
        habitText.includes('exercise') || habitText.includes('training')) {
      attributes.strength = Math.min(10, attributes.strength + 1);
      attributes.vitality = Math.min(10, attributes.vitality + 1);
    }
    
    // Check for mental habits
    if (habitText.includes('read') || habitText.includes('study') || habitText.includes('learn') || 
        habitText.includes('course')) {
      attributes.intelligence = Math.min(10, attributes.intelligence + 1);
    }
    
    // Check for creative habits
    if (habitText.includes('write') || habitText.includes('paint') || habitText.includes('create') || 
        habitText.includes('art') || habitText.includes('music')) {
      attributes.creativity = Math.min(10, attributes.creativity + 1);
    }
    
    // Check for discipline habits
    if (habitText.includes('wake up early') || habitText.includes('plan') || habitText.includes('schedule') || 
        habitText.includes('track') || habitText.includes('journal')) {
      attributes.discipline = Math.min(10, attributes.discipline + 1);
    }
    
    // Check for wellness habits
    if (habitText.includes('meditate') || habitText.includes('yoga') || habitText.includes('sleep') || 
        habitText.includes('eat') || habitText.includes('healthy') || habitText.includes('nutrition')) {
      attributes.vitality = Math.min(10, attributes.vitality + 1);
    }
    
    // Check for social habits
    if (habitText.includes('network') || habitText.includes('connect') || habitText.includes('friend') || 
        habitText.includes('call') || habitText.includes('meet')) {
      attributes.social = Math.min(10, attributes.social + 1);
    }
  });
  
  // Ensure all attributes are within 0-10 range
  (Object.keys(attributes) as Array<keyof UserProfile['stats']>).forEach(key => {
    attributes[key] = Math.max(0, Math.min(10, attributes[key]));
    // Round to one decimal place for consistency
    attributes[key] = Math.round(attributes[key] * 10) / 10;
  });
  
  return attributes;
};

/**
 * Calculate balanced attributes taking into account both current state and desired future state
 */
export const calculateBalancedAttributes = (
  currentAttributes: UserProfile['stats'],
  targetAttributes: UserProfile['stats']
): UserProfile['stats'] => {
  const balanced = { ...currentAttributes };
  
  // For each attribute, adjust current values slightly toward target
  (Object.keys(currentAttributes) as Array<keyof UserProfile['stats']>).forEach(key => {
    // If target is higher than current, add a small boost (aspiration bonus)
    if (targetAttributes[key] > currentAttributes[key]) {
      // The boost is more significant with the 0-10 scale (20% of the gap)
      balanced[key] += (targetAttributes[key] - currentAttributes[key]) * 0.2;
    }
  });
  
  // Round values to one decimal place
  (Object.keys(balanced) as Array<keyof UserProfile['stats']>).forEach(key => {
    balanced[key] = Math.round(balanced[key] * 10) / 10;
    // Ensure no attribute is over 10
    balanced[key] = Math.min(balanced[key], 10);
  });
  
  return balanced;
};

// Helper function to analyze text for attributes
function analyzeTextForAttributes(text: string) {
  const textLower = text.toLowerCase();
  
  // Initialize scores
  const scores = {
    strength: 5,
    intelligence: 5,
    creativity: 5,
    discipline: 5,
    vitality: 5,
    social: 5
  };
  
  // Keywords for each attribute
  const keywords: Record<string, string[]> = {
    strength: ['strong', 'fit', 'athletic', 'exercise', 'workout', 'gym', 'physical', 'sport'],
    intelligence: ['smart', 'intelligent', 'learn', 'study', 'read', 'problem', 'solve', 'analyze', 'knowledge'],
    creativity: ['creative', 'art', 'music', 'write', 'design', 'imagine', 'innovative', 'novel', 'original'],
    discipline: ['discipline', 'routine', 'habit', 'consistent', 'organize', 'plan', 'focus', 'committed'],
    vitality: ['energy', 'health', 'sleep', 'nutrition', 'diet', 'rest', 'recovery', 'wellbeing', 'wellness'],
    social: ['social', 'friend', 'family', 'communicate', 'relationship', 'connect', 'network', 'community']
  };
  
  // Check for keywords for each attribute
  Object.entries(keywords).forEach(([attr, words]) => {
    let matchCount = 0;
    words.forEach(word => {
      // Count occurrences of each keyword
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    });
    
    // Adjust score based on keyword matches (max +/- 5 points)
    if (matchCount > 0) {
      // Calculate boost (max 5 points)
      const boost = Math.min(5, matchCount * 1.5);
      scores[attr as keyof typeof scores] = Math.min(10, 5 + boost);
    }
  });
  
  return scores;
} 