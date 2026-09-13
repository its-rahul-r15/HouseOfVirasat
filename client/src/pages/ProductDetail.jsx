import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Ruler,
  Truck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { productApi } from '../api/product.api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { formatINR, formatPurity, formatWeight } from '../utils/formatters';
import { getWhatsAppLink } from '../utils/whatsapp';
import PriceBreakup from '../components/product/PriceBreakup';
import SizeGuideModal from '../components/product/SizeGuideModal';
import PincodeChecker from '../components/product/PincodeChecker';
import Accordion from '../components/ui/Accordion';
import StatusPill from '../components/ui/StatusPill';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetail() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Standard Adjustable');
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { settings } = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    if (handle) {
      productApi
        .getProductByHandle(handle)
        .then((res) => {
          const prod = res?.data?.product || res?.product || res?.data || res;
          if (prod && (prod.name || prod.sku)) {
            setProduct(prod);
            // Fetch related products in category
            const catId = prod.category?._id || prod.category;
            productApi
              .getProducts({ limit: 4, category: catId })
              .then((relRes) => {
                const prods = relRes?.data?.products || relRes?.products || [];
                setRelatedProducts(prods.filter((p) => p.urlHandle !== handle).slice(0, 4));
              })
              .catch(() => {});
          } else {
            setProduct(null);
          }
        })
        .catch((err) => {
          console.error('Error fetching product by handle:', err);
          setProduct(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [handle]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-14 lg:pt-[112px] p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-7 aspect-square bg-[#FAF6F0] rounded-sm" />
          <div className="lg:col-span-5 space-y-6 pt-4">
            <div className="h-4 bg-[#FAF6F0] rounded w-1/4" />
            <div className="h-8 bg-[#FAF6F0] rounded w-3/4" />
            <div className="h-6 bg-[#FAF6F0] rounded w-1/3" />
            <div className="h-24 bg-[#FAF6F0] rounded w-full" />
            <div className="h-12 bg-[#FAF6F0] rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#FAF6F0] text-center pt-14 lg:pt-[112px]">
        <Sparkles className="w-10 h-10 text-[#B8935A] mb-3" />
        <h2 className="font-serif text-3xl font-medium text-[#2B2320] mb-2">Jewellery Piece Not Found</h2>
        <p className="text-xs text-[#6B7280] max-w-md mb-6 leading-relaxed">
          The heritage piece you are looking for may have been archived or moved to private viewing.
        </p>
        <Link to="/shop" className="btn btn-primary-burgundy btn-sm uppercase tracking-widest text-xs">
          Explore Current Catalogue
        </Link>
      </div>
    );
  }

  const images = product.gallery?.length
    ? product.gallery.map((g) => g.url || g)
    : [product.heroImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'];

  const getCollectionName = (col) => {
    if (!col) return '';
    if (typeof col === 'string') return col;
    if (Array.isArray(col)) {
      return col.map(c => (typeof c === 'object' ? (c.name || c.slug) : c)).filter(Boolean).join(', ');
    }
    if (typeof col === 'object') return col.name || col.slug || '';
    return '';
  };

  const getCollectionSlug = (col) => {
    if (!col) return '';
    if (typeof col === 'string') return col.toLowerCase();
    if (Array.isArray(col) && col[0]) {
      const c = col[0];
      return typeof c === 'object' ? (c.slug || c.name || '').toLowerCase() : String(c).toLowerCase();
    }
    if (typeof col === 'object') return (col.slug || col.name || '').toLowerCase();
    return '';
  };

  const collectionTitle = getCollectionName(product.collection);
  const collectionSlug = getCollectionSlug(product.collection);

  const isWishlisted = isInWishlist(product._id || product.id);
  const isMTO = product.availabilityStatus === 'MADE_TO_ORDER';
  const isSoldOut =
    product.availabilityStatus === 'SOLD_OUT' || product.availabilityStatus === 'OUT_OF_STOCK';

  const handleAddToCart = () => {
    addToCart(product, { size: selectedSize, quantity: 1 });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const whatsappHref = getWhatsAppLink({ phoneNumber: settings?.whatsappNumber || '919876543210', product });

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <div className="bg-white min-h-screen pt-14 lg:pt-[112px]">

      {/* ── Breadcrumbs ─────────────────────────────────────────────────── */}
      <div className="bg-[#FAF6F0] border-b border-[#E5E2DA] py-3.5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center gap-2 text-xs text-[#6B7280]">
          <Link to="/" className="hover:text-[#2B2320]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#2B2320]">Catalogue</Link>
          <span>/</span>
          {collectionTitle && (
            <>
              <Link to={`/shop?collection=${collectionSlug.toUpperCase()}`} className="hover:text-[#2B2320]">
                {collectionTitle}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#2B2320] font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      {/* ── Main PDP Grid ────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* ── Left: Media Gallery (sticky on desktop) ─────────────────── */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24 lg:self-start">

            {/* Thumbnail strip */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible shrink-0 pb-1 sm:pb-0" role="group" aria-label="Product thumbnails">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View piece image ${idx + 1}`}
                  aria-pressed={activeImage === idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 bg-[#F9F8F5] border overflow-hidden rounded-xs shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] ${
                    activeImage === idx
                      ? 'border-[#B8935A] ring-1 ring-[#B8935A]'
                      : 'border-[#E5E2DA] hover:border-[#D1CCC0]'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} width="80" height="96" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>

            {/* Main stage */}
            <div className="flex-1 relative aspect-[4/5] bg-[#F9F8F5] border border-[#E5E2DA] overflow-hidden">
              <img
                src={images[activeImage] || images[0]}
                alt={product.name}
                width="800"
                height="1000"
                className="w-full h-full object-cover object-center"
                fetchPriority="high"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <StatusPill status={product.availabilityStatus} />
                {collectionTitle && (
                  <span className="text-[9px] uppercase tracking-[0.14em] font-semibold bg-white/85 backdrop-blur-xs px-2 py-0.5 rounded-xs text-[#2B2320]">
                    {collectionTitle}
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={isWishlisted}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-xs rounded-full text-[#2B2320] hover:text-[#5C1A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] shadow-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95]"
              >
                <Heart className={`w-5 h-5 stroke-[1.5] ${isWishlisted ? 'fill-[#5C1A2E] text-[#5C1A2E]' : ''}`} aria-hidden="true" />
              </button>

              {/* Image nav arrows on mobile */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Product & Commerce Engine ───────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-6 font-sans pb-24 lg:pb-0">

            {/* Title & SKU */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#6B7280] uppercase tracking-wider mb-1">
                <span>{collectionTitle || 'Heritage'} Collection · Jaipur Karigari</span>
                <span className="text-[#9CA3AF] tabular-nums">SKU: {product.sku || 'HOV-HEIRLOOM'}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2B2320] leading-snug">
                {product.name}
              </h1>
              {/* Status Pill inline for desktop visibility */}
              <div className="mt-2">
                <StatusPill status={product.availabilityStatus} />
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-[#FAF6F0] border border-[#E5E2DA] rounded-xs flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2320] tabular-nums">
                  {formatINR(product.sellingPrice || product.mrp)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > (product.sellingPrice || 0) && (
                  <span className="text-sm text-[#9CA3AF] line-through tabular-nums">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs text-[#6B7280]">
                Price inclusive of all taxes (3% GST) · BIS Hallmark Certified
              </span>
              {isMTO && (
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#5C1A2E] font-medium">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Made to Order · Est. 14–21 working days</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-light">
              {product.shortDescription || product.fullDescription}
            </p>

            {/* Size Selector */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E2DA]">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider font-semibold text-[#2B2320]">Select Size / Fitting:</span>
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(true)}
                  className="text-[#B8935A] hover:underline flex items-center gap-1 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8935A] rounded-xs"
                >
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Available sizes">
                {['Standard Adjustable', 'Size 12', 'Size 14', 'Size 16', 'Size 18'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 text-xs border rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] transition-all active:scale-[0.98] ${
                      selectedSize === size
                        ? 'border-[#B8935A] bg-[#FAF6F0] text-[#96773E] font-semibold ring-1 ring-[#B8935A]/50'
                        : 'border-[#E5E2DA] bg-white text-[#4A5568] hover:border-[#D1CCC0]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ── PRIMARY CTAs (desktop / non-sticky) — hidden on mobile < lg */}
            <div className="hidden lg:flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                aria-live="polite"
                className="w-full btn btn-primary-gold py-4 text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>
                  {addedAnimation ? 'Added to Bag ✓' : isSoldOut ? 'Sold Out' : isMTO ? 'Order Made to Order Piece' : 'Add to Bag'}
                </span>
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-whatsapp py-3.5 text-xs flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Ask About This Piece on WhatsApp</span>
              </a>
            </div>

            {/* Pincode Checker */}
            <div className="pt-4 border-t border-[#E5E2DA]">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#2B2320] block mb-2">
                Check Insured Delivery Timeline
              </span>
              <PincodeChecker leadTimeDays={product.leadTimeDays || 3} />
            </div>

            {/* Trust Mini-strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#E5E2DA]">
              {[
                { icon: <ShieldCheck className="w-4 h-4 text-[#B8935A]" />, label: 'BIS Certified' },
                { icon: <Truck className="w-4 h-4 text-[#B8935A]" />, label: 'Insured Delivery' },
                { icon: <Sparkles className="w-4 h-4 text-[#B8935A]" />, label: 'Handcrafted' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1 text-center">
                  {t.icon}
                  <span className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="pt-4 border-t border-[#E5E2DA] flex flex-col">
              <Accordion title="Transparent Price Breakup" defaultOpen={true}>
                <PriceBreakup product={product} />
              </Accordion>

              <Accordion title="Heirloom Specifications & Purity">
                <div className="divide-y divide-[#E5E2DA] text-xs text-[#4A5568]">
                  {[
                    ['Precious Metal', formatPurity(product.metalType, product.purity)],
                    ['Gross Weight', formatWeight(product.grossWeight) || '52.40 g'],
                    ['Net Metal Weight', formatWeight(product.netWeight) || '46.20 g'],
                    ['Gemstones / Polki', 'Hand-set Syndicate Uncut Polki'],
                    ['Hallmarking Stamp', 'Government BIS Inspected & 925 Hallmark'],
                    ['Origin', 'Handcrafted in Jaipur, Rajasthan'],
                  ].map(([label, value]) => (
                    <div key={label} className="py-2 flex justify-between">
                      <span className="text-[#6B7280]">{label}</span>
                      <span className="font-medium text-[#2B2320] tabular-nums">{value}</span>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Customisation">
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  This piece can be customised for metal purity, length, stone selection, and engravings. Contact our atelier on WhatsApp to discuss bespoke modifications. Standard customisation lead time is 21–28 working days.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#25D366] rounded-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> Discuss Customisation on WhatsApp
                </a>
              </Accordion>

              <Accordion title="Insured Shipping & Heritage Care">
                <div className="flex flex-col gap-2 text-xs text-[#6B7280] leading-relaxed">
                  <p>• Shipped in sealed tamper-evident security vault boxes via BlueDart / Sequel Logistics.</p>
                  <p>• 100% transit insurance included free of charge.</p>
                  <p>• Store in the provided velvet suede pouch away from perfumes, moisture, and alcohol sprays.</p>
                  <p>• For detailed care instructions, visit our <Link to="/policies#care" className="text-[#B8935A] hover:underline">Heritage Care Guide</Link>.</p>
                </div>
              </Accordion>

              <Accordion title="Returns & Exchange Policy">
                <div className="flex flex-col gap-2 text-xs text-[#6B7280] leading-relaxed">
                  <p>• 15-day easy exchange on in-stock pieces for sizing or preference.</p>
                  <p>• Made-to-order pieces are non-returnable but eligible for free sizing adjustment.</p>
                  <p>• All returns shipped back in original sealed packaging only.</p>
                </div>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* ── You May Also Like — Related Products (Spec §6.11) ───────────── */}
      {relatedProducts.length > 0 && (
        <section className="py-14 bg-[#FAF6F0] border-t border-[#E5E2DA]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-8">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#B8935A]">Complete the Look</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2320] font-medium mt-0.5">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Sizing Guide Modal ──────────────────────────────────────────── */}
      <SizeGuideModal isOpen={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />

      {/* ── STICKY BOTTOM CTA BAR — mobile only (Spec §6.4 & §12) ──────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E2DA] safe-area-pb shadow-xl">
        <div className="flex items-center gap-2 px-4 py-3">
          {/* Wishlist icon */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className="shrink-0 p-3 border border-[#E5E2DA] rounded-xs bg-white text-[#2B2320] hover:text-[#5C1A2E] hover:border-[#5C1A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95]"
          >
            <Heart className={`w-5 h-5 stroke-[1.5] ${isWishlisted ? 'fill-[#5C1A2E] text-[#5C1A2E]' : ''}`} aria-hidden="true" />
          </button>

          {/* WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-3 border border-[#25D366] rounded-xs bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95]"
            aria-label="Ask about this piece on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </a>

          {/* Add to Bag / MTO */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            aria-live="polite"
            className="flex-1 btn btn-primary-gold text-xs py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] active:scale-[0.99]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>
              {addedAnimation ? 'Added ✓' : isSoldOut ? 'Sold Out' : isMTO ? 'Order — Made to Order' : 'Add to Bag'}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
