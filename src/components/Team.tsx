'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, BrainCircuit, Github, Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: 'Ruyam Bhattacharjee',
    role: 'System Developer',
    initials: 'RB',
    description:
      'Architects the core platform infrastructure — backend services, database design, blockchain ledger integrity, and distributed sync engines powering Swasthya.',
    icon: Code2,
    gradient: 'from-primary to-blue-600',
    glowColor: 'bg-primary/6',
    badgeColor: 'bg-primary/10 text-primary',
    borderHover: 'hover:border-primary/30',
    socials: { github: '#', linkedin: '#', twitter: '#' },
  },
  {
    name: 'Arijit Chakraborty',
    role: 'Frontend & Marketing',
    initials: 'AC',
    description:
      'Crafts the pixel-perfect UI/UX, brand identity, and go-to-market strategy — ensuring every interaction with Swasthya is beautiful and impactful.',
    icon: Palette,
    gradient: 'from-secondary to-amber-500',
    glowColor: 'bg-secondary/6',
    badgeColor: 'bg-secondary/10 text-secondary',
    borderHover: 'hover:border-secondary/30',
    socials: { github: '#', linkedin: '#', twitter: '#' },
  },
  {
    name: 'Arkoprabho Chatterjee',
    role: 'AI Lead',
    initials: 'AC',
    description:
      'Leads the AI and machine-learning pipeline — outbreak forecasting models, NLP-powered copilot intelligence, and predictive resource allocation algorithms.',
    icon: BrainCircuit,
    gradient: 'from-accent to-emerald-500',
    glowColor: 'bg-accent/6',
    badgeColor: 'bg-accent/10 text-accent',
    borderHover: 'hover:border-accent/30',
    socials: { github: '#', linkedin: '#', twitter: '#' },
  },
];

export default function Team() {
  return (
    <section id="team" className="py-28 relative overflow-hidden bg-dot-pattern">
      {/* Ambient background glow */}
      <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-accent/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.span
            className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-4 inline-block"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The Builders
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-txt-main tracking-tight leading-tight mt-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Meet the Team Behind Swasthya
          </motion.h2>
          <motion.p
            className="text-lg text-txt-muted max-w-xl mx-auto font-normal"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A passionate trio of engineers committed to making healthcare accessible, intelligent, and secure for every community.
          </motion.p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={index}
                className={`group relative clay-card p-8 md:p-10 flex flex-col items-center text-center border border-white/60 ${member.borderHover} hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Subtle gradient glow behind avatar */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[120px] ${member.glowColor} rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />

                {/* Avatar Circle */}
                <div className="relative mb-6">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}
                  >
                    <span className="text-2xl font-black tracking-wider select-none">
                      {member.initials}
                    </span>
                  </div>
                  {/* Floating icon badge */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-xl ${member.badgeColor} flex items-center justify-center shadow-md border-2 border-white group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-extrabold text-txt-main tracking-tight mb-1">
                  {member.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full ${member.badgeColor} text-[11px] font-bold uppercase tracking-widest mb-5`}
                >
                  {member.role}
                </span>

                {/* Description */}
                <p className="text-sm text-txt-muted leading-relaxed font-normal mb-7 max-w-[280px]">
                  {member.description}
                </p>

                {/* Social Icons */}
                <div className="flex gap-3 mt-auto">
                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/10 text-txt-muted hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/10 text-txt-muted hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.socials.twitter && (
                    <a
                      href={member.socials.twitter}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/10 text-txt-muted hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                      aria-label={`${member.name} Twitter`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
