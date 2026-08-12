import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Layers, DollarSign, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { serviceAPI } from '../services/api';

function Logo({ className = "w-10 h-10 object-contain" }) {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row pt-0">
      
      {/* Left Branding Panel */}
      <div 
        className="w-full md:w-5/12 p-6 sm:p-8 md:p-12 flex flex-col justify-center items-center min-h-[220px] md:min-h-screen relative overflow-hidden md:sticky md:top-0 md:h-screen border-r border-slate-200/60"
        style={{
          background: 'linear-gradient(135deg, #e4f8f8 0%, #ffffff 100%)'
        }}
      >
        <div className="w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72 flex items-center justify-center">
          <Logo className="w-full h-full drop-shadow-md" />
        </div>
      </div>

      {/* Right Form Area */}
      <div className="w-full md:w-7/12 bg-white flex items-start justify-center p-6 sm:p-10 lg:p-4 pt-2 sm:pt-4">
        <div className="max-w-xl w-full space-y-6">
          
          <div className="space-y-0.5 text-center sm:text-left">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-widest uppercase">
              SERVICE INQUIRY
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Fill out your project details below to request a custom video editing quote
            </p>
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

              {/* Phone, Service & Budget Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
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

              {/* Message */}
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

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all transform active:scale-95"
              >
                <span>{loading ? 'Submitting Inquiry...' : 'Send Service Inquiry'}</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-slate-600 font-medium">
            Need immediate support?{' '}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
              className="text-teal-800 font-extrabold hover:underline"
            >
              Contact Us
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}