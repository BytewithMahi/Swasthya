'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';

const stats = [
  {
    label: 'Outbreak Forecast Precision',
    target: 98.4,
    suffix: '%',
    icon: Award,
    subtext: 'Validated across 12 epidemic models',
    color: 'text-primary'
  },
  {
    label: 'Admins Weekly Time Saved',
    target: 12.5,
    suffix: 'h',
    icon: Clock,
    subtext: 'Automated bed and stock reporting',
    color: 'text-secondary'
  },
  {
    label: 'Blockchain Sealed Ledgers',
    target: 142,
    suffix: 'k+',
    icon: ShieldCheck,
    subtext: 'Zero data breaches since deployment',
    color: 'text-accent'
  },
  {
    label: 'Integrity Sync Consensus',
    target: 99.9,
    suffix: '%',
    icon: ShieldAlert,
    subtext: 'Network availability across clinics',
    color: 'text-cyan-soft'
  }
];

export default function Stats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // ms
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);

      setCounts(
        stats.map((stat) => {
          const currentVal = easeProgress * stat.target;
          return Number(currentVal.toFixed(1));
        })
      );

      if (frame >= totalFrames) {
        clearInterval(timer);
        // Set exact targets at end
        setCounts(stats.map((stat) => stat.target));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-dot-pattern">
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[700px] h-[300px] bg-secondary/3 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-accent/15 text-accent font-bold text-xs tracking-wider uppercase mb-4 inline-block">
            Proven Outcomes
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6">
            Pioneering Metric Standards in Rural Health
          </h2>
          <p className="text-lg text-txt-muted max-w-xl mx-auto font-normal">
            Real deployments validating clinical forecasting and administrative overhead reduction at public facilities.
          </p>
        </div>

        {/* Stats Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const currentCount = counts[index];
            
            // Format to integer if no decimal fraction exists or if it's over 100
            const displayVal = currentCount % 1 === 0 ? Math.floor(currentCount) : currentCount.toFixed(1);

            return (
              <motion.div
                key={index}
                className="clay-card p-6 md:p-8 flex flex-col justify-between border border-white hover:scale-102 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <div>
                  {/* Icon badge */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6">
                    <Icon className={`w-5.5 h-5.5 ${stat.color}`} />
                  </div>

                  {/* Stat Number */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-4xl md:text-5xl font-black tracking-tight text-txt-main">
                      {displayVal}
                    </span>
                    <span className="text-2xl font-extrabold text-primary">
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-bold text-txt-main mb-1.5">
                    {stat.label}
                  </h3>
                </div>

                {/* Subtext info */}
                <p className="text-xs text-txt-muted font-normal block mt-4 border-t border-slate-100 pt-4">
                  {stat.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
