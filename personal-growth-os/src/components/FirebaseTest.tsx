import React, { useEffect, useState } from 'react';
import { db, analytics } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { isSupported } from 'firebase/analytics';

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Checking Firebase connection...');
  const [error, setError] = useState<string | null>(null);
  const [analyticsSupported, setAnalyticsSupported] = useState<boolean | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firestore connection
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        
        // Check if Analytics is supported
        const analyticsIsSupported = await isSupported();
        setAnalyticsSupported(analyticsIsSupported);
        
        // Check if Analytics is enabled
        setAnalyticsEnabled(analytics !== null);
        
        // If we get here, Firebase is connected
        setStatus('Firebase is properly configured and connected! 🎉');
      } catch (err) {
        console.error('Firebase connection error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Firebase connection failed. Check console for details.');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Test</h2>
      
      <div className={`p-3 rounded ${error ? 'bg-red-100' : 'bg-green-100'}`}>
        <p className="font-medium">{status}</p>
        
        {analyticsSupported !== null && (
          <p className="mt-2">
            <span className="font-medium">Analytics Support:</span> {analyticsSupported ? 'Supported ✅' : 'Not supported ❌'}
          </p>
        )}
        
        {analyticsEnabled !== null && (
          <p className="mt-2">
            <span className="font-medium">Analytics Enabled:</span> {analyticsEnabled ? 'Yes ✅' : 'No (disabled in development) ℹ️'}
          </p>
        )}
        
        {error && (
          <div className="mt-2 text-red-700">
            <p className="font-bold">Error:</p>
            <p className="text-sm">{error}</p>
            <div className="mt-4 p-3 bg-yellow-100 rounded text-sm">
              <p className="font-bold">Troubleshooting:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>Check that you've created a Firebase project in the Firebase Console</li>
                <li>Verify that you've added your Firebase config values to the .env.local file</li>
                <li>Make sure you've enabled Firestore in your Firebase project</li>
                <li>Restart your development server after updating environment variables</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest; 