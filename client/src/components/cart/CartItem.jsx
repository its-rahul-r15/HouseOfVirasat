import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatINR, formatPurity } from '../../utils/formatters';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, size, quantity, price, cartKey } = item;

  const image =
    product?.heroImage ||
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="flex gap-4 py-4 border-b border-[#E5E2DA] font-sans">
      {/* Thumbnail */}
      <div className="w-20 h-24 bg-[#F9F8F5] border border-[#E5E2DA] overflow-hidden shrink-0 rounded-xs">
        <img
          src={image}
          alt={product?.name || 'Handcrafted Jewellery'}
          width="80"
          height="96"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif text-base font-medium text-[#1A1A1A] truncate">
              {product?.name || 'Handcrafted Jewellery'}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(cartKey)}
              className="p-1 text-[#9CA3AF] hover:text-[#B91C1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B91C1C] rounded-xs shrink-0"
              aria-label={`Remove ${product?.name || 'item'} from bag`}
            >
              <Trash2 className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#6B7280]">
            <span>{formatPurity(product?.metalType, product?.purity)}</span>
            {size && (
              <>
                <span>·</span>
                <span>Size: <strong className="text-[#1A1A1A]">{size}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between pt-2">
          {/* Stepper */}
          <div className="flex items-center border border-[#E5E2DA] rounded-xs bg-white">
            <button
              type="button"
              onClick={() => onUpdateQuantity(cartKey, -1)}
              className="p-1.5 text-[#6B7280] hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5C1A2E]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" aria-hidden="true" />
            </button>
            <span className="px-2.5 text-xs font-semibold text-[#1A1A1A] min-w-[24px] text-center tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(cartKey, 1)}
              className="p-1.5 text-[#6B7280] hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5C1A2E]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          {/* Line Total */}
          <span className="text-sm font-semibold text-[#1A1A1A] tabular-nums">
            {formatINR(price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
