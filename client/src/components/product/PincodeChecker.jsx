import React, { useState } from 'react';
import { Truck, AlertCircle } from 'lucide-react';

export default function PincodeChecker({ leadTimeDays = 3 }) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setResult({
        success: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    setChecking(true);
    setTimeout(() => {
      // Estimated delivery date calculation
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + leadTimeDays + 3);

      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      setResult({
        success: true,
        message: `Insured delivery to ${pincode} by ${formattedDate} via BlueDart / Sequel Logistics.`,
      });
      setChecking(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-2 font-sans">
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            spellCheck={false}
            maxLength={6}
            aria-label="Delivery PIN Code"
            placeholder="Enter Delivery PIN Code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="w-full py-2.5 px-3 bg-white border border-[#E5E2DA] rounded-xs text-xs text-[#1A1A1A] placeholder-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] tabular-nums"
          />
        </div>
        <button
          type="submit"
          disabled={checking}
          className="py-2.5 px-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {checking ? 'Checking…' : 'Check'}
        </button>
      </form>

      {result && (
        <div
          role={result.success ? 'status' : 'alert'}
          aria-live="polite"
          className={`flex items-start gap-2 text-xs p-2.5 rounded-xs border animate-in fade-in duration-200 ${
            result.success
              ? 'bg-[#EDF7F1] text-[#2B7A4B] border-[#2B7A4B]/20'
              : 'bg-[#FDF2F2] text-[#B91C1C] border-[#B91C1C]/20'
          }`}
        >
          {result.success ? (
            <Truck className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span className="tabular-nums">{result.message}</span>
        </div>
      )}
    </div>
  );
}
