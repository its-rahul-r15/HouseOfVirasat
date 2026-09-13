import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MessageCircle,
  Calendar,
  ArrowRight,
  Clock,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { bespokeApi } from '../../api/bespoke.api';
import { useSettings } from '../../context/SettingsContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export default function AccountBespoke() {
  const { settings } = useSettings();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    bespokeApi
      .getMyBespoke()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setEnquiries(list);
      })
      .catch((err) => {
        console.warn('Could not load patron bespoke enquiries:', err);
        if (mounted) setEnquiries([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const formattedRequests = enquiries.map((req) => ({
    id: req.referenceNumber || req._id,
    title: req.designBrief || `${req.jewelleryType || 'Bespoke'} Commission`,
    category: req.jewelleryType || 'Private Commission',
    metal: req.metalPreference || (Array.isArray(req.karatPreference) && req.karatPreference.join(', ')) || 'Fine Precious Metal',
    gemstone: req.stonePreference || 'Custom Selected Polki / Gems',
    budget: req.budgetRange || 'Target Budget Specified',
    date: req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
    status: req.status ? req.status.replace(/_/g, ' ') : 'Consultation Under Review',
    karigarNote: req.crmHandoffNotes?.[req.crmHandoffNotes.length - 1]?.note || 'Our master atelier has received your design brief and is preparing the initial karigari assessment.',
    scheduledCall: null,
  }));

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Private Commissions
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Bespoke Atelier Consultations
          </h2>
        </div>
        <Link
          to="/bespoke"
          className="btn btn-primary-burgundy btn-sm flex items-center gap-2 text-xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Bespoke Request</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#5C1A2E] animate-spin" />
          <span className="text-xs text-[#6B7280]">Accessing your Bespoke Atelier Records...</span>
        </div>
      ) : formattedRequests.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF6F0] border border-[#E8E2D9] rounded-sm space-y-4">
          <Sparkles className="w-10 h-10 text-[#B8935A] mx-auto" />
          <h4 className="font-serif text-xl font-medium text-[#2B2320]">
            No active bespoke commissions
          </h4>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
            Create a one-of-a-kind heirloom designed exclusively for your wedding, anniversary, or private collection with our master karigars.
          </p>
          <Link to="/bespoke" className="btn btn-primary-gold btn-sm inline-flex items-center gap-2 mt-2">
            <span>Commission an Heirloom</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {formattedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-[#E8E2D9] rounded-sm p-6 sm:p-7 space-y-6 shadow-2xs"
            >
              {/* Request Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9]">
                <div>
                  <span className="text-[10.5px] font-mono text-[#6B7280]">
                    Reference ID: {req.id} · Requested {req.date}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#2B2320] mt-0.5">
                    {req.title}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-xs font-semibold bg-[#5C1A2E]/10 text-[#5C1A2E] border border-[#5C1A2E]/20 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {req.status}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
                    Metal Specification
                  </span>
                  <p className="font-medium text-[#2B2320] mt-1">{req.metal}</p>
                </div>

                <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
                    Gemstone & Jadau Style
                  </span>
                  <p className="font-medium text-[#2B2320] mt-1">{req.gemstone}</p>
                </div>

                <div className="p-3.5 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9]/70">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
                    Target Budget Range
                  </span>
                  <p className="font-semibold text-[#5C1A2E] mt-1">{req.budget}</p>
                </div>
              </div>

              {/* Master Karigar Note */}
              <div className="p-4 bg-[#FAF6F0] border-l-3 border-[#B8935A] rounded-r-xs space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B8935A]" />
                  <span className="font-bold text-[#2B2320]">
                    Master Karigar Atelier Update
                  </span>
                </div>
                <p className="text-[#4B5563] leading-relaxed italic">
                  "{req.karigarNote}"
                </p>
                {req.scheduledCall && (
                  <div className="flex items-center gap-2 pt-2 text-[#5C1A2E] font-medium">
                    <Calendar className="w-4 h-4 text-[#5C1A2E]" />
                    <span>Next Video Design Session: <strong>{req.scheduledCall}</strong></span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8E2D9]">
                <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B8935A]" />
                  Includes 3D CAD Renderings & Certified Stone Selection
                </span>
                <a
                  href={getWhatsAppLink({
                    phoneNumber: settings?.whatsappNumber,
                    customMessage: `Namaste! I am inquiring about my Bespoke Reference ${req.id} (${req.title}).`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary-gold btn-xs flex items-center gap-1.5 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Discuss on Concierge WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
