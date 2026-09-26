import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Sparkles,
  MapPin,
  Heart,
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { orderApi } from '../../api/order.api';
import { bespokeApi } from '../../api/bespoke.api';
import KarigariTimeline from '../../components/account/KarigariTimeline';

export default function AccountOverview() {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();

  const [orders, setOrders] = useState([]);
  const [bespokeCount, setBespokeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      orderApi.getMyOrders(),
      bespokeApi.getMyBespoke(),
    ]).then(([ordersRes, bespokeRes]) => {
      if (!mounted) return;
      if (ordersRes.status === 'fulfilled') {
        const list = Array.isArray(ordersRes.value?.data)
          ? ordersRes.value.data
          : Array.isArray(ordersRes.value)
          ? ordersRes.value
          : [];
        setOrders(list);
      }
      if (bespokeRes.status === 'fulfilled') {
        const list = Array.isArray(bespokeRes.value?.data)
          ? bespokeRes.value.data
          : Array.isArray(bespokeRes.value)
          ? bespokeRes.value
          : [];
        setBespokeCount(list.length);
      }
      setLoading(false);
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

  const activeOrder = orders.find((o) => o.fulfilmentStatus !== 'DELIVERED') || orders[0];
  const activeProduct = activeOrder?.items?.[0]?.productId;
  const activeStage = activeOrder ? getStageFromStatus(activeOrder.fulfilmentStatus, activeOrder.paymentStatus) : 'CONFIRMED';

  const stats = [
    {
      label: 'Patron Orders',
      value: `${orders.length} ${orders.length === 1 ? 'Order' : 'Orders'}`,
      sub: orders.length > 0 ? (activeOrder?.fulfilmentStatus ? activeOrder.fulfilmentStatus.replace(/_/g, ' ') : 'Active') : 'No active orders',
      icon: Package,
      link: '/account/orders',
      color: '#5C1A2E',
    },
    {
      label: 'Bespoke Inquiries',
      value: `${bespokeCount} ${bespokeCount === 1 ? 'Consultation' : 'Consultations'}`,
      sub: bespokeCount > 0 ? 'Private Atelier' : 'Commission a piece',
      icon: Sparkles,
      link: '/account/bespoke',
      color: '#B8935A',
    },
    {
      label: 'Saved Heirlooms',
      value: `${wishlistCount || 0} ${wishlistCount === 1 ? 'Item' : 'Items'}`,
      sub: 'View Wishlist',
      icon: Heart,
      link: '/account/wishlist',
      color: '#5C1A2E',
    },
    {
      label: 'Vault Addresses',
      value: `${user?.addresses?.length || 0} Saved`,
      sub: user?.addresses?.length > 0 ? 'Delivery Vaults' : 'Add delivery pin',
      icon: MapPin,
      link: '/account/addresses',
      color: '#B8935A',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* ── 1. Royal Welcome Header Card ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5C1A2E] to-[#3B0E1B] text-white p-7 sm:p-9 rounded-sm shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4B884]/15 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#D4B884]">
              House of Virasat Guild
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-wide">
              Namaste, {user?.name || 'Patron'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-md leading-relaxed">
              Welcome to your private patron sanctum. Track ongoing handcrafted karigari, manage bespoke bridal suites, and access authenticated purity certificates.
            </p>
          </div>
          <div className="shrink-0 bg-black/30 backdrop-blur-sm border border-white/15 px-4 py-3 rounded-xs text-center">
            <span className="text-[9.5px] uppercase tracking-wider text-[#D4B884] block font-semibold">
              Patron Tier
            </span>
            <span className="font-serif text-base font-medium text-white">
              {user?.tier || 'Virasat Connoisseur'}
            </span>
            <span className="text-[10px] text-white/60 block mt-0.5 font-mono">
              Member Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Metric Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="p-4 bg-[#FAF6F0] hover:bg-[#F3EDE2] border border-[#E8E2D9] rounded-xs transition-all hover:border-[#B8935A]/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  {stat.label}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white border border-[#E8E2D9] group-hover:scale-105 transition-transform"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="font-serif text-xl font-medium text-[#2B2320]">
                  {stat.value}
                </span>
                <p className="text-[10.5px] text-[#B8935A] font-medium flex items-center gap-1 mt-0.5">
                  <span>{stat.sub}</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── 3. Active Order & Live Karigari Progress ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
              Current Atelier Creation
            </span>
            <h3 className="font-serif text-xl font-medium text-[#2B2320]">
              Active Karigari & Dispatch
            </h3>
          </div>
          <Link
            to="/account/orders"
            className="text-xs font-semibold text-[#5C1A2E] hover:text-[#B8935A] flex items-center gap-1 transition-colors"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Order Card or Empty prompt */}
        {activeOrder ? (
          <div className="bg-white border border-[#E8E2D9] rounded-sm p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xs border border-[#E8E2D9] overflow-hidden shrink-0 bg-[#FAF6F0]">
                  <img
                    src={
                      activeProduct?.heroImage ||
                      (Array.isArray(activeProduct?.gallery) && activeProduct.gallery[0]?.url) ||
                      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={activeOrder.items?.[0]?.name || 'Heirloom'}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div>
                  <span className="text-[10.5px] text-[#6B7280] font-mono">
                    Order Ref: {activeOrder.referenceNumber || activeOrder._id} · Placed{' '}
                    {activeOrder.createdAt
                      ? new Date(activeOrder.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recent'}
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#2B2320]">
                    {activeOrder.items?.[0]?.name || activeProduct?.name || 'Heritage Jewellery'}
                  </h4>
                  <p className="text-[11px] text-[#5C1A2E] font-medium">
                    {activeProduct?.purity ? `${activeProduct.purity} Hallmarked` : (activeProduct?.metalType || '925 Fine Silver')}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-sm font-bold text-[#2B2320] block">
                  ₹{(activeOrder.total || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  100% Insured Transit
                </span>
              </div>
            </div>

            {/* Timeline visualization */}
            <KarigariTimeline currentStage={activeStage} statusDate={activeOrder.fulfilmentStatus === 'DELIVERED' ? 'Delivered' : 'In Crafting Pipeline'} />
          </div>
        ) : (
          <div className="bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm p-8 text-center space-y-3">
            <Package className="w-8 h-8 text-[#B8935A] mx-auto" />
            <h4 className="font-serif text-base font-semibold text-[#2B2320]">
              No active crafting orders currently
            </h4>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Explore our master catalogue of jadau, polki, and fine 925 silver creations.
            </p>
            <Link to="/shop" className="btn btn-primary-burgundy btn-xs inline-flex items-center gap-1.5 mt-2">
              <span>Explore Master Catalogue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* ── 4. Patron Privilege Perks ── */}
      <div className="p-6 bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#B8935A]" />
          <h4 className="font-serif text-lg font-medium text-[#2B2320]">
            Patron Guild Privileges
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white border border-[#E8E2D9] rounded-xs space-y-1">
            <span className="font-semibold text-[#5C1A2E] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8935A]" />
              Lifetime Sonic Spa & Polish
            </span>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Complimentary cleaning & restoration for any Virasat heirloom at our Johari workshop.
            </p>
          </div>

          <div className="p-3.5 bg-white border border-[#E8E2D9] rounded-xs space-y-1">
            <span className="font-semibold text-[#5C1A2E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8935A]" />
              Priority Master Karigar Consult
            </span>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Direct 1-on-1 virtual design session with master artisans for bespoke bridal jewellery.
            </p>
          </div>

          <div className="p-3.5 bg-white border border-[#E8E2D9] rounded-xs space-y-1">
            <span className="font-semibold text-[#5C1A2E] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#B8935A]" />
              Anniversary Heirloom Gifting
            </span>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Curated silver coin & private preview invitation during your anniversary month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
