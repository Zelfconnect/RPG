# Getting Started with Personal Growth OS

This guide will help you set up and begin developing the Personal Growth OS application. It explains how to use the instruction files we've created and establish your development environment.

## Understanding the Instruction Files

Our project contains several key instruction files that work together to guide development:

### The Documentation Sequence

The files should be read and followed in this specific order:

1. **Instructions/README.md** - Overview of all documentation files
2. **Instructions/prd.md** - Product Requirements Document defining core features
3. **Instructions/app-flow.md** - User journey and screen designs
4. **Instructions/tech-stack.md** - Technology choices and architecture
5. **Instructions/frontend-guidelines.md** - UI components and coding standards
6. **Instructions/backend-structure.md** - Firebase implementation details
7. **Instructions/project-status.md** - Progress tracking

Each file builds upon knowledge from previous files. For example, the app-flow.md references features defined in the PRD, while the frontend guidelines assume understanding of the tech stack.

### How These Files Work with Cursor AI

Cursor AI can process these files to understand the project context and generate appropriate code. To use Cursor AI effectively:

1. Open your project in Cursor AI
2. Reference specific files when asking for implementation help:
   ```
   Please implement the QuestCard component based on the design in app-flow.md 
   and following the guidelines in frontend-guidelines.md
   ```
3. For complex features, reference multiple files:
   ```
   I'd like to implement the character leveling system described in the PRD
   using the backend structure from backend-structure.md and the UI patterns
   from frontend-guidelines.md
   ```

## Project Setup

Follow these steps to set up your development environment:

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended for beginners)

### 2. Clone the Repository

If you've already created the repository structure from our instructions:

```bash
git clone https://github.com/Zelfconnect/RPG.git
cd RPG
```

### 3. Set Up Firebase

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (recommended)

2. **Configure Authentication**
   - In Firebase Console, go to Authentication
   - Click "Get started"
   - Enable Email/Password provider

3. **Set Up Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode for development

4. **Get Your Firebase Configuration**
   - Go to Project Settings
   - Scroll down to "Your apps" section
   - Click the Web icon (</>)
   - Register your app with a nickname (e.g., "personal-growth-os")
   - Copy the firebaseConfig object for the next step

### 4. Create React App with TypeScript

Create the React application using Create React App with TypeScript:

```bash
npx create-react-app personal-growth-os --template typescript
cd personal-growth-os
```

### 5. Install Dependencies

Install the required dependencies:

```bash
npm install firebase react-router-dom tailwindcss framer-motion @craco/craco
npm install -D postcss autoprefixer
npm install workbox-webpack-plugin workbox-core workbox-routing workbox-strategies workbox-precaching
```

### 6. Set Up CRACO

Create a `craco.config.js` file in the project root:

```javascript
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
};
```

Update the scripts in `package.json`:

```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test",
  "eject": "react-scripts eject"
}
```

### 7. Set Up Tailwind CSS

Initialize Tailwind:

```bash
npx tailwindcss init -p
```

Update the `tailwind.config.js` file with the content path:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5E35B1', // Deep purple
          light: '#7E57C2',
          dark: '#4527A0'
        },
        secondary: {
          DEFAULT: '#2E7D32', // Emerald green
          light: '#43A047',
          dark: '#1B5E20'
        },
        accent: {
          DEFAULT: '#FFB300', // Gold
          light: '#FFCA28',
          dark: '#FF8F00'
        }
      }
    }
  },
  plugins: [],
}
```

### 8. Configure Firebase

Create a `.env.local` file in the project root:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Replace the placeholders with your Firebase config values.

Then, create a Firebase configuration file:

```bash
mkdir -p src/services
touch src/services/firebase.ts
```

Add the following to `src/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Collection references
export const usersCollection = collection(db, 'users');
export const questsCollection = collection(db, 'quests');
export const achievementsCollection = collection(db, 'achievements');

// Helper functions
export const createUserDocument = async (user: User, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(usersCollection, user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email } = user;
    const createdAt = Timestamp.now();

    try {
      await setDoc(userRef, {
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return userRef;
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export default app;
```

### 9. Add CSS Reset and Base Styles

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-100 text-gray-900;
}

/* Additional global styles */
```

### 10. Create Project Structure

Create the recommended folder structure:

```bash
mkdir -p src/components
mkdir -p src/contexts
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/assets
```

### 11. Implement Authentication Context

Create a file for the authentication context:

```bash
touch src/contexts/AuthContext.tsx
```

Add the authentication context implementation (refer to the current implementation in the codebase).

### 12. Create Basic Pages

Create files for the basic pages:

```bash
mkdir -p src/pages
touch src/pages/Login.tsx
touch src/pages/Register.tsx
touch src/pages/Dashboard.tsx
```

Implement these pages according to the designs in app-flow.md.

### 13. Set Up Protected Routes

Create a file for the protected route component:

```bash
touch src/components/PrivateRoute.tsx
```

Implement the protected route component to secure authenticated routes.

### 14. Update App.tsx

Update the App.tsx file to include routing and the authentication provider.

### 15. Start the Development Server

```bash
npm start
```

### 12. PWA Configuration

#### Set up the Web App Manifest

Create a new file or update the existing `public/manifest.json`:

```json
{
  "short_name": "Growth OS",
  "name": "Personal Growth OS",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "any maskable"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#5E35B1",
  "background_color": "#ffffff",
  "orientation": "portrait"
}
```

#### Configure Service Worker

Create a custom service worker in `src/service-worker.ts`:

```typescript
/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process
precacheAndRoute(self.__WB_MANIFEST);

// Cache the Firebase authentication and Firestore data
registerRoute(
  ({ url }) => url.origin === 'https://firebasestorage.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'firebase-storage-cache',
  })
);

// Cache Google Fonts stylesheets
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache Google Fonts webfont files
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// Handle offline fallbacks
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      // Try to fetch the latest version
      return await fetch(event.request as Request);
    } catch (error) {
      // If offline, show offline page
      return caches.match('/offline.html');
    }
  }
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

Create a simple offline page at `public/offline.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - Personal Growth OS</title>
  <style>
    body {
      font-family: 'Lato', sans-serif;
      background-color: #f9fafb;
      color: #111827;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #5E35B1;
      font-family: 'Cinzel', serif;
      margin-bottom: 1rem;
    }
    p {
      max-width: 500px;
      line-height: 1.6;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <h1>You're Currently Offline</h1>
  <div class="card">
    <p>Personal Growth OS needs an internet connection to sync your progress.</p>
    <p>Please check your connection and try again.</p>
    <p>Don't worry - any changes you've made while online are safely stored.</p>
  </div>
</body>
</html>
```

Update `src/index.tsx` to register the service worker:

```typescript
// Add this to the imports
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Add this after the ReactDOM.render call
serviceWorkerRegistration.register();
```

Create `src/serviceWorkerRegistration.ts`:

```typescript
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('This web app is being served cache-first by a service worker.');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content is available and will be used when all tabs for this page are closed.');
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
```

## Important Note on Command Execution

When working with this project, it's crucial to run commands in the correct directory:

- All npm commands should be run from the `personal-growth-os` directory
- Git commands should be run from the root `RPG` directory

**Correct examples:**
```bash
# For npm commands
cd personal-growth-os
npm start

# For git commands
cd ..  # if you're in personal-growth-os
git add .
git commit -m "Your message"
```

**Incorrect examples:**
```bash
# Running npm commands from the wrong directory
cd RPG  # root directory
npm start  # This will fail
```

## Development Workflow

Now that you have the environment set up, here's how to approach development:

### 1. Review the Documentation

Start by thoroughly reading the instruction files in the recommended order. Each file provides important context for implementation:

- **prd.md** defines what features to build
- **app-flow.md** describes how they should look and function
- **tech-stack.md** explains the architecture
- **frontend-guidelines.md** and **backend-structure.md** provide implementation details

### 2. Implement Core Services First

Following the backend-structure.md guidance, implement basic Firebase services:

1. Authentication service
2. Basic Firestore utilities
3. Character data model
4. Quest management

### 3. Build Features in Phases

Follow the phased approach from the project-status.md file:

1. **Phase 1: Project Setup & Authentication** (Completed)
2. **Phase 2: Streamlined Character Creation System** (Next Phase)
   - Implement Future Self Snapshot for quick onboarding
   - Set up character development quest framework
   - Create progressive character deepening flow
3. **Phase 3: Core Dashboard**
4. **Phase 4: Quest System**
5. **Phase 5: Skill Tree & Stats**
6. **Phase 6: Monthly Cycle**
7. **Phase 7: Polish & Deployment**
   - This includes responsive PWA implementation for all device types

### 4. Streamlined Character Creation Implementation

The character creation system follows a tiered approach with dual assessment:

1. **Essential Tier - Current State Assessment**:
   - Initial 5-7 minute assessment
   - Current situation description
   - Key strengths identification
   - Current challenges assessment
   - Self-rating on attributes (0-10 scale)
   - Activity frequency measurement

2. **Essential Tier - Future Self Snapshot**:
   - Quick 5-7 minute future vision
   - Focus on desired future state
   - Key habit identification
   - One major goal
   - Attribute calculation based on both current and future state

3. **Progressive Tier (Character Development Quests)**:
   - Origin story quest
   - Deeper character development
   - Unlocked gradually during normal gameplay

4. **Ongoing Tier (Monthly Review Deepening)**:
   - Monthly reflection questions
   - Character evolution visualization
   - Progressive narrative building

This dual assessment approach ensures users establish an accurate starting point while maintaining a clear growth direction.

### 5. Testing Your Implementation

- Test authentication flow
- Verify Firebase connectivity
- Check that data is properly stored in Firestore
- Ensure protected routes work as expected

## Current Project Status

As of March 2025, we have completed Phase 1 (Project Setup & Authentication):
- ✅ React application with TypeScript
- ✅ Tailwind CSS configuration
- ✅ Firebase setup with Authentication, Firestore, and Analytics
- ✅ Basic authentication flow (register, login, logout)
- ✅ Protected routes
- ✅ Basic dashboard

The next phase will focus on implementing the Streamlined Character Creation System.

## Troubleshooting

### Firebase Connection Issues

If you encounter issues with Firebase connectivity:
1. Verify that your `.env.local` file contains the correct Firebase configuration values
2. Check that you've enabled the necessary Firebase services (Authentication, Firestore)
3. Make sure you've installed the Firebase package (`npm install firebase`)
4. Check the browser console for specific error messages

### Command Execution Problems

If you encounter issues with npm commands:
1. Make sure you're in the correct directory (`personal-growth-os`)
2. Check that you have Node.js and npm installed
3. Verify that all dependencies are installed (`npm install`)

## Next Steps

1. Implement the Streamlined Character Creation flow
2. Set up responsive PWA configuration
3. Create the Quest system
4. Develop the Skill Tree visualization
5. Implement the Monthly Cycle features

For detailed information on these features, refer to the PRD and app-flow documents.