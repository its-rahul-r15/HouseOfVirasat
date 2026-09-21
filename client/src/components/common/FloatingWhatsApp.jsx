import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  const whatsappUrl = getWhatsAppLink({
    phoneNumber: settings.whatsappNumber,
    customMessage: 'Namaste House of Virasat! I would like to inquire about your jewellery collections.',
  });

  return (
    <aside aria-label="WhatsApp Concierge" className="hidden md:block fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with House of Virasat on WhatsApp"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <FaWhatsapp style={{fontSize:'32px'}} aria-hidden="true" />
        
        {/* Tooltip on hover */}
        <span aria-hidden="true" className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#2B2320] text-white text-xs font-semibold py-1.5 px-3 rounded-xs whitespace-nowrap shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          Chat with Jewellery Expert
        </span>
      </a>
    </aside>
  );
}
