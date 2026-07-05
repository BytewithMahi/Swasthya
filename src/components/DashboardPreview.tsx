'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Activity, Users, BedDouble, AlertCircle, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';

const tabs = [
  { id: 'flow', label: 'Outpatient Flow', color: '#4F7CFF' },
  { id: 'beds', label: 'Bed Occupancy', color: '#22C55E' },
  { id: 'stock', label: 'Medicine Stocks', color: '#7B61FF' }
];

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('flow');
  const [counterValue, setCounterValue] = useState(1280);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll animations for perspective scale-up
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  });

  const scale = useTransform(scrollYProgress, [0, 0.7], [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.7], [18, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);

  useEffect(() => {
    // Simple incremental counter mimicry
    const interval = setInterval(() => {
      setCounterValue((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="dashboard-preview" 
      ref={containerRef}
      className="py-28 relative overflow-hidden bg-white/20 border-y border-slate-100 flex flex-col items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* Background radial gradient glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-10 flex flex-col items-center">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs tracking-wider uppercase mb-4 inline-block">
            Command Center
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight mt-2 mb-6">
            Real-Time District Health Intelligence
          </h2>
          <p className="text-lg text-txt-muted max-w-xl mx-auto font-normal">
            Interact with the actual command layout used by state epidemiologists and health directors to coordinate care.
          </p>
        </div>

        {/* Interactive Tab Toggles */}
        <div className="flex gap-2.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/50 mb-12 select-none z-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                activeTab === tab.id ? 'text-white' : 'text-txt-muted hover:text-txt-main'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="dashTab"
                  className="absolute inset-0 bg-primary rounded-xl z-[-1] clay-card-primary"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Zooming Dashboard Mockup Frame */}
        <motion.div
          style={{ scale, rotateX, opacity, transformStyle: 'preserve-3d' }}
          className="w-full max-w-5xl rounded-[32px] bg-white border border-slate-100/90 shadow-2xl p-6 md:p-8 flex flex-col select-none cursor-default"
        >
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">LIVE COMMAND STREAM</span>
              </div>
              <h3 className="text-xl font-extrabold text-txt-main mt-1">District Core Command</h3>
            </div>
            
            {/* Quick Metrics */}
            <div className="flex items-center gap-6">
              <div className="text-left">
                <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">OUTPATIENTS</span>
                <span className="text-xl font-black text-txt-main">{counterValue}</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-left">
                <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">ALERT LEVEL</span>
                <span className="text-xs font-extrabold text-white bg-red-500 px-2 py-0.5 rounded-sm">CRITICAL</span>
              </div>
            </div>
          </div>

          {/* Grid Layout of Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Clinic list */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider mb-1 block">Active Healthcare Facilities</span>
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-xs">
                <div>
                  <h4 className="text-xs font-extrabold text-txt-main">PHC Sector 4 (Main)</h4>
                  <span className="text-[10px] text-txt-muted block mt-0.5">Staff: 8 Doctors, 12 Nurses</span>
                </div>
                <span className="text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Optimal</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-100/80 flex items-center justify-between shadow-xs">
                <div>
                  <h4 className="text-xs font-extrabold text-txt-main">CHC North-East</h4>
                  <span className="text-[10px] text-txt-muted block mt-0.5">Staff: 14 Doctors, 22 Nurses</span>
                </div>
                <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Busy</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-100/80 flex items-center justify-between shadow-xs">
                <div>
                  <h4 className="text-xs font-extrabold text-txt-main">PHC West Coast</h4>
                  <span className="text-[10px] text-txt-muted block mt-0.5">Staff: 2 Doctors, 4 Nurses</span>
                </div>
                <span className="text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Understaffed</span>
              </div>
            </div>

            {/* Center Column: Animated Chart */}
            <div className="lg:col-span-5 flex flex-col justify-between border-l border-slate-100 lg:pl-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Flow Projection Model</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-accent">
                    <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs Yesterday
                  </div>
                </div>

                {/* Animated Chart SVG container */}
                <div className="h-44 w-full relative border-b border-l border-slate-100 flex items-end justify-between px-2">
                  <AnimatePresence mode="wait">
                    {activeTab === 'flow' && (
                      <motion.svg
                        key="flow"
                        viewBox="0 0 100 40"
                        className="absolute inset-0 w-full h-full text-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.path
                          d="M0,35 Q15,10 30,22 T60,5 T80,18 T100,8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                        <path d="M0,35 Q15,10 30,22 T60,5 T80,18 T100,8 L100,40 L0,40 Z" fill="url(#blue-gradient)" opacity="0.08" />
                        <defs>
                          <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    )}

                    {activeTab === 'beds' && (
                      <motion.svg
                        key="beds"
                        viewBox="0 0 100 40"
                        className="absolute inset-0 w-full h-full text-accent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.path
                          d="M0,28 C10,28 15,35 25,32 C35,28 40,15 50,18 C60,20 70,5 80,10 C90,15 95,2 100,5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                        <path d="M0,28 C10,28 15,35 25,32 C35,28 40,15 50,18 C60,20 70,5 80,10 C90,15 95,2 100,5 L100,40 L0,40 Z" fill="url(#green-gradient)" opacity="0.08" />
                        <defs>
                          <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    )}

                    {activeTab === 'stock' && (
                      <motion.svg
                        key="stock"
                        viewBox="0 0 100 40"
                        className="absolute inset-0 w-full h-full text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.path
                          d="M0,8 Q20,38 40,30 T70,12 T100,32"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                        <path d="M0,8 Q20,38 40,30 T70,12 T100,32 L100,40 L0,40 Z" fill="url(#purple-gradient)" opacity="0.08" />
                        <defs>
                          <linearGradient id="purple-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Lower info */}
              <div className="flex justify-between items-center text-[10px] font-semibold text-txt-muted mt-3">
                <span>08:00 AM</span>
                <span>12:00 PM</span>
                <span>04:00 PM</span>
                <span>08:00 PM</span>
              </div>
            </div>

            {/* Right Column: Real-time Live Ticker */}
            <div className="lg:col-span-3 flex flex-col border-l border-slate-100 lg:pl-8">
              <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider mb-3 block">Neural Alerts</span>
              
              <div className="flex-1 flex flex-col gap-3.5 justify-start">
                <div className="flex gap-2.5 items-start">
                  <div className="p-1 rounded-sm bg-red-500/10 text-red-500 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-txt-main leading-tight block">Stock Shortage Risk</span>
                    <span className="text-[9px] text-txt-muted block mt-0.5">Paracetamol at PHC 4 is at 12% capacity. Refill trigger active.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 rounded-sm bg-accent/10 text-accent mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-txt-main leading-tight block">Triage Peak Resolved</span>
                    <span className="text-[9px] text-txt-muted block mt-0.5">CHC East outpatient queue reduced by 22% in the last 40 mins.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 rounded-sm bg-primary/10 text-primary mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-txt-main leading-tight block">Refill Route Planned</span>
                    <span className="text-[9px] text-txt-muted block mt-0.5">Blockchain sealed dispatch ID #428F initiated for vaccine stock.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
