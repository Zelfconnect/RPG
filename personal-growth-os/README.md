# Personal Growth OS

A narrative-driven personal development tracking system that gamifies personal growth through RPG elements.

## Overview

Personal Growth OS is a web application that helps users track their personal development journey through a gamified experience. Users can set goals, complete daily quests, track their progress, and earn achievements as they level up their life.

## Features

- Narrative-driven character creation and development
- Monthly quest system for goal setting and tracking
- RPG-inspired skill trees and attribute progression
- Time-efficient monthly review and planning cycles
- Dual assessment approach (current state + future vision)
- Character attribute system with weighted scoring
- Detailed self-rating system with descriptive feedback
- Activity frequency tracking with impact explanations

## Current Status

The project is currently in active development with the following components implemented:
- User authentication with Firebase
- Character creation flow with enhanced current state assessment and future vision
- Character attribute calculation system with weighted scoring
- Basic dashboard with character stats display
- Detailed self-rating interface with visual indicators

Recent improvements include:
- Enhanced UI layout and styling for character creation components
- Implemented defensive programming to prevent runtime errors
- Improved type safety for character data handling
- Upgraded Current State Assessment with better UI and meaningful feedback
- Added activity frequency impact explanations showing how habits affect attributes

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Firebase for authentication and database
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
   ```
4. Start the development server:
   ```
   npm start
   ```

## Project Structure

- `src/components`: Reusable UI components
- `src/contexts`: Context providers for state management
- `src/pages`: Page components
- `src/services`: Service integrations (Firebase, etc.)
- `src/hooks`: Custom React hooks
- `src/utils`: Utility functions
- `src/types`: TypeScript type definitions
- `src/assets`: Static assets

## License

This project is licensed under the MIT License.
