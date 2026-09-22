import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';
import axiosClient from '../../api/axiosClient';

const BESPOKE_STATUSES = [
  'NEW',
  'IN_CONSULTATION',
  'QUOTED',
  'CONFIRMED',
  'CLOSED_WON',
  'CLOSED_LOST',
  'CLOSED',
];

export default function AdminBespoke() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);
  const { settings } = useSettings();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (search.trim()) params.search = search.trim();

      const res = await axiosClient.get('/bespoke', { params });
      const items = Array.isArray(res?.data)
        ? res.data
        : (res?.data?.items || res?.items || (Array.isArray(res) ? res : []));
      setLeads(items);
    } catch (err) {
      console.error('Error loading bespoke leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axiosClient.patch(`/bespoke/${id}`, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
      );
      showToast('success', `Bespoke lead status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating bespoke status:', err);
      showToast('error', err?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredLeads = leads.filter((lead) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const ref = (lead.referenceNumber || lead._id || '').toLowerCase();
      const name = (lead.contact?.name || '').toLowerCase();
      const phone = (lead.contact?.mobile || '').toLowerCase();
      const city = (lead.contact?.city || '').toLowerCase();
      const type = (lead.jewelleryType || '').toLowerCase();
      return ref.includes(q) || name.includes(q) || phone.includes(q) || city.includes(q) || type.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Private Concierge & Haute Joaillerie
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Bespoke Bridal Design Commissions
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage private consultations, 3D CAD renders, bespoke briefs, and heirloom commissions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLeads}
          disabled={loading}
          className="p-2 border border-[#D1CCC4] rounded-xs hover:bg-[#FAF6F0] text-[#2B2320] transition-colors self-start sm:self-auto"
          title="Refresh Inquiries"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5C1A2E]' : ''}`} />
        </button>
      </div>

      {toast && (
        <div
          className={`p-3 rounded-xs text-xs flex items-center gap-2 border animate-[fadeIn_0.15s_ease] ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Search & Filter ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Reference, Patron Name, City or Phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
        >
          <option value="">All Inquiry Stages</option>
          {BESPOKE_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-end text-[#6B7280]">
          <span>Total Inquiries: <strong className="text-[#2B2320]">{filteredLeads.length}</strong></span>
        </div>
      </div>

      {/* ── Leads List ── */}
      {loading ? (
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-12 text-center text-[#6B7280]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#5C1A2E] mx-auto mb-2" />
          <span>Loading bespoke inquiries…</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-12 text-center text-[#6B7280]">
          <Sparkles className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 stroke-1" />
          <p className="font-serif text-base text-[#2B2320]">No bespoke inquiries found</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
            Private bridal commissions and bespoke inquiries submitted through the concierge will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredLeads.map((lead) => {
            const leadId = lead._id;
            const refNum = lead.referenceNumber || leadId;
            const contactName = lead.contact?.name || 'Patron';
            const contactMobile = lead.contact?.mobile || '';
            const contactEmail = lead.contact?.email || '';
            const contactCity = lead.contact?.city || '';
            const createdDate = lead.createdAt
              ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={leadId}
                className="bg-white border border-[#E8E2D9] rounded-sm p-6 sm:p-7 space-y-6 shadow-2xs"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9] text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#5C1A2E] text-sm">{refNum}</span>
                    <span className="text-[#6B7280] ml-3">Received on {createdDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B7280]">Status:</span>
                    <select
                      value={lead.status || 'NEW'}
                      disabled={updatingId === leadId}
                      onChange={(e) => handleStatusChange(leadId, e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-xs border border-[#D1CCC4] bg-[#FAF6F0] text-[#5C1A2E] disabled:opacity-50"
                    >
                      {BESPOKE_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Client & Specs details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">Client Patron</span>
                    <p className="font-semibold text-[#2B2320] text-sm">{contactName}</p>
                    {contactMobile && <p className="text-[#6B7280] font-mono">{contactMobile}</p>}
                    <p className="text-[#6B7280]">
                      {contactEmail} {contactCity ? `· ${contactCity}` : ''}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">Design Requirements</span>
                    <p className="font-semibold text-[#2B2320]">{lead.jewelleryType || 'Bespoke Piece'}</p>
                    <p className="text-[#5C1A2E] font-medium">{lead.metalPreference || 'Gold / Silver'}</p>
                    {lead.stonePreference && <p className="text-[#6B7280]">{lead.stonePreference}</p>}
                  </div>

                  <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">Commercial & Timeline</span>
                    <p className="font-semibold text-[#5C1A2E] text-sm">{lead.budgetRange || 'Flexible Budget'}</p>
                    {lead.occasion && <p className="text-[#2B2320]">Occasion: {lead.occasion}</p>}
                    {lead.appointmentRequested && (
                      <p className="text-[#6B7280] flex items-center gap-1 mt-1 font-semibold text-emerald-700">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Private Video Consultation Requested</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Design Brief Narrative */}
                {lead.designBrief && (
                  <div className="p-4 bg-[#FAF6F0]/60 border border-[#E8E2D9] rounded-xs text-xs space-y-2">
                    <span className="font-bold text-[#2B2320] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#5C1A2E]" />
                      Client Design Brief & Vision:
                    </span>
                    <p className="text-[#4B5563] leading-relaxed italic">
                      "{lead.designBrief}"
                    </p>
                  </div>
                )}

                {/* Reference Images */}
                {lead.referenceImages && lead.referenceImages.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-[#2B2320]">Attached Reference Moodboards:</span>
                    <div className="flex flex-wrap gap-3">
                      {lead.referenceImages.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                          <img
                            src={img}
                            alt="Reference"
                            className="w-20 h-20 object-cover rounded-xs border border-[#E8E2D9] hover:opacity-80 transition-opacity"
                          />
                        </a>
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

                  {contactMobile && (
                    <a
                      href={getWhatsAppLink({
                        phoneNumber: contactMobile,
                        customMessage: `Namaste ${contactName}! Regarding your Bespoke Bridal Consultation ${refNum} with House of Virasat.`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary-gold btn-xs flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Open WhatsApp Concierge</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
