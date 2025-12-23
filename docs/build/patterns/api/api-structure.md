# API Structure Pattern

## Overview

The WESPA API service follows a clear separation of concerns with controllers handling business logic and routes defining the HTTP endpoints.

## Directory Structure

```
apps/api-service/src/
├── api/
│   ├── controllers/       # Business logic
│   │   └── *.controller.ts
│   ├── routes/            # Route definitions
│   │   └── *.ts
│   └── index.ts          # API routes aggregator
├── config/
│   ├── index.ts          # App configuration
│   └── swagger.ts        # API documentation config
└── index.ts              # Application entry point
```

## Controller Pattern

Controllers contain the business logic for handling requests. They are pure functions that receive Express Request and Response objects.

**Location**: `src/api/controllers/*.controller.ts`

### Example: Health Controller

```typescript
import { type Request, type Response } from 'express';
import { getAppVersion } from '@wsd-ai-services-wespa/backend-common';

export const ping = (_req: Request, res: Response): void => {
  const versionInfo = getAppVersion();

  res.json({
    message: 'pong',
    version: versionInfo.version,
    build: versionInfo.git.commitShort,
  });
};

export const healthCheck = (_req: Request, res: Response): void => {
  const versionInfo = getAppVersion();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: versionInfo,
  });
};
```

### Controller Best Practices

1. **Export named functions** - Don't use default exports for controllers
2. **Use explicit types** - Always type Request and Response
3. **Keep logic pure** - Controllers should be testable without Express
4. **Return typed responses** - Use consistent response structures
5. **Handle errors** - Let errors bubble up to be caught by error middleware

## Route Pattern

Routes define HTTP endpoints and connect them to controller functions. They also include Swagger documentation.

**Location**: `src/api/routes/*.ts`

### Example: Health Routes

```typescript
import { Router, type Router as RouterType } from 'express';
import * as healthController from '../controllers/health.controller.js';

const router: RouterType = Router();

/**
 * @swagger
 * /api/health/ping:
 *   get:
 *     summary: Ping endpoint
 *     description: Returns a simple pong response with version and build info
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/ping', healthController.ping);

export default router;
```

### Route Best Practices

1. **Import controller as namespace** - `import * as controller from './controller.js'`
2. **Add Swagger docs** - Document all endpoints with `@swagger` comments
3. **Group related routes** - One route file per resource/feature
4. **Use explicit Router type** - `const router: RouterType = Router()`
5. **Export as default** - `export default router`

## URL Structure

### No API Versioning

The API does **not** use versioning in URLs. We serve only the latest API version.

**Correct**:

```
GET /api/health/ping
GET /api/health
GET /api/users
```

**Incorrect** (don't do this):

```
GET /api/v1/health/ping  ❌
GET /api/v2/users        ❌
```

### Rationale

- Simpler URL structure
- Easier to maintain single codebase
- Breaking changes handled through feature flags or separate services
- Clients always get latest functionality

## Mounting Routes

Routes are mounted in the main application entry point:

```typescript
import apiRoutes from './api/index.js';

server.app.use('/api', apiRoutes);
```

The API aggregator (`src/api/index.ts`) combines all route modules:

```typescript
import { Router, type Router as RouterType } from 'express';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/users.js';

const router: RouterType = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);

export default router;
```

## API Documentation (Swagger)

### Development Only

Swagger UI is enabled **only in development** (NODE_ENV=development):

```
http://localhost:4500/dev/docs/api
```

### Configuration

Swagger is configured in `src/config/swagger.ts`:

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const createSwaggerOptions = (config: AppConfig): swaggerJsdoc.Options => ({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WESPA API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: config.host, // Dynamically set based on config
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/routes/*.ts'], // Scan routes for @swagger comments
});
```

### Adding Documentation

Use JSDoc-style `@swagger` comments above route definitions:

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', userController.list);
```

## Error Handling

All errors are automatically handled by the web server's error middleware.

**Error Response Format**:

```json
{
  "message": "Route not found",
  "statusCode": 404
}
```

**With validation details**:

```json
{
  "message": "Validation failed",
  "statusCode": 400,
  "details": {
    "email": "Invalid email format"
  }
}
```

See [Exception Handling](exception-handling.md) for complete error handling documentation.

## Environment Configuration

Configuration is centralized in `src/config/index.ts`:

```typescript
export interface AppConfig {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  host: string;
}

export const getConfig = (): AppConfig => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4500;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isDevelopment = nodeEnv === 'development';
  const host = `http://localhost:${port}`;

  return { port, nodeEnv, isDevelopment, host };
};
```

## Adding New Endpoints

### Step-by-Step Guide

1. **Create Controller**

```typescript
// src/api/controllers/users.controller.ts
import { type Request, type Response } from 'express';

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  // Business logic here
  const users = await fetchUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await fetchUserById(id);
  res.json(user);
};
```

2. **Create Routes**

```typescript
// src/api/routes/users.ts
import { Router, type Router as RouterType } from 'express';
import * as usersController from '../controllers/users.controller.js';

const router: RouterType = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 */
router.get('/', usersController.listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get('/:id', usersController.getUser);

export default router;
```

3. **Mount in API Aggregator**

```typescript
// src/api/index.ts
import usersRoutes from './routes/users.js';

router.use('/users', usersRoutes);
```

4. **Test Endpoints**

```bash
curl http://localhost:4500/api/users
curl http://localhost:4500/api/users/123
```

5. **View in Swagger**

Navigate to `http://localhost:4500/dev/docs/api` to see documentation.

## Summary

- ✅ Controllers contain business logic
- ✅ Routes define HTTP endpoints
- ✅ No API versioning in URLs
- ✅ Swagger docs in development only at `/dev/docs/api`
- ✅ Dynamic host configuration
- ✅ Centralized error handling
- ✅ Clear separation of concerns
