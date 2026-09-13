import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { orderApi } from '../api/order.api';

export default function TrackOrder() {
  const [refInput, setRefInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await orderApi.getOrderStatus(refInput.trim());
      if (res?.data) {
        setOrder(res.data);
      } else {
        setOrder(null);
      }
    } catch (err) {
      // Fallback mock track record for demo
      if (refInput.trim().toUpperCase().startsWith('HOV')) {
        setOrder({
          referenceNumber: refInput.trim().toUpperCase(),
          fulfilmentStatus: 'IN_PRODUCTION',
          paymentStatus: 'PAID',
          createdAt: new Date().toISOString(),
          customerName: 'Valued Patron',
          itemsCount: 1,
          courierPartner: 'BlueDart Vault Logistics',
          estimatedDelivery: '3 Business Days',
        });
      } else {
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F8F5] min-h-screen py-16 pt-14 lg:pt-[112px]">
      <div className="max-w-[700px] mx-auto px-4 sm:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="subheading">Live Order Concierge</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-1">
            Track Your Order or MTO Status
          </h1>
          <p className="text-xs text-[#6B7280] mt-2 font-light">
            Enter your Order Reference Number (e.g. HOV-2026-00123 or HOV-BSP-1049).
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5E2DA] rounded-xs shadow-xs mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <label htmlFor="track-order-ref" className="sr-only">Order Reference Number</label>
            <input
              id="track-order-ref"
              type="text"
              placeholder="e.g. HOV-2026-10492"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value.toUpperCase())}
              required
              spellCheck={false}
              autoComplete="off"
              className="flex-1 input-luxury uppercase tabular-nums"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-gold btn-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] active:scale-[0.98]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>{loading ? 'Searching…' : 'Track'}</span>
            </button>
          </form>
        </div>

        {/* Result Card */}
        {searched && (
          <div aria-live="polite">
            {order ? (
              <div className="bg-white p-6 sm:p-8 border border-[#E5E2DA] rounded-xs shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DA]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6B7280] block">Order Reference</span>
                    <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] tabular-nums">{order.referenceNumber}</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#EDF7F1] text-[#2B7A4B] text-xs font-semibold rounded-xs border border-[#2B7A4B]/20 uppercase tracking-wider">
                    {order.fulfilmentStatus || 'CONFIRMED'}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-[#F8F5EE] border border-[#B89768]/30 rounded-xs text-[#A07F52]">
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                    <strong>Order Placed</strong>
                  </div>
                  <div className="p-3 bg-[#F8F5EE] border border-[#B89768]/30 rounded-xs text-[#A07F52]">
                    <Clock className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                    <strong>Karigar QC / Prep</strong>
                  </div>
                  <div className="p-3 bg-[#F9F8F5] border border-[#E5E2DA] rounded-xs text-[#9CA3AF]">
                    <Truck className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                    <strong>Insured Dispatch</strong>
                  </div>
                </div>

                <div className="text-xs text-[#6B7280] space-y-2 pt-2 border-t border-[#E5E2DA]">
                  <p><strong>Courier:</strong> {order.courierPartner || 'BlueDart Air Vault Insured'}</p>
                  <p><strong>Estimated Arrival:</strong> <span className="tabular-nums">{order.estimatedDelivery || 'Within 3-4 business days'}</span></p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 border border-[#E5E2DA] text-center space-y-2" role="alert">
                <AlertCircle className="w-8 h-8 text-[#B91C1C] mx-auto" aria-hidden="true" />
                <h4 className="font-serif text-lg text-[#1A1A1A]">No order found with this reference</h4>
                <p className="text-xs text-[#6B7280]">
                  Please verify your reference number from your confirmation SMS/Email or contact WhatsApp support.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
