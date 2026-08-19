import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Search, Filter, LayoutGrid as GridIcon, Check, 
  Home, Library, Sparkles, Radio, FileText, Compass, Award, Activity 
} from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { courseAPI } from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError('');
        const res = await courseAPI.getCourses({ page, limit: 12 });
        if (res.data) {
          if (Array.isArray(res.data.courses)) {
            setCourses(res.data.courses);
            setPage(res.data.page || 1);
            setPages(res.data.pages || 1);
            setTotal(res.data.total || res.data.courses.length);
          } else if (Array.isArray(res.data)) {
            setCourses(res.data);
            setTotal(res.data.length);
            setPages(Math.ceil(res.data.length / 12) || 1);
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
        setError('Failed to fetch courses from server.');
        setCourses([]);
        setPages(1);
        setTotal(0);
      }
    };
    fetchCourses();
  }, [page]);

  const categories = [
    { name: 'All', count: total },
    { name: 'Basic Internet Skills', count: courses.filter(c => (c.category || '').toLowerCase() === 'basic internet skills').length },
    { name: 'Development', count: courses.filter(c => (c.category || '').toLowerCase() === 'development').length },
    { name: 'Video Editing', count: courses.filter(c => (c.category || '').toLowerCase() === 'video editing').length },
    { name: 'Color Grading', count: courses.filter(c => (c.category || '').toLowerCase() === 'color grading').length },
    { name: 'VFX', count: courses.filter(c => (c.category || '').toLowerCase() === 'vfx').length }
  ];

  const types = [
    { name: 'All', count: total },
    { name: 'Free', count: courses.filter(c => !c.price || c.price === 0).length },
    { name: 'Paid', count: courses.filter(c => c.price && c.price > 0).length }
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || (course.category || '').toLowerCase() === selectedCategory.toLowerCase();
    
    const isFree = !course.price || course.price === 0;
    const matchesType = selectedType === 'All' || 
      (selectedType === 'Free' && isFree) || 
      (selectedType === 'Paid' && !isFree);

    return matchesSearch && matchesCat && matchesType;
  });

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
                placeholder="Search Courses..."
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
                    onClick={() => setSelectedCategory(cat.name)}
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
                    onClick={() => setSelectedType(type.name)}
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

        {/* Right Content Column: Offset to the right on large screens to make room for the fixed sidebar */}
        <div className="w-full lg:ml-80 lg:flex-1 space-y-6 min-w-0">

          {/* Mobile Filter & Search Header */}
          <div className="block lg:hidden space-y-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Courses..."
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
                    onClick={() => setSelectedCategory(cat.name)}
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
                  <h3 className="font-black text-white uppercase tracking-wider text-[12px]">Filter Courses</h3>
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
                          onClick={() => { setSelectedType(type.name); setMobileFilterOpen(false); }}
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
                    onClick={() => { setSelectedCategory('All'); setSelectedType('All'); setMobileFilterOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-[11px]"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 text-[12px]">
              <p className="text-slate-500 font-bold">No courses found matching your selected filters on this page.</p>
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

    </div>
  );
}
