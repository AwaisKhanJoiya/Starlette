"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUserAuthContext } from "@/context/UserAuthContext";

const ProtectedPage = ({ children }) => {
  const { user, isLoading } = useUserAuthContext();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated
  return user ? children : null;
};

export default ProtectedPage;
