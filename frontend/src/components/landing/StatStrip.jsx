import React from 'react';

export default function StatStrip() {
  const stats = [
    { num: "40%", label: "Empty Seats" },
    { num: "80%", label: "HVAC Waste" },
    { num: "0", label: "Current Solutions" },
    { num: "∞", label: "AI Answers", highlight: true }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 border-y border-[rgba(255,255,255,0.08)] bg-[#000000]/50 backdrop-blur-md">
      {stats.map((s, i) => (
        <div key={i} className={`p-8 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.08)] last:border-r-0 flex flex-col items-center justify-center text-center`}>
          <div className={`font-heading font-bold text-5xl md:text-6xl ${s.highlight ? 'text-[#FFFFFF] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-[#F0F4FF]'}`}>{s.num}</div>
          <div className="mt-2 font-medium text-sm text-[rgba(240,244,255,0.45)]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
