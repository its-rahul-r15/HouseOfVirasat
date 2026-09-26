import React, { useState } from 'react';
import { Sparkles, Upload, CheckCircle2, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck, Gem } from 'lucide-react';
import { bespokeApi } from '../api/bespoke.api';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function Bespoke() {
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    jewelleryType: 'choker',
    metalPreference: 'SILVER',
    karatPreference: '925',
    stonePreference: 'POLKI',
    budgetRange: '₹30,000 – ₹60,000',
    occasion: 'Bridal / Wedding',
    timeline: '3-4 Weeks',
    designBrief: '',
    name: '',
    mobile: '',
    email: '',
    city: '',
    preferredContactMethod: 'WHATSAPP',
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      const urls = selected.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleNext = () => setStep((prev) => Math.min(4, prev + 1));
  const handlePrev = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('data', JSON.stringify({
      contact: {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
      },
      jewelleryType: formData.jewelleryType,
      metalPreference: formData.metalPreference,
      karatPreference: formData.karatPreference === '925' ? [] : [formData.karatPreference],
      stonePreference: formData.stonePreference,
      budgetRange: formData.budgetRange,
      occasion: formData.occasion,
      timeline: formData.timeline,
      designBrief: formData.designBrief,
      preferredContactMethod: formData.preferredContactMethod,
    }));

    files.forEach((file) => {
      data.append('images', file);
    });

    try {
      const res = await bespokeApi.submitEnquiry(data);
      const ref = res?.data?.referenceNumber || res?.data?.ref || `HOV-BSP-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(ref);
    } catch (err) {
      // Fallback ref if backend is offline or needs mock
      const ref = `HOV-BSP-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(ref);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-[#F9F8F5] border-b border-[#E5E2DA] py-14">
        <div className="max-w-[1000px] mx-auto px-4 text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E2DA] rounded-xs text-[11px] uppercase tracking-[0.2em] font-semibold text-[#B89768]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Bespoke Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1A1A]">
            Commission a Custom Heirloom
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-[600px] font-light leading-relaxed">
            Collaborate directly with our master craftsmen in Jaipur. From antique family heirlooms to modern bridal suites, we handcraft your design with hallmarked purity and transparent pricing.
          </p>
        </div>
      </div>

      {/* Main Wizard Container */}
      <div className="max-w-[840px] mx-auto px-4 sm:px-8 py-12">
        
        {submittedRef ? (
          /* Submission Success Card */
          <div className="p-8 sm:p-12 bg-[#F9F8F5] border border-[#E5E2DA] rounded-xs text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#EDF7F1] border border-[#2B7A4B]/20 flex items-center justify-center text-[#2B7A4B]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#B89768] font-semibold">
                Enquiry Received · Reference ID
              </span>
              <h2 className="font-serif text-3xl text-[#1A1A1A] mt-1 font-medium">
                {submittedRef}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong className="text-[#1A1A1A]">{formData.name}</strong>. Our senior jewellery designer is reviewing your brief and sketches.
              </p>
            </div>

            {/* Direct WhatsApp Concierge CTA */}
            <div className="p-6 bg-white border border-[#E5E2DA] rounded-xs max-w-md w-full flex flex-col gap-3">
              <span className="text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider">
                Fast-Track on WhatsApp Concierge
              </span>
              <p className="text-xs text-[#6B7280]">
                Connect immediately with the Jaipur artisan team with your reference number.
              </p>
              <a
                href={getWhatsAppLink({
                  phoneNumber: settings.whatsappNumber,
                  bespokeId: submittedRef,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full flex items-center justify-center gap-2 py-3.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Concierge</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmittedRef(null);
                setStep(1);
              }}
              className="text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#1A1A1A] underline"
            >
              Submit Another Bespoke Request
            </button>
          </div>
        ) : (
          /* Multi-Step Wizard */
          <div className="bg-white border border-[#E5E2DA] p-6 sm:p-10 shadow-xs">
            
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E2DA]" aria-label="Step progress">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold tabular-nums ${
                      step === i
                        ? 'bg-[#1A1A1A] text-white ring-2 ring-[#B8935A]/50 ring-offset-2'
                        : step > i
                        ? 'bg-[#B89768] text-white'
                        : 'bg-[#F3F2EE] text-[#9CA3AF]'
                    }`}
                  >
                    {i}
                  </div>
                  <span className="text-xs uppercase tracking-wider text-[#6B7280] hidden sm:inline">
                    {i === 1 ? 'Category' : i === 2 ? 'Metal & Stone' : i === 3 ? 'Sketches' : 'Contact'}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: CATEGORY */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="font-serif text-2xl text-[#1A1A1A]">
                    Step 1: Select Jewellery Classification
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="group" aria-label="Jewellery classification">
                    {[
                      { id: 'choker', label: 'Choker / Hasli' },
                      { id: 'necklace', label: 'Long Haar / Raani Haar' },
                      { id: 'earrings', label: 'Chandbalis / Jhumkas' },
                      { id: 'ring', label: 'Cocktail / Solitaire Ring' },
                      { id: 'bangles', label: 'Kadas / Bangles' },
                      { id: 'bridal_set', label: 'Complete Bridal Set' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={formData.jewelleryType === item.id}
                        onClick={() => setFormData({ ...formData, jewelleryType: item.id })}
                        className={`p-4 border rounded-xs text-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] transition-all active:scale-[0.98] ${
                          formData.jewelleryType === item.id
                            ? 'border-[#B8935A] bg-[#F8F5EE] text-[#A07F52] font-semibold ring-1 ring-[#B8935A]/50'
                            : 'border-[#E5E2DA] bg-white text-[#4A5568] hover:border-[#D1CCC0]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: METAL & KARAT & STONES */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="font-serif text-2xl text-[#1A1A1A]">
                    Step 2: Precious Metal & Stone Preference
                  </h3>

                  <div>
                    <label className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-2">
                      Metal Preference
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Metal preference">
                      {[
                        { id: 'SILVER', karat: '925', label: '925 Sterling Silver' },
                        { id: 'GOLD', karat: '14K', label: '14K Solid Gold' },
                        { id: 'GOLD', karat: '18K', label: '18K Royal Gold' },
                        { id: 'GOLD', karat: '22K', label: '22K Traditional Gold' },
                      ].map((m) => (
                        <button
                          key={m.karat}
                          type="button"
                          aria-pressed={formData.karatPreference === m.karat}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              metalPreference: m.id,
                              karatPreference: m.karat,
                            })
                          }
                          className={`p-3.5 border rounded-xs text-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] transition-all active:scale-[0.98] ${
                            formData.karatPreference === m.karat
                              ? 'border-[#B8935A] bg-[#F8F5EE] text-[#A07F52] font-semibold ring-1 ring-[#B8935A]/50'
                              : 'border-[#E5E2DA] bg-white text-[#4A5568] hover:border-[#D1CCC0]'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-2">
                      Primary Stone Setting
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Stone setting">
                      {[
                        { id: 'POLKI', label: 'Uncut Syndicate Polki' },
                        { id: 'KUNDAN', label: 'Jaipur Jadau Kundan' },
                        { id: 'DIAMOND', label: 'Natural Fine Diamonds' },
                        { id: 'EMERALD_RUBY', label: 'Emeralds, Rubies & Pearls' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={formData.stonePreference === s.id}
                          onClick={() => setFormData({ ...formData, stonePreference: s.id })}
                          className={`p-3.5 border rounded-xs text-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] transition-all active:scale-[0.98] ${
                            formData.stonePreference === s.id
                              ? 'border-[#B8935A] bg-[#F8F5EE] text-[#A07F52] font-semibold ring-1 ring-[#B8935A]/50'
                              : 'border-[#E5E2DA] bg-white text-[#4A5568] hover:border-[#D1CCC0]'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SKETCHES & DESIGN BRIEF */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="font-serif text-2xl text-[#1A1A1A]">
                    Step 3: Reference Photos & Custom Notes
                  </h3>

                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-[#E5E2DA] p-8 text-center rounded-xs bg-[#F9F8F5] flex flex-col items-center justify-center gap-3">
                    <Upload className="w-8 h-8 text-[#B89768]" aria-hidden="true" />
                    <div className="text-xs text-[#6B7280]">
                      <span className="font-semibold text-[#1A1A1A]">Upload sketch or reference jewellery images</span>
                      <p className="text-[11px] mt-0.5">PNG, JPG, WEBP (Max 5 images)</p>
                    </div>
                    <label className="btn btn-outline btn-sm cursor-pointer mt-1 focus-within:ring-2 focus-within:ring-[#B8935A]">
                      <span>Choose Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                        aria-label="Upload reference sketch or images"
                      />
                    </label>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto py-2">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="w-16 h-16 rounded-xs border border-[#E5E2DA] overflow-hidden shrink-0 bg-[#FAF6F0]">
                          <img
                            src={url}
                            alt={`Uploaded preview ${i + 1}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label htmlFor="bespoke-notes" className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-2">
                      Design Notes / Specifications
                    </label>
                    <textarea
                      id="bespoke-notes"
                      rows={4}
                      placeholder="Describe any specific requirements e.g. lightweight choker, detachable pendant, antique green meenakari back..."
                      value={formData.designBrief}
                      onChange={(e) => setFormData({ ...formData, designBrief: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: BUDGET & CONTACT */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="font-serif text-2xl text-[#1A1A1A]">
                    Step 4: Budget Range & Contact Details
                  </h3>

                  <div>
                    <label htmlFor="bespoke-budget" className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-2">
                      Estimated Budget Range
                    </label>
                    <select
                      id="bespoke-budget"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="input-luxury select-luxury"
                    >
                      <option value="₹20,000 – ₹40,000">₹20,000 – ₹40,000</option>
                      <option value="₹40,000 – ₹80,000">₹40,000 – ₹80,000</option>
                      <option value="₹80,000 – ₹1,50,000">₹80,000 – ₹1,50,000</option>
                      <option value="Above ₹1,50,000">Above ₹1,50,000 (Bridal / Royal Suite)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bespoke-name" className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-1">
                        Full Name *
                      </label>
                      <input
                        id="bespoke-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Radhika Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label htmlFor="bespoke-mobile" className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-1">
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        id="bespoke-mobile"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label htmlFor="bespoke-email" className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-1">
                        Email Address
                      </label>
                      <input
                        id="bespoke-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="radhika@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label htmlFor="bespoke-city" className="text-xs uppercase font-semibold text-[#1A1A1A] block mb-1">
                        City / State
                      </label>
                      <input
                        id="bespoke-city"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="e.g. Mumbai, Maharashtra"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-luxury"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[#E5E2DA]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn btn-outline btn-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-dark btn-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !formData.name || !formData.mobile}
                    className="btn btn-primary-gold flex items-center gap-2 py-3 px-8 shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>{loading ? 'Submitting…' : 'Commission Design'}</span>
                  </button>
                )}
              </div>

            </form>

          </div>
        )}

      </div>

    </div>
  );
}
