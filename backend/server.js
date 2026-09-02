import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import './db/seed.js';
import genieRouter from './routes/genie.js';
import roomsRouter from './routes/rooms.js';
import bookingsRouter from './routes/bookings.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/genie', genieRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/analytics', analyticsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`CampusVitals backend listening on port ${PORT}`);
});
