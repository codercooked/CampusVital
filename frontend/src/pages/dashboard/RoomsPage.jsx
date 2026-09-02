import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import BookingModal from '../../components/shared/BookingModal';
import { bookRoom, fetchRooms } from '../../lib/api';

const RoomsPage = () => {
  const [search, setSearch] = useState('');
  const [building, setBuilding] = useState('All');
  const [type, setType] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(true);
  
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [toast, setToast] = useState(null);

  const loadRooms = async () => {
    try {
      const data = await fetchRooms({ available: availableOnly });
      setRooms(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [availableOnly]);

  const filteredRooms = rooms.filter(room => {
    if (search && !room.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (building !== 'All' && room.building !== building) return false;
    if (type !== 'All' && room.type !== type) return false;
    return true;
  });

  const handleBook = async (details) => {
    try {
      await bookRoom(selectedRoom.id, { 
        user_id: 1, 
        user_name: 'Teacher Demo', 
        date: details.date,
        start_time: details.startTime,
        end_time: details.endTime,
        purpose: details.purpose
      });
      setToast(`Successfully booked ${selectedRoom.name}`);
      setTimeout(() => setToast(null), 3000);
      setSelectedRoom(null);
    } catch (e) {
      console.error(e);
      setToast('Failed to book room: ' + e.message);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0a0a0a] border border-white/20 text-white px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] z-50 flex items-center gap-3 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]"></div>
          <span className="font-medium text-sm tracking-wide">{toast}</span>
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} onBook={handleBook} />
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-white mb-2">Campus Rooms</h1>
          <p className="text-white/50 text-sm font-medium">Browse, filter, and instantly book available spaces across campus.</p>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex gap-4 bg-black/40">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-white/30"
          />
        </div>
        
        <select value={building} onChange={e => setBuilding(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 outline-none focus:border-white/50 cursor-pointer appearance-none">
          <option value="All">All Buildings</option>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
          <option value="Block D">Block D</option>
          <option value="Library">Library</option>
        </select>

        <select value={type} onChange={e => setType(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 outline-none focus:border-white/50 cursor-pointer appearance-none">
          <option value="All">All Types</option>
          <option value="Classroom">Classroom</option>
          <option value="Lab">Lab</option>
          <option value="Seminar Hall">Seminar Hall</option>
          <option value="Conference">Conference</option>
          <option value="Auditorium">Auditorium</option>
          <option value="Library">Library</option>
        </select>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 cursor-pointer select-none hover:bg-white/10 transition-colors" onClick={() => setAvailableOnly(!availableOnly)}>
          <span className="text-sm font-medium text-white/70">Available now</span>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${availableOnly ? 'bg-white' : 'bg-black/50 border border-white/20'}`}>
            <div className={`w-3.5 h-3.5 rounded-full absolute top-0.5 transition-transform ${availableOnly ? 'bg-black translate-x-5.5 left-0.5' : 'bg-white/50 left-0.5'}`} style={{ transform: availableOnly ? 'translateX(20px)' : 'translateX(0)' }}></div>
          </div>
        </div>
      </GlassCard>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredRooms.map(room => {
          let parsedAmenities = [];
          try { parsedAmenities = JSON.parse(room.amenities); } catch (e) {}

          return (
          <GlassCard key={room.id} className="p-6 flex flex-col h-full rounded-2xl hover:scale-[1.02] transition-all duration-300 group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-heading font-bold text-xl text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">{room.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${room.is_free ? 'bg-green-400 text-green-400' : 'bg-red-400 text-red-400'}`}></span>
                <span className={`text-xs font-bold tracking-wider uppercase ${room.is_free ? 'text-green-400' : 'text-red-400'}`}>
                  {room.is_free ? 'Free' : `Occupied`}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-white/50 mb-6 flex justify-between font-medium">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                {room.building} • Floor {room.floor}
              </span>
              <span className="bg-black/50 px-2.5 py-1 rounded-md text-xs border border-white/10 text-white/70 shadow-inner">Cap: {room.capacity}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto mb-6">
              {parsedAmenities.map(amenity => (
                <span key={amenity} className="text-[10px] uppercase tracking-widest font-bold bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-white/60">
                  {amenity}
                </span>
              ))}
            </div>

            <button 
              onClick={() => setSelectedRoom(room)}
              className="bg-white text-black text-sm px-4 py-3 rounded-xl hover:bg-gray-200 w-full transition-all font-bold shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Book Room
            </button>
          </GlassCard>
        )})}
        
        {filteredRooms.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-black/40 border border-white/5 rounded-2xl shadow-inner">
            <span className="text-white/30 text-lg font-medium">No rooms found matching your filters.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
