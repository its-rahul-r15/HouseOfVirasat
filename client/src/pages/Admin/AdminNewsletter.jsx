import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { newsletterApi } from '../../api/newsletter.api';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 });
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState(null);

  const fetchSubscribers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await newsletterApi.getSubscribers({ page, limit: 50 });
      const data = res.data?.data || res.data || [];
      const pag = res.data?.pagination || { page: 1, limit: 50, total: data.length, pages: 1 };
      setSubscribers(data);
      setPagination(pag);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(1);
  }, []);

  const handleUnsubscribe = async (id, email) => {
    if (!window.confirm(`Are you sure you want to remove subscriber: ${email}?`)) return;
    try {
      setActionLoading(id);
      await newsletterApi.unsubscribe(id);
      setSubscribers((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setMsg({ type: 'success', text: `Removed subscriber ${email}` });
      setTimeout(() => setMsg(null), 4000);
    } catch (err) {
      console.error('Error removing subscriber:', err);
      setMsg({ type: 'error', text: 'Failed to remove subscriber' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = 'Email,Name,Source,Subscribed Date\n';
    const rows = filteredSubscribers
      .map(
        (s) =>
          `"${s.email || ''}","${s.name || ''}","${s.source || 'home_page'}","${
            s.createdAt ? new Date(s.createdAt).toISOString() : ''
          }"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `virasat-newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (s.email || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Audience & Growth
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Newsletter & VIP Subscribers
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Customers and patrons subscribed via "Stay Connected" section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSubscribers(pagination.page)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E8E2D9] text-[#2B2320] hover:bg-[#FAF6F0] rounded-xs text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C1A2E] text-white hover:bg-[#4A1525] rounded-xs text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Notification Feedback ── */}
      {msg && (
        <div
          className={`p-3 rounded-xs text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">
              Total Subscribers
            </span>
            <Users className="w-4 h-4 text-[#B8935A]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#2B2320]">
            {pagination.total || filteredSubscribers.length}
          </div>
          <span className="text-[10.5px] text-[#9CA3AF]">Active email opt-ins</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">
              Home Page Opt-ins
            </span>
            <Mail className="w-4 h-4 text-[#5C1A2E]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#2B2320]">
            {subscribers.filter((s) => (s.source || '').includes('home')).length}
          </div>
          <span className="text-[10.5px] text-[#9CA3AF]">From "Stay Connected"</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">
              Subscribed This Month
            </span>
            <Calendar className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#2B2320]">
            {
              subscribers.filter((s) => {
                if (!s.createdAt) return false;
                const d = new Date(s.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length
            }
          </div>
          <span className="text-[10.5px] text-[#9CA3AF]">Current billing cycle</span>
        </div>
      </div>

      {/* ── Table & Search Card ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-xs shadow-2xs overflow-hidden">
        {/* Search header */}
        <div className="p-4 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFAF6]">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscriber by email..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D1CCC0] rounded-xs text-xs text-[#2B2320] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>
          <span className="text-xs text-[#6B7280]">
            Showing <strong className="text-[#2B2320]">{filteredSubscribers.length}</strong> of{' '}
            <strong className="text-[#2B2320]">{pagination.total || filteredSubscribers.length}</strong>{' '}
            subscribers
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#6B7280] uppercase tracking-wider font-semibold border-b border-[#E8E2D9] text-[10.5px]">
              <tr>
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Subscriber Email</th>
                <th className="py-3 px-5">Origin / Source</th>
                <th className="py-3 px-5">Subscribed Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9] text-[#2B2320]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#9CA3AF]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B8935A]" />
                    <span>Loading subscribers...</span>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#9CA3AF]">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-[#D1CCC0] stroke-[1.25]" />
                    <p className="font-serif text-sm text-[#2B2320]">No subscribers found</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                      Subscribers from the home page "Stay Connected" section will appear here automatically.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((item, index) => {
                  const id = item._id || item.id || index;
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—';

                  return (
                    <tr key={id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="py-3.5 px-5 text-[#9CA3AF] font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-[#2B2320]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#FAF6F0] border border-[#E8E2D9] flex items-center justify-center text-[#5C1A2E] shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-medium text-xs text-[#2B2320] block">
                              {item.email}
                            </span>
                            {item.name && (
                              <span className="text-[10.5px] text-[#6B7280]">{item.name}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FAF6F0] border border-[#E8E2D9] rounded-xs text-[10.5px] font-mono text-[#5C1A2E]">
                          {item.source || 'home_newsletter'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-[#6B7280] text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#9CA3AF]" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleUnsubscribe(id, item.email)}
                          disabled={actionLoading === id}
                          title="Remove subscriber"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors text-xs font-medium disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
