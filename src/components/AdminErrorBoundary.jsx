"use client";

import React from "react";

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("AdminErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });

    // You could also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      const isAuthError =
        this.state.error?.message?.includes("AdminAuthProvider");

      // Show a more specific error for auth provider issues
      if (isAuthError) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-background rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Authentication Error
              </h1>
              <p className="text-gray-700 mb-4">
                There was a problem with the admin authentication system. This
                usually means the admin authentication provider is not properly
                set up.
              </p>
              <div className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-48 mb-4">
                <pre className="whitespace-pre-wrap">
                  {this.state.error?.message}
                </pre>
              </div>
              <button
                onClick={() => (window.location.href = "/admin/login")}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Go to Admin Login
              </button>
            </div>
          </div>
        );
      }

      // Generic error UI for non-auth errors
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="max-w-md w-full bg-background rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-4">
              We've encountered an error in the admin section. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
