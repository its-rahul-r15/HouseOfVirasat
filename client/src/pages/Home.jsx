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
  RefreshCw,
  Palette,
  Mail,
  Infinity,
  Gift,
  Play,
  Users,
  Calendar,
  Tag,
  RotateCcw,
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

const DEFAULT_HOME_CATEGORIES = [
  {
    name: 'Necklaces',
    description: 'Polki & Emerald Suites',
    slug: 'necklaces',
    image: { url: '/catagories/img1.jpeg' },
    seoTitle: 'STATEMENT JADAU',
  },
  {
    name: 'Necklaces',
    description: 'Polki & Heritage Suites',
    slug: 'necklaces',
    image: { url: '/catagories/img2.jpeg' },
  },
  {
    name: 'Rings',
    description: 'Symbols of Forever',
    slug: 'rings',
    image: { url: '/catagories/img3.jpeg' },
  },
  {
    name: 'Bangles',
    description: 'Tradition on Your Wrist',
    slug: 'bangles',
    image: { url: '/catagories/img4.jpeg' },
  },
  {
    name: 'Earrings',
    description: 'Everyday to Statement',
    slug: 'earrings',
    image: { url: '/catagories/img5.jpeg' },
  },
];

const CAT_FALLBACK_IMAGES = [
  '/catagories/img1.jpeg',
  '/catagories/img2.jpeg',
  '/catagories/img3.jpeg',
  '/catagories/img4.jpeg',
  '/catagories/img5.jpeg',
];

const getCatImg = (cat, fallbackIdx = 0) => {
  if (cat?.image?.url) return cat.image.url;
  if (typeof cat?.image === 'string' && cat.image) return cat.image;
  return CAT_FALLBACK_IMAGES[fallbackIdx % CAT_FALLBACK_IMAGES.length];
};

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

const BRIDAL_HERITAGE_SLIDES = [
  {
    subtitle: 'HEER — BRIDAL HERITAGE',
    titlePrefix: 'Where every thread',
    titleMid: 'of precious metal',
    titleItalic: 'carries a century of skill.',
    description: 'Authentic Jadau & uncut Polki suites set with 24K gold foil, handcrafted by our master artisans.',
    btnPrimaryText: 'EXPLORE HEER',
    btnPrimaryLink: '/shop?collection=HEER',
    btnSecondaryText: 'ALL COLLECTIONS',
    btnSecondaryLink: '/shop',
    bgImage: '/banner/BridalHeritage.jpeg',
  },
  {
    subtitle: 'REET — ROYAL JADAU',
    titlePrefix: 'Timeless heirlooms crafted',
    titleMid: 'with 24K gold foil & syndicate Polki',
    titleItalic: 'for royal celebrations.',
    description: 'Centuries-old techniques preserved by generational master artisans in the heart of Jaipur.',
    btnPrimaryText: 'EXPLORE REET',
    btnPrimaryLink: '/shop?collection=REET',
    btnSecondaryText: 'ALL COLLECTIONS',
    btnSecondaryLink: '/shop',
    bgImage: '/banner/BridalHeritage.jpeg',
  },
  {
    subtitle: 'RAJSI — MEENAKARI & POLKI',
    titlePrefix: 'The vibrant splendour of royal courts,',
    titleMid: 'hand-painted on silver & gold',
    titleItalic: 'for the discerning bride.',
    description: 'Intricate enamel artistry paired with brilliant gemstones for the regal jewellery connoisseur.',
    btnPrimaryText: 'EXPLORE RAJSI',
    btnPrimaryLink: '/shop?collection=RAJSI',
    btnSecondaryText: 'ALL COLLECTIONS',
    btnSecondaryLink: '/shop',
    bgImage: '/banner/BridalHeritage.jpeg',
  },
  {
    subtitle: 'NOOR — FINE GOLD HEIRLOOMS',
    titlePrefix: 'Unmatched brilliance',
    titleMid: 'and hallmarked purity',
    titleItalic: 'for your unforgettable moments.',
    description: 'Certified hallmarked gold jewellery designed to be treasured across lifetimes.',
    btnPrimaryText: 'EXPLORE NOOR',
    btnPrimaryLink: '/shop?metal=GOLD',
    btnSecondaryText: 'ALL COLLECTIONS',
    btnSecondaryLink: '/shop',
    bgImage: '/banner/BridalHeritage.jpeg',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HOME COMPONENT                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bridalSlide, setBridalSlide] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredCreations, setFeaturedCreations] = useState([]);
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

  /* Auto-rotate Bridal Heritage */
  useEffect(() => {
    if (BRIDAL_HERITAGE_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setBridalSlide((prev) => (prev + 1) % BRIDAL_HERITAGE_SLIDES.length);
    }, 4500);
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
      productApi.getProducts({ limit: 4, sort: 'newest' }),
      productApi.getProducts({ isFeatured: true, limit: 8 }),
      productApi.getCollections(),
      productApi.getCategories(),
    ])
      .then(([arrivalRes, featRes, colRes, catRes]) => {
        const arrivals = arrivalRes?.data?.products || arrivalRes?.products || (Array.isArray(arrivalRes?.data) ? arrivalRes.data : []);
        setNewArrivals(arrivals);

        const feats = featRes?.data?.products || featRes?.products || (Array.isArray(featRes?.data) ? featRes.data : []);
        setFeaturedCreations(feats.length > 0 ? feats : arrivals);

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
      <CategoryStoryBar categories={categories} />

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

            {/* ── LEFT TEXT BLOCK (Responsive & Prominently Sized) ── */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-10 lg:px-16 max-w-[85%] xs:max-w-[75%] sm:max-w-[60%] lg:max-w-[52%] pointer-events-none">
              {/* Eyebrow — thin, tracked, uppercase gold */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(8.5px, 1.1vw, 12.5px)',
                letterSpacing: '0.24em',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#D4B884',
                marginBottom: 'clamp(3px, 0.6vw, 8px)',
                lineHeight: 1.2,
              }}>
                A Legacy Crafted in Every Detail
              </p>

              {/* Line 1 — bold upright serif, white */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.5rem, 4.2vw, 4.2rem)',
                fontWeight: 700,
                fontStyle: 'normal',
                color: '#ffffff',
                lineHeight: 1.08,
                marginBottom: '2px',
                letterSpacing: '-0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}>
                Timeless Jewellery
              </h1>

              {/* Line 2 — italic serif, gold */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.5rem, 4.2vw, 4.2rem)',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#E0C588',
                lineHeight: 1.08,
                marginBottom: 'clamp(6px, 1.2vw, 16px)',
                letterSpacing: '-0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}>
                For Every You
              </h1>

              {/* Subtitle — light sans */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(10px, 1.2vw, 15px)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.38,
                marginBottom: 'clamp(8px, 1.5vw, 22px)',
                maxWidth: '380px',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
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
                  gap: '6px',
                  border: '1.5px solid #C9A84C',
                  color: '#ffffff',
                  padding: 'clamp(6px, 0.8vw, 11px) clamp(14px, 1.5vw, 24px)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(9px, 0.9vw, 12px)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  background: 'rgba(26, 10, 5, 0.4)',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#1a0a05'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26, 10, 5, 0.4)'; e.currentTarget.style.color = '#ffffff'; }}
              >
                <span>Explore Collections</span> <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  className={`block rounded-full transition-all duration-300 ${currentSlide === idx
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
            <div className="rounded-sm overflow-hidden bg-[#4A3010]" style={{ border: '1px solid rgba(201,168,76,0.25)' }}>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 px-3.5 sm:px-5 pt-3.5 sm:pt-5 pb-2.5 sm:pb-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold leading-tight truncate text-white" style={{ color: '#ffffff' }}>
                    Fine Gold &amp; Diamond Jewellery
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 font-light truncate" style={{ color: '#ffffff' }}>Modern Elegance. Timeless Value.</p>
                </div>
                <Link
                  to="/shop?metal=GOLD"
                  className="shrink-0 inline-flex items-center gap-1 text-white text-[8.5px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap transition-all hover:bg-white hover:text-[#1a0a05]"
                  style={{ border: '1px solid #ffffff', color: '#ffffff' }}
                >
                  Explore Gold <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>

              {/* Category thumbnails grid (Full Bleed Cover Image Tiles) */}
              {(() => {
                const worldCats = categories && categories.length > 0 ? categories.slice(0, 6) : GOLD_CATEGORIES;
                return (
                  <div
                    className="grid divide-x divide-white/10"
                    style={{
                      gridTemplateColumns: `repeat(${worldCats.length}, minmax(0, 1fr))`,
                      borderTop: '1px solid rgba(201,168,76,0.2)'
                    }}
                  >
                    {worldCats.map((cat, idx) => {
                      const slug = cat.slug || cat.name?.toLowerCase();
                      const name = cat.name || cat.label;
                      const subtext = cat.description || cat.sublabel || 'Fine Craft';
                      const img = getCatImg(cat, idx);

                      return (
                        <Link
                          key={(cat._id || slug || idx) + '-gold'}
                          to={`/shop?metal=GOLD&category=${slug}`}
                          className="group relative flex flex-col justify-end h-[110px] xs:h-[125px] sm:h-[145px] lg:h-[155px] overflow-hidden transition-all duration-300"
                        >
                          {/* Full Bleed Cover Image — edge-to-edge, no scale, no padding */}
                          <img
                            src={img}
                            alt={name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = CAT_FALLBACK_IMAGES[idx % CAT_FALLBACK_IMAGES.length];
                            }}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />

                          {/* Subtle Bottom Gradient strictly for text legibility */}
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                          {/* Text on Bottom */}
                          <div className="relative z-10 w-full text-center pb-2 px-1">
                            <p className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-semibold text-white leading-tight w-full truncate drop-shadow-md" style={{ color: '#ffffff' }}>
                              {name}
                            </p>
                            <p className="text-[7px] xs:text-[7.5px] sm:text-[9px] text-[#E0C588] leading-tight mt-0.5 w-full truncate font-medium drop-shadow-sm">
                              {subtext}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* ── 925 SILVER CARD ── */}
            <div className="rounded-sm overflow-hidden bg-[#1B3D2A]" style={{ border: '1px solid rgba(143,212,168,0.25)' }}>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 px-3.5 sm:px-5 pt-3.5 sm:pt-5 pb-2.5 sm:pb-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold leading-tight truncate text-white" style={{ color: '#ffffff' }}>
                    925 Silver Kundan &amp; Polki
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 font-light truncate" style={{ color: '#ffffff' }}>Heritage Artistry. Everyday Luxury.</p>
                </div>
                <Link
                  to="/shop?metal=SILVER"
                  className="shrink-0 inline-flex items-center gap-1 text-white text-[8.5px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap transition-all hover:bg-white hover:text-[#1B3D2A]"
                  style={{ border: '1px solid #ffffff', color: '#ffffff' }}
                >
                  Explore Silver <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>

              {/* Category thumbnails grid (Full Bleed Cover Image Tiles) */}
              {(() => {
                const worldCats = categories && categories.length > 0 ? categories.slice(0, 6) : SILVER_CATEGORIES;
                return (
                  <div
                    className="grid divide-x divide-white/10"
                    style={{
                      gridTemplateColumns: `repeat(${worldCats.length}, minmax(0, 1fr))`,
                      borderTop: '1px solid rgba(143,212,168,0.2)'
                    }}
                  >
                    {worldCats.map((cat, idx) => {
                      const slug = cat.slug || cat.name?.toLowerCase();
                      const name = cat.name || cat.label;
                      const subtext = cat.description || cat.sublabel || 'Silver Craft';
                      const img = getCatImg(cat, idx);

                      return (
                        <Link
                          key={(cat._id || slug || idx) + '-silver'}
                          to={`/shop?metal=SILVER&category=${slug}`}
                          className="group relative flex flex-col justify-end h-[110px] xs:h-[125px] sm:h-[145px] lg:h-[155px] overflow-hidden transition-all duration-300"
                        >
                          {/* Full Bleed Cover Image — edge-to-edge, no scale, no padding */}
                          <img
                            src={img}
                            alt={name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = CAT_FALLBACK_IMAGES[idx % CAT_FALLBACK_IMAGES.length];
                            }}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />

                          {/* Subtle Bottom Gradient strictly for text legibility */}
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                          {/* Text on Bottom */}
                          <div className="relative z-10 w-full text-center pb-2 px-1">
                            <p className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-semibold text-white leading-tight w-full truncate drop-shadow-md" style={{ color: '#ffffff' }}>
                              {name}
                            </p>
                            <p className="text-[7px] xs:text-[7.5px] sm:text-[9px] text-[#A8D8B9] leading-tight mt-0.5 w-full truncate font-medium drop-shadow-sm">
                              {subtext}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
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
            {newArrivals.map((product) => (
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

      {/* ── 4. OUR CATEGORIES ── */}
      {(() => {
        const catList = categories && categories.length > 0 ? categories : DEFAULT_HOME_CATEGORIES;
        const featuredCat = catList[0];
        const gridCats = catList.length > 1 ? catList.slice(1) : catList;

        return (
          <section className="bg-[#FAF6F0] py-10 sm:py-14">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
              <div className="text-center max-w-md mx-auto mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="w-8 h-[1px] bg-[#D1CCC0]" />
                  <Sparkles className="w-4 h-4 text-[#5C1A2E]" />
                  <span className="w-8 h-[1px] bg-[#D1CCC0]" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2320] font-semibold">Our Categories</h2>
                <p className="text-sm text-[#6B7280] mt-1 font-light">Explore our handcrafted collections by jewellery type.</p>
              </div>

              {/* 1 Long Top Featured Editorial Category */}
              {featuredCat && (
                <div className="mb-3 sm:mb-6">
                  <Link
                    to={`/shop?category=${featuredCat.slug || featuredCat.name?.toLowerCase()}`}
                    className="group relative block h-[220px] sm:h-[340px] lg:h-[380px] overflow-hidden rounded-xl shadow-md border border-[#E8DFD3]"
                  >
                    {/* 100% Full Cover Image */}
                    <img
                      src={getCatImg(featuredCat, 0)}
                      alt={featuredCat.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/catagories/img1.jpeg';
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Transparent subtle bottom gradient strictly for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Floating Transparent Text */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 text-white z-10 max-w-2xl">
                      <span className="text-[9.5px] sm:text-xs uppercase tracking-[0.22em] text-[#E0C588] font-bold block mb-0.5 drop-shadow-md">
                        {featuredCat.seoTitle || 'STATEMENT JADAU'}
                      </span>
                      <h3 className="font-serif text-lg sm:text-3xl lg:text-4xl font-medium text-white leading-tight drop-shadow-lg" style={{ color: '#ffffff' }}>
                        {featuredCat.name}
                      </h3>
                      {featuredCat.description && (
                        <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-2 max-w-xl font-light drop-shadow-md">
                          {featuredCat.description}
                        </p>
                      )}
                      <span className="text-xs sm:text-sm text-white mt-1 sm:mt-1.5 inline-flex items-center gap-1.5 font-medium group-hover:underline drop-shadow-md transition-colors" style={{ color: '#ffffff' }}>
                        <span style={{ color: '#ffffff' }}>Explore Collection</span>
                        <span className="transition-transform group-hover:translate-x-1.5" style={{ color: '#ffffff' }}>→</span>
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Dynamic Category Boxes Grid */}
              <div className={`grid grid-cols-2 ${gridCats.length > 4 ? 'sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-4'} gap-2.5 sm:gap-4 lg:gap-5`}>
                {gridCats.map((cat, idx) => (
                  <Link
                    key={cat._id || cat.slug || idx}
                    to={`/shop?category=${cat.slug || cat.name?.toLowerCase()}`}
                    className="group relative block h-[180px] xs:h-[200px] sm:h-[260px] lg:h-[290px] overflow-hidden rounded-xl shadow-sm border border-[#E8DFD3] transition-all hover:shadow-md hover:border-[#845E35]"
                  >
                    {/* 100% Full Cover Image */}
                    <img
                      src={getCatImg(cat, idx + 1)}
                      alt={cat.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = CAT_FALLBACK_IMAGES[(idx + 1) % CAT_FALLBACK_IMAGES.length];
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                    />

                    {/* Soft bottom transparent shadow so text is crisp */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Transparent Text on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white z-10" style={{ color: '#ffffff' }}>
                      <span className="text-[10.5px] sm:text-xs uppercase tracking-[0.18em] text-[#E0C588] font-bold block drop-shadow-md leading-tight">
                        {cat.name}
                      </span>
                      <h4 className="font-serif text-[11.5px] sm:text-sm lg:text-base font-medium leading-tight text-white mt-0.5 drop-shadow-lg truncate" style={{ color: '#ffffff' }}>
                        {cat.description || 'Tradition & Artistry'}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </section>
        );
      })()}

      {/* ── 6. BRIDAL HERITAGE ──────────────────────────────────────────────── */}
      <section className="py-6 sm:py-16 bg-[#FAF6F0] border-b border-[#E5E2DA] overflow-hidden">
        
        {/* ── MOBILE VIEW (< md) with Auto-scrolling slides ── */}
        <div className="block md:hidden bg-[#FAF6F0] space-y-4">
          
          {/* 1. Mobile Portrait Banner with BridalHeritage_mobile.jpeg */}
          <div className="relative w-full h-[360px] xs:h-[390px] overflow-hidden bg-[#160d1b]">
            <img
              src="/banner/BridalHeritage_mobile.jpeg"
              alt="Bridal Heritage - House of Virasat"
              className="w-full h-full object-cover object-top block"
            />
            {/* Subtle dark gradient overlay to guarantee text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/85 pointer-events-none" />

            {/* Overlaid Dynamic Slide Content - Fully Centered */}
            <div
              key={bridalSlide}
              className="absolute inset-0 p-4 pt-5 pb-3 flex flex-col justify-between text-white animate-[fadeIn_0.5s_ease] text-center"
            >
              {/* Centered Top Copy */}
              <div className="space-y-2 flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-4 h-[1px] bg-[#E0C588]" />
                  <span className="text-[9.5px] font-bold tracking-[0.2em] uppercase text-[#E0C588]">
                    {BRIDAL_HERITAGE_SLIDES[bridalSlide].subtitle}
                  </span>
                  <span className="w-4 h-[1px] bg-[#E0C588]" />
                </div>

                <h2 className="font-serif text-[22px] sm:text-[26px] leading-[1.15] text-white font-normal tracking-tight drop-shadow-md text-center max-w-[300px] mx-auto" style={{ color: '#ffffff' }}>
                  {BRIDAL_HERITAGE_SLIDES[bridalSlide].titlePrefix}{' '}
                  {BRIDAL_HERITAGE_SLIDES[bridalSlide].titleMid && (
                    <span>{BRIDAL_HERITAGE_SLIDES[bridalSlide].titleMid} </span>
                  )}
                  <span className="italic text-[#F3DBA8] font-serif block sm:inline" style={{ color: '#F3DBA8' }}>
                    {BRIDAL_HERITAGE_SLIDES[bridalSlide].titleItalic}
                  </span>
                </h2>

                <p className="text-[11px] text-white/90 leading-snug font-light max-w-[280px] mx-auto drop-shadow-xs text-center line-clamp-2" style={{ color: '#ffffff' }}>
                  {BRIDAL_HERITAGE_SLIDES[bridalSlide].description}
                </p>

                {/* Action Buttons Centered Side-by-Side with Short Text */}
                <div className="pt-1.5 flex flex-row items-center justify-center gap-2 w-full max-w-[280px] mx-auto">
                  <Link
                    to={BRIDAL_HERITAGE_SLIDES[bridalSlide].btnPrimaryLink}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#845E35] hover:bg-[#6E4B27] text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded-xs shadow-md transition-all active:scale-98 flex-1 text-center"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#E6C697]" />
                  </Link>

                  <Link
                    to={BRIDAL_HERITAGE_SLIDES[bridalSlide].btnSecondaryLink}
                    className="inline-flex items-center justify-center px-2.5 py-2 border border-white/60 text-white hover:bg-white hover:text-[#1a0a05] text-[9.5px] font-semibold uppercase tracking-[0.1em] rounded-xs backdrop-blur-xs transition-all active:scale-98 flex-1 text-center"
                  >
                    <span>View All</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Slide Indicators */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/20">
                <div className="flex items-center gap-1.5">
                  {BRIDAL_HERITAGE_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBridalSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        bridalSlide === idx ? 'w-6 bg-[#E0C588]' : 'w-2 bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-semibold text-[#E0C588] tracking-wider">
                    0{bridalSlide + 1} <span className="text-white/40">/</span> 0{BRIDAL_HERITAGE_SLIDES.length}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Below Banner Area (Cream) */}
          <div className="px-4 pb-4 space-y-4">
            
            {/* 4 Trust Badges in a single 4-column row */}
            <div className="grid grid-cols-4 gap-1.5 text-center py-3.5 bg-white/70 backdrop-blur-xs border border-[#E8DFD3] rounded-xl shadow-2xs">
              {/* Authentic Craftsmanship */}
              <div className="flex flex-col items-center gap-1 p-1">
                <div className="w-7 h-7 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-medium text-[#241B16] leading-tight">
                  Authentic<br />Craftsmanship
                </span>
              </div>

              {/* Heritage Designs */}
              <div className="flex flex-col items-center gap-1 p-1 border-l border-[#E8DFD3]">
                <div className="w-7 h-7 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                  <Gem className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-medium text-[#241B16] leading-tight">
                  Heritage<br />Designs
                </span>
              </div>

              {/* Trusted by Generations */}
              <div className="flex flex-col items-center gap-1 p-1 border-l border-[#E8DFD3]">
                <div className="w-7 h-7 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-medium text-[#241B16] leading-tight">
                  Trusted by<br />Generations
                </span>
              </div>

              {/* Certified Materials */}
              <div className="flex flex-col items-center gap-1 p-1 border-l border-[#E8DFD3]">
                <div className="w-7 h-7 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-medium text-[#241B16] leading-tight">
                  Certified<br />Materials
                </span>
              </div>
            </div>

            {/* Micro Footer Legend */}
            <div className="pt-2 text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-[#D4C3B3]" />
                <span className="text-[9px] uppercase tracking-[0.24em] font-semibold text-[#8C7A6B]">
                  More Than Jewellery
                </span>
                <span className="w-8 h-[1px] bg-[#D4C3B3]" />
              </div>
              <p className="font-serif text-[12px] uppercase tracking-[0.2em] font-bold text-[#845E35]">
                A Legacy
              </p>
            </div>

          </div>

        </div>

        {/* ── DESKTOP & TABLET VIEW (>= md) ── */}
        <div className="hidden md:block max-w-[1400px] mx-auto px-4 sm:px-8">
          
          {/* Main Master Card Container */}
          <div className="relative rounded-[20px] sm:rounded-[30px] overflow-hidden bg-[#160d1b] border border-[#E5DFD5] shadow-2xl">
            
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
              <img
                src={BRIDAL_HERITAGE_SLIDES[bridalSlide].bgImage}
                alt="Bridal Heritage"
                className="w-full h-full object-cover object-left-center transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent lg:to-transparent" />
            </div>

            {/* Content Split: Left Editorial & Right Luxury Arch Card */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[560px] items-stretch">
              
              {/* Left Side: Editorial Overlays */}
              <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between text-white">
                {/* Top Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-white/60" />
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-white/90">
                      A Legacy in Every Detail
                    </span>
                    <span className="w-6 h-[1px] bg-white/60" />
                  </div>
                </div>

                {/* Slide dashes */}
                <div className="flex items-center gap-2 pt-6">
                  {BRIDAL_HERITAGE_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBridalSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        bridalSlide === idx ? 'w-10 bg-[#E0C588]' : 'w-4 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side: Transparent Panel over Background Image */}
              <div className="lg:col-span-6 relative flex flex-col justify-between bg-black/35 lg:bg-black/40 backdrop-blur-xs lg:rounded-l-[32px] p-6 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/15 text-white">
                
                {/* Top Pagination & Arrows */}
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E0C588] font-bold text-xs uppercase tracking-[0.2em] drop-shadow-xs">
                      {BRIDAL_HERITAGE_SLIDES[bridalSlide].subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#E0C588] tracking-widest drop-shadow-xs">
                      0{bridalSlide + 1} <span className="text-white/40">/</span> 0{BRIDAL_HERITAGE_SLIDES.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBridalSlide((prev) => (prev === 0 ? BRIDAL_HERITAGE_SLIDES.length - 1 : prev - 1))}
                        className="w-8 h-8 rounded-full border border-white/30 bg-black/40 text-white hover:bg-[#C9A84C] hover:text-[#1a0a05] hover:border-[#C9A84C] flex items-center justify-center transition-all shadow-xs active:scale-95"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBridalSlide((prev) => (prev + 1) % BRIDAL_HERITAGE_SLIDES.length)}
                        className="w-8 h-8 rounded-full border border-white/30 bg-black/40 text-white hover:bg-[#C9A84C] hover:text-[#1a0a05] hover:border-[#C9A84C] flex items-center justify-center transition-all shadow-xs active:scale-95"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Headline & Description */}
                <div className="py-5 sm:py-7 space-y-4">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] text-white font-medium leading-[1.22] text-balance drop-shadow-md" style={{ color: '#ffffff' }}>
                    <span className="text-white" style={{ color: '#ffffff' }}>
                      {BRIDAL_HERITAGE_SLIDES[bridalSlide].titlePrefix}{' '}
                    </span>
                    {BRIDAL_HERITAGE_SLIDES[bridalSlide].titleMid && (
                      <span className="text-white" style={{ color: '#ffffff' }}>
                        {BRIDAL_HERITAGE_SLIDES[bridalSlide].titleMid}{' '}
                      </span>
                    )}
                    <span className="italic font-normal text-[#F3DBA8]" style={{ color: '#F3DBA8' }}>
                      {BRIDAL_HERITAGE_SLIDES[bridalSlide].titleItalic}
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-white leading-relaxed max-w-lg font-light drop-shadow-sm" style={{ color: '#ffffff' }}>
                    {BRIDAL_HERITAGE_SLIDES[bridalSlide].description}
                  </p>

                  {/* Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to={BRIDAL_HERITAGE_SLIDES[bridalSlide].btnPrimaryLink}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] hover:bg-[#B8935A] text-[#1a0a05] text-xs font-bold uppercase tracking-[0.14em] rounded-xs shadow-lg transition-all active:scale-98"
                    >
                      <span>{BRIDAL_HERITAGE_SLIDES[bridalSlide].btnPrimaryText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={BRIDAL_HERITAGE_SLIDES[bridalSlide].btnSecondaryLink}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-white/50 text-white hover:bg-white hover:text-[#1a0a05] text-xs font-semibold uppercase tracking-[0.14em] rounded-xs backdrop-blur-xs transition-all active:scale-98"
                    >
                      <span>{BRIDAL_HERITAGE_SLIDES[bridalSlide].btnSecondaryText}</span>
                    </Link>
                  </div>
                </div>

                {/* 4 Feature Pillars Divider Row */}
                <div className="pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  
                  {/* Authentic Craftsmanship */}
                  <div className="flex flex-col items-center gap-1.5 p-1">
                    <Sparkles className="w-4 h-4 text-[#E0C588]" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight drop-shadow-xs">
                      Authentic Craftsmanship
                    </span>
                  </div>

                  {/* Heritage Designs */}
                  <div className="flex flex-col items-center gap-1.5 p-1 border-l border-white/15">
                    <Gem className="w-4 h-4 text-[#E0C588]" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight drop-shadow-xs">
                      Heritage Designs
                    </span>
                  </div>

                  {/* Trusted by Generations */}
                  <div className="flex flex-col items-center gap-1.5 p-1 sm:border-l border-white/15">
                    <Users className="w-4 h-4 text-[#E0C588]" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight drop-shadow-xs">
                      Trusted by Generations
                    </span>
                  </div>

                  {/* Certified Materials */}
                  <div className="flex flex-col items-center gap-1.5 p-1 border-l border-white/15">
                    <ShieldCheck className="w-4 h-4 text-[#E0C588]" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight drop-shadow-xs">
                      Certified Materials
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Micro Footer Legend */}
          <div className="mt-4 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9.5px] uppercase tracking-[0.25em] text-[#9C9488]">
            <span>TRADITION &nbsp;|&nbsp; ARTISTRY &nbsp;|&nbsp; ELEGANCE &nbsp;|&nbsp; ALWAYS YOURS</span>
            <span className="font-semibold text-[#8F6B38]">MORE THAN JEWELLERY — A LEGACY</span>
          </div>

        </div>
      </section>

      {/* ── 6.5 FEATURED CREATIONS / FEATURE PRODUCTS ────────────────────── */}
      <section className="py-10 sm:py-16 bg-white border-b border-[#E8DFD3]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <span className="block w-6 sm:w-10 h-px bg-[#C9A84C]/60" />
              <span className="text-[9.5px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#5C1A2E]">
                Signature Spotlight
              </span>
              <span className="block w-6 sm:w-10 h-px bg-[#C9A84C]/60" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2B2320] font-medium leading-tight">
              Featured Creations
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-light">
              Handpicked heirloom pieces celebrated for exceptional karigari and timeless royal allure.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {featuredCreations.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-7 sm:mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-transparent hover:bg-[#5C1A2E] text-[#5C1A2E] hover:text-white border border-[#5C1A2E] text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 shadow-2xs hover:shadow-sm"
            >
              <span>Explore All Featured Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── 7. MADE TO ORDER EXPLAINER ─────────────────────────────────────── */}
      <section className="relative bg-[#FAF6F0] border-b border-[#E8DFD3] overflow-hidden">
        
        {/* ── MOBILE VIEW (< md) matching uploaded mobile design ── */}
        <div className="block md:hidden bg-[#FAF6F0]">
          
          {/* 1. Full-width Seamless Image Container with Content INSIDE it */}
          <div className="relative w-full overflow-hidden bg-[#FAF6F0]">
            <img
              src="/banner/madetoorder_mobile.jpeg"
              alt="Made to Order At House of Virasat"
              className="w-full h-auto object-cover block"
            />

            {/* Header Text Block positioned INSIDE the upper empty area of the image */}
            <div className="absolute top-0 left-0 right-0 p-5 pt-6 space-y-2 max-w-[92%]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[1.5px] bg-[#946E3A]" />
                <span className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[#946E3A]">
                  Made to Order
                </span>
              </div>

              <h2 className="font-serif text-[21px] sm:text-[24px] leading-[1.14] text-[#241B16] font-normal tracking-tight">
                Commission your piece.<br />
                <span className="italic text-[#4A3222] font-serif">We craft it just for you.</span>
              </h2>

              <p className="text-[11.5px] text-[#55493F] leading-snug font-light max-w-[250px]">
                Collaborate with our Jaipur artisans to bring your vision to life, step by step.
              </p>

              <div className="pt-0.5">
                <Link
                  to="/shop?stock=MADE_TO_ORDER"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#845E35] hover:bg-[#6E4B27] text-white font-sans text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-all duration-300 shadow-sm rounded-xs"
                >
                  <span>Browse MTO Pieces</span>
                  <ArrowRight className="w-3 h-3 text-[#E6C697]" />
                </Link>
              </div>
            </div>

            {/* Middle Stone Overlay: YOUR VISION, OUR CRAFTSMANSHIP */}
            <div className="absolute left-[3%] top-[45%] -translate-y-1/2 bg-black/55 backdrop-blur-md px-2.5 py-1.5 rounded-xs border border-white/30 shadow-md">
              <p className="text-[8px] uppercase tracking-[0.22em] font-serif font-medium" style={{ color: '#ffffff' }}>
                YOUR VISION,
              </p>
              <p className="text-[7px] uppercase tracking-[0.18em] font-sans font-semibold text-[#E6C697]">
                OUR CRAFTSMANSHIP
              </p>
            </div>

            {/* Top Right Photo: SKILLED HANDS / TIMELESS CREATIONS */}
            <div className="absolute right-2.5 top-[45%] -translate-y-1/2 text-center bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-xs border border-white/30 shadow-md">
              <p className="text-[7.5px] uppercase tracking-[0.2em] font-serif font-medium" style={{ color: '#ffffff' }}>
                SKILLED HANDS
              </p>
              <p className="text-[6.5px] uppercase tracking-[0.16em] font-sans font-semibold text-[#E6C697] mt-0.5">
                TIMELESS CREATIONS
              </p>
            </div>

            {/* Bottom Right Photo: FROM SKETCH / TO HEIRLOOM */}
            <div className="absolute right-2.5 bottom-[17%] text-left bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-xs border border-white/30 shadow-md">
              <p className="text-[7.5px] uppercase tracking-[0.2em] font-serif font-medium" style={{ color: '#ffffff' }}>
                FROM SKETCH
              </p>
              <p className="text-[6.5px] uppercase tracking-[0.16em] font-sans font-semibold text-[#E6C697] mt-0.5">
                TO HEIRLOOM
              </p>
            </div>
          </div>

          {/* Bottom Content Area */}
          <div className="px-4.5 pb-6 space-y-4">
            {/* 2. Cursive Heading */}
            <div className="text-center pt-2 pb-0.5">
              <h3 className="font-serif italic text-2xl text-[#241B16] font-normal">
                Crafted with Purpose
              </h3>
            </div>

            {/* 3. 2x2 Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Card 1: Lead Time */}
              <div className="p-3 bg-[#FAF7F2] border border-[#EBE3D7] rounded-xl flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DC] text-[#845E35] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#706256] leading-tight font-medium">Typical lead time</p>
                  <p className="text-[11px] font-semibold text-[#241B16] mt-0.5">14-21 working days</p>
                </div>
              </div>

              {/* Card 2: WhatsApp updates */}
              <div className="p-3 bg-[#FAF7F2] border border-[#EBE3D7] rounded-xl flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DC] text-[#845E35] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#706256] leading-tight font-medium">Real-time WhatsApp</p>
                  <p className="text-[10.5px] font-semibold text-[#241B16] mt-0.5 leading-tight">updates through production</p>
                </div>
              </div>

              {/* Card 3: Full price transparency */}
              <div className="p-3 bg-[#FAF7F2] border border-[#EBE3D7] rounded-xl flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DC] text-[#845E35] flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#706256] leading-tight font-medium">Full price transparency</p>
                  <p className="text-[11px] font-semibold text-[#241B16] mt-0.5">- no hidden charges</p>
                </div>
              </div>

              {/* Card 4: Free revision on sizing */}
              <div className="p-3 bg-[#FAF7F2] border border-[#EBE3D7] rounded-xl flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DC] text-[#845E35] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#706256] leading-tight font-medium">Free revision on sizing</p>
                  <p className="text-[11px] font-semibold text-[#241B16] mt-0.5">after delivery</p>
                </div>
              </div>
            </div>

            {/* 4. Mobile Bottom Trust Strip */}
            <div className="pt-3 border-t border-[#E8DFD3] grid grid-cols-2 gap-3 items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EDE4D8] text-[#845E35] flex items-center justify-center shrink-0">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-serif text-[11px] font-semibold text-[#241B16] leading-tight">Crafted in Jaipur</p>
                  <p className="text-[9.5px] text-[#706256]">by Master Artisans</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EDE4D8] text-[#845E35] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-serif text-[11px] font-semibold text-[#241B16] leading-tight">Heirlooms for Generations</p>
                  <p className="text-[9.5px] text-[#706256]">A Timeless Legacy</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── DESKTOP & TABLET VIEW (>= md) ── */}
        <div className="hidden md:flex relative max-w-[1500px] mx-auto min-h-[580px] lg:min-h-[640px] flex-col justify-between">
          
          {/* Background Image Layer */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/banner/madetoorder.jpeg"
              alt="Made to Order At House of Virasat"
              className="w-full h-full object-cover object-right lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/85 md:via-[#FAF6F0]/65 to-transparent w-full md:w-[60%] lg:w-[48%]" />
          </div>

          {/* Top Bar / Header Brand Stamp */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 pt-8 sm:pt-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-[1.5px] bg-[#946E3A]" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#946E3A]">
                Made to Order
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8C7A6B]">
              <svg className="w-4 h-4 text-[#946E3A]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C11.5 5 9 8 5 9c4 1 6.5 4 7 7 0.5-3 3-6 7-7-4-1-6.5-4-7-7z" opacity="0.6"/>
                <path d="M12 7c-1 3-3.5 5.5-6.5 6 3 0.5 5.5 3 6.5 6 1-3 3.5-5.5 6.5-6-3-0.5-5.5-3-6.5-6z"/>
              </svg>
              <span>Tradition &nbsp;|&nbsp; Artistry &nbsp;|&nbsp; Always Yours</span>
            </div>
          </div>

          {/* Content Body Grid */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Copy & Value Props */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-6 max-w-xl">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#241B16] font-normal leading-[1.16] tracking-tight">
                  Commission your piece.<br />
                  <span className="italic text-[#4A3222] font-serif">We craft it just for you.</span>
                </h2>
                <p className="mt-4 text-xs sm:text-[13.5px] text-[#55493F] leading-relaxed font-light">
                  Many of our finest heirlooms are made to order — meaning a master karigar in Jaipur begins work on your piece after confirmation. This ensures each jewel is freshly crafted, never sitting in a dusty stockroom.
                </p>
              </div>

              {/* 4 Feature Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-1">
                {/* 1. Lead Time */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#D8C7B5] bg-white/70 backdrop-blur-xs flex items-center justify-center shrink-0 text-[#946E3A] shadow-2xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#706256] leading-tight">Typical lead time:</p>
                    <p className="text-xs font-semibold text-[#241B16]">14 – 21 working days</p>
                  </div>
                </div>

                {/* 2. WhatsApp Updates */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#D8C7B5] bg-white/70 backdrop-blur-xs flex items-center justify-center shrink-0 text-[#946E3A] shadow-2xs">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#241B16] leading-tight">Real-time WhatsApp updates</p>
                    <p className="text-[11px] text-[#706256]">through production</p>
                  </div>
                </div>

                {/* 3. Full price transparency */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#D8C7B5] bg-white/70 backdrop-blur-xs flex items-center justify-center shrink-0 text-[#946E3A] shadow-2xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#241B16] leading-tight">Full price transparency</p>
                    <p className="text-[11px] text-[#706256]">— no hidden charges</p>
                  </div>
                </div>

                {/* 4. Free revision on sizing */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#D8C7B5] bg-white/70 backdrop-blur-xs flex items-center justify-center shrink-0 text-[#946E3A] shadow-2xs">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#241B16] leading-tight">Free revision on sizing</p>
                    <p className="text-[11px] text-[#706256]">after delivery</p>
                  </div>
                </div>
              </div>

              {/* CTA Button & Cursive Accent */}
              <div className="pt-3 flex flex-wrap items-center gap-6 sm:gap-8">
                <Link
                  to="/shop?stock=MADE_TO_ORDER"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 bg-[#845E35] hover:bg-[#6E4B27] text-white font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-sm rounded-xs group"
                >
                  <span>Browse MTO Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E6C697] group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="font-serif italic text-2xl sm:text-3xl text-[#A68252] select-none">
                  Crafted with Purpose
                </span>
              </div>
            </div>

            {/* Right Column Micro-Overlays (Desktop) */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-[420px] relative pointer-events-none">
              {/* Middle Stone Overlay: YOUR VISION / OUR CRAFTSMANSHIP */}
              <div className="absolute left-[33%] xl:left-[35%] top-[48%] -translate-y-1/2 text-right bg-black/45 backdrop-blur-md px-4 py-2 rounded-xs border border-white/30 shadow-xl">
                <p className="text-[10.5px] uppercase tracking-[0.28em] font-serif font-medium drop-shadow-sm" style={{ color: '#ffffff' }}>
                  YOUR VISION
                </p>
                <div className="w-12 h-[1px] bg-gradient-to-l from-[#E6C697] to-transparent my-1 ml-auto" />
                <p className="text-[9.5px] uppercase tracking-[0.24em] font-sans font-semibold text-[#E6C697] drop-shadow-xs">
                  OUR CRAFTSMANSHIP
                </p>
              </div>

              {/* Top Right Photo: SKILLED HANDS / TIMELESS CREATIONS */}
              <div className="absolute right-5 xl:right-7 top-[22%] text-center bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-xs border border-white/30 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.26em] font-serif font-medium drop-shadow-sm" style={{ color: '#ffffff' }}>
                  SKILLED HANDS
                </p>
                <p className="text-[8.5px] uppercase tracking-[0.2em] font-sans font-semibold text-[#E6C697] mt-0.5 drop-shadow-xs">
                  TIMELESS CREATIONS
                </p>
              </div>

              {/* Bottom Right Photo: FROM SKETCH / TO HEIRLOOM */}
              <div className="absolute right-[14%] xl:right-[16%] bottom-[9%] text-left bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-xs border border-white/30 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.26em] font-serif font-medium drop-shadow-sm" style={{ color: '#ffffff' }}>
                  FROM SKETCH
                </p>
                <p className="text-[8.5px] uppercase tracking-[0.2em] font-sans font-semibold text-[#E6C697] mt-0.5 drop-shadow-xs">
                  TO HEIRLOOM
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Trust Strip */}
          <div className="relative z-10 mt-auto border-t border-[#E8DFD3] bg-[#F7F2EB]/95 backdrop-blur-xs py-5 px-6 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center max-w-4xl">
              
              {/* 1. Personalised Experience */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EDE4D8] text-[#845E35] flex items-center justify-center shrink-0">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#241B16] leading-snug">
                    A Personalised Experience
                  </h4>
                  <p className="text-[11px] text-[#706256] leading-tight">
                    Designed Around Your Story
                  </p>
                </div>
              </div>

              {/* 2. Crafted in Jaipur */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EDE4D8] text-[#845E35] flex items-center justify-center shrink-0">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#241B16] leading-snug">
                    Crafted in Jaipur
                  </h4>
                  <p className="text-[11px] text-[#706256] leading-tight">
                    By Master Artisans
                  </p>
                </div>
              </div>

              {/* 3. Heirlooms for Generations */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EDE4D8] text-[#845E35] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#241B16] leading-snug">
                    Heirlooms for Generations
                  </h4>
                  <p className="text-[11px] text-[#706256] leading-tight">
                    More Than Jewellery, A Legacy
                  </p>
                </div>
              </div>

            </div>

            {/* Subtle Palace Artwork Silhouette in Bottom Right */}
            <div className="absolute right-4 bottom-0 hidden lg:block opacity-35 pointer-events-none">
              <svg className="w-48 h-16 text-[#A68252]" viewBox="0 0 200 60" fill="currentColor">
                <path d="M10 60V40l10-8 10 8v20h-20zm30 0V32l15-12 15 12v28h-30zm40 0V20l20-16 20 16v40h-40zm50 0V32l15-12 15 12v28h-30zm40 0V40l10-8 10 8v20h-20z" />
                <circle cx="20" cy="30" r="3" />
                <circle cx="55" cy="18" r="4" />
                <circle cx="100" cy="3" r="5" />
                <circle cx="145" cy="18" r="4" />
                <circle cx="180" cy="30" r="3" />
              </svg>
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
              <div className="relative aspect-[4/4.5] max-w-[300px] h-[280px] sm:h-[320px] mx-auto lg:max-w-none overflow-hidden rounded-md shadow-sm">
                <img
                  src="/founderimg.jpeg"
                  alt="Founder — House of Virasat"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-serif text-base font-medium" style={{ color: '#ffffff' }}>Riya Sikaria</p>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider" style={{ color: '#ffffff' }}>Founder</p>
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
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-white/90" style={{ color: '#ffffff' }}>Client Stories</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium mt-1 mb-10 text-white" style={{ color: '#ffffff' }}>
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
              className="font-serif text-lg sm:text-xl text-white italic leading-relaxed max-w-2xl mx-auto animate-[fadeIn_0.4s_ease] text-balance"
              style={{ color: '#ffffff' }}
            >
              “{TESTIMONIALS[activeTestimonial].quote}”
            </blockquote>
            <div className="mt-6 text-sm text-white/90" style={{ color: '#ffffff' }}>
              <span className="font-semibold text-white" style={{ color: '#ffffff' }}>{TESTIMONIALS[activeTestimonial].name}</span>
              <span className="mx-2 text-white/60">·</span>
              <span className="text-white/80">{TESTIMONIALS[activeTestimonial].location}</span>
              <span className="mx-2 text-white/60">·</span>
              <span className="text-[#E0C088] font-medium">{TESTIMONIALS[activeTestimonial].occasion}</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
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
