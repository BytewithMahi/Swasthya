'use client';

import React from 'react';
import { HeartPulse, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const footerLinks = [
  {
    title: 'Platform',
    items: [
      { label: 'Solution', href: '#solution' },
      { label: 'Architecture', href: '#architecture' },
      { label: 'Join Waitlist', href: '#waitlist' },
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'Our Team', href: '#team' },
      { label: 'Contact Support', href: '#waitlist' },
    ]
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security Audits', href: '#' },
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        
        {/* Top Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-slate-100">
          
          {/* Logo & Description (4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <a href="#home" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:rotate-[360deg] transition-transform duration-500 clay-card-primary p-0">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-txt-main">
                Swasthya
              </span>
            </a>
            <p className="text-sm text-txt-muted max-w-sm mb-6 leading-relaxed">
              AI-powered healthcare management platform helping administrators monitor, predict and optimize healthcare resources across PHCs, CHCs, and regional hospital networks.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/10 text-txt-muted hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/10 text-txt-muted hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/10 text-txt-muted hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Directory Map Links (8 columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((cat, idx) => (
              <div key={idx} className="text-left">
                <h4 className="text-xs font-bold text-txt-main uppercase tracking-widest mb-4">
                  {cat.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {cat.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a 
                        href={item.href}
                        className="text-xs md:text-sm text-txt-muted hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom row: copyright, cookie settings */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-txt-muted flex items-center gap-1">
            © {currentYear} Swasthya Systems. Built with <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 animate-pulse" /> for digital healthcare access.
          </span>
          <div className="flex gap-6 text-xs text-txt-muted">
            <a href="#" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors cursor-pointer">Security Audits</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
