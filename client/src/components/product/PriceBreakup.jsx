import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { calculateTransparentBreakup } from '../../utils/priceCalculator';
import { formatINR } from '../../utils/formatters';

export default function PriceBreakup({ product }) {
  const { settings } = useSettings();
  const breakup = calculateTransparentBreakup(
    product,
    settings.goldRate24k || 7300,
    settings.silverRate925 || 88
  );

  if (!breakup) return null;

  return (
    <div className="bg-[#F9F8F5] p-5 border border-[#E5E2DA] rounded-sm flex flex-col gap-4 font-sans text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA]">
        <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#B89768]" aria-hidden="true" />
          <span>Transparent Price Breakup</span>
        </div>
        <span className="text-[11px] text-[#6B7280] tabular-nums">
          Rate: {breakup.purityLabel} @ {formatINR(breakup.metalRatePerGram)}/g
        </span>
      </div>

      <div className="flex flex-col gap-2 text-[#4A5568]">
        {/* Metal Cost */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span>Precious Metal Value</span>
            <span className="text-[11px] text-[#9CA3AF] tabular-nums">
              ({breakup.netWeight}g net)
            </span>
          </div>
          <span className="font-medium text-[#1A1A1A] tabular-nums">
            {formatINR(breakup.estimatedMetalCost)}
          </span>
        </div>

        {/* Gemstones / Polki Cost */}
        {breakup.estimatedStoneCost > 0 && (
          <div className="flex justify-between items-center">
            <span>Polki / Gemstone Value</span>
            <span className="font-medium text-[#1A1A1A] tabular-nums">
              {formatINR(breakup.estimatedStoneCost)}
            </span>
          </div>
        )}

        {/* Karigari / Making Charges */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span>Jaipur Karigari & Craftsmanship</span>
          </div>
          <span className="font-medium text-[#1A1A1A] tabular-nums">
            {formatINR(breakup.makingCharges)}
          </span>
        </div>

        {/* Pre-tax */}
        <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#D1CCC0]">
          <span className="text-[#6B7280]">Subtotal (Pre-tax)</span>
          <span className="font-medium text-[#1A1A1A] tabular-nums">
            {formatINR(breakup.preTaxTotal)}
          </span>
        </div>

        {/* GST */}
        <div className="flex justify-between items-center">
          <span className="text-[#6B7280]">Applicable GST ({breakup.gstRate}%)</span>
          <span className="font-medium text-[#1A1A1A] tabular-nums">
            {formatINR(breakup.gstAmount)}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-[#E5E2DA] text-sm font-semibold text-[#1A1A1A]">
          <span>Final Certified Price</span>
          <span className="text-[#B89768] tabular-nums font-bold">
            {formatINR(breakup.finalPrice)}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-[#9CA3AF] pt-1">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Price includes BIS hallmarking verification, insured vault delivery, and luxury wooden gift box.</span>
      </div>
    </div>
  );
}
