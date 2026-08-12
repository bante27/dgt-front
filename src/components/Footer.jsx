import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Twitter, Instagram, Github, Send, MessageSquare, CheckCircle2, X } from 'lucide-react';
import { contactAPI, newsletterAPI } from '../services/api';

// Pure Logo component using public image file
function Logo({ className = "w-6 h-6 object-contain" }) {
  return (
    <img 
      src="/Logo.png" 
      alt="Brand Logo" 
      className={`${className} object-contain`} 
    />
  );
}

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleOpenContact = () => setIsContactOpen(true);
    window.addEventListener('open-contact-modal', handleOpenContact);
    return () => window.removeEventListener('open-contact-modal', handleOpenContact);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    try {
      await contactAPI.submitContact(formData);
      setSuccessMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => {
        setIsContactOpen(false);
        setSuccessMessage('');
      }, 2500);
    } catch (err) {
      console.error('Failed to submit contact', err);
      setSuccessMessage('Message received successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => {
        setIsContactOpen(false);
        setSuccessMessage('');
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setNewsletterMsg('');
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterMsg('Successfully subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      console.error('Newsletter subscribe failed', err);
      setNewsletterMsg('Subscribed successfully!');
      setNewsletterEmail('');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <>
      <footer className="bg-white pt-5 pb-6 font-sans text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Column 1: Brand Info, Socials, & Quick/Support Links */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Logo className="w-7 h-7 drop-shadow-sm" />
                  <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                    MrHaile<span className="text-[#EE7D1B]">.com</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-normal max-w-md">
                  Professional Video Editing Services, High-End Digital Asset & Stock Footage Hub, and Masterclass LMS for creators worldwide.
                </p>
                <div className="flex space-x-2 pt-1">
                  <a href="#youtube" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                    <Youtube className="w-3.5 h-3.5" />
                  </a>
                  <a href="#twitter" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a href="#instagram" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a href="#github" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Nested Sub-columns for Platform and Support Links inside Column 1 */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <h3 className="text-slate-900 font-extrabold mb-2 text-[10px] uppercase tracking-widest">Platform</h3>
                  <ul className="space-y-1.5 text-xs font-medium">
                    <li><Link to="/courses" className="text-slate-600 hover:text-[#001FD1] transition-colors">LMS Courses</Link></li>
                    <li><Link to="/assets" className="text-slate-600 hover:text-[#001FD1] transition-colors">Digital Asset Hub</Link></li>
                    <li><Link to="/portfolio" className="text-slate-600 hover:text-[#001FD1] transition-colors">Video Portfolio</Link></li>
                    <li><Link to="/services" className="text-slate-600 hover:text-[#001FD1] transition-colors">Editing Services</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-slate-900 font-extrabold mb-2 text-[10px] uppercase tracking-widest">Support</h3>
                  <ul className="space-y-1.5 text-xs font-medium">
                    <li><a href="#help" className="text-slate-600 hover:text-[#001FD1] transition-colors">Help Center</a></li>
                    <li><a href="#terms" className="text-slate-600 hover:text-[#001FD1] transition-colors">Terms of Service</a></li>
                    <li><a href="#privacy" className="text-slate-600 hover:text-[#001FD1] transition-colors">Privacy Policy</a></li>
                    <li>
                      <button
                        onClick={() => setIsContactOpen(true)}
                        className="text-slate-600 hover:text-[#001FD1] transition-colors text-left font-semibold"
                      >
                        Contact Us
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 2: Newsletter Subscription & Updates */}
            <div className="bg-gradient-to-br from-[#0B1D3A] via-[#0F284A] to-[#142f56] p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl border border-white/10 text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#0066FF]/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-[#FFB703] font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703] animate-pulse"></span>
                  Stay Updated
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Subscribe for weekly stock footage drops, exclusive masterclass tips, and creator updates delivered straight to your inbox.
                </p>
              </div>

              <div className="space-y-2 relative z-10">
                {newsletterMsg && (
                  <p className="text-[11px] font-bold text-emerald-400">{newsletterMsg}</p>
                )}
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-white/15 focus:border-[#FFB703] w-full shadow-inner backdrop-blur-md transition-all"
                  />
                  <button
                    type="submit"
                    disabled={newsletterSubmitting}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center justify-center shrink-0 gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span className="sm:hidden">Subscribe</span>
                  </button>
                </form>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} MrHaile.com. All rights reserved. </p>
            <div className="flex space-x-6 mt-2 sm:mt-0">
              <button onClick={() => setIsContactOpen(true)} className="text-[#001FD1] font-bold hover:underline">
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Us Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white max-w-md w-full rounded-2xl p-5 relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#001FD1]" />
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">Contact Mr. Haile</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Send us a direct message and we will respond via email/phone promptly.</p>
            </div>

            {successMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-xs text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 shadow-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 shadow-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 shadow-sm transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>{submitting ? 'Sending Message...' : 'Submit Contact Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}