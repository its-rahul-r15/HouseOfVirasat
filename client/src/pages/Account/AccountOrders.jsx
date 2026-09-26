import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  Download,
  ShieldCheck,
  Eye,
  Loader2,
} from 'lucide-react';
import { orderApi } from '../../api/order.api';
import KarigariTimeline from '../../components/account/KarigariTimeline';
import CertificateCard from '../../components/account/CertificateCard';

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    orderApi
      .getMyOrders()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setOrders(list);
      })
      .catch((err) => {
        console.warn('Could not load patron orders:', err);
        if (mounted) setOrders([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getStageFromStatus = (fulfilmentStatus, paymentStatus) => {
    if (fulfilmentStatus === 'DELIVERED') return 'DELIVERED';
    if (fulfilmentStatus === 'SHIPPED') return 'TRANSIT';
    if (fulfilmentStatus === 'READY_TO_DISPATCH' || fulfilmentStatus === 'QUALITY_CHECK') return 'QC';
    if (fulfilmentStatus === 'IN_PRODUCTION') return 'CRAFTING';
    return paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING';
  };

  const formattedOrders = orders.map((order) => {
    const firstItem = order.items?.[0];
    const product = typeof firstItem?.productId === 'object' ? firstItem.productId : null;
    const stage = getStageFromStatus(order.fulfilmentStatus, order.paymentStatus);

    return {
      id: order.referenceNumber || order._id,
      name: firstItem?.name || product?.name || 'Handcrafted Heritage Piece',
      itemsCount: order.items?.length || 1,
      purity: product?.purity ? `${product.purity} Hallmarked` : (product?.metalType || '925 Fine Silver'),
      total: order.total || 0,
      status: order.fulfilmentStatus ? order.fulfilmentStatus.replace(/_/g, ' ') : order.paymentStatus,
      stage,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
      eta: order.fulfilmentStatus === 'DELIVERED' ? 'Delivered' : 'In Crafting Pipeline',
      image: product?.heroImage || (Array.isArray(product?.gallery) && product.gallery[0]?.url) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      certificateNo: `HOV-CERT-${(order.referenceNumber || '0000').slice(-6)}`,
      raw: order,
    };
  });

  const filteredOrders = formattedOrders.filter((order) => {
    if (filter === 'ACTIVE') return order.stage !== 'DELIVERED';
    if (filter === 'DELIVERED') return order.stage === 'DELIVERED';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Patron Acquisitions
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Orders & Karigari Tracking
          </h2>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF6F0] border border-[#E8E2D9] rounded-xs text-xs">
          {[
            { key: 'ALL', label: 'All Heirlooms' },
            { key: 'ACTIVE', label: 'In Crafting / Transit' },
            { key: 'DELIVERED', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xs transition-all font-medium ${
                filter === tab.key
                  ? 'bg-[#5C1A2E] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#2B2320]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#5C1A2E] animate-spin" />
          <span className="text-xs text-[#6B7280]">Accessing your Patron Vault...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm space-y-4">
          <Package className="w-10 h-10 text-[#B8935A] mx-auto" />
          <h4 className="font-serif text-xl font-medium text-[#2B2320]">
            No orders found in your patron vault
          </h4>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Discover our handcrafted collections in certified 925 silver and hallmarked gold.
          </p>
          <Link to="/shop" className="btn btn-primary-burgundy btn-sm inline-flex items-center gap-2 mt-2">
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-6 shadow-2xs hover:border-[#B8935A]/50 transition-colors"
            >
              {/* Order Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9] text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-[#5C1A2E]">
                    {order.id}
                  </span>
                  <span className="text-[#9CA3AF]">|</span>
                  <span className="text-[#6B7280]">
                    Placed on {order.date}
                  </span>
                  <span className="text-[#9CA3AF]">|</span>
                  <span className="text-[#6B7280]">
                    Total: <strong className="text-[#2B2320]">₹{order.total.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-semibold ${
                      order.stage === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#5C1A2E]/10 text-[#5C1A2E] border border-[#5C1A2E]/20'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Product preview & details */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xs border border-[#E8E2D9] overflow-hidden shrink-0 bg-[#FAF6F0]">
                    <img
                      src={order.image}
                      alt={order.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-medium text-[#2B2320]">
                      {order.name}
                    </h4>
                    <p className="text-xs text-[#5C1A2E] font-medium mt-0.5">
                      {order.purity}
                    </p>
                    <p className="text-[11px] text-[#6B7280] mt-1 font-mono">
                      Certificate No: {order.certificateNo}
                    </p>
                  </div>
                </div>

                {/* Quick Document Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCertificate(
                        selectedCertificate === order.certificateNo ? null : order
                      )
                    }
                    className="btn btn-outline btn-xs flex items-center gap-1.5 text-[11px]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B8935A]" />
                    <span>{selectedCertificate === order ? 'Hide Certificate' : 'Purity Certificate'}</span>
                  </button>

                  <Link
                    to={`/track-order?ref=${order.id}`}
                    className="btn btn-outline btn-xs flex items-center gap-1.5 text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Tracking</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline btn-xs flex items-center gap-1.5 text-[11px]"
                    title="Download Tax Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Live Karigari Timeline */}
              <KarigariTimeline currentStage={order.stage} statusDate={order.eta} />

              {/* Inline Certificate preview if toggled */}
              {selectedCertificate === order && (
                <div className="pt-4 border-t border-[#E8E2D9] animate-[fadeIn_0.2s_ease]">
                  <CertificateCard
                    certificateNo={order.certificateNo}
                    productName={order.name}
                    purity={order.purity}
                    issueDate={order.date}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
