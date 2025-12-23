/**
 * API Service Entry Point
 * RCF: REQ-001 (Polymorphic Exam Engine), REQ-013 (Service Decoupling)
 */

import express from 'express';
import { api } from './api/index.js';
import { getConfig } from './config/index.js';

const app = express();
const config = getConfig();

// Middleware
app.use(express.json());

// API Routes
app.use('/api', api);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(config.port, () => {
  console.log(`[API Service] Running on port ${config.port}`);
  console.log(`[API Service] Environment: ${config.nodeEnv}`);
});

export { app };

