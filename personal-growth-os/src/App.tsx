import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CharacterCreation from './pages/CharacterCreation';
import FirebaseTest from './components/FirebaseTest';
import FirebaseDirectTest from './components/FirebaseDirectTest';
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
          </Route>
          
          {/* Redirect to dashboard by default */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
