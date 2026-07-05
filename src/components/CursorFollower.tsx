'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'click' | 'view'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = target.closest('a, button, [role="button"], input, select, textarea');
      const isCard = target.closest('.clay-card, .interactive-card, .dashboard-interactive');
      
      if (isClickable) {
        setIsHovered(true);
        setHoverType('click');
      } else if (isCard) {
        setIsHovered(true);
        setHoverType('view');
      } else {
        setIsHovered(false);
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer follow ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/45 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovered ? (hoverType === 'click' ? 1.6 : 2.0) : 1,
          backgroundColor: isHovered && hoverType === 'click' ? 'rgba(79, 124, 255, 0.08)' : 'rgba(79, 124, 255, 0)',
          borderColor: isHovered ? (hoverType === 'click' ? '#7B61FF' : '#4F7CFF') : 'rgba(79, 124, 255, 0.45)',
        }}
      >
        {isHovered && hoverType === 'view' && (
          <span className="text-[7px] font-bold text-primary tracking-widest uppercase">Explore</span>
        )}
      </motion.div>

      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-secondary rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  );
}
