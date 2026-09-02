import React, { useState, useEffect } from 'react';
import { TrendingUp, Building2, Zap, Users } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchResources } from '../../lib/api';

const fallbackResources = [
  { day: 'Mon', usedKwh: 340, savedKwh: 120 },
  { day: 'Tue', usedKwh: 420, savedKwh: 150 },
  { day: 'Wed', usedKwh: 310, savedKwh: 180 },
  { day: 'Thu', usedKwh: 450, savedKwh: 200 },
  { day: 'Fri', usedKwh: 380, savedKwh: 160 },
  { day: 'Sat', usedKwh: 120, savedKwh: 250 },
  { day: 'Sun', usedKwh: 100, savedKwh: 280 },
];

const typeDistribution = [
  { name: 'Classroom', value: 45 },
  { name: 'Lab', value: 25 },
  { name: 'Seminar', value: 15 },
  { name: 'Conference', value: 10 },
  { name: 'Other', value: 5 },
];
const COLORS = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];

const footfallData = [
  { time: '8AM', students: 120 },
  { time: '10AM', students: 450 },
  { time: '12PM', students: 850 },
  { time: '2PM', students: 780 },
  { time: '4PM', students: 500 },
  { time: '6PM', students: 200 },
  { time: '8PM', students: 50 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
        <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-heading">{label || payload[0].payload.name}</p>
        <div className="space-y-2">
           {payload.map((p, idx) => (
             <div key={idx} className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill || '#fff' }} />
               <span className="text-white/70 text-sm">{p.name}:</span>
               <span className="text-white font-bold text-sm">{p.value}</span>
             </div>
           ))}
        </div>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [resources, setResources] = useState([]);
  
  useEffect(() => {
    fetchResources().then(data => {
      setResources(data && data.length > 0 ? data : fallbackResources);
    }).catch((err) => {
      console.error(err);
      setResources(fallbackResources); // Fallback if API fails
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Weekly Savings', val: '1,260 kWh', icon: Zap, trend: '+14%' },
          { label: 'Peak Occupancy', val: '850', icon: Users, trend: '12 PM' },
          { label: 'Most Used', val: 'Block A', icon: Building2, trend: 'Lab 4' },
          { label: 'Efficiency Score', val: '92/100', icon: TrendingUp, trend: 'Top 5%' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 flex flex-col hover:scale-[1.02] transition-transform duration-300 cursor-default group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-bold px-2 py-1 bg-white/10 rounded-md text-white border border-white/10">
                {stat.trend}
              </div>
            </div>
            <div className="text-sm text-[rgba(240,244,255,0.45)] mb-1 uppercase tracking-widest font-heading">{stat.label}</div>
            <div className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{stat.val}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Resource Bar Chart */}
        <GlassCard className="col-span-8 p-8">
          <h2 className="text-xl font-heading font-bold mb-6 text-white flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
            Energy: Saved vs Used (kWh)
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resources} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="savedKwh" name="Saved" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="usedKwh" name="Used" fill="#555555" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Donut Chart */}
        <GlassCard className="col-span-4 p-8 flex flex-col">
          <h2 className="text-xl font-heading font-bold mb-2 text-white flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#888888] shadow-[0_0_10px_#888] "></div>
            Room Distribution
          </h2>
          <div className="flex-1 w-full relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-heading font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">47</span>
              <span className="text-xs text-white/50 uppercase tracking-widest mt-1">Total Rooms</span>
            </div>
          </div>
        </GlassCard>

        {/* Footfall Trend */}
        <GlassCard className="col-span-12 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
              Campus Footfall (Today)
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={footfallData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="students" name="Students" stroke="#ffffff" strokeWidth={3} dot={{ r: 4, fill: '#000', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#fff' }} style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default AnalyticsPage;
