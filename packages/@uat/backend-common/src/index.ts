/**
 * Backend Common - Shared utilities for UAT Platform
 */

// Classes
export { Exceptions, AppError, ValidationError, NotFoundError, UnauthorizedError } from './classes/exceptions.js';

// Middleware
export { corsMiddleware } from './middleware/cors.middleware.js';
export { rateLimiterMiddleware } from './middleware/rate-limiter.middleware.js';
export { requestLoggerMiddleware } from './middleware/request-logger.js';
export { securityHeadersMiddleware } from './middleware/security-headers.middleware.js';

// Services
export { createLogger, type Logger } from './services/logger.js';
export { PostgresService } from './services/postgres.js';
export { MongoDBService } from './services/mongodb.js';
export { CacheService } from './services/cache.js';

// Types
export type * from './types/global.js';

// Utils
export * from './utils/index.js';

