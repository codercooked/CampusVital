import http from 'http';
http.get('http://localhost:3001/api/bookings?status=pending', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('3001:', data));
}).on('error', e => console.error('3001 error:', e.message));

