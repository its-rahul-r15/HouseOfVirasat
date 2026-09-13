import React from 'react';
import { Check, Hammer, ShieldCheck, Package, Truck, Sparkles } from 'lucide-react';

const STAGES = [
  {
    key: 'CONFIRMED',
    title: 'Order Confirmed',
    description: 'Design & metal specifications locked with the atelier.',
    icon: Check,
  },
  {
    key: 'CRAFTING',
    title: 'Johari Workshop Crafting',
    description: 'Master karigars hand-setting uncut Polki stones & gold foils.',
    icon: Hammer,
  },
  {
    key: 'HALLMARKING',
    title: 'BIS Hallmarking & Audit',
    description: 'Certified 925 silver & gold purity hallmark laser engraved.',
    icon: ShieldCheck,
  },
  {
    key: 'PACKAGING',
    title: 'Velvet Box & Certificate',
    description: 'Sealed in heritage wooden casket with authenticity cards.',
    icon: Package,
  },
  {
    key: 'TRANSIT',
    title: 'Armoured & Insured Transit',
    description: 'Dispatched via 100% insured high-value vault logistics.',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    title: 'Heirloom Delivered',
    description: 'Delivered securely to your residence.',
    icon: Sparkles,
  },
];

export default function KarigariTimeline({ currentStage = 'CRAFTING', statusDate = 'Expected within 5-7 days' }) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage.toUpperCase());
  const activeIdx = currentIndex === -1 ? 1 : currentIndex;

  return (
    <div className="bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm p-6 sm:p-8">
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Atelier Progress Status
          </span>
          <h4 className="font-serif text-lg sm:text-xl text-[#2B2320] font-medium mt-0.5">
            Karigari & Dispatch Journey
          </h4>
        </div>
        <div className="text-right">
          <span className="inline-block text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-[#5C1A2E]/10 text-[#5C1A2E] rounded-xs border border-[#5C1A2E]/20">
            {STAGES[activeIdx]?.title}
          </span>
          <p className="text-[11px] text-[#6B7280] mt-1">{statusDate}</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;
            const isUpcoming = idx > activeIdx;

            return (
              <div key={stage.key} className="flex flex-row md:flex-col items-start gap-3.5 relative">
                {/* Step circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#5C1A2E] text-[#D4B884] ring-4 ring-[#5C1A2E]/20 shadow-md scale-105'
                      : isCompleted
                      ? 'bg-[#B8935A] text-white'
                      : 'bg-white text-[#9CA3AF] border border-[#D1CCC4]'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>

                {/* Step Text */}
                <div className="flex-1">
                  <span
                    className={`text-[9.5px] uppercase tracking-wider font-bold block ${
                      isCurrent
                        ? 'text-[#5C1A2E]'
                        : isCompleted
                        ? 'text-[#B8935A]'
                        : 'text-[#9CA3AF]'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                  <h5
                    className={`text-xs sm:text-sm font-semibold leading-snug mt-0.5 ${
                      isCurrent
                        ? 'text-[#2B2320] font-bold'
                        : isCompleted
                        ? 'text-[#2B2320]'
                        : 'text-[#6B7280]'
                    }`}
                  >
                    {stage.title}
                  </h5>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed hidden sm:block">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
