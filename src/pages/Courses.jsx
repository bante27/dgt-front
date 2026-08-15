import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Filter, LayoutGrid as GridIcon, Check } from 'lucide-react';
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

      {/* Main container with 4-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto items-start">
        
        {/* Left Sidebar Filters: Constant / sticky position */}
        <div className="lg:col-span-1 space-y-4 bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-md sticky top-28 self-start text-[12px] z-20">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#001FD1]"
            />
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h3 className="text-[12px] font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex items-center justify-between text-[12px] font-medium text-slate-700 cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#001FD1] border-[#001FD1] text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={isSelected ? 'font-bold text-slate-900' : ''}>{cat.name}</span>
                    </div>
                    <span className="text-[12px] text-slate-400">({cat.count})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Type Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h3 className="text-[12px] font-black uppercase tracking-wider text-slate-900">Pricing Type</h3>
            <div className="space-y-1.5">
              {types.map((type) => {
                const isSelected = selectedType === type.name;
                return (
                  <div
                    key={type.name}
                    onClick={() => setSelectedType(type.name)}
                    className="flex items-center justify-between text-[12px] font-medium text-slate-700 cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#001FD1] border-[#001FD1] text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={isSelected ? 'font-bold text-slate-900' : ''}>{type.name}</span>
                    </div>
                    <span className="text-[12px] text-slate-400">({type.count})</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-4 w-full">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#001FD1]"></span>
              <span className="font-bold text-slate-700">{total} Courses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-[#001FD1] text-white shadow-xs">
                <GridIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-[12px]">
              <p className="text-slate-500 font-bold">No courses found matching your selected filters on this page.</p>
            </div>
          )}

          {/* Pagination Controls ("Next Page", Previous Page, Page Numbers) */}
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
                      ? 'bg-[#001FD1] text-white shadow-sm'
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