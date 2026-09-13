import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
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
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} bg-white shadow-2xl rounded-sm z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#E5E2DA]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DA] bg-[#FAF6F0]">
          <h3 id="modal-title" className="font-serif text-xl font-medium text-[#2B2320]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#2B2320] transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto font-sans">
          {children}
        </div>
      </div>
    </div>
  );
}

