import React, { useEffect, useState } from 'react';
import { Layers, Search, Filter, Grid, Check, Download, ShieldCheck, X } from 'lucide-react';
import AssetCard from '../components/AssetCard';
import { assetAPI } from '../services/api';

export default function AssetHub() {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await assetAPI.getAssets();
        setAssets(res.data);
      } catch (err) {
        console.error('Failed to fetch assets', err);
        setAssets([
          { _id: '1', title: '4K Cinematic Neon City Drone Shot', category: 'Stock Footage', price: 15, resolution: '4K Ultra HD', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800' },
          { _id: '2', title: 'Glitch Sound Effects & Cinematic Risers', category: 'Audio', price: 10, resolution: 'WAV 24-bit', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
          { _id: '3', title: 'Premiere Pro Cinematic LUTs Pack', category: 'Presets', price: 25, resolution: '.cube files', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800' },
          { _id: '4', title: 'Abstract Liquid Motion Background', category: 'Stock Footage', price: 20, resolution: '4K 60FPS', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' },
          { _id: '5', title: 'Cyberpunk Light Leaks 4K', category: 'Overlays', price: 12, resolution: '4K ProRes', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800' },
          { _id: '6', title: 'Minimalist Lower Thirds & Title Templates', category: 'Templates', price: 18, resolution: 'MOGRT', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800' },
          { _id: '7', title: 'Cinematic Whooshes & Impact SFX Pack', category: 'SFX', price: 14, resolution: '96kHz WAV', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800' },
          { _id: '8', title: 'Epic Orchestral Background Music', category: 'Background Music', price: 22, resolution: 'Full Stems', url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800' },
          { _id: '9', title: 'Lofi Chillhop Background Music Track', category: 'Background Music', price: 15, resolution: 'WAV 320kbps', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
          { _id: '10', title: 'Ultimate Video Editing & Color Grading PDF Guide', category: 'PDF Guides', price: 0, resolution: 'PDF E-Book (48 Pages)', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800' },
          { _id: '11', title: 'Full-Stack Developer Architecture & API Design PDF Cheatsheet', category: 'PDF Guides', price: 5, resolution: 'PDF Guide (24 Pages)', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800' }
        ]);
      }
    };
    fetchAssets();
  }, []);

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

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans">
      
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 text-center mb-8">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 self-start">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Assets..."
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

          {/* Pricing Type Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Pricing Type</h3>
            <div className="space-y-2">
              {types.map((type) => {
                const isSelected = selectedType === type.name;
                return (
                  <div
                    key={type.name}
                    onClick={() => setSelectedType(type.name)}
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
                      <span className={isSelected ? 'font-bold text-slate-900' : ''}>{type.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({type.count})</span>
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
              We found <span className="text-teal-700 font-black">{filteredAssets.length}</span> digital assets available for you
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Grid</span>
              <div className="p-1 rounded-lg bg-[#e4f8f8] border border-[#b0e2e2] text-slate-800 shadow-sm">
                <Grid className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset._id || asset.id} asset={asset} onSelect={setSelectedAsset} />
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-xs font-bold">No digital assets found matching your selected filters.</p>
            </div>
          )}

        </div>

      </div>

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 sm:h-56 bg-slate-100 rounded-xl overflow-hidden">
              <img src={selectedAsset.thumbnail || selectedAsset.url} alt={selectedAsset.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#e4f8f8] text-teal-900 border border-[#b0e2e2] text-xs font-bold">
                  {selectedAsset.category}
                </span>
                <span className="text-2xl font-black text-slate-900">${selectedAsset.price}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{selectedAsset.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Resolution: {selectedAsset.resolution || '4K Ultra HD'} • Instant Download</p>
              
              <div className="pt-3 space-y-2">
                {selectedAsset.pdfUrl && (
                  <a
                    href={selectedAsset.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>View / Download PDF E-Book</span>
                  </a>
                )}
                {selectedAsset.youtubeUrl && (
                  <a
                    href={selectedAsset.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Watch YouTube Preview</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    const dlUrl = selectedAsset.downloadUrl || selectedAsset.fileUrl;
                    if (dlUrl && (!selectedAsset.price || selectedAsset.price === 0 || selectedAsset.isFree)) {
                      window.open(dlUrl, '_blank');
                    } else {
                      alert(`Redirecting to Chapa Secure Checkout for ${selectedAsset.title} ($${selectedAsset.price || 15})...`);
                    }
                    setSelectedAsset(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#e4f8f8] hover:bg-[#d0f2f2] text-slate-900 border border-[#b0e2e2] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4 text-slate-700" />
                  <span>{!selectedAsset.price || selectedAsset.price === 0 || selectedAsset.isFree ? 'Download Free Asset' : `Checkout with Chapa ($${selectedAsset.price})`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}