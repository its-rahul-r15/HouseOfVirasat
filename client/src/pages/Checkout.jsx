import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, Truck, Lock, CreditCard, Banknote, ArrowLeft, ArrowRight,
  AlertCircle, Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { orderApi } from '../api/order.api';
import { formatINR, formatPurity } from '../utils/formatters';

// ─────────────────────────────────────────────────────────
// Razorpay checkout script loader (deferred, no upfront load)
// ─────────────────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─────────────────────────────────────────────────────────
// Payment status badge for UI feedback
// ─────────────────────────────────────────────────────────
const PAYMENT_STATES = {
  idle: null,
  loading: 'loading',
  awaiting: 'awaiting',    // Razorpay modal is open
  verifying: 'verifying',  // Server-side sig verification
  failed: 'failed',
  dismissed: 'dismissed',  // User closed modal without paying
};

export default function Checkout() {
  const {
    items,
    subtotal,
    discountAmount,
    coupon,
    shippingCharge,
    isFreeShipping,
    total,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentState, setPaymentState] = useState(PAYMENT_STATES.idle);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    addressLine1: user?.addresses?.find(a => a.isDefault)?.addressLine1 || user?.addresses?.[0]?.addressLine1 || '',
    addressLine2: user?.addresses?.find(a => a.isDefault)?.addressLine2 || user?.addresses?.[0]?.addressLine2 || '',
    city: user?.addresses?.find(a => a.isDefault)?.city || user?.addresses?.[0]?.city || '',
    state: user?.addresses?.find(a => a.isDefault)?.state || user?.addresses?.[0]?.state || '',
    pincode: user?.addresses?.find(a => a.isDefault)?.pincode || user?.addresses?.[0]?.pincode || '',
    gstNumber: '',
    paymentMethod: 'ONLINE', // 'ONLINE' | 'COD'
  });

  // Keep form updated if user state loads after mount
  React.useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        mobile: prev.mobile || user.phone || '',
        email: prev.email || user.email || '',
        addressLine1: prev.addressLine1 || defaultAddr?.addressLine1 || '',
        addressLine2: prev.addressLine2 || defaultAddr?.addressLine2 || '',
        city: prev.city || defaultAddr?.city || '',
        state: prev.state || defaultAddr?.state || '',
        pincode: prev.pincode || defaultAddr?.pincode || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ──────────────────────────────────────────────────────
  // COD checkout — straight to server, no payment gateway
  // ──────────────────────────────────────────────────────
  const handleCOD = useCallback(async (payload) => {
    try {
      const res = await orderApi.checkout({ ...payload, paymentMethod: 'COD' });
      const ref = res?.data?.order?.referenceNumber || `HOV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      navigate(`/order-success/${ref}`, { state: { referenceNumber: ref } });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
      setPaymentState(PAYMENT_STATES.failed);
    }
  }, [clearCart, navigate]);

  // ──────────────────────────────────────────────────────
  // Razorpay online payment flow
  // ──────────────────────────────────────────────────────
  const handleRazorpay = useCallback(async (payload) => {
    // 1. Load Razorpay checkout.js
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMsg('Razorpay payment gateway could not be loaded. Check your connection and try again.');
      setPaymentState(PAYMENT_STATES.failed);
      return;
    }

    // 2. Create order on the server — amount is calculated SERVER-SIDE from product DB
    //    Client NEVER sends amount; server returns the razorpay order with the locked amount.
    let serverOrder;
    try {
      const res = await orderApi.checkout({ ...payload, paymentMethod: 'ONLINE' });
      serverOrder = res?.data;
    } catch (err) {
      setErrorMsg(err.message || 'Order creation failed. Please try again.');
      setPaymentState(PAYMENT_STATES.failed);
      return;
    }

    const razorpayOrder = serverOrder?.razorpayOrder;
    const internalOrder = serverOrder?.order;

    if (!razorpayOrder?.id) {
      setErrorMsg('Payment session could not be created. Please try again.');
      setPaymentState(PAYMENT_STATES.failed);
      return;
    }

    setPaymentState(PAYMENT_STATES.awaiting);

    // 3. Open Razorpay modal
    //    amount is READ FROM razorpayOrder (server-side) — never from client state.
    //    This prevents any client-side amount tampering.
    const rzpOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,           // In paise, from server — immutable
      currency: razorpayOrder.currency || 'INR',
      order_id: razorpayOrder.id,             // From server
      name: 'House of Virasat',
      description: `Order ${internalOrder?.referenceNumber || ''}`,
      image: '/virasat.png',
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.mobile,
      },
      notes: {
        internalOrderId: internalOrder?._id || '',
        referenceNumber: internalOrder?.referenceNumber || '',
      },
      theme: {
        color: '#B89768',
      },
      modal: {
        backdropclose: false, // Prevent accidental dismissal
        escape: false,
        handleback: true,
        confirm_close: true,
        ondismiss: async () => {
          // User closed modal without paying — notify server to release stock hold early
          setPaymentState(PAYMENT_STATES.dismissed);
          try {
            await orderApi.markPaymentFailed({
              razorpayOrderId: razorpayOrder.id,
              reason: 'user_dismissed',
            });
          } catch {
            // Non-critical — TTL cron will release the hold anyway
          }
        },
      },

      // ── SUCCESS HANDLER ──────────────────────────────────────────────────
      // Razorpay calls this with signature — we MUST verify server-side.
      // Do NOT trust this callback alone; the server re-validates the HMAC.
      handler: async (response) => {
        setPaymentState(PAYMENT_STATES.verifying);
        try {
          const verifyRes = await orderApi.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          const confirmedRef = verifyRes?.data?.referenceNumber
            || internalOrder?.referenceNumber
            || `HOV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

          clearCart();
          navigate(`/order-success/${confirmedRef}`, {
            state: { referenceNumber: confirmedRef, paymentId: response.razorpay_payment_id },
          });
        } catch (err) {
          // Signature mismatch or server error — show tamper/failure message
          setErrorMsg(
            err.message?.includes('tamper') || err.message?.includes('signature')
              ? 'Payment verification failed. If money was deducted, it will be refunded within 5-7 business days. Please contact support with your payment ID.'
              : 'Payment processing error. If money was deducted, please contact support.'
          );
          setPaymentState(PAYMENT_STATES.failed);
        }
      },
    };

    const rzp = new window.Razorpay(rzpOptions);

    // ── PAYMENT FAILURE HANDLER (gateway-level) ───────────────────────────
    rzp.on('payment.failed', async (response) => {
      const code = response.error?.code;
      const desc = response.error?.description || 'Payment failed';
      const reason = response.error?.reason || '';

      // Notify server to release the stock hold early
      try {
        await orderApi.markPaymentFailed({
          razorpayOrderId: razorpayOrder.id,
          reason: `${code}: ${desc}`,
        });
      } catch {
        // Non-critical
      }

      setErrorMsg(
        reason === 'payment_cancelled'
          ? 'Payment was cancelled. Your cart items are still saved — you can try again.'
          : `Payment failed: ${desc}. No money has been deducted. Please try again.`
      );
      setPaymentState(PAYMENT_STATES.failed);
    });

    rzp.open();
  }, [form, clearCart, navigate]);

  // ──────────────────────────────────────────────────────
  // Form submit — dispatches to the right handler
  // ──────────────────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setPaymentState(PAYMENT_STATES.loading);
    setErrorMsg(null);

    const isGuest = !user;
    const payload = {
      customer: {
        name: form.name,
        mobile: form.mobile.replace(/\D/g, '').slice(-10), // normalize to 10-digit
        email: form.email || (isGuest ? `guest_${Date.now()}@houseofvirasat.com` : user.email),
        guestCheckout: isGuest,
        userId: user ? (user._id || user.id) : undefined,
      },
      shippingAddress: {
        name: form.name,
        line1: form.addressLine1,
        line2: form.addressLine2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: 'India',
        phone: form.mobile,
      },
      items: items.map((item) => ({
        productId: item.product._id || item.product.id,
        sku: item.product.sku || 'HOV-JEWEL',
        qty: item.quantity,
        // NOTE: priceAtPurchase is intentionally NOT sent here.
        // The server fetches the price from the Product DB directly.
        // This prevents any client-side price manipulation.
      })),
      couponCode: coupon?.code || undefined,
      gstNumber: form.gstNumber || undefined,
    };

    if (form.paymentMethod === 'COD') {
      await handleCOD(payload);
    } else {
      await handleRazorpay(payload);
    }
  };

  const isProcessing = [
    PAYMENT_STATES.loading,
    PAYMENT_STATES.awaiting,
    PAYMENT_STATES.verifying,
  ].includes(paymentState);

  const getButtonLabel = () => {
    switch (paymentState) {
      case PAYMENT_STATES.loading: return 'Creating Order…';
      case PAYMENT_STATES.awaiting: return 'Complete Payment in Popup…';
      case PAYMENT_STATES.verifying: return 'Verifying Payment…';
      default:
        return form.paymentMethod === 'COD'
          ? `Confirm COD Order — ${formatINR(total)}`
          : `Pay ${formatINR(total)} Securely`;
    }
  };

  // ──────────────────────────────────────────────────────
  // Empty cart guard
  // ──────────────────────────────────────────────────────
  if (items.length === 0 && paymentState === PAYMENT_STATES.idle) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#1A1A1A]">Your shopping bag is empty</h2>
        <p className="text-xs text-[#6B7280] mt-2 mb-6">Add pieces to your bag before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary-gold btn-sm">
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">

        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 border-b border-[#E5E2DA]">
          <Link to="/" aria-label="House of Virasat — Home">
            <img
              src="/virasat.png"
              alt="House of Virasat"
              className="h-8 sm:h-12 md:h-16 w-auto max-w-[130px] sm:max-w-none object-contain block"
            />
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#2B7A4B] font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* ── Payment Error / Dismissed Banner ───────────────────────── */}
        {(paymentState === PAYMENT_STATES.failed || paymentState === PAYMENT_STATES.dismissed) && (
          <div role="alert" aria-live="polite" className="mt-6 p-4 border border-red-200 bg-red-50 rounded-xs flex items-start gap-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" aria-hidden="true" />
            <div>
              <strong className="block font-semibold">
                {paymentState === PAYMENT_STATES.dismissed ? 'Payment cancelled' : 'Payment failed'}
              </strong>
              <span className="text-xs">
                {errorMsg || (paymentState === PAYMENT_STATES.dismissed
                  ? 'You closed the payment window. Your cart is still saved. Try again when ready.'
                  : 'Something went wrong. Please retry or choose a different payment method.'
                )}
              </span>
              <button
                type="button"
                className="mt-2 text-xs font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-xs"
                onClick={() => { setPaymentState(PAYMENT_STATES.idle); setErrorMsg(null); }}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">

          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* 1. Contact Information */}
            <div className="bg-white p-6 sm:p-8 border border-[#E5E2DA] rounded-xs space-y-4">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-semibold pb-3 border-b border-[#E5E2DA]">
                1. Customer &amp; Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-name" className="input-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="checkout-name"
                    required
                    autoComplete="name"
                    placeholder="e.g. Maharani Devi"
                    value={form.name}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-mobile" className="input-label">Mobile Number (For Delivery Updates) *</label>
                  <input
                    type="tel"
                    name="mobile"
                    id="checkout-mobile"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    value={form.mobile}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-email" className="input-label">Email Address (For Tax Invoice) *</label>
                  <input
                    type="email"
                    name="email"
                    id="checkout-email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="devi@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 sm:p-8 border border-[#E5E2DA] rounded-xs space-y-4">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-semibold pb-3 border-b border-[#E5E2DA] text-balance">
                2. Insured Vault Delivery Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address1" className="input-label">House / Apartment / Street Address *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    id="checkout-address1"
                    required
                    autoComplete="address-line1"
                    placeholder="Flat / Villa / Street Name"
                    value={form.addressLine1}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address2" className="input-label">Landmark / Locality</label>
                  <input
                    type="text"
                    name="addressLine2"
                    id="checkout-address2"
                    autoComplete="address-line2"
                    placeholder="Near City Palace / Landmark"
                    value={form.addressLine2}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-city" className="input-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    id="checkout-city"
                    required
                    autoComplete="address-level2"
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-state" className="input-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    id="checkout-state"
                    required
                    autoComplete="address-level1"
                    placeholder="e.g. Maharashtra"
                    value={form.state}
                    onChange={handleChange}
                    className="input-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-pincode" className="input-label">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    id="checkout-pincode"
                    required
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={6}
                    spellCheck={false}
                    placeholder="400001"
                    value={form.pincode}
                    onChange={handleChange}
                    className="input-luxury tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label htmlFor="checkout-gstin" className="input-label">GSTIN (Optional for B2B Invoice)</label>
                  <input
                    type="text"
                    name="gstNumber"
                    id="checkout-gstin"
                    spellCheck={false}
                    placeholder="27AAAAA0000A1Z5"
                    value={form.gstNumber}
                    onChange={handleChange}
                    className="input-luxury uppercase font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 sm:p-8 border border-[#E5E2DA] rounded-xs space-y-4">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-semibold pb-3 border-b border-[#E5E2DA]">
                3. Payment Method
              </h3>
              <div className="flex flex-col gap-3">
                <label
                  id="payment-online-label"
                  className={`p-4 border rounded-xs flex items-center justify-between cursor-pointer transition-all ${
                    form.paymentMethod === 'ONLINE'
                      ? 'border-[#B89768] bg-[#F8F5EE]'
                      : 'border-[#E5E2DA] bg-white'
                  } ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      id="payment-online"
                      value="ONLINE"
                      checked={form.paymentMethod === 'ONLINE'}
                      onChange={handleChange}
                      className="accent-[#B89768]"
                      disabled={isProcessing}
                    />
                    <div>
                      <strong className="text-xs uppercase font-semibold text-[#1A1A1A] block">
                        Online Payment (UPI, Cards, Netbanking, Cred)
                      </strong>
                      <span className="text-[11px] text-[#6B7280]">
                        Instant confirmation via Razorpay Secure Gateway
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#B89768]" />
                </label>

                <label
                  id="payment-cod-label"
                  className={`p-4 border rounded-xs flex items-center justify-between cursor-pointer transition-all ${
                    form.paymentMethod === 'COD'
                      ? 'border-[#B89768] bg-[#F8F5EE]'
                      : 'border-[#E5E2DA] bg-white'
                  } ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      id="payment-cod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="accent-[#B89768]"
                      disabled={isProcessing}
                    />
                    <div>
                      <strong className="text-xs uppercase font-semibold text-[#1A1A1A] block">
                        Cash On Delivery / Courier Verification
                      </strong>
                      <span className="text-[11px] text-[#6B7280]">
                        Available for orders up to ₹ 50,000 across India
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-[#6B7280]" />
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 border border-[#E5E2DA] rounded-xs sticky top-24 space-y-6">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-semibold pb-3 border-b border-[#E5E2DA]">
                Order Summary ({items.length})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#E5E2DA] max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartKey} className="py-3 flex items-center gap-3 text-xs min-w-0">
                    <img
                      src={item.product?.heroImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'}
                      alt={item.product?.name || 'Jewellery'}
                      width="48"
                      height="56"
                      loading="lazy"
                      className="w-12 h-14 object-cover border border-[#E5E2DA] rounded-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif text-sm font-medium text-[#1A1A1A] truncate">
                        {item.product?.name}
                      </h5>
                      <span className="text-[11px] text-[#6B7280] tabular-nums">
                        Qty: {item.quantity} {item.size ? `· Size ${item.size}` : ''}
                      </span>
                    </div>
                    <span className="font-medium text-[#1A1A1A] tabular-nums shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#E5E2DA] text-xs text-[#6B7280]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1A1A1A] font-medium tabular-nums">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2B7A4B]">
                    <span>Coupon ({coupon?.code})</span>
                    <span className="tabular-nums">- {formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Pan-India Transit</span>
                  <span className="text-[#1A1A1A] font-medium tabular-nums">
                    {isFreeShipping ? <strong className="text-[#2B7A4B]">FREE</strong> : formatINR(shippingCharge)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E5E2DA] text-base font-semibold text-[#1A1A1A]">
                  <span>Total Payable</span>
                  <span className="text-[#B89768] tabular-nums">{formatINR(total)}</span>
                </div>
                <span className="text-[10.5px] text-[#9CA3AF] -mt-1">
                  Inclusive of 3% GST and BIS Hallmarking Certificate
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="checkout-submit-btn"
                disabled={isProcessing || !form.name || !form.mobile || !form.email || !form.addressLine1 || !form.city || !form.state || !form.pincode}
                className="w-full btn btn-primary-gold py-4 text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{getButtonLabel()}</span>
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>

              {form.paymentMethod === 'ONLINE' && (
                <p className="text-[10.5px] text-[#9CA3AF] text-center -mt-2 leading-relaxed">
                  Your payment amount is locked server-side. You will be redirected to Razorpay&apos;s secure payment window.
                </p>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89768]" />
                <span>100% Insured Delivery &amp; Tamper-Evident Packaging</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
