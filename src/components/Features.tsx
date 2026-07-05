'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Database, GitMerge, RefreshCw, BarChart3, WifiOff, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Disease Predictor',
    desc: 'Forecast local outbreak clusters (Dengue, Influenza, Malaria) up to 21 days in advance using localized clinical intake data.',
    color: 'from-primary/10 to-primary/5',
    iconColor: 'text-primary',
    tag: 'Predictive AI'
  },
  {
    icon: Database,
    title: 'Blockchain EHR Security',
    desc: 'Establish a cryptographic, immutable record trail for auditing patient transfers and vaccine allocations without compromising HIPAA privacy.',
    color: 'from-secondary/10 to-secondary/5',
    iconColor: 'text-secondary',
    tag: 'Security'
  },
  {
    icon: GitMerge,
    title: 'Smart Resource Allocator',
    desc: 'Leverage predictive modeling to optimize bed inventory, emergency staff schedules, and vital pharmaceutical stocks across clinics.',
    color: 'from-accent/10 to-accent/5',
    iconColor: 'text-accent',
    tag: 'Optimization'
  },
  {
    icon: RefreshCw,
    title: 'Real-Time Patient Flow',
    desc: 'Minimize queue congestion at remote primary clinics with active triage workflows and live tracking of outpatient wait-times.',
    color: 'from-cyan-soft/20 to-cyan-soft/5',
    iconColor: 'text-cyan-soft',
    tag: 'Flow Control'
  },
  {
    icon: BarChart3,
    title: 'District Command Center',
    desc: 'Consolidate multiple CHC & PHC metrics into a single real-time dashboard map view for medical officers and administrators.',
    color: 'from-primary/10 to-secondary/5',
    iconColor: 'text-primary',
    tag: 'Monitoring'
  },
  {
    icon: WifiOff,
    title: 'Offline-First Sync Mode',
    desc: 'Enable field staff to record patient information and local inventory updates offline, automatically merging changes when signal returns.',
    color: 'from-accent/10 to-cyan-soft/10',
    iconColor: 'text-accent',
    tag: 'Resilience'
  }
];

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-dot-pattern">
      {/* Soft Background Blur Blobs */}
      <div className="absolute right-[5%] top-[10%] w-[350px] h-[350px] rounded-full bg-secondary/3 blur-[90px] pointer-events-none" />
      <div className="absolute left-[5%] bottom-[10%] w-[350px] h-[350px] rounded-full bg-accent/3 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-4 inline-block">
            Comprehensive Suite
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6">
            Empowering Health Systems with Artificial Intelligence
          </h2>
          <p className="text-lg text-txt-muted font-normal leading-relaxed">
            Designed specifically for administrative networks, hospitals, Community Health Centers (CHCs) and primary health systems.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="clay-card p-8 group hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-xs`}>
                    <feat.icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                    {feat.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-txt-main mb-3 group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-txt-muted font-normal leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              {/* Interaction indicator */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-6">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
