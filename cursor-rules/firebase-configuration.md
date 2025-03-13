# Firebase Configuration Rules

## Firebase Configuration Files

Our project uses Firebase for authentication, database, storage, and analytics. The configuration is stored in two key files:

1. **`.env.local`** - Contains environment variables with Firebase configuration values
2. **`personal-growth-os/src/services/firebase.ts`** - Initializes Firebase services

## Correct Firebase Configuration

### 1. Environment Variables in `.env.local`

The `.env.local` file should contain the following environment variables with your actual Firebase values:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

⚠️ **IMPORTANT**: The `STORAGE_BUCKET` value should end with `.appspot.com`, NOT `.firebasestorage.app`

### 2. Firebase Initialization in `firebase.ts`

The `firebase.ts` file should initialize Firebase using the environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
```

## Testing Firebase Connection

To test if Firebase is properly connected:

1. Navigate to the `personal-growth-os` directory:
   ```powershell
   cd personal-growth-os
   ```

2. Start the development server:
   ```powershell
   npm start
   ```

3. Visit one of these test routes in your browser:
   - http://localhost:3000/firebase-test - Tests connection using environment variables
   - http://localhost:3000/firebase-direct-test - Tests connection using hardcoded values

## Troubleshooting Firebase Connection Issues

If you encounter Firebase connection issues:

1. **Check Environment Variables**:
   - Verify that all values in `.env.local` match your Firebase console
   - Make sure the `STORAGE_BUCKET` ends with `.appspot.com`
   - Ensure there are no typos or extra spaces

2. **Restart Development Server**:
   - After changing environment variables, you must restart the server:
   ```powershell
   # Press Ctrl+C to stop the server if it's running
   # Then start it again
   npm start
   ```

3. **Check Firebase Console**:
   - Verify that you've enabled the necessary Firebase services:
     - Authentication
     - Firestore Database
     - Storage (if needed)
     - Analytics (if needed)

4. **Check Browser Console**:
   - Open browser developer tools (F12)
   - Look for specific error messages in the Console tab

5. **Verify Firestore Rules**:
   - Make sure your Firestore security rules allow read/write during development

## Common Firebase Errors

1. **"Firebase: Error (auth/...)"**:
   - Authentication-related errors, check your Authentication settings in Firebase console

2. **"Missing or insufficient permissions"**:
   - Firestore security rules are blocking access, update your rules in Firebase console

3. **"FirebaseError: Failed to get document because the client is offline"**:
   - Network connectivity issue or incorrect Firebase configuration

4. **"FirebaseError: [code=not-found]: ..."**:
   - The requested document or collection doesn't exist in Firestore 