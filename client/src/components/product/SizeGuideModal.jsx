import React from 'react';
import Modal from '../ui/Modal';

export default function SizeGuideModal({ isOpen, onClose, category = 'ring' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Jewellery Sizing Guide">
      <div className="flex flex-col gap-6 text-sm text-[#4A5568]">
        <div>
          <h4 className="font-serif text-base text-[#1A1A1A] mb-1 font-semibold">
            Indian Standard Ring Sizing
          </h4>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
            Measure the inside diameter of a well-fitting ring in millimetres (mm) to find your perfect Indian standard size.
          </p>
          <div className="overflow-x-auto border border-[#E5E2DA]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F8F5] border-b border-[#E5E2DA] uppercase tracking-wider text-[10px] text-[#1A1A1A]">
                <tr>
                  <th className="p-2.5">Indian Size</th>
                  <th className="p-2.5">Inner Diameter (mm)</th>
                  <th className="p-2.5">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DA] tabular-nums">
                <tr><td className="p-2.5 font-medium">10</td><td className="p-2.5">15.9 mm</td><td className="p-2.5">50.0 mm</td></tr>
                <tr><td className="p-2.5 font-medium">12</td><td className="p-2.5">16.5 mm</td><td className="p-2.5">51.9 mm</td></tr>
                <tr><td className="p-2.5 font-medium">14</td><td className="p-2.5">17.2 mm</td><td className="p-2.5">54.0 mm</td></tr>
                <tr><td className="p-2.5 font-medium">16</td><td className="p-2.5">17.8 mm</td><td className="p-2.5">56.0 mm</td></tr>
                <tr><td className="p-2.5 font-medium">18</td><td className="p-2.5">18.5 mm</td><td className="p-2.5">58.1 mm</td></tr>
                <tr><td className="p-2.5 font-medium">20</td><td className="p-2.5">19.1 mm</td><td className="p-2.5">60.0 mm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-base text-[#1A1A1A] mb-1 font-semibold">
            Bangle Size Chart
          </h4>
          <div className="overflow-x-auto border border-[#E5E2DA]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F8F5] border-b border-[#E5E2DA] uppercase tracking-wider text-[10px] text-[#1A1A1A]">
                <tr>
                  <th className="p-2.5">Bangle Size</th>
                  <th className="p-2.5">Inner Diameter (Inches)</th>
                  <th className="p-2.5">Inner Diameter (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DA] tabular-nums">
                <tr><td className="p-2.5 font-medium">2-4 (Small)</td><td className="p-2.5">2.25 in</td><td className="p-2.5">57.2 mm</td></tr>
                <tr><td className="p-2.5 font-medium">2-6 (Medium)</td><td className="p-2.5">2.37 in</td><td className="p-2.5">60.3 mm</td></tr>
                <tr><td className="p-2.5 font-medium">2-8 (Large)</td><td className="p-2.5">2.50 in</td><td className="p-2.5">63.5 mm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-[#F9F8F5] border border-[#E5E2DA] text-xs text-[#6B7280]">
          <strong>Need custom resizing?</strong> Our master karigars can custom-craft your exact size or provide adjustable shanks. Contact us on WhatsApp.
        </div>
      </div>
    </Modal>
  );
}
