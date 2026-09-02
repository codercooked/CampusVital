import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { fetchUserBookings, updateBookingStatus } from '../../lib/api';

const BookingsPage = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBookings(1).then(data => {
      setMyBookings(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateBookingStatus(id, 'cancelled');
      setMyBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-[rgba(240,244,255,0.45)] text-xs uppercase bg-[#0F1420]/50 border-b border-[rgba(255,255,255,0.08)]">
            <tr>
              <th className="px-6 py-4 font-medium">Room</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium">Purpose</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-[rgba(240,244,255,0.45)]">
                  Loading bookings...
                </td>
              </tr>
            ) : myBookings.length > 0 ? (
              myBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium">{booking.room_name || booking.room}</td>
                  <td className="px-6 py-4 text-[rgba(240,244,255,0.7)]">{booking.date}</td>
                  <td className="px-6 py-4 text-[rgba(240,244,255,0.7)]">{booking.start_time} - {booking.end_time}</td>
                  <td className="px-6 py-4 text-[rgba(240,244,255,0.7)] truncate max-w-[200px]">{booking.purpose}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === 'pending' && (
                      <button onClick={() => handleCancel(booking.id)} className="text-red-400 text-xs hover:underline font-medium">Cancel</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-[rgba(240,244,255,0.45)]">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default BookingsPage;
