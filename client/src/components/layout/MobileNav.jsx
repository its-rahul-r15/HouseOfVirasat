import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Sparkles, ShieldCheck, ArrowRight,
  ChevronDown, Truck, User,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { productApi } from '../../api/product.api';

function AccordionItem({ item, onClose }) {
  const [open, setOpen] = useState(false);

  if (item.children) {
    return (
      <div className="border-b border-[#F0EBE3]">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-3.5 text-sm font-medium tracking-wide text-[#2B2320] hover:text-[#5C1A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
        >
          <span>{item.label}</span>
          <ChevronDown
            className={`w-4 h-4 text-[#B8935A] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="pb-2 pl-3 flex flex-col gap-0.5" role="region" aria-label={item.label}>
            {item.children.map((child) => (
              <Link
                key={child.label}
                to={child.to}
                onClick={onClose}
                className="flex items-center gap-2 py-2 text-[12.5px] text-[#6B7280] hover:text-[#5C1A2E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8935A] transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-[#B8935A] shrink-0" aria-hidden="true" />
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      onClick={onClose}
      className={`flex items-center justify-between py-3.5 border-b border-[#F0EBE3] text-sm font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors ${item.highlight
          ? 'text-[#5C1A2E] font-semibold'
          : 'text-[#2B2320] hover:text-[#5C1A2E]'
        }`}
    >
      <span className="flex items-center gap-2">
        {item.highlight && <Sparkles className="w-3.5 h-3.5 text-[#B8935A]" aria-hidden="true" />}
        {item.label}
      </span>
      <ArrowRight className="w-3.5 h-3.5 text-[#D1CCC0]" aria-hidden="true" />
    </Link>
  );
}

export default function MobileNav({ isOpen, onClose }) {
  const { settings } = useSettings();
  const { isAuthenticated, user } = useAuth();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    productApi.getCollections()
      .then((res) => {
        const data = res?.data || res || [];
        if (Array.isArray(data) && data.length > 0) {
          setCollections(data);
        }
      })
      .catch(() => {});
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems = [
    { label: 'New Arrivals', to: '/shop?sort=newest' },
    {
      label: 'Gold & Diamonds',
      children: [
        { label: '18K Fine Gold Jewellery', to: '/shop?metal=GOLD&purity=18K' },
        { label: '22K Bridal Gold', to: '/shop?metal=GOLD&purity=22K' },
        { label: 'Diamond & Solitaire', to: '/shop?metal=GOLD&stone=DIAMOND' },
        { label: 'Gold Rings', to: '/shop?metal=GOLD&category=rings' },
        { label: 'Gold Necklaces', to: '/shop?metal=GOLD&category=necklaces' },
      ],
    },
    {
      label: '925 Silver',
      children: [
        { label: 'Jadau & Polki', to: '/shop?metal=SILVER&stone=POLKI' },
        { label: 'Kundan & Meenakari', to: '/shop?metal=SILVER&stone=KUNDAN' },
        { label: 'Chokers & Necklaces', to: '/shop?metal=SILVER&category=necklaces' },
        { label: 'Chandbali Earrings', to: '/shop?metal=SILVER&category=earrings' },
        { label: 'Kadas & Bangles', to: '/shop?metal=SILVER&category=bangles' },
      ],
    },
    {
      label: 'Collections',
      children: collections.length > 0
        ? collections.map((col) => ({
            label: col.name,
            to: `/shop?collection=${(col.slug || col.name).toUpperCase()}`,
          }))
        : [
            { label: 'REET — Bridal & Jadau', to: '/shop?collection=REET' },
            { label: 'RAJSI — Uncut Polki', to: '/shop?collection=RAJSI' },
            { label: 'NITYA — Everyday Gold', to: '/shop?collection=NITYA' },
            { label: 'NOOR — Statement Solitaire', to: '/shop?collection=NOOR' },
          ],
    },
    { label: 'Bridal', to: '/shop?category=bridal' },
    { label: 'Bespoke / Customise', to: '/bespoke', highlight: true },
    { label: 'Our Story', to: '/about' },
    { label: 'Track Order', to: '/track-order' },
    { label: 'Wishlist', to: '/wishlist' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D9]">
          <Link to="/" onClick={onClose} aria-label="House of Virasat — Home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 rounded-sm">
            <img
              src="/virasat.png"
              alt="House of Virasat"
              width="140"
              height="34"
              style={{ height: '34px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-sm text-[#6B7280] hover:text-[#2B2320] hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Ready to Ship pill */}
        <div className="mx-5 mt-4 space-y-2">
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-semibold bg-[#5C1A2E] text-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] active:scale-[0.99] transition-transform"
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4B884]" aria-hidden="true" />
              {isAuthenticated ? `Patron (${user?.name?.split(' ')[0] || 'Sanctum'})` : 'Sign In / Register'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4B884]" aria-hidden="true" />
          </Link>

          <Link
            to="/shop?stock=IN_STOCK"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] active:scale-[0.99] transition-transform"
            style={{ background: '#FAF6F0', border: '1px solid #E8E2D9', color: '#5C1A2E' }}
          >
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#B8935A]" aria-hidden="true" />
              Ready to Ship (In Stock)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B8935A]" aria-hidden="true" />
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-5 pt-4 pb-6" aria-label="Mobile Directory">
          {navItems.map((item) => (
            <AccordionItem key={item.label} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 pb-6 pt-4 border-t border-[#E8E2D9] flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <ShieldCheck className="w-4 h-4 text-[#B8935A] shrink-0" aria-hidden="true" />
            <span>100% BIS Hallmarked · Certified Authentic</span>
          </div>
          <a
            href={getWhatsAppLink({ phoneNumber: settings?.whatsappNumber })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 text-white text-xs tracking-wider uppercase font-semibold rounded-xs flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#25D366' }}
            aria-label="WhatsApp Concierge"
          >
            <FaWhatsapp style={{fontSize:'16px'}} aria-hidden="true" />
            WhatsApp Concierge
          </a>
        </div>
      </div>
    </div>
  );
}
