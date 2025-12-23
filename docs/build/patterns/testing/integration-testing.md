# Integration Testing Pattern

## Overview

Integration tests verify that API endpoints work correctly end-to-end, including middleware, routing, error handling, and service interactions. These tests run against a real server instance but use test databases and mocked external services when needed.

## Architecture

### Test Organization

```
packages/@wsd-ai-services-wespa/backend-integration-tests/
├── src/
│   ├── helpers/              # Test utilities
│   │   ├── test-server.ts    # Server setup/teardown
│   │   ├── test-database.ts  # Database utilities
│   │   └── fixtures.ts       # Test data factories
│   └── coverage/             # Coverage analysis tools
└── test/
    └── integration/
        └── api/              # Mirror API structure
            ├── health.test.ts
            └── [endpoint].test.ts
```

### Test Structure Pattern

Each test file follows this structure:

```typescript
import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  setupTestServer,
  teardownTestServer,
  getTestClient,
} from '../../../src/helpers/test-server.js';
import type { SuperTest, Test } from 'supertest';

describe('[Endpoint] API Integration Tests', () => {
  let request: SuperTest<Test>;

  before(async () => {
    request = await setupTestServer();
    // Setup test data if needed
  });

  after(async () => {
    await teardownTestServer();
  });

  describe('METHOD /api/path', () => {
    // Happy path tests
    it('should handle valid request', async () => {
      const response = await request.get('/api/endpoint').expect(200);

      assert.ok(response.body);
      // Specific assertions
    });

    // Error cases
    it('should return 400 for invalid input', async () => {
      const response = await request.post('/api/endpoint').send({ invalid: 'data' }).expect(400);

      assert.ok(response.body.message);
    });

    // Edge cases
    it('should handle edge case', async () => {
      // Test boundary conditions
    });
  });
});
```

## Test Coverage Requirements

Each endpoint should have tests for:

### 1. Happy Path

- Valid requests with expected data
- Different valid input variations
- Successful response validation
- Correct status codes (200, 201, etc.)

### 2. Error Cases

Per our **exception-handling.md** pattern, test all error classes:

- **ValidationError (400)**: Missing required fields, invalid data types, format validation
- **AuthenticationError (401)**: Missing/invalid/expired tokens
- **AuthorizationError (403)**: Insufficient permissions
- **NotFoundError (404)**: Resource not found
- **ConflictError (409)**: Duplicate resources
- **RateLimitError (429)**: Rate limiting scenarios

### 3. Edge Cases

- Empty strings
- Null values
- Maximum length strings
- Boundary numbers
- Special characters
- SQL/NoSQL injection attempts
- Large payloads
- Unicode handling

### 4. Operational Tests

- Concurrent requests
- Request timeouts
- Response consistency
- Header validation
- Idempotency (for POST/PUT/DELETE)

## Test Helpers

### Server Setup

The `test-server.ts` helper provides server lifecycle management:

```typescript
import {
  setupTestServer,
  teardownTestServer,
  getTestClient,
} from '../../../src/helpers/test-server.js';

// In before() hook
const request = await setupTestServer();

// In after() hook
await teardownTestServer();
```

**Key Features:**

- Uses `createServer()` from backend-common
- Mounts API routes automatically
- Applies error handling middleware
- Uses random port (0) to avoid conflicts
- Creates supertest instance for testing

### Database Setup

The `test-database.ts` helper provides database utilities:

```typescript
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from '../../../src/helpers/test-database.js';

// In before() hook - initialize test DB
await setupTestDatabase();

// In beforeEach() hook - clear data between tests
await clearTestDatabase();

// In after() hook - cleanup
await teardownTestDatabase();
```

## Running Tests

### Commands

```bash
# Run all integration tests
pnpm test:integration

# Run in watch mode
pnpm test:integration:watch

# Run specific test file
pnpm --filter @wsd-ai-services-wespa/backend-integration-tests test test/integration/api/health.test.ts
```

### Environment Variables

```bash
NODE_ENV=test           # Always set for tests
TEST_TIMEOUT=10000      # Timeout in milliseconds
TEST_MONGODB_URI=...    # Override MongoDB URI for tests
TEST_REDIS_URL=...      # Override Redis URL for tests
```

## Best Practices

### DO:

- ✅ Test complete request/response cycle
- ✅ Validate response headers and status codes
- ✅ Test error messages and response format
- ✅ Clean up test data after each test
- ✅ Use descriptive test names (behavior, not implementation)
- ✅ Group related tests in describe blocks
- ✅ Test both success and failure scenarios
- ✅ Validate response schema, not just values
- ✅ Follow exception handling patterns from backend-common
- ✅ Use AAA pattern: Arrange, Act, Assert

### DON'T:

- ❌ Mock the server or routes being tested
- ❌ Test implementation details
- ❌ Depend on test execution order
- ❌ Share state between tests
- ❌ Use production databases
- ❌ Skip error case testing
- ❌ Hard-code expected values when dynamic
- ❌ Test multiple behaviors in one test

## Test Data Management

### Fixtures

Create reusable test data factories:

```typescript
// src/helpers/fixtures.ts
export const createTestUser = (overrides = {}) => ({
  email: `test-${Date.now()}@example.com`,
  name: 'Test User',
  ...overrides,
});

export const createTestProduct = (overrides = {}) => ({
  name: `Test Product ${Date.now()}`,
  price: 100,
  ...overrides,
});
```

### Database State

Each test should:

1. Set up required data in `beforeEach`
2. Clean up created data in `afterEach`
3. Never depend on data from other tests
4. Use unique identifiers to avoid conflicts

## Assertion Patterns

### Response Structure Validation

```typescript
// Validate response has expected fields
assert.ok(response.body.id, 'Should include id');
assert.ok(response.body.name, 'Should include name');

// Validate response structure
assert.deepEqual(
  Object.keys(response.body).sort(),
  ['id', 'name', 'createdAt'].sort(),
  'Response should have expected fields',
);
```

### Error Response Validation

Per our exception handling pattern:

```typescript
// Validate error response format
assert.equal(response.body.statusCode, 400);
assert.ok(response.body.message, 'Should include error message');
assert.equal(response.body.error, 'ValidationError');

// Validate error context if provided
if (response.body.context) {
  assert.ok(response.body.context.field, 'Should include problematic field');
}
```

### Type Validation

```typescript
// Validate data types
assert.equal(typeof response.body.id, 'string');
assert.equal(typeof response.body.price, 'number');
assert.ok(Array.isArray(response.body.items));

// Validate date formats
const date = new Date(response.body.createdAt);
assert.ok(!isNaN(date.getTime()), 'Should be valid ISO date');
```

## Integration with Project Patterns

### Exception Handling

Integration tests verify that error handling follows **exception-handling.md**:

- All errors converted to AppError subclasses
- Correct HTTP status codes
- Structured error responses with message, statusCode, error, context
- Errors logged appropriately

### Server Logging

Integration tests can verify logging behavior per **server-logging.md**:

- Request logging includes method, path, status, duration
- Error logging includes stack traces
- Log levels match severity

### API Structure

Tests should mirror the API structure from **api-structure.md**:

- Controllers handle business logic
- Routes define endpoints
- Middleware applied correctly
- Swagger documentation accurate

## Debugging Integration Tests

### Verbose Output

```bash
# Run with detailed logging
DEBUG=* pnpm test:integration

# Run with node test reporter options
NODE_OPTIONS='--test-reporter=spec' pnpm test:integration
```

### Single Test Execution

```bash
# Run single test file
node --test test/integration/api/health.test.ts

# Run with inspector for debugging
node --inspect --test test/integration/api/health.test.ts
```

### Common Issues

**Server doesn't start:**

- Check port availability (use port 0 for random)
- Verify all dependencies installed
- Check environment variables

**Tests timeout:**

- Increase timeout in test: `it('...', { timeout: 10000 }, async () => {})`
- Check for unresolved promises
- Verify database connections

**Flaky tests:**

- Check for race conditions
- Ensure proper cleanup in afterEach/after
- Avoid shared state between tests
- Use unique test data

## Performance Considerations

- Use in-memory databases for speed when possible
- Parallelize independent test suites
- Reuse server instances within test files
- Clear data, don't drop/recreate databases
- Mock external API calls
- Use fixtures to avoid complex setup

## Coverage Requirements

**Integration test coverage refers to endpoint coverage, not line coverage.**

Coverage metrics:

- **Endpoint coverage**: Which API endpoints have integration test suites
- **Scenario coverage**: Each endpoint should test happy path, errors, edge cases, and operational behavior
- **Goal**: 100% of API endpoints should have integration tests

**Note**: Line/branch/function coverage metrics (from c8) apply to **unit tests only**. Integration tests verify end-to-end API behavior, not code coverage.

## CI/CD Integration

Integration tests should:

- Run after unit tests pass
- Use dedicated test databases
- Not require external services (use mocks)
- Complete within 5 minutes
- Block deployment on failure

Example CI pipeline:

```yaml
- name: Run Integration Tests
  run: pnpm test:integration
  env:
    NODE_ENV: test
    TEST_MONGODB_URI: ${{ secrets.TEST_MONGODB_URI }}
```

**Note**: Endpoint coverage analysis (which endpoints have tests) can be done manually using `/integration-test-coverage` command or automated in Stage 3 implementation.

## Related Patterns

- **exception-handling.md**: Error classes and conversion
- **server-logging.md**: Logging patterns and levels
- **api-structure.md**: Endpoint organization and conventions
- **unit-testing.md**: Unit test patterns (similar structure)
- **code-quality.md**: Quality standards and tooling
