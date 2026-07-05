'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('administrator');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setStatus('loading');

    // Mimic API delay
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <section id="waitlist" className="py-28 relative overflow-hidden bg-dot-pattern">
      {/* Dynamic Backing Glows */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 via-secondary/5 to-accent/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Main Waitlist Panel with Gradient Border */}
        <div className="relative rounded-[36px] p-[1px] bg-gradient-to-r from-primary via-secondary to-accent shadow-2xl overflow-hidden">
          
          <div className="rounded-[35px] bg-white/90 backdrop-blur-md p-8 md:p-14 text-center flex flex-col items-center">
            
            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Badge */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-6 shadow-xs">
                    <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                    Limited Access Beta
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-3xl md:text-5xl font-black text-txt-main tracking-tight leading-tight mb-4">
                    Shape the Future of Health Systems
                  </h2>
                  <p className="text-sm md:text-base text-txt-muted max-w-xl mb-8 leading-relaxed">
                    Join health directors, medical superintendents, and regional officers in our private pilot program. Monitor resource bottlenecks and forecast disease shifts.
                  </p>

                  {/* Role Selector */}
                  <div className="flex gap-2.5 p-1 rounded-xl bg-slate-100/80 mb-8 border border-slate-200/50 select-none">
                    <button
                      type="button"
                      onClick={() => setRole('administrator')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        role === 'administrator' ? 'bg-white text-primary shadow-xs' : 'text-txt-muted hover:text-txt-main'
                      }`}
                    >
                      Medical Administrator
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('clinician')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        role === 'clinician' ? 'bg-white text-primary shadow-xs' : 'text-txt-muted hover:text-txt-main'
                      }`}
                    >
                      Medical Officer / Doctor
                    </button>
                  </div>

                  {/* Subscribe Form */}
                  <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-txt-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Enter your administrative email"
                        disabled={status === 'loading'}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200/80 focus:border-primary focus:outline-hidden text-sm text-txt-main placeholder-txt-muted transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-6 py-4 rounded-2xl clay-btn-primary flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer min-w-[140px]"
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Request Access
                          <ArrowRight className="w-4.5 h-4.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Error Message */}
                  {errorMsg && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-red-500 mt-3"
                    >
                      {errorMsg}
                    </motion.span>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-txt-main mb-2">
                    Request Received!
                  </h3>
                  <p className="text-sm md:text-base text-txt-muted max-w-md leading-relaxed">
                    Thank you. We have sent a confirmation details link to <strong className="text-txt-main">{email}</strong>. Our team will verify your clinical coordinates shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}
