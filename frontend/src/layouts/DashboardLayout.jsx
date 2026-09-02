import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarDays, Sparkles, ClipboardCheck, BarChart2, FileText, Bell, User } from 'lucide-react';
import { fetchBookings } from '../lib/api';

const DashboardLayout = () => {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const pending = await fetchBookings('pending');
        setPendingCount(pending.length);
      } catch (e) {
        console.error(e);
      }
    };
    loadPendingCount();
    // Poll every 5 seconds to keep the badge updated across the app
    const interval = setInterval(loadPendingCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Rooms', path: '/dashboard/rooms', icon: Building2 },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: CalendarDays },
    { name: 'Ask Genie', path: '/dashboard/genie', icon: Sparkles, highlight: true },
    { name: 'Approvals', path: '/dashboard/approvals', icon: ClipboardCheck, badge: pendingCount > 0 ? pendingCount.toString() : null },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-transparent text-[#F0F4FF] font-sans relative">
      
      {/* Global Dashboard Grid Pattern */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-60
          bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
          bg-[size:40px_40px]" 
      />

      {/* Sidebar */}
      <aside className="w-60 h-screen fixed top-0 left-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/[0.06] flex flex-col z-20">
        <div className="p-5 flex items-center gap-2 mb-6">
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-6">
            <path d="M0,12 L8,12 L12,4 L16,20 L20,12 L28,12" />
          </svg>
          <span className="font-heading font-semibold text-lg">CampusVitals</span>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#FFFFFF]/[0.08] border-l-2 border-[#FFFFFF] text-[#FFFFFF]'
                    : `text-[rgba(240,244,255,0.45)] hover:text-[#F0F4FF] hover:bg-white/[0.03] ${item.highlight ? 'text-[#FFFFFF]' : ''}`
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="bg-white/10 text-white text-xs px-1.5 py-0.5 rounded-full font-medium border border-white/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1 min-h-screen bg-transparent flex flex-col relative z-10">
        {/* Top bar (optional) */}
        <header className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-white/[0.02]">
          <h1 className="font-heading font-semibold text-xl capitalize">
            {location.pathname.split('/').pop() || 'Overview'}
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-[rgba(240,244,255,0.45)] hover:text-[#F0F4FF] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-white shadow-[0_0_8px_#fff] rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-[rgba(240,244,255,0.45)]" />
            </div>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
