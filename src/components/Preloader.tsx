'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingSteps = [
  'Initializing Swasthya Core...',
  'Connecting validator nodes...',
  'Ingesting clinical logs...',
  'Loading outbreak models...',
  'Securing cryptographic blocks...'
];

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Disable scrolling during load
    document.body.style.overflow = 'hidden';

    // Step text rotation timer
    const textInterval = setInterval(() => {
      setStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    // Preloader exit timer (2.4s total load duration)
    const exitTimer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = '';
    }, 2400);

    return () => {
      clearInterval(textInterval);
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-[#F8FAFF] z-[99999] flex flex-col items-center justify-center select-none"
        >
          {/* Backing Ambient Light Glow */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-primary/6 blur-[90px] pointer-events-none" />

          {/* Rotating Capsule Center Box */}
          <div className="relative w-44 h-44 flex items-center justify-center mb-8">
            
            {/* Glowing rings */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border border-primary/20"
              animate={{ scale: [0.85, 1.35, 0.85], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-32 h-32 rounded-full border border-secondary/15"
              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0.08, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
            />

            {/* Rotating Claymorphic Medicine Capsule */}
            <motion.div
              className="w-10 h-20 rounded-full border border-white/70 overflow-hidden relative"
              style={{
                background: 'linear-gradient(to bottom, #FF4A5A 50%, #FFFFFF 50%)',
                boxShadow: 'inset 2px 2px 4px rgba(255, 255, 255, 0.45), inset -3px -3px 6px rgba(0, 0, 0, 0.15), 0 15px 30px -8px rgba(255, 74, 90, 0.25)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Status Label stepper */}
          <div className="text-center h-12 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-xs md:text-sm font-bold text-txt-main tracking-wider uppercase block"
              >
                {loadingSteps[stepIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="text-[9px] text-txt-muted font-bold tracking-widest uppercase mt-2.5">
              Secure Ledger Node Active • Swasthya
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
