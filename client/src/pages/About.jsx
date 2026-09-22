import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Hammer,
  Gem,
  ArrowRight,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  HeartHandshake,
  PhoneCall,
  Flame,
  Scale,
  Layers,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function About() {
  const { settings } = useSettings();
  const whatsappUrl = getWhatsAppLink({
    phoneNumber: settings?.whatsappNumber || '9188292882905',
    customMessage: 'Namaste House of Virasat! I read the story of your atelier and would like to learn more about your heirloom pieces.',
  });

  return (
    <div className="bg-[#FAF8F5] text-[#241B16] min-h-screen font-sans pt-14 lg:pt-[112px] selection:bg-[#E8DECF] selection:text-[#1A1A1A]">

      {/* ── 1. EDITORIAL HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-[#1A0B12] text-white py-20 sm:py-28 px-4 sm:px-8 overflow-hidden border-b border-[#3D1E28]">
        {/* Subtle royal background glow and textures */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(184,147,90,0.18),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-[1000px] mx-auto text-center relative z-10 space-y-5">
          {/* Eyebrow with royal separator */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-white/40" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-white">
              House of Virasat · Atelier &amp; Heritage
            </span>
            <span className="w-8 h-[1px] bg-white/40" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight text-white max-w-[850px] mx-auto text-balance" style={{ color: '#ffffff' }}>
            Where Every Jewel Is Born <br className="hidden sm:inline" />
            <span className="italic font-serif text-white block sm:inline" style={{ color: '#ffffff' }}>From Centuries of Royal Karigari</span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-white/90 max-w-[680px] mx-auto leading-relaxed font-light pt-2" style={{ color: '#ffffff' }}>
            Founded by <strong className="text-white font-medium">Riya Sikaria</strong>, House of Virasat is not a factory of mass production. It is a slow, soulful sanctuary where royal Jadau, syndicate Polki, and certified fine metals are shaped by master artisans.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[800px] mx-auto border-t border-white/15 mt-8">
            <div className="text-center p-2">
              <span className="font-serif text-2xl sm:text-3xl font-light text-white block" style={{ color: '#ffffff' }}>100%</span>
              <span className="text-[10.5px] uppercase tracking-wider text-white/80">BIS Hallmarked</span>
            </div>
            <div className="text-center p-2 border-l border-white/15">
              <span className="font-serif text-2xl sm:text-3xl font-light text-white block" style={{ color: '#ffffff' }}>24K</span>
              <span className="text-[10.5px] uppercase tracking-wider text-white/80">Gold Foil Jadau</span>
            </div>
            <div className="text-center p-2 sm:border-l border-white/15">
              <span className="font-serif text-2xl sm:text-3xl font-light text-white block" style={{ color: '#ffffff' }}>925</span>
              <span className="text-[10.5px] uppercase tracking-wider text-white/80">Sterling Silver</span>
            </div>
            <div className="text-center p-2 border-l border-white/15">
              <span className="font-serif text-2xl sm:text-3xl font-light text-white block" style={{ color: '#ffffff' }}>0%</span>
              <span className="text-[10.5px] uppercase tracking-wider text-white/80">Synthetic Fillers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FOUNDER NOTE & ATELIER GENESIS ─────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#E5E0D8]">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Portrait of Founder */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[360px] lg:max-w-none">
              {/* Decorative vintage border accent */}
              <div className="absolute -inset-2.5 border border-[#B8935A]/40 rounded-sm pointer-events-none transform -rotate-1" />
              
              <div className="relative aspect-[4/5] bg-[#201117] overflow-hidden rounded-xs shadow-xl">
                <img
                  src="/founderimg.jpeg"
                  alt="Riya Sikaria — Founder, House of Virasat"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-serif text-lg font-medium tracking-wide">Riya Sikaria</p>
                  <p className="text-[10.5px] text-[#E0C588] uppercase tracking-[0.16em] font-medium">Founder &amp; Creative Director</p>
                  <p className="text-[10px] text-white/70 font-light mt-0.5">House of Virasat Atelier · Bettiah &amp; Jaipur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Note Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#845E35]">
                The Atelier Genesis
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#1E110E] leading-tight font-normal">
                “True luxury is not made on an assembly line. <br />
                <span className="italic text-[#7A5328]">It is shaped by human hands, patience, and passion.”</span>
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#4A3E38] leading-relaxed font-light">
              <p>
                House of Virasat was born out of an unyielding reverence for India's royal jewellery heritage. Growing up surrounded by traditional craftsmanship, founder <strong className="font-semibold text-[#1A1A1A]">Riya Sikaria</strong> envisioned an atelier where time-honoured techniques like authentic <em>Kundan Jadau</em>, pure mineral <em>Meenakari</em>, and certified hallmarked metals are preserved with uncompromising transparency.
              </p>
              <p>
                In a commercial market flooded with cheap alloy imitations and glass paste jewellery, Virasat provides a conscious alternative: heirloom-grade jewellery created with <strong>certified 925 Sterling Silver</strong> and <strong>18K / 22K Solid Gold</strong>, set with syndicate uncut diamonds (Polki) using hyper-refined 24K gold foil.
              </p>
              <p className="italic text-[#2E1A22] border-l-2 border-[#B8935A] pl-4 py-1">
                “Every piece that leaves our atelier carries the weight of generational lineage — designed to be worn on your most sacred wedding days and cherished as family heirlooms across lifetimes.”
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/bespoke"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#5C1A2E] hover:bg-[#461222] text-white text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs shadow-sm transition-all"
              >
                <span>Explore Bespoke Atelier</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4B884]" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#845E35] text-[#845E35] hover:bg-[#845E35] hover:text-white text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs transition-all"
              >
                <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Talk to Artisan Concierge</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. CRAFTING PROCESS: THE 4 STAGES OF JADAU ─────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#F5EFEB] border-b border-[#E5E0D8]">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center max-w-[700px] mx-auto space-y-2 mb-12 sm:mb-16">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#845E35]">
              Generational Artistry
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1E110E] font-normal">
              The 4 Sacred Stages of Our Karigari
            </h2>
            <p className="text-xs sm:text-sm text-[#63554D] leading-relaxed">
              An authentic Jadau necklace passes through the hands of four distinct generational master artisans before it ever reaches your jewellery box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stage 1 */}
            <div className="bg-white p-6 rounded-xs border border-[#E0D7CC] shadow-2xs space-y-3 relative group hover:border-[#B8935A] transition-all">
              <span className="font-serif text-3xl font-light text-[#B8935A]/50 block">01</span>
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#1E110E] font-medium">Ghaat (Metal Moulding)</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                The master silversmith hand-forges certified 925 sterling silver or solid gold into intricate skeletal bezels with delicate open frameworks.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="bg-white p-6 rounded-xs border border-[#E0D7CC] shadow-2xs space-y-3 relative group hover:border-[#B8935A] transition-all">
              <span className="font-serif text-3xl font-light text-[#B8935A]/50 block">02</span>
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#1E110E] font-medium">Meenakari (Fire Enamelling)</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                The reverse side is hand-engraved and filled with vibrant natural mineral colours, fired multiple times in a furnace for everlasting brilliance.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="bg-white p-6 rounded-xs border border-[#E0D7CC] shadow-2xs space-y-3 relative group hover:border-[#B8935A] transition-all">
              <span className="font-serif text-3xl font-light text-[#B8935A]/50 block">03</span>
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#1E110E] font-medium">Jadau (24K Gold Setting)</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                Syndicate uncut Polki stones are embedded using micro-layers of hyper-purified 24K gold foil, cold-pressed with fine agate stone chisels.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="bg-white p-6 rounded-xs border border-[#E0D7CC] shadow-2xs space-y-3 relative group hover:border-[#B8935A] transition-all">
              <span className="font-serif text-3xl font-light text-[#B8935A]/50 block">04</span>
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#1E110E] font-medium">Piroi (Royal Threading)</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                The Patwa stringer threads natural freshwater pearls, Zambian emerald beads, and hand-braided silk cords to finalize the imperial neckpiece.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. THE VIRASAT PURITY PROMISE ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#E5E0D8]">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center max-w-[650px] mx-auto space-y-2 mb-12">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#845E35]">
              Guaranteed Authenticity
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1E110E] font-normal">
              The Virasat Purity Promise
            </h2>
            <p className="text-xs sm:text-sm text-[#63554D]">
              We believe luxury without transparency is hollow. Every Virasat order is backed by strict hallmark certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Guarantee 1 */}
            <div className="p-7 bg-white border border-[#E8DFD3] rounded-xs space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1E110E]">BIS Hallmarked 925 &amp; Gold</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                All silver creations carry official 925 laser hallmarking; all gold heirlooms are certified with Govt-approved BIS purity stamps.
              </p>
            </div>

            {/* Guarantee 2 */}
            <div className="p-7 bg-white border border-[#E8DFD3] rounded-xs space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1E110E]">Itemised Price Transparency</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                Complete separation of precious metal weight, gemstone carats, and making charges with zero hidden markups.
              </p>
            </div>

            {/* Guarantee 3 */}
            <div className="p-7 bg-white border border-[#E8DFD3] rounded-xs space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#845E35] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1E110E]">Direct Artisan Collaboration</h3>
              <p className="text-xs text-[#63554D] leading-relaxed font-light">
                Every rupee directly empowers multi-generational karigar families, keeping authentic Indian heritage crafts alive and thriving.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. HEIRLOOM COLLECTIONS OVERVIEW ──────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#1A0B12] text-white">
        <div className="max-w-[1240px] mx-auto space-y-12">
          
          <div className="text-center max-w-[650px] mx-auto space-y-2">
            <span className="text-[10.5px] font-bold tracking-[0.24em] uppercase text-white">
              The Heirloom Suites
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal" style={{ color: '#ffffff' }}>
              Curated For Life's Sacred Milestones
            </h2>
            <p className="text-xs sm:text-sm text-white/85" style={{ color: '#ffffff' }}>
              Explore our four signature collections — from grand Rajasthani bridal suites to everyday fine gold.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* REET */}
            <Link
              to="/shop?collection=REET"
              className="group p-6 bg-[#25101A] border border-white/15 hover:border-white/40 rounded-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 block mb-1">Bridal Jadau</span>
                <h4 className="font-serif text-xl text-white group-hover:text-white transition-colors" style={{ color: '#ffffff' }}>REET</h4>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Grand bridal chokers and imperial haars set in 24K gold foil for the regal bride.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-[11px] text-white font-semibold uppercase tracking-wider">
                <span>View Collection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* RAJSI */}
            <Link
              to="/shop?collection=RAJSI"
              className="group p-6 bg-[#25101A] border border-white/15 hover:border-white/40 rounded-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 block mb-1">Uncut Polki</span>
                <h4 className="font-serif text-xl text-white group-hover:text-white transition-colors" style={{ color: '#ffffff' }}>RAJSI</h4>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Syndicate Polki jewels paired with intricate reverse-side mineral Meenakari.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-[11px] text-white font-semibold uppercase tracking-wider">
                <span>View Collection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* NITYA */}
            <Link
              to="/shop?collection=NITYA"
              className="group p-6 bg-[#25101A] border border-white/15 hover:border-white/40 rounded-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 block mb-1">Everyday Gold</span>
                <h4 className="font-serif text-xl text-white group-hover:text-white transition-colors" style={{ color: '#ffffff' }}>NITYA</h4>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Understated, lightweight 18K &amp; 22K certified gold jewellery for daily elegance.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-[11px] text-white font-semibold uppercase tracking-wider">
                <span>View Collection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* ROOP */}
            <Link
              to="/shop?collection=ROOP"
              className="group p-6 bg-[#25101A] border border-white/15 hover:border-white/40 rounded-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 block mb-1">Statement 925</span>
                <h4 className="font-serif text-xl text-white group-hover:text-white transition-colors" style={{ color: '#ffffff' }}>ROOP</h4>
                <p className="text-xs text-white/80 mt-2 font-light leading-relaxed">
                  Pure sterling silver statement earrings, kadas, and chokers for festive celebrations.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-[11px] text-white font-semibold uppercase tracking-wider">
                <span>View Collection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ── 6. ATELIER ADDRESS & INVITATION ───────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-t border-[#E5E0D8]">
        <div className="max-w-[1000px] mx-auto bg-white border border-[#E2DAD0] p-8 sm:p-14 rounded-xs shadow-xs text-center space-y-6">
          
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#845E35]" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#845E35]">
              Visit Our Atelier
            </span>
            <span className="w-6 h-[1.5px] bg-[#845E35]" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#1E110E]">
            House of Virasat Studio
          </h3>

          <p className="text-xs sm:text-sm text-[#5C4F47] leading-relaxed max-w-md mx-auto">
            Pitambari Niwas, Lal Bazar<br />
            Bettiah, Bihar — 845438<br />
            <span className="text-[11px] text-[#845E35] mt-1 block">Mon – Sat: 11:00 AM – 7:30 PM IST</span>
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full sm:w-auto px-6 py-3 text-xs flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>Book a Private Consultation (+91 88292 882905)</span>
            </a>

            <Link
              to="/shop"
              className="btn btn-outline w-full sm:w-auto px-6 py-3 text-xs text-center"
            >
              Explore Full Collection
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
