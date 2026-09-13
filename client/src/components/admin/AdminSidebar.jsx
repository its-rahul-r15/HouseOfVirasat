import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  Package,
  Hammer,
  Sparkles,
  Ticket,
  Tags,
  Settings,
  Users,
  ExternalLink,
  LogOut,
  Crown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Store Operations',
      items: [
        { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
        { to: '/admin/products', label: 'Products & Catalogue', icon: Gem },
        { to: '/admin/orders', label: 'Orders & Dispatch', icon: Package },
        { to: '/admin/mto', label: 'Made-to-Order Queue', icon: Hammer },
        { to: '/admin/bespoke', label: 'Bespoke Inquiries', icon: Sparkles },
      ],
    },
    {
      title: 'Marketing & CMS',
      items: [
        { to: '/admin/coupons', label: 'Discount Coupons', icon: Ticket },
        { to: '/admin/categories', label: 'Collections & Categories', icon: Tags },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { to: '/admin/settings', label: 'Metal Rates & Settings', icon: Settings },
        ...(user?.role === 'SUPER_ADMIN'
          ? [{ to: '/admin/users', label: 'Staff & RBAC Roles', icon: Users }]
          : []),
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141414] text-[#E5E2DA] border-r border-[#262626] flex flex-col justify-between transition-transform duration-300 font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#262626]">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-sm bg-[#5C1A2E] border border-[#B8935A]/40 flex items-center justify-center text-[#D4B884] shadow-md shrink-0">
                <Crown className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#D4B884] block truncate">
                  Master Console
                </span>
                <h1 className="font-serif text-sm font-semibold text-white tracking-wide truncate">
                  House of Virasat
                </h1>
              </div>
            </Link>

            {/* Admin Badge */}
            <div className="mt-3.5 p-2 bg-[#1F1F1F] border border-[#333] rounded-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-white truncate text-[11px]">
                  {user?.name || 'Master Admin'}
                </span>
              </div>
              <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#D4B884] px-1.5 py-0.5 bg-[#5C1A2E]/50 rounded-xs border border-[#5C1A2E]">
                {user?.role === 'SUPER_ADMIN' ? 'SUPER' : 'STAFF'}
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="p-4 space-y-6 text-xs">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[9.5px] uppercase tracking-[0.2em] font-bold text-[#737373] px-3 block">
                  {group.title}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#5C1A2E] text-white font-semibold shadow-xs border border-[#B8935A]/30'
                              : 'text-[#A3A3A3] hover:text-white hover:bg-[#1F1F1F]'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 shrink-0 text-[#D4B884]" />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#262626] bg-[#0F0F0F] space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] rounded-xs text-[#E5E2DA] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D4B884]" />
              <span>Live Storefront</span>
            </span>
            <ChevronRight className="w-3 h-3 text-[#737373]" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#9CA3AF] hover:text-red-400 hover:bg-red-950/20 rounded-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
