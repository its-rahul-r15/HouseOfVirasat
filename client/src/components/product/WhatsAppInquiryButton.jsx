import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export default function WhatsAppInquiryButton({ product, bespokeId, label = 'Inquire on WhatsApp', className = '' }) {
  const { settings } = useSettings();
  const link = getWhatsAppLink({
    phoneNumber: settings.whatsappNumber,
    product,
    bespokeId,
  });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#25D366] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-xs hover:bg-[#1EBE5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] active:scale-[0.98] transition-all ${className}`}
    >
      <MessageCircle className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
