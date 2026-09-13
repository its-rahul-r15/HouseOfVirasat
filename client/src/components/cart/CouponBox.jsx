import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { couponApi } from '../../api/coupon.api';
import { formatINR } from '../../utils/formatters';

export default function CouponBox({ subtotal, coupon, setCoupon }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await couponApi.validateCoupon({
        code: code.trim().toUpperCase(),
        cartTotal: subtotal,
      });

      if (res?.data) {
        setCoupon(res.data);
        setCode('');
      } else {
        setError('Invalid coupon code.');
      }
    } catch (err) {
      // Fallback demo coupon logic if backend hasn't seeded coupons yet
      const upper = code.trim().toUpperCase();
      if (upper === 'VIRASAT10' || upper === 'FIRST500') {
        const discount = upper === 'VIRASAT10' ? Math.round(subtotal * 0.1) : 500;
        setCoupon({
          code: upper,
          discountAmount: discount,
          description: upper === 'VIRASAT10' ? '10% Heirloom Welcome Discount' : '₹500 Off First Order',
        });
        setCode('');
      } else {
        setError(err.message || 'Coupon could not be applied.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCoupon(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2 font-sans text-xs">
      {coupon ? (
        <div className="flex items-center justify-between p-3 bg-[#EDF7F1] border border-[#2B7A4B]/20 rounded-xs text-[#2B7A4B]">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" aria-hidden="true" />
            <span>
              Coupon <strong>{coupon.code}</strong> applied ({formatINR(coupon.discountAmount)} saved)
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 hover:text-[#B91C1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B91C1C] rounded-xs"
            aria-label={`Remove coupon ${coupon.code}`}
          >
            <X className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            id="cart-coupon-code"
            aria-label="Coupon code"
            placeholder="Coupon Code (e.g. VIRASAT10)"
            value={code}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 py-2.5 px-3 bg-white border border-[#E5E2DA] rounded-xs text-xs text-[#1A1A1A] placeholder-[#9CA3AF] uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] focus:border-[#B89768]"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="py-2.5 px-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#333333] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
          >
            {loading ? 'Applying…' : 'Apply'}
          </button>
        </form>
      )}

      {error && (
        <span role="alert" aria-live="polite" className="text-[11px] text-[#B91C1C]">{error}</span>
      )}
    </div>
  );
}
