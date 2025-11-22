"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Create Admin Auth Context
const AdminAuthContext = createContext();

// Admin Auth Provider Component
export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        // Check if admin user is logged in
        const response = await fetch("/api/admin/auth/check");

        if (response.ok) {
          const data = await response.json();
          setUser({
            email: data.email || "admin@starlette.com",
            name: data.name || "Admin User",
            role: "admin",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load admin session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromSession();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      setUser({
        email: data.user.email,
        name: data.user.name,
        role: "admin",
      });

      return { success: true };
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      // Remove token from localStorage
      localStorage.removeItem("adminToken");

      setUser(null);
      router.push("/admin/login");
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("adminToken");
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    getAuthToken,
    isAuthenticated: !!user,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Custom hook to use the admin auth context
export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    console.error(
      "AdminAuthContext not found! Check the component hierarchy to ensure the AdminAuthProvider is present."
    );
    throw new Error(
      "useAdminAuthContext must be used within an AdminAuthProvider. Make sure your component is wrapped with AdminAuthProvider."
    );
  }
  return context;
};
