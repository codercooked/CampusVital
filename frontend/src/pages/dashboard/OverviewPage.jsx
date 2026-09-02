import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Building2, CalendarDays, ClipboardCheck, BarChart2, Sparkles, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import LoadingBubble from '../../components/shared/LoadingBubble';
import SqlReveal from '../../components/shared/SqlReveal';
import QueryDataReveal from '../../components/shared/QueryDataReveal';
import { useGenie } from '../../hooks/useGenie';
import { fetchOverview, fetchBookings } from '../../lib/api';

// Premium Tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
        <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-heading">{label}</p>
        <div className="space-y-2">
           {payload.map((p, idx) => (
             <div key={idx} className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.color || '#fff' }} />
               <span className="text-white/70 text-sm">{p.name}:</span>
               <span className="text-white font-bold text-sm">{p.value}%</span>
             </div>
           ))}
        </div>
      </div>
    );
  }
  return null;
};

const OverviewPage = () => {
  const { messages, isLoading, sendMessage } = useGenie();
  const [inputValue, setInputValue] = useState('');
  
  const [overview, setOverview] = useState({
    totalRooms: 47,
    totalBookingsToday: 0,
    pendingApprovals: 0,
    occupancyRate: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchOverview().then(data => {
      if (data) setOverview(data);
    }).catch(console.error);

    fetchBookings().then(data => {
      if (data) {
        // Show 6 most recent bookings
        setRecentBookings(data.slice(-6).reverse());
      }
    }).catch(console.error);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const lastGenieMsg = [...messages].reverse().find(m => m.role === 'genie');

  const stats = [
    { label: 'Total Rooms', value: overview.totalRooms, icon: Building2, color: '#888888' },
    { label: 'Bookings Today', value: overview.totalBookingsToday, icon: CalendarDays, color: '#FFFFFF' },
    { label: 'Pending Approvals', value: overview.pendingApprovals, icon: ClipboardCheck, color: '#555555' },
    { label: 'Occupancy Rate', value: `${Math.round(overview.occupancyRate)}%`, icon: BarChart2, color: '#FFFFFF' },
  ];

  const chartData = [
    { time: '08:00', live: 15, expected: 25 },
    { time: '10:00', live: 45, expected: 50 },
    { time: '12:00', live: 85, expected: 75 },
    { time: '14:00', live: 92, expected: 85 },
    { time: '16:00', live: 55, expected: 60 },
    { time: '18:00', live: 20, expected: 25 },
    { time: '20:00', live: 5,  expected: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300 cursor-default group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-sm text-[rgba(240,244,255,0.45)] mb-1 uppercase tracking-widest">{stat.label}</div>
              <div className="text-4xl font-heading font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{stat.value}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Recent Bookings */}
        <GlassCard className="col-span-7 p-8">
          <h2 className="text-xl font-heading font-bold mb-6 text-white flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
            Recent Bookings
          </h2>
          <table className="w-full text-sm text-left">
            <thead className="text-[rgba(240,244,255,0.45)] border-b border-[rgba(255,255,255,0.08)]">
              <tr>
                <th className="pb-4 font-medium uppercase tracking-widest text-xs">Room</th>
                <th className="pb-4 font-medium uppercase tracking-widest text-xs">User</th>
                <th className="pb-4 font-medium uppercase tracking-widest text-xs">Time</th>
                <th className="pb-4 font-medium uppercase tracking-widest text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? recentBookings.map((booking, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] last:border-0 hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium text-white">{booking.room_name || booking.room}</td>
                  <td className="py-4 text-[rgba(240,244,255,0.6)]">{booking.user_name || booking.user}</td>
                  <td className="py-4 text-[rgba(240,244,255,0.6)]">{booking.start_time} - {booking.end_time}</td>
                  <td className="py-4"><StatusBadge status={booking.status} /></td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="py-8 text-center text-white/50">No recent bookings</td></tr>
              )}
            </tbody>
          </table>
        </GlassCard>

        {/* Genie Quick Ask */}
        <GlassCard className="col-span-5 p-8 flex flex-col">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-3 text-white">
            <Sparkles className="w-5 h-5 text-white" /> Genie Assistant
          </h2>
          <div className="flex flex-col gap-3 mb-6">
            {["Will there be a room for 80 students next Friday from 3-5 PM?", "What's today's busiest period?", "Rooms under 30% occupancy this week"].map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="text-left bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[rgba(240,244,255,0.6)] hover:text-white hover:border-white/40 hover:bg-white/5 cursor-pointer transition-all shadow-inner"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-black/50 rounded-2xl p-5 mb-5 min-h-[140px] overflow-y-auto border border-white/5 shadow-inner">
            {isLoading && <LoadingBubble />}
            {!isLoading && lastGenieMsg && (
              <div className="text-sm">
                <div className="mb-3 text-white leading-relaxed prose prose-invert max-w-none prose-sm prose-p:my-2 prose-headings:my-3">
                  <ReactMarkdown>{lastGenieMsg.content}</ReactMarkdown>
                </div>
                
                {/* Render Predictive Insight if flagged */}
                {lastGenieMsg.isPredictive && (
                  <div className="mt-4 bg-[#0A0D16] border border-orange-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                    <div className="bg-[#FFFFFF]/5 px-4 py-2 border-b border-orange-500/20 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse"></div>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Mosaic AI Predictive Model</span>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] text-white/50 border border-white/10 px-2 py-0.5 rounded-md">MLflow: campus_avail_v2</span>
                        <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">Confidence: 94%</span>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-[#FFFFFF]/50 font-bold">Current Status</span>
                        <span className="text-sm text-red-400 font-medium">0 Rooms officially available for 80+ capacity.</span>
                      </div>
                      
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FFFFFF]/10 to-transparent"></div>
                      
                      <div className="flex gap-4">
                        <div className="w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-[#888888]"></div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-orange-400 font-bold">High Probability Opening</span>
                          <h3 className="text-lg font-heading font-bold text-[#FFFFFF] mt-1 mb-2">Room B203 <span className="text-sm font-normal text-[#FFFFFF]/50">(Capacity: 120)</span></h3>
                          <p className="text-sm text-[rgba(240,244,255,0.7)] leading-relaxed">
                            Based on historical Delta Lake logs, a recurring <strong>Friday 3:00 PM - 5:00 PM</strong> lecture (CS-401) scheduled here has been <span className="text-[#FFFFFF] border-b border-[#FFFFFF]/30">cancelled 4 out of the last 6 Fridays</span>.
                          </p>
                          <div className="mt-4 flex items-center gap-3">
                            <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                              Auto-Book if Cancelled
                            </button>
                            <button className="border border-[#FFFFFF]/20 text-[#FFFFFF] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/5 transition-colors">
                              View Delta Analytics
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {lastGenieMsg.sql && (
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                    <SqlReveal sql={lastGenieMsg.sql} description="Databricks SQL Serverless Execution" />
                    {lastGenieMsg.attachment_id && (
                      <QueryDataReveal convId={lastGenieMsg.conversation_id} msgId={lastGenieMsg.message_id} attachId={lastGenieMsg.attachment_id} />
                    )}
                  </div>
                )}
              </div>
            )}
            {!isLoading && !lastGenieMsg && (
              <div className="text-sm text-white/30 text-center mt-10 font-medium">Ask a question above or type below.</div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-3 relative mt-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Genie anything..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 placeholder:text-white/30 shadow-inner transition-all"
            />
            <button type="submit" disabled={isLoading} className="bg-white text-black px-5 py-3 rounded-xl disabled:opacity-50 font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Premium Chart */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#888888] shadow-[0_0_10px_#888888]"></div>
            Campus Occupancy Trend
          </h2>
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-white"><div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#fff]"></div> Live Data</div>
            <div className="flex items-center gap-2 text-white/50"><div className="w-3 h-3 rounded-full bg-[#333] border border-white/20"></div> Expected</div>
          </div>
        </div>
        
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#555555" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#555555" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="expected" stroke="#555555" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorExpected)" />
              <Area type="monotone" dataKey="live" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorLive)" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

export default OverviewPage;
