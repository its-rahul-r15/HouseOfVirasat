import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatINR, formatPurity } from '../../utils/formatters';
import StatusPill from '../ui/StatusPill';

/**
 * ProductCard — spec §4
 * - 4:5 image, hover-swap to 2nd angle
 * - Status badge top-left (In Stock / MTO / Sold Out)
 * - Wishlist heart top-right overlay
 * - No heavy card border — whitespace/gap separation only
 * - Sold Out: image desaturated + greyed card, still clickable
 * - Quick Add overlay on desktop hover (hidden for ON_REQUEST products)
 */
export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const heroImage =
    product.heroImage ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';

  const hoverImage =
    product.gallery?.[0]?.url ||
    product.gallery?.[0] ||
    product.images?.[1]?.url ||
    product.images?.[1] ||
    heroImage;

  const isMTO = product.availabilityStatus === 'MADE_TO_ORDER';
  const isSoldOut =
    product.availabilityStatus === 'SOLD_OUT' ||
    product.availabilityStatus === 'OUT_OF_STOCK' ||
    product.stockQuantity === 0;
  const isSinglePiece =
    product.availabilityStatus === 'SINGLE_PIECE' || product.stockQuantity === 1;

  const renderPrice = () => {
    if (product.priceMode === 'ON_REQUEST' || product.priceMode === 'ESTIMATED') {
      return (
        <span className="text-[10.5px] sm:text-xs tracking-wide font-medium text-[#B8935A]">
          Price on request
        </span>
      );
    }
    if (product.priceMode === 'STARTING_FROM') {
      return (
        <div className="flex items-baseline gap-1 sm:gap-1.5 tabular-nums">
          <span className="text-[9.5px] sm:text-xs text-[#6B7280]">From</span>
          <span className="text-[12.5px] sm:text-sm font-semibold text-[#2B2320]">
            {formatINR(product.sellingPrice || product.mrp)}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-1.5 sm:gap-2 tabular-nums">
        <span className="text-[12.5px] sm:text-sm font-semibold text-[#2B2320]">
          {formatINR(product.sellingPrice || product.mrp)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > (product.sellingPrice || 0) && (
          <span className="text-[9.5px] sm:text-xs text-[#9CA3AF] line-through">
            {formatINR(product.compareAtPrice)}
          </span>
        )}
      </div>
    );
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, { quantity: 1 });
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const productPath = `/product/${product.urlHandle || product.slug || productId}`;

  return (
    <div
      className={`group relative flex flex-col bg-white transition-all duration-300 hover:shadow-sm ${
        isSoldOut ? 'opacity-70' : ''
      }`}
    >
      {/* Image Container — 4:5 aspect */}
      <Link to={productPath} className="relative block aspect-[4/5] bg-[#F9F8F5] overflow-hidden">

        {/* Primary Image */}
        <img
          src={heroImage}
          alt={product.name || 'Handcrafted Jewellery'}
          width="320"
          height="400"
          className={`w-full h-full object-cover object-center transition-opacity duration-500 group-hover:opacity-0 ${
            isSoldOut ? 'grayscale' : ''
          }`}
          loading="lazy"
        />

        {/* Hover Image */}
        <img
          src={hoverImage}
          alt={product.name ? `${product.name} alternate view` : 'Alternate view'}
          width="320"
          height="400"
          className={`absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
            isSoldOut ? 'grayscale' : ''
          }`}
          loading="lazy"
        />

        {/* Status Badge — top-left, per spec §4 */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          {isSoldOut ? (
            <StatusPill status="SOLD_OUT" />
          ) : isMTO ? (
            <StatusPill status="MADE_TO_ORDER" />
          ) : isSinglePiece ? (
            <StatusPill status="SINGLE_PIECE" />
          ) : (
            <StatusPill status="IN_STOCK" />
          )}
        </div>

        {/* Wishlist Heart — top-right overlay, per spec §4 */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-xs rounded-full text-[#2B2320] hover:text-[#5C1A2E] transition-colors shadow-xs z-10 min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5] ${
              isWishlisted ? 'fill-[#5C1A2E] text-[#5C1A2E]' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Quick Add Overlay — desktop hover, hidden for ON_REQUEST and sold-out */}
        {product.priceMode !== 'ON_REQUEST' && !isSoldOut && (
          <div className="absolute bottom-3 inset-x-3 hidden sm:block opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-10">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-[#2B2320]/90 hover:bg-[#2B2320] text-white text-[11px] uppercase tracking-[0.16em] font-semibold backdrop-blur-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              Quick Add to Bag
            </button>
          </div>
        )}

        {/* Sold Out overlay label */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
            <span className="py-1.5 px-4 bg-white/90 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#6B7280]">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1 sm:gap-2">
        <div>
          <span className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.12em] text-[#6B7280] font-medium block">
            {formatPurity(product.metalType, product.purity)}
          </span>
          <Link
            to={productPath}
            className="font-serif text-[13px] sm:text-[17px] font-medium text-[#2B2320] hover:text-[#B8935A] transition-colors line-clamp-1 mt-0.5 leading-snug block"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-1.5 sm:pt-2 border-t border-[#F3F2EE] flex items-center justify-between">
          {renderPrice()}
          {product.netWeight && (
            <span className="text-[9.5px] sm:text-[11px] text-[#9CA3AF] tabular-nums">{product.netWeight}g</span>
          )}
        </div>
      </div>
    </div>
  );
}
