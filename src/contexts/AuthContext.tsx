import axios from 'axios';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

axios.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error('Error getting fresh token:', err);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'theadmindinasour@gmail.com').split(',').map((e: string) => e.trim()).filter(Boolean);
        setIsAdmin(adminEmails.includes(user.email || ''));
        const idToken = await user.getIdToken();
        setToken(idToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        // Sync user to backend
        try {
          const res = await axios.post('/api/users/sync');
          setDbUser(res.data.user);
          setIsAdmin(res.data.user?.role === 'admin' || adminEmails.includes(user.email || ''));
          if (res.data.user?.area) {
            localStorage.setItem('userArea', res.data.user.area);
          } else {
            const localArea = localStorage.getItem('userArea');
            if (localArea) {
              try {
                const updateRes = await axios.put('/api/users/area', { area: localArea });
                setDbUser(updateRes.data.user);
              } catch (e) {
                console.error('Failed to restore area to backend', e);
              }
            }
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setToken(null);
        setDbUser(null);
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(user, { displayName: name });
    } catch (error: any) {
      console.error('Email signup failed', error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password authentication is disabled in your Firebase project.');
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const autoCreateAdminEmails = ['theadmindinasour@gmail.com'];
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (autoCreateAdminEmails.includes(email) && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
        try {
          const { user: newUser } = await createUserWithEmailAndPassword(auth, email, pass);
          await updateProfile(newUser, { displayName: email.split('@')[0] });
          return;
        } catch (createError) {
          console.error('Failed to auto-create admin account', createError);
          throw createError;
        }
      }
      console.error('Email login failed', error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password login is disabled in your Firebase project. Please enable it in the Firebase Console under Authentication -> Sign-in method.');
      }
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('userArea');
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, login, loginWithEmail, signupWithEmail, logout, token, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
