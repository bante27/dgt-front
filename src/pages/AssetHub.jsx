import React, { useEffect, useState } from 'react';
import { Layers, Search, Filter, Grid, Check, Download, ShieldCheck, X, Star, MessageSquare, Send, Play, Sparkles, Maximize2, Eye, Users } from 'lucide-react';
import { assetAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AssetCard({ asset, onView, onDownload }) {
  const [rating, setRating] = useState(asset.rating || 4.9);
  const [reviewCount, setReviewCount] = useState(asset.downloadsCount || 124);

  useEffect(() => {
    const assetId = asset._id || asset.id;
    if (assetId) {
      reviewAPI.getReviewsByTarget(assetId)
        .then((res) => {
          if (res.data) {
            if (res.data.count !== undefined) {
              setReviewCount(res.data.count);
            } else if (Array.isArray(res.data.reviews)) {
              setReviewCount(res.data.reviews.length);
            }
            if (res.data.averageRating !== undefined) {
              setRating(res.data.averageRating);
            }
          }
        })
        .catch(() => {});
    }
  }, [asset]);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between text-[9px]">
      <div>
        <div className="relative h-32 overflow-hidden bg-slate-100">
          <img
            src={asset.thumbnail || asset.url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'}
            alt={asset.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-slate-900/90 px-2 py-0.5 rounded text-[9px] font-black text-white shadow-sm">
            ${asset.price || 0}
          </div>
          <div className="absolute bottom-2 left-2 bg-[#001FD1] px-2 py-0.5 rounded text-[9px] font-black text-white capitalize shadow-sm">
            {asset.category || 'Digital Asset'}
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-[10px] font-bold text-slate-900 mb-1 line-clamp-1">
            {asset.title}
          </h3>
          <p className="text-[9px] text-slate-400 mb-2">
            Format: {asset.resolution || asset.fileType || 'Standard File'} • Instant
          </p>

          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-50">
            <span className="flex items-center gap-0.5"><Eye className="w-2 h-2 text-[#001FD1]" /> {asset.resolution || 'HD'}</span>
            <span className="flex items-center gap-0.5"><Users className="w-2 h-2 text-pink-600" /> {reviewCount}</span>
            <span className="flex items-center gap-0.5 text-amber-500 font-bold"><Star className="w-2 h-2 fill-amber-400 text-amber-400" /> {rating}</span>
          </div>
        </div>
      </div>

      <div className="p-3 pt-0 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => onView && onView(asset)}
          className="py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-1 transition-all"
        >
          <Eye className="w-2.5 h-2.5 text-[#001FD1]" />
          <span>View</span>
        </button>
        <button
          onClick={() => onDownload && onDownload(asset)}
          className="py-1.5 rounded-lg bg-[#001FD1] hover:bg-blue-800 text-white font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
        >
          <Download className="w-2.5 h-2.5 text-white" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

export default function AssetHub() {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
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
        const res = await assetAPI.getAssets();
        setAssets(res.data);
      } catch (err) {
        console.error('Failed to fetch assets', err);
        setAssets([
          { _id: '1', title: 'Cinematic Neon City Drone Shot', category: 'Stock Footage', price: 15, resolution: 'Ultra HD 1080p', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { _id: '2', title: 'Glitch Sound Effects & Cinematic Risers', category: 'Audio', price: 10, resolution: 'WAV 24-bit', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
          { _id: '3', title: 'Premiere Pro Cinematic LUTs Pack', category: 'Presets', price: 25, resolution: '.cube files', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800' },
          { _id: '4', title: 'Abstract Liquid Motion Background', category: 'Stock Footage', price: 20, resolution: 'Full HD 60FPS', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' },
          { _id: '5', title: 'Cyberpunk Light Leaks Footage', category: 'Overlays', price: 12, resolution: 'ProRes HD', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800' },
          { _id: '6', title: 'Minimalist Lower Thirds & Title Templates', category: 'Templates', price: 18, resolution: 'MOGRT', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800' },
          { _id: '7', title: 'Cinematic Whooshes & Impact SFX Pack', category: 'SFX', price: 14, resolution: '96kHz WAV', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800' },
          { _id: '8', title: 'Epic Orchestral Background Music', category: 'Background Music', price: 22, resolution: 'Full Stems', url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800' },
          { _id: '9', title: 'Lofi Chillhop Background Music Track', category: 'Background Music', price: 15, resolution: 'WAV 320kbps', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
          { _id: '10', title: 'Ultimate Video Editing & Color Grading PDF Guide', category: 'PDF Guides', price: 0, resolution: 'PDF E-Book (48 Pages)', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { _id: '11', title: 'Full-Stack Developer Architecture & API Design PDF Cheatsheet', category: 'PDF Guides', price: 5, resolution: 'PDF Guide (24 Pages)', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800' }
        ]);
      }
    };
    fetchAssets();
  }, []);

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
    { name: 'All', count: assets.length },
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
    { name: 'All', count: assets.length },
    { name: 'Free', count: assets.filter(a => !a.price || a.price === 0).length },
    { name: 'Paid', count: assets.filter(a => a.price && a.price > 0).length }
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = (asset.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (asset.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || asset.category === selectedCategory;
    const isFree = !asset.price || asset.price === 0;
    const matchesType = selectedType === 'All' || 
      (selectedType === 'Free' && isFree) || 
      (selectedType === 'Paid' && !isFree);

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
      alert(`Redirecting to Chapa Secure Checkout for ${asset.title} ($${asset.price})...`);
      return;
    }

    try {
      let downloadSource = asset.downloadUrl || asset.fileUrl || asset.bunnyUrl || asset.pdfUrl;
      
      let ext = 'mp4';
      if (asset.category === 'PDF Guides' || downloadSource?.endsWith('.pdf')) ext = 'pdf';
      else if (asset.category === 'Audio' || asset.category === 'SFX' || asset.category === 'Background Music' || downloadSource?.endsWith('.mp3')) ext = 'mp3';
      else if (asset.category === 'Presets' || downloadSource?.endsWith('.cube') || downloadSource?.endsWith('.zip')) {
        ext = downloadSource?.endsWith('.zip') ? 'zip' : (asset.category === 'Presets' ? 'cube' : 'zip');
      }
      else if (asset.category === 'Stock Footage' || downloadSource?.endsWith('.mp4')) ext = 'mp4';

      if (!downloadSource) {
        const content = `MrHaile Digital Asset License\n\nTitle: ${asset.title}\nCategory: ${asset.category}\nDescription: ${asset.description || 'N/A'}\n\nThank you for downloading from MrHaile.com!`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const blobUrl = window.URL.createObjectURL(blob);
        const filename = `${(asset.title || 'asset').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        return;
      }

      const response = await fetch(downloadSource);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = `${(asset.title || 'asset').replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const downloadSource = asset.downloadUrl || asset.fileUrl || asset.bunnyUrl || asset.pdfUrl || '/src/assets/video_editer.mp4';
      const a = document.createElement('a');
      a.href = downloadSource;
      a.download = `${(asset.title || 'asset').replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans">
      {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-[10px] text-red-600 text-center mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4 bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-md sticky top-28 self-start text-[10px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#001FD1]"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-3 h-3 text-slate-500" />
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex items-center justify-between text-[10px] font-medium text-slate-700 cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-[#001FD1] border-[#001FD1] text-white' : 'border-slate-300 bg-white'}`}>
                        {isSelected && <Check className="w-2 h-2 text-white" />}
                      </div>
                      <span className={isSelected ? 'font-bold text-slate-900' : ''}>{cat.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400">({cat.count})</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900">Pricing Type</h3>
            <div className="space-y-1">
              {types.map((type) => {
                const isSelected = selectedType === type.name;
                return (
                  <div
                    key={type.name}
                    onClick={() => setSelectedType(type.name)}
                    className="flex items-center justify-between text-[10px] font-medium text-slate-700 cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-[#001FD1] border-[#001FD1] text-white' : 'border-slate-300 bg-white'}`}>
                        {isSelected && <Check className="w-2 h-2 text-white" />}
                      </div>
                      <span className={isSelected ? 'font-bold text-slate-900' : ''}>{type.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400">({type.count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-4 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[10px]">
            <div>
              <h1 className="text-sm font-black text-slate-900">Digital Assets & Video Hub</h1>
              <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                We found <span className="text-[#001FD1] font-black">{filteredAssets.length}</span> verified assets available for you
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Grid</span>
              <div className="p-1 rounded bg-[#001FD1] text-white shadow-xs">
                <Grid className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-[10px]">
              <p className="text-slate-500 font-bold">No digital assets found matching your selected filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto font-sans text-[10px]">
          <div className="bg-white max-w-3xl w-full rounded-2xl p-4 sm:p-5 relative shadow-2xl space-y-3 my-8 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 font-black flex items-center gap-1 transition-colors"
              >
                <span>← Back</span>
              </button>
              <button
                onClick={() => setSelectedAsset(null)}
                className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Left: Reviews */}
              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h4 className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#001FD1]" />
                  <span>Reviews ({reviews.length})</span>
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-1 py-0.5 font-bold text-slate-900 focus:outline-none"
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
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#001FD1]"
                  />
                  {reviewError && <p className="text-red-600 font-bold">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-1 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-2.5 h-2.5" />
                    <span>{reviewSubmitting ? 'Posting...' : 'Post'}</span>
                  </button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {Array.isArray(reviews) && reviews.map((rev, idx) => (
                    <div key={rev._id || idx} className="pt-2 first:pt-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{rev.user?.firstName || rev.userName || 'User'}</span>
                        <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating || 5)}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                  {(!Array.isArray(reviews) || reviews.length === 0) && (
                    <p className="text-slate-400 text-center py-3">No reviews yet.</p>
                  )}
                </div>
              </div>

              {/* Right: Media & Actions */}
              <div className="space-y-3">
                <div className="relative aspect-video w-full bg-slate-950 rounded-lg overflow-hidden shadow-inner flex items-center justify-center border border-slate-200">
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
                          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#001FD1] border border-blue-200 font-black uppercase tracking-wider">
                      {selectedAsset.category}
                    </span>
                    <span className="text-sm font-black text-slate-900">${selectedAsset.price || 0}</span>
                  </div>
                  <h3 className="font-black text-slate-900 tracking-tight">{selectedAsset.title}</h3>
                  <p className="text-slate-400">Format: <span className="text-slate-600 font-bold">{selectedAsset.resolution || selectedAsset.category}</span></p>
                  
                  <div className="pt-1 space-y-1.5">
                    {selectedAsset.youtubeUrl && activePreview !== 'youtube' && (
                      <button
                        onClick={() => setActivePreview('youtube')}
                        className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs transition-all"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>Watch On-Site</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDownloadAsset(selectedAsset);
                        setSelectedAsset(null);
                      }}
                      className="w-full py-2.5 rounded-lg bg-[#001FD1] hover:bg-blue-800 text-white font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3 h-3 text-white" />
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