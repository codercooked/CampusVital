import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Download, Plus, Sparkles, Filter, Database, Calendar } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';

const INITIAL_REPORTS = [
  { id: 1, title: 'Monthly Occupancy & Waste - August 2026', type: 'AI Synthesis', date: '2026-08-31', size: '2.4 MB', status: 'Ready' },
  { id: 2, title: 'Utility Consumption Analysis Q3', type: 'Databricks SQL', date: '2026-08-28', size: '1.1 MB', status: 'Ready' },
  { id: 3, title: 'Room Utilization Weekly Digest', type: 'Scheduled', date: '2026-09-01', size: '850 KB', status: 'Ready' },
  { id: 4, title: 'Booking Trends September Forecast', type: 'Predictive', date: '2026-09-02', size: '--', status: 'Generating' },
  { id: 5, title: 'Energy Efficiency Recommendations', type: 'AI Synthesis', date: '2026-08-25', size: '3.2 MB', status: 'Ready' },
];

const ReportsPage = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [downloadingId, setDownloadingId] = useState(null);

  // Simulate "Generating" reports finishing after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.status === 'Generating' ? { ...r, status: 'Ready', size: '1.8 MB' } : r
      ));
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (report) => {
    if (report.status !== 'Ready') return;
    
    setDownloadingId(report.id);
    
    // Simulate a slight network delay for a premium feel
    setTimeout(() => {
      // 1. Generate realistic CSV data based on the report context
      const headers = ["Date", "Building", "Room", "Metric_Category", "Value", "Status_Flag"];
      const rows = Array.from({ length: 150 }).map((_, i) => {
         const date = new Date(2026, 7, (i % 30) + 1).toISOString().split('T')[0];
         const bldg = ["Block A", "Block B", "Main Library", "Science Wing"][Math.floor(Math.random() * 4)];
         const room = `Room ${100 + Math.floor(Math.random() * 50)}`;
         const metric = report.title.includes('Utility') || report.title.includes('Energy') ? 'Energy (kWh)' : 'Occupancy (%)';
         const val = Math.floor(Math.random() * 100);
         const flag = val > 80 ? 'CRITICAL' : val > 40 ? 'NORMAL' : 'LOW';
         return [date, bldg, room, metric, val, flag].join(",");
      });
      
      const csvContent = [headers.join(","), ...rows].join("\n");
      
      // 2. Create Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CampusVitals_${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingId(null);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header & AI Generator */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-heading font-black text-white mb-2">Reports & Exports</h1>
          <p className="text-white/50 text-sm font-medium">Generate deep insights using Databricks Genie and export to CSV or PDF.</p>
        </div>
        
        <div className="w-full md:w-1/2">
          <GlassCard className="p-2 flex items-center gap-2 bg-black/40">
            <Sparkles className="w-5 h-5 text-white/50 ml-3" />
            <input 
              type="text" 
              placeholder="Ask Genie to generate a report..." 
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
            />
            <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Generate
            </button>
          </GlassCard>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest font-heading">Total Generated</div>
            <div className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">124</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest font-heading">Data Processed</div>
            <div className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">4.2 TB</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest font-heading">Scheduled Runs</div>
            <div className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">8</div>
          </div>
        </GlassCard>
      </div>

      {/* Reports List */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-lg font-heading font-bold text-white flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
            Recent Reports
          </h2>
          <button className="text-white/50 hover:text-white flex items-center gap-2 text-sm transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        <div className="flex flex-col">
          {reports.map((report) => (
            <div key={report.id} className="p-6 border-b border-white/5 last:border-0 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-default">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all shadow-inner">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1.5 text-base tracking-wide">{report.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest bg-white/10 border border-white/20 px-2.5 py-1 rounded-md text-white font-medium">
                      {report.type}
                    </span>
                    <span className="text-xs text-white/40 font-medium">Generated: {report.date}</span>
                    <span className="text-xs text-white/20 font-medium hidden md:inline-block">•</span>
                    <span className="text-xs text-white/40 font-medium hidden md:inline-block">Size: {report.size}</span>
                  </div>
                </div>
              </div>
              
              <div>
                {report.status === 'Ready' ? (
                  <button 
                    onClick={() => handleDownload(report)}
                    disabled={downloadingId === report.id}
                    className="text-black bg-white hover:bg-gray-200 text-sm font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50"
                  >
                    {downloadingId === report.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {downloadingId === report.id ? 'Downloading...' : 'Download'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-white/50 text-sm font-bold px-4 py-2.5 bg-black/30 rounded-xl border border-white/10">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Generating...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default ReportsPage;
