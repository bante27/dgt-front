import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Send as TelegramIcon } from 'lucide-react';
import { contactAPI } from '../services/api';
import contactBgImage from '../assets/image2.png';

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
      const res = await contactAPI.submitContact(formData);
      setSuccessMsg(res.data?.message || 'Thank you! Your message has been sent successfully. We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans text-[12px] -mt-14 md:-mt-[104px]">
      
      {/* Hero Header - Medium height attached directly to header with zero gap */}
      <div className="relative pt-30 pb-14 px-4 sm:px-6 lg:px-8 text-white overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">
        <div className="absolute inset-0 z-0">
          <img 
            src={contactBgImage} 
            alt="Contact Studio" 
            className="w-full h-full object-cover opacity-30 contrast-125 brightness-105 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 via-amber-700/80 to-amber-900/85 backdrop-blur-[1px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 border border-white/30 text-amber-200 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md shadow">
            <MapPin className="w-3 h-3" />
            <span>Akaki Kality, Addis Ababa, Ethiopia</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight drop-shadow-md">Get in Touch with MrHaile</h1>
          <p className="text-[12px] text-amber-100 max-w-xl mx-auto font-semibold leading-relaxed drop-shadow">
            Akaki Kality video editing studio, masterclass support, and custom video production inquiries.
          </p>
        </div>
      </div>

      {/* Main Content Grid with Orange accent on left side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Contact Info Cards (Left Column with Orange accent / theme) */}
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-amber-500 space-y-5">
              <h3 className="text-[12px] font-extrabold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2.5">
                Studio Information
              </h3>

              <div className="space-y-4 font-medium text-[12px]">
                
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Location</h4>
                    <p className="text-slate-500 mt-0.5">Akaki Kality Sub City<br />Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Email Address</h4>
                    <p className="text-slate-500 mt-0.5">support@mrhaile.com<br />contact@mrhaile.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Phone Number</h4>
                    <p className="text-slate-500 mt-0.5">+251 978 168 825<br />+251 911 234 567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <TelegramIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Telegram Channel</h4>
                    <a 
                      href="https://t.me/haile" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-amber-600 font-bold hover:underline mt-0.5 inline-block"
                    >
                      @haile
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Working Hours</h4>
                    <p className="text-slate-500 mt-0.5">Monday - Saturday<br />8:00 AM - 8:00 PM (EAT)</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Support Badge */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <h4 className="font-extrabold text-[12px] text-white uppercase tracking-wide">Need Custom Production?</h4>
              <p className="text-amber-100 mt-1.5 leading-relaxed text-[12px]">
                Book a dedicated video editing service inquiry or request a custom quote directly through our service portal.
              </p>
              <a 
                href="/services" 
                className="mt-3.5 inline-block px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-amber-900 font-extrabold uppercase tracking-wider shadow transition-all"
              >
                Service Inquiry
              </a>
            </div>

          </div>

          {/* Contact Form & Map Section (Right 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-600">
                  <MessageSquare className="w-4 h-4" />
                  <h3 className="font-black text-slate-900 uppercase tracking-wide">Send Us a Message</h3>
                </div>
                <p className="text-slate-500 font-medium">Fill out the form below and our Akaki Kality team will reply within 24 hours.</p>
              </div>

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium flex items-center gap-2.5 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-600 font-medium border border-red-100">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Kebede"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. abebe@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +251 978 168 825"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Video Editing Partnership"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 shadow-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4 text-slate-900" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message to Studio'}</span>
                </button>
              </form>
            </div>

            {/* Akaki Kality Map Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wide">Our Location in Akaki Kality</h3>
                  <p className="text-slate-500">Visit our post-production studio in Akaki Kality, Addis Ababa, Ethiopia.</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">Akaki Kality</span>
              </div>
              
              <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
                <iframe
                  title="Akaki Kality Addis Ababa Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.0543765103415!2d38.7562!3d8.8789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1643b95a5f56a1b5%3A0x6b1db92c34d3b6f8!2sAkaki%20Kality%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
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
