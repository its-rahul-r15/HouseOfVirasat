import React from 'react';

export default function Badge({ children, variant = 'gold' }) {
  const styles = {
    gold: 'bg-[#F8F5EE] text-[#A07F52] border border-[#B89768]/30',
    silver: 'bg-[#F2F4F7] text-[#4A5568] border border-[#8E959D]/30',
    mto: 'bg-[#FFF9E6] text-[#B45309] border border-[#F59E0B]/30',
    singlePiece: 'bg-[#FDF2F8] text-[#9D174D] border border-[#EC4899]/30',
    maroon: 'bg-[#5A1E24]/10 text-[#5A1E24] border border-[#5A1E24]/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-[2px] ${
        styles[variant] || styles.gold
      }`}
    >
      {children}
    </span>
  );
}
