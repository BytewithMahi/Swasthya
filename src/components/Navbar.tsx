'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Menu, X, Download } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Solution', href: '#solution' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Team', href: '#team' },
  { label: 'Progress', href: '#progress' },
  { label: 'Waitlist', href: '#waitlist' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount

    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const id = item.href.substring(1);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          isScrolled 
            ? 'py-3.5 glass-nav border-b border-primary/10 shadow-sm' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo with heartbeat rotation micro-interaction */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-transform duration-500 group-hover:rotate-[360deg] clay-card-primary p-0">
              <HeartPulse className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-txt-main to-primary bg-clip-text text-transparent">
              Swasthya
            </span>
          </a>

          {/* Navigation Links - Frosted glass bar on scroll */}
          <nav className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded-full relative bg-white/40 border border-white/60 shadow-xs">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer z-10 ${
                    isActive ? 'text-white' : 'text-txt-main hover:text-primary'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full z-[-1] clay-card-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => scrollToSection('#waitlist')}
              className="px-5 py-2.5 text-sm rounded-full clay-btn-primary hover:scale-102 active:scale-98 cursor-pointer"
            >
              Join Waitlist
            </button>
            <button 
              onClick={() => scrollToSection('#waitlist')}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm rounded-full clay-btn-secondary hover:scale-102 active:scale-98 border border-slate-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-primary" />
              Install App
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-txt-main hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg-base/95 backdrop-blur-xl lg:hidden flex flex-col pt-24 pb-10 px-8 justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className={`text-left text-2xl font-bold transition-all ${
                      isActive ? 'text-primary pl-4 border-l-4 border-primary' : 'text-txt-main'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <motion.div 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                onClick={() => scrollToSection('#waitlist')}
                className="w-full py-4 rounded-2xl text-center font-bold text-lg clay-btn-primary"
              >
                Join Waitlist
              </button>
              <button 
                onClick={() => scrollToSection('#waitlist')}
                className="w-full py-4 rounded-2xl text-center font-bold text-lg clay-btn-secondary flex items-center justify-center gap-2 border border-slate-200"
              >
                <Download className="w-5 h-5 text-primary" />
                Install App
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
