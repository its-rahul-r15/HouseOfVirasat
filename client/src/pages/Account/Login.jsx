import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Crown, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, AlertCircle, CheckCircle2, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setErrorMsg('Please complete all required fields.');
          setSubmitting(false);
          return;
        }
        await register({ name, email, phone, password });
      } else {
        if (!email || !password) {
          setErrorMsg('Please enter both email and password.');
          setSubmitting(false);
          return;
        }
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Please verify credentials.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="bg-[#FAF6F0] min-h-screen font-sans pt-14 lg:pt-[112px] pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#E8E2D9] rounded-sm shadow-xl p-7 sm:p-9 space-y-6 relative overflow-hidden">
        {/* Top Crest */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#5C1A2E] text-[#D4B884] mx-auto flex items-center justify-center shadow-md ring-4 ring-[#FAF6F0]">
            <Crown className="w-7 h-7 stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8935A] block">
            House of Virasat
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2320]">
            {isRegister ? 'Enter The Patron Guild' : 'Sign In to Your Sanctum'}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {isRegister
              ? 'Join our private circle to access handcrafted karigari tracking and bespoke privileges.'
              : 'Welcome back. Access your certified heirlooms and private commissions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#FAF6F0] p-1 rounded-xs border border-[#E8E2D9] text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-center rounded-xs transition-all ${
              !isRegister
                ? 'bg-[#5C1A2E] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#2B2320]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-center rounded-xs transition-all ${
              isRegister
                ? 'bg-[#5C1A2E] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#2B2320]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div role="alert" aria-live="polite" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2 animate-[fadeIn_0.15s_ease]">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <>
              <div>
                <label htmlFor="register-name" className="block font-semibold text-[#2B2320] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" aria-hidden="true" />
                  <input
                    type="text"
                    id="register-name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Gayatri Devi"
                    className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-phone" className="block font-semibold text-[#2B2320] mb-1">
                  Mobile Number (For Courier OTP &amp; Tracking)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" aria-hidden="true" />
                  <input
                    type="tel"
                    id="register-phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="block font-semibold text-[#2B2320] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" aria-hidden="true" />
              <input
                type="email"
                id="auth-email"
                required
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@houseofvirasat.com"
                className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="auth-password" className="block font-semibold text-[#2B2320]">
                Password *
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert('Password reset instructions sent to your email.')}
                  className="text-[11px] text-[#5C1A2E] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5C1A2E] rounded-xs"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" aria-hidden="true" />
              <input
                type="password"
                id="auth-password"
                required
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]/20 focus-visible:border-[#5C1A2E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn btn-primary-burgundy btn-md text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1A2E]"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <>
                <span>{isRegister ? 'Register Patron Account' : 'Enter Sanctum'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-center gap-4 text-[10.5px] text-[#6B7280]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8935A]" aria-hidden="true" />
            256-Bit SSL Encrypted
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B8935A]" />
            BIS Authenticated
          </span>
        </div>
      </div>
    </div>
  );
}
