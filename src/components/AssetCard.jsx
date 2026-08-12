import React from 'react';
import { Download, Eye, Play } from 'lucide-react';

export default function AssetCard({ asset, onSelect }) {
  return (
    <div
      onClick={() => onSelect(asset)}
      className="mb-6 break-inside-avoid relative group rounded-2xl overflow-hidden bg-white cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 text-[11px]"
    >
      <div className="relative overflow-hidden bg-slate-100 group">
        <img
          src={asset.thumbnail || asset.url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'}
          alt={asset.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play / Preview overlay on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#001FD1] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm">
          ${asset.price || 15}
        </div>
        
        <div className="absolute bottom-3 left-3 bg-[#001FD1] px-2.5 py-1 rounded-lg text-[10px] font-black text-white capitalize shadow-sm">
          {asset.category || 'Stock Footage'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-[12px] font-black text-slate-900 mb-1.5 hover:text-[#001FD1] transition-colors line-clamp-1">
          {asset.title}
        </h3>
        
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1 text-[#001FD1]"><Eye className="w-3 h-3" /> {asset.resolution || '4K Ultra HD'}</span>
          <span className="flex items-center gap-1 text-slate-700 font-bold"><Download className="w-3 h-3 text-orange-500" /> Instant Access</span>
        </div>
      </div>
    </div>
  );
}