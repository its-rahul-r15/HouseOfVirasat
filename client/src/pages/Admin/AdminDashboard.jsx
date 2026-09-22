import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Hammer,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  Eye,
  Coins,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  FolderTree,
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useSettings } from '../../context/SettingsContext';

export default function AdminDashboard() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kpis: {
      today: { revenue: 0, ordersCount: 0 },
      month: { revenue: 0, ordersCount: 0 },
      lifetime: { revenue: 0, ordersCount: 0, totalOrdersCount: 0 },
      pendingFulfillments: 0,
      activeMto: 0,
      activeBespoke: 0,
      totalProducts: 0,
      totalCategories: 0,
    },
    recentOrders: [],
    recentMto: [],
    recentBespoke: [],
    lowStockAlerts: [],
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/dashboard');
      const payload = res?.data || res;
      if (payload && payload.kpis) {
        setData(payload);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    {
      title: 'Total Revenue (MTH)',
      value: `₹${(data?.kpis?.month?.revenue || 0).toLocaleString('en-IN')}`,
      change: `${data?.kpis?.month?.ordersCount || 0} orders this month`,
      icon: TrendingUp,
      color: '#5C1A2E',
      link: '/admin/orders',
    },
    {
      title: 'Total Orders',
      value: data?.kpis?.lifetime?.totalOrdersCount || data?.kpis?.lifetime?.ordersCount || 0,
      change: `${data?.kpis?.pendingFulfillments || 0} pending fulfillment`,
      icon: Package,
      color: '#B8935A',
      link: '/admin/orders',
    },
    {
      title: 'Active MTO Karigari',
      value: `${data?.kpis?.activeMto || 0} Pieces`,
      change: 'Johari Workshop Crafting',
      icon: Hammer,
      color: '#5C1A2E',
      link: '/admin/mto',
    },
    {
      title: 'Bespoke Inquiries',
      value: `${data?.kpis?.activeBespoke || 0} Leads`,
      change: 'Bridal & Custom Concierge',
      icon: Sparkles,
      color: '#B8935A',
      link: '/admin/bespoke',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* ── Top Welcome & Quick Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#5C1A2E]">
            Imperial Atelier Command
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2320]">
            Executive Store Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 border border-[#D1CCC4] rounded-xs hover:bg-[#FAF6F0] text-[#2B2320] transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#5C1A2E]' : ''}`} />
          </button>
          <Link
            to="/admin/categories"
            className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs bg-white"
          >
            <FolderTree className="w-3.5 h-3.5 text-[#5C1A2E]" />
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/products/new"
            className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              to={kpi.link}
              className="bg-white border border-[#E8E2D9] rounded-sm p-5 space-y-3 hover:border-[#B8935A]/50 transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280]">
                  {kpi.title}
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF6F0] border border-[#E8E2D9] group-hover:scale-105 transition-transform"
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
              </div>

              <div>
                <span className="font-serif text-2xl font-semibold text-[#2B2320]">
                  {loading ? '—' : kpi.value}
                </span>
                <p className="text-[11px] text-[#5C1A2E] font-medium mt-1 flex items-center justify-between">
                  <span>{kpi.change}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Middle Grid: Recent Orders & Quick MTO Queue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
                Recent Transactions
              </span>
              <h3 className="font-serif text-lg font-medium text-[#2B2320]">
                Latest Customer Orders
              </h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#5C1A2E] hover:text-[#B8935A] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D9] text-[#6B7280] uppercase tracking-wider text-[10px] bg-[#FAF6F0]">
                  <th className="p-3">Reference</th>
                  <th className="p-3">Patron</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-[#6B7280]">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#5C1A2E] inline mr-2" />
                      <span>Loading orders…</span>
                    </td>
                  </tr>
                ) : !data.recentOrders || data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#6B7280]">
                      <Package className="w-6 h-6 text-[#9CA3AF] mx-auto mb-1.5" />
                      <p className="font-medium text-[#2B2320]">No customer orders placed yet</p>
                      <p className="text-[11px] text-[#9CA3AF]">New incoming store orders will appear here in real-time.</p>
                    </td>
                  </tr>
                ) : (
                  data.recentOrders.map((order) => {
                    const formattedDate = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—';

                    return (
                      <tr key={order._id || order.referenceNumber} className="hover:bg-[#FAF6F0]/60 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#5C1A2E]">
                          {order.referenceNumber || order._id}
                          <span className="block text-[10px] text-[#9CA3AF] font-sans font-normal">
                            {formattedDate}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-[#2B2320]">
                          {order.customer?.name || 'Guest Patron'}
                        </td>
                        <td className="p-3 font-semibold text-[#2B2320]">
                          ₹{(order.total || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                            order.paymentStatus === 'PAID'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          }`}>
                            {order.paymentStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-semibold text-[#5C1A2E] bg-[#5C1A2E]/10 border border-[#5C1A2E]/20">
                            {order.fulfilmentStatus || 'CONFIRMED'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            to={`/admin/orders?ref=${order.referenceNumber || order._id}`}
                            className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] inline-flex items-center gap-1"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MTO & Bespoke Queue Snapshot (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* MTO Card */}
          <div className="bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-[#5C1A2E]" />
                <h4 className="font-serif text-base font-semibold text-[#2B2320]">
                  Made-to-Order Queue
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#5C1A2E] bg-white px-2 py-0.5 rounded border border-[#E8E2D9]">
                {data?.kpis?.activeMto || 0} Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {!data.recentMto || data.recentMto.length === 0 ? (
                <div className="p-4 bg-white border border-[#E8E2D9] rounded-xs text-center text-[#6B7280]">
                  <p className="font-medium text-[#2B2320]">No active MTO requests</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Custom pieces commissioned by patrons will appear here.</p>
                </div>
              ) : (
                data.recentMto.slice(0, 2).map((mto) => (
                  <div key={mto._id || mto.referenceNumber} className="p-3 bg-white border border-[#E8E2D9] rounded-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#5C1A2E] text-[11px]">
                        {mto.referenceNumber || mto._id}
                      </span>
                      <span className="text-[9.5px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {mto.status || 'SUBMITTED'}
                      </span>
                    </div>
                    <p className="font-medium text-[#2B2320] truncate">{mto.productName || 'Custom Commission'}</p>
                    <p className="text-[11px] text-[#6B7280]">Patron: {mto.customer?.name || 'Patron'}</p>
                  </div>
                ))
              )}
            </div>

            <Link
              to="/admin/mto"
              className="btn btn-outline btn-xs w-full text-center flex items-center justify-center gap-1 text-xs"
            >
              <span>Manage Karigari Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick System & Catalogue Status */}
          <div className="bg-white border border-[#E8E2D9] rounded-sm p-5 space-y-3 text-xs">
            <h4 className="font-semibold text-[#2B2320] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Platform & Catalogue Health</span>
            </h4>
            <div className="space-y-2 text-[#6B7280] text-[11px]">
              <div className="flex justify-between">
                <span>Active Products:</span>
                <strong className="text-[#2B2320]">{data?.kpis?.totalProducts || 0} listed</strong>
              </div>
              <div className="flex justify-between">
                <span>Catalogue Categories:</span>
                <strong className="text-[#2B2320]">{data?.kpis?.totalCategories || 0} active</strong>
              </div>
              <div className="flex justify-between">
                <span>Database Connection:</span>
                <strong className="text-emerald-700">Connected (MongoDB)</strong>
              </div>
              <div className="flex justify-between">
                <span>Gold Rate (24K / g):</span>
                <strong className="text-[#B8935A]">₹{settings?.goldRate24k || 7350}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
