import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or show loading spinner
  }

  // If user is logged in, redirect based on role
  if (user) {
    if (user.role === 'farmer') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/products" replace />;
    }
  }

  // If not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default DefaultRedirect;
