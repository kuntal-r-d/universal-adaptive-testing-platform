/**
 * Health Check Routes
 */

import { Router } from 'express';
import { getHealthStatus, getLivenessStatus, getReadinessStatus } from '../controllers/health.controller.js';

const healthRoutes = Router();

healthRoutes.get('/', getHealthStatus);
healthRoutes.get('/live', getLivenessStatus);
healthRoutes.get('/ready', getReadinessStatus);

export { healthRoutes };

