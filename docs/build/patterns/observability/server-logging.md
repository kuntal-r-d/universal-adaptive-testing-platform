# Server-Side Logging Pattern

## Overview

This document describes the centralized logging service architecture implemented in the WESPA monorepo. The logging service uses [Pino](https://github.com/pinojs/pino), one of the fastest Node.js loggers, and provides a global singleton pattern with configurable output formats.

## Architecture

### Global Singleton Pattern

The logger is instantiated as a global singleton (`global.logger`) accessible throughout the application without requiring imports. This design choice provides:

- **Consistent logging interface** across all modules
- **Zero import overhead** for logging operations
- **Single configuration point** at application startup
- **Type safety** through TypeScript global declarations

### Components

```
packages/@wsd-ai-services-wespa/backend-common/
├── src/
│   ├── services/
│   │   └── logger.ts           # Core logger service
│   ├── middleware/
│   │   └── request-logger.ts   # Express request logging
│   └── types/
│       └── global.d.ts         # TypeScript global declarations
```

## Configuration

### Environment Variables

```bash
# Logging output format (formatted, jsonl, off)
LOG_STDOUT=formatted
```

### Output Modes

The logger supports three output modes controlled by the `LOG_STDOUT` environment variable:

#### 1. Formatted (Development)

```bash
LOG_STDOUT=formatted
```

Pretty-printed, human-readable logs with colors and structured formatting. Ideal for development and debugging.

Example output:

```
[INFO] [12:34:56.789] [BOOT] Logger initialized
  mode: "formatted"
  name: "api-service"
  level: "debug"
  nodeEnv: "development"
```

#### 2. JSON Lines (Production)

```bash
LOG_STDOUT=jsonl
```

Each log entry is a single JSON object on its own line. Optimal for log aggregators and production monitoring.

Example output:

```json
{"level":30,"time":1700000000000,"msg":"[BOOT] Logger initialized","mode":"jsonl","name":"api-service"}
{"level":30,"time":1700000001000,"msg":"[REQ] GET /api/health","method":"GET","path":"/api/health","statusCode":200}
```

#### 3. Off (Silent)

```bash
LOG_STDOUT=off
```

Disables all stdout logging. Useful for testing or specific deployment scenarios.

## Usage Guide

### Basic Logging

```typescript
// Info level
global.logger.info('User logged in', { userId: 123 });

// Warning level
global.logger.warn('Rate limit approaching', {
  userId: 123,
  requests: 95,
  limit: 100,
});

// Error level
global.logger.error('Database connection failed', {
  error: err,
  host: 'localhost',
  port: 5432,
});

// Debug level (only in development)
global.logger.debug('Processing request', {
  headers: req.headers,
});
```

### Structured Logging

All Pino methods support an additional context object for structured data:

```typescript
// Log with context
global.logger.info('Payment processed', {
  transactionId: 'tx-123',
  amount: 99.99,
  currency: 'USD',
  customerId: 'cust-456',
  processingTime: 234,
});
```

### Boot Sequence Logging

Use the `[BOOT]` prefix convention for startup sequence visibility:

```typescript
import { logBoot } from '@wsd-ai-services-wespa/backend-common';

logBoot('Initializing API service...');
logBoot('Loading configuration...', {
  port: 4500,
  env: 'development',
});
logBoot('Connecting to database...', {
  host: 'localhost',
});
logBoot('Server ready', {
  port: 4500,
  uptime: process.uptime(),
});
```

### Error Logging

Use the `logError` helper for consistent error logging with stack traces:

```typescript
import { logError } from '@wsd-ai-services-wespa/backend-common';

try {
  await someAsyncOperation();
} catch (error) {
  logError('Operation failed', error, {
    operation: 'someAsyncOperation',
    userId: 123,
    retryCount: 3,
  });
}
```

### Request Logging

The request logger middleware automatically logs all HTTP requests and responses:

```typescript
import { requestLogger } from '@wsd-ai-services-wespa/backend-common';

// Add to Express app
app.use(requestLogger);

// Or with custom options
app.use(
  createRequestLogger({
    logBody: false, // Don't log request bodies
    logHeaders: false, // Don't log headers
    logQuery: true, // Log query parameters
    skipPaths: ['/health', '/metrics'], // Skip certain paths
    generateRequestId: true, // Generate X-Request-Id header
  }),
);
```

Output format:

```
[REQ] GET /api/users 200 - 12ms
[RES] GET /api/users 200 - 12ms
```

## Best Practices

### 1. Log Levels

Use appropriate log levels for different scenarios:

- **FATAL**: Application is about to crash
- **ERROR**: Error conditions that need attention
- **WARN**: Warning conditions that might need review
- **INFO**: General informational messages
- **DEBUG**: Detailed debugging information (dev only)
- **TRACE**: Very detailed tracing information (rarely used)

### 2. Context Data Structure

Maintain consistent context object structures:

```typescript
// Good: Consistent structure
global.logger.info('User action', {
  userId: 123,
  action: 'login',
  timestamp: Date.now(),
});

global.logger.info('User action', {
  userId: 456,
  action: 'logout',
  timestamp: Date.now(),
});

// Bad: Inconsistent keys
global.logger.info('User action', {
  user_id: 123, // Inconsistent naming
  type: 'login', // Different key name
  time: Date.now(),
});
```

### 3. Sensitive Data

Never log sensitive information:

```typescript
// Bad: Logging sensitive data
global.logger.info('User login', {
  username: 'john@example.com',
  password: 'secret123', // NEVER DO THIS
  creditCard: '4111111111111111', // NEVER DO THIS
});

// Good: Redact sensitive fields
global.logger.info('User login', {
  username: 'john@example.com',
  passwordProvided: true, // Boolean flag instead
  lastFourDigits: '1111', // Partial data only
});
```

The logger automatically redacts these fields:

- `password`
- `token`
- `apiKey`
- `secret`
- `authorization`

### 4. Performance Considerations

```typescript
// Bad: Expensive operations in log arguments
global.logger.debug('Processing data', {
  largeData: JSON.stringify(hugeObject), // Always stringified
});

// Good: Use conditional logging for expensive operations
if (global.logger.level === 'debug') {
  global.logger.debug('Processing data', {
    largeData: JSON.stringify(hugeObject),
  });
}
```

### 5. Child Loggers

Create scoped loggers for specific modules:

```typescript
import { createChildLogger } from '@wsd-ai-services-wespa/backend-common';

// Create a child logger with fixed context
const dbLogger = createChildLogger({
  module: 'database',
  version: '1.0.0',
});

// All logs from this logger include the module context
dbLogger.info('Connected to database');
// Output includes: { module: 'database', version: '1.0.0' }
```

## Migration from Console.log

### Before

```typescript
console.log('Server started on port', port);
console.error('Error:', error);
```

### After

```typescript
global.logger.info('Server started', { port });
global.logger.error('Operation failed', { error });
```

### Migration Steps

1. **Initialize logger early**: Call `initGlobalLogger()` as the first operation in your app
2. **Replace console.log**: Use `global.logger.info()`
3. **Replace console.error**: Use `global.logger.error()` or `logError()`
4. **Add context objects**: Include relevant data as structured fields
5. **Review log levels**: Ensure appropriate levels for each message

## Integration with Log Aggregators

### JSON Lines Format

The `jsonl` mode is designed for compatibility with log aggregation services:

- **AWS CloudWatch**: Direct JSON parsing support
- **ELK Stack**: Native JSON Lines ingestion
- **Datadog**: Automatic field extraction
- **Google Cloud Logging**: Structured log support
- **Splunk**: JSON event processing

### Request ID Tracking

The request logger automatically generates and includes request IDs:

```typescript
// Request headers
X-Request-Id: 550e8400-e29b-41d4-a716-446655440000

// Log entry
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "GET",
  "path": "/api/users",
  "statusCode": 200,
  "duration": "45ms"
}
```

Use request IDs to correlate logs across services and trace request flows.

## Troubleshooting

### Logger Not Available

If `global.logger` is undefined:

1. Ensure `initGlobalLogger()` is called before any logging attempts
2. Check that the initialization happens before importing modules that use logging
3. Verify the LOG_STDOUT environment variable is valid

### Missing Logs

If logs aren't appearing:

1. Check LOG_STDOUT is not set to 'off'
2. Verify the log level (debug logs only show in development)
3. Ensure stdout is not redirected elsewhere
4. Check for uncaught exceptions preventing logger initialization

### Performance Issues

If logging impacts performance:

1. Use appropriate log levels (less verbose in production)
2. Avoid logging large objects at info level
3. Use child loggers to reduce context overhead
4. Consider async transports for high-volume scenarios

## Example Implementation

### Application Startup

```typescript
// apps/api-service/src/index.ts

// Initialize logger FIRST
import { getConfig } from './config/index.js';
import {
  initGlobalLogger,
  logBoot,
  logError,
  createServer,
  requestLogger,
} from '@wsd-ai-services-wespa/backend-common';

// Initialize global logger
const config = getConfig();
initGlobalLogger(config.logStdout, 'api-service');

// Now import other modules
import apiRoutes from './api/index.js';

const startServer = async (): Promise<void> => {
  try {
    logBoot('Initializing API service...');

    const server = createServer({ port: config.port });

    // Add request logging
    server.app.use(requestLogger);

    // Mount routes
    server.app.use('/api', apiRoutes);

    // Start server
    await server.start();
    logBoot('Server ready', { port: config.port });
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
};
```

### API Endpoint

```typescript
// apps/api-service/src/api/controllers/user.controller.ts

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    global.logger.info('Creating user', {
      email: req.body.email,
    });

    const user = await userService.create(req.body);

    global.logger.info('User created successfully', {
      userId: user.id,
      duration: Date.now() - startTime,
    });

    res.json(user);
  } catch (error) {
    global.logger.error('Failed to create user', {
      error,
      body: req.body,
      duration: Date.now() - startTime,
    });

    throw error;
  }
};
```

## Summary

The centralized logging service provides:

- ✅ **High Performance**: Pino's fast serialization and streaming
- ✅ **Flexibility**: Multiple output formats for different environments
- ✅ **Observability**: Structured logging with rich context
- ✅ **Developer Experience**: Simple API with global access
- ✅ **Production Ready**: JSON Lines format for log aggregators
- ✅ **Type Safety**: Full TypeScript support with global declarations
- ✅ **Security**: Automatic redaction of sensitive fields

For questions or issues, consult the backend-common package source code or raise an issue in the repository.
