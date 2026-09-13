import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

/**
 * StatusPill — displays product availability status
 * States: IN_STOCK | MADE_TO_ORDER | SOLD_OUT
 * Per spec §4 & §10: subtle gold/ivory pill for in stock, outlined text badge for MTO,
 * greyed label for sold out.
 */
export default function StatusPill({ status, className = '' }) {
  if (!status) return null;

  const s = status.toUpperCase();

  if (s === 'IN_STOCK' || s === 'SINGLE_PIECE') {
    return (
      <span
        className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold bg-[#FAF6F0] text-[#7A5C2E] border border-[#D4B884]/50 ${className}`}
      >
        <CheckCircle className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
        {s === 'SINGLE_PIECE' ? 'Single Piece' : 'In Stock'}
      </span>
    );
  }

  if (s === 'MADE_TO_ORDER' || s === 'MTO') {
    return (
      <span
        className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold bg-transparent text-[#5C1A2E] border border-[#5C1A2E]/50 ${className}`}
      >
        <Clock className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
        Made to Order
      </span>
    );
  }

  if (s === 'SOLD_OUT' || s === 'OUT_OF_STOCK') {
    return (
      <span
        className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold bg-[#F3F2EE] text-[#9CA3AF] border border-[#E5E2DA] ${className}`}
      >
        <XCircle className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
        Sold Out
      </span>
    );
  }

  return null;
}
