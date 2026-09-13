import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Drawer({ isOpen, onClose, title, children, width = 'max-w-[440px]' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`relative w-full ${width} bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-[#E5E2DA]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E2DA] bg-white">
          <h3 id="drawer-title" className="font-serif text-xl font-medium tracking-wide text-[#2B2320]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#2B2320] transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 font-sans">
          {children}
        </div>
      </div>
    </div>
  );
}

