import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CharacterData, saveFutureVision, saveCurrentState, calculateAndSaveGrowthAreas, getCharacterData } from '../services/characterService';

// Individual step components
import FutureSelfSnapshot from '../components/character/FutureSelfSnapshot';
import CharacterSummary from '../components/character/CharacterSummary';
import CurrentStateAssessment from '../components/character/CurrentStateAssessment';

// Define the different steps in the character creation process
enum CreationStep {
  CURRENT_STATE = 'current_state',
  FUTURE_SELF = 'future_self',
  SUMMARY = 'summary',
}

const CharacterCreation: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<CreationStep>(CreationStep.CURRENT_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  
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
            
            // If user already has a future vision, go to summary step
            if (data.futureVision && typeof data.futureVision === 'object' && data.futureVision.description) {
              setCurrentStep(CreationStep.SUMMARY);
            }
            // If user has current state but no future vision, go to future self step
            else if (data.currentState && typeof data.currentState === 'object' && data.currentState.description) {
              setCurrentStep(CreationStep.FUTURE_SELF);
            }
          }
        } catch (error) {
          console.error('Error loading character data:', error);
          // Could add error state handling here
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCharacterData();
  }, [currentUser, navigate]);
  
  const handleCurrentStateComplete = async (currentState: CharacterData['currentState']) => {
    if (!currentUser?.uid) return;
    
    setIsLoading(true);
    
    try {
      // Save current state data
      await saveCurrentState(currentUser.uid, currentState);
      
      // Update local state with type-safe approach
      setCharacterData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            currentState
          };
        }
        return {
          futureVision: {
            description: '',
            keyHabits: [],
            majorGoal: ''
          },
          currentState
        };
      });
      
      // Move to next step
      setCurrentStep(CreationStep.FUTURE_SELF);
    } catch (error) {
      console.error('Error saving current state:', error);
      // Could add error state and UI handling here
    } finally {
      setIsLoading(false);
    }
  };

  const handleFutureVisionComplete = async (futureVision: CharacterData['futureVision']) => {
    if (!currentUser?.uid || !characterData?.currentState) {
      console.error('Missing user ID or current state data');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save future vision data
      await saveFutureVision(currentUser.uid, futureVision);
      
      // Calculate and save growth areas based on current and future state
      await calculateAndSaveGrowthAreas(
        currentUser.uid, 
        characterData.currentState, 
        futureVision
      );
      
      // Update local state with type-safe approach
      setCharacterData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            futureVision
          };
        }
        return {
          futureVision,
          currentState: characterData.currentState,
        };
      });
      
      // Move to next step
      setCurrentStep(CreationStep.SUMMARY);
    } catch (error) {
      console.error('Error saving future vision:', error);
      // Could add error state and UI handling here
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCurrentState = () => {
    setCurrentStep(CreationStep.CURRENT_STATE);
  };

  const handleBackToFutureVision = () => {
    setCurrentStep(CreationStep.FUTURE_SELF);
  };

  const handleCharacterCreationComplete = () => {
    navigate('/dashboard');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Let's Get to Know You</h1>
        
        <div className="bg-white shadow-sm rounded-lg mb-8 py-4">
          <ol className="flex justify-center items-center space-x-2 sm:space-x-8">
            <li className={`flex items-center ${currentStep === CreationStep.CURRENT_STATE ? 'text-primary font-medium' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === CreationStep.CURRENT_STATE ? 'border-primary' : 
                  currentStep === CreationStep.FUTURE_SELF || currentStep === CreationStep.SUMMARY ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
              }`}>
                1
              </span>
              <span className="ml-2 text-sm sm:text-base font-medium">Tell Us About Yourself Today</span>
            </li>
            <div className="w-8 sm:w-12 h-0.5 bg-gray-300"></div>
            <li className={`flex items-center ${currentStep === CreationStep.FUTURE_SELF ? 'text-primary font-medium' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === CreationStep.FUTURE_SELF ? 'border-primary' : 
                  currentStep === CreationStep.SUMMARY ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
              }`}>
                2
              </span>
              <span className="ml-2 text-sm sm:text-base font-medium">Your Future Self</span>
            </li>
            <div className="w-8 sm:w-12 h-0.5 bg-gray-300"></div>
            <li className={`flex items-center ${currentStep === CreationStep.SUMMARY ? 'text-primary font-medium' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === CreationStep.SUMMARY ? 'border-primary' : 'border-gray-300'
              }`}>
                3
              </span>
              <span className="ml-2 text-sm sm:text-base font-medium">Summary</span>
            </li>
          </ol>
        </div>

        {currentStep === CreationStep.CURRENT_STATE && (
          <CurrentStateAssessment 
            onSave={handleCurrentStateComplete} 
            initialData={characterData?.currentState}
          />
        )}

        {currentStep === CreationStep.FUTURE_SELF && (
          <FutureSelfSnapshot 
            onSave={handleFutureVisionComplete} 
            onBack={handleBackToCurrentState}
            initialData={characterData?.futureVision}
          />
        )}

        {currentStep === CreationStep.SUMMARY && characterData && (
          <CharacterSummary 
            characterData={characterData} 
            onComplete={handleCharacterCreationComplete}
            onBack={handleBackToFutureVision}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterCreation; 