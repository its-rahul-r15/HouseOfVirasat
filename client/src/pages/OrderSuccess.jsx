import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Truck, ShieldCheck, MessageCircle, ArrowRight, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function OrderSuccess() {
  const { ref } = useParams();
  const location = useLocation();
  const { settings } = useSettings();
  const orderRef = ref || location.state?.referenceNumber || 'HOV-2026-88391';

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#B89768', '#5A1E24', '#8E959D'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="bg-[#F9F8F5] min-h-screen py-16">
      <div className="max-w-[720px] mx-auto px-4 text-center">
        
        <div className="bg-white p-8 sm:p-12 border border-[#E5E2DA] rounded-xs shadow-xs flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
          
          <div className="w-16 h-16 rounded-full bg-[#EDF7F1] border border-[#2B7A4B]/20 flex items-center justify-center text-[#2B7A4B]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#B89768] font-semibold">
              Order Confirmed & Certified
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-medium mt-1">
              Thank You for Your Order
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto mt-2 leading-relaxed font-light">
              Your heirloom is being prepared in our Jaipur atelier with tamper-proof security packaging and full transit insurance.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="p-4 bg-[#F9F8F5] border border-[#E5E2DA] rounded-xs w-full max-w-md">
            <span className="text-[11px] text-[#6B7280] uppercase tracking-wider block">
              Order Reference Number:
            </span>
            <strong className="font-serif text-2xl text-[#1A1A1A] tracking-wider block mt-0.5">
              {orderRef}
            </strong>
          </div>

          {/* Trust Markers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left text-xs text-[#4A5568] pt-2">
            <div className="p-4 bg-[#F9F8F5] border border-[#E5E2DA] rounded-xs flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#B89768] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A] font-semibold">Insured Dispatch</strong>
                <span>Dispatches in 24-48 hours via BlueDart Air Vault.</span>
              </div>
            </div>

            <div className="p-4 bg-[#F9F8F5] border border-[#E5E2DA] rounded-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#B89768] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A] font-semibold">BIS Hallmark Guarantee</strong>
                <span>Includes physical certificate of authenticity.</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
            <a
              href={getWhatsAppLink({
                phoneNumber: settings.whatsappNumber,
                customMessage: `Namaste House of Virasat, I placed Order *${orderRef}*. Could you please send me tracking updates?`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp flex-1 flex items-center justify-center gap-2 py-3"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Track via WhatsApp</span>
            </a>

            <Link to="/shop" className="btn btn-outline flex-1 py-3 text-center">
              Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
