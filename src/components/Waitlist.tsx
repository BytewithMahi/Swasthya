'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function checkLockStatus() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (res.ok && data.success && data.settings) {
          setIsLocked(data.settings.waitlist_locked === 'true');
        }
      } catch (err) {
        console.error('Failed to load waitlist configuration:', err);
      }
    }
    checkLockStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setErrorMsg(data.error || 'Failed to join. Try again.');
        setStatus('idle');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
      setStatus('idle');
    }
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
                  {/* Title & Description */}
                  <h2 className="text-3xl md:text-5xl font-black text-txt-main tracking-tight leading-tight mb-4 uppercase">
                    Join the Waitlist Now!
                  </h2>
                  <p className="text-sm md:text-base text-txt-muted max-w-xl mb-8 leading-relaxed">
                    The world has been waiting for this technology for a long time, be the first to experience it!
                  </p>

                  {/* Subscribe Form */}
                  {isLocked ? (
                    <div className="w-full max-w-lg">
                      <button
                        disabled
                        className="w-full py-4.5 px-6 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800/80 text-xs md:text-sm font-black text-center cursor-not-allowed shadow-xs transition-all tracking-wide"
                      >
                        Hey, Waitlist is full. We are hearing you soon :3
                      </button>
                    </div>
                  ) : (
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
                          placeholder="Enter your email"
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
                            Join
                            <ArrowRight className="w-4.5 h-4.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

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
                    You're on the list!
                  </h3>
                  <p className="text-sm md:text-base text-txt-muted max-w-md leading-relaxed">
                    Thank you. We will reach out to you at <strong className="text-txt-main">{email}</strong>.
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
