import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questRoutes from './routes/quests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ai-quest-generator-backend',
  });
});

// API routes
app.use('/api/quests', questRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Quest generation: POST http://localhost:${PORT}/api/quests/generate`);
});
