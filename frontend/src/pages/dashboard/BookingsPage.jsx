import React from 'react';
import GlassCard from '../../components/shared/GlassCard';
import StatusBadge from '../../components/shared/StatusBadge';

const BookingsPage = () => {
  const myBookings = [
    { id: 1, room: 'Room 101', date: '2026-09-02', time: '10:00 AM - 11:30 AM', purpose: 'Weekly Team Sync', status: 'approved' },
    { id: 2, room: 'Conference Room B', date: '2026-09-03', time: '02:00 PM - 03:00 PM', purpose: 'Client Presentation', status: 'pending' },
    { id: 3, room: 'Seminar Hall A', date: '2026-09-05', time: '09:00 AM - 12:00 PM', purpose: 'Guest Lecture', status: 'pending' },
    { id: 4, room: 'Lab 4', date: '2026-08-30', time: '01:00 PM - 03:00 PM', purpose: 'Practical Exam', status: 'completed' },
    { id: 5, room: 'Library Pod 2', date: '2026-08-28', time: '04:00 PM - 06:00 PM', purpose: 'Group Study', status: 'completed' },
    { id: 6, room: 'Auditorium Main', date: '2026-08-25', time: '10:00 AM - 05:00 PM', purpose: 'Tech Symposium', status: 'completed' },
    { id: 7, room: 'Meeting Room 1', date: '2026-08-20', time: '11:00 AM - 11:45 AM', purpose: '1:1 Sync', status: 'rejected' },
    { id: 8, room: 'Room 205', date: '2026-08-15', time: '08:30 AM - 10:00 AM', purpose: 'Morning Class', status: 'completed' },
  ];

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
            {myBookings.length > 0 ? (
              myBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium">{booking.room}</td>
                  <td className="px-6 py-4 text-[rgba(240,244,255,0.7)]">{booking.date}</td>
                  <td className="px-6 py-4 text-[rgba(240,244,255,0.7)]">{booking.time}</td>
                  <td className="px-6 py-4 text-[rgba(240,244,255,0.7)] truncate max-w-[200px]">{booking.purpose}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === 'pending' && (
                      <button className="text-red-400 text-xs hover:underline font-medium">Cancel</button>
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
