import express from 'express';
import db from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    let query = 'SELECT * FROM rooms WHERE 1=1';
    const params = [];

    if (req.query.building) {
      query += ' AND building = ?';
      params.push(req.query.building);
    }
    if (req.query.type) {
      query += ' AND type = ?';
      params.push(req.query.type);
    }
    if (req.query.minCapacity) {
      query += ' AND capacity >= ?';
      params.push(parseInt(req.query.minCapacity));
    }
    if (req.query.maxCapacity) {
      query += ' AND capacity <= ?';
      params.push(parseInt(req.query.maxCapacity));
    }
    if (req.query.search) {
      query += ' AND name LIKE ?';
      params.push(`%${req.query.search}%`);
    }

    let rooms = db.prepare(query).all(...params);

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const busyRooms = db.prepare(`
      SELECT DISTINCT room_id FROM bookings 
      WHERE date = ? AND start_time <= ? AND end_time >= ? AND status = 'approved'
    `).all(currentDate, currentTime, currentTime).map(b => b.room_id);

    rooms = rooms.map(r => ({
      ...r,
      is_free: !busyRooms.includes(r.id)
    }));

    if (req.query.available === 'true') {
      rooms = rooms.filter(r => r.is_free);
    }

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const endDate = nextWeek.toISOString().split('T')[0];

    const bookings = db.prepare(`
      SELECT * FROM bookings 
      WHERE room_id = ? AND date >= ? AND date <= ?
      ORDER BY date ASC, start_time ASC
    `).all(req.params.id, today, endDate);

    res.json({ ...room, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/book', (req, res) => {
  const { user_id, user_name, date, start_time, end_time, purpose } = req.body;
  const room_id = req.params.id;

  try {
    // Check for conflict
    const conflict = db.prepare(`
      SELECT id FROM bookings 
      WHERE room_id = ? AND date = ? AND status IN ('approved', 'pending')
      AND start_time < ? AND end_time > ?
    `).get(room_id, date, end_time, start_time);

    if (conflict) {
      return res.status(409).json({ error: 'Room is already booked for the selected time' });
    }

    const info = db.prepare(`
      INSERT INTO bookings (room_id, user_id, user_name, date, start_time, end_time, purpose, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(room_id, user_id, user_name, date, start_time, end_time, purpose);

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
