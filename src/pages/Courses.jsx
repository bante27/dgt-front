import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Filter, LayoutGrid as GridIcon, Check } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { courseAPI } from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getCourses();
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
        setCourses([
          { _id: '1', title: 'Introduction to Computers', description: 'Master basic computer skills and office productivity.', price: 0, duration: '4 Lessons', studentsCount: 428, rating: 4.0, category: 'Basic Internet Skills' },
          { _id: '2', title: 'Online Learning and Career Opportunities', description: 'Explore online education platforms and digital career growth.', price: 49, duration: '4 Lessons', studentsCount: 312, rating: 4.33, category: 'Development' },
          { _id: '3', title: 'Collaboration and Data Collection Tools', description: 'Learn collaborative tools, spreadsheets, and cloud data gathering.', price: 59, duration: '4 Lessons', studentsCount: 584, rating: 5.0, category: 'Development' },
          { _id: '4', title: 'Cinematic Premiere Pro Masterclass', description: 'Master professional video editing, color grading, and audio sweetening.', price: 49, duration: '8h 30m', studentsCount: 428, rating: 4.9, category: 'Video Editing' },
          { _id: '5', title: 'Advanced DaVinci Resolve Color Grading', description: 'Learn Hollywood-grade color correction, nodes, and HDR workflows.', price: 79, duration: '6h 15m', studentsCount: 312, rating: 4.8, category: 'Color Grading' },
          { _id: '6', title: 'Motion Graphics & VFX in After Effects', description: 'Create jaw-dropping visual effects, kinetic typography, and 3D camera tracking.', price: 89, duration: '10h 00m', studentsCount: 584, rating: 5.0, category: 'VFX' }
        ]);
      }
    };
    fetchCourses();
  }, []);

  const categories = [
    { name: 'All', count: courses.length },
    { name: 'Basic Internet Skills', count: courses.filter(c => (c.category || '').toLowerCase() === 'basic internet skills').length },
    { name: 'Development', count: courses.filter(c => (c.category || '').toLowerCase() === 'development').length },
    { name: 'Video Editing', count: courses.filter(c => (c.category || '').toLowerCase() === 'video editing').length },
    { name: 'Color Grading', count: courses.filter(c => (c.category || '').toLowerCase() === 'color grading').length },
    { name: 'VFX', count: courses.filter(c => (c.category || '').toLowerCase() === 'vfx').length }
  ];

  const types = [
    { name: 'All', count: courses.length },
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
    <div className="min-h-screen pt-6 pb-20 px-4 sm:px-8 lg:px-12 w-full bg-white text-slate-900 font-sans">
      
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 text-center mb-8">{error}</div>}

      {/* Main container with relative positioning so the sticky sidebar stays strictly bounded inside it */}
      <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 w-full items-start">
        
        {/* Left Sidebar Filters: Stays completely static/fixed in place relative to the viewport once scrolled past, but stops naturally and never overlaps the footer because its parent container boundaries stop here */}
        <div className="lg:col-span-1 space-y-6 bg-slate-100 p-6 rounded-2xl border border-slate-300 shadow-md lg:sticky lg:top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto z-20">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Courses..."
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
              We found <span className="text-teal-700 font-black">{filteredCourses.length}</span> courses available for you
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">View</span>
              <div className="p-1 rounded-lg bg-[#e4f8f8] border border-[#b0e2e2] text-slate-800 shadow-sm">
                <GridIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-xs font-bold">No courses found matching your selected filters.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}