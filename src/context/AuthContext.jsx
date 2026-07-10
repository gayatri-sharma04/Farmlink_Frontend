import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check localStorage on app load to restore session
  useEffect(() => {
    const storedToken = localStorage.getItem('farmlink_token');
    const storedUser = localStorage.getItem('farmlink_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    
    setLoading(false);
  }, []);


  const login = async (email, password) => {
  try {
    setLoading(true);
    const response = await axios.post('http://localhost:8000/auth/login', {
      email,
      password
    });
    
    const token = response.data.access_token;
    localStorage.setItem('farmlink_token', token);
    setToken(token);
    setUser(response.data.user);
    setIsLoggedIn(true);
    
    return { success: true, data: response.data };
    
  } catch (error) {
    // Extract error message
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message ||
                        error.message || 
                        'Login failed. Please try again.';
    
    console.error('Login error:', errorMessage);
    return { success: false, error: errorMessage };
    
  } finally {
    setLoading(false);
  }
};
const register = async (email, password, full_name, phone, address, role) => {
  try {
    setLoading(true);
    const response = await axios.post('http://localhost:8000/auth/register', {
      email,
      password,
      full_name,
      phone,
      address,
      role
    });
    
    // Registration successful, redirect to login
    return { success: true, data: response.data };
    
  } catch (error) {
    // Extract error message from different error formats
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message ||
                        error.message || 
                        'Registration failed. Please try again.';
    
    console.error('Registration error:', errorMessage);
    return { success: false, error: errorMessage };
    
  } finally {
    setLoading(false);
  }
};

  // Logout function
  const logout = () => {
    localStorage.removeItem('farmlink_token');
    localStorage.removeItem('farmlink_user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    token,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
