import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import problemsRouter from './routes/problems.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/problems', problemsRouter);
app.use('/api/reviews', reviewsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
