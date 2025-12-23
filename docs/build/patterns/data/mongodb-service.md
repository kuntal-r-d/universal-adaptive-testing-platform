# MongoDB Service Pattern

## Overview

This document describes the MongoDB service architecture implemented in the WESPA monorepo. The service provides a production-ready MongoDB wrapper with built-in security, connection management, and query sanitization.

## Architecture

### Global Singleton Pattern

The MongoDB service uses a global singleton pattern (`globalMongoDBClient`) for the primary application database, with factory functions for connecting to additional databases.

This design provides:

- **Consistent database interface** across all modules
- **Single connection pool** for optimal resource usage
- **Fail-fast initialization** at application startup
- **Multi-instance support** for connecting to multiple databases
- **Type safety** through TypeScript generics

### Components

```
packages/@wsd-ai-services-wespa/backend-common/
├── src/
│   ├── services/
│   │   └── mongodb.ts              # Core MongoDB service
│   └── utils/
│       └── mongo-sanitize.ts       # Query sanitization utilities
```

## Configuration

### Environment Variables

```bash
# Required: MongoDB connection URI
MONGODB_URI=mongodb://localhost:27100/wespa

# Optional: Connection pool settings
MONGODB_MAX_POOL_SIZE=50
MONGODB_MIN_POOL_SIZE=10
MONGODB_TIMEOUT_MS=5000
```

### Connection Options

The service supports comprehensive MongoDB connection options:

```typescript
interface MongoDBOptions {
  maxPoolSize?: number; // Maximum connection pool size (default: 50)
  minPoolSize?: number; // Minimum connection pool size (default: 10)
  serverSelectionTimeoutMS?: number; // Server selection timeout (default: 5000)
  connectTimeoutMS?: number; // Connection timeout (default: 10000)
  maxIdleTimeMS?: number; // Max idle time (default: 30000)
  retryWrites?: boolean; // Enable retry writes (default: true)
  retryReads?: boolean; // Enable retry reads (default: true)
  authSource?: string; // Authentication source database
}
```

## Usage Guide

### Basic Setup

#### 1. Initialize MongoDB Connection (Application Startup)

```typescript
// apps/api-service/src/index.ts

import { initGlobalMongoDB, logBoot } from '@wsd-ai-services-wespa/backend-common';

const startServer = async (): Promise<void> => {
  try {
    // Initialize MongoDB connection (fail-fast)
    await initGlobalMongoDB(
      process.env.MONGODB_URI || 'mongodb://localhost:27100/wespa',
      'wespa', // database name
      {
        maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50'),
        minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '10'),
        serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT_MS || '5000'),
      },
    );

    logBoot('MongoDB initialized successfully');

    // Continue with server initialization...
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
};
```

#### 2. Get MongoDB Client

```typescript
import { getMongoDBClient } from '@wsd-ai-services-wespa/backend-common';

// Get the global MongoDB client
const mongodb = getMongoDBClient();

// Check connection status
if (mongodb.isConnected()) {
  console.log('MongoDB is connected');
}

// Check features
const features = mongodb.getFeatures();
console.log('Transactions supported:', features?.transactions);
```

#### 3. Graceful Shutdown

```typescript
import { shutdownMongoDB } from '@wsd-ai-services-wespa/backend-common';

process.on('SIGTERM', async () => {
  await shutdownMongoDB();
  process.exit(0);
});
```

### Basic CRUD Operations

#### Insert Documents

```typescript
import { getMongoDBClient, type ObjectId } from '@wsd-ai-services-wespa/backend-common';

const mongodb = getMongoDBClient();

// Insert one document
const userId: ObjectId = await mongodb.insertOne('users', {
  email: 'john@example.com',
  name: 'John Doe',
  age: 30,
  createdAt: new Date(),
});

// Insert multiple documents
const userIds: ObjectId[] = await mongodb.insertMany('users', [
  { email: 'alice@example.com', name: 'Alice', age: 25 },
  { email: 'bob@example.com', name: 'Bob', age: 35 },
]);
```

#### Query Documents

```typescript
import { getMongoDBClient, sanitizeMongoInput } from '@wsd-ai-services-wespa/backend-common';

const mongodb = getMongoDBClient();

// Simple query (automatic sanitization)
const users = await mongodb.query('users', {
  email: sanitizeMongoInput(req.body.email),
} as never);

// Query with options
const activeUsers = await mongodb.query('users', { active: true } as never, {
  limit: 10,
  sort: { createdAt: -1 },
  sanitize: false, // Disable sanitization for trusted queries
});

// Query with timing (logs slow queries)
const results = await mongodb.query('users', { status: 'pending' } as never, {
  enableTiming: true,
  slowQueryThreshold: 100, // Warn if query takes > 100ms
});
```

#### Update Documents

```typescript
const mongodb = getMongoDBClient();

// Update one document
const modifiedCount = await mongodb.updateOne(
  'users',
  { email: 'john@example.com' },
  { $set: { lastLogin: new Date() } },
);

// Update multiple documents
const bulkModified = await mongodb.updateMany(
  'users',
  { status: 'inactive' },
  { $set: { active: false } },
);
```

#### Delete Documents

```typescript
const mongodb = getMongoDBClient();

// Delete one document
const deletedCount = await mongodb.deleteOne('users', {
  email: 'john@example.com',
});

// Delete multiple documents
const bulkDeleted = await mongodb.deleteMany('users', {
  lastLogin: { $lt: new Date('2023-01-01') },
});
```

### Type-Safe Collections

Use TypeScript interfaces for type-safe collection access:

```typescript
import { getMongoDBClient, type ObjectId } from '@wsd-ai-services-wespa/backend-common';

// Define document interface
interface User {
  _id: ObjectId;
  email: string;
  name: string;
  age: number;
  active: boolean;
  createdAt: Date;
}

const mongodb = getMongoDBClient();

// Get typed collection
const users = mongodb.collection<User>('users');

// Type-safe operations
const user = await users.findOne({ email: 'john@example.com' });
if (user) {
  console.log(user.name); // TypeScript knows 'name' exists
}

// Insert with type checking
await users.insertOne({
  email: 'jane@example.com',
  name: 'Jane Doe',
  age: 28,
  active: true,
  createdAt: new Date(),
  // TypeScript will error if required fields are missing
});
```

### Aggregation Pipelines

```typescript
const mongodb = getMongoDBClient();

// Simple aggregation
const stats = await mongodb.aggregate('users', [
  { $match: { active: true } },
  { $group: { _id: '$country', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);

// Complex aggregation with timing
interface AgeGroup {
  _id: string;
  avgAge: number;
  count: number;
}

const ageGroups = await mongodb.aggregate<AgeGroup>(
  'users',
  [
    { $match: { active: true } },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$age', 30] }, then: '18-29' },
              { case: { $lt: ['$age', 40] }, then: '30-39' },
              { case: { $lt: ['$age', 50] }, then: '40-49' },
            ],
            default: '50+',
          },
        },
        avgAge: { $avg: '$age' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ],
  {
    enableTiming: true,
    slowQueryThreshold: 200,
  },
);
```

## Query Sanitization

### Why Sanitization Matters

NoSQL injection is a serious security vulnerability that allows attackers to manipulate queries. The MongoDB service provides built-in sanitization to prevent these attacks.

### Automatic Sanitization

The `query()` method sanitizes by default:

```typescript
const mongodb = getMongoDBClient();

// User-provided input (potentially dangerous)
const userInput = { email: { $ne: null } }; // Trying to bypass authentication

// Automatic sanitization prevents injection
const results = await mongodb.query('users', userInput as never);
// Query is sanitized, $ne operator is removed
```

### Manual Sanitization

Use sanitization utilities for building queries manually:

```typescript
import {
  sanitizeMongoInput,
  sanitizeObjectId,
  sanitizeFieldName,
  sanitizeSortDirection,
  sanitizePagination,
  safeEq,
} from '@wsd-ai-services-wespa/backend-common';

// Sanitize string input (removes $, {}, etc.)
const email = sanitizeMongoInput(req.body.email);

// Sanitize and validate ObjectId
const userId = sanitizeObjectId(req.params.id);

// Sanitize field names for dynamic sorting
const sortField = sanitizeFieldName(req.query.sortBy);
const sortDirection = sanitizeSortDirection(req.query.order);

// Sanitize pagination parameters
const { skip, limit } = sanitizePagination(req.query.skip, req.query.limit);

// Build safe query
const users = await mongodb
  .collection('users')
  .find({ email: safeEq(email) })
  .sort({ [sortField]: sortDirection })
  .skip(skip)
  .limit(limit)
  .toArray();
```

### When to Disable Sanitization

Only disable sanitization for trusted, server-generated queries:

```typescript
// Trusted query from application code
const users = await mongodb.query(
  'users',
  {
    $or: [{ status: 'active' }, { status: 'pending' }],
  } as never,
  { sanitize: false }, // Safe because query is not user-provided
);
```

## Multi-Database Connections

### Connecting to Additional Databases

```typescript
import { createMongoDBClient } from '@wsd-ai-services-wespa/backend-common';

// Connect to analytics database
const analyticsDB = await createMongoDBClient(
  process.env.ANALYTICS_DB_URI || 'mongodb://localhost:27100',
  'analytics',
);

// Use the additional database
const events = await analyticsDB.query('events', {
  timestamp: { $gte: startDate },
} as never);

// Remember to disconnect when done
await analyticsDB.disconnect();
```

### Managing Multiple Connections

```typescript
// Global singleton for main application database
const mainDB = getMongoDBClient();

// Additional database connections
const analyticsDB = await createMongoDBClient(uri, 'analytics');
const logsDB = await createMongoDBClient(uri, 'logs');

// Use all databases concurrently
const [users, events, logs] = await Promise.all([
  mainDB.query('users', { active: true } as never),
  analyticsDB.query('events', { type: 'click' } as never),
  logsDB.query('errors', { level: 'error' } as never),
]);

// Cleanup
await Promise.all([analyticsDB.disconnect(), logsDB.disconnect()]);
```

## Error Handling

### Automatic Error Conversion

The MongoDB service automatically converts MongoDB errors to AppError types:

```typescript
import { ConflictError, convert } from '@wsd-ai-services-wespa/backend-common';

try {
  await mongodb.insertOne('users', {
    email: 'existing@example.com', // Duplicate unique key
    name: 'Test',
  });
} catch (error) {
  // MongoDB E11000 error is automatically converted to ConflictError (409)
  if (error instanceof ConflictError) {
    res.status(409).json({ error: 'Email already exists' });
  }
}
```

### Error Handling in Services

```typescript
import { getMongoDBClient, convert, NotFoundError } from '@wsd-ai-services-wespa/backend-common';

export const getUserById = async (id: string) => {
  try {
    const mongodb = getMongoDBClient();
    const userId = sanitizeObjectId(id);

    const user = await mongodb.collection('users').findOne({ _id: userId });

    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }

    return user;
  } catch (error) {
    throw convert(error, 'Get user by ID');
  }
};
```

## Best Practices

### 1. Initialize Early

Always initialize MongoDB before any other services that might depend on it:

```typescript
// ✅ GOOD: Initialize early in startup sequence
await initGlobalMongoDB(uri, dbName);
await initGlobalCache(redisUrl);
await startWebServer();

// ❌ BAD: Don't use MongoDB before initialization
const mongodb = getMongoDBClient(); // Throws error if not initialized
await initGlobalMongoDB(uri, dbName);
```

### 2. Use Type-Safe Collections

Define interfaces for your documents:

```typescript
// ✅ GOOD: Type-safe collection access
interface Product {
  _id: ObjectId;
  name: string;
  price: number;
  inStock: boolean;
}

const products = mongodb.collection<Product>('products');
const product = await products.findOne({ _id: productId });
console.log(product?.price); // TypeScript knows 'price' exists

// ❌ BAD: Untyped collections lose type safety
const products = mongodb.collection('products');
const product = await products.findOne({ _id: productId });
console.log(product?.price); // No type checking
```

### 3. Sanitize User Input

Always sanitize user-provided data:

```typescript
// ✅ GOOD: Sanitized user input
const email = sanitizeMongoInput(req.body.email);
const users = await mongodb.query('users', { email: safeEq(email) } as never);

// ❌ BAD: Unsanitized user input (vulnerable to injection)
const users = await mongodb.query('users', { email: req.body.email } as never);
```

### 4. Handle Errors Properly

Use `convert()` in catch blocks:

```typescript
// ✅ GOOD: Proper error handling
try {
  await mongodb.insertOne('users', userData);
} catch (error) {
  throw convert(error, 'Create user');
}

// ❌ BAD: Re-throwing raw errors
try {
  await mongodb.insertOne('users', userData);
} catch (error) {
  throw error; // Missing convert()
}
```

### 5. Use Connection Pooling

The MongoDB driver handles connection pooling automatically. Reuse the same client:

```typescript
// ✅ GOOD: Reuse global client
const mongodb = getMongoDBClient();
await mongodb.query('users', {});
await mongodb.query('products', {});

// ❌ BAD: Creating new connections repeatedly
await initGlobalMongoDB(uri, dbName); // Don't re-initialize
await initGlobalMongoDB(uri, dbName); // This is wasteful
```

### 6. Monitor Slow Queries

Enable timing for performance-critical operations:

```typescript
// ✅ GOOD: Monitor query performance
const results = await mongodb.query('large_collection', { status: 'active' } as never, {
  enableTiming: true,
  slowQueryThreshold: 100, // Warn if > 100ms
});

// Review logs for slow query warnings
// [WARN] Slow query detected { collection: 'large_collection', duration: 250ms }
```

### 7. Graceful Shutdown

Always close connections during shutdown:

```typescript
// ✅ GOOD: Graceful shutdown
process.on('SIGTERM', async () => {
  await shutdownMongoDB();
  await shutdownCache();
  process.exit(0);
});

// ❌ BAD: Abrupt shutdown
process.on('SIGTERM', () => {
  process.exit(0); // MongoDB connections not closed
});
```

## Anti-Patterns

### ❌ Don't Use $where Clauses

```typescript
// ❌ NEVER DO THIS: $where clauses execute JavaScript on the server
await mongodb.collection('users').find({
  $where: 'this.age > 18',
});

// ✅ USE THIS INSTEAD: Standard query operators
await mongodb.collection('users').find({
  age: { $gt: 18 },
});
```

### ❌ Don't Bypass Sanitization with User Input

```typescript
// ❌ NEVER DO THIS: Disabling sanitization with user input
const userQuery = req.body.query; // User-controlled object
const results = await mongodb.query('users', userQuery, { sanitize: false });

// ✅ USE THIS INSTEAD: Sanitize user input
const email = sanitizeMongoInput(req.body.email);
const results = await mongodb.query('users', { email: safeEq(email) } as never);
```

### ❌ Don't Create Multiple Global Instances

```typescript
// ❌ NEVER DO THIS: Re-initializing the global singleton
await initGlobalMongoDB(uri1, 'db1');
await initGlobalMongoDB(uri2, 'db2'); // This is ignored with a warning

// ✅ USE THIS INSTEAD: Use factory for additional databases
await initGlobalMongoDB(uri1, 'db1'); // Global singleton
const db2 = await createMongoDBClient(uri2, 'db2'); // Additional instance
```

### ❌ Don't Ignore Connection Errors

```typescript
// ❌ NEVER DO THIS: Silently catching initialization errors
try {
  await initGlobalMongoDB(uri, dbName);
} catch (error) {
  console.log('MongoDB failed, continuing anyway...');
  // Application will crash later when trying to use MongoDB
}

// ✅ USE THIS INSTEAD: Fail-fast on connection errors
try {
  await initGlobalMongoDB(uri, dbName);
} catch (error) {
  logError('Failed to initialize MongoDB', error);
  process.exit(1); // Don't start if database is unavailable
}
```

## Testing Patterns

### Unit Tests (with Mock MongoDB)

```typescript
import { MongoDBClient } from '@wsd-ai-services-wespa/backend-common';

// Create mock MongoDB client
class MockMongoClient {
  async connect() {
    /* mock implementation */
  }
  db(name: string) {
    /* return mock DB */
  }
}

describe('User Service', () => {
  it('should create user', async () => {
    // Inject mock via factory function
    const client = new MongoDBClient(
      'mongodb://localhost:27100',
      'test',
      {},
      () => new MockMongoClient() as never,
    );

    await client.connect();
    const userId = await client.insertOne('users', { email: 'test@example.com' });

    assert.ok(userId);
  });
});
```

### Integration Tests (with Real MongoDB)

```typescript
import {
  initGlobalMongoDB,
  getMongoDBClient,
  shutdownMongoDB,
} from '@wsd-ai-services-wespa/backend-common';

describe('MongoDB Integration', () => {
  before(async () => {
    await initGlobalMongoDB('mongodb://localhost:27100', 'wespa-test');
  });

  after(async () => {
    await shutdownMongoDB();
  });

  beforeEach(async () => {
    // Clear test collection
    const mongodb = getMongoDBClient();
    await mongodb.collection('test_users').deleteMany({});
  });

  it('should complete full CRUD flow', async () => {
    const mongodb = getMongoDBClient();

    // Create
    const id = await mongodb.insertOne('test_users', { name: 'John' });

    // Read
    const users = await mongodb.query('test_users', { _id: id } as never);
    assert.equal(users.length, 1);

    // Update
    await mongodb.updateOne('test_users', { _id: id }, { $set: { name: 'Jane' } });

    // Delete
    await mongodb.deleteOne('test_users', { _id: id });
  });
});
```

## Troubleshooting

### Connection Timeout

If MongoDB connection times out:

1. Verify MongoDB is running: `docker ps | grep mongo`
2. Check connection string in `.env`
3. Increase timeout: `MONGODB_TIMEOUT_MS=10000`
4. Check network connectivity

### Duplicate Key Errors

```typescript
// Error: E11000 duplicate key error
// Solution: Handle ConflictError

try {
  await mongodb.insertOne('users', { email: 'existing@example.com' });
} catch (error) {
  if (error instanceof ConflictError) {
    // Handle duplicate gracefully
    return { error: 'Email already exists' };
  }
  throw error;
}
```

### Memory Leaks

If you see memory leaks:

1. Ensure connections are properly closed
2. Check connection pool settings
3. Avoid creating multiple client instances
4. Use global singleton for main database

## Migration from Direct MongoDB Usage

### Before (Direct MongoDB Driver)

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27100');
await client.connect();

const db = client.db('wespa');
const users = await db.collection('users').find({ active: true }).toArray();

await client.close();
```

### After (MongoDB Service)

```typescript
import { getMongoDBClient } from '@wsd-ai-services-wespa/backend-common';

// Initialize once at startup
await initGlobalMongoDB('mongodb://localhost:27100', 'wespa');

// Use throughout application
const mongodb = getMongoDBClient();
const users = await mongodb.query('users', { active: true } as never, { sanitize: false });

// Shutdown at application exit
await shutdownMongoDB();
```

## Summary

The MongoDB service provides:

- ✅ **Security**: Built-in NoSQL injection prevention
- ✅ **Performance**: Connection pooling and query timing
- ✅ **Type Safety**: Full TypeScript support with generics
- ✅ **Error Handling**: Automatic conversion to AppError types
- ✅ **Multi-Instance**: Support for multiple database connections
- ✅ **Observability**: Structured logging with query metrics
- ✅ **Testing**: Dependency injection for unit tests
- ✅ **Production Ready**: Fail-fast initialization and graceful shutdown

For questions or issues, consult the backend-common package source code or raise an issue in the repository.
