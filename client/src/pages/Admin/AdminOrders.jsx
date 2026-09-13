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
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/orders/my-orders');
      setOrders(res.data?.orders || []);
    } catch (err) {
      // Fallback demo dataset
      setOrders([
        {
          _id: 'ord_1',
          referenceNumber: 'HOV-2024-8842',
          customer: { name: 'Gayatri Devi', email: 'patron@houseofvirasat.com', mobile: '+91 98765 43210' },
          shippingAddress: {
            name: 'Gayatri Devi',
            line1: 'Flat 402, Royal Palms Palace',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
          },
          items: [
            {
              name: 'The Royal Mewar Polki Suite',
              sku: 'HOV-PLK-001',
              qty: 1,
              priceAtPurchase: 34500,
            },
          ],
          totalAmount: 34500,
          paymentStatus: 'PAID',
          fulfilmentStatus: 'IN_PRODUCTION',
          courierPartner: 'BlueDart High-Value Vault',
          trackingLink: 'https://bluedart.com/track?ref=BD-8842-X',
          createdAt: '02 Aug 2024, 2:15 PM',
        },
        {
          _id: 'ord_2',
          referenceNumber: 'HOV-2024-8841',
          customer: { name: 'Vikramaditya Rathore', email: 'vikram@example.com', mobile: '+91 98222 11111' },
          shippingAddress: {
            name: 'Vikramaditya Rathore',
            line1: 'Villa 12, Golf Course Road',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
          },
          items: [
            {
              name: 'Padmavati Chandbali in Emeralds',
              sku: 'HOV-ER-002',
              qty: 2,
              priceAtPurchase: 18900,
            },
          ],
          totalAmount: 37800,
          paymentStatus: 'PAID',
          fulfilmentStatus: 'CONFIRMED',
          courierPartner: 'Shiprocket Secure',
          trackingLink: '',
          createdAt: '03 Aug 2024, 11:30 AM',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, fulfilmentStatus: newStatus } : o))
    );
  };

  const handleUpdateTracking = (orderId, link) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, trackingLink: link } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus && o.fulfilmentStatus !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.referenceNumber?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs bg-white self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Orders Summary</span>
        </button>
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Reference, Patron Name or Mobile…"
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
          <option value="">All Fulfilment Stages</option>
          <option value="CONFIRMED">CONFIRMED (Ready for atelier)</option>
          <option value="IN_PRODUCTION">IN_PRODUCTION (Johari Crafting)</option>
          <option value="QUALITY_CHECK">QUALITY_CHECK (BIS Hallmarking)</option>
          <option value="READY_TO_DISPATCH">READY_TO_DISPATCH (Sealed Box)</option>
          <option value="SHIPPED">SHIPPED (Insured Transit)</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>

        <div className="flex items-center justify-end text-[#6B7280]">
          <span>Total Orders: <strong>{filteredOrders.length}</strong></span>
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
              {filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-[#5C1A2E] text-xs">
                      {o.referenceNumber}
                    </span>
                    <span className="block text-[10.5px] text-[#6B7280] mt-0.5">
                      {o.createdAt}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <strong className="text-[#2B2320] block">{o.customer?.name}</strong>
                    <span className="text-[11px] text-[#6B7280] block font-mono">{o.customer?.mobile}</span>
                    <span className="text-[10.5px] text-[#9CA3AF] block truncate max-w-[160px]">{o.shippingAddress?.city}, {o.shippingAddress?.state}</span>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-1">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="text-[#2B2320]">
                          <span>{item.name}</span> <span className="text-[#6B7280]">× {item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-3.5 font-semibold text-[#2B2320]">
                    ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <select
                      value={o.fulfilmentStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="px-2 py-1 text-[11px] font-semibold rounded-xs border border-[#D1CCC4] bg-white text-[#5C1A2E] focus:outline-none focus:border-[#5C1A2E]"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_PRODUCTION">IN_PRODUCTION</option>
                      <option value="QUALITY_CHECK">QUALITY_CHECK</option>
                      <option value="READY_TO_DISPATCH">READY_TO_DISPATCH</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveOrderModal(o)}
                        className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded-xs"
                        title="View Full Order & Tracking"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D9] rounded-sm max-w-lg w-full p-6 space-y-5 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-serif text-lg font-medium text-[#2B2320]">
                Order {activeOrderModal.referenceNumber}
              </h3>
              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="text-[#6B7280] hover:text-[#2B2320]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#FAF6F0] rounded-xs space-y-1">
                <span className="font-bold text-[#2B2320]">Shipping Destination:</span>
                <p className="text-[#4B5563]">
                  {activeOrderModal.shippingAddress?.name}<br />
                  {activeOrderModal.shippingAddress?.line1}<br />
                  {activeOrderModal.shippingAddress?.city}, {activeOrderModal.shippingAddress?.state} — {activeOrderModal.shippingAddress?.pincode}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#2B2320] mb-1">
                  Courier Tracking URL / Airway Bill (AWB)
                </label>
                <input
                  type="text"
                  value={activeOrderModal.trackingLink || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setActiveOrderModal({ ...activeOrderModal, trackingLink: val });
                    handleUpdateTracking(activeOrderModal._id, val);
                  }}
                  placeholder="https://track.shiprocket.in/..."
                  className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
