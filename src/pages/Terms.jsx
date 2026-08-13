import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B1D3A] via-[#0F284A] to-[#142f56] py-16 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,102,255,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Please read these terms and conditions carefully before using MrHaile.com services, digital assets, and masterclass LMS courses.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and placing orders or enrolling in masterclasses on MrHaile.com (operated in Addis Ababa, Ethiopia), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our platform or services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">2. Video Editing Services & Revisions</h2>
            <p>
              All custom video editing projects include specific rounds of revisions as detailed in your selected package or contract. Additional revisions outside the scope of the agreement may incur supplementary charges. Turnaround times are estimated business days and begin once raw footage and project briefs are successfully received.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Digital Assets & Licensing</h2>
            <p>
              Digital assets, stock footage, sound effects, and LUT presets purchased from MrHaile.com are licensed for personal and commercial creative use according to the selected license tier. Redistribution, resale, or un-licensed public sharing of raw asset files is strictly prohibited.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">4. LMS Masterclasses & Refunds</h2>
            <p>
              Masterclass LMS course enrollments grant lifetime access to streaming course materials and downloadable resources. Due to the digital nature of our courses, refund requests are reviewed on a case-by-case basis within 7 days of purchase if course content has not been downloaded or substantially consumed.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">5. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Ethiopia, without regard to conflict of law principles. Any legal disputes arising from these terms shall be resolved in the courts of Addis Ababa, Ethiopia.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Last updated: August 2026</span>
            </div>
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-[#0B1D3A] hover:bg-[#142f56] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
