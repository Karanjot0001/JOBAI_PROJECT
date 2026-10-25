import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Syllabus Concept: React Router v6, Route Guards, Conditional Rendering, useLocation
 * Prevents unauthorized access to protected dashboard pages, replacing unhandled vanilla exceptions.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login while preserving target route for post-login redirection
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
