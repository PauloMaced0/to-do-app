// src/components/ProtectedRoute.js
import React, {useState, useEffect} from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // While authentication status is being determined, you could show a loading indicator.
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
