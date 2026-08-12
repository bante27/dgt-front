import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Home, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Vector Logo component using public image file
function Logo({ className = "w-14 h-14 object-contain" }) {
  return (
    <img 
      src="/Logo.png" 
      alt="Brand Logo" 
      className={`${className} object-contain`} 
    />
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
      setShowScrollButton(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user ? (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name) : '';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ===== HEADER: Smart Scroll Hide/Show Sticky 2-Tier Banner ===== */}
      <header className={`sticky z-50 w-full transition-all duration-300 ${
        showNavbar ? 'top-0' : '-top-36'
      }`}>
        {/* Tier 1: Mixed Blue & White Top Banner */}
        <div 
          className="border-b border-slate-200 w-full relative overflow-hidden shadow-lg"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, #001FD1 30%, #FFFFFF 70%) 0%, #FFFFFF 100%)'
          }}
        >
          {/* Geometric Triangle Background Shapes */}
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-[#001FD1]/15 transform rotate-45 pointer-events-none"></div>
          <div className="absolute right-1/4 -bottom-8 w-28 h-28 bg-amber-400/25 transform rotate-12 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#001FD1]/10 transform -rotate-45 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="flex items-center justify-between h-14 w-full">
              
              {/* Brand Logo & Social Links */}
              <div className="flex items-center space-x-6 transition-all duration-100 ease-in-out bg-slate-900/80 rounded-xl pl-3 pr-4 py-1.5 -ml-1">
                <Link to="/" className="flex items-center space-x-2.5 group">
                  <Logo className="w-8 h-8 object-contain transform group-hover:scale-105 transition-transform" />
                  <div>
                    <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-200 transition-colors">
                      MrHaile<span className="text-amber-300">.com</span>
                    </span>
                  </div>
                </Link>

                {/* Header Social Links */}
                <div className="hidden sm:flex items-center space-x-2 border-l border-white/20 pl-6">
                  <a
                    href="https://t.me/wubante"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 text-white hover:bg-white/25 border border-white/20 text-[11px] font-bold transition-all shadow-sm"
                    title="Telegram"
                  >
                    <Send className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href="https://wa.me/251927993894"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 text-white hover:bg-white/25 border border-white/20 text-[11px] font-bold transition-all shadow-sm"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Side: User Account / Login */}
              <div className="hidden md:flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/dashboard" className="flex items-center space-x-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/20 hover:bg-slate-900 transition-all">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={displayName} className="w-5 h-5 rounded-full object-cover border border-amber-300" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-amber-300" />
                      )}
                      <span className="text-xs font-extrabold text-white">{displayName}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-xl bg-rose-950/60 text-rose-200 hover:bg-rose-900/80 border border-rose-500/30 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-slate-900 hover:text-[#001FD1] text-xs font-extrabold px-3 py-2 uppercase transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg transition-all">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Trigger */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2.5 rounded-xl bg-slate-900 text-white border border-white/20"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Tier 2: Light Navigation Bar Without Bottom Border Line */}
        <div className="bg-[#e4f8f8] w-full shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <nav className="py-2.5">
              <div className="flex items-center justify-center space-x-10 w-full overflow-x-auto">
                <Link
                  to="/courses"
                  className="text-xs font-extrabold tracking-wider uppercase text-[#173f46] hover:text-[#0f766e] transition-colors whitespace-nowrap"
                >
                  Courses
                </Link>
                <Link
                  to="/assets"
                  className="text-xs font-extrabold tracking-wider uppercase text-[#173f46] hover:text-[#0f766e] transition-colors whitespace-nowrap"
                >
                  Asset Hub
                </Link>
                <Link
                  to="/portfolio"
                  className="text-xs font-extrabold tracking-wider uppercase text-[#173f46] hover:text-[#0f766e] transition-colors whitespace-nowrap"
                >
                  Portfolio
                </Link>
                <Link
                  to="/services"
                  className="text-xs font-extrabold tracking-wider uppercase text-[#173f46] hover:text-[#0f766e] transition-colors whitespace-nowrap"
                >
                  Services
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== MOBILE DROPDOWN ===== */}
      {isOpen && (
        <div className="md:hidden fixed top-24 left-3 right-3 z-50 bg-[#0A192F] border border-white/15 px-5 pt-4 pb-6 space-y-3 rounded-2xl shadow-2xl backdrop-blur-2xl animate-fade-in text-white">
          <div className="flex items-center justify-between border-b pb-3 border-white/10">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFB703]">Navigation Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <Link to="/courses" onClick={() => setIsOpen(false)} className="block py-2 font-extrabold text-xs uppercase border-b border-white/5">
            Courses
          </Link>
          <Link to="/assets" onClick={() => setIsOpen(false)} className="block py-2 font-extrabold text-xs uppercase border-b border-white/5">
            Digital Asset Hub
          </Link>
          <Link to="/portfolio" onClick={() => setIsOpen(false)} className="block py-2 font-extrabold text-xs uppercase border-b border-white/5">
            Portfolio
          </Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="block py-2 font-extrabold text-xs uppercase border-b border-white/5">
            Services
          </Link>
          <div className="pt-3 flex flex-col space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#0066FF] text-white font-extrabold text-xs uppercase shadow-sm">
                  <User className="w-3.5 h-3.5 text-[#FFB703]" />
                  <span>Dashboard ({displayName})</span>
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setIsOpen(false)} className="py-3 text-center rounded-xl bg-white/10 text-white font-extrabold text-xs uppercase border border-white/20">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="py-3 text-center rounded-xl bg-[#FFB703] text-[#0B1D3A] font-extrabold text-xs uppercase shadow-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== BACK‑TO‑TOP BUTTON ===== */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 p-3 bg-[#FFB703] text-[#0B1D3A] rounded-full shadow-xl hover:bg-[#e09f02] transition-all transform hover:scale-110 active:scale-95 border border-white/20 animate-fade-in"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* ===== MOBILE BOTTOM DOCK ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1D3A]/95 border-t border-white/10 px-4 py-2 flex items-center justify-around backdrop-blur-xl shadow-lg">
        <Link to="/" className="flex flex-col items-center text-gray-300 hover:text-[#FFB703]">
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-extrabold mt-0.5 uppercase">Home</span>
        </Link>
        <Link to="/courses" className="flex flex-col items-center text-gray-300 hover:text-[#FFB703]">
          <span className="text-[9px] font-extrabold mt-0.5 uppercase">Courses</span>
        </Link>
        <Link to="/assets" className="flex flex-col items-center text-gray-300 hover:text-[#FFB703]">
          <span className="text-[9px] font-extrabold mt-0.5 uppercase">Assets</span>
        </Link>
        <Link to="/services" className="flex flex-col items-center text-gray-300 hover:text-[#FFB703]">
          <span className="text-[9px] font-extrabold mt-0.5 uppercase">Service</span>
        </Link>
        <Link to={user ? "/dashboard" : "/login"} className="flex flex-col items-center text-gray-300 hover:text-[#FFB703]">
          <User className="w-4 h-4 text-[#FFB703]" />
          <span className="text-[9px] font-extrabold mt-0.5 uppercase">{user ? 'Account' : 'Login'}</span>
        </Link>
      </div>
    </>
  );
}