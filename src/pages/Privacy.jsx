import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B1D3A] via-[#0F284A] to-[#142f56] py-16 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,102,255,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Privacy & Security</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Learn how MrHaile.com collects, uses, and safeguards your personal information when you use our video editing services and LMS platform.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">1. Information We Collect</h2>
            <p>
              When you interact with MrHaile.com in Addis Ababa, Ethiopia, we may collect personal details such as your name, email address, phone number, project files, and billing details provided during service inquiries or course enrollments.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">2. How We Use Your Information</h2>
            <p>
              Your information is used strictly to deliver professional video editing services, process digital asset purchases, grant LMS masterclass access, and communicate project status updates or support inquiries.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">3. Data Security & Confidentiality</h2>
            <p>
              We implement industry-standard security measures and encrypted channels to ensure your raw video footage, proprietary scripts, and personal data remain strictly confidential and protected against unauthorized access.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">4. Third-Party Services</h2>
            <p>
              We utilize trusted secure payment gateways and cloud storage providers for transaction verification and asset delivery. These third-party services adhere to strict privacy guidelines and do not share your data.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Lock className="w-5 h-5 text-blue-600" />
              <span>Last updated: August 2026</span>
            </div>
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-[#0B1D3A] hover:bg-[#142f56] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
            >
              <span>Contact Privacy Team</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
