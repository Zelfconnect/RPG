import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const FirebaseDirectTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing direct Firebase connection...');
  const [error, setError] = useState<string | null>(null);
  const [analyticsSupported, setAnalyticsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Use the direct configuration from Firebase console
        const firebaseConfig = {
          apiKey: "AIzaSyAppBVYFcpv0-6aUw9ZkwRxsM9G11rhV5w",
          authDomain: "personal-growth-os.firebaseapp.com",
          projectId: "personal-growth-os",
          storageBucket: "personal-growth-os.appspot.com",
          messagingSenderId: "226196370987",
          appId: "1:226196370987:web:d4ca6adb6488506d7e9c6e",
          measurementId: "G-YMRH46ZHCB"
        };

        // Initialize Firebase directly
        const app = initializeApp(firebaseConfig, 'direct-test');
        const db = getFirestore(app);
        
        // Test Firestore connection
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        
        // Check if Analytics is supported
        const analyticsIsSupported = await isSupported();
        setAnalyticsSupported(analyticsIsSupported);
        
        // Don't initialize Analytics in development to avoid API key errors
        if (process.env.NODE_ENV === 'production' && analyticsIsSupported) {
          getAnalytics(app);
        }
        
        // If we get here, Firebase is connected
        setStatus('Direct Firebase connection successful! 🎉');
      } catch (err) {
        console.error('Direct Firebase connection error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Direct Firebase connection failed. Check console for details.');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Direct Firebase Connection Test</h2>
      
      <div className={`p-3 rounded ${error ? 'bg-red-100' : 'bg-green-100'}`}>
        <p className="font-medium">{status}</p>
        
        {analyticsSupported !== null && (
          <p className="mt-2">
            <span className="font-medium">Analytics Support:</span> {analyticsSupported ? 'Supported ✅' : 'Not supported ❌'}
          </p>
        )}
        
        <p className="mt-2 text-amber-700">
          <span className="font-medium">Note:</span> Analytics is disabled in development mode to prevent API key errors.
        </p>
        
        {error && (
          <div className="mt-2 text-red-700">
            <p className="font-bold">Error:</p>
            <p className="text-sm">{error}</p>
            <div className="mt-4 p-3 bg-yellow-100 rounded text-sm">
              <p className="font-bold">Troubleshooting:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>Check that your Firebase project is properly set up</li>
                <li>Verify that Firestore is enabled in your Firebase project</li>
                <li>Check your internet connection</li>
                <li>Make sure you're not being blocked by a firewall or proxy</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseDirectTest; 