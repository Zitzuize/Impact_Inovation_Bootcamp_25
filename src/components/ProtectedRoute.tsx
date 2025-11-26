import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login preserving the attempted path
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
