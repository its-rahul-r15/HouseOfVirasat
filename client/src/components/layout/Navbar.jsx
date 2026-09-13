import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  Coins,
  MessageCircle,
  X,
  Gem,
  Sparkles,
  BookOpen,
  Phone,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { productApi } from '../../api/product.api';

/* ── Spec §3 Nav structure ──────────────────────────────────────────────────
   New Arrivals | Gold & Diamonds ▾ | 925 Silver ▾ | Collections ▾ |
   Bridal | Bespoke/Customise | Our Story | Journal/Guides | Contact/WhatsApp
   ────────────────────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  {
    label: 'Gold & Diamonds',
    dropdown: [
      { label: '18K Fine Gold Jewellery', to: '/shop?metal=GOLD&purity=18K' },
      { label: '22K Bridal Gold', to: '/shop?metal=GOLD&purity=22K' },
      { label: 'Diamond & Solitaire', to: '/shop?metal=GOLD&stone=DIAMOND' },
      { label: 'Gold Rings & Bands', to: '/shop?metal=GOLD&category=rings' },
      { label: 'Gold Necklaces', to: '/shop?metal=GOLD&category=necklaces' },
      { label: 'Gold Earrings', to: '/shop?metal=GOLD&category=earrings' },
    ],
  },
  {
    label: '925 Silver',
    dropdown: [
      { label: 'Jadau & Polki Jewellery', to: '/shop?metal=SILVER&stone=POLKI' },
      { label: 'Kundan & Meenakari', to: '/shop?metal=SILVER&stone=KUNDAN' },
      { label: 'Silver Chokers & Necklaces', to: '/shop?metal=SILVER&category=necklaces' },
      { label: 'Chandbali & Jhumka Earrings', to: '/shop?metal=SILVER&category=earrings' },
      { label: 'Kadas & Bangles', to: '/shop?metal=SILVER&category=bangles' },
      { label: 'Silver Rings', to: '/shop?metal=SILVER&category=rings' },
    ],
  },
  {
    label: 'Collections',
    dropdown: [
      { label: 'REET — Bridal & Jadau', to: '/shop?collection=REET' },
      { label: 'RAJSI — Uncut Polki Heritage', to: '/shop?collection=RAJSI' },
      { label: 'NITYA — Everyday Fine Gold', to: '/shop?collection=NITYA' },
      { label: 'ROOP — Statement 925 Silver', to: '/shop?collection=ROOP' },
    ],
  },
  { label: 'Bridal', to: '/shop?category=bridal' },
  { label: 'Bespoke', to: '/bespoke' },
  { label: 'Our Story', to: '/about' },
];

/* ── Brand colours (locked from spec §1) ───────────────────────────────── */
const BURGUNDY = '#5C1A2E';
const GOLD = '#B8935A';
const IVORY = '#FAF6F0';

export default function Navbar({ onOpenMobileNav }) {
  /* ── Scroll hide/show (Spec §3) ─────────────────────────────────────── */
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 60) setVisible(true);
      else if (y > lastScrollY.current + 6) setVisible(false);   // scrolling down
      else if (y < lastScrollY.current - 6) setVisible(true);    // scrolling up
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Dropdown state ─────────────────────────────────────────────────── */
  const [openDropdown, setOpenDropdown] = useState(null);   // label string
  const [showGoldRates, setShowGoldRates] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState([]);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  /* Fetch live collections for dropdown */
  useEffect(() => {
    productApi.getCollections()
      .then((res) => {
        const data = res?.data || res || [];
        setCollections(Array.isArray(data) ? data : (data.collections || []));
      })
      .catch(() => { });
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setShowGoldRates(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close dropdowns and popovers on Escape key */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setShowGoldRates(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* Close search on outside click */
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  const { totalItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (to) => location.pathname + location.search === to;

  /* ─────────────────────────────── RENDER ────────────────────────────── */
  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled
          ? 'bg-white/97 backdrop-blur-md shadow-[0_2px_20px_rgba(92,26,46,0.08)] border-b border-[#E8E2D9]'
          : 'bg-white border-b border-[#E8E2D9]'
        }`}
    >

      {/* ── TOP BAR (announcement-style) ─────────────────────────────── */}
      <div
        style={{ background: BURGUNDY }}
        className="hidden md:flex items-center justify-center py-1.5 px-4 text-[10.5px] tracking-[0.18em] uppercase font-medium text-white/90"
      >
        <span>Free insured shipping on all orders above ₹5,000 &nbsp;·&nbsp; BIS Hallmarked 925 Silver &amp; 18K Gold</span>
      </div>

      {/* ── MAIN NAV ROW ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-10 flex items-center justify-between gap-1.5 sm:gap-3 py-1.5 sm:py-2.5">

        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="lg:hidden p-1.5 sm:p-2 -ml-1 rounded-sm hover:bg-[#FAF6F0] text-[#2B2320] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
          </button>

          <Link to="/" className="flex items-center group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 rounded-sm" aria-label="House of Virasat — Home">
            <img
              src="/virasat.png"
              alt="House of Virasat"
              width="180"
              height="48"
              style={{ maxHeight: '42px', height: 'auto', width: 'auto', objectFit: 'contain' }}
              className="h-7 sm:h-9 md:h-11 lg:h-12 w-auto max-w-[100px] xs:max-w-[130px] sm:max-w-[150px] md:max-w-[180px] object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>
        </div>

        {/* Centre: Desktop primary nav links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              /* Dropdown item */
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={`flex items-center gap-1 px-2.5 xl:px-3 py-2 text-[12.5px] font-medium tracking-wide rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors ${openDropdown === item.label
                    ? 'text-[#5C1A2E] bg-[#FAF6F0]'
                    : 'text-[#2B2320] hover:text-[#5C1A2E] hover:bg-[#FAF6F0]'
                    }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    style={{ color: GOLD }}
                    aria-hidden="true"
                  />
                </button>

                {/* Mega dropdown panel */}
                {openDropdown === item.label && (
                  <div
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute top-full left-0 mt-1 min-w-[220px] bg-white border border-[#E8E2D9] shadow-xl rounded-sm py-3 z-50 animate-[fadeIn_0.15s_ease]"
                  >
                    {(item.label === 'Collections' && collections.length > 0
                      ? collections.map((col) => ({
                        label: col.name,
                        to: `/shop?collection=${(col.slug || col.name).toUpperCase()}`,
                      }))
                      : item.dropdown
                    ).map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2 px-4 py-2 text-[12px] text-[#4A5568] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8935A] transition-colors"
                      >
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: GOLD }}
                          aria-hidden="true"
                        />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Flat link */
              <Link
                key={item.label}
                to={item.to}
                className={`px-2.5 xl:px-3 py-2 text-[12.5px] font-medium tracking-wide rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors ${item.label === 'Bespoke'
                  ? 'font-semibold'
                  : ''
                  } ${isActive(item.to)
                    ? 'text-[#5C1A2E] bg-[#FAF6F0]'
                    : 'text-[#2B2320] hover:text-[#5C1A2E] hover:bg-[#FAF6F0]'
                  }`}
                style={item.label === 'Bespoke' ? { color: BURGUNDY } : {}}
              >
                {item.label === 'Bespoke' ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" style={{ color: GOLD }} aria-hidden="true" />
                    Bespoke
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )
          )}
        </nav>

        {/* Right: Search + WhatsApp + Account + Wishlist + Bag */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Search trigger & desktop search */}
          <div ref={searchRef} className="relative flex items-center">
            {/* Desktop expanded input */}
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center gap-1.5 bg-[#FAF6F0] border border-[#D1CCC0] rounded-sm px-3 py-1.5 animate-[fadeIn_0.15s_ease]"
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Search heirlooms…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-[#2B2320] placeholder-[#9CA3AF] outline-none w-44 sm:w-56"
                />
                <button type="submit" aria-label="Submit search" style={{ color: BURGUNDY }} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8935A]">
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#9CA3AF] hover:text-[#2B2320] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8935A]"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </form>
            ) : null}

            {/* Icon button (visible on mobile, or on desktop when search is closed) */}
            {(!searchOpen || true) && (
              <button
                type="button"
                aria-expanded={searchOpen}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-1.5 sm:p-2 rounded-sm text-[#2B2320] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors ${searchOpen ? 'sm:hidden' : ''}`}
              >
                {searchOpen ? <X className="w-5 h-5 stroke-[1.5] text-[#5C1A2E]" aria-hidden="true" /> : <Search className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />}
              </button>
            )}
          </div>

          {/* WhatsApp (desktop only) */}
          <a
            href={getWhatsAppLink({ phoneNumber: settings?.whatsappNumber })}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#25D366' }}
            aria-label="Open WhatsApp concierge"
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>

          {/* Gold Rate popover (desktop) */}
          <div className="relative hidden md:block">
            <button
              type="button"
              aria-expanded={showGoldRates}
              aria-haspopup="dialog"
              onClick={() => { setShowGoldRates(!showGoldRates); setOpenDropdown(null); }}
              className="flex items-center gap-1 px-2.5 py-2 text-[11.5px] font-semibold rounded-sm hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
              style={{ color: GOLD }}
            >
              <Coins className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden xl:inline">Gold Rate</span>
            </button>

            {showGoldRates && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E8E2D9] shadow-xl rounded-sm p-4 text-xs z-50 animate-[fadeIn_0.15s_ease]" role="region" aria-label="Precious Metal Rates">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E8E2D9]">
                  <span className="font-semibold text-[#2B2320]">Today's Precious Metal Rates</span>
                  <span className="text-[9.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">LIVE</span>
                </div>
                {[
                  ['Gold 24K (999 purity)', `₹ ${settings?.goldRate24k || 7300} / g`],
                  ['Gold 22K (916 hallmark)', `₹ ${Math.round((settings?.goldRate24k || 7300) * 22 / 24)} / g`],
                  ['Gold 18K (750 hallmark)', `₹ ${settings?.goldRate18k || 5500} / g`],
                  ['Silver 925 (sterling)', `₹ ${settings?.silverRate925 || 88} / g`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-[#F3F2EE] last:border-0">
                    <span className="text-[#6B7280]">{label}</span>
                    <strong className="text-[#2B2320] tabular-nums">{val}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-sm text-[#2B2320] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
            title={isAuthenticated ? `Patron Account (${user?.name || 'Patron'})` : 'Sign In / Register'}
            aria-label={isAuthenticated ? 'Patron Account' : 'Sign In'}
          >
            <User className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            {isAuthenticated && user?.name && (
              <span className="hidden xl:inline text-xs font-semibold text-[#5C1A2E] max-w-[90px] truncate">
                {user.name.split(' ')[0]}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-1.5 sm:p-2 rounded-sm text-[#2B2320] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
            title="Wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center tabular-nums"
                style={{ background: BURGUNDY }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart bag */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-1.5 sm:p-2 rounded-sm text-[#2B2320] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]/50 transition-colors"
            title="Shopping Bag"
            aria-label={`Shopping Bag, ${totalItemCount} items`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            {totalItemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center tabular-nums"
                style={{ background: GOLD }}
              >
                {totalItemCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* ── Mobile Search Expandable Dropdown Bar ────────────────────── */}
      {searchOpen && (
        <div className="sm:hidden px-4 py-2.5 bg-[#FAF6F0] border-t border-[#E8E2D9] animate-[fadeIn_0.15s_ease]">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white border border-[#D1CCC0] rounded-xs px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-[#5C1A2E] shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search heirlooms, silver, polki…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#2B2320] placeholder-[#9CA3AF] outline-none flex-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#9CA3AF] p-0.5 hover:text-[#2B2320]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="text-xs font-semibold text-[#5C1A2E] hover:text-[#B8935A] px-1"
            >
              Search
            </button>
          </form>
        </div>
      )}

    </header>
  );
}
