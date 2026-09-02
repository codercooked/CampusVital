import React from 'react';

export default function GlassCard({ children, className = '' }) {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-3xl
        bg-gradient-to-b from-[#ffffff]/[0.03] to-transparent
        border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
        backdrop-blur-2xl
        ${className}
      `}
    >
      {/* Premium Noise/Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
      
      {/* Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/[0.2] to-transparent"></div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
