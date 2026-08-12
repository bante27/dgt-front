import React, { useState, useEffect } from 'react';
import { Download, Eye, Star, Users } from 'lucide-react';
import { reviewAPI } from '../services/api';

export default function AssetCard({ asset, onView, onDownload }) {
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
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between text-[11px]">
      <div>
        <div className="relative h-44 sm:h-52 overflow-hidden bg-slate-100">
          <img
            src={asset.thumbnail || asset.url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'}
            alt={asset.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 bg-slate-900/80 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm">
            ${asset.price || 0}
          </div>
          <div className="absolute bottom-3 left-3 bg-[#001FD1] px-2.5 py-1 rounded-lg text-[10px] font-black text-white capitalize shadow-sm">
            {asset.category || 'Digital Asset'}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-[12px] font-black text-slate-900 mb-1.5 line-clamp-1">
            {asset.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mb-3 line-clamp-2 leading-relaxed">
            Format: {asset.resolution || asset.fileType || 'Standard Digital File'} • Instant Access
          </p>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5 text-[#001FD1]" /> {asset.resolution || asset.category || 'Preview'}</span>
            <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5 text-pink-600" /> {reviewCount}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onView && onView(asset)}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
        >
          <Eye className="w-2.5 h-2.5 text-[#001FD1]" />
          <span>View</span>
        </button>
        <button
          onClick={() => onDownload && onDownload(asset)}
          className="w-full py-2.5 rounded-xl bg-[#001FD1] hover:bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
        >
          <Download className="w-2.5 h-2.5 text-white" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}