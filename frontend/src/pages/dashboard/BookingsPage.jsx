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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-white mb-2">My Bookings</h1>
          <p className="text-white/50 text-sm font-medium">Manage your upcoming schedules and reservations.</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-white/50 text-xs tracking-widest uppercase bg-black/40 border-b border-white/10">
            <tr>
              <th className="px-6 py-5 font-bold">Room</th>
              <th className="px-6 py-5 font-bold">Date</th>
              <th className="px-6 py-5 font-bold">Time</th>
              <th className="px-6 py-5 font-bold">Purpose</th>
              <th className="px-6 py-5 font-bold">Status</th>
              <th className="px-6 py-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-white/50 font-medium">
                  Loading bookings...
                </td>
              </tr>
            ) : myBookings.length > 0 ? (
              myBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5 font-bold text-white text-base">{booking.room_name || booking.room}</td>
                  <td className="px-6 py-5 text-white/70 font-medium">{booking.date}</td>
                  <td className="px-6 py-5 text-white/70 font-medium">{booking.start_time} - {booking.end_time}</td>
                  <td className="px-6 py-5 text-white/70 truncate max-w-[200px]">{booking.purpose}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    {booking.status === 'pending' && (
                      <button onClick={() => handleCancel(booking.id)} className="text-red-400 text-sm hover:text-red-300 hover:underline font-bold transition-colors">Cancel</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <span className="text-white/30 text-lg font-medium">No bookings yet.</span>
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
