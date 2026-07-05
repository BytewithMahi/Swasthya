'use client';

import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Integrating Swasthya at our CHC has completely eliminated vaccine dispatch bottlenecks. The AI forecasting models correctly projected our influenza surge with near 98% accuracy.",
    name: "Dr. Sandeep Deshmukh",
    role: "Medical Superintendent",
    org: "District General Hospital",
    avatar: "SD"
  },
  {
    quote: "The Blockchain EHR audit ledger gives our administration complete confidence during cross-district transfers. Compliance reports that used to take days are generated instantly.",
    name: "Rajeshwari Iyer",
    role: "Health Services Administrator",
    org: "State Health Authority",
    avatar: "RI"
  },
  {
    quote: "Having real-time patient queue metrics and bed tracking allows our staff to coordinate emergencies flawlessly. We saved an average of 12 administrative hours per clinic weekly.",
    name: "Dr. Amit Verma",
    role: "Chief Medical Officer",
    org: "Municipal Care Network",
    avatar: "AV"
  },
  {
    quote: "The offline-first sync engine is a lifesaver. Our sub-center teams in deep rural forests sync records securely using low-bandwidth satellite links without losing a single patient file.",
    name: "Grace Mathews",
    role: "Community Health Director",
    org: "Rural Wellness Program",
    avatar: "GM"
  }
];

export default function Testimonials() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-dot-pattern">
      <div className="absolute top-[30%] left-[10%] w-[450px] h-[450px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs tracking-wider uppercase mb-4 inline-block">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6">
            Trusted by the Frontlines of Healthcare
          </h2>
          <p className="text-lg text-txt-muted max-w-xl mx-auto font-normal">
            Hear from medical officers, hospital managers, and community directors who use Swasthya daily to coordinate care.
          </p>
        </div>
      </div>

      {/* Infinite scrolling marquee of cards */}
      <div className="relative flex overflow-x-hidden w-full select-none">
        {/* Soft edge blur shadows */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        {/* First track */}
        <div className="flex gap-8 py-4 items-stretch whitespace-nowrap animate-[scrollTestimonials_30s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
          {testimonials.map((t, idx) => (
            <div
              key={`t1-${idx}`}
              className="inline-block w-[380px] p-6 rounded-[28px] glass-panel border border-white/60 shadow-lg flex flex-col justify-between shrink-0 hover:scale-102 hover:border-primary/20 transition-all duration-300 whitespace-normal"
            >
              <div>
                {/* Five star rating */}
                <div className="flex gap-1 mb-4 text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm md:text-base text-txt-main/80 font-normal leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author row */}
              <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-txt-main leading-tight">{t.name}</h4>
                  <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider mt-0.5">
                    {t.role} • {t.org}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second track for seamless looping */}
        <div className="flex gap-8 py-4 items-stretch whitespace-nowrap animate-[scrollTestimonials_30s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer" aria-hidden="true">
          {testimonials.map((t, idx) => (
            <div
              key={`t2-${idx}`}
              className="inline-block w-[380px] p-6 rounded-[28px] glass-panel border border-white/60 shadow-lg flex flex-col justify-between shrink-0 hover:scale-102 hover:border-primary/20 transition-all duration-300 whitespace-normal"
            >
              <div>
                {/* Five star rating */}
                <div className="flex gap-1 mb-4 text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm md:text-base text-txt-main/80 font-normal leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author row */}
              <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-txt-main leading-tight">{t.name}</h4>
                  <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider mt-0.5">
                    {t.role} • {t.org}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scrollTestimonials {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
