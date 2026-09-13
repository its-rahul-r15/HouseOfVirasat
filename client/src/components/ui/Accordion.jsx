import React, { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ title, subtitle, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="border-b border-[#E5E2DA] transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full py-4 flex items-center justify-between text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/30 rounded-xs"
      >
        <div className="flex flex-col pr-4">
          <span className="text-sm font-medium tracking-wide text-[#2B2320] group-hover:text-[#B8935A] transition-colors">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-[#6B7280] mt-0.5">{subtitle}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#6B7280] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#B8935A]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          className="pb-5 text-sm text-[#6B7280] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {children}
        </div>
      )}
    </div>
  );
}

