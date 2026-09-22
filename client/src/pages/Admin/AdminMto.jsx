import React, { useState, useEffect } from 'react';
import {
  Hammer,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Edit2,
  Sparkles,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

const MTO_STATUS_OPTIONS = [
  'SUBMITTED',
  'CONFIRMED',
  'IN_PRODUCTION',
  'QC',
  'READY',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminMto() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);
  const { settings } = useSettings();

  const fetchMtoRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (search.trim()) params.search = search.trim();

      const res = await axiosClient.get('/mto', { params });
      const list = Array.isArray(res?.data)
        ? res.data
        : (res?.data?.items || res?.items || (Array.isArray(res) ? res : []));
      setItems(list);
    } catch (err) {
      console.error('Error fetching MTO requests:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMtoRequests();
  }, [selectedStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axiosClient.patch(`/mto/${id}`, { status: newStatus });
      setItems((prev) =>
        prev.map((item) => ((item._id === id || item.id === id) ? { ...item, status: newStatus } : item))
      );
      showToast('success', `MTO status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating MTO status:', err);
      showToast('error', err?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredItems = items.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const ref = (item.referenceNumber || item.id || '').toLowerCase();
      const patron = (item.customer?.name || '').toLowerCase();
      const phone = (item.customer?.mobile || item.customer?.phone || '').toLowerCase();
      const prod = (item.productName || '').toLowerCase();
      return ref.includes(q) || patron.includes(q) || phone.includes(q) || prod.includes(q);
    }
    return true;
  });

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
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage custom handcrafted karigari queues, gold foil jadau dips, gem audits, and progress tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMtoRequests}
          disabled={loading}
          className="p-2 border border-[#D1CCC4] rounded-xs hover:bg-[#FAF6F0] text-[#2B2320] transition-colors self-start sm:self-auto"
          title="Refresh MTO Queue"
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
            placeholder="Search by Reference, Patron Name or Phone…"
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
          <option value="">All Crafting Stages</option>
          {MTO_STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-end text-[#6B7280]">
          <span>Total Commissions: <strong className="text-[#2B2320]">{filteredItems.length}</strong></span>
        </div>
      </div>

      {/* ── MTO List ── */}
      {loading ? (
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-12 text-center text-[#6B7280]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#5C1A2E] mx-auto mb-2" />
          <span>Loading Made-to-Order pipeline…</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-12 text-center text-[#6B7280]">
          <Hammer className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 stroke-1" />
          <p className="font-serif text-base text-[#2B2320]">No Made-to-Order requests found</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
            When patrons request custom made-to-order pieces on the boutique, they will be listed here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const itemId = item._id || item.id;
            const refNum = item.referenceNumber || itemId;
            const customerName = item.customer?.name || 'Patron';
            const customerPhone = item.customer?.mobile || item.customer?.phone || '';
            const customerEmail = item.customer?.email || '';
            const createdDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={itemId}
                className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-5 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9] text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#5C1A2E] text-sm">{refNum}</span>
                    <span className="text-[#6B7280] ml-3 font-normal">Received: {createdDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B7280]">Status:</span>
                    <select
                      value={item.status || 'SUBMITTED'}
                      disabled={updatingId === itemId}
                      onChange={(e) => handleStatusUpdate(itemId, e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-xs border border-[#D1CCC4] bg-[#FAF6F0] text-[#5C1A2E] disabled:opacity-50"
                    >
                      {MTO_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">Patron Details</span>
                    <p className="font-semibold text-[#2B2320]">{customerName}</p>
                    {customerPhone && <p className="text-[#6B7280] font-mono">{customerPhone}</p>}
                    {customerEmail && <p className="text-[#6B7280]">{customerEmail}</p>}
                  </div>

                  <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">Piece Specification</span>
                    <p className="font-semibold text-[#2B2320]">{item.productName || 'Custom Piece'}</p>
                    <p className="text-[#5C1A2E]">{item.selectedVariant || item.preferences || 'Standard Specification'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">Commercial Valuation</span>
                    <p className="font-semibold text-[#2B2320]">
                      Quoted: ₹{(item.quotedPrice || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-emerald-700 font-medium">
                      Deposit: ₹{(item.depositAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Preferences / Spec Notes */}
                {item.preferences && (
                  <div className="p-3 bg-white border border-[#E8E2D9] rounded-xs text-xs space-y-1">
                    <span className="font-bold text-[#5C1A2E] flex items-center gap-1">
                      <Hammer className="w-3.5 h-3.5" />
                      Patron Custom Requirements:
                    </span>
                    <p className="text-[#4B5563] leading-relaxed italic">{item.preferences}</p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9] text-xs">
                  <span className="text-[#6B7280] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B8935A]" />
                    Johari Bazaar atelier crafting pipeline
                  </span>

                  {customerPhone && (
                    <a
                      href={getWhatsAppLink({
                        phoneNumber: customerPhone,
                        customMessage: `Namaste ${customerName}! We have an update regarding your Made-to-Order piece ${refNum} from House of Virasat.`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs flex items-center gap-1.5 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Client Update</span>
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
