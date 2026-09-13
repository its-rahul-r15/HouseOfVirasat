import React from 'react';
import { ShieldCheck, Award, Download, ExternalLink, Sparkles } from 'lucide-react';

export default function CertificateCard({
  certificateNo = 'HOV-BIS-925-8842',
  productName = 'The Royal Mewar Polki Suite',
  purity = '925 Sterling Silver & 24K Gold Foil Setting',
  stoneType = 'Uncut Polki & Emerald Beads',
  hallmarkCenter = 'BIS Authorized Assay Center, Jaipur',
  issueDate = '02 Aug 2024',
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative bg-white border-2 border-[#D4B884] rounded-sm p-6 sm:p-8 shadow-sm overflow-hidden font-sans">
      {/* Royal Watermark & Gold Corner Ornaments */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#FAF6F0] -z-0 opacity-80 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
        <div className="absolute transform rotate-45 bg-[#B8935A] text-white font-bold text-[8px] uppercase tracking-widest py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow">
          Certified
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E2D9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5C1A2E] text-[#D4B884] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <span className="text-[9.5px] uppercase tracking-[0.25em] font-bold text-[#B8935A]">
                House of Virasat · Authenticity Seal
              </span>
              <h4 className="font-serif text-lg sm:text-xl font-medium text-[#2B2320]">
                Digital Certificate of Purity
              </h4>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-mono">
              Certificate No.
            </span>
            <span className="text-xs font-bold text-[#5C1A2E] font-mono tracking-wider">
              {certificateNo}
            </span>
          </div>
        </div>

        {/* Product & Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block">
              Heirloom Piece
            </span>
            <p className="font-serif text-sm font-semibold text-[#2B2320]">
              {productName}
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block">
              Precious Metal Grade
            </span>
            <p className="font-medium text-[#2B2320] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8935A]" />
              {purity}
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block">
              Gemstone & Karigari
            </span>
            <p className="font-medium text-[#2B2320] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5C1A2E]" />
              {stoneType}
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block">
              Assay & Issue Date
            </span>
            <p className="font-medium text-[#2B2320]">
              {hallmarkCenter} · {issueDate}
            </p>
          </div>
        </div>

        {/* Guarantee Banner */}
        <p className="text-[11px] text-[#6B7280] italic leading-relaxed text-center pt-2">
          "Every stone is certified untreated and set using heirloom Jadau traditions. Purity guaranteed for a lifetime."
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E2D9]">
          <span className="text-[11px] text-[#6B7280] flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            BIS Laser Engraved on Metal
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-outline btn-xs flex items-center gap-1.5 text-[11px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certificate (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
