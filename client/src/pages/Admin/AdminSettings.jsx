import React, { useState } from 'react';
import {
  Coins,
  Save,
  Check,
  Phone,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    goldRate24k: settings?.goldRate24k || 7350,
    goldRate18k: settings?.goldRate18k || 5550,
    silverRate925: settings?.silverRate925 || 89,
    whatsappNumber: settings?.whatsappNumber || '+919876543210',
    freeShippingThreshold: settings?.freeShippingThreshold || 5000,
    gstRate: settings?.gstRate || 3,
    invoicePrefix: settings?.invoicePrefix || 'HOV-INV',
    codEnabled: settings?.codEnabled || false,
    codMaxOrderValue: settings?.codMaxOrderValue || 50000,
    guestCheckoutEnabled: settings?.guestCheckoutEnabled !== undefined ? settings.guestCheckoutEnabled : true,
    paymentGatewayMode: settings?.paymentGatewayMode || 'test',
  });

  // Sync with settings if loaded asynchronously
  React.useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings,
        guestCheckoutEnabled: settings.guestCheckoutEnabled !== undefined ? settings.guestCheckoutEnabled : prev.guestCheckoutEnabled,
        codMaxOrderValue: settings.codMaxOrderValue || prev.codMaxOrderValue,
      }));
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateSettings) {
      updateSettings(formData);
    }
    setSuccessMsg('Master settings and live precious metal rates updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Global Configuration
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Store Settings & Precious Metal Rates
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {successMsg && (
        <div role="status" aria-live="polite" className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2 animate-[fadeIn_0.15s_ease]">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* ── 1. Live Precious Metal Rates ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D9]">
            <Coins className="w-4 h-4 text-[#B8935A]" aria-hidden="true" />
            <h3 className="font-serif text-base font-semibold text-[#2B2320]">
              Daily Precious Metal Benchmark Rates (Per Gram)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="rate-gold-24k" className="block font-semibold text-[#2B2320] mb-1">
                Gold 24K (999 Purity) Rate (₹/g) *
              </label>
              <input
                type="number"
                id="rate-gold-24k"
                required
                value={formData.goldRate24k}
                onChange={(e) => setFormData({ ...formData, goldRate24k: Number(e.target.value) })}
                className="w-full px-3 py-2 font-mono tabular-nums text-sm border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
              <span className="text-[10.5px] text-[#6B7280] mt-1 block tabular-nums">
                22K Auto-calculated: ₹{Math.round(formData.goldRate24k * 22 / 24)}/g
              </span>
            </div>

            <div>
              <label htmlFor="rate-gold-18k" className="block font-semibold text-[#2B2320] mb-1">
                Gold 18K (750 Hallmark) Rate (₹/g) *
              </label>
              <input
                type="number"
                id="rate-gold-18k"
                required
                value={formData.goldRate18k}
                onChange={(e) => setFormData({ ...formData, goldRate18k: Number(e.target.value) })}
                className="w-full px-3 py-2 font-mono tabular-nums text-sm border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label htmlFor="rate-silver-925" className="block font-semibold text-[#2B2320] mb-1">
                Silver 925 (Sterling) Rate (₹/g) *
              </label>
              <input
                type="number"
                id="rate-silver-925"
                required
                value={formData.silverRate925}
                onChange={(e) => setFormData({ ...formData, silverRate925: Number(e.target.value) })}
                className="w-full px-3 py-2 font-mono tabular-nums text-sm border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>
          </div>
        </div>

        {/* ── 2. WhatsApp Concierge & Support ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D9]">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <h3 className="font-serif text-base font-semibold text-[#2B2320]">
              WhatsApp Concierge & Communication
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-whatsapp" className="block font-semibold text-[#2B2320] mb-1">
                Concierge WhatsApp Number (with country code) *
              </label>
              <input
                type="text"
                id="settings-whatsapp"
                required
                autoComplete="tel"
                inputMode="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+919876543210"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
              <span className="text-[10.5px] text-[#6B7280] mt-1 block">
                Used for all 1-tap bespoke inquiries, floating button, and order confirmations.
              </span>
            </div>

            <div>
              <label htmlFor="settings-invoice-prefix" className="block font-semibold text-[#2B2320] mb-1">
                GST Invoice Prefix
              </label>
              <input
                type="text"
                id="settings-invoice-prefix"
                spellCheck={false}
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                placeholder="HOV-INV"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>
          </div>
        </div>

        {/* ── 3. Shipping & Payment Gateways ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D9]">
            <Truck className="w-4 h-4 text-[#5C1A2E]" aria-hidden="true" />
            <h3 className="font-serif text-base font-semibold text-[#2B2320]">
              Fulfilment Thresholds &amp; Commercial Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="settings-free-shipping" className="block font-semibold text-[#2B2320] mb-1">
                Free Insured Shipping Threshold (₹)
              </label>
              <input
                type="number"
                id="settings-free-shipping"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 font-mono tabular-nums border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label htmlFor="settings-gst-rate" className="block font-semibold text-[#2B2320] mb-1">
                Jewellery GST Tax Rate (%)
              </label>
              <input
                type="number"
                id="settings-gst-rate"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                className="w-full px-3 py-2 font-mono tabular-nums border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label htmlFor="settings-gateway-mode" className="block font-semibold text-[#2B2320] mb-1">
                Payment Gateway Mode
              </label>
              <select
                id="settings-gateway-mode"
                value={formData.paymentGatewayMode}
                onChange={(e) => setFormData({ ...formData, paymentGatewayMode: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              >
                <option value="test">Test Mode (Sandbox)</option>
                <option value="live">Live Production (Razorpay)</option>
              </select>
            </div>
          </div>

          {/* Guest Checkout Policy */}
          <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
            <h4 className="font-semibold text-[#2B2320]">Security & Checkout Policy</h4>
            <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs">
              <input
                type="checkbox"
                id="guestCheckoutToggle"
                checked={formData.guestCheckoutEnabled}
                onChange={(e) => setFormData({ ...formData, guestCheckoutEnabled: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-[#5C1A2E] border-[#D1CCC4] rounded focus:ring-[#5C1A2E]"
              />
              <label htmlFor="guestCheckoutToggle" className="cursor-pointer select-none">
                <span className="font-semibold text-[#2B2320] block">
                  Allow Guest Checkout (Without Login)
                </span>
                <span className="text-[11px] text-[#6B7280] block mt-0.5">
                  {formData.guestCheckoutEnabled
                    ? 'Customers can place orders directly as guests or by logging in.'
                    : 'Mandatory Login: Customers must register/sign in before they can access checkout and make purchases.'}
                </span>
              </label>
            </div>
          </div>

          {/* Cash on Delivery Configuration */}
          <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
            <h4 className="font-semibold text-[#2B2320]">Cash On Delivery (COD) Rules</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.codEnabled}
                  onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
                  className="w-4 h-4 text-[#5C1A2E] border-[#D1CCC4] rounded"
                />
                <span className="text-xs text-[#2B2320] font-medium">
                  Enable Cash on Delivery (COD) for eligible cart values
                </span>
              </label>

              {formData.codEnabled && (
                <div className="pl-6 pt-1 max-w-xs">
                  <label className="block font-semibold text-[#2B2320] mb-1">
                    Maximum COD Order Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.codMaxOrderValue}
                    onChange={(e) => setFormData({ ...formData, codMaxOrderValue: Number(e.target.value) })}
                    placeholder="50000"
                    className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                  <span className="text-[10.5px] text-[#6B7280] mt-1 block">
                    Orders exceeding ₹{Number(formData.codMaxOrderValue || 0).toLocaleString('en-IN')} will require online payment.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Save */}
        <div className="flex justify-end pt-4 border-t border-[#E8E2D9]">
          <button type="submit" className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs">
            <Save className="w-4 h-4" />
            <span>Save Master Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
