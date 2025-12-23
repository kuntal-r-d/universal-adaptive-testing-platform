/**
 * API Route Aggregator
 * RCF: REQ-013 (Service Decoupling)
 */

import { Router } from 'express';
import { healthRoutes } from './routes/health.js';
import { examRoutes } from './routes/exams.js';
import { sessionRoutes } from './routes/sessions.js';

const api = Router();

// Mount routes
api.use('/health', healthRoutes);
api.use('/exams', examRoutes);
api.use('/sessions', sessionRoutes);

export { api };

