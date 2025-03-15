import React from 'react';
import Navigation from '../organisms/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      <Navigation />
      
      <main className={`w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow ${className}`}>
        <div className="w-full max-w-full overflow-hidden">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Personal Growth OS - Level up your life
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 