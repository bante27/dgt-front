import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

export default function Register() {
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { refreshProfile, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Handlers for input restriction
  const handleFirstNameChange = (e) => {
    const val = e.target.value;
    if (/^[A-Za-z\s]*$/.test(val)) {
      setFirstName(val);
    }
  };

  const handleLastNameChange = (e) => {
    const val = e.target.value;
    if (/^[A-Za-z\s]*$/.test(val)) {
      setLastName(val);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (/^[\+0-9]*$/.test(val)) {
      setPhone(val);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authAPI.register({ firstName, lastName, phone, email, password });
      setMessage('Registration successful! Please check your email for the verification OTP code.');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    setResending(true);
    try {
      await authAPI.register({ firstName, lastName, phone, email, password });
      setMessage('A new OTP verification code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await authAPI.verifyRegistrationOtp({ email, otp });
      const { token } = res.data || res;
      if (token) {
        localStorage.setItem('token', token);
      }
      await refreshProfile();
      setMessage('Email verified successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setError('');
    if (window.google && window.google.accounts) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        scope: 'email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              setLoading(true);
              await googleLogin(tokenResponse.access_token);
              navigate('/dashboard');
            } catch (err) {
              setError(err.response?.data?.message || 'Google authentication failed.');
            } finally {
              setLoading(false);
            }
          }
        },
      });
      client.requestAccessToken();
    } else {
      setError('Google Sign-In is initializing. Please try again in a moment.');
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
        {/* Center Main Logo */}
        <div className="w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72 flex items-center justify-center">
          <Logo className="w-full h-full drop-shadow-md" />
        </div>
      </div>

      {/* Right Form Area */}
      <div className="w-full md:w-7/12 bg-white flex items-start justify-center p-6 sm:p-10 lg:p-4 pt-2 sm:pt-4">
        <div className="max-w-md w-full space-y-6">
          
          <div className="space-y-0.5 text-center sm:text-left">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-widest uppercase">
              {step === 'details' ? 'CREATE ACCOUNT' : 'VERIFY OTP CODE'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {step === 'details' 
                ? 'Fill in your details below to get started' 
                : `Enter the verification code sent to ${email}`}
            </p>
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

          {step === 'details' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={handleFirstNameChange}
                    placeholder="First name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Last name"
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
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                />
              </div>

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

              {/* Password with View Icon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all transform active:scale-95"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              
              {/* OTP Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Verification OTP Code</label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-[11px] font-bold text-teal-800 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                    <span>{resending ? 'Resending...' : 'Resend OTP'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 tracking-widest font-mono focus:outline-none focus:bg-white focus:border-[#b0e2e2] shadow-sm transition-all"
                />
              </div>

              {/* Verify Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all transform active:scale-95"
              >
                <span>{loading ? 'Verifying...' : 'Verify OTP & Complete'}</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-slate-600 font-medium hover:underline"
                >
                  ← Back to Details
                </button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          <div className="space-y-4 pt-2">
            {/* Divider & Social Login */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleGoogleClick}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-[#e4f8f8] hover:border-[#b0e2e2] transition-all shadow-sm"
                title="Continue with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.15v3.15C3.11 21.35 7.18 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.15C.42 8.09 0 9.77 0 12s.42 3.91 1.15 5.39l4.12-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.18 0 3.11 2.65 1.15 6.61l4.12 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => alert('GitHub Social Login')}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-[#e4f8f8] hover:border-[#b0e2e2] transition-all shadow-sm"
                title="Continue with GitHub"
              >
                <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => alert('GitLab Social Login')}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-[#e4f8f8] hover:border-[#b0e2e2] transition-all shadow-sm"
                title="Continue with GitLab"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#E24329" d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.866 0L17.42 9.452H6.58L3.917 1.263c-.135-.423-.73-.423-.866 0L.387 13.587c-.126.388.012.814.331 1.054L12 23.05l11.282-8.409c.319-.24.457-.666.333-1.054z"/>
                  <path fill="#FC6D26" d="M23.955 13.587l-1.342 4.135c-.198.608-.85 1.03-1.488 1.03H12l11.955-5.165z"/>
                  <path fill="#FCA326" d="M.045 13.587l1.342 4.135c.198.608.85 1.03 1.488 1.03H12L.045 13.587z"/>
                </svg>
              </button>
            </div>

            <div className="text-center text-xs text-slate-600 font-medium pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-800 font-extrabold hover:underline">
                Sign In
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

