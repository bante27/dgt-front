import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, Check, Download, X, Star, MessageSquare, Send, Play, Eye, Users } from 'lucide-react';
import { assetAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AssetCard from '../components/AssetCard';

export default function AssetHub() {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activePreview, setActivePreview] = useState('image');
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setError('');
        const params = { page, limit: 12 };
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedType === 'Free') params.isFree = true;
        else if (selectedType === 'Paid') params.isFree = false;

        const res = await assetAPI.getAssets(params);
        if (res.data) {
          if (Array.isArray(res.data.assets)) {
            setAssets(res.data.assets);
            setPage(res.data.page || 1);
            setPages(res.data.pages || 1);
            setTotal(res.data.total || res.data.assets.length);
          } else if (Array.isArray(res.data)) {
            setAssets(res.data);
            setTotal(res.data.length);
            setPages(Math.ceil(res.data.length / 12) || 1);
          }
        }
      } catch (err) {
        console.error('Failed to fetch assets', err);
        setError('Failed to fetch assets from server.');
        setAssets([]);
        setPages(1);
        setTotal(0);
      }
    };
    fetchAssets();
  }, [page, selectedCategory, selectedType, searchQuery]);

  useEffect(() => {
    if (selectedAsset?._id) {
      reviewAPI.getReviewsByTarget(selectedAsset._id)
        .then((res) => {
          const revData = res.data;
          const revList = Array.isArray(revData) ? revData : (revData?.reviews || revData?.data || revData?.result || []);
          setReviews(Array.isArray(revList) ? revList : []);
        })
        .catch(() => setReviews([]));
    }
  }, [selectedAsset]);

  const categories = [
    { name: 'All', count: total },
    { name: 'Stock Footage', count: assets.filter(a => a.category === 'Stock Footage').length },
    { name: 'Audio', count: assets.filter(a => a.category === 'Audio').length },
    { name: 'SFX', count: assets.filter(a => a.category === 'SFX').length },
    { name: 'Background Music', count: assets.filter(a => a.category === 'Background Music').length },
    { name: 'Presets', count: assets.filter(a => a.category === 'Presets').length },
    { name: 'Overlays', count: assets.filter(a => a.category === 'Overlays').length },
    { name: 'Templates', count: assets.filter(a => a.category === 'Templates').length },
    { name: 'PDF Guides', count: assets.filter(a => a.category === 'PDF Guides').length }
  ];

  const types = [
    { name: 'All', count: total },
    { name: 'Free', count: assets.filter(a => !a.price || a.price === 0).length },
    { name: 'Paid', count: assets.filter(a => a.price && a.price > 0).length }
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = (asset.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (asset.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || asset.category === selectedCategory;
    const isFree = !asset.price || asset.price === 0;
    const matchesType = selectedType === 'All' || (selectedType === 'Free' && isFree) || (selectedType === 'Paid' && !isFree);
    return matchesSearch && matchesCat && matchesType;
  });

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const handleDownloadAsset = async (asset) => {
    if (asset.price && asset.price > 0 && !asset.isFree) {
      alert(`Redirecting to Secure Checkout for ${asset.title} ($${asset.price})...`);
      return;
    }

    try {
      let downloadSource = asset.downloadUrl || asset.fileUrl || asset.bunnyUrl || asset.pdfUrl;
      let ext = 'mp4';
      if (asset.category === 'PDF Guides' || downloadSource?.endsWith('.pdf')) ext = 'pdf';
      else if (['Audio', 'SFX', 'Background Music'].includes(asset.category) || downloadSource?.endsWith('.mp3')) ext = 'mp3';
      else if (asset.category === 'Presets' || downloadSource?.endsWith('.cube')) ext = 'cube';
      else if (downloadSource?.endsWith('.zip')) ext = 'zip';

      if (!downloadSource) {
        const content = `Digital Asset License\n\nTitle: ${asset.title}\nCategory: ${asset.category}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${(asset.title || 'asset').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        return;
      }

      const response = await fetch(downloadSource);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${(asset.title || 'asset').replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const downloadSource = asset.downloadUrl || asset.fileUrl || asset.bunnyUrl || asset.pdfUrl || '';
      if (downloadSource) {
        const a = document.createElement('a');
        a.href = downloadSource;
        a.download = `${(asset.title || 'asset').replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review.');
      return;
    }
    if (!newComment.trim()) return;
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const res = await reviewAPI.createReview({
        targetId: selectedAsset._id,
        targetType: 'Asset',
        rating: Number(newRating),
        comment: newComment
      });
      const createdReview = res.data.review || res.data.data || res.data;
      setReviews([createdReview, ...(Array.isArray(reviews) ? reviews : [])]);
      setNewComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans text-[12px]">
      {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-600 text-center mb-6">{error}</div>}

      {/* Strict 2-Column Desktop Layout Wrapper */}
      <div className="relative flex flex-col lg:flex-row items-start gap-8 w-full max-w-7xl mx-auto">
        
        {/* Left Sidebar: Fixed edge-to-edge from top to bottom corner on desktop, hidden/collapsible on mobile */}
        <div className="hidden lg:block w-72 lg:fixed lg:left-0 lg:top-[80px] lg:bottom-0 lg:h-auto lg:overflow-y-auto space-y-6 bg-slate-900 p-6 rounded-none border-r border-slate-800 shadow-none text-[12px] z-20 text-slate-100">
          
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 px-2">Main Menu</h4>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Assets..."
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

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 mb-2">Pricing Type</h3>
            <div className="space-y-1">
              {types.map((type) => {
                const isSelected = selectedType === type.name;
                return (
                  <div
                    key={type.name}
                    onClick={() => { setSelectedType(type.name); setPage(1); }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#EE7D1B] text-white font-bold shadow-md shadow-orange-500/20' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`}></span>
                      <span>{type.name}</span>
                    </div>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {type.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Content Column */}
        <div className="w-full lg:ml-80 lg:flex-1 space-y-6 min-w-0">

          {/* Mobile Filter & Search Header */}
          <div className="block lg:hidden space-y-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-[12px] text-white placeholder-slate-400 focus:outline-none focus:border-[#EE7D1B]"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center gap-2 shadow-sm text-[12px]"
              >
                <Filter className="w-4 h-4 text-[#EE7D1B]" />
                <span>Filters {selectedCategory !== 'All' || selectedType !== 'All' ? '• Active' : ''}</span>
              </button>
            </div>

            {/* Horizontal Scrollable Category Pills for Mobile */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#EE7D1B] text-white shadow-orange-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Modal / Drawer */}
            {mobileFilterOpen && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-black text-white uppercase tracking-wider text-[12px]">Filter Assets</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs">✕ Close</button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Pricing Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {types.map((type) => {
                      const isSelected = selectedType === type.name;
                      return (
                        <button
                          key={type.name}
                          onClick={() => { setSelectedType(type.name); setPage(1); setMobileFilterOpen(false); }}
                          className={`py-2 px-3 rounded-xl text-[11px] font-bold text-center transition-all ${
                            isSelected ? 'bg-[#EE7D1B] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {type.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => { setSelectedCategory('All'); setSelectedType('All'); setPage(1); setMobileFilterOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-[11px]"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset._id || asset.id}
                asset={asset}
                onView={(a) => {
                  setActivePreview(a.youtubeUrl ? 'youtube' : (a.pdfUrl ? 'pdf' : 'image'));
                  setSelectedAsset(a);
                }}
                onDownload={(a) => handleDownloadAsset(a)}
              />
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-16 text-[12px]">
              <p className="text-slate-500 font-bold">No digital assets found matching your selected filters.</p>
            </div>
          )}

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
                    page === pNum ? 'bg-[#EE7D1B] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto font-sans text-[12px]">
          <div className="bg-white max-w-3xl w-full rounded-2xl p-5 sm:p-6 relative shadow-2xl space-y-4 my-8 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 font-black flex items-center gap-1.5 transition-colors"
              >
                <span>← Back</span>
              </button>
              <button
                onClick={() => setSelectedAsset(null)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#EE7D1B]" />
                  <span>Reviews ({reviews.length})</span>
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <textarea
                    rows="2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a review..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EE7D1B]"
                  />
                  {reviewError && <p className="text-red-600 font-bold">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{reviewSubmitting ? 'Posting...' : 'Post'}</span>
                  </button>
                </form>

                <div className="space-y-3 max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {Array.isArray(reviews) && reviews.map((rev, idx) => (
                    <div key={rev._id || idx} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{rev.user?.firstName || rev.userName || 'User'}</span>
                        <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating || 5)}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                  {(!Array.isArray(reviews) || reviews.length === 0) && (
                    <p className="text-slate-400 text-center py-4">No reviews yet.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-200">
                  {activePreview === 'youtube' && selectedAsset.youtubeUrl ? (
                    <iframe
                      src={getEmbedUrl(selectedAsset.youtubeUrl)}
                      title={selectedAsset.title}
                      className="w-full h-full border-0 bg-black"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : activePreview === 'pdf' && selectedAsset.pdfUrl ? (
                    <iframe
                      src={selectedAsset.pdfUrl}
                      title={selectedAsset.title}
                      className="w-full h-full border-0 bg-white"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-1">
                      <img src={selectedAsset.thumbnail || selectedAsset.url} alt={selectedAsset.title} className="max-w-full max-h-full object-contain rounded" />
                      {selectedAsset.youtubeUrl && (
                        <button
                          onClick={() => setActivePreview('youtube')}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center group"
                        >
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-orange-50 text-[#EE7D1B] border border-orange-200 font-black uppercase tracking-wider text-[11px]">
                      {selectedAsset.category}
                    </span>
                    <span className="text-lg font-black text-slate-900">${selectedAsset.price || 0}</span>
                  </div>
                  <h3 className="font-black text-slate-900 tracking-tight text-sm">{selectedAsset.title}</h3>
                  <p className="text-slate-400">Format: <span className="text-slate-600 font-bold">{selectedAsset.resolution || selectedAsset.category}</span></p>
                  
                  <div className="pt-2 space-y-2">
                    {selectedAsset.youtubeUrl && activePreview !== 'youtube' && (
                      <button
                        onClick={() => setActivePreview('youtube')}
                        className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all text-[12px]"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch On-Site</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDownloadAsset(selectedAsset);
                        setSelectedAsset(null);
                      }}
                      className="w-full py-3 rounded-xl bg-[#EE7D1B] hover:bg-orange-600 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all text-[12px]"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>{!selectedAsset.price || selectedAsset.price === 0 || selectedAsset.isFree ? 'Download Free Asset' : `Checkout ($${selectedAsset.price})`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
