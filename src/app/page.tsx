'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TechLayer from '@/components/TechLayer';
import Team from '@/components/Team';
import Progress from '@/components/Progress';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';
import LenisProvider from '@/components/LenisProvider';
import CursorFollower from '@/components/CursorFollower';
import MedicalCanvas from '@/components/MedicalCanvas';
import Preloader from '@/components/Preloader';

const sectionColors: { [key: string]: string } = {
  home: '#FAF9F6',          // Warm Alabaster Off-white
  solution: '#93C5FD',      // Vibrant digital blue
  architecture: '#C7D2FE',  // Rich indigo purple
  team: '#A7F3D0',          // Glowing emerald mint
  progress: '#FEF08A',      // Bright neon yellow progress glow
  waitlist: '#FCA5A5',      // Bright popping rose/red
};

export default function Home() {
  const [bgColor, setBgColor] = useState('#F8FAFF');
  const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (res.ok && data.success && data.settings) {
          setIsMaintenance(data.settings.maintenance_mode === 'true');
        } else {
          setIsMaintenance(false);
        }
      } catch (err) {
        setIsMaintenance(false);
      }
    }
    checkMaintenance();
  }, []);

  useEffect(() => {
    if (isMaintenance) return;
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (sectionColors[id]) {
            setBgColor(sectionColors[id]);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sectionIds = ['home', 'solution', 'architecture', 'team', 'progress', 'waitlist'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMaintenance]);

  if (isMaintenance === null) {
    return <Preloader />;
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-txt-main font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background glowing ambient elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center z-10 max-w-md clay-card p-10 border border-white bg-white/80 backdrop-blur-md shadow-2xl flex flex-col items-center">
          {/* Logo / Badge */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 animate-pulse">
            <span className="text-2xl font-black">S</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-txt-main tracking-tight uppercase mb-4 leading-tight">
            We are going through a change
          </h1>
          <p className="text-sm text-txt-muted leading-relaxed mb-6">
            Swasthya is undergoing critical intelligence node updates. We will be back online shortly to continue powering healthcare optimization.
          </p>
          <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LenisProvider>
      {/* Fullscreen medicine spinning preloader */}
      <Preloader />

      {/* Premium cursor follow effect */}
      <CursorFollower />

      {/* Persistent floating 3D/vector medical symbols & blobs */}
      <MedicalCanvas />

      {/* Sticky Header Nav */}
      <Navbar />

      {/* Landing Page Content Blocks */}
      <main 
        className="flex-1 flex flex-col relative z-10 transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: bgColor }}
      >
        
        {/* Section 1: Hero Area */}
        <Hero />

        {/* Section 2: Solution to the Problem */}
        <Features />

        {/* Section 3: Architecture of the Solution */}
        <TechLayer />

        {/* Section 4: Team */}
        <Team />

        {/* Section 5: Progress */}
        <Progress />

        {/* Section 6: Waitlist */}
        <Waitlist />

      </main>

      {/* Footer Directory */}
      <Footer />
    </LenisProvider>
  );
}
