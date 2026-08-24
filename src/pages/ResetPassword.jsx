import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility states for passwords
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp, newPassword });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative -mt-4 min-h-screen m-0 p-0 bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* Left Branding Panel matching Login design */}
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
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-widest uppercase">RESET PASSWORD</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Enter your verification OTP code and create a new secure password</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-xs text-red-600 font-medium border border-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3.5 rounded-xl bg-teal-50 text-xs text-teal-800 font-medium border border-[#b0e2e2] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
              />
            </div>

            {/* OTP Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">OTP Code</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
              />
            </div>

            {/* New Password with View Icon */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password with View Icon */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sticky/Fixed Position Action Button Container matching Login template */}
            <div className="sticky bottom-4 z-20 pt-2 bg-white/90 backdrop-blur-md pb-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-95"
              >
                <span>{loading ? 'Updating Password...' : 'Set New Password'}</span>
              </button>
            </div>
          </form>

          {/* Navigation Link */}
          <div className="pt-2 text-center text-xs text-slate-600 font-medium">
            Remembered your credentials?{' '}
            <Link to="/login" className="text-teal-800 font-extrabold hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}