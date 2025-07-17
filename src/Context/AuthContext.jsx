import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import API from '../api/axios'; // Your pre-configured Axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To prevent redirect before checking auth

  // Login method: stores token, sets user
  const login = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Logout method: removes token, clears user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Check token on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await API.get('https://online-event-management.onrender.com/auth/me'); // Automatically attaches token if Axios interceptor is used
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication check failed:', error);
          logout();
        }
      }

      setLoading(false); // Done checking
    };

    checkAuthStatus();
  }, [logout]);

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

// Hook to use auth in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};