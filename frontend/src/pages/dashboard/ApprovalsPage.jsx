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
    <div className="max-w-4xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0F1420] border border-[rgba(255,255,255,0.08)] text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFFFFF]"></span>
          {toast}
        </div>
      )}
      
      <GlassCard className="p-0 overflow-hidden">
        {approvals.length > 0 ? (
          <div className="flex flex-col">
            {approvals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-white/[0.01] transition-colors">
                <div>
                  <h3 className="font-semibold text-[#F0F4FF] mb-1">{item.room_name}</h3>
                  <div className="text-sm text-[rgba(240,244,255,0.45)] flex gap-4">
                    <span><strong className="font-medium text-[rgba(240,244,255,0.6)]">By:</strong> {item.user_name}</span>
                    <span><strong className="font-medium text-[rgba(240,244,255,0.6)]">When:</strong> {item.date}, {item.start_time} - {item.end_time}</span>
                  </div>
                  <div className="text-sm text-[rgba(240,244,255,0.45)] mt-1">
                    <strong className="font-medium text-[rgba(240,244,255,0.6)]">Purpose:</strong> {item.purpose}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <button 
                    onClick={() => handleAction(item.id, 'rejected')}
                    className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/20 font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, 'approved')}
                    className="bg-[#FFFFFF]/10 text-[#FFFFFF] px-4 py-2 rounded-lg text-sm hover:bg-[#FFFFFF]/20 font-medium transition-colors border border-[#FFFFFF]/20"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[rgba(240,244,255,0.45)]">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>All caught up! No pending approvals.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ApprovalsPage;
