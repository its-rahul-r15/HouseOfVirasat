import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import AccountSidebar from '../../components/account/AccountSidebar';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight } from 'lucide-react';

export default function AccountLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#FAF6F0]">
        <div className="w-8 h-8 border-2 border-[#5C1A2E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Get current sub-path for breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSubPage = pathParts[1] || 'overview';
  const pageTitles = {
    overview: 'Patron Overview',
    orders: 'Orders & Karigari Tracking',
    bespoke: 'Bespoke Consultations',
    addresses: 'Saved Addresses & Vault',
    wishlist: 'Saved Heirlooms',
    settings: 'Profile & Security',
  };

  return (
    <div className="bg-[#FAF6F0]/60 min-h-screen font-sans pt-14 lg:pt-[112px] pb-20">
      {/* Luxury Breadcrumb Banner */}
      <div className="bg-white border-b border-[#E8E2D9] py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Link to="/" className="hover:text-[#5C1A2E] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B8935A]" />
            <Link to="/account" className="hover:text-[#5C1A2E] transition-colors">
              Patron Guild
            </Link>
            {currentSubPage !== 'overview' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#B8935A]" />
                <span className="text-[#2B2320] font-semibold">
                  {pageTitles[currentSubPage] || currentSubPage}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Account Dashboard Shell */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <AccountSidebar />

          {/* Right Dynamic Content Area */}
          <main className="flex-1 w-full min-w-0 bg-white border border-[#E8E2D9] rounded-sm p-6 sm:p-8 shadow-xs">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
