import React from 'react';

export default function StatusBadge({ status }) {
  let colorClass = '';
  switch(status?.toLowerCase()) {
    case 'approved': colorClass = 'bg-primary/20 text-primary border-primary/30'; break;
    case 'pending': colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30'; break;
    case 'rejected': colorClass = 'bg-red-500/20 text-red-400 border-red-500/30'; break;
    default: colorClass = 'bg-surface text-text border-border'; break;
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {status || 'Unknown'}
    </span>
  );
}
