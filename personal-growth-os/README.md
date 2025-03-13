# Personal Growth OS

A narrative-driven personal development tracking system that gamifies personal growth through RPG elements.

## Overview

Personal Growth OS is a web application that helps users track their personal development journey through a gamified experience. Users can set goals, complete daily quests, track their progress, and earn achievements as they level up their life.

## Features

- User authentication with Firebase
- Dashboard to track personal growth
- Daily quests system
- Character stats tracking
- Achievements system
- Narrative-driven experience

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
