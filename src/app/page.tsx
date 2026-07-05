'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustedBy from '@/components/TrustedBy';
import Features from '@/components/Features';
import DashboardPreview from '@/components/DashboardPreview';
import TechLayer from '@/components/TechLayer';
import DistrictTwin from '@/components/DistrictTwin';
import Copilot from '@/components/Copilot';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';
import LenisProvider from '@/components/LenisProvider';
import CursorFollower from '@/components/CursorFollower';
import MedicalCanvas from '@/components/MedicalCanvas';
import Preloader from '@/components/Preloader';

export default function Home() {
  return (
    <LenisProvider>
      {/* Fullscreen medicine spinning preloader */}
      <Preloader />

      {/* Premium cursor follow effect */}
      <CursorFollower />

      {/* Persistent floating 3D/vector medical symbols & blobs */}
      <MedicalCanvas />

      {/* Sticky Header Nav */}
      <Navbar />

      {/* Landing Page Content Blocks */}
      <main className="flex-1 flex flex-col relative z-10">
        
        {/* Section 1: Hero Area */}
        <Hero />

        {/* Section 2: Trusted By Scrolling Bar */}
        <TrustedBy />

        {/* Section 3: Core Features Grid */}
        <Features />

        {/* Section 4: Zooming Dashboard Preview */}
        <DashboardPreview />

        {/* Section 5: AI + Blockchain Ledger Integrity Diagram */}
        <TechLayer />

        {/* Section 6: Interactive District Command Twin Topology */}
        <DistrictTwin />

        {/* Section 7: Swasthya AI Assistant Mockup Chat Client */}
        <Copilot />

        {/* Section 8: Health Platform Statistics Counters */}
        <Stats />

        {/* Section 9: Customer/Doctor Marquee Testimonials */}
        <Testimonials />

        {/* Section 10: Subscriber Request Waitlist Zone */}
        <Waitlist />

      </main>

      {/* Footer Directory */}
      <Footer />
    </LenisProvider>
  );
}
