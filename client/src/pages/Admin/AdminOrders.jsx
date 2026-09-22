import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Download,
  Eye,
  Truck,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const FULFILMENT_STAGES = [
  'CONFIRMED',
  'IN_PRODUCTION',
  'QUALITY_CHECK',
  'READY_TO_DISPATCH',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Edit fields for active modal
  const [trackingInput, setTrackingInput] = useState('');
  const [courierInput, setCourierInput] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedStatus) params.fulfilmentStatus = selectedStatus;
      if (search.trim()) params.search = search.trim();

      const res = await axiosClient.get('/orders', { params });
      const orderList = Array.isArray(res?.data)
        ? res.data
        : (res?.data?.orders || res?.orders || (Array.isArray(res) ? res : []));
      setOrders(orderList);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axiosClient.patch(`/orders/${orderId}`, { fulfilmentStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, fulfilmentStatus: newStatus } : o))
      );
      if (activeOrderModal && activeOrderModal._id === orderId) {
        setActiveOrderModal((prev) => ({ ...prev, fulfilmentStatus: newStatus }));
      }
      showToast('success', `Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast('error', err?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveTracking = async () => {
    if (!activeOrderModal) return;
    setSavingTracking(true);
    try {
      const updates = {
        trackingLink: trackingInput.trim() || undefined,
        courierPartner: courierInput.trim() || undefined,
      };
      await axiosClient.patch(`/orders/${activeOrderModal._id}`, updates);
      setOrders((prev) =>
        prev.map((o) => (o._id === activeOrderModal._id ? { ...o, ...updates } : o))
      );
      setActiveOrderModal((prev) => ({ ...prev, ...updates }));
      showToast('success', 'Tracking & courier details saved.');
    } catch (err) {
      console.error('Failed to save tracking:', err);
      showToast('error', err?.message || 'Failed to save tracking info');
    } finally {
      setSavingTracking(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newAdminNote.trim() || !activeOrderModal) return;
    try {
      await axiosClient.patch(`/orders/${activeOrderModal._id}`, { note: newAdminNote.trim() });
      const updatedNotes = [
        ...(activeOrderModal.adminNotes || []),
        { note: newAdminNote.trim(), addedBy: 'Admin', addedAt: new Date().toISOString() },
      ];
      setActiveOrderModal((prev) => ({ ...prev, adminNotes: updatedNotes }));
      setNewAdminNote('');
      showToast('success', 'Admin note added.');
    } catch (err) {
      console.error('Failed to add note:', err);
      showToast('error', 'Failed to add note');
    }
  };

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const openOrderModal = (order) => {
    setActiveOrderModal(order);
    setTrackingInput(order.trackingLink || '');
    setCourierInput(order.courierPartner || '');
    setNewAdminNote('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Logistics & Fulfilment
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Customer Orders & Dispatch Pipeline
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Live orders tracking, invoice generation, vault dispatches, and atelier fulfilment stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 border border-[#D1CCC4] rounded-xs hover:bg-[#FAF6F0] text-[#2B2320] transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#5C1A2E]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs bg-white"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-xs text-xs flex items-center gap-2 border animate-[fadeIn_0.15s_ease] ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ── Search & Filters ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Reference, Patron Name or Email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
          />
        </form>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
        >
          <option value="">All Fulfilment Stages</option>
          {FULFILMENT_STAGES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-end text-[#6B7280]">
          <span>Total Orders: <strong className="text-[#2B2320]">{orders.length}</strong></span>
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] text-[#6B7280] uppercase tracking-wider text-[10px] bg-[#FAF6F0]">
                <th className="p-3.5">Order Ref & Date</th>
                <th className="p-3.5">Patron Details</th>
                <th className="p-3.5">Heirloom Items</th>
                <th className="p-3.5">Total (₹)</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Fulfilment Stage</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#6B7280]">
                    <RefreshCw className="w-5 h-5 animate-spin text-[#5C1A2E] mx-auto mb-2" />
                    <span>Loading customer orders…</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#6B7280]">
                    <Package className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 stroke-1" />
                    <p className="font-serif text-base text-[#2B2320]">No orders found</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                      Customer orders placed on the storefront will appear here with live tracking.
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const formattedDate = o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—';

                  return (
                    <tr key={o._id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-[#5C1A2E] text-xs">
                          {o.referenceNumber || o._id}
                        </span>
                        <span className="block text-[10.5px] text-[#6B7280] mt-0.5">
                          {formattedDate}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <strong className="text-[#2B2320] block">{o.customer?.name || 'Patron'}</strong>
                        <span className="text-[11px] text-[#6B7280] block font-mono">
                          {o.customer?.mobile || o.customer?.email}
                        </span>
                        <span className="text-[10.5px] text-[#9CA3AF] block truncate max-w-[160px]">
                          {o.shippingAddress?.city}, {o.shippingAddress?.state}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1 max-w-xs">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="text-[#2B2320] truncate">
                              <span>{item.name || item.sku}</span>{' '}
                              <span className="text-[#6B7280]">× {item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 font-semibold text-[#2B2320]">
                        ₹{(o.total || o.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                            o.paymentStatus === 'PAID'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          }`}
                        >
                          {o.paymentStatus || 'PENDING'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={o.fulfilmentStatus || 'CONFIRMED'}
                          disabled={updatingId === o._id}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-xs border border-[#D1CCC4] bg-white text-[#5C1A2E] focus:outline-none focus:border-[#5C1A2E] disabled:opacity-50"
                        >
                          {FULFILMENT_STAGES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openOrderModal(o)}
                            className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded-xs transition-colors"
                            title="View Full Order & Tracking"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Detail Modal ── */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D9] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5C1A2E]">
                  Order Details
                </span>
                <h3 className="font-serif text-lg font-medium text-[#2B2320]">
                  {activeOrderModal.referenceNumber || activeOrderModal._id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="text-[#6B7280] hover:text-[#2B2320] p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status & Patron Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="font-bold text-[#2B2320] block">Patron & Contact:</span>
                <p className="font-semibold text-[#2B2320]">{activeOrderModal.customer?.name}</p>
                <p className="text-[#6B7280] font-mono">{activeOrderModal.customer?.mobile}</p>
                <p className="text-[#6B7280]">{activeOrderModal.customer?.email}</p>
              </div>

              <div className="p-3.5 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="font-bold text-[#2B2320] block">Shipping Destination:</span>
                <p className="text-[#4B5563]">
                  {activeOrderModal.shippingAddress?.name}<br />
                  {activeOrderModal.shippingAddress?.line1}
                  {activeOrderModal.shippingAddress?.line2 ? `, ${activeOrderModal.shippingAddress.line2}` : ''}<br />
                  {activeOrderModal.shippingAddress?.city}, {activeOrderModal.shippingAddress?.state} — {activeOrderModal.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <span className="font-bold text-[#2B2320]">Ordered Heirloom Items:</span>
              <div className="border border-[#E8E2D9] rounded-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F0] text-[#6B7280] text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D9]">
                    {activeOrderModal.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-[#2B2320]">{item.name || 'Jewellery Piece'}</td>
                        <td className="p-2.5 font-mono text-[#6B7280]">{item.sku}</td>
                        <td className="p-2.5">₹{(item.priceAtPurchase || 0).toLocaleString('en-IN')}</td>
                        <td className="p-2.5">{item.qty}</td>
                        <td className="p-2.5 text-right font-semibold">
                          ₹{((item.priceAtPurchase || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#FAF6F0] font-semibold text-[#2B2320]">
                    <tr>
                      <td colSpan={4} className="p-2.5 text-right">Total Order Value:</td>
                      <td className="p-2.5 text-right font-bold text-[#5C1A2E]">
                        ₹{(activeOrderModal.total || activeOrderModal.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Tracking & Courier Partner */}
            <div className="space-y-3 p-4 bg-white border border-[#E8E2D9] rounded-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B2320] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#5C1A2E]" />
                  Logistics & Courier Dispatch Tracking
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    placeholder="e.g. BlueDart High-Value Vault, Shiprocket"
                    className="w-full px-3 py-1.5 border border-[#D1CCC4] rounded-xs text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                    Airway Bill (AWB) / Tracking URL
                  </label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="https://track.shiprocket.in/..."
                    className="w-full px-3 py-1.5 border border-[#D1CCC4] rounded-xs font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTracking}
                  disabled={savingTracking}
                  className="btn btn-outline btn-xs"
                >
                  {savingTracking ? 'Saving…' : 'Update Tracking'}
                </button>
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <span className="font-bold text-[#2B2320] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#5C1A2E]" />
                Internal Atelier & Dispatch Notes:
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {activeOrderModal.adminNotes?.length > 0 ? (
                  activeOrderModal.adminNotes.map((n, idx) => (
                    <div key={idx} className="p-2 bg-[#FAF6F0] rounded-xs text-[11px] text-[#4B5563]">
                      <p>{n.note}</p>
                      <span className="text-[9.5px] text-[#9CA3AF] block mt-0.5">
                        By {n.addedBy || 'Staff'} · {new Date(n.addedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[#9CA3AF] italic">No internal notes added yet.</p>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  placeholder="Add an internal dispatch or crafting note…"
                  className="flex-1 px-3 py-1.5 border border-[#D1CCC4] rounded-xs text-xs"
                />
                <button type="submit" className="btn btn-outline btn-xs">
                  Add Note
                </button>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-[#E8E2D9]">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-outline btn-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print GST Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="btn btn-primary-burgundy btn-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
