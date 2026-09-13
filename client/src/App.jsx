import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] text-[#2B2320] antialiased">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] antialiased selection:bg-[#E8DECF] selection:text-[#1A1A1A] w-full max-w-full overflow-x-hidden">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Fixed Luxury Header (announcement strip + main nav + category links) */}
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      {/* 3. Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* 4. Global Mini Cart Drawer */}
      <CartDrawer />

      {/* 5. Floating WhatsApp Concierge Button */}
      <FloatingWhatsApp />

      {/* 6. Main Route View */}
      <main id="main-content" className="flex-1 focus:outline-none">
        <AppRoutes />
      </main>

      {/* 7. Persistent Mobile Bottom Dock Navigation */}
      <BottomNav onOpenCategories={() => setMobileNavOpen(true)} />

      {/* 8. Luxury Heritage Footer */}
      <Footer />
    </div>
  );
}
