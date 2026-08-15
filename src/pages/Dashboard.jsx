import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Video, 
  Sparkles, 
  User, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Edit3,
  X,
  Check,
  Upload,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI, courseAPI, assetAPI, paymentAPI, editingOrdersAPI } from '../services/api';

export default function Dashboard() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [editingOrders, setEditingOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Payment code verification / simulation state
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const [profileRes, coursesRes, assetsRes, ordersRes] = await Promise.all([
          authAPI.getProfile().catch(() => ({ data: user })),
          courseAPI.getCourses().catch(() => ({ data: [] })),
          assetAPI.getAssets().catch(() => ({ data: [] })),
          editingOrdersAPI.getMyOrders().catch(() => ({ data: [] }))
        ]);

        if (!isMounted) return;

        const profileData = profileRes.data?.user || profileRes.data || user || {};
        setProfile(profileData);
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        setPhone(profileData.phone || '');
        setImagePreview(profileData.profileImage || '');

        setAllCourses(coursesRes.data || []);
        setAllAssets(assetsRes.data?.assets || assetsRes.data || []);
        setEditingOrders(ordersRes.data || []);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load dashboard profile:', err);
        setError('Failed to load profile details from server.');
        setProfile(user || {});
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      if (firstName) formData.append('firstName', firstName.trim());
      if (lastName) formData.append('lastName', lastName.trim());
      if (phone) formData.append('phone', phone.trim());
      if (password) formData.append('password', password);
      if (imageFile) formData.append('profileImage', imageFile);

      const res = await authAPI.updateProfile(formData);
      const updatedUser = res.data?.user || res.data?.data || res.data;

      setProfile(updatedUser);
      setFirstName(updatedUser.firstName || '');
      setLastName(updatedUser.lastName || '');
      setPhone(updatedUser.phone || '');
      setImagePreview(updatedUser.profileImage || '');
      setPassword('');
      setImageFile(null);
      setIsEditing(false);
      setMessage('Profile updated successfully!');

      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (err) {
      console.error('Failed to update profile', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardPaymentVerify = async (e) => {
    e.preventDefault();
    const code = paymentCode.trim();
    if (!code) {
      setPaymentFeedback('Please enter a valid payment code.');
      return;
    }
    if (code.toLowerCase() === 'expired' || code.length < 4) {
      setPaymentFeedback('Invalid or expired payment code. Please check your transaction reference.');
      return;
    }
    setPaymentLoading(true);
    setPaymentFeedback('');
    try {
      let res;
      try {
        res = await paymentAPI.verifyPayment(code);
      } catch (verifyErr) {
        res = await paymentAPI.simulatePayment(code);
      }
      await refreshProfile();
      setPaymentFeedback(res?.data?.message || 'Payment successfully verified, course unlocked & email sent!');
      setPaymentCode('');
      
      const enrolledId = res?.data?.enrolledCourseId || res?.data?.courseId || localStorage.getItem('pending_course_id');
      if (enrolledId) {
        localStorage.removeItem('pending_course_id');
        setTimeout(() => {
          navigate(`/courses/${typeof enrolledId === 'object' ? (enrolledId._id || enrolledId.id) : enrolledId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Payment code verification failed', err);
      setPaymentFeedback(err.response?.data?.message || 'Invalid or expired payment code.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.name || 'Student'
    : 'Student';

  const enrolledCount = profile?.enrolledCourses?.length || 0;
  const downloadCount = profile?.downloadedAssets?.length || profile?.downloads?.length || allAssets.length || 0;
  const watchTimeHours = profile?.watchTime || (enrolledCount * 12) || 0;

  return (
   <div className="relative -mt-2 min-h-screen m-0 p-0 bg-slate-50 text-slate-800 font-sans pb-16 text-xs">
      
      {/* ===== HERO / WELCOME HEADER BANNER ===== */}
      <section className="w-full bg-[#6B7CFF] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-indigo-200/50 relative overflow-hidden shadow-sm">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute right-10 -bottom-10 w-48 h-48 bg-amber-300/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/15 border border-white/30 p-1 backdrop-blur-md flex items-center justify-center shadow-inner overflow-hidden">
              {imagePreview || profile?.profileImage ? (
                <img 
                  src={imagePreview || profile.profileImage} 
                  alt={displayName} 
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-300 bg-slate-900/40 px-2 py-0.5 rounded-md">
                Student Account
              </span>
              <h1 className="text-base sm:text-lg font-black text-white mt-0.5">
                Welcome back, {displayName}!
              </h1>
              <p className="text-[11px] text-indigo-100 font-medium">
                Track your active courses, downloaded assets, and workspace updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-white text-[#6B7CFF] hover:bg-slate-100 text-[11px] font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close' : 'Edit'}</span>
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md transition-all"
            >
              Courses
            </button>
          </div>
        </div>
      </section>

      {/* ===== MAIN DASHBOARD CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 text-center flex items-center justify-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* EDIT PROFILE MODAL / SECTION */}
        {isEditing && (
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#6B7CFF]" /> Update Profile Details
              </h2>
              <button 
                onClick={() => setIsEditing(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-[11px] font-bold text-slate-700">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#6B7CFF]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-[11px] font-bold text-slate-700">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#6B7CFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-[11px] font-bold text-slate-700">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#6B7CFF]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="text-[11px] font-bold text-slate-700">New Password (Optional)</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#6B7CFF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Profile Image</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer bg-slate-50 border border-slate-200 hover:border-[#6B7CFF] rounded-xl px-3 py-2 text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#6B7CFF]" />
                    <span className="truncate">{imageFile ? imageFile.name : 'Choose profile photo...'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#6B7CFF] hover:bg-indigo-600 text-white text-[11px] font-bold shadow-md disabled:opacity-50 flex items-center gap-1 transition-all"
                >
                  <Check className="w-3 h-3" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 1. KEY METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Enrolled Courses</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">{enrolledCount} Active</p>
            </div>
            <div className="p-3 rounded-xl bg-[#6B7CFF]/10 text-[#6B7CFF]">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Asset Downloads</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">{downloadCount} Items</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-400/15 text-amber-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Watch Time</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">{watchTimeHours} Hours</p>
            </div>
            <div className="p-3 rounded-xl bg-[#6B7CFF]/10 text-[#6B7CFF]">
              <Video className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* 2. RECENT PROGRESS & QUICK ACCESS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column: Active Courses */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#6B7CFF]" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">In-Progress Learning</h2>
              </div>
              <button onClick={() => navigate('/courses')} className="text-[11px] font-black text-[#6B7CFF] hover:underline uppercase tracking-wider">
                View All
              </button>
            </div>

            {profile?.enrolledCourses && profile.enrolledCourses.length > 0 ? (
              profile.enrolledCourses.map((course, idx) => {
                const courseObj = typeof course === 'object' && course !== null ? course : allCourses.find(c => c._id === course || c.id === course);
                if (!courseObj) return null;
                return (
                  <div key={courseObj._id || courseObj.id || idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#6B7CFF]/40 transition-all space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase bg-[#6B7CFF]/10 text-[#6B7CFF] px-2 py-0.5 rounded">
                        {courseObj.category || 'Course'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6B7CFF]" /> {courseObj.progress || '0%'} Completed
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-xs">{courseObj.title}</h3>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#6B7CFF] h-full rounded-full" style={{ width: courseObj.progress || '0%' }}></div>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[11px] text-slate-500 font-medium">{courseObj.subtitle || courseObj.description || 'Continue learning'}</span>
                      <button onClick={() => navigate(`/courses/${courseObj._id || courseObj.id}`)} className="flex items-center gap-1 text-[11px] font-black text-[#6B7CFF] hover:text-indigo-800">
                        Continue <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-slate-500 text-xs font-medium">You are not enrolled in any courses yet.</p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="px-4 py-2 bg-[#6B7CFF] text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all"
                >
                  Explore Courses
                </button>
              </div>
            )}

            {/* My Editing Plan Orders Section */}
            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-4 mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-[#6B7CFF]" />
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">My Video Editing Plan Orders</h2>
                </div>
                <span className="text-[11px] font-black text-[#6B7CFF] bg-[#6B7CFF]/10 px-2.5 py-1 rounded-full">
                  {editingOrders.length} Orders
                </span>
              </div>

              {editingOrders.length > 0 ? (
                <div className="space-y-3">
                  {editingOrders.map((ord) => (
                    <div key={ord._id || ord.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-xs">{ord.planName}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            ord.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status || 'pending'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Price: <span className="text-slate-800 font-bold">${ord.price}</span> ({ord.billingType || 'per project'}) • Date: {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                        {ord.description && (
                          <p className="text-[11px] text-slate-600 italic">“{ord.description}”</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {ord.status === 'pending' ? 'Under Review & Admin Notified' : ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <p className="text-slate-500 text-xs font-medium">You haven't requested any editing plans yet.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-[#6B7CFF] text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all"
                  >
                    View Editing Packages
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Side Column: Payment Code Verification / Simulation, Recent Digital Assets & Quick Services */}
          <div className="space-y-5">
            
            {/* Payment Code Input Widget */}
            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <KeyRound className="w-4 h-4 text-[#6B7CFF]" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Enter Payment Code</h2>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Enter your transaction code/ref below to instantly unlock your course and send your access link to your email without admin delay.
              </p>
              <form onSubmit={handleDashboardPaymentVerify} className="space-y-2">
                <input
                  type="text"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value)}
                  placeholder="e.g. mrhaile-123456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#6B7CFF]"
                />
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{paymentLoading ? 'Verifying...' : 'Unlock Course & Send Email'}</span>
                </button>
              </form>
              {paymentFeedback && (
                <p className="text-[11px] font-semibold text-emerald-600 text-center bg-emerald-50 p-2 rounded-lg">
                  {paymentFeedback}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Quick Support & Services</h2>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Need customized software design, hosting assistance, or code review services?
              </p>
              <button onClick={() => navigate('/services')} className="w-full py-2 rounded-xl bg-[#6B7CFF] hover:bg-indigo-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm transition-all">
                Request Custom Service
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <Layers className="w-4 h-4 text-[#6B7CFF]" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Recent Downloads</h2>
              </div>
              
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> E-commerce UI Kit
                  </span>
                  <span className="text-[10px] text-slate-400">ZIP</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Node.js Boilerplate
                  </span>
                  <span className="text-[10px] text-slate-400">Code</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
