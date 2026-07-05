'use client';

import React, { useEffect, useState } from 'react';

interface FloatingItem {
  id: number;
  type: 'cross' | 'pill' | 'circle' | 'heartbeat' | 'shield';
  color: string;
  size: number;
  x: number; // percentage
  y: number; // percentage
  speed: number;
  direction: 'normal' | 'reverse' | 'slow';
}

export default function MedicalCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to window center, range -1 to 1
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Set of fixed coordinates so they don't shift during SSR hydration
  const items: FloatingItem[] = [
    { id: 1, type: 'cross', color: '#4F7CFF', size: 36, x: 12, y: 15, speed: 15, direction: 'normal' },
    { id: 2, type: 'pill', color: '#7B61FF', size: 40, x: 82, y: 22, speed: 20, direction: 'reverse' },
    { id: 3, type: 'heartbeat', color: '#22C55E', size: 48, x: 8, y: 55, speed: 25, direction: 'slow' },
    { id: 4, type: 'circle', color: '#67E8F9', size: 28, x: 88, y: 68, speed: 12, direction: 'normal' },
    { id: 5, type: 'shield', color: '#4F7CFF', size: 44, x: 22, y: 82, speed: 18, direction: 'reverse' },
    { id: 6, type: 'cross', color: '#22C55E', size: 24, x: 74, y: 88, speed: 15, direction: 'slow' },
    { id: 7, type: 'pill', color: '#FF708B', size: 32, x: 48, y: 8, speed: 22, direction: 'normal' },
  ];

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Background Blobs */}
      <div 
        className="absolute w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-primary/8 to-secondary/8 blur-[100px] -top-[15%] -left-[10%] animate-float-slow"
        style={{
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
        }}
      />
      <div 
        className="absolute w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-cyan-soft/6 to-primary/6 blur-[120px] top-[40%] -right-[10%] animate-float"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
        }}
      />
      <div 
        className="absolute w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-secondary/5 to-accent/5 blur-[90px] -bottom-[10%] left-[20%] animate-float-reverse"
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
        }}
      />

      {/* Floating Medical Elements */}
      {items.map((item) => {
        // Calculate dynamic translation based on mouse movement and speed
        const parallaxX = mousePos.x * item.speed;
        const parallaxY = mousePos.y * item.speed;

        let animationClass = 'animate-float';
        if (item.direction === 'reverse') animationClass = 'animate-float-reverse';
        if (item.direction === 'slow') animationClass = 'animate-float-slow';

        return (
          <div
            key={item.id}
            className={`absolute transition-transform duration-300 ease-out ${animationClass}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            }}
          >
            {item.type === 'cross' && (
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 8px 16px ${item.color}33)`
                }}
              >
                <path 
                  d="M12 4v16M4 12h16" 
                  stroke={item.color} 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
              </svg>
            )}

            {item.type === 'pill' && (
              <div 
                className="w-full h-full rounded-full border border-white/60 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${item.color} 45%, #FFFFFF 55%)`,
                  boxShadow: `
                    inset 1px 1px 3px rgba(255, 255, 255, 0.6),
                    inset -2px -2px 5px rgba(0, 0, 0, 0.12),
                    0 10px 20px -5px ${item.color}44
                  `,
                  transform: 'rotate(45deg)'
                }}
              />
            )}

            {item.type === 'circle' && (
              <div 
                className="w-full h-full rounded-full border border-white/80"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${item.color} 70%)`,
                  boxShadow: `
                    inset 1px 1px 2px rgba(255, 255, 255, 0.8),
                    inset -3px -3px 6px rgba(0, 0, 0, 0.15),
                    0 8px 16px -4px ${item.color}55
                  `
                }}
              />
            )}

            {item.type === 'heartbeat' && (
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full drop-shadow-md"
                style={{
                  filter: `drop-shadow(0 6px 12px ${item.color}25)`
                }}
              >
                <rect 
                  width="24" 
                  height="24" 
                  rx="6" 
                  fill="rgba(255, 255, 255, 0.8)" 
                  className="backdrop-blur-sm"
                  stroke="rgba(255, 255, 255, 0.8)"
                />
                <path 
                  d="M3 12h4l2-6 3 12 2-9 2 3h4" 
                  stroke={item.color} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            )}

            {item.type === 'shield' && (
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full drop-shadow-md"
                style={{
                  filter: `drop-shadow(0 8px 16px ${item.color}25)`
                }}
              >
                <path 
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                  fill="rgba(255, 255, 255, 0.85)" 
                  stroke={item.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path 
                  d="M9 11l2 2 4-4" 
                  stroke={item.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
