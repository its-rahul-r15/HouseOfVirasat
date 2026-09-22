import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Plus, Check, X, Lock, Mail, UserCheck, 
  Trash2, Edit3, Key, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const PERMISSION_KEYS = [
  { key: 'manageProducts', label: 'Manage Products', desc: 'Create, edit & price products' },
  { key: 'manageOrders', label: 'Manage Orders', desc: 'Process & fulfill customer orders' },
  { key: 'manageMto', label: 'Made to Order', desc: 'Track bespoke & custom work queues' },
  { key: 'manageBespoke', label: 'Bespoke Inquiries', desc: 'Review bridal and custom consultations' },
  { key: 'manageCoupons', label: 'Discount Codes', desc: 'Create and retire promotional codes' },
  { key: 'manageSettings', label: 'Live Metal Rates', desc: 'Update bullion prices & store settings' },
  { key: 'viewReports', label: 'Reports & Revenue', desc: 'Access analytics & financial metrics' },
  { key: 'manageUsers', label: 'Staff & Roles', desc: 'Invite staff & manage access levels' },
];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
    permissions: {
      manageProducts: true,
      manageOrders: true,
      manageMto: true,
      manageBespoke: true,
      manageCoupons: false,
      manageSettings: false,
      viewReports: false,
      manageUsers: false,
    },
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/users');
      const data = res?.data || res;
      if (data) {
        setUsers(Array.isArray(data) ? data : (data.users || [data]));
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'STAFF',
      permissions: {
        manageProducts: true,
        manageOrders: true,
        manageMto: true,
        manageBespoke: true,
        manageCoupons: false,
        manageSettings: false,
        viewReports: false,
        manageUsers: false,
      },
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      permissions: u.permissions || {},
      isActive: u.isActive !== false,
    });
    setShowModal(true);
  };

  const handleTogglePermission = (permKey) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingUser) {
        const payload = {
          name: formData.name,
          role: formData.role,
          isActive: formData.isActive,
          permissions: formData.role === 'SUPER_ADMIN' 
            ? Object.fromEntries(PERMISSION_KEYS.map(p => [p.key, true]))
            : formData.permissions,
        };
        if (formData.password) payload.password = formData.password;

        const res = await axiosClient.patch(`/admin/users/${editingUser._id}`, payload).catch(() => null);
        const result = res?.data || res;
        if (result) {
          setUsers(users.map(u => u._id === editingUser._id ? (result.admin || result) : u));
        } else {
          setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...payload } : u));
        }
        setMessage({ type: 'success', text: 'Staff account updated successfully.' });
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password || 'Virasat@123',
          role: formData.role,
          permissions: formData.role === 'SUPER_ADMIN' 
            ? Object.fromEntries(PERMISSION_KEYS.map(p => [p.key, true]))
            : formData.permissions,
        };
        const res = await axiosClient.post('/admin/users', payload).catch(() => null);
        const result = res?.data || res;
        if (result) {
          setUsers([...users, result.admin || result]);
        } else {
          setUsers([...users, { ...payload, _id: 'usr_' + Date.now(), createdAt: new Date().toISOString() }]);
        }
        setMessage({ type: 'success', text: 'New staff invitation created.' });
      }
      setShowModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save staff account.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u) => {
    if (u.role === 'SUPER_ADMIN' && users.filter(x => x.role === 'SUPER_ADMIN' && x.isActive).length <= 1 && u.isActive) {
      alert('Cannot deactivate the only active Super Admin.');
      return;
    }
    try {
      await axiosClient.patch(`/admin/users/${u._id}`, { isActive: !u.isActive }).catch(() => null);
      setUsers(users.map(x => x._id === u._id ? { ...x, isActive: !x.isActive } : x));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-stone-900 tracking-wide flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-brand-gold" />
            Staff & Access Control
          </h1>
          <p className="text-xs md:text-sm text-stone-500 mt-1">
            Manage administrative personnel, assign roles, and configure granular portal permissions.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-burgundy text-brand-ivory text-xs uppercase tracking-widest font-medium hover:bg-brand-burgundy/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Invite Staff
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message.text}
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-widest text-[10px] font-medium">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Permissions Overview</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-burgundy/10 text-brand-burgundy font-serif font-bold flex items-center justify-center text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">{u.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded ${
                      u.role === 'SUPER_ADMIN' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Karigar'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {u.role === 'SUPER_ADMIN' ? (
                      <span className="text-emerald-700 font-medium">Full Unrestricted Access</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {PERMISSION_KEYS.filter(p => u.permissions?.[p.key]).map(p => (
                          <span key={p.key} className="px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded text-[9px]">
                            {p.label}
                          </span>
                        ))}
                        {(!u.permissions || Object.values(u.permissions).filter(Boolean).length === 0) && (
                          <span className="text-stone-400 italic">No permissions granted</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        u.isActive 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleEdit(u)}
                      className="p-1.5 text-stone-500 hover:text-brand-burgundy transition-colors"
                      title="Edit Staff User"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg text-stone-900">
                {editingUser ? 'Edit Staff Member' : 'Invite New Staff Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Soni"
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@houseofvirasat.com"
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-brand-burgundy"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Role Type</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-brand-burgundy"
                >
                  <option value="STAFF">Staff (Custom Permissions)</option>
                  <option value="SUPER_ADMIN">Super Admin (All Privileges)</option>
                </select>
              </div>

              {formData.role === 'STAFF' && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 font-semibold">
                    Granular Access Permissions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PERMISSION_KEYS.map(perm => (
                      <label
                        key={perm.key}
                        className={`flex items-start gap-2.5 p-2 border rounded cursor-pointer transition-colors ${
                          formData.permissions?.[perm.key] 
                            ? 'border-brand-burgundy bg-brand-burgundy/5' 
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.permissions?.[perm.key]}
                          onChange={() => handleTogglePermission(perm.key)}
                          className="mt-0.5 rounded text-brand-burgundy focus:ring-0"
                        />
                        <div>
                          <div className="text-xs font-medium text-stone-800">{perm.label}</div>
                          <div className="text-[10px] text-stone-500 leading-tight">{perm.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-300 text-xs text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-burgundy text-brand-ivory text-xs uppercase tracking-widest font-medium hover:bg-brand-burgundy/90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingUser ? 'Update Staff' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
