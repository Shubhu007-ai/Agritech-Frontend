import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * A Complete Protected Route Component
 * Features: 
 * 1. Token validation
 * 2. Redirect-back memory (remembers where the user was going)
 * 3. Loading state to prevent "flash" redirects
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        // OPTIONAL: Basic JWT Expiry Check
        // If your token is a JWT, you can uncomment this to check if it's expired:
        /*
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setIsAuthorized(false);
          return;
        }
        */

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  // 1. While checking auth, show nothing or a spinner to prevent flickering
  if (isAuthorized === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // 2. If not authorized, redirect to login
  // We pass 'state' so we can redirect them back to their intended page after login
  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. If authorized, render the protected component
  return children;
};

export default ProtectedRoute;