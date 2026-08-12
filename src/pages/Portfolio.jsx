import React, { useEffect, useState } from 'react';
import { Video, Play, Sparkles, AlertCircle, Calendar, UserCheck, Layers, Search, Filter, Grid, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioAPI } from '../services/api';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await portfolioAPI.getPortfolio();
        setProjects(res.data);
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
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const categories = [
    { name: 'All', count: projects.length },
    { name: 'Commercial', count: projects.filter(p => p.category === 'Commercial').length },
    { name: 'YouTube', count: projects.filter(p => p.category === 'YouTube').length },
    { name: 'Music Video', count: projects.filter(p => p.category === 'Music Video').length },
    { name: 'Documentary', count: projects.filter(p => p.category === 'Documentary').length },
    { name: 'VFX', count: projects.filter(p => p.category === 'VFX').length }
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = (proj.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (proj.client || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || proj.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans">
      
      {/* Error Alert Card */}
      {error && (
        <div className="max-w-7xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center flex items-center justify-center gap-2 font-medium shadow-sm mb-8">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" /> <span>{error}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-20 text-slate-500 text-sm font-bold flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading portfolio items...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 self-start">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e4f8f8]"
            />
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900 py-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#e4f8f8] border-[#b0e2e2] text-slate-800' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-slate-900" />}
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
        <div className="lg:col-span-3 space-y-6 w-full">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-xs font-extrabold text-slate-700">
              We found <span className="text-teal-700 font-black">{filteredProjects.length}</span> cinematic portfolio reels available
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Grid</span>
              <div className="p-1 rounded-lg bg-[#e4f8f8] border border-[#b0e2e2] text-slate-800 shadow-sm">
                <Grid className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Portfolio Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredProjects.map((proj) => {
              const videoEmbedUrl = proj.videoUrl || (proj.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${proj.bunnyVideoId}` : '');
              return (
                <div
                  key={proj._id || proj.id}
                  onClick={() => setActiveVideo({ ...proj, url: videoEmbedUrl })}
                  className="bg-white rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 hover:border-[#b0e2e2] hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={proj.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#e4f8f8]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all border border-[#b0e2e2]">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-[#e4f8f8]/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-slate-900 border border-[#b0e2e2] uppercase tracking-wider shadow-sm">
                      {proj.category || 'Video'}
                    </span>
                  </div>

                  {/* Card Details Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-teal-600" /> {proj.client || 'Private'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" /> {proj.completionDate || '2026'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-xs font-bold">No portfolio items found matching your selected filters.</p>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Modal with Pure Black Video Container */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 font-sans">
          <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden border border-slate-200 relative shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors shadow-sm"
            >
              ✕
            </button>

            {/* Video Player Frame - Strictly Black Background with No White Flares */}
            <div className="relative h-[55vh] bg-black flex items-center justify-center">
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
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border-t border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">{activeVideo.title}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Category: <span className="text-slate-700">{activeVideo.category}</span> • Client: <span className="text-slate-700">{activeVideo.client}</span>
                </p>
              </div>
              <Link
                to="/services"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> Request Similar Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}