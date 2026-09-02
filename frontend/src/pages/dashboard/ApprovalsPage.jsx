import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import { fetchBookings, updateBookingStatus } from '../../lib/api';
import { ClipboardCheck } from 'lucide-react';

const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [toast, setToast] = useState(null);

  const loadApprovals = async () => {
    try {
      const data = await fetchBookings('pending');
      setApprovals(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await updateBookingStatus(id, action);
      setApprovals(approvals.filter(a => a.id !== id));
      setToast(`${action === 'approved' ? 'Approved' : 'Rejected'} request.`);
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      console.error(e);
      setToast('Failed to update status');
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-white mb-2">Pending Approvals</h1>
          <p className="text-white/50 text-sm font-medium">Review and manage incoming room booking requests.</p>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0a0a0a] border border-white/20 text-white px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] z-50 flex items-center gap-3 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]"></div>
          <span className="font-medium text-sm tracking-wide">{toast}</span>
        </div>
      )}
      
      <GlassCard className="p-0 overflow-hidden">
        {approvals.length > 0 ? (
          <div className="flex flex-col">
            {approvals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <div>
                  <h3 className="font-bold text-xl text-white mb-2">{item.room_name}</h3>
                  <div className="text-sm text-white/50 flex gap-6 mb-2">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/20"></div><strong className="font-bold text-white/70">By:</strong> {item.user_name}</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/20"></div><strong className="font-bold text-white/70">When:</strong> {item.date}, {item.start_time} - {item.end_time}</span>
                  </div>
                  <div className="text-sm text-white/50 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                    <strong className="font-bold text-white/70">Purpose:</strong> {item.purpose}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <button 
                    onClick={() => handleAction(item.id, 'rejected')}
                    className="bg-black/50 border border-red-500/20 text-red-400 px-5 py-2.5 rounded-xl text-sm hover:bg-red-500/10 font-bold transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, 'approved')}
                    className="bg-white text-black px-5 py-2.5 rounded-xl text-sm hover:bg-gray-200 font-bold transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <ClipboardCheck className="w-16 h-16 mx-auto mb-6 text-white/10" />
            <h3 className="text-xl font-bold text-white/70 mb-2">All caught up!</h3>
            <p className="text-white/40 font-medium">There are currently no pending room approvals.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ApprovalsPage;
