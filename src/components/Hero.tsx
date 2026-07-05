'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Download, Activity, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Parallax / Tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-300, 300], [10, -10]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-10, 10]), { damping: 25, stiffness: 200 });

  // Floating card offsets (parallax layers)
  const layer1X = useTransform(x, [-300, 300], [-15, 15]);
  const layer1Y = useTransform(y, [-300, 300], [-15, 15]);

  const layer2X = useTransform(x, [-300, 300], [20, -20]);
  const layer2Y = useTransform(y, [-300, 300], [20, -20]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || windowWidth < 1024) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Text Reveal Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 35, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden bg-grid-pattern"
    >
      {/* Decorative center light glow */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Premium Typography & CTAs */}
        <motion.div
          className="lg:col-span-6 flex flex-col items-start text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Platform Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/20 text-primary font-bold text-xs tracking-wider uppercase mb-6 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            AI Healthcare Intelligence Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6.5xl font-extrabold tracking-tight text-txt-main leading-[1.08] mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Swasthya
            </span>
            <br />
            <span className="text-txt-main font-extrabold">Smart Healthcare.</span>
            <br />
            <span className="text-txt-main/80 font-cursive text-5xl md:text-6xl block mt-1 tracking-normal font-normal">Better Tomorrow.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-txt-muted font-normal max-w-xl mb-10 leading-relaxed"
          >
            Empowering administrators, PHCs, and CHCs with secure blockchain records, real-time demand modeling, and predictive healthcare insights.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={scrollToWaitlist}
              className="px-8 py-4 rounded-2xl clay-btn-primary flex items-center justify-center gap-2 group text-base cursor-pointer"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollToWaitlist}
              className="px-8 py-4 rounded-2xl clay-btn-secondary flex items-center justify-center gap-2 border border-slate-200 text-base cursor-pointer"
            >
              <Download className="w-5 h-5 text-primary" />
              Install App
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Floating 3D Device mockups & Claymorphic Cards */}
        <motion.div
          className="lg:col-span-6 flex items-center justify-center relative w-full h-[580px] lg:h-[650px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
        >
          {/* Interactive tilted workspace container */}
          <motion.div
            className="w-[320px] sm:w-[350px] relative h-full flex items-center justify-center"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          >
            {/* Background tablet shape overlay */}
            <div className="absolute top-[15%] -left-[25%] w-[420px] h-[280px] rounded-[32px] glass-panel border border-white/70 shadow-lg -rotate-6 hidden sm:flex flex-col p-5 overflow-hidden select-none pointer-events-none z-0">
              <div className="flex items-center justify-between border-b border-primary/5 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="text-[9px] font-bold text-txt-muted uppercase tracking-widest">HQ COMMAND</div>
              </div>
              <div className="flex gap-4 flex-1">
                <div className="w-1/3 flex flex-col gap-2">
                  <div className="h-10 rounded-lg bg-primary/10 animate-pulse" />
                  <div className="h-6 rounded-lg bg-secondary/10" />
                  <div className="h-6 rounded-lg bg-slate-200/50" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-end gap-1 h-20 border-b border-slate-200 pb-1">
                    <div className="w-full bg-primary/20 rounded-t-xs h-[40%]" />
                    <div className="w-full bg-primary/45 rounded-t-xs h-[75%]" />
                    <div className="w-full bg-secondary/60 rounded-t-xs h-[50%]" />
                    <div className="w-full bg-primary rounded-t-xs h-[90%]" />
                  </div>
                  <div className="flex justify-between text-[8px] font-semibold text-txt-muted">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Claymorphic Mobile Phone Mockup */}
            <motion.div
              className="w-full h-[520px] rounded-[48px] bg-white border-[6px] border-slate-100/90 shadow-2xl relative overflow-hidden flex flex-col select-none z-10"
              style={{
                boxShadow: `
                  inset 4px 4px 8px rgba(255, 255, 255, 0.9), 
                  inset -6px -6px 12px rgba(165, 180, 252, 0.1),
                  0 25px 60px -15px rgba(79, 124, 255, 0.25)
                `
              }}
            >
              {/* Bezel details */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-100 rounded-b-2xl z-30 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
              </div>

              {/* Inside Mobile Screen Content */}
              <div className="flex-1 flex flex-col pt-9 px-5 bg-gradient-to-b from-bg-base via-white to-bg-base overflow-hidden">
                <div className="flex items-center justify-between mt-3 mb-5">
                  <div>
                    <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">MEMBER PORTAL</span>
                    <span className="text-base font-extrabold text-txt-main">District Care</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    HQ
                  </div>
                </div>

                {/* Queue Card */}
                <div className="p-4 rounded-2xl clay-card mb-4 border border-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-txt-main">OPD Load Index</span>
                    <Activity className="w-4 h-4 text-accent animate-pulse" />
                  </div>
                  <span className="text-3xl font-extrabold text-txt-main">84.2%</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      className="bg-accent h-full rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '84.2%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Patient Roster Widget */}
                <div className="flex-1 flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Live PHC Occupancy</span>
                  
                  <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="text-xs font-semibold text-txt-main">PHC Sector 4</span>
                    </div>
                    <span className="text-xs font-extrabold text-txt-main">12 / 15 Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-xs font-semibold text-txt-main">CHC North-East</span>
                    </div>
                    <span className="text-xs font-extrabold text-txt-main">34 / 40 Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="text-xs font-semibold text-txt-main">Sub-Center A</span>
                    </div>
                    <span className="text-xs font-extrabold text-txt-main">4 / 5 Beds</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CLAYMORPHISM CARD 1: AI Predictions */}
            <motion.div
              style={{ x: layer1X, y: layer1Y, z: 50 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-[35%] top-[10%] w-[165px] p-4 rounded-2xl clay-card border border-white z-20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">AI Forecast</span>
              </div>
              <span className="text-sm font-extrabold text-txt-main block">Dengue Spike</span>
              <span className="text-[10px] text-txt-muted font-semibold">92% Outbreak Risk</span>
            </motion.div>

            {/* FLOATING CLAYMORPHISM CARD 2: Smart Alerts */}
            <motion.div
              style={{ x: layer2X, y: layer2Y, z: 60 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-[35%] top-[30%] w-[175px] p-4 rounded-2xl clay-card border border-white z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Smart Alert</span>
              </div>
              <span className="text-[11px] font-bold text-txt-main leading-tight block">Oxygen Refill Due</span>
              <span className="text-[9px] text-txt-muted font-semibold block mt-0.5">PHC-Sector 12 • 4h left</span>
            </motion.div>

            {/* FLOATING CLAYMORPHISM CARD 3: Blockchain Security */}
            <motion.div
              style={{ x: layer1X, y: layer2Y, z: 70 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -left-[30%] bottom-[12%] w-[170px] p-4 rounded-2xl clay-card border border-white z-20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Ledger Security</span>
              </div>
              <span className="text-[11px] font-bold text-txt-main leading-tight block">Integrity Sealed</span>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-accent">
                <CheckCircle className="w-3.5 h-3.5 fill-accent/10" /> Verified EHR Block
              </div>
            </motion.div>

            {/* FLOATING CLAYMORPHISM CARD 4: Real-Time Monitoring */}
            <motion.div
              style={{ x: layer2X, y: layer1Y, z: 50 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -right-[32%] bottom-[5%] w-[165px] p-4 rounded-2xl clay-card border border-white z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Pulse Tracker</span>
              </div>
              <span className="text-xl font-black text-txt-main">1,482</span>
              <span className="text-[9px] text-txt-muted font-bold block mt-0.5">Active District Cases</span>
            </motion.div>

            {/* FLOATING MEDICINE CAPSULE 1 (mHealth Coral-Red & White) */}
            <motion.div
              style={{
                x: layer2X,
                y: layer1Y,
                z: 90,
                background: 'linear-gradient(to bottom, #FF4A5A 50%, #FFFFFF 50%)',
                boxShadow: 'inset 2px 2px 4px rgba(255, 255, 255, 0.45), inset -3px -3px 6px rgba(0, 0, 0, 0.15), 0 15px 30px -8px rgba(255, 74, 90, 0.25)'
              }}
              animate={{ y: [0, -18, 0], rotate: [30, 48, 30] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute -right-[18%] top-[-8%] w-10 h-20 rounded-full border border-white/60 z-20 overflow-hidden"
            />

            {/* FLOATING MEDICINE CAPSULE 2 (Surgical Cyan & White) */}
            <motion.div
              style={{
                x: layer1X,
                y: layer2Y,
                z: 85,
                background: 'linear-gradient(to bottom, #06B6D4 50%, #FFFFFF 50%)',
                boxShadow: 'inset 1px 1px 3px rgba(255, 255, 255, 0.45), inset -2px -2px 5px rgba(0, 0, 0, 0.15), 0 12px 24px -6px rgba(6, 182, 212, 0.2)'
              }}
              animate={{ y: [0, 15, 0], rotate: [-45, -28, -45] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              className="absolute -left-[22%] bottom-[22%] w-8 h-16 rounded-full border border-white/60 z-20 overflow-hidden"
            />

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
