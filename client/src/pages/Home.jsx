import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem,
  Hammer,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  Award,
  MessageCircle,
  Heart,
  RefreshCw,
  Palette,
  Mail,
  Infinity,
  Gift,
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import CategoryStoryBar from '../components/layout/CategoryStoryBar';
import { productApi } from '../api/product.api';
import { newsletterApi } from '../api/newsletter.api';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppLink } from '../utils/whatsapp';
import { FaWhatsapp } from 'react-icons/fa';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GOLD WORLD CATEGORIES (screenshot-accurate)                               */
/* ─────────────────────────────────────────────────────────────────────────── */
const GOLD_CATEGORIES = [
  { label: 'Rings', sublabel: 'Symbols of Forever', slug: 'rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=75' },
  { label: 'Earrings', sublabel: 'Grace in Every Detail', slug: 'earrings', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=200&q=75' },
  { label: 'Pendants', sublabel: 'A Touch of Brilliance', slug: 'pendants', img: 'https://images.unsplash.com/photo-1561828995-aa79a2db86dd?auto=format&fit=crop&w=200&q=75' },
  { label: 'Chains', sublabel: 'Everyday Sophistication', slug: 'chains', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=75' },
  { label: 'Bracelets & Bangles', sublabel: 'Elegance Around You', slug: 'bangles', img: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=200&q=75' },
  { label: 'Necklace Sets', sublabel: 'For Your Special Moments', slug: 'necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=75' },
];

const SILVER_CATEGORIES = [
  { label: 'Rings', sublabel: 'Royal in Every Detail', slug: 'rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=75' },
  { label: 'Jhumkas', sublabel: 'Tradition Reimagined', slug: 'earrings', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=200&q=75' },
  { label: 'Pendants', sublabel: 'Classic Expressions', slug: 'pendants', img: 'https://images.unsplash.com/photo-1561828995-aa79a2db86dd?auto=format&fit=crop&w=200&q=75' },
  { label: 'Bangles', sublabel: 'Graceful Tradition', slug: 'bangles', img: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=200&q=75' },
  { label: 'Necklace Sets', sublabel: 'For Festive Occasions', slug: 'necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=75' },
  { label: 'Accessories', sublabel: 'More Than Jewellery', slug: 'accessories', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=75' },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────────────── */
/*  HERO SLIDES — Desktop & Mobile Responsive Banners                         */
/* ─────────────────────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    desktopImage: '/banner/banner1.jpeg',
    mobileImage: '/banner/banner1.jpeg',
    title: 'Timeless Jewellery For Every You',
    ctaLink: '/shop',
    ctaText: 'Explore Our Collections',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TESTIMONIALS                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'I wore the Padmavati Polki choker at my wedding. Every guest asked where it was from. The craftsmanship is extraordinary — you can feel the weight of generations of skill.',
    name: 'Priya Sharma',
    location: 'Delhi',
    occasion: 'Bridal',
  },
  {
    id: 2,
    quote:
      'The price breakup transparency was what sold me. I could see exactly what I was paying for — the gold, the making, the stones. Completely different from any other jeweller.',
    name: 'Ananya Krishnaswamy',
    location: 'Bengaluru',
    occasion: 'Anniversary Gift',
  },
  {
    id: 3,
    quote:
      'My bespoke Meenakari jhumkas arrived in the most beautiful packaging. The WhatsApp consultation process was seamless and personal. This is what luxury jewellery should feel like.',
    name: 'Sunita Mehta',
    location: 'Mumbai',
    occasion: 'Bespoke Order',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HOME COMPONENT                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const { settings } = useSettings();

  /* Auto-rotate hero */
  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* Auto-rotate testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* Fetch live products, collections, and categories */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      productApi.getProducts({ limit: 4 }),
      productApi.getCollections(),
      productApi.getCategories(),
    ])
      .then(([prodRes, colRes, catRes]) => {
        const prods = prodRes?.data?.products || prodRes?.products || (Array.isArray(prodRes?.data) ? prodRes.data : []);
        setFeaturedProducts(prods);

        const cols = colRes?.data || colRes || [];
        setCollections(Array.isArray(cols) ? cols : (cols.collections || []));

        const cats = catRes?.data || catRes || [];
        setCategories(Array.isArray(cats) ? cats : (cats.categories || []));
      })
      .catch((err) => {
        console.error('Error fetching home data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || newsletterLoading) return;
    try {
      setNewsletterLoading(true);
      const res = await newsletterApi.subscribe({
        email: email.trim(),
        source: 'home_newsletter',
      });
      setEmailSubmitted(true);
      setNewsletterMsg(res?.data?.message || "Thank you! You're on the list.");
    } catch (err) {
      console.error('Newsletter error:', err);
      // Even if network or duplicate, grant polite confirmation
      setEmailSubmitted(true);
      setNewsletterMsg("Thank you! You're on the list.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  /* ─────────────────────────────────── RENDER ─────────────────────────────── */
  return (
    <div className="flex flex-col bg-white font-sans pt-[48px] sm:pt-[54px] lg:pt-[112px] w-full max-w-full overflow-x-hidden">

      {/* ── 0. MOBILE STORY CATEGORY BAR ────────────────────────────────── */}
      <CategoryStoryBar />

      {/* ── 1. HERO BANNER — Responsive Horizontal Aspect Ratio & Proportional Typography ─── */}
      <section className="relative w-full overflow-hidden select-none bg-[#1a0a05] aspect-[16/10] xs:aspect-[16/9] sm:aspect-[16/7.5] md:aspect-[21/9] lg:h-[calc(100vh-112px)] lg:max-h-[820px] lg:aspect-auto mt-0 lg:-mt-[112px]">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`relative w-full h-full transition-opacity duration-700 ${currentSlide === idx ? 'block animate-[fadeIn_0.5s_ease]' : 'hidden'}`}
          >
            {/* Background image — desktop/mobile */}
            <picture className="w-full h-full block">
              <source media="(max-width: 767px)" srcSet={slide.mobileImage || slide.image} />
              <source media="(min-width: 768px)" srcSet={slide.desktopImage || slide.image} />
              <img
                src={slide.desktopImage || slide.image}
                alt={slide.title || 'Virasat Fine Jewellery'}
                className="w-full h-full object-cover object-center block"
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            </picture>

            {/* Left gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
            {/* Bottom gradient for trust badges */}
            <div className="absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />

            {/* ── LEFT TEXT BLOCK (Responsive & Small on Mobile) ── */}
            <div className="absolute inset-0 flex flex-col justify-center px-3.5 sm:px-10 lg:px-14 max-w-[65%] xs:max-w-[58%] sm:max-w-[48%] lg:max-w-[42%] pointer-events-none">
              {/* Eyebrow — thin, tracked, uppercase gold */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(6.5px, 0.85vw, 9.5px)',
                letterSpacing: '0.22em',
                fontWeight: 300,
                textTransform: 'uppercase',
                color: '#D4B884',
                marginBottom: 'clamp(1px, 0.5vw, 6px)',
                lineHeight: 1,
              }}>
                A Legacy Crafted in Every Detail
              </p>

              {/* Line 1 — bold upright serif, white */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.95rem, 2.6vw, 3.5rem)',
                fontWeight: 700,
                fontStyle: 'normal',
                color: '#ffffff',
                lineHeight: 1.05,
                marginBottom: '1px',
                letterSpacing: '-0.01em',
              }}>
                Timeless Jewellery
              </h1>

              {/* Line 2 — italic serif, gold */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.95rem, 2.6vw, 3.5rem)',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#C9A84C',
                lineHeight: 1.05,
                marginBottom: 'clamp(3px, 0.9vw, 14px)',
                letterSpacing: '-0.01em',
              }}>
                For Every You
              </h1>

              {/* Subtitle — light sans */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(7px, 0.8vw, 12px)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.25,
                marginBottom: 'clamp(4px, 1.2vw, 18px)',
                maxWidth: '280px',
              }}>
                Tradition, Craftsmanship<br />and Modern Elegance — Only at Virasat.
              </p>

              {/* CTA Button */}
              <Link
                to={slide.ctaLink || '/shop'}
                className="pointer-events-auto self-start"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #C9A84C',
                  color: '#ffffff',
                  padding: 'clamp(3px, 0.6vw, 9px) clamp(8px, 1.2vw, 18px)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(6.5px, 0.65vw, 10px)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#1a0a05'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
              >
                Explore Collections <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>

            {/* ── RIGHT CURSIVE TAGLINE (visible on md+) ── */}
            <div className="absolute right-5 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 text-right hidden md:block pointer-events-none">
              <p className="font-serif italic text-white/90 text-base sm:text-lg lg:text-xl leading-snug tracking-wide">
                More than Jewellery<br />
                <span className="text-[#D4B884]">A Legacy</span> <span className="text-white/70 text-sm">♡</span>
              </p>
            </div>

            {/* ── BOTTOM TRUST BADGES (Compact & Mobile-friendly) ── */}
            <div className="absolute bottom-1 sm:bottom-3 inset-x-0 px-3 sm:px-10 lg:px-14 pointer-events-none">
              <div className="flex items-center gap-3 sm:gap-8 lg:gap-10">
                <div className="flex items-center gap-1 text-white/90">
                  <Gem className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-[#D4B884] shrink-0" />
                  <div>
                    <p className="text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] leading-none">BIS Hallmarked</p>
                    <p className="text-[6.5px] sm:text-[9px] text-white/70 leading-none mt-0.5">916 Gold</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/90">
                  <Sparkles className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-[#D4B884] shrink-0" />
                  <div>
                    <p className="text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] leading-none">Certified</p>
                    <p className="text-[6.5px] sm:text-[9px] text-white/70 leading-none mt-0.5">Diamonds</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-white/90">
                  <Infinity className="w-4 h-4 text-[#D4B884] shrink-0" />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] leading-none">Heritage</p>
                    <p className="text-[9px] text-white/70 leading-none mt-0.5">Craftsmanship</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-white/90">
                  <Gift className="w-4 h-4 text-[#D4B884] shrink-0" />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] leading-none">Perfect for</p>
                    <p className="text-[9px] text-white/70 leading-none mt-0.5">Every Occasion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel navigation */}
        {HERO_SLIDES.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all bg-black/30 hover:bg-black/55 text-white backdrop-blur-sm shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all bg-black/30 hover:bg-black/55 text-white backdrop-blur-sm shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
            </button>
            <div className="absolute bottom-6 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`block rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'w-4 sm:w-7 h-1 sm:h-2.5 bg-[#C9A84C] shadow-sm'
                      : 'w-1 sm:w-2.5 h-1 sm:h-2.5 bg-white/70 hover:bg-white shadow-sm'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── 2. TWO WORLDS — Fully Responsive ── */}
      <section className="py-6 sm:py-14 bg-[#FAF6F0]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6">

          {/* Section header */}
          <div className="text-center mb-4 sm:mb-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <span className="block w-8 sm:w-14 h-px bg-[#C9A84C]/50" />
              <span className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B8935A]">Choose Your World</span>
              <span className="block w-8 sm:w-14 h-px bg-[#C9A84C]/50" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] text-[#2B2320] font-medium leading-tight mt-0.5">
              Two Worlds of Heirloom Craft
            </h2>
            <p className="text-[11px] sm:text-sm text-[#6B7280] mt-1 font-light">Distinct Traditions. A Shared Passion for Timeless Beauty.</p>
          </div>

          {/* Two world cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

            {/* ── GOLD & DIAMOND CARD ── */}
            <div className="rounded-sm overflow-hidden bg-[#4A3010]" style={{border:'1px solid rgba(201,168,76,0.25)'}}>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 px-3.5 sm:px-5 pt-3.5 sm:pt-5 pb-2.5 sm:pb-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold leading-tight truncate" style={{color:'#ffffff'}}>
                    Fine Gold &amp; Diamond Jewellery
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#D4B884] mt-0.5 font-light truncate">Modern Elegance. Timeless Value.</p>
                </div>
                <Link
                  to="/shop?metal=GOLD"
                  className="shrink-0 inline-flex items-center gap-1 text-[#C9A84C] text-[8.5px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap transition-all hover:bg-[#C9A84C] hover:text-[#1a0a05]"
                  style={{border:'1px solid #C9A84C'}}
                >
                  Explore Gold <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>

              {/* Category thumbnails grid (6 items row, responsive) */}
              <div className="grid grid-cols-6 divide-x divide-white/10" style={{borderTop:'1px solid rgba(201,168,76,0.2)'}}>
                {GOLD_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug + '-gold'}
                    to={`/shop?metal=GOLD&category=${cat.slug}`}
                    className="group flex flex-col items-center text-center p-1 sm:p-2.5 transition-colors hover:bg-[#5C3D18]/70"
                  >
                    <div className="w-full aspect-square overflow-hidden mb-1 sm:mb-2 rounded-xs">
                      <img
                        src={cat.img}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="100"
                        height="100"
                      />
                    </div>
                    <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-white leading-tight w-full truncate">{cat.label}</p>
                    <p className="text-[7px] xs:text-[7.5px] sm:text-[9px] leading-tight mt-0.5 w-full truncate" style={{color:'rgba(212,184,132,0.75)'}}>{cat.sublabel}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── 925 SILVER CARD ── */}
            <div className="rounded-sm overflow-hidden bg-[#1B3D2A]" style={{border:'1px solid rgba(143,212,168,0.25)'}}>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 px-3.5 sm:px-5 pt-3.5 sm:pt-5 pb-2.5 sm:pb-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold leading-tight truncate" style={{color:'#ffffff'}}>
                    925 Silver Kundan &amp; Polki
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#8FD4A8] mt-0.5 font-light truncate">Heritage Artistry. Everyday Luxury.</p>
                </div>
                <Link
                  to="/shop?metal=SILVER"
                  className="shrink-0 inline-flex items-center gap-1 text-[#8FD4A8] text-[8.5px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap transition-all hover:bg-[#8FD4A8] hover:text-[#1B3D2A]"
                  style={{border:'1px solid #8FD4A8'}}
                >
                  Explore Silver <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>

              {/* Category thumbnails grid (6 items row, responsive) */}
              <div className="grid grid-cols-6 divide-x divide-white/10" style={{borderTop:'1px solid rgba(143,212,168,0.2)'}}>
                {SILVER_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug + '-silver'}
                    to={`/shop?metal=SILVER&category=${cat.slug}`}
                    className="group flex flex-col items-center text-center p-1 sm:p-2.5 transition-colors hover:bg-[#2B5C40]/70"
                  >
                    <div className="w-full aspect-square overflow-hidden mb-1 sm:mb-2 rounded-xs">
                      <img
                        src={cat.img}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="100"
                        height="100"
                      />
                    </div>
                    <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-white leading-tight w-full truncate">{cat.label}</p>
                    <p className="text-[7px] xs:text-[7.5px] sm:text-[9px] leading-tight mt-0.5 w-full truncate" style={{color:'rgba(143,212,168,0.75)'}}>{cat.sublabel}</p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST STRIP — Clean 2x2 on Mobile, 4-in-a-row on Desktop ── */}
      <section className="bg-white border-t border-b border-[#E8E2D9] py-3.5 sm:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">

          {/* 4 trust badges — 2x2 grid on mobile, row on tablet/desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3.5 sm:gap-6 lg:gap-8 w-full lg:w-auto">

            {/* Certified & Hallmarked */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8935A] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-[#1A1A1A] leading-tight">Certified &amp; Hallmarked</p>
                <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] text-[#6B7280] leading-tight mt-0.5">916 Gold &amp; 925 Silver</p>
              </div>
            </div>

            {/* Free Insured Shipping */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8935A] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-[#1A1A1A] leading-tight">Free Insured Shipping</p>
                <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] text-[#6B7280] leading-tight mt-0.5">On Orders Above ₹6,000</p>
              </div>
            </div>

            {/* Secure Payments */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8935A] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-[#1A1A1A] leading-tight">Secure Payments</p>
                <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] text-[#6B7280] leading-tight mt-0.5">100% Safe &amp; Encrypted</p>
              </div>
            </div>

            {/* Trusted by Thousands */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8935A] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-[#1A1A1A] leading-tight">Trusted by Thousands</p>
                <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] text-[#6B7280] leading-tight mt-0.5">A Legacy of Trust</p>
              </div>
            </div>
          </div>

          {/* Cursive tagline — right side */}
          <p className="font-serif italic text-[#B8935A] text-xs sm:text-sm lg:text-base leading-snug text-center lg:text-right shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E8E2D9] lg:pl-6">
            Jewellery that <span className="text-[#5C1A2E]">Tells Your Story</span>… ♡
          </p>

        </div>
      </section>

      {/* ── 3. NEW ARRIVALS (Spec §2.3) ─────────────────────────────────── */}
      <section className="py-8 sm:py-14 bg-white">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-8">
          <div className="text-center max-w-md mx-auto mb-5 sm:mb-10">
            <span className="text-[9.5px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">Master Karigari</span>
            <h2 className="font-serif text-xl sm:text-3xl text-[#2B2320] font-medium mt-0.5">New Arrivals</h2>
            <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1 font-light">Fresh heirlooms, each one-of-a-kind or small-batch artisanal.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link to="/shop" className="btn btn-outline btn-sm">
              View All New Arrivals →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. SHOP BY CATEGORY ── */}
      <section className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="w-8 h-[1px] bg-[#D1CCC0]" />
              <Sparkles className="w-4 h-4 text-[#5C1A2E]" />
              <span className="w-8 h-[1px] bg-[#D1CCC0]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2320] font-semibold">Shop by Category</h2>
            <p className="text-sm text-[#6B7280] mt-1 font-light">Explore our handcrafted collections by jewellery type.</p>
          </div>

          {/* Hero editorial category */}
          <div className="mb-4">
            <Link
              to="/shop?category=earrings"
              className="group relative block h-[200px] sm:h-[280px] bg-[#F9F8F5] overflow-hidden rounded-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1400&q=85"
                alt="Earrings"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8935A] font-bold block">Statement Jadau</span>
                <h3 className="font-serif text-xl sm:text-3xl font-medium">Handcrafted Polki & Emerald Earrings</h3>
                <span className="text-xs text-[#E5E2DA] mt-0.5 inline-block group-hover:underline">Browse Earrings →</span>
              </div>
            </Link>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {(categories.length > 0 ? categories.slice(0, 4) : [
              { name: 'Necklaces', description: 'Chokers & Raani Haar', slug: 'necklaces', image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' } },
              { name: 'Rings', description: 'Cocktail & Gold Bands', slug: 'rings', image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' } },
              { name: 'Bangles', description: 'Kadas & Filigree', slug: 'bangles', image: { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80' } },
              { name: 'Bridal', description: 'Wedding Sets', slug: 'bridal', image: { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' } },
            ]).map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group relative h-[160px] sm:h-[220px] bg-[#F9F8F5] overflow-hidden rounded-sm"
              >
                <img
                  src={cat.image?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white z-10">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-[#B8935A] font-bold">{cat.name}</span>
                  <h4 className="font-serif text-sm sm:text-base font-medium leading-tight">{cat.description || cat.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FEATURED COLLECTION — Dynamic editorial block (Spec §2.5) ────────── */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-sm overflow-hidden border border-[#E5E2DA]">
            {/* Image */}
            <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden">
              <img
                src={collections[0]?.heroImage?.url || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"}
                alt={collections[0]?.name || "REET — Bridal Heritage"}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              <div className="absolute top-5 left-5">
                <span className="py-1 px-3 bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4B884] border border-white/15 rounded-xs">
                  Featured Collection
                </span>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-5 flex flex-col justify-center p-8 sm:p-12 bg-[#FAF6F0]">
              <span className="text-[10.5px] uppercase tracking-[0.22em] font-bold text-[#5C1A2E]">
                {collections[0]?.name || 'REET — Bridal Heritage'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2320] font-medium leading-snug mt-2 mb-4">
                Where every thread of precious metal carries a century of skill.
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                {collections[0]?.description || 'Handcrafted in authentic Jadau by master karigar families, each bridal piece carries uncut Polki stones set with 24K gold foil — exactly as it has been for three hundred years.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <Link to={`/shop?collection=${(collections[0]?.slug || 'reet').toUpperCase()}`} className="btn btn-primary-gold btn-sm flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore {(collections[0]?.name || 'REET').split('—')[0].trim()}</span>
                </Link>
                <Link to="/shop" className="btn btn-outline btn-sm">
                  All Collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. IN STOCK / READY TO SHIP STRIP (Spec §2.6) ──────────────── */}
      <section className="py-6 bg-[#5C1A2E]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/15 rounded-full">
                <Truck className="w-5 h-5 text-[#D4B884]" />
              </div>
              <div>
                <p className="font-serif text-lg sm:text-xl font-medium text-white">Ready to Ship — In Stock Pieces</p>
                <p className="text-[11px] text-white/70 font-light">Dispatched within 48 hours · Insured transit included · Pan-India delivery</p>
              </div>
            </div>
            <Link
              to="/shop?stock=IN_STOCK"
              className="shrink-0 btn btn-sm inline-flex items-center gap-2 bg-white text-[#5C1A2E] hover:bg-[#FAF6F0] border-none font-semibold uppercase tracking-[0.12em]"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Shop In-Stock Pieces
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. MADE TO ORDER EXPLAINER (Spec §2.7) ──────────────────────── */}
      <section className="py-16 bg-white border-b border-[#E5E2DA]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#D1CCC0]" />
                <Clock className="w-4 h-4 text-[#B8935A]" />
              </div>
              <span className="text-[10.5px] uppercase tracking-[0.22em] font-bold text-[#5C1A2E]">Made to Order</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2320] font-medium leading-snug">
                Commission your piece.<br />
                <span className="italic font-normal">We craft it just for you.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                Many of our finest heirlooms are made to order — meaning a master karigar in Jaipur begins work on your piece after confirmation. This ensures each jewel is freshly crafted, never sitting in a dusty stockroom.
              </p>
              <ul className="space-y-2.5 text-xs text-[#4A5568]">
                {[
                  'Typical lead time: 14–21 working days',
                  'Real-time WhatsApp updates through production',
                  'Full price transparency — no hidden charges',
                  'Free revision on sizing after delivery',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#B8935A] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/shop?stock=MADE_TO_ORDER" className="btn btn-outline btn-sm inline-flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Browse MTO Pieces
              </Link>
            </div>

            {/* Image pair */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                  alt="Master karigar crafting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-xs mt-6">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
                  alt="Fine jewellery setting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. BRIDAL / OCCASION EDIT (Spec §2.8) ──────────────────────── */}
      <section className="py-0 bg-[#2B2320] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85"
              alt="Bridal jewellery"
              className="w-full h-full object-cover opacity-85"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2B2320]/60 lg:to-[#2B2320]/90" />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 text-white">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#D4B884] mb-2">Bridal & Occasion Edit</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug mb-4">
              For the moments that become memories.
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md mb-6">
              From intimate nikahs to grand Rajput wedding processions — our bridal edits are designed for the woman who wants to be remembered. Each bridal suite is available for bespoke customisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/shop?category=bridal" className="btn btn-sm inline-flex items-center gap-2 bg-[#B8935A] hover:bg-[#96773E] text-white border-none uppercase tracking-[0.12em] font-semibold">
                <Heart className="w-3.5 h-3.5" />
                Explore Bridal Edit
              </Link>
              <Link to="/bespoke" className="btn btn-sm inline-flex items-center gap-2 bg-transparent text-white border border-white/30 hover:border-white/70 uppercase tracking-[0.12em] font-semibold">
                Commission Bespoke
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. WHY HOUSE OF VIRASAT (Spec §2.9) ─────────────────────────── */}
      <section className="py-16 bg-[#FAF6F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#B8935A]">Our Promise</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2320] font-medium mt-1">Why House of Virasat</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: <Hammer className="w-6 h-6" />, title: 'Jaipur Karigari', desc: 'Master craftsmen, multi-generational lineage' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Certified Purity', desc: 'BIS hallmarked 925 silver & gold' },
              { icon: <Palette className="w-6 h-6" />, title: 'Customisation', desc: 'Bespoke to your vision & occasion' },
              { icon: <Phone className="w-6 h-6" />, title: 'Personal Service', desc: 'Direct WhatsApp concierge access' },
              { icon: <Truck className="w-6 h-6" />, title: 'Insured Transit', desc: 'Sealed vault delivery Pan-India' },
              { icon: <RefreshCw className="w-6 h-6" />, title: 'Easy Exchange', desc: '15-day no-questions exchange policy' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#B8935A] group-hover:border-[#B8935A] group-hover:bg-[#FAF6F0] transition-colors shadow-xs">
                  {item.icon}
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-[#2B2320] uppercase tracking-wide">{item.title}</p>
                  <p className="text-[10.5px] text-[#6B7280] mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. OUR STORY TEASER (Spec §2.10) ───────────────────────────── */}
      <section className="py-16 bg-white border-t border-[#E5E2DA]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-[#D1CCC0]" />
            <Gem className="w-4 h-4 text-[#B8935A]" />
            <span className="w-12 h-[1px] bg-[#D1CCC0]" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#B8935A] block">Our Story</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#2B2320] font-medium leading-snug max-w-xl mx-auto">
            Born in the lanes of Johari Bazaar.<br />
            <span className="italic font-normal">Crafted for generations to come.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed max-w-[580px] mx-auto font-light">
            House of Virasat was founded with one conviction: that the royal jewellery traditions of Rajasthan — Jadau, Kundan, Meenakari, Polki — deserve to be preserved without compromise and without pretence. We are not a marketplace. We are an atelier.
          </p>
          <Link to="/about" className="btn btn-outline btn-sm inline-flex items-center gap-2">
            Read Our Full Story <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── 11. FOUNDER NOTE TEASER (Spec §2.11) ────────────────────────── */}
      <section className="py-16 bg-[#FAF6F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Portrait */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] max-w-[340px] mx-auto lg:max-w-none overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Founder — House of Virasat"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-serif text-base font-medium">Vikram Virasat</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">Founder & Chief Karigar</p>
                </div>
              </div>
            </div>

            {/* Quote + copy */}
            <div className="lg:col-span-8 space-y-5">
              <span className="text-[10.5px] uppercase tracking-[0.22em] font-bold text-[#5C1A2E]">A Note from the Founder</span>
              <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#2B2320] leading-snug italic font-normal border-l-2 border-[#B8935A] pl-6 text-balance">
                “I didn't want to build a jewellery brand. I wanted to build a sanctuary — for the art, for the karigar, and for the patron who still believes that the most meaningful things in life are made by hand.”
              </blockquote>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed max-w-xl">
                Growing up watching my grandfather set uncut Polki stones by the light of a single lamp in our Jaipur workshop, I understood early that this craft is irreplaceable. Every piece we make carries that light.
              </p>
              <Link to="/about" className="btn btn-outline btn-sm inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]">
                <span>Read the Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. CLIENT TRUST / TESTIMONIALS (Spec §2.12) ────────────────── */}
      <section className="py-16 bg-[#2B2320]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#B8935A]">Client Stories</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-1 mb-10">
            What our patrons say
          </h2>

          {/* Active testimonial */}
          <div className="relative min-h-[180px] flex flex-col items-center justify-center">
            <div className="mb-6 flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#B8935A] text-[#B8935A]" />
              ))}
            </div>
            <blockquote
              key={activeTestimonial}
              className="font-serif text-lg sm:text-xl text-white/90 italic leading-relaxed max-w-2xl mx-auto animate-[fadeIn_0.4s_ease] text-balance"
            >
              “{TESTIMONIALS[activeTestimonial].quote}”
            </blockquote>
            <div className="mt-6 text-sm text-white/60">
              <span className="font-semibold text-white/80">{TESTIMONIALS[activeTestimonial].name}</span>
              <span className="mx-2">·</span>
              <span>{TESTIMONIALS[activeTestimonial].location}</span>
              <span className="mx-2">·</span>
              <span className="text-[#B8935A]">{TESTIMONIALS[activeTestimonial].occasion}</span>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTestimonial(idx)}
                className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] ${activeTestimonial === idx
                    ? 'w-7 h-1.5 bg-[#B8935A]'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. SERVICE STRIP (Spec §2.13) ──────────────────────────────── */}
      <section className="py-8 bg-white border-y border-[#E5E2DA]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              { icon: <Truck className="w-5 h-5" aria-hidden="true" />, label: 'Free Insured Shipping', sub: 'On all orders above ₹5,000' },
              { icon: <ShieldCheck className="w-5 h-5" aria-hidden="true" />, label: 'Secure Payment', sub: 'SSL encrypted · Razorpay trusted' },
              { icon: <Award className="w-5 h-5" aria-hidden="true" />, label: 'BIS Hallmark Purity', sub: '100% certified authentic' },
              { icon: <Palette className="w-5 h-5" aria-hidden="true" />, label: 'Customisation', sub: 'Bespoke orders via WhatsApp' },
              { icon: <MessageCircle className="w-5 h-5" aria-hidden="true" />, label: 'WhatsApp Concierge', sub: 'Direct karigar consultation' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="shrink-0 p-2.5 bg-[#FAF6F0] rounded-full text-[#B8935A]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#2B2320] uppercase tracking-wide leading-tight">{item.label}</p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. NEWSLETTER / WHATSAPP OPT-IN (Spec §2.14) ──────────────── */}
      <section className="py-12 bg-[#FAF6F0]">
        <div className="max-w-[700px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#B8935A]">Stay Connected</span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2320] font-medium mt-1 mb-1 text-balance">
            New arrivals, private previews &amp; stories from the atelier.
          </h2>
          <p className="text-xs text-[#6B7280] mb-6 font-light">No spam — only pieces worth knowing about.</p>

          {emailSubmitted ? (
            <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 text-sm text-[#2B2320] font-medium py-3 px-6 bg-white border border-[#E5E2DA] rounded-xs animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-[#B8935A]" aria-hidden="true" />
              <span>{newsletterMsg || "Thank you! You're on the list."}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  disabled={newsletterLoading}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-[#D1CCC0] rounded-xs text-sm text-[#2B2320] placeholder-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E] transition-all disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={newsletterLoading}
                className="btn btn-primary-gold btn-sm shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {newsletterLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{newsletterLoading ? 'Saving...' : 'Subscribe'}</span>
              </button>
            </form>
          )}

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="text-xs text-[#6B7280]">Prefer WhatsApp?</span>
            <a
              href={getWhatsAppLink({ phoneNumber: settings?.whatsappNumber })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#25D366] rounded-xs"
            >
              <FaWhatsapp className="w-4 h-4" aria-hidden="true" />
              <span>Join on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
