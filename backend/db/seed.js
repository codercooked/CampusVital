import db from './database.js';

console.log('Seeding database...');

db.exec(`
  DELETE FROM bookings;
  DELETE FROM reports;
  DELETE FROM rooms;
  DELETE FROM users;
`);

const insertUser = db.prepare('INSERT INTO users (id, name, email, role, department) VALUES (?, ?, ?, ?, ?)');
const insertRoom = db.prepare('INSERT INTO rooms (id, name, building, floor, capacity, type, amenities) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertBooking = db.prepare('INSERT INTO bookings (id, room_id, user_id, user_name, date, start_time, end_time, purpose, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

db.transaction(() => {
  const users = [
    [1, 'Amit Kumar', 'amit.k@example.com', 'admin', 'IT'],
    [2, 'Priya Sharma', 'priya.s@example.com', 'admin', 'Admin'],
    [3, 'Rahul Singh', 'rahul.s@example.com', 'admin', 'Management'],
    [4, 'Sneha Gupta', 'sneha.g@example.com', 'admin', 'HR'],
    [5, 'Vikram Patel', 'vikram.p@example.com', 'admin', 'Operations'],
    [6, 'Anjali Desai', 'anjali.d@example.com', 'teacher', 'CSE'],
    [7, 'Rohan Verma', 'rohan.v@example.com', 'teacher', 'ECE'],
    [8, 'Pooja Reddy', 'pooja.r@example.com', 'teacher', 'ME'],
    [9, 'Karan Malhotra', 'karan.m@example.com', 'teacher', 'CV'],
    [10, 'Meera Nair', 'meera.n@example.com', 'teacher', 'ISE'],
    [11, 'Suresh Joshi', 'suresh.j@example.com', 'teacher', 'Math'],
    [12, 'Divya Iyer', 'divya.i@example.com', 'teacher', 'Physics'],
    [13, 'Arun Menon', 'arun.m@example.com', 'teacher', 'CSE'],
    [14, 'Riya Kapoor', 'riya.k@example.com', 'student', 'CSE'],
    [15, 'Sahil Jain', 'sahil.j@example.com', 'student', 'ECE'],
    [16, 'Neha Bhatt', 'neha.b@example.com', 'student', 'ME'],
    [17, 'Varun Chopra', 'varun.c@example.com', 'student', 'CV'],
    [18, 'Aditi Rao', 'aditi.r@example.com', 'student', 'ISE'],
    [19, 'Kabir Das', 'kabir.d@example.com', 'student', 'Math'],
    [20, 'Kavya Sen', 'kavya.s@example.com', 'student', 'Physics'],
    [21, 'Nitin Ghosh', 'nitin.g@example.com', 'student', 'CSE'],
    [22, 'Shruti Pillai', 'shruti.p@example.com', 'student', 'ECE'],
    [23, 'Gaurav Dubey', 'gaurav.d@example.com', 'student', 'ME'],
    [24, 'Ritu Yadav', 'ritu.y@example.com', 'student', 'CV'],
    [25, 'Akhil Nair', 'akhil.n@example.com', 'student', 'ISE'],
    [26, 'Swati Mishra', 'swati.m@example.com', 'coordinator', 'CSE'],
    [27, 'Rajat Tiwari', 'rajat.t@example.com', 'coordinator', 'ECE'],
    [28, 'Preeti Pandey', 'preeti.p@example.com', 'coordinator', 'ME'],
    [29, 'Vivek Chauhan', 'vivek.c@example.com', 'coordinator', 'CV'],
    [30, 'Richa Thakur', 'richa.t@example.com', 'coordinator', 'ISE'],
  ];

  for (const u of users) insertUser.run(u);

  const amenitiesList = [
    '["projector","whiteboard","ac"]',
    '["whiteboard","ac"]',
    '["projector","whiteboard","ac","microphone"]',
    '["computers","whiteboard","ac"]',
    '["projector","ac"]'
  ];
  
  let roomId = 1;
  const specificRooms = [
    { name: 'CS-101', building: 'Block A', floor: 1, capacity: 60, type: 'classroom' },
    { name: 'CS-102', building: 'Block A', floor: 1, capacity: 60, type: 'classroom' },
    { name: 'CS-201', building: 'Block A', floor: 2, capacity: 80, type: 'classroom' },
    { name: 'CS-Lab 1', building: 'Block A', floor: 2, capacity: 45, type: 'lab' },
    { name: 'CS-Lab 2', building: 'Block A', floor: 3, capacity: 45, type: 'lab' },
    { name: 'ECE-101', building: 'Block B', floor: 1, capacity: 60, type: 'classroom' },
    { name: 'ECE-Lab', building: 'Block B', floor: 2, capacity: 40, type: 'lab' },
    { name: 'ME-101', building: 'Block B', floor: 1, capacity: 60, type: 'classroom' },
    { name: 'AI Lab', building: 'Block C', floor: 2, capacity: 50, type: 'lab' },
    { name: 'Hardware Lab', building: 'Block C', floor: 1, capacity: 40, type: 'lab' },
    { name: 'Conference Room 1', building: 'Block C', floor: 3, capacity: 30, type: 'conference' },
    { name: 'Seminar Hall 1', building: 'Block B', floor: 3, capacity: 150, type: 'seminar_hall' },
    { name: 'Main Auditorium', building: 'Block D', floor: 1, capacity: 300, type: 'auditorium' },
    { name: 'Central Library', building: 'Block D', floor: 2, capacity: 200, type: 'library' }
  ];

  for (const r of specificRooms) {
    const amenities = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
    insertRoom.run(roomId, r.name, r.building, r.floor, r.capacity, r.type, amenities);
    roomId++;
  }

  const generateRooms = (building, count, types) => {
    for (let i = 1; i <= count; i++) {
      const type = types[i % types.length];
      const floor = ((i - 1) % 4) + 1;
      const roomNum = floor * 100 + i;
      const capacity = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
      const amenities = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
      insertRoom.run(roomId, `${building}-${roomNum}`, building, floor, capacity, type, amenities);
      roomId++;
    }
  };

  generateRooms('Block A', 10, ['classroom', 'lab']);
  generateRooms('Block B', 10, ['classroom', 'seminar_hall']);
  generateRooms('Block C', 8, ['lab', 'conference']);
  generateRooms('Block D', 6, ['auditorium', 'library']);

  const getRecentDate = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  let bookingId = 1;
  const statuses = Array(40).fill('approved').concat(Array(12).fill('pending')).concat(Array(8).fill('rejected'));
  // Shuffle statuses
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }

  for (let i = 0; i < 60; i++) {
    const rId = Math.floor(Math.random() * 47) + 1;
    const uId = Math.floor(Math.random() * 30) + 1;
    const user = users[uId - 1];
    const offset = Math.floor(Math.random() * 37) - 30; // -30 to +6
    const date = getRecentDate(offset);
    const hour = Math.floor(Math.random() * 10) + 8; // 8 to 17
    const start_time = `${hour.toString().padStart(2, '0')}:00`;
    const end_time = `${(hour + 1).toString().padStart(2, '0')}:00`;
    const purpose = 'Meeting / Class ' + i;
    
    insertBooking.run(bookingId, rId, uId, user[1], date, start_time, end_time, purpose, statuses[i]);
    bookingId++;
  }
})();

console.log(`Seeded: 30 users, 47 rooms, 60 bookings.`);
