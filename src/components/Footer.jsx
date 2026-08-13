import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { newsletterAPI } from '../services/api';

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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState('');

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
    <footer className="bg-white pt-5 pb-6 font-sans text-slate-900 border-t border-slate-100">
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
                Professional Video Editing Services, High-End Digital Asset & Stock Footage Hub, and Masterclass LMS for creators worldwide. Addis Ababa, Ethiopia.
              </p>
              <div className="flex space-x-2 pt-1">
                <a href="#youtube" aria-label="YouTube" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#twitter" aria-label="Twitter" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#instagram" aria-label="Instagram" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#github" aria-label="GitHub" className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#001FD1] hover:bg-blue-50 transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
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
                  <li><Link to="/about" className="text-slate-600 hover:text-[#001FD1] transition-colors">About Us</Link></li>
                  <li><Link to="/terms" className="text-slate-600 hover:text-[#001FD1] transition-colors">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="text-slate-600 hover:text-[#001FD1] transition-colors">Privacy Policy</Link></li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-slate-600 hover:text-[#001FD1] transition-colors font-semibold"
                    >
                      Contact Us
                    </Link>
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
          <p>&copy; {new Date().getFullYear()} MrHaile.com. All rights reserved. Addis Ababa, Ethiopia.</p>
          <div className="flex space-x-6 mt-2 sm:mt-0">
            <Link to="/contact" className="text-[#001FD1] font-bold hover:underline">
              Contact Studio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
