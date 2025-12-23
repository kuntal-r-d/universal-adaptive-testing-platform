# PostgreSQL Service Pattern

## Overview

This document describes the PostgreSQL service architecture implemented in the WESPA monorepo. The service provides a production-ready PostgreSQL wrapper with built-in security, connection pooling, transaction support, and error handling.

**Note**: This service is primarily designed for integration testing with remote PostgreSQL databases. SQL sanitization is currently stubbed pending advanced implementation.

## Architecture

### Global Singleton Pattern

The PostgreSQL service uses a global singleton pattern (`globalPostgresClient`) for the primary application database, with factory functions for connecting to additional databases.

This design provides:

- **Consistent database interface** across all modules
- **Connection pooling** for optimal resource usage (via pg.Pool)
- **Fail-fast initialization** at application startup
- **Multi-instance support** for connecting to multiple databases
- **Type safety** through TypeScript generics
- **Native transaction support** with automatic commit/rollback

### Components

```
packages/@wsd-ai-services-wespa/backend-common/
├── src/
│   ├── services/
│   │   └── postgres.ts              # Core PostgreSQL service
│   └── utils/
│       └── postgres-sanitize.ts     # SQL sanitization utilities (stub)
```

## Configuration

### Connection String Format

```bash
postgresql://[user[:password]@][host][:port][/database]
```

### CI/CD Configuration (docker-compose.ci.yml)

For integration testing, PostgreSQL is available in the CI cluster:

```yaml
postgres:
  image: postgres:16-alpine
  container_name: wespa-postgres-ci
  ports:
    - '5500:5432'
  environment:
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=testpass
    - POSTGRES_DB=wespa-test
```

**Test Connection String**: `postgresql://postgres:testpass@localhost:5500/wespa-test`

### Connection Options

The service supports comprehensive PostgreSQL connection options:

```typescript
interface PostgresOptions {
  max?: number; // Maximum connection pool size (default: 20)
  min?: number; // Minimum connection pool size (default: 5)
  connectionTimeoutMillis?: number; // Connection timeout (default: 5000)
  idleTimeoutMillis?: number; // Idle timeout (default: 30000)
  statementTimeout?: number; // Statement timeout (default: 30000)
  ssl?: boolean | object; // SSL configuration
  applicationName?: string; // Application name for tracking (default: 'wespa')
}
```

## Usage Guide

### Basic Setup

#### 1. Initialize PostgreSQL Connection (Application Startup)

```typescript
// apps/api-service/src/index.ts

import { initGlobalPostgres, logBoot } from '@wsd-ai-services-wespa/backend-common';

const startServer = async (): Promise<void> => {
  try {
    // Initialize PostgreSQL connection (fail-fast)
    await initGlobalPostgres(
      process.env.POSTGRES_URI || 'postgresql://postgres:password@localhost:5432/mydb',
      {
        max: 20,
        min: 5,
        connectionTimeoutMillis: 5000,
        statementTimeout: 30000,
      },
    );

    logBoot('PostgreSQL initialized successfully');

    // Continue with server initialization...
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
};
```

#### 2. Get PostgreSQL Client

```typescript
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';

// Get the global PostgreSQL client
const postgres = getPostgresClient();

// Check connection status
if (postgres.isConnected()) {
  console.log('PostgreSQL is connected');
}

// Check features
const features = postgres.getFeatures();
console.log('PostgreSQL version:', features?.version);
console.log('Installed extensions:', features?.extensions);
```

#### 3. Graceful Shutdown

```typescript
import { shutdownPostgres } from '@wsd-ai-services-wespa/backend-common';

process.on('SIGTERM', async () => {
  await shutdownPostgres();
  process.exit(0);
});
```

### Basic CRUD Operations

#### Insert Rows

```typescript
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';

const postgres = getPostgresClient();

// Insert one row (returns generated ID)
const userId: number = await postgres.insert('users', {
  email: 'john@example.com',
  name: 'John Doe',
  age: 30,
  active: true,
});

// Insert with raw SQL (for more control)
const result = await postgres.query<{ id: number }>(
  `INSERT INTO users (email, name, age, active) VALUES ($1, $2, $3, $4) RETURNING id`,
  ['alice@example.com', 'Alice', 25, true],
);
const aliceId = result[0].id;
```

#### Query Rows

```typescript
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';

const postgres = getPostgresClient();

// Simple parameterized query (safe by default)
const users = await postgres.query<User>(`SELECT * FROM users WHERE email = $1`, [
  'john@example.com',
]);

// Query with multiple parameters
const activeUsers = await postgres.query<User>(
  `SELECT * FROM users WHERE active = $1 ORDER BY created_at DESC LIMIT $2`,
  [true, 10],
);

// Query single row
const user = await postgres.queryOne<User>(`SELECT * FROM users WHERE id = $1`, [userId]);

if (user) {
  console.log('Found user:', user.name);
} else {
  console.log('User not found');
}

// Query with timing (logs slow queries)
const results = await postgres.query<User>(`SELECT * FROM users WHERE status = $1`, ['pending'], {
  enableTiming: true,
  slowQueryThreshold: 100, // Warn if query takes > 100ms
});
```

#### Update Rows

```typescript
const postgres = getPostgresClient();

// Update with helper method
const updateCount = await postgres.update(
  'users',
  { last_login: new Date() }, // SET clause
  { email: 'john@example.com' }, // WHERE clause
);

// Update with raw SQL (more flexible)
const result = await postgres.query(
  `UPDATE users SET last_login = $1, login_count = login_count + 1 WHERE email = $2`,
  [new Date(), 'john@example.com'],
);
```

#### Delete Rows

```typescript
const postgres = getPostgresClient();

// Delete with helper method
const deleteCount = await postgres.delete('users', {
  email: 'john@example.com',
});

// Delete with raw SQL
await postgres.query(`DELETE FROM users WHERE last_login < $1`, [new Date('2023-01-01')]);
```

### Type-Safe Queries

Use TypeScript interfaces for type-safe query results:

```typescript
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';

// Define row interface
interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  active: boolean;
  created_at: Date;
}

const postgres = getPostgresClient();

// Type-safe query
const users = await postgres.query<User>(`SELECT * FROM users WHERE email = $1`, [
  'john@example.com',
]);

// TypeScript knows the shape of the results
users.forEach((user) => {
  console.log(user.name); // TypeScript knows 'name' exists
  console.log(user.age); // TypeScript knows 'age' is a number
});

// Type-safe single row
const user = await postgres.queryOne<User>(`SELECT * FROM users WHERE id = $1`, [123]);

if (user) {
  console.log(user.email); // Type-safe access
}
```

### Transaction Support

PostgreSQL transactions provide atomic operations with automatic commit/rollback:

#### Basic Transaction

```typescript
const postgres = getPostgresClient();

await postgres.transaction(async (client) => {
  // All queries within this callback are part of the transaction
  await client.query(`INSERT INTO accounts (name, balance) VALUES ($1, $2)`, ['Alice', 1000]);

  await client.query(`UPDATE accounts SET balance = balance - 100 WHERE name = $1`, ['Alice']);

  await client.query(`INSERT INTO transactions (account, amount, type) VALUES ($1, $2, $3)`, [
    'Alice',
    -100,
    'withdrawal',
  ]);

  // Automatically commits if no error
  // Automatically rolls back if any error occurs
});
```

#### Transaction with Return Value

```typescript
const postgres = getPostgresClient();

const newUserId = await postgres.transaction(async (client) => {
  // Insert user
  const userResult = await client.query<{ id: number }>(
    `INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id`,
    ['bob@example.com', 'Bob'],
  );

  const userId = userResult.rows[0].id;

  // Create profile
  await client.query(`INSERT INTO profiles (user_id, bio) VALUES ($1, $2)`, [
    userId,
    'New user bio',
  ]);

  // Return the user ID
  return userId;
});

console.log('Created user with ID:', newUserId);
```

#### Transaction Error Handling

```typescript
const postgres = getPostgresClient();

try {
  await postgres.transaction(async (client) => {
    await client.query(`INSERT INTO orders (user_id, total) VALUES ($1, $2)`, [userId, 100]);

    // This will fail if user doesn't have enough balance
    await client.query(`UPDATE users SET balance = balance - $1 WHERE id = $2 AND balance >= $1`, [
      100,
      userId,
    ]);

    // If any query fails, the entire transaction is rolled back
  });

  console.log('Transaction completed successfully');
} catch (error) {
  console.error('Transaction failed and was rolled back:', error);
}
```

### Advanced Queries

#### Joins

```typescript
const orders = await postgres.query<OrderWithUser>(
  `
  SELECT o.id, o.total, o.status, u.name as user_name, u.email
  FROM orders o
  INNER JOIN users u ON o.user_id = u.id
  WHERE o.status = $1
  ORDER BY o.created_at DESC
  `,
  ['pending'],
);
```

#### Aggregations

```typescript
// Count users by status
const stats = await postgres.query<{ active: boolean; count: string }>(
  `SELECT active, COUNT(*) as count FROM users GROUP BY active`,
);

// Calculate averages
const avgAge = await postgres.queryOne<{ avg_age: number }>(
  `SELECT AVG(age) as avg_age FROM users WHERE active = $1`,
  [true],
);
```

#### Subqueries

```typescript
const usersWithRecentOrders = await postgres.query<User>(
  `
  SELECT u.*
  FROM users u
  WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.user_id = u.id AND o.created_at > $1
  )
  `,
  [thirtyDaysAgo],
);
```

### Multi-Instance Support

Connect to multiple PostgreSQL databases simultaneously:

```typescript
import { createPostgresClient } from '@wsd-ai-services-wespa/backend-common';

// Connect to analytics database
const analyticsDB = await createPostgresClient(
  'postgresql://user:pass@analytics-host:5432/analytics',
  {
    max: 10,
    applicationName: 'wespa-analytics',
  },
);

// Connect to logging database
const loggingDB = await createPostgresClient('postgresql://user:pass@logs-host:5432/logs', {
  max: 5,
  applicationName: 'wespa-logging',
});

// Use different connections
const analyticsData = await analyticsDB.query(`SELECT * FROM events WHERE date = $1`, [today]);

const recentLogs = await loggingDB.query(`SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100`);

// Clean up when done
await analyticsDB.disconnect();
await loggingDB.disconnect();
```

## Error Handling

### Automatic Error Conversion

The service automatically converts PostgreSQL errors to appropriate AppError types:

```typescript
try {
  await postgres.insert('users', {
    email: 'duplicate@example.com',
    name: 'Test User',
  });
} catch (error) {
  if (error instanceof ConflictError) {
    // Unique constraint violation (23505)
    console.log('Email already exists');
  }
}
```

### PostgreSQL Error Code Mapping

| PostgreSQL Error Code | AppError Type   | HTTP Status | Description                 |
| --------------------- | --------------- | ----------- | --------------------------- |
| 23505                 | ConflictError   | 409         | Unique constraint violation |
| 23503                 | ValidationError | 400         | Foreign key violation       |
| 23502                 | ValidationError | 400         | Not-null constraint         |
| 23514                 | ValidationError | 400         | Check constraint violation  |
| 57014                 | AppError        | 504         | Query timeout               |
| 08000, 08003, 08006   | AppError        | 503         | Connection errors           |
| Others                | AppError        | 500         | Internal server error       |

### Error Handling Examples

```typescript
const postgres = getPostgresClient();

try {
  // Unique constraint violation
  await postgres.insert('users', { email: 'existing@example.com' });
} catch (error) {
  if (error instanceof ConflictError) {
    return res.status(409).json({ error: 'Email already in use' });
  }
  throw error;
}

try {
  // Foreign key violation
  await postgres.insert('orders', { user_id: 99999 });
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  throw error;
}

try {
  // Not-null constraint violation
  await postgres.query(`INSERT INTO users (email, age) VALUES ($1, $2)`, [
    'user@example.com',
    null,
  ]);
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: 'Required field missing' });
  }
  throw error;
}
```

## SQL Safety

### Parameterized Queries (Recommended)

**Always use parameterized queries** with `$1, $2, ...` placeholders to prevent SQL injection:

```typescript
// ✅ SAFE: Parameterized query
const users = await postgres.query(`SELECT * FROM users WHERE email = $1`, [userEmail]);

// ❌ UNSAFE: String concatenation
const users = await postgres.query(`SELECT * FROM users WHERE email = '${userEmail}'`);
```

### SQL Sanitization (Stub)

The `postgres-sanitize.ts` utilities are currently stubs pending advanced implementation:

```typescript
import {
  sanitizeIdentifier,
  sanitizeQuery,
  buildParameterizedQuery,
} from '@wsd-ai-services-wespa/backend-common';

// These functions are stubs - rely on parameterized queries for now
const safeTableName = sanitizeIdentifier(tableName); // Currently returns unchanged
const safeQuery = sanitizeQuery(query); // Currently returns unchanged
```

**Best Practice**: Use parameterized queries exclusively until advanced SQL sanitization is implemented.

## Best Practices

### DO:

- ✅ Use parameterized queries (`$1, $2, ...`) for all user input
- ✅ Use transactions for multi-step operations
- ✅ Use type-safe interfaces for query results
- ✅ Enable query timing in development to identify slow queries
- ✅ Use connection pooling (handled automatically by the service)
- ✅ Handle errors with specific AppError types
- ✅ Close connections gracefully on application shutdown
- ✅ Use `queryOne()` when expecting a single row

### DON'T:

- ❌ Don't concatenate user input into SQL strings
- ❌ Don't forget to handle transaction errors
- ❌ Don't use `SELECT *` in production code (specify columns)
- ❌ Don't create new connections for every query (use the global client)
- ❌ Don't ignore connection errors during startup
- ❌ Don't use raw SQL for table/column names from user input
- ❌ Don't forget to use `RETURNING` clause when you need inserted IDs

### Performance Tips

1. **Use indexes**: Ensure proper database indexes on frequently queried columns
2. **Limit result sets**: Use `LIMIT` clauses to avoid large result sets
3. **Monitor slow queries**: Enable timing in development to identify bottlenecks
4. **Use connection pooling**: The service handles this automatically
5. **Batch operations**: Use transactions for multiple related operations

## Testing

### Unit Tests

Unit tests use mocked PostgreSQL Pool for fast, isolated testing:

```typescript
// Located in: test/unit/services/postgres.test.ts
// Run with: pnpm --filter @wsd-ai-services-wespa/backend-common test:unit
```

### Integration Tests

Integration tests use real PostgreSQL (CI container):

```typescript
// Located in: test/integration/postgres.integration.test.ts
// Run with: pnpm --filter @wsd-ai-services-wespa/backend-common test:integration
```

**Prerequisites**:

- PostgreSQL running on `localhost:5500`
- Database: `wespa-test`
- Credentials: `postgres:testpass`

Start the CI cluster:

```bash
docker-compose -f docker-compose.ci.yml up postgres
```

## Troubleshooting

### Connection Issues

```typescript
// Check connection status
const postgres = getPostgresClient();
console.log('Connected:', postgres.isConnected());

// Test with ping
const pingResult = await postgres.ping();
console.log('Ping successful:', pingResult);

// Check features
const features = postgres.getFeatures();
console.log('PostgreSQL version:', features?.version);
```

### Query Debugging

```typescript
// Enable query timing
const results = await postgres.query(`SELECT * FROM users`, [], {
  enableTiming: true,
  slowQueryThreshold: 50, // Log queries > 50ms
});

// Check query result
console.log('Row count:', results.length);
```

### Pool Configuration

```typescript
// Adjust pool size for high-traffic applications
await initGlobalPostgres(connectionString, {
  max: 50, // Increase max connections
  min: 10, // Increase min connections
  idleTimeoutMillis: 60000, // Keep connections alive longer
});
```

## Migration from Other Database Services

### From MongoDB to PostgreSQL

Key differences when migrating from MongoDB:

| MongoDB                       | PostgreSQL                                       |
| ----------------------------- | ------------------------------------------------ |
| `insertOne(collection, doc)`  | `insert(table, data)` or parameterized INSERT    |
| `query(collection, filter)`   | `query(sql, params)` with WHERE clause           |
| `aggregate(collection, pipe)` | Standard SQL queries with JOINs, GROUP BY        |
| `updateOne(collection, ...)`  | `update(table, data, where)` or UPDATE statement |
| `deleteOne(collection, ...)`  | `delete(table, where)` or DELETE statement       |
| ObjectId                      | SERIAL, BIGSERIAL, or UUID                       |
| No schema                     | Table schema with defined columns                |

## Additional Resources

- **Pattern Documentation**: `docs/patterns/`
- **Unit Tests**: `test/unit/services/postgres.test.ts`
- **Integration Tests**: `test/integration/postgres.integration.test.ts`
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **node-postgres (pg) Documentation**: https://node-postgres.com/
