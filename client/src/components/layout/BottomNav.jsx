import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LayoutGrid, Sparkles, MessageCircle, Home } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export default function BottomNav({ onOpenCategories }) {
  const location = useLocation();
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();

  const isHome = location.pathname === '/';
  const isShop = location.pathname.startsWith('/shop');
  const isBespoke = location.pathname.startsWith('/bespoke');
  const isAccount = location.pathname.startsWith('/account') || location.pathname === '/login';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E2DA] shadow-lg safe-area-pb font-sans"
    >
      <div className="grid grid-cols-5 h-14 items-center">
        
        {/* Tab 1: Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E] transition-colors ${
            isHome ? 'text-[#5C1A2E] font-semibold' : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
          aria-label="Home"
        >
          <Home className="w-4.5 h-4.5 stroke-[1.5]" aria-hidden="true" />
          <span className="text-[9.5px] tracking-tight">Home</span>
          {isHome && <span className="w-6 h-[2px] bg-[#5C1A2E] absolute bottom-0 rounded-full" aria-hidden="true" />}
        </Link>

        {/* Tab 2: Categories Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenCategories}
          className={`flex flex-col items-center justify-center gap-0.5 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E] transition-colors ${
            isShop ? 'text-[#5C1A2E] font-semibold' : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
          aria-label="Open Catalogue Drawer"
        >
          <LayoutGrid className="w-4.5 h-4.5 stroke-[1.5]" aria-hidden="true" />
          <span className="text-[9.5px] tracking-tight">Catalogue</span>
          {isShop && <span className="w-6 h-[2px] bg-[#5C1A2E] absolute bottom-0 rounded-full" aria-hidden="true" />}
        </button>

        {/* Tab 3: Bespoke Atelier */}
        <Link
          to="/bespoke"
          className={`flex flex-col items-center justify-center gap-0.5 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E] transition-colors ${
            isBespoke ? 'text-[#5C1A2E] font-semibold' : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
          aria-label="Bespoke Atelier"
        >
          <Sparkles className="w-4.5 h-4.5 stroke-[1.5]" aria-hidden="true" />
          <span className="text-[9.5px] tracking-tight">Bespoke</span>
          {isBespoke && <span className="w-6 h-[2px] bg-[#5C1A2E] absolute bottom-0 rounded-full" aria-hidden="true" />}
        </Link>

        {/* Tab 4: Patron Account */}
        <Link
          to={isAuthenticated ? '/account' : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E] transition-colors ${
            isAccount ? 'text-[#5C1A2E] font-semibold' : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
          aria-label={isAuthenticated ? 'Patron Account' : 'Sign In'}
        >
          <User className="w-4.5 h-4.5 stroke-[1.5]" aria-hidden="true" />
          <span className="text-[9.5px] tracking-tight">{isAuthenticated ? 'Account' : 'Sign In'}</span>
          {isAccount && <span className="w-6 h-[2px] bg-[#5C1A2E] absolute bottom-0 rounded-full" aria-hidden="true" />}
        </Link>

        {/* Tab 5: Help / Concierge */}
        <a
          href={getWhatsAppLink({
            phoneNumber: settings.whatsappNumber,
            customMessage: 'Namaste House of Virasat! I need help with an order or jewellery inquiry.',
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 h-full text-[#6B7280] hover:text-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-colors"
          aria-label="Contact Concierge on WhatsApp"
        >
          <MessageCircle className="w-4.5 h-4.5 stroke-[1.5]" aria-hidden="true" />
          <span className="text-[9.5px] tracking-tight">Concierge</span>
        </a>

      </div>
    </nav>
  );
}
