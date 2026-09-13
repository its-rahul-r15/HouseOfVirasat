import React from 'react';
import { formatINR } from '../../utils/formatters';

/**
 * PriceDisplay — renders the correct price format per priceMode enum
 * Modes: FIXED | STARTING_FROM | ESTIMATED | ON_REQUEST
 * Per spec §10 & functional spec price-display-mode logic.
 */
export default function PriceDisplay({ product, size = 'md', className = '' }) {
  if (!product) return null;

  const { priceMode, sellingPrice, compareAtPrice, mrp } = product;
  const price = sellingPrice || mrp || 0;

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-2xl sm:text-3xl',
  };

  const priceText = textSizes[size] ?? textSizes.md;

  if (priceMode === 'ON_REQUEST') {
    return (
      <span
        className={`inline-block text-xs uppercase tracking-[0.16em] font-medium text-[#B8935A] ${className}`}
      >
        Price Upon Request
      </span>
    );
  }

  if (priceMode === 'ESTIMATED') {
    return (
      <div className={`flex flex-col gap-0.5 tabular-nums ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">
          Est. Starting From
        </span>
        <span className={`font-serif font-semibold text-[#2B2320] ${priceText}`}>
          {formatINR(price)}
        </span>
      </div>
    );
  }

  if (priceMode === 'STARTING_FROM') {
    return (
      <div className={`flex items-baseline gap-1.5 tabular-nums ${className}`}>
        <span className="text-xs text-[#6B7280]">From</span>
        <span className={`font-serif font-semibold text-[#2B2320] ${priceText}`}>
          {formatINR(price)}
        </span>
      </div>
    );
  }

  // FIXED (default)
  return (
    <div className={`flex items-baseline gap-2 tabular-nums ${className}`}>
      <span className={`font-serif font-semibold text-[#2B2320] ${priceText}`}>
        {formatINR(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-xs text-[#9CA3AF] line-through">
          {formatINR(compareAtPrice)}
        </span>
      )}
    </div>
  );
}

