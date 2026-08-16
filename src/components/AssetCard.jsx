import React, { useState, useEffect } from 'react';
import { Play, Star, Users, Clock } from 'lucide-react';
import { reviewAPI } from '../services/api';

export default function AssetCard({ asset, onView, onDownload }) {
  const [rating, setRating] = useState(asset.rating || 4.9);
  const [reviewCount, setReviewCount] = useState(asset.downloadsCount || 0);

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
    <div className="bg-white rounded-2xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-[11px]">
      <div>
        <div className="relative h-44 sm:h-52 overflow-hidden bg-slate-100 group">
          <img
            src={asset.thumbnail || asset.url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'}
            alt={asset.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#001FD1] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm">
            ${asset.price || 0}
          </div>
          <div className="absolute bottom-3 left-3 bg-[#001FD1] px-2.5 py-1 rounded-lg text-[10px] font-black text-white capitalize shadow-sm">
            {asset.category || 'vfx'}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-[12px] font-black text-slate-900 mb-1.5 hover:text-[#001FD1] transition-colors line-clamp-1">
            {asset.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mb-3 line-clamp-2 leading-relaxed">
            {asset.description || 'learn advance LMS engineering'}
          </p>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#001FD1]" /> {asset.duration || '1h 5m'}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3 text-pink-600" /> {reviewCount} students</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => onView && onView(asset)}
          className="w-full py-2.5 rounded-xl bg-[#001FD1] hover:bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all transform hover:scale-[1.02]"
        >
          <Play className="w-3.5 h-3.5 fill-white text-white" />
          <span>play now</span>
        </button>
      </div>
    </div>
  );
}