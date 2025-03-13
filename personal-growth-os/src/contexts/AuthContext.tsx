import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { auth, createUserDocument } from '../services/firebase';

type UserProfile = {
  displayName?: string;
  level?: number;
  experience?: number;
  createdAt?: Date;
};

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  register: (email: string, password: string, profile?: UserProfile) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(email: string, password: string, profile?: UserProfile) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    const userProfile = {
      displayName: profile?.displayName || email.split('@')[0],
      level: profile?.level || 1,
      experience: profile?.experience || 0,
      ...profile
    };
    
    await createUserDocument(credential.user, userProfile);
    
    // Update displayName in Firebase Auth
    if (userProfile.displayName) {
      await updateProfile(credential.user, {
        displayName: userProfile.displayName
      });
    }
    
    return credential;
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }
  
  async function updateUserProfile(profile: UserProfile) {
    if (!currentUser) throw new Error("No user is logged in");
    
    // Update displayName in Firebase Auth if provided
    if (profile.displayName) {
      await updateProfile(currentUser, {
        displayName: profile.displayName
      });
    }
    
    // Update user document in Firestore
    await createUserDocument(currentUser, profile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 