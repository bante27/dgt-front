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

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
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
    { name: 'Commercial', count: projects.filter(p => p.category === 'Commercial').length },
    { name: 'YouTube', count: projects.filter(p => p.category === 'YouTube').length },
    { name: 'Music Video', count: projects.filter(p => p.category === 'Music Video').length },
    { name: 'Documentary', count: projects.filter(p => p.category === 'Documentary').length },
    { name: 'VFX', count: projects.filter(p => p.category === 'VFX').length }
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = (proj.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (proj.client || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans text-xs">
      
      {error && (
        <div className="max-w-7xl mx-auto p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center flex items-center justify-center gap-1.5 font-medium shadow-sm mb-4">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" /> <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-slate-400 text-xs font-bold flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-[#001FD1] border-t-transparent rounded-full animate-spin" />
          <span>Loading portfolio items...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto items-start">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4 bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-md sticky top-28 self-start z-20">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#001FD1]"
            />
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
                    className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#001FD1] border-[#001FD1] text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={isSelected ? 'font-bold text-slate-900' : ''}>{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({cat.count})</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-4 w-full">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h1 className="text-sm font-black text-slate-900">Cinematic Portfolio Hub</h1>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                We found <span className="text-[#001FD1] font-black">{total}</span> portfolio reels available (Page {page} of {pages})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 text-xs">Grid</span>
              <div className="p-1 rounded bg-[#001FD1] text-white shadow-xs">
                <Grid className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Portfolio Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {filteredProjects.map((proj) => {
              const videoEmbedUrl = proj.videoUrl || (proj.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${proj.bunnyVideoId}` : '');
              return (
                <div
                  key={proj._id || proj.id}
                  onClick={() => setActiveVideo({ ...proj, url: videoEmbedUrl })}
                  className="bg-white rounded-xl overflow-hidden group cursor-pointer border border-slate-100 hover:border-[#001FD1] hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-40 bg-slate-100 overflow-hidden">
                    <img
                      src={proj.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#001FD1]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-md transform translate-y-1 group-hover:translate-y-0 transition-all border border-[#001FD1]">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 bg-slate-900/90 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
                      {proj.category || 'Video'}
                    </span>
                  </div>

                  {/* Card Details Content */}
                  <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 group-hover:text-[#001FD1] transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-400">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-[#001FD1]" /> {proj.client || 'Private'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500" /> {proj.completionDate || '2026'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="text-slate-400 font-bold">No portfolio items found matching your selected filters.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 border-t border-slate-200 text-xs">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              {Array.from({ length: pages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`w-8 h-8 rounded font-black transition-all ${
                    page === pNum
                      ? 'bg-[#001FD1] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next Page
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Modal with Pure Black Video Container */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 font-sans text-xs">
          <div className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
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
                <div className="text-slate-400 text-xs font-semibold">Video URL not available.</div>
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">{activeVideo.title}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Category: <span className="text-slate-700">{activeVideo.category}</span> • Client: <span className="text-slate-700">{activeVideo.client}</span>
                </p>
              </div>
              <Link
                to="/services"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#001FD1] hover:bg-blue-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Request Similar Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}