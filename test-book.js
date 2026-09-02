import http from 'http';
const data = JSON.stringify({
  user_id: 1,
  user_name: 'Teacher Demo',
  date: '2026-11-10',
  start_time: '10:00',
  end_time: '11:00',
  purpose: 'Test via API'
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/rooms/1/book',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log(res.statusCode, body));
});
req.write(data);
req.end();
