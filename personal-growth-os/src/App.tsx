import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CharacterCreation from './pages/CharacterCreation';
import ModernCharacterCreation from './pages/ModernCharacterCreation';
import FirebaseTest from './components/FirebaseTest';
import FirebaseDirectTest from './components/FirebaseDirectTest';
import QuestJournal from './components/quests/QuestJournal';
import QuestForm from './components/quests/QuestForm';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/firebase-test" element={<FirebaseTest />} />
          <Route path="/firebase-direct-test" element={<FirebaseDirectTest />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/character-creation" element={<CharacterCreation />} />
            <Route path="/modern-character-creation" element={<ModernCharacterCreation />} />
            <Route path="/character" element={<Navigate to="/modern-character-creation" />} />
            <Route path="/quests" element={<QuestJournal />} />
            <Route path="/create-quest" element={<QuestForm />} />
            <Route path="/edit-quest/:questId" element={<QuestForm />} />
            <Route path="/skills" element={<Dashboard />} /> {/* Placeholder until Skills page is built */}
          </Route>
          
          {/* Redirect to dashboard by default */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
