"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, User, LogIn } from "lucide-react";

export function AuthDebug() {
  const { user, loading, signInWithGoogle, signInWithGitHub, logout } = useAuth();

  if (loading) {
    return (
      <Alert className="mb-4 border-blue-500 text-blue-700 rounded-none">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Loading Authentication</AlertTitle>
        <AlertDescription>
          Checking authentication state...
        </AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert className="mb-4 border-yellow-500 text-yellow-700 rounded-none">
        <LogIn className="h-4 w-4" />
        <AlertTitle>Not Authenticated</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>You need to log in to access community features.</p>
          <div className="flex gap-2">
            <Button onClick={signInWithGoogle} size="sm" variant="outline">
              Sign in with Google
            </Button>
            <Button onClick={signInWithGitHub} size="sm" variant="outline">
              Sign in with GitHub
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-500 text-green-700 rounded-none">
      <User className="h-4 w-4" />
      <AlertTitle>Authenticated</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>Welcome, {user.displayName || user.email}!</p>
        <div className="text-xs space-y-1">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
          <p><strong>Provider:</strong> {user.providerData[0]?.providerId}</p>
        </div>
        <Button onClick={logout} size="sm" variant="outline">
          Sign Out
        </Button>
      </AlertDescription>
    </Alert>
  );
}
