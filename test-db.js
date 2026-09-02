import db from './backend/db/database.js';
console.log(db.prepare("SELECT * FROM bookings WHERE status = 'pending'").all());
