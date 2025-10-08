"use client";

import { useState, createContext } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

// Create a context for global loading state
export const AuthLoadingContext = createContext({
  isGlobalLoading: false,
  setGlobalLoading: () => {},
});

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);

      // Store token in localStorage for persistent auth
      localStorage.setItem("authToken", response.token);

      // Redirect to schedule after successful login
      window.location.href = "./schedule";
      return response;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler for single step or step completion
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      setUser(response.user);

      // Store token in localStorage for persistent auth
      localStorage.setItem("authToken", response.token);

      // Redirect to schedule after successful registration
      window.location.href = "./schedule";
      return response;
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "./login";
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      return false;
    }

    try {
      setIsLoading(true);
      const userData = await authService.getProfile();
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (err) {
      localStorage.removeItem("authToken");
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  return {
    user,
    isLoading,
    error,
    getAuthToken,
    login,
    register,
    logout,
    checkAuth,
    setError,
  };
}
