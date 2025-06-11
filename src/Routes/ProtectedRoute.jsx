// src/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx'; // Adjust path to .js if converted

// In JavaScript, we don't define interfaces. Props are handled dynamically.

const ProtectedRoute = ({ children, allowedRoles }) => { // Removed React.FC<ProtectedRouteProps>
  const { user, isAuthenticated, loading } = useAuth(); // Assuming useAuth provides user object and loading state

  // You can add a loading state check if your useAuth is asynchronous
  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but their role isn't allowed, redirect (e.g., to a 403 forbidden page or home)
  // Ensure user and user.role are not null/undefined before checking roles
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    // You might navigate to an unauthorized page or back to home
    return <Navigate to="/" replace />; // Or '/unauthorized' if you have one
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;