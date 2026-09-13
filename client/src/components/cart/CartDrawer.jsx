import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Drawer from '../ui/Drawer';
import CartItem from './CartItem';
import FreeShippingMeter from './FreeShippingMeter';
import CouponBox from './CouponBox';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    coupon,
    setCoupon,
    isFreeShipping,
    shippingCharge,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    total,
    totalItemCount,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title={`Your Shopping Bag (${totalItemCount})`}
      width="max-w-[460px]"
    >
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F9F8F5] border border-[#E5E2DA] flex items-center justify-center text-[#9CA3AF]">
            <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h4 className="font-serif text-2xl text-[#1A1A1A]">Your bag is empty</h4>
          <p className="text-xs text-[#6B7280] max-w-[260px] leading-relaxed">
            Explore our handcrafted collections of 925 Silver Polki and Fine Gold Heirlooms.
          </p>
          <button
            type="button"
            onClick={() => {
              closeCart();
              navigate('/shop');
            }}
            className="mt-2 btn btn-primary-gold btn-sm"
          >
            Explore Catalogue
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-6">
          {/* Scrollable Top Section */}
          <div className="flex flex-col gap-5">
            {/* Free Shipping Meter */}
            <FreeShippingMeter
              subtotal={subtotal}
              threshold={freeShippingThreshold}
              amountNeeded={amountNeededForFreeShipping}
              isFreeShipping={isFreeShipping}
            />

            {/* Line Items List */}
            <div className="flex flex-col divide-y divide-[#E5E2DA]">
              {items.map((item) => (
                <CartItem
                  key={item.cartKey}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Coupon Code Box */}
            <CouponBox
              subtotal={subtotal}
              coupon={coupon}
              setCoupon={setCoupon}
            />
          </div>

          {/* Bottom Sticky Summary & Checkout */}
          <div className="pt-4 border-t border-[#E5E2DA] flex flex-col gap-4 bg-white">
            {/* Breakup */}
            <div className="flex flex-col gap-2 text-xs text-[#6B7280]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1A1A1A] font-medium tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2B7A4B]">
                  <span>Promotional Discount</span>
                  <span className="tabular-nums">- {formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Pan-India Transit</span>
                <span className="text-[#1A1A1A] font-medium tabular-nums">
                  {isFreeShipping ? (
                    <span className="text-[#2B7A4B] font-semibold">FREE</span>
                  ) : (
                    formatINR(shippingCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E2DA] text-base font-semibold text-[#1A1A1A]">
                <span>Total Amount</span>
                <span className="text-[#B89768] tabular-nums">{formatINR(total)}</span>
              </div>
              <span className="text-[10.5px] text-[#9CA3AF] -mt-1">
                Inclusive of 3% GST &amp; BIS Hallmarking Certification
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full btn btn-primary-gold flex items-center justify-center gap-2 py-3.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="text-xs text-[#6B7280] hover:text-[#1A1A1A] text-center uppercase tracking-wider py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A] rounded-xs"
              >
                Continue Browsing
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B89768]" aria-hidden="true" />
              <span>100% Insured Delivery · 15-Day Exchange Guarantee</span>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
