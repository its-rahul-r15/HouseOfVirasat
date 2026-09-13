import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // If already logged in as admin, redirect directly
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.role === 'STAFF')) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const userData = await login(email, password, requires2FA ? totpCode : undefined);

      // Reject if not an admin role
      if (userData?.role !== 'SUPER_ADMIN' && userData?.role !== 'STAFF') {
        // Log out the patron who just logged in via admin portal
        setErrorMsg('Access denied. This portal is restricted to authorised House of Virasat administrators only.');
        setSubmitting(false);
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.message || 'Authentication failed.';

      // Server returns requires2FA flag via a specific message
      if (msg.toLowerCase().includes('2fa') || msg.toLowerCase().includes('totp') || msg === 'requires2FA') {
        setRequires2FA(true);
        setErrorMsg('');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4 py-16 font-sans">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#D4B884 1px, transparent 1px), linear-gradient(90deg, #D4B884 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Badge */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4B884] to-[#B8935A] mx-auto flex items-center justify-center shadow-lg shadow-[#D4B884]/20">
            <Shield className="w-7 h-7 text-[#0F0F0F]" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4B884]/70 block">
              House of Virasat
            </span>
            <h1 className="text-white font-serif text-2xl font-medium mt-1">
              {requires2FA ? 'Two-Factor Verification' : 'Admin Console'}
            </h1>
            <p className="text-[11px] text-[#6B7280] mt-1">
              {requires2FA
                ? 'Enter the 6-digit code from your authenticator app.'
                : 'Restricted access. Authorised personnel only.'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm p-7 shadow-2xl space-y-5">

          {/* Error */}
          {errorMsg && (
            <div role="alert" aria-live="polite" className="p-3 bg-red-950/50 border border-red-800/60 text-red-400 text-xs rounded-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {!requires2FA ? (
              <>
                {/* Email */}
                <div>
                  <label htmlFor="admin-email" className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#4B5563] absolute left-3 top-2.5" aria-hidden="true" />
                    <input
                      type="email"
                      id="admin-email"
                      required
                      autoComplete="username"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@houseofvirasat.com"
                      disabled={submitting}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xs text-white text-xs placeholder-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B884]/40 focus-visible:border-[#D4B884] transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="admin-password" className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#4B5563] absolute left-3 top-2.5" aria-hidden="true" />
                    <input
                      type="password"
                      id="admin-password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={submitting}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xs text-white text-xs placeholder-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B884]/40 focus-visible:border-[#D4B884] transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* 2FA Input */
              <div>
                <label htmlFor="admin-totp" className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
                  Authenticator Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#4B5563] absolute left-3 top-2.5" aria-hidden="true" />
                  <input
                    type="text"
                    id="admin-totp"
                    required
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    spellCheck={false}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    autoFocus
                    disabled={submitting}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xs text-white text-sm font-mono tracking-[0.3em] placeholder-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B884]/40 focus-visible:border-[#D4B884] transition-colors disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setRequires2FA(false); setTotpCode(''); }}
                  className="text-[10px] text-[#6B7280] hover:text-[#9CA3AF] mt-2 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4B884] rounded-xs"
                >
                  ← Back to credentials
                </button>
              </div>
            )}

            <button
              type="submit"
              id="admin-login-btn"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-[#D4B884] to-[#B8935A] text-[#0F0F0F] text-xs font-bold uppercase tracking-widest rounded-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B884]"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Authenticating…</span>
                </div>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{requires2FA ? 'Verify & Enter' : 'Access Console'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#3B3B3B] mt-6">
          House of Virasat · Admin Portal · All access attempts are logged
        </p>
      </div>
    </div>
  );
}
