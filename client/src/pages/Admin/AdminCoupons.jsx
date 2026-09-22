import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Edit2, Check, ShieldCheck, AlertCircle, RefreshCw, X, Eye, EyeOff } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENT',
    value: 10,
    minOrderValue: 10000,
    maxDiscount: 3000,
    usageLimit: 100,
    validUntil: '2026-12-31',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get('/coupons');
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setCoupons(data);
      } else if (data?.coupons && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (c = null) => {
    setEditingCoupon(c);
    setError(null);
    if (c) {
      setFormData({
        code: c.code || '',
        type: c.type || 'PERCENT',
        value: c.value || 10,
        minOrderValue: c.minOrderValue || 0,
        maxDiscount: c.maxDiscount || 0,
        usageLimit: c.usageLimit || 100,
        validUntil: c.validUntil ? c.validUntil.slice(0, 10) : '2026-12-31',
        isActive: c.isActive !== false,
      });
    } else {
      setFormData({
        code: '',
        type: 'PERCENT',
        value: 10,
        minOrderValue: 10000,
        maxDiscount: 3000,
        usageLimit: 100,
        validUntil: '2026-12-31',
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      minOrderValue: Number(formData.minOrderValue) || 0,
      maxDiscount: Number(formData.maxDiscount) || undefined,
      usageLimit: Number(formData.usageLimit) || undefined,
      validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
      isActive: formData.isActive,
    };

    try {
      if (editingCoupon) {
        const id = editingCoupon._id || editingCoupon.id;
        await axiosClient.patch(`/coupons/${id}`, payload);
        setSuccess(`Coupon ${payload.code} updated successfully.`);
      } else {
        await axiosClient.post('/coupons', payload);
        setSuccess(`Coupon ${payload.code} created successfully.`);
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      console.error('Coupon save error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to save coupon.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    const id = c._id || c.id;
    if (!window.confirm(`Are you sure you want to delete coupon code "${c.code}"?`)) {
      return;
    }
    try {
      await axiosClient.delete(`/coupons/${id}`);
      setSuccess(`Coupon ${c.code} deleted.`);
      fetchCoupons();
    } catch (err) {
      console.error('Coupon delete error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to delete coupon.');
    }
  };

  const handleToggle = async (c) => {
    const id = c._id || c.id;
    try {
      await axiosClient.patch(`/coupons/${id}`, { isActive: !c.isActive });
      fetchCoupons();
    } catch (err) {
      console.error('Coupon toggle error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to update coupon status.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Promotions & Privilege Codes
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2320] mt-0.5">
            Discount Coupons & Privileges
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Configure percentage discounts, flat cart deductions, redemption thresholds, and expiration dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCoupons}
            className="p-2 border border-[#E8E2D9] rounded bg-white text-[#6B7280] hover:text-[#5C1A2E] hover:border-[#5C1A2E] transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Coupons Table ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] text-[#6B7280] uppercase tracking-wider text-[10px] bg-[#FAF6F0]">
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Discount Type</th>
                <th className="p-3.5">Min Order Value</th>
                <th className="p-3.5">Redemptions</th>
                <th className="p-3.5">Validity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {coupons.map((c) => {
                const cId = c._id || c.id;
                return (
                  <tr key={cId} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#5C1A2E] text-sm">
                      {c.code}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-[#2B2320]">
                        {c.type === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                      </span>
                      {c.maxDiscount && (
                        <span className="block text-[10.5px] text-[#6B7280]">
                          Max Capped: ₹{c.maxDiscount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-[#2B2320]">
                      ₹{(c.minOrderValue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-mono">
                      {c.usageCount ?? 0} / {c.usageLimit ?? '∞'}
                    </td>
                    <td className="p-3.5 text-[#6B7280]">
                      {c.validUntil ? new Date(c.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Expiry'}
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggle(c)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10px] font-bold transition-colors ${
                          c.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-300'
                        }`}
                      >
                        {c.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {c.isActive !== false ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(c)}
                        className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded transition-colors inline-flex"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B8935A]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-flex"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {coupons.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#6B7280]">
                    No coupons found. Click <strong>"Create Coupon"</strong> to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D9] rounded-sm max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
              <h3 className="font-serif text-lg font-medium text-[#2B2320]">
                {editingCoupon ? 'Edit Privilege Coupon' : 'Create New Privilege Coupon'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280] hover:text-[#2B2320]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#2B2320] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIRASAT15"
                  className="w-full px-3 py-2 font-mono uppercase border border-[#D1CCC4] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2B2320] mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs bg-white text-xs focus:outline-none focus:border-[#5C1A2E]"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Flat Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2B2320] mb-1">
                    {formData.type === 'PERCENT' ? 'Discount Rate (%) *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs font-mono text-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2B2320] mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs font-mono text-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2B2320] mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs font-mono text-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2B2320] mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs font-mono text-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2B2320] mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 p-2 border border-[#E8E2D9] rounded-xs bg-[#FAF6F0] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#5C1A2E] focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-[#2B2320]">
                    {formData.isActive ? 'Active & Redeemable' : 'Paused / Inactive'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xs text-xs text-[#6B7280] hover:bg-[#FAF6F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#5C1A2E] text-white rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-[#7A2B42] disabled:opacity-50 transition-all shadow-xs"
                >
                  {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
