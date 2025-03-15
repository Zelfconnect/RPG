import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { UserProfile } from '../types/user';
import { getCharacterData, CharacterData } from '../services/characterService';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import StatCard from '../components/molecules/StatCard';
import Badge from '../components/atoms/Badge';
import Progress from '../components/atoms/Progress';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format attribute names
  const formatAttributeName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (!profile) {
            console.error('No user profile found');
            setError('Failed to load user profile');
          }
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to load user profile');
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
        try {
          const data = await getCharacterData(currentUser.uid);
          if (!data) {
            console.error('No character data found');
            setError('Failed to load character data');
          }
          setCharacterData(data);
        } catch (error) {
          console.error('Error fetching character data:', error);
          setError('Failed to load character data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [currentUser]);

  const handleCreateCharacter = () => {
    navigate('/character-creation');
  };

  const hasCompletedCharacterCreation = 
    characterData && 
    characterData.futureVision && 
    characterData.futureVision.description && 
    characterData.currentState && 
    characterData.currentState.description;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Character Creation Prompt */}
      {!hasCompletedCharacterCreation && (
        <Card className="mb-6" variant="elevated">
          <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Begin Your Journey</h2>
            <p className="mb-4">Create your character to start tracking your personal growth adventure!</p>
            <Button
              onClick={handleCreateCharacter}
              variant="outline"
              leftIcon={
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Create Your Character
            </Button>
          </div>
        </Card>
      )}
    
      {/* Character Overview */}
      {hasCompletedCharacterCreation && (
        <Card className="mb-6" variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {userProfile?.displayName || currentUser?.displayName || 'Adventurer'}
              </h2>
              <p className="text-sm text-gray-500">
                {characterData?.currentState?.description?.substring(0, 60)}
                {characterData?.currentState?.description && characterData.currentState.description.length > 60 ? '...' : ''}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="primary" rounded size="lg" className="mb-1">
                Level {userProfile?.level || 1}
              </Badge>
              <div className="text-xs text-gray-500">
                XP: {userProfile?.experience || 0} / {userProfile?.nextLevelExperience || 100}
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <Progress 
            value={userProfile?.experience || 0} 
            max={userProfile?.nextLevelExperience || 100}
            variant="primary"
            size="md"
            className="mb-4"
          />
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:flex lg:justify-between">
            <div className="text-center bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">Quests</div>
              <div className="font-bold text-primary">{userProfile?.questsCompleted || 0}</div>
            </div>
            <div className="text-center bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">Achievements</div>
              <div className="font-bold text-accent">{userProfile?.achievementsUnlocked || 0}</div>
            </div>
            <div className="text-center bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">Skill Points</div>
              <div className="font-bold text-secondary">{userProfile?.skillPoints || 0}</div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Character Stats */}
      {hasCompletedCharacterCreation && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Attributes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {userProfile?.stats && Object.entries(userProfile.stats).map(([stat, value]) => {
              const growthArea = characterData?.growthAreas?.[stat];
              
              return (
                <StatCard
                  key={stat}
                  name={formatAttributeName(stat)}
                  value={value}
                  maxValue={10}
                  variant="primary"
                  showTargetValue={!!growthArea}
                  targetValue={growthArea?.target}
                />
              );
            })}
            {!userProfile?.stats && (
              <>
                <StatCard name="Strength" value={5} />
                <StatCard name="Intelligence" value={5} />
                <StatCard name="Creativity" value={5} />
                <StatCard name="Discipline" value={5} />
                <StatCard name="Vitality" value={5} />
                <StatCard name="Social" value={5} />
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Future Features Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quests Section */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Quests</h3>
          <div className="text-center py-8 text-gray-400">
            <svg 
              className="icon w-12 h-12 mx-auto mb-3 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
            <p className="text-sm">Quests will appear here as you create them</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/quests')}
            >
              View All Quests
            </Button>
          </div>
        </Card>

        {/* Skills Section */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
          <div className="text-center py-8 text-gray-400">
            <svg 
              className="icon w-12 h-12 mx-auto mb-3 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
            <p className="text-sm">Develop skills to grow your character</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/skills')}
            >
              View Skills
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 