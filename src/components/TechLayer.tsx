'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Hospital, Database, Brain, Boxes, LayoutDashboard, Rocket, CheckCircle2, Activity, TrendingUp, AlertTriangle, Heart } from 'lucide-react';

// --- PERFORMANCE OPTIMIZED MOUSE TILT COMPONENT ---
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { damping: 25, stiffness: 180 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 25, stiffness: 180 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
}

// --- VIEWPORT INVIEW ANIMATED COUNTER ---
function AnimatedCounter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!inView) return;
    
    const numMatch = value.match(/^([\d.]+)(.*)$/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }
    
    const target = parseFloat(numMatch[1]);
    const suffix = numMatch[2];
    const isDecimal = numMatch[1].includes('.');
    
    const start = 0;
    const end = target;
    const steps = 50;
    const stepTime = (duration * 1000) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = progress * (2 - progress); // easeOutQuad
      const currentVal = start + (end - start) * easeProgress;
      
      if (isDecimal) {
        setDisplayValue(currentVal.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(currentVal).toString() + suffix);
      }
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, inView, duration]);

  return <span ref={ref} className="font-extrabold select-none">{displayValue}</span>;
}

// --- GLOWING SVG CONNECTION LINES ---
const HorizontalConnection = ({ arrowDirection = 'right', active = false }: { arrowDirection?: 'right' | 'left'; active?: boolean }) => {
  return (
    <div className="relative w-full h-8 flex items-center justify-center">
      <svg className="w-full h-2" overflow="visible" viewBox="0 0 80 8" preserveAspectRatio="none">
        <path
          d="M 0 4 L 80 4"
          stroke="rgba(13, 148, 136, 0.12)"
          strokeWidth="2"
          fill="none"
        />
        <motion.path
          d="M 0 4 L 80 4"
          stroke={active ? (arrowDirection === 'right' ? '#0D9488' : '#7B61FF') : 'rgba(13, 148, 136, 0)'}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="24 56"
          animate={active ? {
            strokeDashoffset: arrowDirection === 'right' ? [80, 0] : [0, 80]
          } : {}}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </svg>
    </div>
  );
};

const VerticalConnection = ({ active = false, height = 60 }: { active?: boolean; height?: number }) => {
  return (
    <div className="relative w-8 flex items-center justify-center mx-auto" style={{ height: `${height}px` }}>
      <svg className="h-full w-2" overflow="visible" viewBox={`0 0 8 ${height}`} preserveAspectRatio="none">
        <path
          d={`M 4 0 L 4 ${height}`}
          stroke="rgba(13, 148, 136, 0.12)"
          strokeWidth="2"
          fill="none"
        />
        <motion.path
          d={`M 4 0 L 4 ${height}`}
          stroke={active ? '#0D9488' : 'rgba(13, 148, 136, 0)'}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="16 32"
          animate={active ? {
            strokeDashoffset: [height, 0]
          } : {}}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </svg>
    </div>
  );
};

// --- CORE ARCHITECTURE SECTION ---
export default function TechLayer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Track scroll position inside this section (Desktop only)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Only map scrolling progress to active state on desktop screen sizes (where columns align)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (latest < 0.16) {
        setActiveStep(0);
      } else if (latest < 0.33) {
        setActiveStep(1);
      } else if (latest < 0.50) {
        setActiveStep(2);
      } else if (latest < 0.66) {
        setActiveStep(3);
      } else if (latest < 0.83) {
        setActiveStep(4);
      } else {
        setActiveStep(5);
      }
    }
  });

  // Intersection Observer to track scroll synchronization on mobile viewports (where cards stack vertically)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -45% 0px', // Center-focused tracking box
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (window.innerWidth < 1024) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const match = id.match(/architecture-step-(\d+)-mob/);
            if (match) {
              const stepIdx = parseInt(match[1], 10) - 1;
              setActiveStep(stepIdx);
            }
          }
        });
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe step items
    for (let i = 1; i <= 6; i++) {
      const mobileEl = document.getElementById(`architecture-step-${i}-mob`);
      if (mobileEl) observer.observe(mobileEl);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToStep = (idx: number) => {
    const isMobile = window.innerWidth < 1024;
    const targetId = isMobile 
      ? `architecture-step-${idx + 1}-mob` 
      : `architecture-step-${idx + 1}`;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const steps = [
    { label: 'Collect', name: 'Data Collection' },
    { label: 'Analyze', name: 'Processing' },
    { label: 'Predict', name: 'AI Engine' },
    { label: 'Secure', name: 'Blockchain' },
    { label: 'Visualize', name: 'Command Center' },
    { label: 'Act', name: 'Action Execution' }
  ];

  return (
    <section 
      id="architecture" 
      ref={sectionRef}
      className="py-28 relative overflow-hidden bg-[#F8FAFF] border-y border-slate-100"
    >
      {/* Background visual components */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.22] pointer-events-none" />
      
      {/* Dynamic gradient blobs */}
      <div className="absolute top-[10%] left-[10%] w-[450px] h-[450px] rounded-full bg-primary/4 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-secondary/4 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[45%] w-[350px] h-[350px] rounded-full bg-accent/3 blur-[110px] pointer-events-none" />

      {/* Floating background medical crosses */}
      <div className="absolute top-[18%] left-[6%] opacity-15 pointer-events-none animate-pulse">
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div className="absolute bottom-[28%] right-[8%] opacity-15 pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}>
        <svg className="w-6 h-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>

      {/* Floating vector particles */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-primary/20 top-[20%] left-[18%] pointer-events-none"
        animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-secondary/15 bottom-[35%] left-[12%] pointer-events-none"
        animate={{ y: [0, 40, 0], x: [0, -20, 0], opacity: [0.15, 0.5, 0.15] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.span
            className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-4 inline-block shadow-xs border border-primary/10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            System Architecture
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5.5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            AI + Blockchain Real-Time Ingestion
          </motion.h2>
          <motion.p
            className="text-lg text-txt-muted max-w-xl mx-auto font-normal"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A 6-step distributed optimization loop safeguarding data privacy while delivering predictive insights down to the municipal clinic level.
          </motion.p>
        </div>

        {/* --- GRID PIPELINE: DESKTOP ONLY S-CURVE (3 cols, 3 rows) --- */}
        <div className="hidden lg:grid grid-cols-[1fr_80px_1fr_80px_1fr] grid-rows-[auto_60px_auto] gap-y-6 items-center w-full max-w-6xl">
          
          {/* STEP 1: Data Collection */}
          <div className="col-start-1 row-start-1" id="architecture-step-1">
            <TiltCard className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[360px] ${
              activeStep === 0 ? 'border-primary/45 shadow-xl bg-white scale-[1.02]' : 'border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
                  }`}>
                    <Hospital className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-black text-txt-muted bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Step 1
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-main mb-4">Real-Time Data Collection</h3>
                <ul className="grid grid-cols-2 gap-2 text-left mb-6">
                  {['Medicine Inventory', 'Patient Registration', 'Doctor Attendance', 'Bed Availability', 'Lab Reports', 'Ambulance Status'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-txt-muted">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeStep === 0 ? 'bg-primary' : 'bg-slate-300'}`} />
                      <span className="text-txt-main/80 truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-end justify-center gap-2 h-10 w-full relative overflow-hidden bg-slate-50/50 rounded-xl border border-slate-200/50 py-1">
                <div className="absolute bottom-1 w-6 h-6 bg-primary/10 rounded flex items-center justify-center z-10">
                  <Hospital className="w-3.5 h-3.5 text-primary" />
                </div>
                {activeStep === 0 && (
                  <>
                    <motion.div className="absolute w-1.5 h-1.5 rounded-full bg-primary/60" animate={{ y: [-5, -35], x: [-15, -5], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }} />
                    <motion.div className="absolute w-1 h-1 rounded-full bg-secondary/60" animate={{ y: [-5, -30], x: [10, 2], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.3, ease: 'easeOut' }} />
                    <motion.div className="absolute w-1 h-1 rounded-full bg-accent/60" animate={{ y: [-5, -38], x: [0, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.1, delay: 0.6, ease: 'easeOut' }} />
                  </>
                )}
              </div>
            </TiltCard>
          </div>

          {/* Conn 1 -> 2 */}
          <div className="col-start-2 row-start-1">
            <HorizontalConnection arrowDirection="right" active={activeStep >= 0} />
          </div>

          {/* STEP 2: Secure Data Processing */}
          <div className="col-start-3 row-start-1" id="architecture-step-2">
            <TiltCard className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[360px] ${
              activeStep === 1 ? 'border-primary/45 shadow-xl bg-white scale-[1.02]' : 'border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
                  }`}>
                    <Database className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-black text-txt-muted bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Step 2
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-main mb-4">Secure Data Processing</h3>
                <ul className="flex flex-col gap-2.5 text-left mb-6">
                  {['Validation & Compliance', 'Data Cleaning & Structuring', 'Military-Grade Encryption', 'HL7 Standardization', 'High-Speed API Gateway'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-txt-muted">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeStep === 1 ? 'bg-primary' : 'bg-slate-300'}`} />
                      <span className="text-txt-main/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center gap-2 h-10 w-full bg-slate-50/50 rounded-xl border border-slate-200/50 py-1 overflow-hidden relative">
                <Database className="w-4 h-4 text-primary relative z-10" />
                <div className="w-16 h-0.5 bg-slate-200/60 rounded overflow-hidden relative">
                  {activeStep === 1 && (
                    <motion.div 
                      className="absolute inset-0 bg-primary/80 rounded w-6 h-full"
                      animate={{ x: [-20, 64] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                    />
                  )}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Conn 2 -> 3 */}
          <div className="col-start-4 row-start-1">
            <HorizontalConnection arrowDirection="right" active={activeStep >= 1} />
          </div>

          {/* STEP 3: AI Intelligence Engine */}
          <div className="col-start-5 row-start-1" id="architecture-step-3">
            <TiltCard className={`relative p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[360px] overflow-hidden ${
              activeStep === 2 ? 'border-primary/45 shadow-xl bg-white scale-[1.02]' : 'border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-sm'
            }`}>
              {/* Pulsing AI concentric rings background */}
              <div className="absolute -right-16 -top-16 w-48 h-48 opacity-15 pointer-events-none z-0">
                <div className="absolute inset-0 border-2 border-dashed border-primary rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 border border-dashed border-secondary rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-8 border border-accent/40 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === 2 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
                  }`}>
                    <Brain className="w-5.5 h-5.5 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-black text-txt-muted bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Step 3
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-main mb-4 relative z-10">AI Intelligence Engine</h3>
                <ul className="flex flex-col gap-2.5 text-left mb-6 relative z-10">
                  {['Patient Footfall Forecasting', 'Bed Occupancy Optimization', 'Medicine Demand Forecasting', 'Epidemiological Outbreak Alerts'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-txt-muted">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="font-semibold text-txt-main/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Neural network bottom decoration */}
              <div className="h-10 w-full relative opacity-20 pointer-events-none">
                <svg className="w-full h-full" overflow="visible">
                  <circle cx="20%" cy="50%" r="3" fill="#0D9488" />
                  <circle cx="45%" cy="20%" r="3" fill="#0D9488" />
                  <circle cx="70%" cy="80%" r="3" fill="#7B61FF" />
                  <circle cx="90%" cy="40%" r="4" fill="#7B61FF" />
                  <line x1="20%" y1="50%" x2="45%" y2="20%" stroke="#0F172A" strokeWidth="1" />
                  <line x1="45%" y1="20%" x2="90%" y2="40%" stroke="#0F172A" strokeWidth="1" />
                  <line x1="20%" y1="50%" x2="70%" y2="80%" stroke="#0F172A" strokeWidth="1" />
                  <line x1="70%" y1="80%" x2="90%" y2="40%" stroke="#0F172A" strokeWidth="1" />
                </svg>
              </div>
            </TiltCard>
          </div>

          {/* Conn 3 -> 4 (Vertical Connect Down) */}
          <div className="col-start-5 row-start-2 justify-self-center">
            <VerticalConnection active={activeStep >= 2} height={60} />
          </div>

          {/* STEP 6: Action Execution */}
          <div className="col-start-1 row-start-3" id="architecture-step-6">
            <TiltCard className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[360px] ${
              activeStep === 5 ? 'border-primary/45 shadow-xl bg-white scale-[1.02]' : 'border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === 5 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
                  }`}>
                    <Rocket className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-black text-txt-muted bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Step 6
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-main mb-4">Action Execution</h3>
                <ul className="flex flex-col gap-2.5 text-left mb-6">
                  {['Automated Resource Allocation', 'Interactive Staff Re-allocation', 'Emergency Alert Routing', 'Blockchain Audit Records'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-txt-muted">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeStep === 5 ? 'bg-primary' : 'bg-slate-300'}`} />
                      <span className="text-txt-main/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center gap-3 h-10 w-full bg-slate-50/50 rounded-xl border border-slate-200/50 relative overflow-hidden">
                <motion.div animate={activeStep === 5 ? { y: [0, -3, 0] } : {}} transition={{ repeat: Infinity, duration: 1.8 }}>
                  <Rocket className="w-4 h-4 text-primary" />
                </motion.div>
                <div className="flex gap-1.5">
                  {activeStep === 5 && (
                    <>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} className="w-4 h-4 rounded-full bg-accent/25 flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-accent" /></motion.div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5, delay: 0.3 }} className="w-4 h-4 rounded-full bg-accent/25 flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-accent" /></motion.div>
                    </>
                  )}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Conn 5 -> 6 (Pointing Left) */}
          <div className="col-start-2 row-start-3">
            <HorizontalConnection arrowDirection="left" active={activeStep >= 4} />
          </div>

          {/* STEP 5: Healthcare Command Center */}
          <div className="col-start-3 row-start-3" id="architecture-step-5">
            <TiltCard className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[360px] overflow-hidden ${
              activeStep === 4 ? 'border-primary/45 shadow-xl bg-white scale-[1.02]' : 'border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === 4 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
                  }`}>
                    <LayoutDashboard className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-black text-txt-muted bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Step 5
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-main mb-3">Healthcare Command Center</h3>
              </div>

              {/* Miniature Dashboard Preview */}
              <div className="rounded-2xl border border-slate-200/50 bg-slate-50/50 p-3 shadow-inner pointer-events-none relative mb-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[7px] font-bold text-accent uppercase tracking-widest">Live Map</span>
                  </div>
                  <span className="text-[6.5px] font-extrabold text-white bg-red-500 px-1 py-0.5 rounded-xs">CRITICAL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Map block */}
                  <div className="rounded-xl border border-slate-200/50 bg-white p-2 flex flex-col justify-between h-14 relative overflow-hidden">
                    <span className="text-[6px] font-bold text-txt-muted uppercase">District Grid</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <svg className="w-full h-full p-1" viewBox="0 0 100 50">
                        <circle cx="20" cy="15" r="3" fill="#22C55E" />
                        <circle cx="50" cy="30" r="3" fill="#EF4444" className="animate-pulse" />
                        <circle cx="80" cy="20" r="3" fill="#22C55E" />
                      </svg>
                    </div>
                  </div>
                  {/* Chart block */}
                  <div className="rounded-xl border border-slate-200/50 bg-white p-2 flex flex-col justify-between h-14">
                    <span className="text-[6px] font-bold text-txt-muted uppercase">Analytics</span>
                    <svg className="w-full h-5 text-primary" viewBox="0 0 50 20" overflow="visible">
                      <path d="M0,18 Q10,5 20,12 T40,2 T50,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                {/* Alert strip */}
                <div className="rounded-xl border border-slate-200/40 bg-white/70 p-1.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-1 truncate max-w-[110px]">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-500 shrink-0" />
                    <span className="text-[6.5px] font-bold text-txt-main truncate">Refill Dispatch Issued</span>
                  </div>
                  <span className="text-[6.5px] text-txt-muted font-bold">12m</span>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Conn 4 -> 5 (Pointing Left) */}
          <div className="col-start-4 row-start-3">
            <HorizontalConnection arrowDirection="left" active={activeStep >= 3} />
          </div>

          {/* STEP 4: Blockchain Trust Layer */}
          <div className="col-start-5 row-start-3" id="architecture-step-4">
            <TiltCard className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-[360px] ${
              activeStep === 3 ? 'border-primary/45 shadow-xl bg-white scale-[1.02]' : 'border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    activeStep === 3 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
                  }`}>
                    <Boxes className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-black text-txt-muted bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Step 4
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-main mb-4">Blockchain Trust Layer</h3>
                <ul className="flex flex-col gap-2.5 text-left mb-6">
                  {['Immutable Audit Logs', 'Tamper Proof Records', 'Smart Resource Transfers', 'Secure Distributed Ledger'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-txt-muted">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeStep === 3 ? 'bg-primary' : 'bg-slate-300'}`} />
                      <span className="text-txt-main/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 justify-center py-2 h-10 bg-slate-50/50 rounded-xl border border-slate-200/50 overflow-hidden">
                <motion.div className="w-6 h-6 rounded bg-primary/15 border border-primary/30 flex items-center justify-center" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}><Boxes className="w-3.5 h-3.5 text-primary" /></motion.div>
                <motion.div className="w-3 h-[2px] bg-slate-300" animate={{ scaleX: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} />
                <motion.div className="w-6 h-6 rounded bg-secondary/15 border border-secondary/30 flex items-center justify-center" animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.4 }}><Boxes className="w-3.5 h-3.5 text-secondary" /></motion.div>
              </div>
            </TiltCard>
          </div>

        </div>

        {/* --- VERTICAL PIPELINE: MOBILE/TABLET ONLY (< 1024px) --- */}
        <div className="flex lg:hidden flex-col gap-0 items-center w-full max-w-md">
          
          {/* STEP 1: Data Collection */}
          <div className="w-full" id="architecture-step-1-mob">
            <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between ${
              activeStep === 0 ? 'border-primary/45 shadow-lg bg-white' : 'border-slate-200/60 shadow-sm bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Hospital className="w-5 h-5" /></div>
                <span className="text-[10px] font-black text-txt-muted bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 1</span>
              </div>
              <h3 className="text-base font-extrabold text-txt-main mb-3">Real-Time Data Collection</h3>
              <ul className="grid grid-cols-2 gap-2 text-left">
                {['Medicine Inventory', 'Patient Registration', 'Doctor Attendance', 'Bed Availability', 'Lab Reports', 'Ambulance Status'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-xs text-txt-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VerticalConnection active={activeStep >= 0} height={48} />

          {/* STEP 2: Processing */}
          <div className="w-full" id="architecture-step-2-mob">
            <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between ${
              activeStep === 1 ? 'border-primary/45 shadow-lg bg-white' : 'border-slate-200/60 shadow-sm bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Database className="w-5 h-5" /></div>
                <span className="text-[10px] font-black text-txt-muted bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 2</span>
              </div>
              <h3 className="text-base font-extrabold text-txt-main mb-3">Secure Data Processing</h3>
              <ul className="flex flex-col gap-2 text-left">
                {['Validation & Compliance', 'Data Cleaning & Structuring', 'Military-Grade Encryption', 'HL7 Standardization', 'High-Speed API Gateway'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-txt-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VerticalConnection active={activeStep >= 1} height={48} />

          {/* STEP 3: AI Engine */}
          <div className="w-full" id="architecture-step-3-mob">
            <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between ${
              activeStep === 2 ? 'border-primary/45 shadow-lg bg-white' : 'border-slate-200/60 shadow-sm bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Brain className="w-5 h-5 animate-pulse" /></div>
                <span className="text-[10px] font-black text-txt-muted bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 3</span>
              </div>
              <h3 className="text-base font-extrabold text-txt-main mb-3">AI Intelligence Engine</h3>
              <ul className="flex flex-col gap-2 text-left">
                {['Patient Footfall Forecasting', 'Bed Occupancy Optimization', 'Medicine Demand Forecasting', 'Epidemiological Outbreaks'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-txt-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VerticalConnection active={activeStep >= 2} height={48} />

          {/* STEP 4: Blockchain Layer */}
          <div className="w-full" id="architecture-step-4-mob">
            <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between ${
              activeStep === 3 ? 'border-primary/45 shadow-lg bg-white' : 'border-slate-200/60 shadow-sm bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Boxes className="w-5 h-5" /></div>
                <span className="text-[10px] font-black text-txt-muted bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 4</span>
              </div>
              <h3 className="text-base font-extrabold text-txt-main mb-3">Blockchain Trust Layer</h3>
              <ul className="flex flex-col gap-2 text-left">
                {['Immutable Audit Logs', 'Tamper Proof Records', 'Smart Resource Transfers', 'Secure Distributed Ledger'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-txt-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VerticalConnection active={activeStep >= 3} height={48} />

          {/* STEP 5: Command Center */}
          <div className="w-full" id="architecture-step-5-mob">
            <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between ${
              activeStep === 4 ? 'border-primary/45 shadow-lg bg-white' : 'border-slate-200/60 shadow-sm bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><LayoutDashboard className="w-5 h-5" /></div>
                <span className="text-[10px] font-black text-txt-muted bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 5</span>
              </div>
              <h3 className="text-base font-extrabold text-txt-main mb-3">Healthcare Command Center</h3>
              <ul className="flex flex-col gap-2 text-left">
                {['District Map Tracking', 'Live Smart Alerts', 'PHC Capacity Levels', 'Resource Flow Analytics'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-txt-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VerticalConnection active={activeStep >= 4} height={48} />

          {/* STEP 6: Action Execution */}
          <div className="w-full" id="architecture-step-6-mob">
            <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between ${
              activeStep === 5 ? 'border-primary/45 shadow-lg bg-white' : 'border-slate-200/60 shadow-sm bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Rocket className="w-5 h-5" /></div>
                <span className="text-[10px] font-black text-txt-muted bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 6</span>
              </div>
              <h3 className="text-base font-extrabold text-txt-main mb-3">Action Execution</h3>
              <ul className="flex flex-col gap-2 text-left">
                {['Automated Resource Allocation', 'Interactive Staff Re-allocation', 'Emergency Alert Routing', 'Blockchain Audit Records'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-txt-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* --- STICKY FLOATING TIMELINE BAR (Collect -> Analyze -> Predict -> Secure -> Visualize -> Act) --- */}
        <div className="sticky bottom-8 z-30 mt-20 flex flex-col items-center justify-center w-full max-w-xl px-4 pointer-events-none">
          <span className="text-[8px] font-extrabold text-txt-muted/80 bg-slate-200/40 border border-slate-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-widest mb-2 shadow-2xs select-none">
            Click Step to Jump
          </span>
          <div className="pointer-events-auto flex items-center justify-between w-full px-2.5 py-2 rounded-full glass-panel border border-slate-200/65 shadow-xl bg-white/80 backdrop-blur-md">
            {steps.map((step, idx) => {
              const active = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToStep(idx)}
                  className={`relative flex-1 py-2 text-xs md:text-sm font-bold rounded-full transition-all cursor-pointer text-center outline-none focus:outline-none ${
                    active ? 'text-white' : 'text-txt-muted hover:text-txt-main'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="archActiveTab"
                      className="absolute inset-0 bg-primary rounded-full z-[-1] clay-card-primary"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    />
                  )}
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- BOTTOM METRICS: REAL-TIME STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-32 max-w-5xl w-full">
          {[
            { value: '38+', label: 'Healthcare Centres' },
            { value: '12K+', label: 'Patients Today' },
            { value: '99.9%', label: 'Blockchain Integrity' },
            { value: '24/7', label: 'AI Monitoring' }
          ].map((metric, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-slate-200/60 bg-white/85 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-center select-none"
            >
              <span className="text-3.5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                <AnimatedCounter value={metric.value} />
              </span>
              <span className="text-[10px] font-extrabold text-txt-muted block uppercase tracking-wider mt-2">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
