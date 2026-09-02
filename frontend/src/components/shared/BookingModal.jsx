import React, { useState } from 'react';
import { motion } from 'motion/react';
import GlassCard from './GlassCard';

export default function BookingModal({ room, onClose, onBook }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  const hours = Array.from({length: 15}, (_, i) => {
    const h = (i + 8).toString().padStart(2, '0');
    return `${h}:00`;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }
    setError('');
    try {
      await onBook({ date, startTime, endTime, purpose });
    } catch (err) {
      if (err.message.includes('409')) {
        setError('Room is already booked for this time slot');
      } else {
        setError('Failed to book room');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6">
          <h2 className="text-xl font-heading font-bold mb-4 text-text">Book {room?.name || 'Room'}</h2>
          {error && <div className="mb-4 p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Date</label>
              <input 
                type="date" 
                required 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Start Time</label>
                <select 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary outline-none"
                >
                  {hours.map(h => <option key={`start-${h}`} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">End Time</label>
                <select 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary outline-none"
                >
                  {hours.slice(1).map(h => <option key={`end-${h}`} value={h}>{h}</option>)}
                  <option value="22:00">22:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Purpose</label>
              <textarea 
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary outline-none min-h-[80px]"
                placeholder="e.g. Study group"
              />
            </div>

            <div className="flex gap-3 mt-4 justify-end">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-sm text-muted hover:text-text"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary text-bg font-semibold rounded-lg text-sm"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
