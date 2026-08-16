import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Play, CheckCircle2, ShieldCheck, Lock, Video, MessageSquare, Send, AlertCircle, Check, Sparkles, Menu, X } from 'lucide-react';
import { courseAPI, paymentAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeLessonId, setActiveLessonId] = useState('');
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('mediadelivery.net') || url.includes('/embed/') || url.includes('.mp4') || url.includes('.webm')) {
      return url;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const isEnrolled = user && course && (
    (user.enrolledCourses && user.enrolledCourses.some(c => {
      const cStr = typeof c === 'object' && c !== null ? (c._id?.toString() || c.toString()) : String(c);
      return cStr === String(id) || cStr === String(course?._id);
    })) ||
    Boolean(course?.isEnrolled) ||
    Number(course?.price) === 0
  );

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        const [courseRes, reviewsRes] = await Promise.all([
          courseAPI.getCourseById(id),
          reviewAPI.getReviewsByTarget(id).catch(() => ({ data: [] }))
        ]);
        const courseData = courseRes.data;
        setCourse(courseData);
        
        const revData = reviewsRes.data;
        const revList = Array.isArray(revData) ? revData : (revData?.reviews || revData?.data || revData?.result || []);
        setReviews(Array.isArray(revList) ? revList : []);

        if (courseData.lessons && courseData.lessons.length > 0) {
          const firstLesson = courseData.lessons[0];
          setActiveLessonId(firstLesson._id || firstLesson.id);
          const userEnrolled = user && ((user.enrolledCourses && user.enrolledCourses.some(c => (c._id === id || c === id || c._id === courseData?._id || c === courseData?._id))) || courseData?.price === 0);
          if (userEnrolled || firstLesson.freePreview) {
            const rawUrl = firstLesson.videoUrl || (firstLesson.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${firstLesson.bunnyVideoId}` : '');
            setActiveVideoUrl(getEmbedUrl(rawUrl));
          } else {
            setActiveVideoUrl('');
          }
        }
      } catch (err) {
        console.error('Failed to fetch course detail or reviews', err);
        setError('Failed to load course from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndReviews();
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review.');
      navigate('/login');
      return;
    }
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const res = await reviewAPI.createReview({
        targetId: id,
        targetType: 'Course',
        rating: Number(newRating),
        comment: newComment
      });
      const createdReview = res.data.review || res.data.data || res.data;
      setReviews([createdReview, ...(Array.isArray(reviews) ? reviews : [])]);
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error('Failed to submit review', err);
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleChapaCheckout = async () => {
    if (!user) {
      alert('Please login first to enroll in courses.');
      navigate('/login');
      return;
    }
    try {
      setPaying(true);
      localStorage.setItem('pending_course_id', course._id);
      const res = await paymentAPI.initializeChapa({
        courseId: course._id,
        mock: mockMode,
      });
      const checkoutUrl = res.data?.checkoutUrl || res.data?.checkout_url || res.data?.data?.checkoutUrl || res.data?.data?.checkout_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Failed to obtain Chapa checkout URL from backend.');
      }
    } catch (err) {
      console.error('Payment initialization failed', err);
      alert(err.response?.data?.message || 'Payment initialization failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 text-center text-slate-800 text-[11px] font-semibold">Loading course...</div>;
  }

  if (error || !course) {
    return <div className="min-h-screen pt-20 text-center text-slate-800 px-4 text-[11px] font-semibold">{error || 'Course not found.'}</div>;
  }

  const currentLessonIndex = (course.lessons || []).findIndex(l => (l._id || l.id) === activeLessonId);
  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < (course.lessons || []).length - 1 ? course.lessons[currentLessonIndex + 1] : null;

  const renderLessonsList = () => (
    <div className="space-y-0.5">
      {(course.lessons || []).map((lesson, index) => {
        const lessonId = lesson._id || lesson.id;
        const rawUrl = lesson.videoUrl || (lesson.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${lesson.bunnyVideoId}` : '');
        const lessonUrl = getEmbedUrl(rawUrl);
        const isAccessible = isEnrolled || lesson.freePreview;
        const isPlaying = activeLessonId === lessonId;

        return (
          <div
            key={lessonId || index}
            onClick={() => {
              if (isAccessible && lessonUrl) {
                setActiveVideoUrl(lessonUrl);
                setActiveLessonId(lessonId);
                setMobileMenuOpen(false);
              } else {
                alert('This lesson is locked. Please purchase/enroll in this course via Chapa to unlock all video lessons.');
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer space-y-0.5 ${
              isPlaying 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'hover:bg-slate-200/50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[8px] font-bold uppercase tracking-wider ${isPlaying ? 'text-amber-400' : 'text-slate-400'}`}>
                {isPlaying ? 'PLAYING' : (index === 0 ? 'COMPLETED' : 'PENDING')}
              </span>
              {!isAccessible && <Lock className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />}
            </div>
            <h4 className="text-[11px] font-medium leading-tight">{lesson.title}</h4>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen pt-0 pb-8 w-full bg-white text-slate-900 font-sans">
      
      {/* Top Navigation Bar inside Course View */}
      <div className="border-b border-slate-100 bg-white px-3 sm:px-5 py-2 flex items-center justify-between shadow-2xs sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/courses')} className="text-[11px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5">← Back</button>
          <span className="text-slate-300 hidden sm:inline text-xs">/</span>
          <h2 className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-sm">{course.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px] flex items-center gap-1"
          >
            {mobileMenuOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
            <span>Lessons</span>
          </button>
          <span className="hidden sm:flex items-center gap-1 text-slate-800 text-[10px] font-bold">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 
            <span>{course.averageRating || 4.9}</span>
            <span className="text-slate-400 font-normal">({course.numReviews || 0})</span>
          </span>
          {isEnrolled ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-bold text-[10px] hidden sm:inline">Enrolled</span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 font-bold text-[10px] hidden sm:inline">Not Enrolled</span>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-12 z-40 bg-white border-b border-slate-200 p-2.5 shadow-md max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-700">
            <span>Lessons ({(course.lessons || []).length})</span>
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-3.5 h-3.5" /></button>
          </div>
          {renderLessonsList()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 w-full">
        
        {/* Left Sidebar: Sticky on Desktop */}
        <div className="hidden lg:block lg:col-span-1 border-r border-slate-100 bg-slate-50/50 sticky top-10 h-[calc(100vh-40px)] overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 text-[11px] font-bold text-slate-700">
            <span>Course Contents</span>
            <span className="text-[10px] text-slate-400 font-normal">{(course.lessons || []).length}</span>
          </div>
          {renderLessonsList()}
        </div>

        {/* Right Main Area: Video Player, Details & Reviews */}
        <div className="lg:col-span-3 p-3 sm:p-4 lg:p-6 space-y-4 bg-white">
          
          {/* Previous / Next Lesson Navigation Bar */}
          <div className="bg-slate-900 text-white p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-2 shadow-md">
            
            {/* Previous Item */}
            <button
              disabled={!prevLesson}
              onClick={() => {
                if (prevLesson) {
                  const rawUrl = prevLesson.videoUrl || (prevLesson.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${prevLesson.bunnyVideoId}` : '');
                  const url = getEmbedUrl(rawUrl);
                  const accessible = isEnrolled || prevLesson.freePreview;
                  if (accessible && url) {
                    setActiveVideoUrl(url);
                    setActiveLessonId(prevLesson._id || prevLesson.id);
                  } else {
                    alert('Previous lesson is locked.');
                  }
                }
              }}
              className="flex items-center gap-1.5 text-left disabled:opacity-30 hover:opacity-80 transition-all max-w-[30%]"
            >
              <div className="text-sm font-black">&#9664;</div>
              <div className="truncate">
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Previous</div>
                <div className="text-[11px] font-semibold truncate">{prevLesson ? prevLesson.title : 'First Lesson'}</div>
              </div>
            </button>

            {/* Progress & Counter */}
            <div className="flex items-center gap-2 flex-1 max-w-[200px] justify-center">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all" 
                  style={{ width: `${Math.round(((currentLessonIndex + 1) / (course.lessons || []).length) * 100)}%` }} 
                />
              </div>
              <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap">
                {Math.round(((currentLessonIndex + 1) / (course.lessons || []).length) * 100)}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                {currentLessonIndex + 1}/{(course.lessons || []).length}
              </span>
            </div>

            {/* Next Item */}
            <button
              disabled={!nextLesson}
              onClick={() => {
                if (nextLesson) {
                  const rawUrl = nextLesson.videoUrl || (nextLesson.bunnyVideoId ? `https://iframe.mediadelivery.net/embed/718466/${nextLesson.bunnyVideoId}` : '');
                  const url = getEmbedUrl(rawUrl);
                  const accessible = isEnrolled || nextLesson.freePreview;
                  if (accessible && url) {
                    setActiveVideoUrl(url);
                    setActiveLessonId(nextLesson._id || nextLesson.id);
                  } else {
                    alert('Next lesson is locked. Please enroll to unlock.');
                  }
                }
              }}
              className="flex items-center gap-1.5 text-right justify-end disabled:opacity-30 hover:opacity-80 transition-all max-w-[30%]"
            >
              <div className="truncate">
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Next</div>
                <div className="text-[11px] font-semibold truncate">{nextLesson ? nextLesson.title : 'Last Lesson'}</div>
              </div>
              <div className="text-sm font-black">&#9658;</div>
            </button>

          </div>

          {/* Video Player */}
          <div className="relative rounded-xl overflow-hidden bg-black shadow-md border border-slate-100">
            <div className="relative h-52 sm:h-72 lg:h-[360px] flex items-center justify-center">
              {activeVideoUrl ? (
                <iframe
                  src={activeVideoUrl}
                  title={course.title}
                  loading="lazy"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-center p-4">
                  <Lock className="w-6 h-6 text-amber-400 mb-1 animate-pulse" />
                  <h3 className="text-white text-[11px] font-bold mb-0.5">Content Locked</h3>
                  <p className="text-slate-400 text-[10px] max-w-xs mb-3">Complete enrollment via Chapa to unlock all video lessons.</p>
                  <button
                    onClick={handleChapaCheckout}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[10px] shadow transition-all"
                  >
                    Enroll Now (${course.price})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Course Details & Minimal Pricing Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{course.category || 'Development'}</span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-600 text-[11px] leading-relaxed max-w-xl">{course.description}</p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-slate-500 font-medium">
                <span>Instructor: {course.instructor || 'Mr. Haile'}</span>
                <span>•</span>
                <span>{course.enrolledStudentsCount || 0} enrolled</span>
              </div>
            </div>
            <div className="flex items-center md:flex-col items-end justify-between w-full md:w-auto gap-2 bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-medium">Price</div>
                <div className="text-lg font-black text-slate-900">${course.price}</div>
              </div>
              <div className="flex flex-col items-end gap-1 w-full">
                <label className="text-[9px] text-slate-500 flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mockMode}
                    onChange={(e) => setMockMode(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 w-2.5 h-2.5"
                  />
                  <span>Mock Mode (Dev)</span>
                </label>
                <button
                  onClick={handleChapaCheckout}
                  disabled={paying || isEnrolled}
                  className={`w-full px-4 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-all ${
                    isEnrolled ? 'bg-emerald-600 text-white cursor-default' : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  <span>{paying ? '...' : (isEnrolled ? 'Enrolled ✓' : `Enroll ($${course.price})`)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Minimal Reviews & Feedback Section */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Student Reviews
            </h3>

            {reviewError && (
              <div className="p-2 rounded-md bg-rose-50 border border-rose-100 text-[10px] text-rose-600 text-center">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">Leave a Review</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-amber-500 focus:outline-none"
                >
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full bg-white border border-slate-200 rounded-md p-2 text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center gap-1 disabled:opacity-50 transition-all"
                >
                  <span>{reviewSubmitting ? 'Posting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>

            <div className="space-y-2 divide-y divide-slate-100">
              {Array.isArray(reviews) && reviews.map((rev, i) => (
                <div key={rev._id || i} className="py-2 space-y-0.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900">{rev.user?.firstName || rev.userName || 'Student'}</span>
                    <span className="text-amber-500 text-[10px]">{'★'.repeat(rev.rating || 5)}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">{rev.comment}</p>
                </div>
              ))}
              {(!Array.isArray(reviews) || reviews.length === 0) && (
                <p className="text-slate-400 text-[11px] py-2 text-center">No reviews yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}