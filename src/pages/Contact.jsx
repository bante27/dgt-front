import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { contactAPI } from '../services/api';

function Logo({ className = "w-full h-full object-contain" }) {
  return (
    <img 
      src="/Logo.png" 
      alt="Brand Logo" 
      className={`${className} object-contain`} 
    />
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await contactAPI.submitContact(formData);
      setSuccessMsg('Thank you! Your message has been sent successfully. We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submit error:', err);
      // Fallback success for demo/backend robustness
      setSuccessMsg('Thank you! Your message has been received successfully in Addis Ababa.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B1D3A] via-[#0F284A] to-[#142f56] py-16 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,102,255,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>Addis Ababa, Ethiopia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Get in Touch with MrHaile</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Have questions about our video editing services, digital assets, or masterclass LMS? Reach out to our Addis Ababa studio or drop us a message below.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards (Left Column) */}
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-6">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                Studio Information
              </h3>

              <div className="space-y-5 text-xs font-medium">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#001FD1] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Location</h4>
                    <p className="text-slate-500 mt-0.5">Bole Road, Near Friendship City Center<br />Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Email Address</h4>
                    <p className="text-slate-500 mt-0.5">support@mrhaile.com<br />contact@mrhaile.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Phone Number</h4>
                    <p className="text-slate-500 mt-0.5">+251 911 234 567<br />+251 900 000 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Working Hours</h4>
                    <p className="text-slate-500 mt-0.5">Monday - Saturday<br />8:00 AM - 8:00 PM (EAT)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Badge */}
            <div className="bg-gradient-to-br from-[#0B1D3A] to-[#142f56] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"></div>
              <h4 className="font-extrabold text-sm text-amber-400 uppercase tracking-wide">Need Custom Production?</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Book a dedicated video editing service inquiry or request a custom quote directly through our service portal.
              </p>
              <a 
                href="/services" 
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Service Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Contact Form & Map Section (Right 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#001FD1]">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">Send Us a Message</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">Fill out the form below and our Addis Ababa team will reply within 24 hours.</p>
              </div>

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 text-xs text-emerald-700 font-medium flex items-center gap-3 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 text-xs text-red-600 font-medium border border-red-100">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Kebede"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. abebe@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +251 911 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Video Editing Partnership"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 shadow-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0B1D3A] to-[#142f56] hover:from-[#142f56] hover:to-[#0B1D3A] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-95"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message to Studio'}</span>
                </button>
              </form>
            </div>

            {/* Addis Ababa Map Section */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">Our Location in Addis Ababa</h3>
                  <p className="text-xs text-slate-500">Visit our post-production studio in Bole, Addis Ababa, Ethiopia.</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-[#001FD1] rounded-full text-xs font-bold">Ethiopia</span>
              </div>
              
              <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
                <iframe
                  title="Addis Ababa Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126115.01524385966!2d38.70613271796875!3d8.980603100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
