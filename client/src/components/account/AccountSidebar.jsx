import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Crown,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export default function AccountSidebar() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/account/orders', label: 'Orders & Karigari Tracking', icon: Package },
    { to: '/account/bespoke', label: 'Bespoke Consultations', icon: Sparkles },
    { to: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
    { to: '/account/wishlist', label: 'Saved Heirlooms', icon: Heart },
    { to: '/account/settings', label: 'Profile & Security', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border border-[#E8E2D9] rounded-sm p-5 sm:p-6 flex flex-col justify-between shadow-xs font-sans">
      <div>
        {/* Patron Crest & Identity */}
        <div className="text-center pb-6 border-b border-[#E8E2D9]">
          <div className="w-16 h-16 rounded-full bg-[#5C1A2E] text-[#D4B884] mx-auto flex items-center justify-center shadow-md mb-3 ring-4 ring-[#FAF6F0]">
            <Crown className="w-7 h-7 stroke-[1.5]" />
          </div>
          <span className="text-[9.5px] uppercase tracking-[0.22em] font-bold text-[#B8935A]">
            House of Virasat Patron
          </span>
          <h3 className="font-serif text-xl font-medium text-[#2B2320] mt-0.5">
            {user?.name || 'Patron'}
          </h3>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAF6F0] border border-[#E8E2D9] rounded-xs text-[10.5px] text-[#5C1A2E] font-semibold">
            <span>✨</span>
            <span>{user?.tier || 'Virasat Connoisseur'}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#5C1A2E] text-[#FAF6F0] font-semibold shadow-xs'
                      : 'text-[#4B5563] hover:text-[#2B2320] hover:bg-[#FAF6F0]'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Concierge & Sign out footer */}
      <div className="pt-6 mt-6 border-t border-[#E8E2D9] space-y-3">
        <a
          href={getWhatsAppLink({
            phoneNumber: settings?.whatsappNumber,
            customMessage: `Namaste House of Virasat! I am ${user?.name || 'a patron'} and need concierge assistance with my heirlooms.`,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 bg-[#FAF6F0] border border-[#E8E2D9] hover:border-[#25D366] text-[#2B2320] hover:text-[#25D366] text-xs font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Priority Concierge</span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-[#9CA3AF] hover:text-[#DC2626] hover:bg-red-50/50 rounded-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Guild</span>
        </button>
      </div>
    </aside>
  );
}
