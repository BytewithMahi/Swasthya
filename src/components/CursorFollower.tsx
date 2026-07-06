'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

export default function CursorFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'click' | 'view' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Track velocity of cursor to calculate rotation and speed stretch
  const velocityX = useVelocity(cursorX);
  const velocityY = useVelocity(cursorY);

  // Calculate rotation angle based on movement direction
  const angle = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const vX = vx as number;
    const vY = vy as number;
    if (Math.abs(vX) < 10 && Math.abs(vY) < 10) return 0;
    return Math.atan2(vY, vX) * (180 / Math.PI);
  });
  const angleSpring = useSpring(angle, { damping: 40, stiffness: 300 });

  // Calculate speed to dynamically squash & stretch the capsule
  const speed = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const vX = vx as number;
    const vY = vy as number;
    return Math.sqrt(vX * vX + vY * vY);
  });
  const speedSpring = useSpring(speed, { damping: 35, stiffness: 220 });

  const scaleX = useTransform(speedSpring, [0, 2000], [1, 1.45]);
  const scaleY = useTransform(speedSpring, [0, 2000], [1, 0.70]);

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
      
      const isInputField = target.closest('input, textarea, [contenteditable="true"]');
      let isText = false;
      let isClickable = false;

      if (isInputField) {
        const type = (isInputField as HTMLInputElement).type;
        if (type === 'submit' || type === 'button' || type === 'checkbox' || type === 'radio') {
          isClickable = true;
        } else {
          isText = true;
        }
      } else {
        isClickable = !!target.closest('a, button, [role="button"], select, .cursor-pointer');
      }

      const isCard = target.closest('.clay-card, .interactive-card, .dashboard-interactive');
      
      if (isText) {
        setIsHovered(true);
        setHoverType('text');
      } else if (isClickable) {
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

  const scaleXVal = hoverType === 'default' ? scaleX : 1;
  const scaleYVal = hoverType === 'default' ? scaleY : 1;

  return (
    <>
      {/* Outer follow capsule */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-primary/45 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          rotate: hoverType === 'text' ? 90 : angleSpring,
          scaleX: scaleXVal,
          scaleY: scaleYVal,
        }}
        animate={{
          width: hoverType === 'view' ? 80 : (hoverType === 'text' ? 4 : (hoverType === 'click' ? 44 : 36)),
          height: hoverType === 'view' ? 32 : (hoverType === 'text' ? 24 : (hoverType === 'click' ? 22 : 18)),
          backgroundColor: hoverType === 'view' ? 'rgba(13, 148, 136, 0.95)' : (hoverType === 'click' ? 'rgba(123, 97, 255, 0.08)' : 'rgba(13, 148, 136, 0)'),
          borderColor: hoverType === 'view' ? '#0D9488' : (hoverType === 'click' ? '#7B61FF' : '#0D9488'),
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 250,
        }}
      >
        {isHovered && hoverType === 'view' && (
          <span className="text-[8px] font-extrabold text-white tracking-widest uppercase">Explore</span>
        )}
      </motion.div>

      {/* Inner precise dot / small capsule */}
      <motion.div
        className="fixed top-0 left-0 bg-secondary rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
          rotate: hoverType === 'text' ? 90 : angleSpring,
        }}
        animate={{
          width: hoverType === 'text' || hoverType === 'view' ? 0 : 8,
          height: hoverType === 'text' || hoverType === 'view' ? 0 : 4,
          opacity: hoverType === 'text' || hoverType === 'view' ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 250,
        }}
      />
    </>
  );
}
