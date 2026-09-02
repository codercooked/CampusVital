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
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} onBook={handleBook} />
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,244,255,0.45)]" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.08)] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F0F4FF] outline-none focus:border-[#FFFFFF]/50"
          />
        </div>
        
        <select value={building} onChange={e => setBuilding(e.target.value)} className="bg-[#0F1420] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#F0F4FF] outline-none">
          <option value="All">All Buildings</option>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
          <option value="Block D">Block D</option>
          <option value="Library">Library</option>
        </select>

        <select value={type} onChange={e => setType(e.target.value)} className="bg-[#0F1420] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#F0F4FF] outline-none">
          <option value="All">All Types</option>
          <option value="Classroom">Classroom</option>
          <option value="Lab">Lab</option>
          <option value="Seminar Hall">Seminar Hall</option>
          <option value="Conference">Conference</option>
          <option value="Auditorium">Auditorium</option>
          <option value="Library">Library</option>
        </select>

        <div className="flex items-center gap-3 bg-[#0F1420] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2">
          <span className="text-sm text-[#F0F4FF]">Available now</span>
          <div 
            className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${availableOnly ? 'bg-[#FFFFFF]' : 'bg-[#000000] border border-[rgba(255,255,255,0.1)]'}`}
            onClick={() => setAvailableOnly(!availableOnly)}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${availableOnly ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} style={{ transform: availableOnly ? 'translateX(20px)' : 'translateX(0)' }}></div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredRooms.map(room => {
          let parsedAmenities = [];
          try { parsedAmenities = JSON.parse(room.amenities); } catch (e) {}

          return (
          <GlassCard key={room.id} className="p-5 flex flex-col h-full rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading font-semibold text-lg">{room.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${room.is_free ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`text-xs font-medium ${room.is_free ? 'text-green-400' : 'text-red-400'}`}>
                  {room.is_free ? 'Free now' : `Occupied`}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-[rgba(240,244,255,0.45)] mb-3 flex justify-between">
              <span>{room.building} • Floor {room.floor}</span>
              <span className="bg-[#000000] px-2 py-0.5 rounded text-xs border border-[rgba(255,255,255,0.05)]">Cap: {room.capacity}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
              {parsedAmenities.map(amenity => (
                <span key={amenity} className="text-[10px] bg-[#0F1420] border border-[rgba(255,255,255,0.08)] rounded-full px-2 py-0.5 text-[rgba(240,244,255,0.45)] capitalize">
                  {amenity}
                </span>
              ))}
            </div>

            <button 
              onClick={() => setSelectedRoom(room)}
              className="bg-[#FFFFFF]/10 text-[#FFFFFF] text-sm px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 w-full transition-colors font-medium border border-[#FFFFFF]/20"
            >
              Book this room
            </button>
          </GlassCard>
        )})}
        
        {filteredRooms.length === 0 && (
          <div className="col-span-3 text-center py-12 text-[rgba(240,244,255,0.45)]">
            No rooms found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
