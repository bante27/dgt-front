import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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

      {/* Right Form Area */}
      <div className="w-full md:w-7/12 bg-white flex items-center justify-center p-6 sm:p-10 lg:p-4">
        <div className="max-w-md w-full space-y-6">
          
          <div className="space-y-0.5 text-center sm:text-left">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-widest uppercase">WELCOME BACK</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Sign in to access your masterclass courses & assets</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-xs text-red-600 font-medium border border-red-100">
              {error}
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

            {/* Password with View Icon */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-800 hover:underline font-extrabold">
                  Forgot password?
                </Link>
              </div>
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

            {/* Sign In Action Button Container */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-95"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link & Socials */}
          <div className="space-y-4 pt-2">
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
                  <path fill="#FCA326" d="M.045 13.587l1.342 4.135c-.198.608-.85 1.03-1.488 1.03H12L.045 13.587z"/>
                </svg>
              </button>
            </div>

            <div className="text-center text-xs text-slate-600 font-medium pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-800 font-extrabold hover:underline">
                Sign Up
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}