/**
 * Health Check Controller
 */

import type { Request, Response } from 'express';

export function getHealthStatus(_req: Request, res: Response): void {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'api-service',
    version: '0.1.0',
  });
}

export function getLivenessStatus(_req: Request, res: Response): void {
  res.json({ status: 'alive' });
}

export function getReadinessStatus(_req: Request, res: Response): void {
  // TODO: Check database connections
  res.json({ status: 'ready' });
}

