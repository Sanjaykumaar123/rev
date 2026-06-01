import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter((origin): origin is string => !!origin);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Allow local development origins or matched FRONTEND_URL in production
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Main Root Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Digimation Flight 3.0 API',
    description: 'AI-Powered Career & Learning Ecosystem Backend Server',
    status: 'online',
    version: '3.0.0'
  });
});

// Health Check (used by Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api', apiRouter);

// Start Database & Listen
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` DIGIMATION FLIGHT 3.0 BACKEND SERVER ONLINE      `);
    console.log(` Listening on: http://localhost:${PORT}          `);
    console.log(`==================================================`);
  });
};

startServer();
