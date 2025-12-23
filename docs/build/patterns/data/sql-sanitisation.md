# SQL Sanitization Pattern

## Overview

The SQL sanitization module (`@wsd-ai-services-wespa/backend-text-to-data/sql-sanitizer`) provides a **Defense-in-Depth** security system for validating and sanitizing user-provided SQL queries. It ensures only safe SELECT queries are executed against the database.

**Key Features**:

- 4-layer security validation (pre-validation, parser, AST, semantic)
- SQL injection protection with multiple detection mechanisms
- Table and schema whitelist enforcement
- Function whitelist/blacklist validation
- Query complexity limits and timeout management
- Index usage validation for performance
- LIMIT enforcement to prevent data exfiltration
- Support for CTEs, JOINs, subqueries, UNION/UNION ALL, and window functions

**Documentation**:

- **This Document**: High-level patterns, API integration, and usage examples
- **Module README**: `packages/@wsd-ai-services-wespa/backend-text-to-data/src/sql-sanitizer/README.md` - Detailed implementation, architecture, troubleshooting
- **Tests**: `packages/@wsd-ai-services-wespa/backend-text-to-data/test/unit/sql-sanitizer/` - 564 comprehensive test cases

## Core Principle

**Never execute user-provided SQL without sanitization.**

All user-provided SQL MUST be validated through the SQL sanitizer before execution. This prevents SQL injection, data modification, and unauthorized access.

## Quick Start

### Basic Usage

```typescript
import { doSqlSanitise } from '@wsd-ai-services-wespa/backend-text-to-data';

// Simple validation
const sql = 'SELECT * FROM spi_data WHERE id = 1';
const result = await doSqlSanitise(sql);

if (result.safe) {
  // Safe to execute result.sql
  const data = await db.query(result.sql);
} else {
  // Handle unsafe query
  console.error('Unsafe query:', result.reasons);
}
```

### Enhanced Usage with Metadata

```typescript
import { doSqlSanitiseEnhanced } from '@wsd-ai-services-wespa/backend-text-to-data';

const sql = 'SELECT name, email FROM users WHERE active = true';
const result = await doSqlSanitiseEnhanced(sql);

if (result.safe) {
  console.log(`Query complexity: ${result.metadata.complexity}`);
  console.log(`Estimated cost: ${result.metadata.estimatedCost}`);
  await db.query(result.sql);
} else {
  console.error('Validation failed:', result.reasons);
  throw new ValidationError('Invalid SQL query');
}
```

## Simplified API via backend-common

**NEW**: For convenience, `backend-common` provides simplified wrapper functions that handle errors automatically and throw `ValidationError` on failure.

### Using sanitizeQuery()

```typescript
import { sanitizeQuery } from '@wsd-ai-services-wespa/backend-common';

// Throws ValidationError if unsafe
const safeSql = await sanitizeQuery('SELECT * FROM products WHERE id = 1');
await db.query(safeSql);
```

This is equivalent to:

```typescript
import { doSqlSanitise } from '@wsd-ai-services-wespa/backend-text-to-data';

const result = await doSqlSanitise('SELECT * FROM products WHERE id = 1');
if (result === null) {
  throw new ValidationError('SQL query failed security validation');
}
await db.query(result);
```

### Using sanitizeIdentifier()

Validate SQL identifiers (table names, column names) to prevent injection through dynamic SQL:

```typescript
import { sanitizeIdentifier } from '@wsd-ai-services-wespa/backend-common';

// Safe: alphanumeric, underscore, dots only
const tableName = sanitizeIdentifier('users'); // ✅ 'users'
const qualified = sanitizeIdentifier('public.users'); // ✅ 'public.users'

// Throws ValidationError
const bad = sanitizeIdentifier('users; DROP TABLE'); // ❌ Error
```

### Using validateIdentifier()

Check identifiers against a whitelist:

```typescript
import { validateIdentifier } from '@wsd-ai-services-wespa/backend-common';

// Returns boolean
const isValid = validateIdentifier('users', ['users', 'products', 'orders']); // true
const isInvalid = validateIdentifier('admin_users', ['users', 'products']); // false

// Without whitelist (format validation only)
const formatValid = validateIdentifier('my_table'); // true
const formatInvalid = validateIdentifier('table; DROP'); // false
```

### Using buildParameterizedQuery()

Validate parameterized queries for PostgreSQL:

```typescript
import { buildParameterizedQuery } from '@wsd-ai-services-wespa/backend-common';

// Validates parameter count and placeholder sequence
const query = buildParameterizedQuery('SELECT * FROM users WHERE id = $1 AND active = $2', [
  123,
  true,
]);
// Returns: { text: '...', values: [123, true] }

// Throws ValidationError on mismatch
buildParameterizedQuery(
  'SELECT * FROM users WHERE id = $1',
  [123, true], // Error: 2 params but only 1 placeholder
);
```

## Architecture: Four-Layer Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    User SQL Query Input                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Pre-Validation (Regex Pattern Matching)           │
│  • Blocks: DCL (GRANT/REVOKE), system admin operations      │
│  • Blocks: Dangerous functions (pg_read_file, etc.)         │
│  • Fast rejection of obviously dangerous SQL                │
└───────────────────────────┬─────────────────────────────────┘
                            │ PASS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Parser Rejection (pgsql-ast-parser)               │
│  • Parser limitations act as security features              │
│  • Unsupported syntax is automatically rejected             │
│  • Note: UNION ALL and window functions ARE supported       │
└───────────────────────────┬─────────────────────────────────┘
                            │ PARSED
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: AST Validation (Statement Type Checking)          │
│  • Only SELECT, WITH (CTEs), UNION, UNION ALL allowed       │
│  • Recursively validates subqueries and CTEs                │
└───────────────────────────┬─────────────────────────────────┘
                            │ VALIDATED
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Semantic Validation                               │
│  • Table/schema whitelist validation                        │
│  • Function whitelist/blacklist validation                  │
│  • Query complexity limits                                  │
│  • Index usage validation                                   │
│  • LIMIT enforcement                                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                    ✅ SAFE TO EXECUTE
```

## Configuration

### Security Config

```typescript
import {
  getSecurityConfig,
  updateSecurityConfig,
} from '@wsd-ai-services-wespa/backend-text-to-data';

// View current configuration
const config = getSecurityConfig();
console.log('Max complexity:', config.MAX_QUERY_COMPLEXITY);
console.log('Max limit:', config.MAX_LIMIT);

// Update configuration (use sparingly, prefer environment variables)
updateSecurityConfig({
  MAX_QUERY_COMPLEXITY: 200,
  MAX_LIMIT: 5000,
  QUERY_TIMEOUT_MS: 10000,
});
```

### Default Configuration Values

```typescript
{
  // Query Complexity
  MAX_QUERY_COMPLEXITY: 10,        // Maximum joins + subqueries + CTEs

  // Row Limits
  MAX_LIMIT: 1000,                 // Maximum LIMIT value
  DEFAULT_LIMIT: 100,              // Default if no LIMIT specified

  // Timeouts
  MAX_EXECUTION_TIME_MS: 30000,    // 30 seconds
  QUERY_TIMEOUT_MS: 60000,         // 60 seconds

  // Access Control
  ALLOWED_TABLE_PATTERNS: [
    /^spi_data$/i,                 // Exact match: spi_data
    /^spi_.*$/i                    // Pattern match: spi_*
  ],

  ALLOWED_SCHEMA_PATTERNS: [
    /^public$/i,                   // public schema
    /^spi$/i                       // spi schema
  ],

  // Function Security
  BLOCKED_FUNCTIONS: [
    'pg_read_file',                // File system access
    'pg_ls_dir',                   // Directory listing
    'pg_stat_file',                // File stat
    'lo_import', 'lo_export',      // Large object operations
    'dblink', 'dblink_exec',       // Remote connections
    'pg_read_binary_file',         // Binary file read
    'pg_reload_conf',              // Config reload
    'pg_rotate_logfile',           // Log rotation
    'pg_cancel_backend',           // Backend management
    'pg_terminate_backend',        // Backend termination
    'pg_sleep',                    // DoS potential
    'pg_advisory_lock',            // Advisory locks
    'pg_try_advisory_lock',        // Advisory locks
    'copy_from_program',           // Command execution
    'copy_to_program',             // Command execution
    'pg_file_write',               // File write
    'pg_execute_server_program',   // Command execution
    'pg_logfile_rotate'            // Log file management
  ],

  ALLOWED_FUNCTIONS: [
    // Aggregates
    'count', 'sum', 'avg', 'min', 'max',

    // String functions
    'coalesce', 'nullif', 'upper', 'lower', 'trim',
    'substr', 'substring', 'length', 'concat', 'concat_ws',
    'replace', 'split_part', 'left', 'right', 'position',

    // Date functions
    'date_part', 'extract', 'date_trunc', 'now',
    'current_date', 'current_timestamp', 'age',
    'to_char', 'to_date', 'to_timestamp', 'interval', 'date',

    // Array functions
    'array_length', 'string_to_array', 'array_to_string', 'any',

    // Math functions
    'abs', 'ceil', 'floor', 'round', 'mod', 'power', 'sqrt', 'random',

    // Conditional
    'case', 'when', 'then', 'else', 'end',

    // Window functions
    'row_number', 'rank', 'dense_rank',
    'lag', 'lead', 'first_value', 'last_value', 'nth_value'
  ],

  // Index Validation
  ENFORCE_INDEX_VALIDATION: true,
  INDEX_VIOLATIONS_BLOCK_EXECUTION: true,
  INDEX_CACHE_TTL_MS: 300000       // 5 minutes
}
```

### Environment Variables

```bash
# In .env or deployment config
SQL_MAX_QUERY_COMPLEXITY=100
SQL_MAX_LIMIT=10000
SQL_QUERY_TIMEOUT_MS=30000
SQL_ALLOWED_TABLES=spi_data,user_data,reports
SQL_ALLOWED_SCHEMAS=public,analytics
```

## What Gets Blocked

### Layer 1: Pre-Validation Blocks

- **DCL**: `GRANT`, `REVOKE`
- **Transaction Control**: `SAVEPOINT`, `SET TRANSACTION`
- **System Admin**: `CREATE EXTENSION`, `ALTER DATABASE`
- **Dangerous Functions**: `pg_read_file()`, `dblink()`, `pg_execute()`
- **Command Execution**: `COPY`, `EXECUTE`

### Layer 3: AST Validation Blocks

- **DML**: `INSERT`, `UPDATE`, `DELETE`
- **DDL**: `CREATE`, `DROP`, `ALTER`, `TRUNCATE`
- **TCL**: `BEGIN`, `COMMIT`, `ROLLBACK`

### Layer 4: Semantic Validation

- Queries referencing unauthorized tables
- Queries using blacklisted functions
- Queries exceeding complexity limits
- Queries without proper indexes (warnings)
- Queries without LIMIT or with excessive LIMIT

## What Gets Allowed

### Safe SELECT Patterns

```sql
-- Basic SELECT
SELECT * FROM spi_data WHERE id = 1;

-- JOINs
SELECT a.*, b.name
FROM spi_data a
JOIN users b ON a.user_id = b.id;

-- CTEs (Common Table Expressions)
WITH active_users AS (
  SELECT * FROM users WHERE active = true
)
SELECT * FROM active_users WHERE created_at > '2024-01-01';

-- Subqueries
SELECT * FROM spi_data
WHERE user_id IN (SELECT id FROM users WHERE premium = true);

-- Aggregations
SELECT category, COUNT(*), AVG(price)
FROM products
GROUP BY category
HAVING COUNT(*) > 10;

-- Window Functions
SELECT name, salary,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC)
FROM employees;

-- UNION and UNION ALL
SELECT name FROM customers
UNION
SELECT name FROM suppliers;

SELECT id FROM active_users
UNION ALL
SELECT id FROM inactive_users;
```

## Query Execution with Timeout

```typescript
import { executeQueryWithTimeout } from '@wsd-ai-services-wespa/backend-text-to-data';

// Execute with default timeout (from config)
const results = await executeQueryWithTimeout(
  db, // Sequelize instance
  'SELECT * FROM spi_data LIMIT 100',
);

// Execute with custom timeout
const results = await executeQueryWithTimeout(
  db,
  'SELECT * FROM large_table WHERE complex_condition = true',
  { timeout: 60000 }, // 60 seconds
);
```

## Error Handling

```typescript
import { doSqlSanitiseEnhanced } from '@wsd-ai-services-wespa/backend-text-to-data';
import { ValidationError, Exceptions } from '@wsd-ai-services-wespa/backend-common';

async function executeSafeQuery(userSql: string) {
  try {
    // Sanitize the query
    const result = await doSqlSanitiseEnhanced(userSql);

    if (!result.safe) {
      throw new ValidationError('SQL query failed validation', { reasons: result.reasons });
    }

    // Check complexity
    if (result.metadata.complexity > 150) {
      console.warn('High complexity query:', result.metadata.complexity);
    }

    // Execute the query
    return await executeQueryWithTimeout(db, result.sql);
  } catch (error) {
    throw Exceptions.convert(error);
  }
}
```

## Integration with API Endpoints

```typescript
import { Router } from 'express';
import {
  doSqlSanitiseEnhanced,
  executeQueryWithTimeout,
} from '@wsd-ai-services-wespa/backend-text-to-data';
import { ValidationError } from '@wsd-ai-services-wespa/backend-common';

const router = Router();

router.post('/query', async (req, res, next) => {
  try {
    const { sql } = req.body;

    // Validate input
    if (!sql || typeof sql !== 'string') {
      throw new ValidationError('SQL query is required');
    }

    // Sanitize
    const sanitized = await doSqlSanitiseEnhanced(sql);

    if (!sanitized.safe) {
      throw new ValidationError('Invalid SQL query', {
        reasons: sanitized.reasons,
      });
    }

    // Execute
    const results = await executeQueryWithTimeout(db, sanitized.sql);

    res.json({
      data: results[0],
      metadata: sanitized.metadata,
    });
  } catch (error) {
    next(error); // Error middleware will handle
  }
});
```

## Testing Sanitization

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { doSqlSanitise } from '@wsd-ai-services-wespa/backend-text-to-data';

describe('SQL Sanitization', () => {
  it('should allow safe SELECT queries', async () => {
    const result = await doSqlSanitise('SELECT * FROM spi_data LIMIT 10');
    assert.strictEqual(result.safe, true);
  });

  it('should block UPDATE queries', async () => {
    const result = await doSqlSanitise('UPDATE users SET admin = true');
    assert.strictEqual(result.safe, false);
    assert.ok(result.reasons.some((r) => r.includes('UPDATE')));
  });

  it('should block SQL injection attempts', async () => {
    const result = await doSqlSanitise('SELECT * FROM users WHERE id = 1; DROP TABLE users; --');
    assert.strictEqual(result.safe, false);
  });
});
```

## Security Best Practices

### DO

✅ Always sanitize user-provided SQL
✅ Check `result.safe` before execution
✅ Use `executeQueryWithTimeout()` to prevent long-running queries
✅ Log failed validation attempts for security monitoring
✅ Set appropriate `MAX_QUERY_COMPLEXITY` for your use case
✅ Use environment-specific configurations

### DON'T

❌ Execute raw user SQL without sanitization
❌ Ignore `result.safe === false`
❌ Bypass sanitization "just this once"
❌ Assume the parser blocks all dangerous SQL
❌ Set complexity limits too high
❌ Disable validation in production

## Monitoring and Logging

```typescript
import { logger } from '@wsd-ai-services-wespa/backend-common';
import { doSqlSanitiseEnhanced } from '@wsd-ai-services-wespa/backend-text-to-data';

async function monitoredQuery(sql: string, userId: string) {
  const startTime = Date.now();
  const result = await doSqlSanitiseEnhanced(sql);

  if (!result.safe) {
    logger.warn('Unsafe SQL blocked', {
      userId,
      sql: sql.substring(0, 100), // First 100 chars
      reasons: result.reasons,
      duration: Date.now() - startTime,
    });
    throw new ValidationError('Invalid SQL query');
  }

  if (result.metadata.complexity > 100) {
    logger.info('High complexity query', {
      userId,
      complexity: result.metadata.complexity,
      hasIndex: result.metadata.hasRequiredIndex,
    });
  }

  return result;
}
```

## Recent Improvements

### Schema Extraction Enhancement

Fixed schema validation to properly extract schema names from nested AST node structures:

```typescript
// Now correctly blocks unauthorized schemas
SELECT * FROM unauthorized.spi_data  // ❌ Blocked
SELECT * FROM public.spi_data        // ✅ Allowed
SELECT * FROM spi.spi_metadata       // ✅ Allowed
```

**Implementation**: Schema is now extracted from both top-level and nested `name` objects in the AST, ensuring comprehensive validation of qualified table names.

### UNION ALL Support

Added support for `UNION ALL` queries, which are now parsed and validated:

```sql
-- Both UNION and UNION ALL are now supported
SELECT id FROM active_users
UNION ALL
SELECT id FROM inactive_users;
```

**Implementation**: Added `'union all'` as a recognized AST node type in the select-only validator, allowing both `UNION` and `UNION ALL` to pass validation while ensuring both sides are SELECT statements.

### Window Functions

Window functions are fully supported and validated:

```sql
-- Window functions are allowed
SELECT name, salary,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;
```

**Supported window functions**: `row_number`, `rank`, `dense_rank`, `lag`, `lead`, `first_value`, `last_value`, `nth_value`

## Performance Considerations

- **Parser caching**: AST parsing results are cached for identical queries
- **Index cache**: Table index information is cached with configurable TTL (5 minutes)
- **Complexity calculation**: O(n) where n = number of AST nodes
- **Pre-validation**: Regex patterns are fast (microseconds)
- **Schema extraction**: O(1) - direct property access with nested fallback
- **Typical overhead**: 5-20ms for most queries
- **Test coverage**: 92%+ lines, 78%+ branches (564 passing tests)

## Troubleshooting

### Query Rejected: "Table not in whitelist"

**Solution**: Add table to `ALLOWED_TABLE_PATTERNS` in config:

```typescript
updateSecurityConfig({
  ALLOWED_TABLE_PATTERNS: [/^spi_data$/, /^user_/, /^report_/],
});
```

### Query Rejected: "Complexity exceeds limit"

**Solution**: Either:

1. Simplify the query (recommended)
2. Increase `MAX_QUERY_COMPLEXITY` if justified

### Query Rejected: "Missing LIMIT clause"

**Solution**: Add LIMIT to your query:

```sql
SELECT * FROM large_table WHERE condition = true LIMIT 1000;
```

## Practical Usage Examples

### Example 1: API Endpoint with User-Provided SQL

Complete example of a text-to-data API endpoint:

```typescript
import { Router } from 'express';
import { sanitizeQuery } from '@wsd-ai-services-wespa/backend-common';
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';
import { ValidationError } from '@wsd-ai-services-wespa/backend-common';

const router = Router();

/**
 * POST /api/text-to-data/query
 * Execute user-provided SQL query (SELECT only)
 */
router.post('/query', async (req, res, next) => {
  try {
    const { sql } = req.body;

    // 1. Validate request body
    if (!sql || typeof sql !== 'string') {
      throw new ValidationError('SQL query is required and must be a string');
    }

    // 2. Sanitize the SQL (throws ValidationError if unsafe)
    const safeSql = await sanitizeQuery(sql);

    // 3. Get database client
    const db = getPostgresClient();

    // 4. Execute sanitized query
    const results = await db.query(safeSql);

    // 5. Return results
    res.json({
      success: true,
      data: results,
      rowCount: results.length,
    });
  } catch (error) {
    // Error middleware handles ValidationError automatically
    next(error);
  }
});

export default router;
```

### Example 2: Dynamic Table Selection with Whitelist

Safely allow users to select from a limited set of tables:

```typescript
import { validateIdentifier, sanitizeQuery } from '@wsd-ai-services-wespa/backend-common';
import { ValidationError } from '@wsd-ai-services-wespa/backend-common';

const ALLOWED_TABLES = ['products', 'orders', 'customers', 'spi_data'];

async function queryTable(tableName: string, filters: Record<string, unknown>) {
  // 1. Validate table name against whitelist
  if (!validateIdentifier(tableName, ALLOWED_TABLES)) {
    throw new ValidationError(`Table '${tableName}' is not allowed`);
  }

  // 2. Build query (simple example - extend with proper WHERE clause building)
  const sql = `SELECT * FROM ${tableName} LIMIT 100`;

  // 3. Sanitize the complete query
  const safeSql = await sanitizeQuery(sql);

  // 4. Execute
  const db = getPostgresClient();
  return await db.query(safeSql);
}

// Usage
const products = await queryTable('products', {}); // ✅ Allowed
const admin = await queryTable('admin_users', {}); // ❌ Throws ValidationError
```

### Example 3: Building Complex Queries Safely

When you need to build queries dynamically, use parameterized queries:

```typescript
import { buildParameterizedQuery } from '@wsd-ai-services-wespa/backend-common';
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';

interface QueryFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

async function searchProducts(filters: QueryFilters) {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build WHERE conditions with parameterization
  if (filters.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(filters.category);
  }

  if (filters.minPrice !== undefined) {
    conditions.push(`price >= $${paramIndex++}`);
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(`price <= $${paramIndex++}`);
    params.push(filters.maxPrice);
  }

  if (filters.inStock !== undefined) {
    conditions.push(`in_stock = $${paramIndex++}`);
    params.push(filters.inStock);
  }

  // Build SQL query
  let sql = 'SELECT * FROM products';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' LIMIT 100';

  // Validate parameterized query
  const query = buildParameterizedQuery(sql, params);

  // Execute with parameters (safe from SQL injection)
  const db = getPostgresClient();
  return await db.query(query.text, query.values);
}

// Usage
const results = await searchProducts({
  category: 'electronics',
  minPrice: 100,
  maxPrice: 1000,
  inStock: true,
});
```

### Example 4: Service Layer with Sanitization

Create a reusable service that always sanitizes queries:

```typescript
import { sanitizeQuery } from '@wsd-ai-services-wespa/backend-common';
import { getPostgresClient } from '@wsd-ai-services-wespa/backend-common';
import { doSqlSanitiseEnhanced } from '@wsd-ai-services-wespa/backend-text-to-data';

export class TextToDataService {
  /**
   * Execute user-provided SQL with full sanitization and metadata
   */
  async executeQuery(sql: string) {
    // Use enhanced version for detailed metadata
    const result = await doSqlSanitiseEnhanced(sql);

    if (!result.safe) {
      throw new ValidationError('Invalid SQL query', {
        violations: result.violations,
        warnings: result.warnings,
      });
    }

    // Log query metadata for monitoring
    global.logger?.info(
      {
        complexity: result.metadata.complexity,
        hasLimit: result.metadata.hasLimit,
        limitValue: result.metadata.limitValue,
      },
      'Executing sanitized query',
    );

    // Execute
    const db = getPostgresClient();
    const data = await db.query(result.sql);

    return {
      data,
      metadata: {
        rowCount: data.length,
        complexity: result.metadata.complexity,
        warnings: result.warnings,
      },
    };
  }

  /**
   * Simple execution with automatic error handling
   */
  async executeSimple(sql: string) {
    const safeSql = await sanitizeQuery(sql);
    const db = getPostgresClient();
    return await db.query(safeSql);
  }
}
```

### Example 5: Testing SQL Sanitization

Write unit tests for sanitization logic:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeQuery,
  sanitizeIdentifier,
  validateIdentifier,
} from '@wsd-ai-services-wespa/backend-common';

describe('SQL Sanitization', () => {
  describe('sanitizeQuery', () => {
    it('should allow safe SELECT queries', async () => {
      const sql = 'SELECT * FROM users WHERE id = 1';
      const result = await sanitizeQuery(sql);
      assert.ok(result.includes('SELECT'));
    });

    it('should reject DROP TABLE queries', async () => {
      await assert.rejects(async () => await sanitizeQuery('DROP TABLE users'), {
        name: 'ValidationError',
        message: /SQL query failed security validation/,
      });
    });

    it('should reject UPDATE queries', async () => {
      await assert.rejects(async () => await sanitizeQuery('UPDATE users SET admin = true'), {
        name: 'ValidationError',
      });
    });
  });

  describe('sanitizeIdentifier', () => {
    it('should allow valid identifiers', () => {
      assert.equal(sanitizeIdentifier('users'), 'users');
      assert.equal(sanitizeIdentifier('public.users'), 'public.users');
      assert.equal(sanitizeIdentifier('my_table_123'), 'my_table_123');
    });

    it('should reject invalid identifiers', () => {
      assert.throws(() => sanitizeIdentifier('users; DROP TABLE'), { name: 'ValidationError' });
      assert.throws(() => sanitizeIdentifier('table name with spaces'), {
        name: 'ValidationError',
      });
    });
  });

  describe('validateIdentifier', () => {
    it('should validate against whitelist', () => {
      const whitelist = ['users', 'products', 'orders'];
      assert.equal(validateIdentifier('users', whitelist), true);
      assert.equal(validateIdentifier('admin', whitelist), false);
    });

    it('should validate format without whitelist', () => {
      assert.equal(validateIdentifier('valid_table'), true);
      assert.equal(validateIdentifier('invalid; DROP'), false);
    });
  });
});
```

### Example 6: Middleware for Query Logging

Create Express middleware to log all SQL sanitization attempts:

```typescript
import { Request, Response, NextFunction } from 'express';
import { doSqlSanitiseEnhanced } from '@wsd-ai-services-wespa/backend-text-to-data';

export function sqlSanitizationLogger(req: Request, res: Response, next: NextFunction) {
  // Only log for query endpoints
  if (!req.body?.sql) {
    return next();
  }

  const originalSql = req.body.sql;
  const startTime = Date.now();

  doSqlSanitiseEnhanced(originalSql)
    .then((result) => {
      const duration = Date.now() - startTime;

      if (!result.safe) {
        // Log blocked queries for security monitoring
        global.logger?.warn(
          {
            userId: req.user?.id,
            ip: req.ip,
            sql: originalSql.substring(0, 100),
            violations: result.violations,
            duration,
          },
          'Blocked unsafe SQL query',
        );
      } else {
        // Log successful sanitization
        global.logger?.info(
          {
            userId: req.user?.id,
            complexity: result.metadata.complexity,
            duration,
          },
          'SQL query sanitized successfully',
        );
      }

      next();
    })
    .catch(next);
}
```

## Related Patterns

- [Exception Handling](./exception-handling.md) - For error handling integration
- [Server Logging](./server-logging.md) - For logging sanitization events
- [API Structure](./api-structure.md) - For API endpoint integration

## References

### Implementation

- **Core Sanitizer**: `packages/@wsd-ai-services-wespa/backend-text-to-data/src/sql-sanitizer/`
- **Convenience Wrappers**: `packages/@wsd-ai-services-wespa/backend-common/src/utils/postgres-sanitize.ts`
- **PostgreSQL Service**: `packages/@wsd-ai-services-wespa/backend-common/src/services/postgres.ts`

### Tests

- **Sanitizer Tests**: `packages/@wsd-ai-services-wespa/backend-text-to-data/test/unit/sql-sanitizer/`
- **Integration Tests**: `packages/@wsd-ai-services-wespa/backend-common/test/unit/utils/`

### Documentation

- **Module README**: `packages/@wsd-ai-services-wespa/backend-text-to-data/src/sql-sanitizer/README.md`
- **This Pattern Document**: `docs/dev/patterns/sql-sanitisation.md`
- **Module Architecture**: See module README for detailed implementation documentation

## API Reference

### From @wsd-ai-services-wespa/backend-text-to-data

```typescript
// Main sanitization functions
doSqlSanitise(sql: string): Promise<string | null>
doSqlSanitiseEnhanced(sql: string): Promise<SanitizationResult>

// Timeout management
setQueryTimeout(sequelizeInstance: DatabaseClient, timeoutMs?: number): Promise<void>
executeQueryWithTimeout(sequelizeInstance: DatabaseClient, sql: string, options?, timeoutMs?): Promise<T>

// Configuration
getSecurityConfig(): SecurityConfig
updateSecurityConfig(updates: Partial<SecurityConfig>): void
```

### From @wsd-ai-services-wespa/backend-common

```typescript
// Simplified sanitization API (throws ValidationError on failure)
sanitizeQuery(query: string): Promise<string>
sanitizeIdentifier(identifier: string): string
validateIdentifier(identifier: string, whitelist?: string[]): boolean
buildParameterizedQuery(sql: string, params: unknown[]): { text: string; values: unknown[] }
sanitizeValue(value: unknown): unknown
```

## Quick Reference Table

| Use Case                       | Recommended Function        | Package              |
| ------------------------------ | --------------------------- | -------------------- |
| User-provided SQL queries      | `sanitizeQuery()`           | backend-common       |
| Detailed sanitization info     | `doSqlSanitiseEnhanced()`   | backend-text-to-data |
| Table/column name validation   | `sanitizeIdentifier()`      | backend-common       |
| Whitelist checking             | `validateIdentifier()`      | backend-common       |
| Parameterized query validation | `buildParameterizedQuery()` | backend-common       |
| Query with timeout             | `executeQueryWithTimeout()` | backend-text-to-data |
