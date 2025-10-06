"use client";

import React from "react";

/**
 * LoadingButton - A reusable button component with loading animation
 * @param {Object} props - Component props
 * @param {string} props.text - Text to display when not loading
 * @param {string} props.loadingText - Text to display when loading
 * @param {boolean} props.isLoading - Loading state
 * @param {function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {React.ReactNode} props.icon - Icon to display (optional)
 * @param {string} props.className - Additional CSS classes (optional)
 * @param {string} props.type - Button type (default: "button")
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 */
const LoadingButton = ({
  text,
  loadingText,
  isLoading,
  onClick,
  disabled,
  icon,
  className = "",
  type = "button",
  variant = "primary",
  ...rest
}) => {
  // Define variant styles
  const variantStyles = {
    primary: "bg-primary text-dark-gray",
    secondary: "bg-secondary text-dark-gray",
    outline: "bg-transparent border border-primary text-dark-gray",
    gray: "bg-gray-200 text-dark-gray",
  };

  const baseClasses = `relative px-4 py-2.5 text-sm rounded-xl uppercase tracking-wider focus:outline-none transition-all duration-300 ease-in-out ${
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
  } ${variantStyles[variant] || variantStyles.primary}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${className}`}
      {...rest}
    >
      <span className={`${isLoading ? "invisible" : "visible"}`}>
        {text}
        {icon && <span className="absolute right-4 top-1/2 transform -translate-y-1/2">{icon}</span>}
      </span>
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center">
            {loadingText}
            <span className="flex ml-2">
              <span className="animate-bounce h-1 w-1 bg-dark-gray rounded-full mr-1 delay-100"></span>
              <span className="animate-bounce h-1 w-1 bg-dark-gray rounded-full mr-1 delay-200"></span>
              <span className="animate-bounce h-1 w-1 bg-dark-gray rounded-full delay-300"></span>
            </span>
          </span>
        </span>
      )}
    </button>
  );
};

export default LoadingButton;