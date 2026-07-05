'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BrainCircuit, Activity, Lock, Database, RefreshCw, KeyRound, Cpu } from 'lucide-react';

export default function TechLayer() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const aiSteps = [
    { id: 1, title: 'Data Anonymization', desc: 'Patient identifiers are instantly scrubbed at the CHC gateway using differential privacy hash vectors.', icon: Lock },
    { id: 2, title: 'Vector Ingestion', desc: 'Local clinical intake counts are mapped into localized geographic threat clusters.', icon: GitBranchIcon },
    { id: 3, title: 'Forecast Modeling', desc: 'Predictive neural networks project localized disease outbreaks up to 21 days ahead.', icon: Cpu },
  ];

  const blockchainSteps = [
    { id: 1, title: 'Consensus Check', desc: 'Validation nodes verify EHR consistency across municipal healthcare boundaries.', icon: RefreshCw },
    { id: 2, title: 'Block Sealing', desc: 'A secure block header containing allocation receipts is generated and validated.', icon: KeyRound },
    { id: 3, title: 'Ledger Broadcast', desc: 'The verified transaction is permanently distributed to the auditing registry.', icon: Database },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-dot-pattern">
      {/* Glow Blobs */}
      <div className="absolute top-[30%] left-[10%] w-[380px] h-[380px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[380px] h-[380px] rounded-full bg-secondary/3 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="px-3.5 py-1.5 rounded-full bg-accent/15 text-accent font-bold text-xs tracking-wider uppercase mb-4 inline-block">
            Architectural Core
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6">
            Dual Engine Integrity
          </h2>
          <p className="text-lg text-txt-muted max-w-2xl mx-auto font-normal">
            Swasthya combines edge machine learning models with distributed ledger networks to guarantee both foresight and privacy.
          </p>
        </div>

        {/* Dynamic Side-by-Side Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT PANEL: AI Edge Engine */}
          <div className="lg:col-span-6 clay-card p-8 md:p-10 flex flex-col justify-between border border-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              {/* Badge */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                  <BrainCircuit className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-txt-main">Predictive AI Ingestion</h3>
                  <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider">Edge Threat Forecasting</span>
                </div>
              </div>

              {/* Diagram Flow Map */}
              <div className="relative border-l-2 border-primary/20 pl-6 py-2 flex flex-col gap-8 mb-8 select-none">
                
                {/* SVG path runner animation */}
                <div className="absolute left-[-2px] top-0 bottom-0 w-0.5 overflow-hidden">
                  <motion.div 
                    className="w-full h-24 bg-primary"
                    animate={{ y: ['-100%', '300%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                {aiSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = activeStep === idx;
                  return (
                    <div 
                      key={step.id} 
                      className="relative cursor-pointer group"
                      onMouseEnter={() => setActiveStep(idx)}
                      onMouseLeave={() => setActiveStep(null)}
                    >
                      {/* Circle indicator */}
                      <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        isActive ? 'bg-primary border-primary scale-125 shadow-[0_0_8px_#4F7CFF]' : 'bg-white border-primary/45'
                      }`} />

                      <h4 className="text-sm font-extrabold text-txt-main group-hover:text-primary transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs md:text-sm text-txt-muted font-normal mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Activity className="w-4 h-4 animate-pulse" /> Edge processing node running 250+ GFLOPS
            </div>
          </div>

          {/* RIGHT PANEL: Blockchain Ledger */}
          <div className="lg:col-span-6 clay-card p-8 md:p-10 flex flex-col justify-between border border-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              {/* Badge */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-xs">
                  <Shield className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-txt-main">Distributed EHR Integrity</h3>
                  <span className="text-[10px] text-txt-muted font-bold block uppercase tracking-wider">Cryptographic Ledger Sync</span>
                </div>
              </div>

              {/* Diagram Flow Map */}
              <div className="relative border-l-2 border-secondary/20 pl-6 py-2 flex flex-col gap-8 mb-8 select-none">
                
                {/* SVG path runner animation */}
                <div className="absolute left-[-2px] top-0 bottom-0 w-0.5 overflow-hidden">
                  <motion.div 
                    className="w-full h-24 bg-secondary"
                    animate={{ y: ['-100%', '300%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                  />
                </div>

                {blockchainSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = activeStep === (idx + 3);
                  return (
                    <div 
                      key={step.id} 
                      className="relative cursor-pointer group"
                      onMouseEnter={() => setActiveStep(idx + 3)}
                      onMouseLeave={() => setActiveStep(null)}
                    >
                      {/* Circle indicator */}
                      <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        isActive ? 'bg-secondary border-secondary scale-125 shadow-[0_0_8px_#7B61FF]' : 'bg-white border-secondary/45'
                      }`} />

                      <h4 className="text-sm font-extrabold text-txt-main group-hover:text-secondary transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs md:text-sm text-txt-muted font-normal mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
              <Lock className="w-4 h-4" /> Consensus status: SECURED (24 active validators)
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Simple fallback icon mapping
function GitBranchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}
