# Troubleshooting Common Issues

## Directory and Command Issues

### Issue: "Missing script: start"

**Problem**: You're trying to run `npm start` from the wrong directory.

**Solution**:
1. Check your current directory with `pwd`
2. Navigate to the personal-growth-os directory:
   ```powershell
   cd personal-growth-os
   ```
3. Then run the command:
   ```powershell
   npm start
   ```

### Issue: "Cannot find module 'react'"

**Problem**: Dependencies are not installed or you're running the command from the wrong directory.

**Solution**:
1. Make sure you're in the personal-growth-os directory:
   ```powershell
   cd personal-growth-os
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```

### Issue: PowerShell command syntax errors

**Problem**: Using bash-style command chaining with `&&` in PowerShell.

**Solution**:
1. Run commands separately:
   ```powershell
   cd personal-growth-os
   npm start
   ```
2. Or use semicolons to chain commands:
   ```powershell
   cd personal-growth-os; npm start
   ```

## Firebase Issues

### Issue: Firebase connection errors

**Problem**: Firebase is not connecting properly.

**Solution**:
1. Check your `.env.local` file for correct values
2. Make sure the storage bucket is correct (should end with `.appspot.com`)
3. Verify that Firebase services are enabled in the Firebase console
4. Check browser console for specific error messages

### Issue: "FirebaseError: Missing or insufficient permissions"

**Problem**: Firestore security rules are blocking access.

**Solution**:
1. Update your Firestore security rules in the Firebase console to allow read/write during development:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;  // For development only!
       }
     }
   }
   ```
2. For production, implement proper security rules based on authentication

## React and TypeScript Issues

### Issue: TypeScript errors about missing types

**Problem**: Missing type definitions for packages.

**Solution**:
1. Install the corresponding type definitions:
   ```powershell
   npm install --save-dev @types/package-name
   ```
2. For example, for React:
   ```powershell
   npm install --save-dev @types/react @types/react-dom
   ```

### Issue: "Module not found" errors

**Problem**: Import paths are incorrect or the module is not installed.

**Solution**:
1. Check that the import path is correct
2. Make sure the module is installed:
   ```powershell
   npm install module-name
   ```
3. Check for typos in the import statement

## Environment Variable Issues

### Issue: Environment variables not being recognized

**Problem**: Environment variables in `.env.local` are not being loaded.

**Solution**:
1. Make sure the variable names start with `REACT_APP_`
2. Restart the development server after changing environment variables
3. Make sure the `.env.local` file is in the correct location (root of personal-growth-os)
4. Check for typos in variable names

## Git Issues

### Issue: Changes not being tracked by Git

**Problem**: Files are not being tracked by Git.

**Solution**:
1. Make sure you're in the root directory:
   ```powershell
   cd C:\Users\jespe\OneDrive\Documents\Code\RPG
   ```
2. Check the status of your files:
   ```powershell
   git status
   ```
3. Add files to Git:
   ```powershell
   git add .
   ```
4. Commit your changes:
   ```powershell
   git commit -m "Your message"
   ```

## Always Check Your Current Directory

Before running any command, always verify which directory you're in using:
```powershell
pwd
```

This will help prevent many common issues related to running commands from the wrong directory. 