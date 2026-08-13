import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Award, BookOpen, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0B1D3A] via-[#0F284A] to-[#142f56] py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,102,255,0.2),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/25 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>Addis Ababa, Ethiopia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Empowering Creators & Developers Worldwide
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            MrHaile.com is your premier destination for professional video post-production editing, high-end digital asset stock footage, and industry-leading LMS masterclasses.
          </p>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 space-y-4 relative overflow-hidden group hover:border-[#001FD1]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#001FD1] flex items-center justify-center font-bold">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Cinematic Editing</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              From YouTube vlogs and commercial ads to cinematic color grading and storytelling reels, we turn raw footage into breathtaking visual masterpieces.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 space-y-4 relative overflow-hidden group hover:border-amber-400/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Masterclass LMS</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Comprehensive courses in Premiere Pro, DaVinci Resolve, After Effects, and full-stack software development designed for actionable skill growth.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 space-y-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Digital Asset Hub</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Handcrafted stock footage, sound effects, transitions, and LUT presets curated for professional creators seeking top-tier production value.
            </p>
          </div>

        </div>
      </div>

      {/* Founder Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#001FD1] text-xs font-bold uppercase tracking-wider">
              Meet The Creator
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Crafting Digital Excellence from Addis Ababa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Founded by Mr. Haile, a passionate lead video producer and full-stack engineer based in Addis Ababa, Ethiopia. Our studio bridges the gap between high-end creative storytelling and robust digital architecture.
            </p>
            
            <ul className="space-y-3 text-xs font-bold text-slate-700">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Over 5+ years of professional post-production experience</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Trusted by hundreds of creators, agencies, and enterprises</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Dedicated support and lightning-fast project delivery</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-[#0B1D3A] hover:bg-[#142f56] text-white font-extrabold text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
              >
                <span>Contact Studio</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-amber-500/20 rounded-3xl blur-2xl"></div>
            <div className="bg-gradient-to-br from-[#0B1D3A] to-[#142f56] rounded-3xl p-8 text-white relative z-10 space-y-6 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400 font-black text-xl">
                  MH
                </div>
                <div>
                  <h4 className="font-black text-base">Mr. Haile</h4>
                  <p className="text-xs text-slate-300">Founder & Lead Engineer</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Our mission is to empower every creator in Ethiopia and across the globe with professional-grade video editing tools, masterclasses, and top-tier digital assets."
              </p>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                <span>Addis Ababa, Bole Road</span>
                <span className="text-amber-400 font-bold">MrHaile.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
