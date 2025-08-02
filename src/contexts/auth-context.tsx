
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Successfully logged in with Google." });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({ title: "Failed to log in with Google.", variant: "destructive" });
    }
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
       toast({ title: "Successfully logged in with GitHub." });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      toast({ title: "Failed to log in with GitHub.", variant: "destructive" });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Successfully logged out." });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Failed to log out.", variant: "destructive" });
    }
  };

  const value = { user, loading, signInWithGoogle, signInWithGitHub, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
