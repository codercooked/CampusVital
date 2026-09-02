import React from 'react';

export default function Impact() {
  const issues = [
    { label: 'Ghost Bookings', width: '78%', color: 'from-[#555555]/80 to-[#555555]/40' },
    { label: 'HVAC on in empty rooms', width: '64%', color: 'from-[#555555]/80 to-[#555555]/40' },
    { label: 'Maintenance delays', width: '42%', color: 'from-[#888888]/80 to-[#888888]/40' },
    { label: 'Data Accuracy with Genie', width: '99%', color: 'from-[#FFFFFF]/80 to-[#FFFFFF]/40' }
  ];

  return (
    <div className="py-24 px-6 max-w-5xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-[#F0F4FF]">The Reality</h2>
      </div>
      
      <div className="flex flex-col gap-8 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 md:p-12 backdrop-blur-md">
        {issues.map((issue, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <div className="font-medium text-sm text-[#F0F4FF]">{issue.label}</div>
              <div className="font-mono text-xs text-[rgba(240,244,255,0.45)]">{issue.width}</div>
            </div>
            <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${issue.color} rounded-full relative shadow-[0_0_10px_currentColor]`}
                style={{ width: issue.width }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
