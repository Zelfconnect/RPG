import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CharacterData, saveFutureVision, saveCurrentState, calculateAndSaveGrowthAreas, getCharacterData, ActivityFrequency } from '../services/characterService';
import StepWizard from '../components/molecules/StepWizard';
import SelectionOption from '../components/molecules/SelectionOption';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';

const ModernCharacterCreation: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  
  // Form state for each step
  const [goals, setGoals] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  
  // Available options for goals (Step 1)
  const goalOptions = [
    'Get healthier',
    'Reduce stress',
    'Boost productivity',
    'Find mental clarity',
    'Sleep better',
    'Build muscle',
    'Improve focus',
    'Have more energy',
  ];
  
  // Available options for challenges (Step 2)
  const challengeOptions = [
    'Not knowing where to start',
    'Lack of support',
    'A busy schedule',
    'Unhealthy habits',
    'Inconsistency',
    'Low motivation',
    'Work-life balance',
    'Procrastination',
  ];
  
  // Available options for activities (Step 3)
  const activityOptions = [
    'Physical exercise',
    'Meditation',
    'Reading',
    'Creative hobbies',
    'Learning',
    'Social activities',
    'Nature walks',
    'Journaling',
  ];
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Try to load existing character data (if any)
    const loadCharacterData = async () => {
      if (currentUser?.uid) {
        try {
          setIsLoading(true);
          const data = await getCharacterData(currentUser.uid);
          if (data) {
            setCharacterData(data);
            
            // If user already has completed character creation, redirect to dashboard
            if (data.futureVision?.description && data.currentState?.description) {
              navigate('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error loading character data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCharacterData();
  }, [currentUser, navigate]);
  
  const handleToggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };
  
  const handleToggleChallenge = (challenge: string) => {
    if (challenges.includes(challenge)) {
      setChallenges(challenges.filter(c => c !== challenge));
    } else {
      setChallenges([...challenges, challenge]);
    }
  };
  
  const handleToggleActivity = (activity: string) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter(a => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };
  
  const handleComplete = async () => {
    if (!currentUser?.uid) return;
    
    setIsLoading(true);
    
    try {
      // Properly typed activity frequency
      const activityFrequency: ActivityFrequency = {
        physical: 'weekly' as 'weekly',
        mental: 'weekly' as 'weekly',
        creative: 'weekly' as 'weekly',
        routine: 'weekly' as 'weekly',
        wellness: 'weekly' as 'weekly',
        social: 'weekly' as 'weekly',
      };
      
      // Prepare the current state data
      const currentStateData = {
        description: `I currently struggle with ${challenges.join(', ')}. I enjoy ${activities.join(', ')}.`,
        strengths: activities,
        challenges: challenges,
        selfRatings: {
          strength: 5,
          intelligence: 5,
          creativity: 5,
          discipline: 5,
          vitality: 5,
          social: 5
        },
        activityFrequency
      };
      
      // Prepare the future vision data
      const futureVisionData = {
        description: `I want to ${goals.join(' and ')}.`,
        keyHabits: activities,
        majorGoal: goals[0] || 'Improve my life',
      };
      
      // Save the data
      await saveCurrentState(currentUser.uid, currentStateData);
      await saveFutureVision(currentUser.uid, futureVisionData);
      await calculateAndSaveGrowthAreas(currentUser.uid, currentStateData, futureVisionData);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving character data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Define the steps for our wizard
  const steps = [
    {
      title: "What are you hoping to achieve?",
      description: "Choose as many options as you want",
      children: (
        <div className="space-y-1">
          {goalOptions.map((goal) => (
            <SelectionOption
              key={goal}
              label={goal}
              isSelected={goals.includes(goal)}
              onClick={() => handleToggleGoal(goal)}
            />
          ))}
        </div>
      )
    },
    {
      title: "What's holding you back from reaching your goals?",
      description: "Select what applies to you",
      children: (
        <div className="space-y-1">
          {challengeOptions.map((challenge) => (
            <SelectionOption
              key={challenge}
              label={challenge}
              isSelected={challenges.includes(challenge)}
              onClick={() => handleToggleChallenge(challenge)}
            />
          ))}
        </div>
      )
    },
    {
      title: "What activities do you enjoy?",
      description: "These help us understand your strengths",
      children: (
        <div className="space-y-1">
          {activityOptions.map((activity) => (
            <SelectionOption
              key={activity}
              label={activity}
              isSelected={activities.includes(activity)}
              onClick={() => handleToggleActivity(activity)}
            />
          ))}
        </div>
      )
    },
    {
      title: "Ready to start your journey!",
      children: (
        <div className="text-center py-4">
          <div className="flex justify-center mb-6">
            <img
              src="https://source.unsplash.com/random/300x200/?journey,nature"
              alt="Begin your journey"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <p className="text-gray-700 mb-4">
            We've created your character based on your selections.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">Your Goals:</p>
            <p className="text-gray-600 mb-2">{goals.join(', ') || 'No goals selected'}</p>
            
            <p className="font-medium text-gray-900">Your Challenges:</p>
            <p className="text-gray-600 mb-2">{challenges.join(', ') || 'No challenges selected'}</p>
            
            <p className="font-medium text-gray-900">Your Strengths:</p>
            <p className="text-gray-600">{activities.join(', ') || 'No activities selected'}</p>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StepWizard 
          steps={steps} 
          onComplete={handleComplete} 
        />
      </div>
    </div>
  );
};

export default ModernCharacterCreation; 