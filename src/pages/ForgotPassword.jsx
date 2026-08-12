import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';

// Brand Logo using public image file
function Logo({ className = "w-10 h-10 object-contain" }) {
  return (
    <img 
      src="/Logo.png" 
      alt="Brand Logo" 
      className={`${className} object-contain`} 
    />
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setMessage('OTP sent to your email successfully.');
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row pt-0">
      
      {/* Left Branding Panel - Matching Login Page Gradient */}
      <div 
        className="w-full md:w-5/12 p-6 sm:p-8 md:p-12 flex flex-col justify-center items-center min-h-[220px] md:min-h-screen relative overflow-hidden md:sticky md:top-0 md:h-screen border-r border-slate-200/60"
        style={{
          background: 'linear-gradient(135deg, #e4f8f8 0%, #ffffff 100%)'
        }}
      >
        {/* Center Main Logo */}
        <div className="w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72 flex items-center justify-center">
          <Logo className="w-full h-full drop-shadow-md" />
        </div>
      </div>

      {/* Right Form Area - Matching Login Top Alignment */}
      <div className="w-full md:w-7/12 bg-white flex items-start justify-center p-6 sm:p-10 lg:p-4 pt-2 sm:pt-4">
        <div className="max-w-md w-full space-y-6">
          
          <div className="space-y-0.5 text-center sm:text-left">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-widest uppercase">FORGOT PASSWORD</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Enter your email address to receive a password reset OTP code</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-xs text-red-600 font-medium border border-red-100 flex items-center gap-2">
              <span>{error}</span>
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

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all transform active:scale-95"
            >
              <span>{loading ? 'Sending OTP...' : 'Send Reset OTP'}</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </form>

          {/* Return to Sign In Link */}
          <div className="pt-2 text-center text-xs text-slate-600 font-medium">
            Remembered your password?{' '}
            <Link to="/login" className="text-teal-800 font-extrabold hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}