import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import applicationsRouter from './routes/applications';
import aiRouter from './routes/ai';
import jobsRouter from './routes/jobs';
import { initCleanupWorker } from './workers/cleanup';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/jobs', jobsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Initialize background workers
  initCleanupWorker();
});
