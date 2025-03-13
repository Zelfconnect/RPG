import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Personal Growth OS</h1>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Log Out
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to your Dashboard!</h2>
            <p className="text-gray-600 mb-4">
              This is the beginning of your personal growth journey. Here you'll track your progress, set goals, and embark on quests to level up your life.
            </p>
            <p className="text-gray-600">
              Your email: {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Placeholder for future dashboard components */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Daily Quests</h3>
              <p className="mt-2 text-sm text-gray-500">Complete daily tasks to earn experience points.</p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Character Stats</h3>
              <p className="mt-2 text-sm text-gray-500">Track your growth in different life attributes.</p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
              <p className="mt-2 text-sm text-gray-500">View your completed challenges and milestones.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 