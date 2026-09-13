import React, { useState } from 'react';
import { Plus, MapPin, Edit2, Trash2, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AddressModal from '../../components/account/AddressModal';

export default function AccountAddresses() {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = user?.addresses || [];

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleSave = (addrData) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addrData);
    } else {
      addAddress(addrData);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Secure Vault Logistics
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Saved Delivery & Vault Addresses
          </h2>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-primary-burgundy btn-sm flex items-center gap-2 text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm space-y-4">
          <MapPin className="w-10 h-10 text-[#B8935A] mx-auto" />
          <h4 className="font-serif text-xl font-medium text-[#2B2320]">
            No saved addresses
          </h4>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Add a primary vault or residence address for fast, 100% insured checkout delivery.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-primary-burgundy btn-sm inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 sm:p-6 rounded-sm border transition-all flex flex-col justify-between ${
                addr.isDefault
                  ? 'bg-white border-[#5C1A2E] shadow-sm ring-1 ring-[#5C1A2E]/20'
                  : 'bg-white border-[#E8E2D9] hover:border-[#B8935A]/50'
              }`}
            >
              <div className="space-y-3">
                {/* Tag & Default Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-[#FAF6F0] border border-[#E8E2D9] text-[#5C1A2E] rounded-xs">
                    {addr.tag || 'Residence'}
                  </span>
                  {addr.isDefault ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs">
                      <Check className="w-3 h-3" />
                      Default Vault
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[10.5px] text-[#6B7280] hover:text-[#5C1A2E] hover:underline"
                    >
                      Make Default
                    </button>
                  )}
                </div>

                {/* Name & Phone */}
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#2B2320]">
                    {addr.name}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5 font-mono">{addr.phone}</p>
                </div>

                {/* Address text */}
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {addr.addressLine1}
                  {addr.addressLine2 && <>, {addr.addressLine2}</>}
                  <br />
                  {addr.city}, {addr.state} — <strong className="font-mono text-[#2B2320]">{addr.pincode}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E8E2D9] text-xs">
                <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Insured PIN
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded-xs transition-colors"
                    title="Edit Address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Remove this address?')) {
                          deleteAddress(addr.id);
                        }
                      }}
                      className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <AddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingAddress}
      />
    </div>
  );
}
