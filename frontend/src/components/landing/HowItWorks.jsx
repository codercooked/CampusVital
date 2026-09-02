import React from 'react';

export default function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight leading-tight mb-6 text-[#F0F4FF]">
          Three Layers.<br/>One Brain.
        </h2>
        <p className="font-medium text-lg text-[rgba(240,244,255,0.7)] mb-8 leading-relaxed">
          We don't do soft dashboards. We do raw data extraction using Databricks Unity Catalog.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {[
          { title: "Occupancy", desc: "Live physical space tracking.", color: "text-[#888888]" },
          { title: "Utility", desc: "Real-time energy & water waste.", color: "text-[#555555]" },
          { title: "Genie AI", desc: "The brain that connects them all.", color: "text-[#FFFFFF]" }
        ].map((layer, i) => (
          <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl ${layer.color.replace('text-', 'bg-')}`}></div>
            <div className={`font-mono text-xs mb-2 ${layer.color}`}>LAYER 0{i+1}</div>
            <h3 className="font-heading font-bold text-2xl text-[#F0F4FF]">{layer.title}</h3>
            <p className="font-medium text-[rgba(240,244,255,0.45)] mt-2">{layer.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
