import React, { useEffect, useState } from 'react';
import { Play, Sparkles, AlertCircle, Calendar, UserCheck, Search, Filter, Grid, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioAPI } from '../services/api';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('mediadelivery.net') || url.includes('/embed/') || url.includes('.mp4') || url.includes('.webm')) {
      return url;
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return `https://www.youtube.com/embed/${url.trim()}`;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length >= 10) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        setError('');
        const params = { page, limit: 12 };
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        const res = await portfolioAPI.getPortfolio(params);
        if (res.data) {
          if (Array.isArray(res.data.portfolioItems)) {
            setProjects(res.data.portfolioItems);
            setPage(res.data.page || 1);
            setPages(res.data.pages || 1);
            setTotal(res.data.total || res.data.portfolioItems.length);
          } else if (Array.isArray(res.data)) {
            setProjects(res.data);
            setTotal(res.data.length);
            setPages(Math.ceil(res.data.length / 12) || 1);
          }
        }
      } catch (err) {
        console.error('Failed to fetch portfolio', err);
        setError('Failed to fetch portfolio items from server.');
        setProjects([
          { _id: '1', title: 'Cinematic Tech Commercial Ad', category: 'Commercial', client: 'Apex Tech', completionDate: '2026', thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
          { _id: '2', title: 'YouTube Travel Vlog Cinematic Edit', category: 'YouTube', client: 'Global Nomad', completionDate: '2026', thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
          { _id: '3', title: 'Hip-Hop Music Video Color Grading', category: 'Music Video', client: 'Vibe Records', completionDate: '2026', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
          { _id: '4', title: 'Documentary Storytelling Reel', category: 'Documentary', client: 'NatGeo Style', completionDate: '2026', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4' },
          { _id: '5', title: 'Real Estate Luxury Cinematic Walkthrough', category: 'Commercial', client: 'Prime Properties', completionDate: '2026', thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
          { _id: '6', title: 'VFX Sci-Fi Trailer Breakdown', category: 'VFX', client: 'Future Studios', completionDate: '2026', thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' }
        ]);
        setPages(1);
        setTotal(6);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [page, selectedCategory]);

  const categories = [
    { name: 'All', count: total },
    { name: 'Commercial', count: projects.filter(p => (p.category || '').toLowerCase() === 'commercial').length },
    { name: 'YouTube', count: projects.filter(p => (p.category || '').toLowerCase() === 'youtube').length },
    { name: 'Music Video', count: projects.filter(p => (p.category || '').toLowerCase() === 'music video').length },
    { name: 'Documentary', count: projects.filter(p => (p.category || '').toLowerCase() === 'documentary').length },
    { name: 'VFX', count: projects.filter(p => (p.category || '').toLowerCase() === 'vfx').length }
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = (proj.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (proj.client || '').toLowerCase().includes(searchQuery.toLowerCase()) || (proj.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans text-[12px]">
      
      {error && (
        <div className="max-w-7xl mx-auto p-3 rounded-xl bg-rose-50 border border-rose-200 text-[12px] text-rose-600 text-center flex items-center justify-center gap-1.5 font-medium shadow-sm mb-4">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" /> <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-slate-400 text-[12px] font-bold flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-[#EE7D1B] border-t-transparent rounded-full animate-spin" />
          <span>Loading portfolio items...</span>
        </div>
      )}

      {/* Strict 2-Column Desktop Layout Wrapper (Exact Course Design with Orange Accent) */}
      <div className="relative flex flex-col lg:flex-row items-start gap-8 w-full max-w-7xl mx-auto">
        
        {/* Left Sidebar: Fixed edge-to-edge from top to bottom corner */}
        <div className="w-full lg:w-72 lg:fixed lg:left-0 lg:top-[80px] lg:bottom-0 lg:h-auto lg:overflow-y-auto space-y-6 bg-slate-900 p-6 rounded-none border-r border-slate-800 shadow-none text-[12px] z-20 text-slate-100">
          
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 px-2">Portfolio Menu</h4>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-[12px] text-white placeholder-slate-400 focus:outline-none focus:border-[#EE7D1B] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-3.5 h-3.5 text-slate-400" />
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#EE7D1B] text-white font-bold shadow-md shadow-orange-500/20' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`}></span>
                      <span>{cat.name}</span>
                    </div>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {cat.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Content Column: Offset to the right on large screens to make room for the fixed sidebar */}
        <div className="w-full lg:ml-80 lg:flex-1 space-y-6 min-w-0">

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {filteredProjects.map((proj) => {
              const rawUrl = proj.videoUrl || proj.youtubeUrl || (proj.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${proj.bunnyVideoId}` : '');
              const videoEmbedUrl = getEmbedUrl(rawUrl);
              return (
                <div
                  key={proj._id || proj.id}
                  className="bg-white rounded-2xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-[11px]"
                >
                  <div>
                    {/* Thumbnail Container */}
                    <div 
                      onClick={() => setActiveVideo({ ...proj, url: videoEmbedUrl })}
                      className="relative h-44 sm:h-52 overflow-hidden bg-slate-100 group cursor-pointer"
                    >
                      <img
                        src={proj.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#EE7D1B] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm">
                        {proj.completionDate || '2026'}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-[#EE7D1B] px-2.5 py-1 rounded-lg text-[10px] font-black text-white capitalize shadow-sm">
                        {proj.category || 'Video'}
                      </div>
                    </div>

                    {/* Card Details Content */}
                    <div className="p-4">
                      <h3 
                        onClick={() => setActiveVideo({ ...proj, url: videoEmbedUrl })}
                        className="text-[12px] font-black text-slate-900 mb-1.5 hover:text-[#EE7D1B] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mb-3 line-clamp-2 leading-relaxed">
                        {proj.description || 'Cinematic professional video editing and post-production reel.'}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1"><UserCheck className="w-3 h-3 text-[#EE7D1B]" /> {proj.client || 'Private'}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-amber-500" /> {proj.completionDate || '2026'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setActiveVideo({ ...proj, url: videoEmbedUrl })}
                      className="w-full py-2.5 rounded-xl bg-[#EE7D1B] hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>play now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-[12px]">
              <p className="text-slate-500 font-bold">No portfolio items found matching your selected filters.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-slate-200 text-[12px]">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              {Array.from({ length: pages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`w-9 h-9 rounded-lg font-black transition-all ${
                    page === pNum
                      ? 'bg-[#EE7D1B] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next Page
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Modal with Pure Black Video Container */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 font-sans text-[12px]">
          <div className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[12px] transition-colors shadow-sm"
            >
              ✕
            </button>

            {/* Video Player Frame */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeVideo.url ? (
                <iframe
                  src={activeVideo.url}
                  title={activeVideo.title}
                  className="w-full h-full border-0 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-slate-400 text-[12px] font-semibold">Video URL not available.</div>
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">{activeVideo.title}</h3>
                <p className="text-[12px] font-semibold text-slate-500 mt-0.5">
                  Category: <span className="text-slate-700">{activeVideo.category}</span> • Client: <span className="text-slate-700">{activeVideo.client}</span>
                </p>
              </div>
              <Link
                to="/services"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EE7D1B] hover:bg-orange-600 text-white text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" /> Request Similar Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
