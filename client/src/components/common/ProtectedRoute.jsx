import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-[#FAF6F0] gap-3">
        <div className="w-8 h-8 border-2 border-[#5C1A2E] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#6B7280] font-mono">Authenticating Patron Sanctum…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
