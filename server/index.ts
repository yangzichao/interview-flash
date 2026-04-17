import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import algorithmsRouter from './routes/algorithms.js';
import behavioralRouter from './routes/behavioral.js';
import oodRouter from './routes/ood.js';
import systemDesignRouter from './routes/system-design.js';
import reviewsRouter from './routes/reviews.js';
import settingsRouter from './routes/settings.js';
import analyticsRouter from './routes/analytics.js';
import notesRouter from './routes/notes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/algorithms', algorithmsRouter);
app.use('/api/behavioral', behavioralRouter);
app.use('/api/ood', oodRouter);
app.use('/api/system-design', systemDesignRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/notes', notesRouter);

// Global error handler — catches unhandled errors from route handlers
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
