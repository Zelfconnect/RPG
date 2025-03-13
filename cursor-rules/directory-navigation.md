# Directory Navigation and Command Execution Rules

## Critical Directory Structure

Our project has the following directory structure:
```
RPG/                           # Root project directory
├── personal-growth-os/        # React application directory
│   ├── src/                   # Source code
│   ├── public/                # Public assets
│   ├── package.json           # NPM package configuration
│   └── ...                    # Other React app files
├── cursor-rules/              # Cursor rules directory
└── ...                        # Other project files
```

## IMPORTANT: Command Execution Rules

### 1. React Application Commands (npm)

**ALL npm commands MUST be run from the `personal-growth-os` directory.**

✅ **CORRECT** way to run npm commands:
```powershell
# First, make sure you're in the personal-growth-os directory
cd C:\Users\jespe\OneDrive\Documents\Code\RPG\personal-growth-os
# OR if you're already in the RPG directory
cd personal-growth-os

# Then run npm commands
npm start
npm install some-package
npm run build
```

❌ **INCORRECT** way to run npm commands:
```powershell
# Running npm commands from the RPG directory will FAIL
cd C:\Users\jespe\OneDrive\Documents\Code\RPG
npm start  # This will fail with "Missing script: start"
```

### 2. Git Commands

Git commands should typically be run from the root `RPG` directory.

✅ **CORRECT** way to run git commands:
```powershell
# Make sure you're in the RPG directory
cd C:\Users\jespe\OneDrive\Documents\Code\RPG

# Then run git commands
git status
git add .
git commit -m "Your message"
```

### 3. PowerShell Command Syntax

PowerShell does not use `&&` to chain commands like bash does.

✅ **CORRECT** way to run multiple commands in PowerShell:
```powershell
# Run commands separately
cd personal-growth-os
npm start

# OR use semicolons
cd personal-growth-os; npm start
```

❌ **INCORRECT** way to chain commands in PowerShell:
```powershell
cd personal-growth-os && npm start  # This will fail
```

## Checking Your Current Directory

If you're unsure which directory you're in, use:
```powershell
pwd  # Print Working Directory
```

## Common Error: "Missing script: start"

If you see this error:
```
npm error Missing script: "start"
```

It means you're trying to run npm commands from the wrong directory. You need to:
1. Navigate to the personal-growth-os directory: `cd personal-growth-os`
2. Then run your npm command: `npm start`

## Always Verify Directory Before Running Commands

Before running any command, always check which directory you're in using `pwd` and make sure you're in the correct directory for the command you want to run. 