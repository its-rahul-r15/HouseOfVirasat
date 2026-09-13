import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const location = useLocation();
  const isInsideAccount = location.pathname.startsWith('/account');

  const content = (
    <div>
      {/* Header inside Account */}
      {isInsideAccount && (
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E8E2D9]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
              Private Collection
            </span>
            <h2 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
              Saved Heirlooms (<span className="tabular-nums">{wishlist.length}</span>)
            </h2>
          </div>
          <Link to="/shop" className="btn btn-outline btn-xs text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]">
            Continue Browsing
          </Link>
        </div>
      )}

      {/* Grid or Empty state */}
      {wishlist.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#E8E2D9] flex items-center justify-center text-[#B8935A]">
            <Heart className="w-7 h-7 stroke-[1.5]" aria-hidden="true" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#2B2320]">
            Your wishlist is currently empty
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Explore our handcrafted Polki, Jadau, and Fine Gold pieces and tap the heart icon on any design to save it here.
          </p>
          <Link to="/shop" className="btn btn-primary-gold btn-sm mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A]">
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Saved jewellery pieces">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );

  if (isInsideAccount) {
    return content;
  }

  return (
    <div className="bg-white min-h-screen pt-14 lg:pt-[112px]">
      {/* Standalone Page Header */}
      <div className="bg-[#FAF6F0] border-b border-[#E8E2D9] py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#5C1A2E]">
            Saved Heirlooms
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2320] mt-1 font-medium">
            Your Personal Wishlist (<span className="tabular-nums">{wishlist.length}</span>)
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
        {content}
      </div>
    </div>
  );
}
