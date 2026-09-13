import React, { useState } from 'react';
import { ShieldCheck, User, Calendar, Lock, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccountSettings() {
  const { user, updateUser } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    anniversary: user?.anniversary || '18 November',
    birthday: user?.birthday || '12 March',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser(profile);
    setSuccessMsg('Patron profile updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSuccessMsg('Password updated securely.');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Personal Sanctum
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Profile & Security Preferences
          </h2>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2 animate-[fadeIn_0.2s_ease]">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── 1. Profile Details Form ── */}
      <form onSubmit={handleProfileSubmit} className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D9]">
          <User className="w-4 h-4 text-[#5C1A2E]" />
          <h3 className="font-serif text-lg font-medium text-[#2B2320]">
            Patron Personal Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Email Address (Login ID)
            </label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Mobile Number (For Courier OTP)
            </label>
            <input
              type="tel"
              required
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>
        </div>

        {/* ── 2. Milestone Dates for Perks ── */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D9]">
            <Sparkles className="w-4 h-4 text-[#B8935A]" />
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2B2320]">
                Milestone & Anniversary Celebrations
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Receive private bespoke previews & commemorative silver gifts during your special month.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                Wedding Anniversary
              </label>
              <input
                type="text"
                value={profile.anniversary}
                onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })}
                placeholder="e.g. 18 November"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2320] mb-1">
                Birthday
              </label>
              <input
                type="text"
                value={profile.birthday}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                placeholder="e.g. 12 March"
                className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="btn btn-primary-burgundy btn-sm text-xs">
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* ── 3. Security & Password ── */}
      <form onSubmit={handlePasswordSubmit} className="space-y-5 pt-6 border-t border-[#E8E2D9]">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D9]">
          <Lock className="w-4 h-4 text-[#5C1A2E]" />
          <h3 className="font-serif text-lg font-medium text-[#2B2320]">
            Password & Security
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2320] mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-outline btn-sm text-xs">
            Update Security Password
          </button>
        </div>
      </form>
    </div>
  );
}
