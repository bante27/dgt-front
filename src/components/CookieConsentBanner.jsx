import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Settings, Check } from 'lucide-react';

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setConsent(savedConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setConsent('accepted');
    setShowSettings(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setConsent('rejected');
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'customized');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setConsent('customized');
    setShowSettings(false);
  };

  if (consent) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Privacy & Cookie Settings</h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                We use essential cookies to ensure our secure authentication and platform functionality, as well as analytics cookies to enhance your learning & digital asset experience. Read our{' '}
                <a href="/privacy" className="text-indigo-400 underline hover:text-indigo-300">Privacy Policy</a>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Cookie Settings
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Cookie Preferences
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-300">
                Manage your cookie preferences below. Essential cookies cannot be disabled as they are required for secure session authentication.
              </p>

              {/* Essential Cookies */}
              <div className="flex items-start justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div>
                  <h4 className="font-medium text-white">Essential Cookies</h4>
                  <p className="text-xs text-slate-400 mt-1">Required for core functionality, security, and HttpOnly session cookies.</p>
                </div>
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div>
                  <h4 className="font-medium text-white">Analytics & Performance</h4>
                  <p className="text-xs text-slate-400 mt-1">Help us understand how users interact with courses and digital assets.</p>
                </div>
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div>
                  <h4 className="font-medium text-white">Marketing & Recommendations</h4>
                  <p className="text-xs text-slate-400 mt-1">Used to deliver personalized course recommendations and offers.</p>
                </div>
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
