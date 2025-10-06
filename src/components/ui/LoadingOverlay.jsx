"use client";

import React from "react";

/**
 * LoadingOverlay - A full-screen loading overlay with animation
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether the overlay is visible
 * @param {string} props.message - Message to display during loading
 * @param {string} props.bgColor - Background color (with opacity)
 */
const LoadingOverlay = ({
  isLoading = false,
  message = "Loading...",
  bgColor = "rgba(255, 255, 255, 0.9)",
}) => {
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col items-center justify-center p-8">
        {/* Spinner animation */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-opacity-25 animate-spin"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text with dots animation */}
        <div className="text-dark-gray text-lg font-medium mt-2">
          {message}
          <span className="inline-block ml-1">
            <span className="animate-bounce inline-block w-1 h-1 bg-dark-gray rounded-full mr-1 delay-100"></span>
            <span className="animate-bounce inline-block w-1 h-1 bg-dark-gray rounded-full mr-1 delay-200"></span>
            <span className="animate-bounce inline-block w-1 h-1 bg-dark-gray rounded-full delay-300"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;