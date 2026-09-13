import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  MessageCircle,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

import axiosClient from '../../api/axiosClient';

const DEMO_BESPOKE_LEADS = [
  {
    id: 'HOV-BSP-2024-012',
    contact: {
      name: 'Princess Radhika Rao',
      mobile: '+91 98200 44556',
      email: 'radhika.rao@example.com',
      city: 'Udaipur',
    },
    jewelleryType: 'Royal Rajputana Bridal Choker Suite',
    metalPreference: '22K Solid Gold with Jadau Foil',
    stonePreference: 'Natural Zambian Emeralds & Uncut Polki',
    budgetRange: '₹3,00,000 — ₹4,50,000',
    occasion: 'Royal Wedding (November 2024)',
    status: 'IN_CONSULTATION',
    designBrief: 'Looking to replicate an ancestral Mewar dynasty choker design with peacock motifs and dangling emerald beads.',
    createdAt: '03 Aug 2024',
    scheduledMeeting: '12 Aug 2024 at 4:30 PM (Google Meet)',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    ],
  },
];

export default function AdminBespoke() {
  const [leads, setLeads] = useState(DEMO_BESPOKE_LEADS);
  const { settings } = useSettings();

  React.useEffect(() => {
    axiosClient.get('/bespoke')
      .then((res) => {
        const items = res.data?.items || res.items || (Array.isArray(res?.data) ? res.data : []);
        if (items.length > 0) {
          setLeads(items.map(item => ({
            id: item.referenceNumber || item._id,
            realId: item._id,
            contact: item.contact || {},
            jewelleryType: item.jewelleryType,
            metalPreference: item.metalPreference,
            stonePreference: item.stonePreference,
            budgetRange: item.budgetRange,
            occasion: item.occasion,
            status: item.status,
            designBrief: item.designBrief,
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
            scheduledMeeting: item.appointmentRequested ? 'Appointment Requested' : 'Direct WhatsApp',
            referenceImages: item.referenceImages || [],
          })));
        }
      })
      .catch(() => {});
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const targetLead = leads.find(l => l.id === id);
    if (targetLead?.realId) {
      axiosClient.patch(`/bespoke/${targetLead.realId}`, { status: newStatus }).catch(console.error);
    }
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2em] text-[#5C1A2E]">
            Private Concierge & Haute Joaillerie
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Bespoke Bridal Design Commissions
          </h1>
        </div>
      </div>

      {/* ── Leads List ── */}
      <div className="space-y-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white border border-[#E8E2D9] rounded-sm p-6 sm:p-7 space-y-6 shadow-2xs"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9] text-xs">
              <div>
                <span className="font-mono font-bold text-[#5C1A2E] text-sm">{lead.id}</span>
                <span className="text-[#6B7280] ml-3">Received on {lead.createdAt}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#6B7280]">Status:</span>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-xs border border-[#D1CCC4] bg-[#FAF6F0] text-[#5C1A2E]"
                >
                  <option value="NEW">NEW LEAD</option>
                  <option value="IN_CONSULTATION">IN_CONSULTATION</option>
                  <option value="QUOTED">QUOTED & 3D CAD RENDERED</option>
                  <option value="CONFIRMED">CONFIRMED (Deposit Received)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* Client & Specs details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Client Patron</span>
                <p className="font-semibold text-[#2B2320] text-sm">{lead.contact.name}</p>
                <p className="text-[#6B7280] font-mono">{lead.contact.mobile}</p>
                <p className="text-[#6B7280]">{lead.contact.email} · {lead.contact.city}</p>
              </div>

              <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Design Requirements</span>
                <p className="font-semibold text-[#2B2320]">{lead.jewelleryType}</p>
                <p className="text-[#5C1A2E] font-medium">{lead.metalPreference}</p>
                <p className="text-[#6B7280]">{lead.stonePreference}</p>
              </div>

              <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Commercial & Timeline</span>
                <p className="font-semibold text-[#5C1A2E] text-sm">{lead.budgetRange}</p>
                <p className="text-[#2B2320]">Occasion: {lead.occasion}</p>
                <p className="text-[#6B7280] flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#B8935A]" />
                  <span>{lead.scheduledMeeting}</span>
                </p>
              </div>
            </div>

            {/* Design Brief Narrative */}
            <div className="p-4 bg-[#FAF6F0]/60 border border-[#E8E2D9] rounded-xs text-xs space-y-2">
              <span className="font-bold text-[#2B2320] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5C1A2E]" />
                Client Design Brief & Vision:
              </span>
              <p className="text-[#4B5563] leading-relaxed italic">
                "{lead.designBrief}"
              </p>
            </div>

            {/* Reference Images preview */}
            {lead.referenceImages?.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#2B2320]">Attached Reference Moodboards:</span>
                <div className="flex gap-3">
                  {lead.referenceImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Reference"
                      className="w-20 h-20 object-cover rounded-xs border border-[#E8E2D9]"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E2D9] text-xs">
              <span className="text-[#6B7280] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B8935A]" />
                Direct Concierge WhatsApp bridge enabled
              </span>

              <a
                href={getWhatsAppLink({
                  phoneNumber: lead.contact.mobile,
                  customMessage: `Namaste ${lead.contact.name}! Regarding your Bespoke Bridal Consultation ${lead.id} with House of Virasat.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary-gold btn-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
