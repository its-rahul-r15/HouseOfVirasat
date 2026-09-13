import React, { useState, useEffect } from 'react';
import { X, MapPin, Check } from 'lucide-react';

export default function AddressModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    tag: 'Home / Primary Residence',
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        tag: 'Home / Primary Residence',
        isDefault: false,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      alert('Please fill all required fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="bg-white border border-[#E8E2D9] rounded-sm w-full max-w-lg shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF6F0] border-b border-[#E8E2D9]">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#5C1A2E]" />
            <h3 className="font-serif text-lg font-medium text-[#2B2320]">
              {initialData ? 'Edit Vault & Delivery Address' : 'Add New Vault Address'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[#6B7280] hover:text-[#2B2320] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Gayatri Devi"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Flat / House / Suite / Building *
            </label>
            <input
              type="text"
              required
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              placeholder="e.g. Flat 402, Royal Palms Palace"
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Street / Area / Landmark
            </label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              placeholder="e.g. Civil Lines, Near Raj Mandir"
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                City / Town *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Jaipur"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Rajasthan"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="302001"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Address Label / Tag
            </label>
            <select
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
            >
              <option value="Home / Primary Residence">Home / Primary Residence</option>
              <option value="Bridal Suite / Vault">Bridal Suite / Vault</option>
              <option value="Office / Secretariat">Office / Secretariat</option>
              <option value="Family Ancestral Home">Family Ancestral Home</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-[#5C1A2E] border-[#D1CCC4] rounded focus:ring-0"
              />
              <span className="text-xs text-[#2B2320] font-medium">
                Set as default delivery vault address
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#E8E2D9]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-burgundy btn-sm text-xs"
            >
              {initialData ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
