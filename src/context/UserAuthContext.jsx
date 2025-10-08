"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";

// Create User Authentication Context
const UserAuthContext = createContext(null);

// User Context Provider Component
export function UserAuthProvider({ children }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await auth.checkAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Don't render children until we've checked auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <UserAuthContext.Provider value={auth}>{children}</UserAuthContext.Provider>
  );
}

// Custom hook to use the user auth context
export function useUserAuthContext() {
  const context = useContext(UserAuthContext);
  if (context === null) {
    throw new Error(
      "useUserAuthContext must be used within a UserAuthProvider"
    );
  }
  return context;
}
