import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SqlReveal({ sql, description }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!sql) return null;

  return (
    <div className="mt-2 text-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-muted hover:text-primary transition-colors text-xs font-medium"
      >
        {expanded ? 'Hide SQL ▴' : 'View SQL ▾'}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-black/40 rounded-lg p-4 border border-border">
              {description && <div className="text-muted text-xs mb-2 font-medium">{description}</div>}
              <pre className="font-mono text-primary text-xs whitespace-pre-wrap overflow-x-auto">
                {sql}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
