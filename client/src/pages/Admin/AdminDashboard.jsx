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
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useSettings } from '../../context/SettingsContext';

export default function AdminDashboard() {
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    revenue: 485900,
    ordersCount: 14,
    mtoCount: 3,
    bespokeCount: 2,
    lowStockCount: 1,
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'HOV-2024-8842',
      customer: 'Gayatri Devi',
      total: 34500,
      paymentStatus: 'PAID',
      fulfilmentStatus: 'IN_PRODUCTION',
      date: 'Today, 2:15 PM',
      itemsCount: 1,
    },
    {
      id: 'HOV-2024-8841',
      customer: 'Vikramaditya Rathore',
      total: 78000,
      paymentStatus: 'PAID',
      fulfilmentStatus: 'CONFIRMED',
      date: 'Yesterday',
      itemsCount: 2,
    },
    {
      id: 'HOV-2024-8840',
      customer: 'Ananya Singhania',
      total: 21500,
      paymentStatus: 'PAID',
      fulfilmentStatus: 'DELIVERED',
      date: '04 Aug 2024',
      itemsCount: 1,
    },
  ]);

  const kpis = [
    {
      title: 'Total Revenue (MTH)',
      value: `₹${stats.revenue.toLocaleString('en-IN')}`,
      change: '+18.4% vs last month',
      icon: TrendingUp,
      color: '#5C1A2E',
      link: '/admin/orders',
    },
    {
      title: 'Orders Placed',
      value: stats.ordersCount,
      change: '12 fulfilled · 2 processing',
      icon: Package,
      color: '#B8935A',
      link: '/admin/orders',
    },
    {
      title: 'Active MTO Karigari',
      value: `${stats.mtoCount} Pieces`,
      change: 'Johari Workshop Crafting',
      icon: Hammer,
      color: '#5C1A2E',
      link: '/admin/mto',
    },
    {
      title: 'Bespoke Inquiries',
      value: `${stats.bespokeCount} Leads`,
      change: '1 requires video call',
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
          <Link
            to="/admin/products/new"
            className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </Link>
          <Link
            to="/admin/settings"
            className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs bg-white"
          >
            <Coins className="w-3.5 h-3.5 text-[#B8935A]" />
            <span>Update Rates</span>
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
                  {kpi.value}
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#5C1A2E]">
                      {order.id}
                      <span className="block text-[10px] text-[#9CA3AF] font-sans font-normal">
                        {order.date}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-[#2B2320]">
                      {order.customer}
                    </td>
                    <td className="p-3 font-semibold text-[#2B2320]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-semibold text-[#5C1A2E] bg-[#5C1A2E]/10 border border-[#5C1A2E]/20">
                        {order.fulfilmentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/orders?ref=${order.id}`}
                        className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] inline-flex items-center gap-1"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
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
                3 Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border border-[#E8E2D9] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#5C1A2E] text-[11px]">HOV-MTO-041</span>
                  <span className="text-[9.5px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    In Production
                  </span>
                </div>
                <p className="font-medium text-[#2B2320]">The Royal Mewar Polki Suite</p>
                <p className="text-[11px] text-[#6B7280]">Target: 15 Aug 2024</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#5C1A2E] text-[11px]">HOV-MTO-040</span>
                  <span className="text-[9.5px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    BIS Hallmarking
                  </span>
                </div>
                <p className="font-medium text-[#2B2320]">Padmavati Chandbali Emeralds</p>
                <p className="text-[11px] text-[#6B7280]">Target: 10 Aug 2024</p>
              </div>
            </div>

            <Link
              to="/admin/mto"
              className="btn btn-outline btn-xs w-full text-center flex items-center justify-center gap-1 text-xs"
            >
              <span>Manage Karigari Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick System Status */}
          <div className="bg-white border border-[#E8E2D9] rounded-sm p-5 space-y-3 text-xs">
            <h4 className="font-semibold text-[#2B2320] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Platform Health</span>
            </h4>
            <div className="space-y-2 text-[#6B7280] text-[11px]">
              <div className="flex justify-between">
                <span>Database Status:</span>
                <strong className="text-emerald-700">Connected (MongoDB)</strong>
              </div>
              <div className="flex justify-between">
                <span>Gateway Mode:</span>
                <strong className="text-[#2B2320]">Test (Razorpay)</strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping Aggregator:</span>
                <strong className="text-[#2B2320]">Shiprocket API</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
