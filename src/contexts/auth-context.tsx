
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  signOut,
  getRedirectResult,
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

    // Check for redirect result on mount
    getRedirectResult(auth).then((result) => {
      if (result) {
        toast({ title: "Successfully logged in!" });
      }
    }).catch((error) => {
      // Handle error silently
    });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Successfully logged in with Google." });
    } catch (error: any) {
      // Handle specific Firebase auth errors
      if (error.code === 'auth/operation-not-allowed') {
        toast({ 
          title: "Google sign-in not configured", 
          description: "Please contact support to enable Google authentication.",
          variant: "destructive" 
        });
      } else if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        // Fallback to redirect method
        toast({ 
          title: "Popup blocked", 
          description: "Redirecting to Google sign-in...",
        });
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          toast({ 
            title: "Sign-in failed", 
            description: "Please try again or contact support.",
            variant: "destructive" 
          });
        }
      } else {
        toast({ 
          title: "Failed to log in with Google", 
          description: error.message || "Please try again later.",
          variant: "destructive" 
        });
      }
    }
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Successfully logged in with GitHub." });
    } catch (error: any) {
      // Handle specific Firebase auth errors
      if (error.code === 'auth/operation-not-allowed') {
        toast({ 
          title: "GitHub sign-in not configured", 
          description: "Please contact support to enable GitHub authentication.",
          variant: "destructive" 
        });
      } else if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        // Fallback to redirect method
        toast({ 
          title: "Popup blocked", 
          description: "Redirecting to GitHub sign-in...",
        });
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          toast({ 
            title: "Sign-in failed", 
            description: "Please try again or contact support.",
            variant: "destructive" 
          });
        }
      } else {
        toast({ 
          title: "Failed to log in with GitHub", 
          description: error.message || "Please try again later.",
          variant: "destructive" 
        });
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Successfully logged out." });
    } catch (error) {
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
