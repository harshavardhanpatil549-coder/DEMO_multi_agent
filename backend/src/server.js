import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import complaintsRouter from './routes/complaints.js';
import agentsRouter from './routes/agents.js';
import analyticsRouter from './routes/analytics.js';
import kbRouter from './routes/knowledge-base.js';
import systemRouter from './routes/system.js';
import { getGeminiStatus } from './services/gemini.js';
import { storage } from './services/storage.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/complaints', complaintsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/knowledge-base', kbRouter);
app.use('/api/system', systemRouter);

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusFix AI Backend',
    timestamp: new Date().toISOString(),
    aiStatus: getGeminiStatus(),
    storageStatus: storage.getStorageMode()
  });
});

// Serve frontend static build if present
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  const ai = getGeminiStatus();
  const db = storage.getStorageMode();
  console.log(`
===========================================================
  🚀 CAMPUSFIX AI - MULTI-AGENT BACKEND READY
===========================================================
  Port:            http://localhost:${PORT}
  AI Provider:     ${ai.provider} (${ai.model})
  AI Status:       ${ai.status}
  Database:        ${db.mode}
  Records:         ${db.records.complaints} complaints, ${db.records.knowledgeBase} KB protocols
  Health Check:    http://localhost:${PORT}/api/health
===========================================================
`);
});
