import React, { useState, useEffect } from 'react';

const STATUSES = [
  "Checking campus database...",
  "Generating SQL query...",
  "Executing against Genie Space...",
  "Preparing answer..."
];

export default function LoadingBubble() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setStatusIndex(i => (i + 1) % STATUSES.length);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="flex flex-col gap-2 pl-4 border-l-2 border-primary/30">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="font-semibold text-primary">✦ Genie</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <div className="text-sm text-primary transition-opacity duration-300">
        {STATUSES[statusIndex]}
      </div>
    </div>
  );
}
