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
git clone [your-repository-url]
cd PersonalGrowthOS
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

### 4. Create React App

Create the React application using Create React App:

```bash
npx create-react-app personal-growth-os
cd personal-growth-os
```

### 5. Install Dependencies

Install the required dependencies:

```bash
npm install firebase react-router-dom tailwindcss framer-motion
npm install -D postcss autoprefixer
```

### 6. Set Up Tailwind CSS

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

### 7. Configure Firebase

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
mkdir -p src/firebase
touch src/firebase/config.js
```

Add the following to `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

### 8. Add CSS Reset and Base Styles

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

### 9. Update Project Structure

Create the recommended folder structure:

```bash
mkdir -p src/components/atoms src/components/molecules src/components/organisms
mkdir -p src/context
mkdir -p src/features/authentication src/features/character src/features/quests src/features/skills src/features/monthly-cycle
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/utils
```

### 10. Start the Development Server

```bash
npm start
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

Follow the phased approach from the tech-stack.md file:

1. **Phase 1**: Authentication and user profile
2. **Phase 2**: Character creation flow
3. **Phase 3**: Core dashboard
4. **Phase 4**: Quest system
5. **Phase 5**: Skill tree
6. **Phase 6**: Monthly cycle
7. **Phase 7**: Polish and deployment

For each phase:
- Reference the relevant sections of the instruction files
- Use Cursor AI to help implement the features
- Update project-status.md to track progress

### 4. Using Cursor AI for Implementation

When using Cursor AI to help implement features:

- Be specific about which file you're referencing
- Provide context about where the code fits in the architecture
- Ask for step-by-step explanations if needed

Example prompt:
```
I want to implement the character creation flow described in app-flow.md.
Specifically, I need the "Origin Story Creator" component following the component
structure in frontend-guidelines.md and connecting to Firebase as outlined in
backend-structure.md.
```

### 5. Track Progress

Use the project-status.md file to:
- Document completed features
- Track current progress
- Identify next steps
- Note any challenges or decisions

Update this file regularly as you complete features.

## Testing Your Implementation

Follow these steps to test your application:

1. **Component Testing**
   - Verify components render correctly
   - Check that user interactions work as expected
   - Test responsive behavior

2. **Feature Testing**
   - Test the complete user flows
   - Verify data is saved to Firebase
   - Check that data is retrieved and displayed correctly

3. **Cross-Browser Testing**
   - Test in Chrome, Firefox, and Safari
   - Verify mobile responsiveness

## Deployment

When you're ready to deploy your application:

1. **Build the Production Version**
   ```bash
   npm run build
   ```

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project
   - Set "build" as your public directory
   - Configure as a single-page app
   - Don't overwrite build/index.html

4. **Deploy**
   ```bash
   firebase deploy
   ```

## Need Help?

If you get stuck:

1. Refer back to the instruction files for guidance
2. Use Cursor AI to help debug issues
3. Review the Firebase documentation for specific Firebase features
4. Check the React documentation for component patterns

Remember that the instruction files are designed to work together as a comprehensive guide. If you're having trouble with a specific feature, review the relevant sections across multiple files to get the complete picture.

## Next Steps

After completing the basic implementation, consider:

1. Adding unit tests
2. Implementing additional features from the PRD
3. Enhancing the UI with more animations
4. Adding offline support
5. Implementing analytics to track user engagement

## Conclusion

The Personal Growth OS project is designed to be approachable for beginners while still creating a sophisticated application. By following this guide and referencing the instruction files, you should be able to implement a functional, engaging personal development application.

Remember that the instruction files are not just documentation - they're active development tools to guide you through the implementation process. Refer to them regularly as you build each feature.