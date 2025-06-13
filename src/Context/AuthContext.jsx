// src/Contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios'; // Make sure this path is correct for your axios instance


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => { // Removed type annotation for children
  const [user, setUser] = useState(null); // Removed type annotation
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Removed type annotation
  const [loading, setLoading] = useState(true); // Removed type annotation

  const login = useCallback((userData, token) => { 
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await API.get('https://eventmanagement-backend-u4yf.onrender.com/api/auth/me'); // Removed type assertion for response
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [logout]);

  // The context value, no explicit type assertion needed in JS
  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // In JS, the type is inferred from the 'value' provided by AuthContext.Provider
};