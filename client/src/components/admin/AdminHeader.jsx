import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Coins, Plus, ExternalLink, Crown, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminHeader({ onOpenSidebar }) {
  const { user } = useAuth();
  const { settings } = useSettings();

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D9] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 font-sans shadow-2xs">
      {/* Left: Mobile Drawer Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xs hover:bg-[#FAF6F0] text-[#2B2320]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#6B7280]">
          <span className="text-[#5C1A2E] font-semibold">House of Virasat Console</span>
          <span>/</span>
          <span className="text-[#2B2320]">Management Portal</span>
        </div>
      </div>

      {/* Right: Gold Rates ticker + Quick Actions + Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Gold Rates Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#FAF6F0] border border-[#E8E2D9] rounded-xs text-xs">
          <Coins className="w-3.5 h-3.5 text-[#B8935A]" />
          <span className="text-[#6B7280]">Gold 24K:</span>
          <strong className="text-[#2B2320]">₹{settings?.goldRate24k || 7350}/g</strong>
          <span className="text-[#D1CCC4]">|</span>
          <span className="text-[#6B7280]">Silver 925:</span>
          <strong className="text-[#2B2320]">₹{settings?.silverRate925 || 89}/g</strong>
        </div>

        {/* Quick New Product Button */}
        <Link
          to="/admin/products/new"
          className="btn btn-primary-burgundy btn-xs flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase py-1.5 px-3"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E8E2D9]">
          <div className="w-8 h-8 rounded-full bg-[#5C1A2E] text-[#D4B884] flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden xl:block text-left text-xs">
            <span className="font-semibold text-[#2B2320] block leading-tight">
              {user?.name || 'Master Admin'}
            </span>
            <span className="text-[10px] text-[#6B7280] block font-mono">
              {user?.role || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
