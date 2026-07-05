'use client';

import React from 'react';
import { Shield, Sparkles, Activity, Plus } from 'lucide-react';

const partners = [
  { name: 'National Health Authority', icon: Shield },
  { name: 'Ministry of Health', icon: Plus },
  { name: 'WHO Regional Labs', icon: Activity },
  { name: 'UNICEF Health Initiative', icon: Sparkles },
  { name: 'AIIMS Research', icon: Shield },
  { name: 'Max Healthcare', icon: Activity },
  { name: 'Apollo Health Group', icon: Plus },
  { name: 'Red Cross Services', icon: Sparkles },
];

export default function TrustedBy() {
  return (
    <section className="py-12 bg-white/30 border-y border-slate-100 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-6 text-center">
        <h2 className="text-[10px] md:text-xs font-bold text-txt-muted tracking-widest uppercase">
          Trusted by pioneering health departments & medical systems
        </h2>
      </div>

      {/* Infinite scrolling marquee wrapper */}
      <div className="relative flex overflow-x-hidden w-full">
        {/* Shadow overlays for smooth fade effect at edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        {/* First track */}
        <div className="flex gap-16 py-3 items-center whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {partners.map((partner, index) => (
            <div 
              key={`p1-${index}`} 
              className="flex items-center gap-2.5 text-txt-muted hover:text-primary transition-colors duration-300 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <partner.icon className="w-4 h-4 text-txt-muted group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-bold tracking-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* Second identical track for infinite looping */}
        <div className="flex gap-16 py-3 items-center whitespace-nowrap animate-[marquee_25s_linear_infinite]" aria-hidden="true">
          {partners.map((partner, index) => (
            <div 
              key={`p2-${index}`} 
              className="flex items-center gap-2.5 text-txt-muted hover:text-primary transition-colors duration-300 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <partner.icon className="w-4 h-4 text-txt-muted group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-bold tracking-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}
