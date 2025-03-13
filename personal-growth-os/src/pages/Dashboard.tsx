import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { UserProfile } from '../types/user';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

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
        {/* Character Overview */}
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
                <div className="ml-2 text-xs text-gray-500">
                  XP: {userProfile?.experience || 0} / {(((userProfile?.level || 1) + 1) ** 2) * 100}
                </div>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(
                    ((userProfile?.experience || 0) / ((((userProfile?.level || 1) + 1) ** 2) * 100)) * 100, 
                    100
                  )}%` 
                }}
              ></div>
            </div>
            
            {/* Character Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              {userProfile?.stats && Object.entries(userProfile.stats).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <div className="text-xs uppercase tracking-wide text-gray-500">{stat}</div>
                  <div className="text-2xl font-bold text-gray-700">{value}</div>
                </div>
              ))}
              {!userProfile?.stats && (
                <>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Strength</div>
                    <div className="text-2xl font-bold text-gray-700">1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Intelligence</div>
                    <div className="text-2xl font-bold text-gray-700">1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Creativity</div>
                    <div className="text-2xl font-bold text-gray-700">1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Discipline</div>
                    <div className="text-2xl font-bold text-gray-700">1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Vitality</div>
                    <div className="text-2xl font-bold text-gray-700">1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Social</div>
                    <div className="text-2xl font-bold text-gray-700">1</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 