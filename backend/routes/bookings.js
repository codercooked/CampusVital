import express from 'express';
import db from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    let query = `
      SELECT b.*, r.name as room_name 
      FROM bookings b 
      JOIN rooms r ON b.room_id = r.id
    `;
    const params = [];

    if (req.query.status) {
      query += ' WHERE b.status = ?';
      params.push(req.query.status);
    }
    query += ' ORDER BY b.created_at DESC';

    const bookings = db.prepare(query).all(...params);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { room_id, user_id, user_name, date, start_time, end_time, purpose } = req.body;
    
    if (!room_id || !user_id || !user_name || !date || !start_time || !end_time || !purpose) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const info = db.prepare(`
      INSERT INTO bookings (room_id, user_id, user_name, date, start_time, end_time, purpose, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(room_id, user_id, user_name, date, start_time, end_time, purpose);

    const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT b.*, r.name as room_name 
      FROM bookings b 
      JOIN rooms r ON b.room_id = r.id 
      WHERE b.user_id = ?
      ORDER BY b.date DESC, b.start_time DESC
    `).all(req.params.userId);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Booking not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Booking not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
