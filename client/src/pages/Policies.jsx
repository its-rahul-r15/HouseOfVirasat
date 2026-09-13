import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export default function Policies() {
  return (
    <div className="bg-white min-h-screen py-16 font-sans">
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 space-y-12">
        
        <div className="text-center pb-8 border-b border-[#E5E2DA]">
          <span className="subheading">Client Transparency</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] mt-1">
            Store Policies & Purity Standards
          </h1>
        </div>

        {/* Section 1: Hallmarking */}
        <div id="hallmark" className="space-y-4 pt-4">
          <div className="flex items-center gap-3 text-[#1A1A1A]">
            <ShieldCheck className="w-6 h-6 text-[#B89768]" />
            <h2 className="font-serif text-2xl font-semibold">1. BIS Hallmarking & Purity Guarantee</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            All gold jewellery manufactured and sold by House of Virasat is hallmarked by Bureau of Indian Standards (BIS) certified assaying centres. All 925 silver creations carry the laser-etched 925 purity mark alongside our master craftsman mark.
          </p>
        </div>

        {/* Section 2: Shipping */}
        <div id="shipping" className="space-y-4 pt-4 border-t border-[#E5E2DA]">
          <div className="flex items-center gap-3 text-[#1A1A1A]">
            <Truck className="w-6 h-6 text-[#B89768]" />
            <h2 className="font-serif text-2xl font-semibold">2. Insured Pan-India Shipping & Vault Delivery</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            Every shipment is 100% insured against loss, theft, or transit damage until the moment it reaches your doorstep. Packages are sealed in tamper-evident security bags and dispatched via specialized couriers (BlueDart Apex / Sequel Logistics).
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-[#4A5568] space-y-1.5 pl-2">
            <li><strong>In-Stock Designs:</strong> Dispatched in 24-48 business hours; delivery in 3-5 days.</li>
            <li><strong>Made-to-Order / Bespoke Pieces:</strong> Production takes 14-21 days depending on karigari intricacy.</li>
          </ul>
        </div>

        {/* Section 3: Returns & Exchange */}
        <div id="returns" className="space-y-4 pt-4 border-t border-[#E5E2DA]">
          <div className="flex items-center gap-3 text-[#1A1A1A]">
            <RotateCcw className="w-6 h-6 text-[#B89768]" />
            <h2 className="font-serif text-2xl font-semibold">3. 15-Day Exchange & Lifetime Buyback</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            We offer a hassle-free 15-day exchange policy on unworn ready-to-ship jewellery with original tags and hallmark certificates intact. Bespoke and custom-engraved pieces are crafted specifically for you and cannot be returned, but remain eligible for lifetime resizing and repair.
          </p>
        </div>

        {/* Section 4: Care Guide */}
        <div id="care" className="space-y-4 pt-4 border-t border-[#E5E2DA]">
          <div className="flex items-center gap-3 text-[#1A1A1A]">
            <Sparkles className="w-6 h-6 text-[#B89768]" />
            <h2 className="font-serif text-2xl font-semibold">4. Fine Jewellery Care Guide</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            To ensure your Polki and silver heirlooms maintain their royal lustre for generations:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-[#4A5568] space-y-1.5 pl-2">
            <li>Apply all perfumes, hairsprays, and cosmetics before wearing your jewellery.</li>
            <li>Avoid exposing uncut Polki and Kundan directly to water or moisture.</li>
            <li>Store each piece individually in the velvet zip pouch provided.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
