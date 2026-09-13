import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function FreeShippingMeter({ subtotal, threshold = 5000, amountNeeded, isFreeShipping }) {
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-[#F9F8F5] p-3.5 border border-[#E5E2DA] rounded-xs font-sans text-xs">
      <div className="flex items-center gap-2 mb-2 font-medium text-[#1A1A1A]">
        {isFreeShipping ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#2B7A4B]" />
            <span className="text-[#2B7A4B]">You unlocked <strong>Free Insured Shipping</strong> across India!</span>
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 text-[#B89768]" />
            <span>Add <strong>{formatINR(amountNeeded)}</strong> more for Free Insured Transit</span>
          </>
        )}
      </div>

      <div className="w-full bg-[#E5E2DA] h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isFreeShipping ? 'bg-[#2B7A4B]' : 'bg-[#B89768]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
