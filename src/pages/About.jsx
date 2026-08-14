import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, BookOpen, Award, Users, CheckCircle2, 
  Play, ShieldCheck, Zap, Globe, Sparkles, TrendingUp, 
  Laptop, GraduationCap 
} from 'lucide-react';
import editorBgImage from '../assets/image.png';
import instructor1Img from '../assets/testimonial1.png';
import instructor2Img from '../assets/testimonial2.png';
import instructor3Img from '../assets/student1.png';

export default function About() {
  const offerings = [
    {
      icon: <Video className="w-5 h-5 text-[#001FD1]" />,
      title: "Video Courses",
      desc: "Pro masterclasses in Premiere Pro, DaVinci Resolve, and After Effects for video editors."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      title: "Learning Materials",
      desc: "Downloadable raw footage, cinematic LUTs, sound effects, and project files."
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      title: "Expert Instructors",
      desc: "Learn real-world video editing techniques from professional creators."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      title: "Progress Tracking",
      desc: "Track your video editing course milestones and lesson completion seamlessly."
    },
    {
      icon: <Award className="w-5 h-5 text-purple-600" />,
      title: "Certificates",
      desc: "Earn verifiable certificates of completion to showcase your editing skills."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
      title: "Student Support",
      desc: "Get fast technical support and guidance from our creator community."
    }
  ];

  const benefits = [
    {
      icon: <Play className="w-5 h-5 text-[#001FD1]" />,
      title: "High-Quality Video Lessons",
      desc: "Crystal-clear HD video tutorials with practical timeline editing workflows."
    },
    {
      icon: <Globe className="w-5 h-5 text-amber-500" />,
      title: "Learn Anywhere",
      desc: "Stream lessons on any device, anytime at your own editing pace."
    },
    {
      icon: <Laptop className="w-5 h-5 text-emerald-600" />,
      title: "Easy-to-Use Platform",
      desc: "Clean, distraction-free interface built for focused video learning."
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: "Practical Learning",
      desc: "Edit real commercial projects and build an impressive portfolio."
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
      title: "Affordable Education",
      desc: "Professional video training made accessible with lifetime access."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-rose-600" />,
      title: "Continuous Learning",
      desc: "Monthly updates with new editing tutorials, presets, and asset packs."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create an account",
      desc: "Sign up in seconds to access your video editing dashboard."
    },
    {
      number: "02",
      title: "Choose a course",
      desc: "Pick from color grading, motion graphics, and editing masterclasses."
    },
    {
      number: "03",
      title: "Watch and learn",
      desc: "Follow along step-by-step with timeline files and raw assets."
    },
    {
      number: "04",
      title: "Complete & Get Certified",
      desc: "Finish your projects and earn your professional certificate."
    }
  ];

  const instructors = [
    {
      name: "Mr. Haile",
      expertise: "Founder & Lead Video Producer",
      desc: "Professional video editor and creator helping editors master high-end post-production.",
      image: instructor1Img
    },
    {
      name: "Bantalem Mitiku",
      expertise: "Senior Developer & Editor",
      desc: "Expert in video workflows, motion design, and technical editing tools.",
      image: instructor2Img
    },
    {
      name: "Abebe Kebede",
      expertise: "Colorist & VFX Artist",
      desc: "Award-winning DaVinci Resolve colorist and visual effects specialist.",
      image: instructor3Img
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans text-[12px] -mt-14 md:-mt-[104px]">
      
      {/* 1. HERO SECTION - Attached directly to header with zero gap, blue background theme */}
      <div className="relative pt-30 pb-14 px-4 sm:px-6 lg:px-8 text-white overflow-hidden bg-gradient-to-r from-blue-600 via-[#001FD1] to-[#0B1D3A]">
        <div className="absolute inset-0 z-0">
          <img 
            src={editorBgImage} 
            alt="Video Editor Workspace" 
            className="w-full h-full object-cover opacity-35 contrast-125 brightness-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-[#001FD1]/75 to-[#0B1D3A]/85 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 border border-white/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md shadow-md">
            <span>Video Editing & Learning Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md">
            Learn. Create. Grow.
          </h1>

          <p className="text-[12px] sm:text-[13px] text-slate-200 max-w-xl mx-auto font-medium leading-relaxed drop-shadow">
            High-quality video-based courses, tutorials, and editing assets for video creators and editors.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/courses"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[12px] uppercase tracking-wider shadow-md transition-all"
            >
              Explore Courses
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-black text-[12px] uppercase tracking-wider backdrop-blur-md transition-all"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>

      {/* 2. WHO WE ARE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#001FD1] text-[11px] font-bold uppercase tracking-wider">
              Who We Are
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Master Professional Video Editing & Creator Skills
            </h2>
            <p className="text-[12px] sm:text-[13px] text-slate-600 font-medium leading-relaxed">
              We provide practical masterclasses and ready-to-use editing resources for video editors. We bridge the gap between amateur editing and broadcast-level post-production.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#001FD1] flex items-center justify-center font-bold">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-[12px]">Our Mission</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  To make high-end video editing and media production skills accessible to every creator.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-[12px]">Our Vision</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  To empower the next generation of video editors with top-tier masterclasses and assets.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#001FD1]/15 to-amber-500/15 rounded-3xl blur-2xl"></div>
            <div className="bg-gradient-to-br from-[#0B1D3A] to-[#142f56] rounded-3xl p-6 sm:p-8 text-white relative z-10 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 font-black text-[12px]">
                    MH
                  </div>
                  <div>
                    <h4 className="font-black text-[12px]">Video Editor Hub</h4>
                    <p className="text-[10px] text-slate-300">Professional Post-Production</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Pro Grade
                </span>
              </div>

              <ul className="space-y-3 text-[12px]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">Premiere Pro & DaVinci Resolve masterclass tutorials.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">Downloadable RAW footage, LUTs, and transitions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">Verifiable certificates upon course completion.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[12px]">
                <span className="text-slate-300">Ready to edit better?</span>
                <Link to="/courses" className="text-amber-400 font-extrabold hover:underline">
                  View Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WHAT WE OFFER */}
      <div className="bg-white py-12 sm:py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#001FD1] text-[11px] font-bold uppercase tracking-wider">
              What We Offer
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tools & Courses for Video Editors
            </h2>
            <p className="text-[12px] text-slate-500 font-medium">
              Everything you need to level up your video editing and post-production workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map((item, index) => (
              <div 
                key={index}
                className="bg-slate-50 hover:bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200/70 hover:border-blue-200 transition-all space-y-2.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-[12px] font-black text-slate-900">{item.title}</h3>
                <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. WHY CHOOSE US */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
            Why Choose Us
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Designed for Video Creators
          </h2>
          <p className="text-[12px] text-slate-500 font-medium">
            Discover why video editors choose our platform for professional learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2.5 hover:border-emerald-300 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center font-bold">
                {benefit.icon}
              </div>
              <h3 className="text-[12px] font-extrabold text-slate-900">{benefit.title}</h3>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HOW IT WORKS */}
      <div className="bg-[#0B1D3A] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
              Simple 4-Step Process
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-[12px] text-slate-300">
              Start your video editing masterclass in 4 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/10 transition-all"
              >
                <div className="text-xl font-black text-amber-400 font-mono">
                  {step.number}
                </div>
                <h3 className="text-[12px] font-extrabold text-white">{step.title}</h3>
                <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-[12px] uppercase tracking-wider shadow-md transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* 7. INSTRUCTORS / TEAM */}
      <div className="bg-white py-12 sm:py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#001FD1] text-[11px] font-bold uppercase tracking-wider">
              Expert Mentors
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Meet Our Instructors
            </h2>
            <p className="text-[12px] text-slate-500">
              Learn professional video editing from experienced creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((instructor, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-200/70 hover:shadow-md transition-all space-y-3 pb-5 group"
              >
                <div className="w-full h-40 overflow-hidden bg-slate-200 relative">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-black text-[12px]">{instructor.name}</h4>
                    <p className="text-[10px] text-amber-300 font-bold">{instructor.expertise}</p>
                  </div>
                </div>
                <div className="px-5 space-y-1.5">
                  <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                    {instructor.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. OUR MISSION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-[#0B1D3A] to-[#142f56] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              Our Core Mission
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              Making Quality Video Education Accessible & Practical
            </h2>
            <p className="text-[12px] sm:text-[13px] text-slate-300 font-medium leading-relaxed">
              We empower video editors and creators worldwide with professional masterclasses, tools, and hands-on guidance to create stunning visual content.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/courses"
              className="px-5 py-3 rounded-xl bg-white text-[#0B1D3A] hover:bg-slate-100 font-black text-[12px] uppercase tracking-wider shadow-xl transition-all"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

      {/* 9. FINAL CTA */}
      <div className="bg-white py-12 sm:py-16 border-t border-slate-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ready to Start Learning?
          </h2>
          <p className="text-[12px] sm:text-[13px] text-slate-500 max-w-md mx-auto font-medium">
            Explore our video editing courses today and take your creative skills to the next level.
          </p>
          <div className="pt-2">
            <Link
              to="/courses"
              className="px-6 py-3 rounded-xl bg-[#001FD1] hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-wider shadow-md transition-all"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

function Target(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function Eye(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
