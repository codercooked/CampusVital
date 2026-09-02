import db from './backend/db/database.js';
console.log(db.prepare("SELECT b.*, r.name as room_name FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.status = 'pending'").all());
