import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'campus.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK(role IN ('admin','teacher','student','coordinator')),
    department TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    name TEXT,
    building TEXT,
    floor INTEGER,
    capacity INTEGER,
    type TEXT CHECK(type IN ('classroom','lab','seminar_hall','conference','auditorium','library')),
    amenities TEXT,
    status TEXT DEFAULT 'available',
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    user_id INTEGER REFERENCES users(id),
    user_name TEXT,
    date TEXT,
    start_time TEXT,
    end_time TEXT,
    purpose TEXT,
    status TEXT CHECK(status IN ('approved','pending','rejected')) DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY,
    title TEXT,
    type TEXT,
    generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    content TEXT
  );
`);

export default db;
