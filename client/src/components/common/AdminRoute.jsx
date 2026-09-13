import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminRoute({ children, requiredPermission }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1A1A] text-white gap-3">
        <div className="w-8 h-8 border-2 border-[#D4B884] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#9CA3AF] font-mono">Authenticating Imperial Guild Access…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'STAFF';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4 font-sans">
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-8 max-w-md text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#2B2320]">
            Restricted Admin Area
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Your account ({user?.email}) is registered as a Patron and does not have administrative privileges for the House of Virasat Master Console.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/account" className="btn btn-outline btn-sm text-xs">
              Go to Patron Account
            </Link>
            <Link to="/" className="btn btn-primary-burgundy btn-sm text-xs flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requiredPermission && user.role !== 'SUPER_ADMIN' && !user.permissions?.[requiredPermission]) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-8 max-w-md text-center space-y-4 shadow-xl">
          <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="font-serif text-xl font-medium text-[#2B2320]">
            Permission Denied
          </h2>
          <p className="text-xs text-[#6B7280]">
            You do not possess the required staff permission ({requiredPermission}) to access this specific module.
          </p>
          <Link to="/admin" className="btn btn-primary-burgundy btn-sm text-xs inline-flex">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
