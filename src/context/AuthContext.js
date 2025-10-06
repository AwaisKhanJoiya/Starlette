"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";

// Create Authentication Context
const AuthContext = createContext(null);

// Context Provider Component
export function AuthProvider({ children }) {
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

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
