import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, XCircle, Play } from 'lucide-react';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PaymentVerify() {
  const { tx_ref: paramTxRef } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const queryTxRef = queryParams.get('tx_ref');
  const tx_ref = paramTxRef || queryTxRef;
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your Chapa transaction...');
  const [targetCourseId, setTargetCourseId] = useState(null);

  const handleSimulateSuccess = async () => {
    if (!tx_ref) {
      alert('No tx_ref available for simulation.');
      return;
    }
    try {
      setStatus('verifying');
      setMessage('Simulating payment success...');
      const res = await paymentAPI.simulatePayment(tx_ref);
      await refreshProfile();
      setStatus('success');
      setMessage(res?.data?.message || 'Simulation Successful! Course enrolled.');
      const pendingCourseId = localStorage.getItem('pending_course_id');
      const courseId = res?.data?.courseId || res?.data?.enrolledCourseId || res?.data?.order?.course?._id || res?.data?.order?.course || pendingCourseId;
      if (courseId) setTargetCourseId(courseId);
      setTimeout(() => {
        const cId = courseId || pendingCourseId;
        if (cId) {
          localStorage.removeItem('pending_course_id');
          const cleanId = typeof cId === 'object' ? (cId._id || cId.id) : cId;
          navigate(`/courses/${cleanId}`);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (err) {
      console.error('Simulation failed', err);
      setStatus('error');
      setMessage(err?.response?.data?.message || 'Simulation failed.');
    }
  };

  useEffect(() => {
    const verify = async () => {
      if (!tx_ref) {
        setStatus('error');
        setMessage('Transaction reference (tx_ref) not found in URL.');
        return;
      }
      try {
        const res = await paymentAPI.verifyPayment(tx_ref);
        await refreshProfile();
        setStatus('success');
        setMessage(res?.data?.message || 'Payment Successful! Course unlocked and access link sent to your email.');

        const pendingCourseId = localStorage.getItem('pending_course_id');
        const courseId = res?.data?.courseId || res?.data?.enrolledCourseId || res?.data?.order?.course?._id || res?.data?.order?.course || pendingCourseId;
        if (courseId) {
          setTargetCourseId(courseId);
        }

        setTimeout(() => {
          const cId = courseId || pendingCourseId;
          if (cId) {
            localStorage.removeItem('pending_course_id');
            const cleanId = typeof cId === 'object' ? (cId._id || cId.id) : cId;
            navigate(`/courses/${cleanId}`);
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } catch (err) {
        console.error('Payment verification failed', err);
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Could not verify transaction with Chapa.');
      }
    };
    verify();
  }, [tx_ref, navigate, refreshProfile]);

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white text-slate-900 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {status === 'verifying' ? (
          <div className="space-y-4 py-8">
            <div className="w-16 h-16 rounded-full border-4 border-[#001FD1] border-t-transparent animate-spin mx-auto" />
            <h2 className="text-xl font-extrabold text-slate-900">Verifying Payment...</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{message}</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">{message}</p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              {targetCourseId ? (
                <Link
                  to={`/courses/${targetCourseId}`}
                  className="w-full py-3.5 rounded-2xl bg-[#001FD1] hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 text-amber-400" />
                  <span>Start Watching Course</span>
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="w-full py-3.5 rounded-2xl bg-[#001FD1] hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Go to Student Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Payment Failed</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">{message || 'Could not verify transaction with Chapa. Please try again.'}</p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              {tx_ref && (
                <button
                  onClick={handleSimulateSuccess}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Simulate Success (Dev Test)</span>
                </button>
              )}
              <Link
                to="/courses"
                className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 transition-all"
              >
                <span>Back to Courses</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
