"use client";

import React, { useState, useContext } from 'react';
import { AuthLoadingContext } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

/**
 * Provider component for global authentication loading state
 * This wraps the application to provide global loading state during auth operations
 */
export function AuthLoadingProvider({ children }) {
  const [isGlobalLoading, setGlobalLoading] = useState(false);
  
  return (
    <AuthLoadingContext.Provider value={{ isGlobalLoading, setGlobalLoading }}>
      {/* Global loading overlay for authentication operations */}
      <LoadingOverlay 
        isLoading={isGlobalLoading} 
        message="Processing your request..." 
      />
      {children}
    </AuthLoadingContext.Provider>
  );
}

/**
 * Hook for accessing global auth loading context
 */
export function useAuthLoading() {
  return useContext(AuthLoadingContext);
}