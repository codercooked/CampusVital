import express from 'express';
import db from '../db/database.js';

const router = express.Router();

router.get('/overview', (req, res) => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentHourStr = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    const totalRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get().count;
    const totalBookingsToday = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE date = ?").get(todayStr).count;
    const pendingApprovals = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get().count;

    const activeBookings = db.prepare(`
      SELECT COUNT(DISTINCT room_id) as count FROM bookings 
      WHERE date = ? AND start_time <= ? AND end_time >= ? AND status = 'approved'
    `).get(todayStr, currentHourStr, currentHourStr).count;

    const occupancyRate = totalRooms > 0 ? (activeBookings / totalRooms) * 100 : 0;

    res.json({
      totalRooms,
      totalBookingsToday,
      pendingApprovals,
      occupancyRate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/heatmap', (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateLimit = thirtyDaysAgo.toISOString().split('T')[0];

    const bookings = db.prepare('SELECT date, start_time, end_time FROM bookings WHERE date >= ? AND status = "approved"').all(dateLimit);

    const heatmap = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 8; hour <= 22; hour++) {
        heatmap.push({ day, hour, count: 0 });
      }
    }

    for (const b of bookings) {
      const d = new Date(b.date);
      const dayOfWeek = d.getDay(); // 0-6 (Sun-Sat)
      const startHour = parseInt(b.start_time.split(':')[0]);
      let endHour = parseInt(b.end_time.split(':')[0]);
      if (b.end_time.split(':')[1] === '00' && endHour > startHour) {
          endHour -= 1; // if end time is 11:00, count hour 10.
      }

      for (let h = startHour; h <= endHour; h++) {
        if (h >= 8 && h <= 22) {
          const slot = heatmap.find(x => x.day === dayOfWeek && x.hour === h);
          if (slot) slot.count++;
        }
      }
    }

    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/resources', (req, res) => {
  try {
    const totalRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get().count;
    const workingHoursPerDay = 10; // 8 AM to 6 PM
    const kwhPerHour = 2.5; // Average power consumption per hour

    const data = [];
    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const bookings = db.prepare('SELECT start_time, end_time FROM bookings WHERE date = ? AND status = "approved"').all(dateStr);
      let bookedHours = 0;
      
      for (const b of bookings) {
        const startHour = parseInt(b.start_time.split(':')[0]);
        const endHour = parseInt(b.end_time.split(':')[0]);
        bookedHours += (endHour - startHour);
      }
      
      const totalPossibleHours = totalRooms * workingHoursPerDay;
      const usedHours = Math.min(bookedHours, totalPossibleHours); // cap just in case
      const savedHours = totalPossibleHours - usedHours;
      
      data.push({
        date: dateStr,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        usedKwh: usedHours * kwhPerHour,
        savedKwh: savedHours * kwhPerHour
      });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
