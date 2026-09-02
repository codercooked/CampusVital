import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { genieResults } from '../../lib/api';

export default function QueryDataReveal({ convId, msgId, attachId }) {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    if (!expanded && !data && !loading && !error) {
      setLoading(true);
      try {
        const res = await genieResults(convId, msgId, attachId);
        setData(res);
      } catch (err) {
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  if (!attachId) return null;

  // Try to parse standard Databricks format or fallback to raw JSON
  let tableHeaders = [];
  let tableRows = [];
  
  if (data?.statement_response?.manifest?.schema?.columns) {
    tableHeaders = data.statement_response.manifest.schema.columns.map(c => c.name);
    tableRows = data.statement_response.result?.data_typed_array?.map(row => row.values) || [];
  } else if (data?.statement_response?.result?.data_array) {
    // alternative format
    tableRows = data.statement_response.result.data_array;
  }

  return (
    <div className="mt-2 text-sm border-t border-[rgba(255,255,255,0.08)] pt-2">
      <button 
        onClick={handleToggle}
        className="text-[#888888] hover:text-[#FFFFFF] transition-colors text-xs font-medium flex items-center gap-1"
      >
        {expanded ? 'Hide Data ▴' : 'View Raw Data ▾'}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-[#000000]/80 rounded-lg border border-[rgba(255,255,255,0.08)] overflow-x-auto max-h-[300px] overflow-y-auto">
              {loading && <div className="p-4 text-xs text-[rgba(240,244,255,0.45)]">Fetching from Databricks...</div>}
              {error && <div className="p-4 text-xs text-red-400">{error}</div>}
              {data && tableHeaders.length > 0 ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0F1420] text-[rgba(240,244,255,0.45)] sticky top-0">
                    <tr>
                      {tableHeaders.map((h, i) => (
                        <th key={i} className="px-3 py-2 font-medium border-b border-[rgba(255,255,255,0.08)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-white/[0.02]">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-[#F0F4FF] whitespace-nowrap">{String(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : data && (
                <pre className="p-4 text-[10px] text-[#FFFFFF] font-mono whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
