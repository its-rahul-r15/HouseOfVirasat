import React, { useState } from 'react';
import { Hammer, Search, ShieldCheck, CheckCircle2, Clock, Edit2, Sparkles, MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

const DEMO_MTO_ITEMS = [
  {
    id: 'HOV-MTO-2024-041',
    customer: { name: 'Gayatri Devi', phone: '+91 98765 43210', email: 'patron@houseofvirasat.com' },
    productName: 'The Royal Mewar Polki Suite (Custom Jadau Dip)',
    metal: '925 Sterling Silver & 24K Gold Foil Setting',
    quotedPrice: 34500,
    depositPaid: 15000,
    status: 'IN_PRODUCTION',
    targetDate: '15 Aug 2024',
    adminNotes: 'Stones assigned to Master Govind. 12 uncut Polki pieces set in Johari Bazaar atelier.',
    createdAt: '01 Aug 2024',
  },
  {
    id: 'HOV-MTO-2024-040',
    customer: { name: 'Kavita Agarwal', phone: '+91 98111 22334', email: 'kavita@example.com' },
    productName: 'Padmavati Chandbali in Zambian Emeralds',
    metal: '18K Yellow Gold',
    quotedPrice: 52000,
    depositPaid: 26000,
    status: 'QC',
    targetDate: '10 Aug 2024',
    adminNotes: 'BIS Hallmarking completed. Final velvet casing and certificate generation pending.',
    createdAt: '26 Jul 2024',
  },
];

export default function AdminMto() {
  const [items, setItems] = useState(DEMO_MTO_ITEMS);
  const [editingItem, setEditingItem] = useState(null);
  const { settings } = useSettings();

  const handleStatusUpdate = (id, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Atelier Queue & Crafting Pipeline
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Made-to-Order (MTO) Commissions
          </h1>
        </div>
      </div>

      {/* ── MTO List ── */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-5 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9] text-xs">
              <div>
                <span className="font-mono font-bold text-[#5C1A2E] text-sm">{item.id}</span>
                <span className="text-[#6B7280] ml-3 font-normal">Created: {item.createdAt}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#6B7280]">Target Delivery: <strong className="text-[#2B2320]">{item.targetDate}</strong></span>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-xs border border-[#D1CCC4] bg-[#FAF6F0] text-[#5C1A2E]"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="IN_PRODUCTION">IN_PRODUCTION (Johari Workshop)</option>
                  <option value="QC">QC & BIS HALLMARKING</option>
                  <option value="READY">READY FOR DISPATCH</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Patron Details</span>
                <p className="font-semibold text-[#2B2320]">{item.customer.name}</p>
                <p className="text-[#6B7280] font-mono">{item.customer.phone}</p>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Piece Specification</span>
                <p className="font-semibold text-[#2B2320]">{item.productName}</p>
                <p className="text-[#5C1A2E]">{item.metal}</p>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Commercial Valuation</span>
                <p className="font-semibold text-[#2B2320]">Quoted: ₹{item.quotedPrice.toLocaleString('en-IN')}</p>
                <p className="text-emerald-700 font-medium">Deposit Paid: ₹{item.depositPaid.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Spec / Karigar Notes */}
            <div className="p-3 bg-white border border-[#E8E2D9] rounded-xs text-xs space-y-1">
              <span className="font-bold text-[#5C1A2E] flex items-center gap-1">
                <Hammer className="w-3.5 h-3.5" />
                Atelier Notes:
              </span>
              <p className="text-[#4B5563] leading-relaxed italic">{item.adminNotes}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9] text-xs">
              <span className="text-[#6B7280] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B8935A]" />
                Auto-assigned to master goldsmith guild
              </span>

              <a
                href={getWhatsAppLink({
                  phoneNumber: item.customer.phone,
                  customMessage: `Namaste ${item.customer.name}! We have an update regarding your Made-to-Order piece ${item.id} from House of Virasat.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-xs flex items-center gap-1.5 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Client Update</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
