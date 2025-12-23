/**
 * Request Logger Middleware
 * RCF: REQ-018 (Audit Logging)
 */

import type { Request, Response, NextFunction } from 'express';

export function requestLoggerMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const log = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
        timestamp: new Date().toISOString(),
      };

      // Use global logger if available, otherwise console
      if (global.logger) {
        global.logger.info(log, 'HTTP Request');
      } else {
        console.log('[HTTP]', JSON.stringify(log));
      }
    });

    next();
  };
}

