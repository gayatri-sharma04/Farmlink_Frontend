import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FarmerProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is not a farmer, redirect to products (consumer view)
  if (user && user.role !== 'farmer') {
    return <Navigate to="/products" replace />;
  }

  // If user is a farmer, render the protected component
  return children;
};

export default FarmerProtectedRoute;
