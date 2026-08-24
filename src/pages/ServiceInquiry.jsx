import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { serviceAPI } from '../services/api';

// Brand Logo using public image file optimized for maximum display scale in the left panel
function Logo({ className = "w-full h-full object-contain" }) {
  return (
    <img 
      src="/Logo.png" 
      alt="Brand Logo" 
      className={`${className} object-contain`} 
    />
  );
}

export default function ServiceInquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'YouTube Video Editing',
    budget: '$300 - $600',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Strict Name Handler: Letters and Spaces only
  const handleNameChange = (e) => {
    const val = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(val)) {
      setFormData({ ...formData, name: val });
    }
  };

  // Strict Phone Handler: Numbers and Optional Leading '+'
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (/^\+?[0-9]*$/.test(val)) {
      setFormData({ ...formData, phone: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Additional Validation Checks
    if (formData.name.trim().length < 2) {
      setError('Please enter a valid full name (letters only).');
      return;
    }

    const cleanPhone = formData.phone.replace('+', '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      setError('Please enter a valid phone number (digits only, 7 to 15 numbers).');
      return;
    }

    setLoading(true);
    try {
      await serviceAPI.submitInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry', err);
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative -mt-4 min-h-screen m-0 p-0 bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* Left Branding Panel */}
      <div 
        className="hidden md:flex md:w-5/12 p-6 sm:p-8 md:p-12 flex-col justify-between items-center min-h-[420px] md:min-h-screen relative overflow-hidden md:sticky md:top-0 md:h-screen border-r border-slate-200/60 bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image.png)',
          backgroundColor: '#e4f8f8'
        }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-[#e4f8f8]/30 pointer-events-none z-0"></div>

        {/* Decorative Parallel Wave Lines Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" preserveAspectRatio="none">
            <g fill="none" stroke="#28E7D3" strokeWidth="0.8">
              <path d="M-100,100 C400,-50 800,700 1300,50" />
              <path d="M-100,125 C400,-25 800,725 1300,75" />
              <path d="M-100,150 C400,0 800,750 1300,100" />
              <path d="M-100,175 C400,25 800,775 1300,125" />
              <path d="M-100,200 C400,50 800,800 1300,150" />
              <path d="M-100,225 C400,75 800,825 1300,175" />
              <path d="M-100,250 C400,100 800,850 1300,200" />
              <path d="M-100,275 C400,125 800,875 1300,225" />
              <path d="M-100,300 C400,150 800,900 1300,250" />
              <path d="M-100,325 C400,175 800,925 1300,275" />
              <path d="M-100,350 C400,200 800,950 1300,300" />
              <path d="M-100,375 C400,225 800,975 1300,325" />
              <path d="M-100,400 C400,250 800,1000 1300,350" />
              <path d="M-100,425 C400,275 800,1025 1300,375" />
              <path d="M-100,450 C400,300 800,1050 1300,400" />
              <path d="M-100,475 C400,325 800,1075 1300,425" />
              <path d="M-100,500 C400,350 800,1100 1300,450" />
              <path d="M-100,525 C400,375 800,1125 1300,475" />
              <path d="M-100,550 C400,400 800,1150 1300,500" />
              <path d="M-100,575 C400,425 800,1175 1300,525" />
              <path d="M-100,600 C400,450 800,1200 1300,550" />
              <path d="M-100,625 C400,475 800,1225 1300,575" />
              <path d="M-100,650 C400,500 800,1250 1300,600" />
              <path d="M-100,675 C400,525 800,1275 1300,625" />
              <path d="M-100,700 C400,550 800,1300 1300,650" />
            </g>
          </svg>
        </div>

        {/* Top Header Badge */}
        <div className="w-full text-center relative z-10 pt-4">
          <span className="text-[13px] sm:text-xs font-semibold tracking-widest text-orange-600 uppercase bg-orange-100/80 px-3.5 py-1.5 rounded-full border border-orange-200/80 shadow-sm">
            Welcome to MrHaile Portal
          </span>
        </div>

        {/* Absolutely Centered Logo */}
        <div className="absolute inset-0 m-auto w-full max-w-[420px] h-48 sm:h-60 md:h-72 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
            {/* Shaded Backdrop Aura */}
            <div className="absolute inset-0 m-auto w-48 h-48 sm:w-64 sm:h-64 bg-teal-200/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute inset-0 m-auto w-36 h-36 sm:w-48 sm:h-48 bg-cyan-300/40 rounded-full blur-2xl pointer-events-none -z-10"></div>
            
            <Logo className="w-full h-full drop-shadow-2xl filter brightness-105 contrast-110" />
          </div>
        </div>

        {/* Diagonal Text flanking the logo */}
        <div className="absolute inset-0 m-auto w-full h-full flex items-center justify-between px-4 z-20 pointer-events-none">
          <div className="transform -rotate-12 translate-y-16">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wider text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] uppercase [-webkit-text-stroke:1.5px_black]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              GRAPHIC DESIGNING
            </h1>
          </div>

          <div className="transform rotate-12 translate-y-16">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wider text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] uppercase [-webkit-text-stroke:1.5px_black]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              VIDEO EDITING
            </h1>
          </div>
        </div>
      </div>

      {/* Right Form Area with Sticky Action Button Container matching Login structure */}
      <div className="w-full md:w-7/12 bg-white flex items-center justify-center p-6 sm:p-10 lg:p-4">
        <div className="max-w-md w-full space-y-6">
          
          <div className="space-y-0.5 text-center sm:text-left">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-widest uppercase">SERVICE INQUIRY</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Fill out your project details below to request a custom video editing quote</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-xs text-red-600 font-medium border border-red-100">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#e4f8f8] border border-[#b0e2e2] text-teal-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Inquiry Submitted Successfully!</h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                Thank you! Your project details have been received and we will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', serviceType: 'YouTube Video Editing', budget: '$300 - $600', message: '' });
                }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2 mt-2 transition-colors"
              >
                <span>Submit Another Inquiry</span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                />
              </div>

              {/* Service Type & Estimated Budget Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                  >
                    <option value="YouTube Video Editing">YouTube Video Editing</option>
                    <option value="Commercial Ad Promo">Commercial Ad Promo</option>
                    <option value="Music Video Color Grading">Music Video Color Grading</option>
                    <option value="Documentary Storytelling">Documentary Storytelling</option>
                    <option value="Real Estate Cinematic Edit">Real Estate Cinematic Edit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Estimated Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                  >
                    <option value="$150 - $300">$150 - $300</option>
                    <option value="$300 - $600">$300 - $600</option>
                    <option value="$600 - $1200">$600 - $1,200</option>
                    <option value="$1200+">$1,200+</option>
                  </select>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Project Details</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your vision and paste project link..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                />
              </div>

              {/* Sticky/Fixed Position Action Button Container matching Login template */}
              <div className="sticky bottom-4 z-20 pt-2 bg-white/90 backdrop-blur-md pb-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-95"
                >
                  <span>{loading ? 'Submitting Inquiry...' : 'Send Service Inquiry'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-slate-600 font-medium">
            Need immediate support?{' '}
            <Link
              to="/contact"
              className="text-teal-800 font-extrabold hover:underline"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}