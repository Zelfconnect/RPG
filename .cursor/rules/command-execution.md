# Command Execution Rules

## Directory Navigation

When executing commands, always ensure you're in the correct directory first:

1. **React Application Commands**: All React-related commands (npm start, npm build, etc.) must be run from the `personal-growth-os` directory.
   - ✅ CORRECT: First navigate with `cd personal-growth-os`, then run the command
   - ❌ INCORRECT: Running React commands from the root `RPG` directory

2. **File Structure Understanding**:
   - Root project directory: `C:\Users\jespe\OneDrive\Documents\Code\RPG`
   - React application directory: `C:\Users\jespe\OneDrive\Documents\Code\RPG\personal-growth-os`
   - Source code: `C:\Users\jespe\OneDrive\Documents\Code\RPG\personal-growth-os\src`

## Command Syntax

1. **Avoid Command Chaining with `&&`**:
   - ✅ CORRECT: Run commands separately, one after another
     ```
     cd personal-growth-os
     npm start
     ```
   - ❌ INCORRECT: Using `&&` to chain commands
     ```
     cd personal-growth-os && npm start
     ```

2. **Package Installation**:
   - ✅ CORRECT: Navigate first, then install
     ```
     cd personal-growth-os
     npm install package-name
     ```
   - ❌ INCORRECT: 
     ```
     cd personal-growth-os && npm install package-name
     ```

## Common Commands Reference

1. **Starting the application**:
   ```
   cd personal-growth-os
   npm start
   ```

2. **Installing packages**:
   ```
   cd personal-growth-os
   npm install package-name
   ```

3. **Building the application**:
   ```
   cd personal-growth-os
   npm run build
   ```

4. **Running tests**:
   ```
   cd personal-growth-os
   npm test
   ```

## Troubleshooting

If you encounter "Missing script" errors, it's almost always because you're in the wrong directory. Always check your current directory with: 