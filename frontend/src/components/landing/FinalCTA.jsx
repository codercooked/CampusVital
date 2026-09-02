import React from 'react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <div className="py-24 px-6 flex justify-center pb-32">
      <div className="bg-gradient-to-br from-[rgba(255,255,255,0.15)] to-[rgba(136,136,136,0.05)] border border-[#FFFFFF]/20 p-12 md:p-20 rounded-3xl backdrop-blur-md max-w-4xl w-full text-center relative overflow-hidden">
        {/* Glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FFFFFF] opacity-[0.15] blur-[80px] rounded-full pointer-events-none"></div>

        <h2 className="font-heading font-bold text-5xl md:text-6xl tracking-tight mb-6 text-[#F0F4FF] relative z-10">
          Stop Guessing.
        </h2>
        <p className="font-medium text-lg text-[rgba(240,244,255,0.7)] mb-10 max-w-xl mx-auto relative z-10">
          See the raw truth of your campus operations. Powered by Databricks Genie Space.
        </p>
        <Link to="/dashboard" className="inline-block bg-[#FFFFFF] text-[#000000] font-semibold text-base px-8 py-4 rounded-xl hover:bg-[#FFFFFF]/90 shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all relative z-10 hover:scale-105">
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
}
