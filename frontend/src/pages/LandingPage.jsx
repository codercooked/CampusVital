import React from 'react';
import Navbar from '../components/landing/Navbar';
import { SonicWaveformHero, SonicWaveformCanvas } from '../components/ui/sonic-waveform';
import StatStrip from '../components/landing/StatStrip';
import HowItWorks from '../components/landing/HowItWorks';
import GenieLiveDemo from '../components/landing/GenieLiveDemo';
import Impact from '../components/landing/Impact';
import FinalCTA from '../components/landing/FinalCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-text relative">
      <SonicWaveformCanvas />
      
      <Navbar />
      <main className="relative z-10">
        <SonicWaveformHero />
        <StatStrip />
        <HowItWorks />
        <GenieLiveDemo />
        <Impact />
        <FinalCTA />
      </main>
    </div>
  );
}
