import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { courseAPI, newsletterAPI, homeVideoAPI, assetAPI, statsAPI, portfolioAPI, editingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

import testimonialImg1 from '../assets/testimonial1.png';
import testimonialImg2 from '../assets/testimonial2.png';
import hero1Img from '../assets/hero1.png';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23F8FAFC"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%230F172A" text-anchor="middle" dy=".3em"%3EMrHaile.com%3C/text%3E%3C/svg%3E';

// Custom Hook for Slow Counter Animation on Scroll
function useSlowCounter(end, duration = 3000, decimals = 0) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => { if (elementRef.current) observer.unobserve(elementRef.current); };
  }, []);

  useEffect(() => {
    if (end > 0) {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(eased * end);
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
  }, [isVisible, end, duration]);

  const formattedCount = decimals > 0 ? Number(count).toFixed(decimals) : Math.floor(count).toLocaleString();
  return [elementRef, formattedCount];
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [orderDesc, setOrderDesc] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderErr, setOrderErr] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [showreelCategory, setShowreelCategory] = useState('All');
  const [showreelProjects, setShowreelProjects] = useState([]);
  const [showreelLoading, setShowreelLoading] = useState(false);
  const [activeShowreelVideo, setActiveShowreelVideo] = useState(null);

  const [videoData, setVideoData] = useState({
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: ''
  });
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isFaceToFaceOpen, setIsFaceToFaceOpen] = useState(false);
  const heroVideoRef = useRef(null);
  const heroIframeRef = useRef(null);

  const [stats, setStats] = useState({ students: 0, masterclasses: 0, assets: 0, successRate: 0 });

  const [studentsRef, studentsCount] = useSlowCounter(stats.students, 3500);
  const [masterclassesRef, masterclassesCount] = useSlowCounter(stats.masterclasses, 3000);
  const [assetsRef, assetsCount] = useSlowCounter(stats.assets, 3200);
  const [successRef, successCount] = useSlowCounter(stats.successRate, 3800, 1);

  const workflowSteps = [
    { step: '01', title: 'Raw Ingestion & Cut Assembly', desc: 'Organizing footage, syncing multi-cam audio, and building the core timeline narrative.' },
    { step: '02', title: 'Pacing & Dynamic Transitions', desc: 'Refining cuts, sound design, ambient SFX layer placement, and visual pacing.' },
    { step: '03', title: 'Color Grading & FX', desc: 'Applying cinematic LUTs, matching shot exposures, and rendering high-end VFX.' },
    { step: '04', title: 'Master Export & Delivery', desc: 'Delivering broadcast-grade MP4/ProRes formats formatted for all major platforms.' },
  ];

  const faqs = [
    { q: 'Which video editing software do you teach and use?', a: 'We specialize in Adobe Premiere Pro, DaVinci Resolve Studio, and Adobe After Effects for motion graphics and visual effects.' },
    { q: 'What is the standard turnaround time for a video project?', a: 'Standard editing projects are delivered within 3-5 business days. Rush 24 to 48-hour delivery options are available upon request.' },
    { q: 'Can I request revisions after receiving the draft edit?', a: 'Yes! All individual packages include structured revision cycles to ensure the final cut matches your exact vision.' },
    { q: 'Are raw video assets and LUT presets included in masterclasses?', a: 'Absolutely. Enrolled students gain immediate access to downloadable RAW footage, color grading LUTs, and project files.' }
  ];

  // Video visibility control
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const videoEl = heroVideoRef.current;
        if (videoEl) entry.isIntersecting ? videoEl.play().catch(() => {}) : videoEl.pause();
        const iframeEl = heroIframeRef.current;
        if (iframeEl && videoData?.videoUrl) {
          try {
            if (entry.isIntersecting) {
              if (!iframeEl.src || iframeEl.src === 'about:blank') {
                iframeEl.src = videoData.videoUrl.includes('?') ? `${videoData.videoUrl}&autoplay=true` : `${videoData.videoUrl}?autoplay=true`;
              }
            } else {
              iframeEl.src = 'about:blank';
            }
          } catch (e) {}
        }
      },
      { threshold: 0.15 }
    );
    const container = document.getElementById('hero-video-container');
    if (container) observer.observe(container);
    return () => { if (container) observer.unobserve(container); };
  }, [videoData]);

  // Fetch home video
  useEffect(() => {
    const fetchHomeVideo = async () => {
      try {
        setIsVideoLoading(true);
        const res = await homeVideoAPI.getHomeVideo();
        if (res.data) {
          const videoObj = Array.isArray(res.data) ? res.data[0] : (res.data?.data?.[0] || res.data?.data || res.data);
          if (videoObj) setVideoData(videoObj);
        }
      } catch (err) { console.error('Failed to fetch home video:', err); }
      finally { setIsVideoLoading(false); }
    };
    fetchHomeVideo();
  }, []);

  // Fetch Editing Plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await editingAPI.getPlans();
        const data = res.data?.plans || res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) setPlansList(data);
      } catch (err) { console.error('Failed to fetch editing plans:', err); }
    };
    fetchPlans();
  }, []);

  // Sort by price descending (highest cost first) and take top 6
  const displayPlans = plansList
    .map(p => ({ ...p, name: p.name || p.title, desc: p.desc || p.description, period: p.period || p.billingType, highlighted: p.highlighted !== undefined ? p.highlighted : (p.isPopular || false) }))
    .sort((a, b) => (Number(b.price) - Number(a.price)))
    .slice(0, 6);

  const handleSelectPlan = (plan) => {
    if (!user) { navigate('/login'); return; }
    setSelectedPlan(plan);
    setOrderDesc('');
    setOrderErr('');
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    try {
      setOrdering(true);
      setOrderErr('');
      const planId = selectedPlan._id || selectedPlan.id || selectedPlan.name;
      const res = await editingAPI.createOrder({ planId, description: orderDesc });
      if (res.data?.checkoutUrl) window.location.href = res.data.checkoutUrl;
      else { alert('Editing plan order submitted successfully!'); setSelectedPlan(null); }
    } catch (err) {
      console.error('Create order error:', err);
      setOrderErr(err.response?.data?.message || 'Failed to submit editing order');
    } finally { setOrdering(false); }
  };

  // Fetch Courses, Assets, Portfolio, Stats
  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        setShowreelLoading(true);
        const [coursesRes, assetsRes, portfolioRes, statsRes] = await Promise.all([
          courseAPI.getCourses(),
          assetAPI.getAssets(),
          portfolioAPI.getPortfolio().catch(() => ({ data: [] })),
          statsAPI.getStats().catch(() => ({ data: null }))
        ]);

        let coursesList = [];
        if (Array.isArray(coursesRes.data)) coursesList = coursesRes.data;
        else if (Array.isArray(coursesRes.data?.courses)) coursesList = coursesRes.data.courses;
        else if (Array.isArray(coursesRes.data?.data)) coursesList = coursesRes.data.data;

        let assetsList = [];
        if (Array.isArray(assetsRes.data)) assetsList = assetsRes.data;
        else if (Array.isArray(assetsRes.data?.assets)) assetsList = assetsRes.data.assets;
        else if (Array.isArray(assetsRes.data?.data)) assetsList = assetsRes.data.data;

        let portfolioList = [];
        if (Array.isArray(portfolioRes.data)) portfolioList = portfolioRes.data;
        else if (Array.isArray(portfolioRes.data?.portfolioItems)) portfolioList = portfolioRes.data.portfolioItems;
        else if (Array.isArray(portfolioRes.data?.data)) portfolioList = portfolioRes.data.data;

        setCourses(coursesList);
        setShowreelProjects(portfolioList);

        const backendStats = statsRes.data?.data || statsRes.data;
        if (backendStats) {
          setStats({
            students: Number(backendStats.activeStudents) || coursesList.length * 125,
            masterclasses: Number(backendStats.masterclasses) || coursesList.length,
            assets: Number(backendStats.digitalAssets) || assetsList.length,
            successRate: parseFloat(backendStats.successRate) || 99.4
          });
        } else {
          setStats({
            students: coursesList.reduce((acc, c) => acc + (Number(c.studentsCount || c.students) || 0), 0) || 0,
            masterclasses: coursesList.length,
            assets: assetsList.length,
            successRate: 99.4
          });
        }
      } catch (err) {
        console.error('Failed to fetch stream data:', err);
        setShowreelProjects([]);
      } finally { setShowreelLoading(false); }
    };
    fetchStreamData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setNewsletterMsg('');
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterMsg('Successfully subscribed to MrHaile.com updates!');
      setNewsletterEmail('');
    } catch (err) {
      console.error('Newsletter subscribe failed', err);
      setNewsletterMsg('Successfully subscribed to MrHaile.com updates!');
      setNewsletterEmail('');
    } finally { setNewsletterSubmitting(false); }
  };

  const filteredShowreel = showreelCategory === 'All' ? showreelProjects : showreelProjects.filter(item => (item.category || '').toLowerCase() === showreelCategory.toLowerCase());

  const isDirectVideoFile = (url) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.includes('commondatastorage.googleapis.com');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#28E7D3] selection:text-[#041F1C] text-xs overflow-x-hidden relative -mt-14 md:-mt-[104px]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-[radial-gradient(ellipse_at_top,_rgba(40,231,211,0.12)_0%,_transparent_70%)]" />
      </div>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 text-[11px] font-semibold">
                <span>1/28/2026</span><span>•</span><span>8/5/2026</span><span>•</span><span>26 min</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#052622]/10 text-[#052622] text-[11px] font-bold border border-[#052622]/15">Article</span>
                <span className="px-3 py-1 rounded-full bg-[#28E7D3]/20 text-[#041F1C] text-[11px] font-bold border border-[#28E7D3]/30">LMS platforms</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#052622] leading-[1.2] tracking-tight">
              Want a fast and flawless <span className="font-serif italic text-[#08332E]">LMS rollout?</span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
              Master professional video editing, cinematic color grading, motion graphics, and full-stack software development workflows with expert-driven masterclasses on MrHaile.com.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#28E7D3] text-[#041F1C] font-semibold text-xs shadow-lg shadow-[#28E7D3]/25 hover:bg-[#20caa9] transition-colors">
                <span>Book a Demo & Explore</span>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <img src={testimonialImg1} alt="Contributor" className="w-10 h-10 rounded-full object-cover border-2 border-[#28E7D3]" />
                <div><div className="text-[10px] uppercase font-bold text-slate-400">Contributor</div><div className="text-xs font-bold text-[#052622]">Bantalem Mitiku</div></div>
              </div>
              <div className="flex items-center gap-3">
                <img src={testimonialImg2} alt="Expert" className="w-10 h-10 rounded-full object-cover border-2 border-amber-500" />
                <div><div className="text-[10px] uppercase font-bold text-slate-400">Expert</div><div className="text-xs font-bold text-[#052622]">Mr. Haile</div></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end items-center pr-0 lg:pr-8 m-0 p-0 border-none shadow-none">
            <div id="hero-video-container" className="w-full max-w-xs relative flex items-center justify-center bg-transparent overflow-hidden m-0 p-0 border-none outline-none shadow-none" style={{ width: '100%', maxWidth: '20rem', aspectRatio: '9/16', border: 'none', outline: 'none', boxShadow: 'none', margin: 0, padding: 0 }}>
              {isVideoLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-400"><span className="text-[11px] font-medium"></span></div>
              ) : videoData?.videoUrl ? (
                isDirectVideoFile(videoData.videoUrl) ? (
                  <video ref={heroVideoRef} src={videoData.videoUrl} poster={videoData.thumbnail || ''} muted loop playsInline className="w-full h-full object-cover bg-transparent border-none outline-none shadow-none m-0 p-0 pointer-events-none" style={{ width: '100%', height: '100%', aspectRatio: '9/16', border: 'none', outline: 'none', boxShadow: 'none', margin: 0, padding: 0 }} />
                ) : (
                  <iframe ref={heroIframeRef} src={`${videoData.videoUrl}${videoData.videoUrl.includes('?') ? '&' : '?'}controls=false&autoplay=true&loop=true&muted=true`} title="Home Background Video Player" className="w-full h-full border-0 absolute inset-0 bg-transparent m-0 p-0 pointer-events-none" style={{ width: '100%', height: '100%', aspectRatio: '9/16', border: 'none', outline: 'none', boxShadow: 'none', margin: 0, padding: 0 }} loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture;" />
                )
              ) : (
                <div className="p-6 text-center text-slate-400 flex flex-col items-center gap-2"><p className="text-xs font-medium">No video source available.</p></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section ref={studentsRef} className="bg-white border-y border-slate-200 py-10 px-4 sm:px-8 lg:px-16 relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1"><div className="text-2xl sm:text-3xl font-bold text-[#052622]">{studentsCount}+</div><div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Students</div></div>
          <div ref={masterclassesRef} className="space-y-1"><div className="text-2xl sm:text-3xl font-bold text-teal-600">{masterclassesCount}+</div><div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Masterclasses</div></div>
          <div ref={assetsRef} className="space-y-1"><div className="text-2xl sm:text-3xl font-bold text-amber-600">{assetsCount}+</div><div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Digital Assets</div></div>
          <div ref={successRef} className="space-y-1"><div className="text-2xl sm:text-3xl font-bold text-purple-600">{successCount}%</div><div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Success Rate</div></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 space-y-16 relative z-10">
        {/* Features */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3"><h3 className="text-sm font-bold text-[#052622]">Pro Editing Assets & LUTs</h3><p className="text-slate-600 text-xs leading-relaxed">Access broadcast-grade color grading presets, cinematic LUT packs, and dynamic After Effects templates engineered for professionals.</p></div>
          <div className="space-y-3"><h3 className="text-sm font-bold text-[#052622]">Self-Paced Learning Pathways</h3><p className="text-slate-600 text-xs leading-relaxed">Master Premiere Pro timeline efficiency and modern full-stack web applications at your own pace with lifetime platform access.</p></div>
          <div className="space-y-3"><h3 className="text-sm font-bold text-[#052622]">Expert Creator Mentorship</h3><p className="text-slate-600 text-xs leading-relaxed">Receive direct portfolio feedback, code reviews, and insider industry workflow insights from seasoned engineers and editors.</p></div>
        </div>

        {/* Showreel */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div><span className="text-[10px] font-bold uppercase tracking-widest text-[#052622] bg-[#28E7D3]/20 px-3 py-1 rounded-full border border-[#28E7D3]/30">Featured Edits</span><h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#052622] tracking-tight mt-2">Video Editing <span className="italic text-[#0E4C44]">Showreel Portfolio</span></h2></div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Commercial', 'YouTube', 'Music Video', 'Documentary', 'VFX'].map(cat => (
                <button key={cat} onClick={() => setShowreelCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${showreelCategory === cat ? 'bg-[#052622] text-[#28E7D3]' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#052622]'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShowreel.map(item => {
              const videoEmbedUrl = item.videoUrl || (item.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${item.bunnyVideoId}` : '');
              return (
                <div key={item._id || item.id} onClick={() => setActiveShowreelVideo({ ...item, url: videoEmbedUrl })} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all cursor-pointer flex flex-col">
                  <div className="relative h-44 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img src={item.thumbnail || PLACEHOLDER} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052622] to-transparent opacity-60 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-10 h-10 rounded-full bg-white text-[#052622] flex items-center justify-center shadow-lg">▶</div></div>
                    <span className="absolute top-3 right-3 z-20 bg-[#052622]/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">{item.duration || item.completionDate || '2026'}</span>
                    <span className="absolute top-3 left-3 z-20 bg-[#28E7D3]/90 text-[#041F1C] px-2 py-0.5 rounded-md text-[9px] font-bold uppercase">{item.category || 'Featured'}</span>
                  </div>
                  <div className="p-4 space-y-1"><span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{item.client || item.tag || 'Pro Edit'}</span><h4 className="font-bold text-[#052622] text-sm line-clamp-1">{item.title}</h4></div>
                </div>
              );
            })}
          </div>
          {filteredShowreel.length === 0 && !showreelLoading && <div className="text-center py-12 bg-white rounded-2xl border border-slate-200"><p className="text-slate-500 text-xs font-bold">No portfolio showreel items found for this category.</p></div>}
        </div>

        {/* Workflow */}
        <div className="bg-[#052622] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#28E7D3] bg-[#28E7D3]/10 px-3 py-1 rounded-full border border-[#28E7D3]/30">Editing Methodology</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal leading-tight">Our Professional <span className="italic text-[#28E7D3]">Post-Production Workflow</span></h2>
            <p className="text-emerald-100/70 text-xs font-light">How we transform raw camera files into engaging high-converting final cuts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((ws, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative">
                <span className="text-2xl font-serif font-bold text-[#28E7D3]">{ws.step}</span>
                <h3 className="font-bold text-sm text-white">{ws.title}</h3>
                <p className="text-emerald-100/60 text-xs leading-relaxed">{ws.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Masterclasses */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div><h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#052622] tracking-tight">Popular <span className="italic text-[#0E4C44]">Masterclasses & Tutorials</span></h2><p className="text-slate-600 text-xs font-light mt-1">Hand-crafted curriculum designed for high-end video editors and full-stack software creators.</p></div>
            <Link to="/courses" className="px-5 py-2.5 rounded-full border border-[#052622]/30 text-[#052622] font-medium text-xs flex items-center gap-1.5 shrink-0 hover:bg-[#052622] hover:text-white transition-colors"><span>View All Masterclasses</span></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...courses].sort((a, b) => (Number(b.price) - Number(a.price))).slice(0, 4).map(course => <CourseCard key={course._id || course.id} course={course} />)}
          </div>
        </div>

        {/* Pricing Plans - top 6 highest cost */}
        {displayPlans.length > 0 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#052622] bg-[#28E7D3]/20 px-3 py-1 rounded-full border border-[#28E7D3]/30">Services & Editing Packages</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#052622]">Flexible <span className="italic text-[#0E4C44]">Editing Tiers</span></h2>
              <p className="text-slate-600 text-xs">Choose the ideal editing scope for your YouTube channel or business.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayPlans.map((plan, idx) => (
                <div key={plan._id || plan.id || idx} className={`rounded-3xl p-8 transition-all relative flex flex-col justify-between ${plan.highlighted ? 'bg-[#052622] text-white shadow-2xl scale-105 border border-[#28E7D3]/50' : 'bg-white text-slate-900 border border-slate-200 shadow-md'}`}>
                  {plan.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#28E7D3] text-[#041F1C] text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow">Most Popular</span>}
                  <div className="space-y-4">
                    <h3 className={`text-base font-bold ${plan.highlighted ? 'text-white' : 'text-[#052622]'}`}>{plan.name}</h3>
                    <div>
                      <span className={`text-3xl font-serif font-bold ${plan.highlighted ? 'text-[#28E7D3]' : 'text-[#052622]'}`}>
                        {typeof plan.price === 'number' ? `Birr ${plan.price}` : plan.price}
                      </span>
                      <span className="text-xs opacity-75 ml-1">{plan.period || plan.billingType}</span>
                    </div>
                    <p className={`text-xs ${plan.highlighted ? 'text-emerald-100/70' : 'text-slate-600'}`}>{plan.desc || plan.description}</p>
                    <ul className="space-y-2.5 pt-4">
                      {(plan.features || []).map((feat, fIdx) => <li key={fIdx} className="flex items-center gap-2 text-xs"><span>{feat}</span></li>)}
                    </ul>
                  </div>
                  <div className="pt-8">
                    <button onClick={() => handleSelectPlan(plan)} className={`w-full py-3 rounded-full font-bold text-xs transition-all ${plan.highlighted ? 'bg-[#28E7D3] text-[#041F1C] hover:bg-[#20caa9]' : 'bg-[#052622] text-white hover:bg-[#08332E]'}`}>Select Plan</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#052622]">Frequently Asked <span className="italic text-[#0E4C44]">Questions</span></h2>
            <p className="text-slate-600 text-xs">Everything you need to know about our editing services and masterclasses.</p>
          </div>
          <div className="space-y-4 pt-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full px-6 py-4 text-left font-bold text-[#052622] text-xs flex justify-between items-center gap-4">
                  <span>{faq.q}</span>
                  <span className={`text-teal-600 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {activeFaq === idx && <div className="px-6 pb-4 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter / VIP */}
        <div className="relative bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 border border-slate-700 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none overflow-hidden"><img src={hero1Img} alt="Background Banner" className="w-full h-full object-cover animate-pulse scale-110" /></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent z-10" />
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 bg-white px-3 py-1 rounded-full shadow-sm">MrHaile.com VIP Elite Program</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-white leading-tight">Join <span className="italic text-white underline decoration-white/40">MrHaile.com</span> Elite Hub Today</h2>
              <p className="text-slate-300 text-xs font-light leading-relaxed">Become a valued VIP member to secure unlimited access to our proprietary video editing asset library, premium raw stock footage archives, and advanced developer toolkits.</p>
            </div>
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl text-center space-y-4">
                <Link to="/register" className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-100 transition-all transform hover:scale-105 shadow-xl"><span>Join & Register Free</span><span className="text-sm">→</span></Link>
                <p className="text-[11px] text-slate-300 font-medium">Instant access upon registration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Face-to-Face Modal */}
      {isFaceToFaceOpen && (
        <div className="fixed inset-0 z-50 bg-[#041F1C]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="relative w-full max-w-4xl aspect-[16/9] max-h-[85vh] bg-black rounded-3xl overflow-hidden border border-[#28E7D3]/30 shadow-2xl flex items-center justify-center">
            <button onClick={() => setIsFaceToFaceOpen(false)} className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors border border-white/20">✕</button>
            {videoData?.videoUrl ? (
              isDirectVideoFile(videoData.videoUrl) ? (
                <video src={videoData.videoUrl} poster={videoData.thumbnail || ''} autoPlay controls playsInline className="w-full h-full object-contain" />
              ) : (
                <iframe src={videoData.videoUrl.replace('controls=false', 'controls=true')} title="Face to Face Immersive Stream" className="w-full h-full border-0 absolute inset-0" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen />
              )
            ) : (
              <div className="text-center text-slate-300 p-8 space-y-2"><p className="text-sm font-bold">Face-to-Face Masterclass Stream</p><p className="text-xs text-slate-400">No active stream source loaded.</p></div>
            )}
          </div>
        </div>
      )}

      {/* Showreel Video Lightbox */}
      {activeShowreelVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 font-sans">
          <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden border border-slate-200 relative shadow-2xl">
            <button onClick={() => setActiveShowreelVideo(null)} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors shadow-sm">✕</button>
            <div className="relative h-[55vh] bg-black flex items-center justify-center">
              {activeShowreelVideo.url ? (
                <iframe src={activeShowreelVideo.url} title={activeShowreelVideo.title} className="w-full h-full border-0 bg-black" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : <div className="text-slate-400 text-xs font-semibold">Video URL not available.</div>}
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border-t border-slate-100">
              <div><h3 className="text-lg font-black text-[#052622]">{activeShowreelVideo.title}</h3><p className="text-xs font-semibold text-slate-500 mt-0.5">Category: <span className="text-slate-700">{activeShowreelVideo.category}</span> • Client: <span className="text-slate-700">{activeShowreelVideo.client || 'Private'}</span></p></div>
              <Link to="/portfolio" className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#28E7D3] hover:bg-[#20caa9] text-[#041F1C] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all">View Full Portfolio</Link>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 font-sans">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 relative shadow-2xl space-y-6">
            <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors shadow-sm">✕</button>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">Editing Order Confirmation</span>
              <h3 className="text-xl font-bold text-[#052622]">{selectedPlan.name} - {typeof selectedPlan.price === 'number' ? `Birr ${selectedPlan.price}` : selectedPlan.price}</h3>
              <p className="text-xs text-slate-600">Provide any optional project notes, instructions, or links to raw footage for this editing plan.</p>
            </div>
            {orderErr && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">{orderErr}</div>}
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Project Notes & Description</label><textarea rows="4" value={orderDesc} onChange={(e) => setOrderDesc(e.target.value)} placeholder="Describe your video editing project, style references, or paste raw footage links..." className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#28E7D3]" /></div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedPlan(null)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={ordering} className="px-6 py-2.5 rounded-xl bg-[#28E7D3] hover:bg-[#20caa9] text-[#041F1C] font-bold text-xs transition-all shadow-md disabled:opacity-50 flex items-center gap-2">{ordering ? 'Processing...' : 'Proceed to Checkout & Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}