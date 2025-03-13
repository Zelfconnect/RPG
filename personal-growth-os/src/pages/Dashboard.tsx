import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { UserProfile } from '../types/user';
import { getCharacterData, CharacterData } from '../services/characterService';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    const fetchCharacterData = async () => {
      setLoading(true);
      if (currentUser) {
        const data = await getCharacterData(currentUser.uid);
        setCharacterData(data);
      }
      setLoading(false);
    };

    fetchCharacterData();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  const handleCreateCharacter = () => {
    navigate('/character-creation');
  };

  const hasCompletedCharacterCreation = 
    characterData && 
    characterData.futureVision && 
    characterData.futureVision.description && 
    characterData.currentState && 
    characterData.currentState.description;

  // Format attribute name for display
  const formatAttributeName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Personal Growth OS</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{currentUser?.displayName || currentUser?.email}</span>
              <span className="ml-1 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                Level {userProfile?.level || 1}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Character Creation Prompt */}
        {!hasCompletedCharacterCreation && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold mb-2">Begin Your Journey</h2>
              <p className="mb-4">Create your character to start tracking your personal growth adventure!</p>
              <button
                onClick={handleCreateCharacter}
                className="inline-block px-6 py-3 bg-white text-indigo-700 font-medium rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              >
                Create Your Character
              </button>
            </div>
          </div>
        )}
      
        {/* Character Overview */}
        {hasCompletedCharacterCreation && (
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {userProfile?.displayName || currentUser?.displayName || 'Adventurer'}
                </h2>
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Level {userProfile?.level || 1}
                  </div>
                  <div className="ml-2 text-xs text-gray-500 text-center">
                    XP: {userProfile?.experience || 0} / {userProfile?.nextLevelExperience || 100}
                  </div>
                </div>
              </div>
              
              {/* XP Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(
                      ((userProfile?.experience || 0) / (userProfile?.nextLevelExperience || 100)) * 100, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
              
              {/* Character Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
                {userProfile?.stats && Object.entries(userProfile.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">{formatAttributeName(stat)}</div>
                    <div className="text-2xl font-bold text-gray-700">{value}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ width: `${(value / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {!userProfile?.stats && (
                  <>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Strength</div>
                      <div className="text-2xl font-bold text-gray-700">5.0</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Intelligence</div>
                      <div className="text-2xl font-bold text-gray-700">5.0</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Creativity</div>
                      <div className="text-2xl font-bold text-gray-700">5.0</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Discipline</div>
                      <div className="text-2xl font-bold text-gray-700">5.0</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Vitality</div>
                      <div className="text-2xl font-bold text-gray-700">5.0</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Social</div>
                      <div className="text-2xl font-bold text-gray-700">5.0</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasCompletedCharacterCreation ? (
            <>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Daily Quests</h3>
                  <p className="mt-2 text-sm text-gray-500">Complete daily tasks to earn experience points.</p>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                      Add New Quest
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Character Stats</h3>
                  <p className="mt-2 text-sm text-gray-500">Track your growth in different life attributes.</p>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
                  <p className="mt-2 text-sm text-gray-500">View your completed challenges and milestones.</p>
                  <div className="mt-4">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{userProfile?.achievementsUnlocked || 0}</span> achievements unlocked
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-6 py-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Character to Unlock Features</h3>
                <p className="text-gray-500 mb-6">Complete your character creation to access quests, skill tracking, and more.</p>
                <button
                  onClick={handleCreateCharacter}
                  className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Start Character Creation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Character Data */}
        {hasCompletedCharacterCreation && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Character Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current State */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Current State</h3>
                  <p className="text-gray-600 mb-3">{characterData?.currentState?.description}</p>
                  
                  {characterData?.currentState?.strengths.length ? (
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-600">Strengths:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm ml-2">
                        {characterData.currentState.strengths.map((strength, idx) => (
                          <li key={`strength-${idx}`}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  
                  {characterData?.currentState?.challenges.length ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Challenges:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm ml-2">
                        {characterData.currentState.challenges.map((challenge, idx) => (
                          <li key={`challenge-${idx}`}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                
                {/* Future Vision */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Future Vision</h3>
                  <p className="text-gray-600 mb-3">{characterData?.futureVision?.description}</p>
                  
                  {characterData?.futureVision?.keyHabits.length ? (
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-600">Key Habits:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm ml-2">
                        {characterData.futureVision.keyHabits.map((habit, idx) => (
                          <li key={`habit-${idx}`}>{habit}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  
                  {characterData?.futureVision?.majorGoal ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Major Goal:</h4>
                      <p className="text-gray-600 text-sm ml-2">{characterData.futureVision.majorGoal}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Attributes with Growth Potential */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Attributes</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {characterData?.currentStats && Object.entries(characterData.currentStats).map(([attr, value]) => {
                  const attrKey = attr as keyof typeof characterData.currentStats;
                  const growthArea = characterData.growthAreas?.[attrKey];
                  
                  return (
                    <div key={attr} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-700">{formatAttributeName(attr)}</h3>
                        <span className="text-lg font-bold text-primary">{value}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(value / 10) * 100}%` }}
                        ></div>
                      </div>
                      
                      {growthArea && (
                        <div className="mt-2">
                          <span className="text-xs text-blue-600">
                            Growth potential: {growthArea.current} → {growthArea.target}
                            {growthArea.gap > 0 && (
                              <span className="text-green-600 ml-1">(+{growthArea.gap})</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Quests Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Active Quests</h2>
                <button
                  className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  Create New Quest
                </button>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <p>You don't have any active quests yet.</p>
                <p className="mt-2">Create a quest to start gaining experience and improving your attributes!</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 