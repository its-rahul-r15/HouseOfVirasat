import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#1A1A1A] text-[#F3F2EE] border-t border-[#2A2A2A] pt-16 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Trust Markers Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-[#2A2A2A]">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <ShieldCheck className="w-6 h-6 text-[#B89768] stroke-[1.5]" />
            <h4 className="font-serif text-lg text-white">BIS Hallmarked Purity</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              100% Certified 925 Silver and Government-inspected 14K/18K/22K Gold.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <Sparkles className="w-6 h-6 text-[#B89768] stroke-[1.5]" />
            <h4 className="font-serif text-lg text-white">Jaipur Karigari</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Heirloom Polki, Jadau & Kundan handcrafted by multi-generational artisans.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <Truck className="w-6 h-6 text-[#B89768] stroke-[1.5]" />
            <h4 className="font-serif text-lg text-white">Insured Pan-India Transit</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Tamper-evident sealed packaging with 100% transit insurance.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <FaWhatsapp style={{fontSize:'24px', color:'#B89768'}} />
            <h4 className="font-serif text-lg text-white">Direct Karigar Concierge</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Speak directly with our jewellery consultants on WhatsApp for bespoke orders.
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-[#2A2A2A]">

          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link to="/" aria-label="House of Virasat — Home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] rounded-sm self-start">
              <img
                src="/virasat.png"
                alt="House of Virasat"
                width="180"
                height="120"
                style={{ height: '120px', width: 'auto', objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)', opacity: 0.92 }}
              />
            </Link>
            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-[340px]">
              Born in the historic lanes of Jaipur, House of Virasat bridges royal Rajasthani karigari with modern understated luxury. Every piece is an heirloom in waiting.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppLink({ phoneNumber: settings.whatsappNumber })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-[#B89768] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] transition-colors"
                aria-label="Inquire on WhatsApp Concierge"
              >
                <FaWhatsapp style={{fontSize:'16px'}} aria-hidden="true" />
                Inquire on WhatsApp Concierge
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h5 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B89768]">
              Heirloom Collections
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#9CA3AF]">
              <li>
                <Link to="/shop?collection=REET" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Reet — Bridal & Heritage Jadau
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=RAJSI" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Rajsi — Uncut Polki & Kundan
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=NITYA" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Nitya — Everyday Fine Gold
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=ROOP" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Roop — Statement 925 Silver
                </Link>
              </li>
              <li>
                <Link to="/bespoke" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors text-[#F3F2EE] font-medium">
                  Bespoke Made-to-Order Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care & Authenticity */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h5 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B89768]">
              Client Concierge
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#9CA3AF]">
              <li>
                <Link to="/track-order" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Track Order / MTO Reference
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Our Artisans & Heritage
                </Link>
              </li>
              <li>
                <Link to="/policies#hallmark" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  BIS Hallmarking & Silver 925 Purity
                </Link>
              </li>
              <li>
                <Link to="/policies#shipping" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Shipping, Insurance & Delivery
                </Link>
              </li>
              <li>
                <Link to="/policies#care" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">
                  Fine Jewellery Care Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier & Studio Address */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h5 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B89768]">
              Atelier &amp; Studio
            </h5>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              House of Virasat<br />
              Pitambari Niwas, Lal Bazar<br />
              Bettiah, Bihar — 845438
            </p>
            <p className="text-xs text-[#9CA3AF] pt-1">
              Mon – Sat: 11:00 AM – 7:30 PM IST
            </p>
          </div>

        </div>

        {/* Copyright & Signoff */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280]">
          <p>© {new Date().getFullYear()} House of Virasat. All rights reserved. 100% Authentic Indian Karigari.</p>
          <div className="flex items-center gap-6">
            <Link to="/policies#terms" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">Terms of Service</Link>
            <Link to="/policies#privacy" className="hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
