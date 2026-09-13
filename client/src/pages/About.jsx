import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Hammer, Gem, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen font-sans pt-14 lg:pt-[112px]">
      
      {/* Hero */}
      <section className="bg-[#F9F8F5] border-b border-[#E5E2DA] py-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 text-center space-y-4">
          <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-medium leading-tight">
            The Story of House of Virasat
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] max-w-[650px] mx-auto leading-relaxed font-light">
            Founded with a singular vision: to preserve the authentic, centuries-old jewellery craftsmanship of Rajasthan while bringing complete transparency and purity to modern patrons.
          </p>
        </div>
      </section>

      {/* Craftsmanship Narrative */}
      <section className="py-20 border-b border-[#E5E2DA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 aspect-[4/5] bg-[#F9F8F5] border border-[#E5E2DA] overflow-hidden p-3">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
              alt="Master karigar in Jaipur setting uncut polki"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="subheading">Centuries-Old Lineage</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] leading-snug">
              Every piece is hand-shaped, <br />
              <span className="italic font-normal">stone by stone in Johari Bazaar.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              In an era dominated by mass-produced machine jewellery, House of Virasat stands as a sanctuary for the artisanal master craftsman (*Karigar*). Our workshops in Jaipur still practice authentic *Jadau* — using pure gold foils, hand-carved silver bezels, and natural syndicate Polki.
            </p>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              We eliminate unnecessary middlemen and ambiguous markups. When you invest in a House of Virasat heirloom, you receive a certified itemised breakdown of metal purity, gemstone carat, and making charges.
            </p>

            <div className="pt-4">
              <Link to="/bespoke" className="btn btn-primary-gold flex items-center gap-2">
                <span>Explore the Bespoke Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Guarantees */}
      <section className="py-20 bg-[#F9F8F5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <span className="subheading">Our Non-Negotiables</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-1">
              The Virasat Purity Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-[#E5E2DA] rounded-xs space-y-3">
              <ShieldCheck className="w-7 h-7 text-[#B89768]" />
              <h3 className="font-serif text-xl text-[#1A1A1A]">100% BIS Hallmarking</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Every silver piece carries the 925 purity hallmark; every gold piece is certified with official BIS laser etching and purity stamps.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E5E2DA] rounded-xs space-y-3">
              <Gem className="w-7 h-7 text-[#B89768]" />
              <h3 className="font-serif text-xl text-[#1A1A1A]">Natural Gemstones</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                We use authentic syndicate Polki, natural uncut diamonds, emeralds, and certified pearls. No glass imitation or cheap fillers.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E5E2DA] rounded-xs space-y-3">
              <Hammer className="w-7 h-7 text-[#B89768]" />
              <h3 className="font-serif text-xl text-[#1A1A1A]">Artisan Welfare</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                By purchasing from Virasat, you directly support multi-generational karigar families and help preserve endangered royal crafts.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
