'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface MergeCommit {
  username: string;
  hash: string;
  timestamp: string;
  message: string;
  url: string;
}

export default function Progress() {
  const [merges, setMerges] = useState<MergeCommit[]>([]);
  const [completion, setCompletion] = useState('60');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProgressData() {
      try {
        // Fetch merges
        const mergesRes = await fetch('/api/github/merges');
        const mergesData = await mergesRes.json();
        if (mergesRes.ok && mergesData.success && mergesData.merges) {
          setMerges(mergesData.merges);
        } else {
          setError(true);
        }

        // Fetch settings for project completion percentage
        const settingsRes = await fetch('/api/settings');
        const settingsData = await settingsRes.json();
        if (settingsRes.ok && settingsData.success && settingsData.settings && settingsData.settings.project_completion !== undefined) {
          setCompletion(settingsData.settings.project_completion);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProgressData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (loading) return;

    const end = parseInt(completion, 10) || 0;
    if (end === 0) {
      setDisplayPercent(0);
      return;
    }

    const duration = 1200; // 1.2 seconds animation
    const startTime = performance.now();

    function animatePercent(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing: easeOutQuad
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * end);

      setDisplayPercent(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animatePercent);
      } else {
        setDisplayPercent(end);
      }
    }

    requestAnimationFrame(animatePercent);
  }, [completion, loading]);

  return (
    <section id="progress" className="py-28 relative overflow-hidden bg-dot-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-[30%] left-[10%] w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            className="px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs tracking-wider uppercase mb-4 inline-block animate-pulse"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Development Stream
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Realtime Development Updates!
          </motion.h2>
          <motion.p
            className="text-lg text-txt-muted max-w-xl mx-auto font-normal"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What have we done so far?
          </motion.p>
        </div>

        {/* Content layout: Left box = progress status, Right box = merges list */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Project Completion Status */}
          <div className="lg:col-span-5 flex">
            <motion.div
              className="w-full clay-card p-8 md:p-10 border border-white bg-white/70 backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Subtle background gradient */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />

              <h3 className="text-sm font-extrabold text-txt-muted uppercase tracking-widest mb-6 relative z-10">
                System Milestone Status
              </h3>

              <div className="relative w-40 h-40 flex items-center justify-center mb-6 z-10">
                {/* Outer decorative pulsing circle */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />

                {/* SVG Circular Progress Bar */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="stroke-slate-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="stroke-primary"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * displayPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                  />
                </svg>

                {/* Inner percentage text */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black text-txt-main tracking-tighter">
                    {displayPercent}%
                  </span>
                  <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider mt-1">
                    Deployed
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-txt-main relative z-10 leading-relaxed max-w-xs">
                The project is <span className="text-primary font-black">{displayPercent}%</span> done.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Merges List */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 clay-card border border-white/60 bg-white/40 backdrop-blur-md h-full">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <span className="text-xs text-txt-muted font-bold uppercase tracking-wider">Syncing Git commits...</span>
              </div>
            ) : error || merges.length === 0 ? (
              <div className="text-center py-16 clay-card border border-white/60 bg-white/40 backdrop-blur-md h-full flex items-center justify-center">
                <p className="text-sm font-semibold text-txt-muted">Failed to sync repository telemetry. Please refresh.</p>
              </div>
            ) : (
              merges.map((merge, idx) => (
                <motion.div
                  key={merge.hash}
                  className="clay-card p-5 border border-white/60 hover:border-secondary/20 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs md:text-sm font-bold text-txt-main"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <a
                    href={merge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary hover:underline hover:text-primary/80 transition-colors"
                  >
                    {merge.hash}
                  </a>
                  <span className="hidden sm:inline text-txt-muted">—</span>
                  <span className="text-txt-main">@{merge.username}</span>
                  <span className="hidden sm:inline text-txt-muted">—</span>
                  <span className="text-txt-muted font-normal">
                    {new Date(merge.timestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
