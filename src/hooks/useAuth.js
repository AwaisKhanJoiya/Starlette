"use client";

import { useState, createContext } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import axios from "axios";
import { toast } from "react-toastify";

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

  // Update user profile
  const updateUser = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser({ ...user, user: updatedUser });
      return updatedUser;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);

      // Store token in localStorage for persistent auth
      localStorage.setItem("authToken", response.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.token}`;
      // Redirect to schedule after successful login";
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
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.token}`;

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
    axios.defaults.headers.common["Authorization"] = null;
    window.location.href = "./login";
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    axios.defaults.baseURL = "/api";

    axios.interceptors.response.use(
      (response) => {
        if (response.data.message) {
          toast.success(response.data.message);
        }
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access, e.g., redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Show toast notification for the error message
          toast.error(error.response.data.message);
        }
        return Promise.reject(error);
      }
    );
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      return false;
    }

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
    updateUser,
  };
}
