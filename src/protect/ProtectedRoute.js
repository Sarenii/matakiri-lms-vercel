import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

/**
 * ProtectedRoute component
 * @param {React.ReactNode} children - The components to render if the user is authenticated
 * @returns {React.ReactNode} - The rendered children or a redirection to the login page
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the children if authenticated
  return children;
};

export default ProtectedRoute;
