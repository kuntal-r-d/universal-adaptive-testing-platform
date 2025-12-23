# Unit Testing Pattern

This document defines the unit testing patterns and practices for the WESPA monorepo.

## Core Principles

### Testing Philosophy

1. **Lean Testing Strategy**: Unit tests are for key utilities, services, and standalone classes only
2. **Test the Target, Mock the Dependencies**: Never mock the system under test
3. **Framework Choice**: Use Node.js built-in `node:test` for all backend unit testing
4. **Mocking Library**: Use Sinon.js where Node.js v24's built-in mocking falls short
5. **Coverage Tool**: Use c8 for code coverage reporting

### What to Unit Test

#### High Priority (Unit Test)

- Pure functions and utilities
- Standalone classes with minimal dependencies
- Service factories and initialization functions
- Error handling utilities
- Data transformation functions
- Validation logic

#### Low Priority (Integration/E2E Test)

- Express middleware
- API route handlers
- Database interactions
- External API calls
- File I/O operations (unless abstracted)
- Complex orchestration code

## Test Organization

### Directory Structure

```
packages/
  @wsd-ai-services-wespa/
    <package-name>/
      src/                      # Source code
      test/
        unit/                   # Unit tests only
          **/*.test.ts          # Mirror src structure
      package.json
```

### File Naming Convention

- Test files: `<source-file-name>.test.ts`
- Test files should mirror the source directory structure
- Example: `src/services/logger.ts` → `test/unit/services/logger.test.ts`

## Test Structure Pattern

### Basic Test Template

```typescript
import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';

describe('ComponentName', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#methodName', () => {
    it('should handle expected behavior', async () => {
      // Arrange
      const expectedResult = 'expected';
      const stub = sandbox.stub(dependency, 'method').returns(expectedResult);

      // Act
      const result = await targetMethod();

      // Assert
      assert.equal(result, expectedResult);
      assert.ok(stub.calledOnce);
    });

    it('should handle error cases', async () => {
      // Arrange
      const error = new Error('Test error');
      sandbox.stub(dependency, 'method').throws(error);

      // Act & Assert
      await assert.rejects(() => targetMethod(), error);
    });
  });
});
```

### Testing Async Functions

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Async Function', () => {
  it('should resolve with expected value', async () => {
    const result = await asyncFunction();
    assert.equal(result, 'expected');
  });

  it('should reject with error', async () => {
    await assert.rejects(() => asyncFunctionThatThrows(), { message: 'Expected error message' });
  });
});
```

### Testing Error Classes

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CustomError } from '../../../src/classes/errors.js';

describe('CustomError', () => {
  it('should have correct properties', () => {
    const error = new CustomError('Test message');

    assert.equal(error.message, 'Test message');
    assert.equal(error.name, 'CustomError');
    assert.equal(error.statusCode, 400);
    assert.ok(error.isOperational);
  });

  it('should inherit from Error', () => {
    const error = new CustomError('Test');
    assert.ok(error instanceof Error);
  });
});
```

## Mocking Strategies

### Using Node.js Built-in Mocks

```typescript
import { mock } from 'node:test';
import * as fs from 'node:fs/promises';

// Mock a module
const fsMock = mock.method(fs, 'readFile', async () => 'mocked content');

// Verify calls
assert.equal(fsMock.mock.calls.length, 1);
assert.deepEqual(fsMock.mock.calls[0].arguments, ['file.txt', 'utf8']);

// Restore
fsMock.mock.restore();
```

### Using Sinon for Advanced Mocking

```typescript
import sinon from 'sinon';

describe('Service with Dependencies', () => {
  let sandbox: sinon.SinonSandbox;
  let loggerStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Stub external dependencies
    loggerStub = sandbox.stub(console, 'log');

    // Stub module dependencies
    sandbox.stub(process, 'env').value({
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should log messages in development mode', () => {
    sandbox.stub(process, 'env').value({ NODE_ENV: 'development' });

    service.doSomething();

    assert.ok(loggerStub.called);
    assert.ok(loggerStub.calledWith(sinon.match(/Debug:/)));
  });
});
```

### Mocking Time-based Operations

```typescript
import sinon from 'sinon';

describe('Time-dependent operations', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should timeout after specified duration', async () => {
    const promise = functionWithTimeout(1000);

    // Fast-forward time
    clock.tick(1000);
    await clock.runAllAsync();

    const result = await promise;
    assert.equal(result, 'timeout');
  });
});
```

### Dependency Injection for Testability

When testing services that depend on external clients (Redis, MongoDB, HTTP clients), use **dependency injection** instead of trying to mock ES module imports. This approach is cleaner, more reliable, and follows SOLID principles.

#### Problem: ES Module Mocking Limitations

ES modules create immutable bindings that cannot be easily mocked after import. Attempts to mock with `mock.method()` often fail because the module is already loaded.

```typescript
// ❌ DON'T: This pattern is unreliable with ES modules
import { mock } from 'node:test';
import * as redis from 'redis';

// This often fails because redis is already imported by the service
mock.method(redis, 'createClient', () => mockClient);
```

#### Solution: Constructor Injection

Design your classes to accept optional factory functions for creating dependencies.

**Service Implementation:**

```typescript
import { createClient, RedisClientType } from 'redis';

// Export type for factory function
export type RedisClientFactory = (url: string) => RedisClientType;

export class CacheClient {
  private client: RedisClientType;

  /**
   * @param url - Redis connection URL
   * @param prefix - Key prefix for namespacing
   * @param clientFactory - Optional factory for creating Redis client (used for testing)
   */
  constructor(url: string, prefix: string, clientFactory?: RedisClientFactory) {
    // Use provided factory or default Redis client creation
    this.client = clientFactory ? clientFactory(url) : createClient({ url });
  }

  // ... rest of implementation
}

// Factory function also accepts optional client factory
export async function createCacheClient(
  url: string,
  prefix: string,
  clientFactory?: RedisClientFactory,
): Promise<CacheClient> {
  const client = new CacheClient(url, prefix, clientFactory);
  await client.connect();
  return client;
}
```

**Test Implementation:**

```typescript
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { CacheClient, createCacheClient } from '../../../src/services/cache.js';

// Create mock client that implements the interface
class MockRedisClient {
  private data: Map<string, string> = new Map();
  private connected = false;

  on(event: string, handler: (...args: unknown[]) => void) {
    // Store event handlers
    return this;
  }

  async connect() {
    this.connected = true;
  }

  async disconnect() {
    this.connected = false;
  }

  async get(key: string) {
    return this.data.get(key) || null;
  }

  async set(key: string, value: string) {
    this.data.set(key, value);
    return 'OK';
  }

  // ... implement other Redis methods as needed
}

describe('CacheClient', () => {
  let mockClient: MockRedisClient;

  beforeEach(() => {
    mockClient = new MockRedisClient();
  });

  it('should set and get values', async () => {
    // ✅ DO: Inject mock directly via constructor
    const client = new CacheClient('redis://localhost:6379', 'test:', () => mockClient as never);
    await client.connect();

    await client.set('key', 'value');
    const result = await client.get('key');

    assert.equal(result, 'value');
  });

  it('should work with factory function', async () => {
    // ✅ DO: Inject mock via factory function
    const client = await createCacheClient(
      'redis://localhost:6379',
      'test:',
      () => mockClient as never,
    );

    await client.set('key', 'value');
    const result = await client.get('key');

    assert.equal(result, 'value');
    await client.disconnect();
  });
});
```

#### Benefits of Dependency Injection

1. **No Module Mocking Required**: Directly inject test doubles
2. **Cleaner Tests**: No complex mock setup or cleanup
3. **Better Design**: Follows SOLID principles (Dependency Inversion)
4. **Type Safety**: TypeScript can verify mock implementations
5. **Production Safe**: Zero impact on production code (optional parameter)

#### When to Use Dependency Injection

Use this pattern for:

- **Database Clients**: Redis, MongoDB, PostgreSQL
- **HTTP Clients**: Axios, fetch wrappers
- **External Service Clients**: AWS SDK, third-party APIs
- **File System Operations**: When wrapped in a service
- **Any External I/O**: Network, file system, system calls

#### Mock Implementation Guidelines

When creating mock clients:

1. **Implement Minimum Interface**: Only implement methods used by tests
2. **Match Real Behavior**: Simulate real client behavior (connect, disconnect, errors)
3. **Use In-Memory Storage**: Store data in Maps or objects for get/set operations
4. **Support Event Emitters**: If real client uses events, implement `on()` and `emit()`
5. **Type Cast When Needed**: Use `as never` or proper type assertions to satisfy TypeScript

```typescript
// Example: Mock with event emitter support
class MockRedisClient {
  private listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

  on(event: string, handler: (...args: unknown[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach((handler) => handler(...args));
  }

  async connect() {
    this.emit('ready'); // Simulate real client behavior
  }

  async disconnect() {
    this.emit('end'); // Simulate real client behavior
  }
}
```

#### Alternative: Using Sinon with Dependency Injection

For more complex scenarios, combine dependency injection with Sinon spies/stubs:

```typescript
import sinon from 'sinon';

describe('CacheClient with Sinon', () => {
  let sandbox: sinon.SinonSandbox;
  let mockClient: MockRedisClient;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockClient = new MockRedisClient();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call connect on initialization', async () => {
    const connectSpy = sandbox.spy(mockClient, 'connect');
    const client = new CacheClient('redis://localhost:6379', 'test:', () => mockClient as never);

    await client.connect();

    assert.ok(connectSpy.calledOnce);
  });
});
```

## Coverage Configuration

### c8 Configuration (.c8rc.json)

```json
{
  "all": true,
  "src": ["packages/*/src/**/*.ts"],
  "exclude": [
    "**/node_modules/**",
    "**/test/**",
    "**/dist/**",
    "**/*.d.ts",
    "**/*.test.ts",
    "**/index.ts"
  ],
  "reporter": ["text", "lcov", "html"],
  "reportsDir": "./coverage",
  "checkCoverage": true,
  "branches": 75,
  "lines": 80,
  "functions": 80,
  "statements": 80,
  "watermarks": {
    "branches": [70, 85],
    "functions": [70, 85],
    "lines": [70, 85],
    "statements": [70, 85]
  }
}
```

## Package Scripts

### Individual Package (package.json)

```json
{
  "scripts": {
    "test:unit": "node --test test/unit/**/*.test.ts --experimental-test-coverage=false",
    "test:unit:watch": "node --test test/unit/**/*.test.ts --watch",
    "test:coverage": "c8 node --test test/unit/**/*.test.ts"
  }
}
```

### Root Package (package.json)

```json
{
  "scripts": {
    "test:unit": "pnpm --filter './packages/*' test:unit",
    "test:coverage": "c8 pnpm --filter './packages/*' test:unit",
    "test:unit:watch": "pnpm --filter './packages/*' --parallel test:unit:watch"
  }
}
```

## Common Testing Patterns

### Testing Factory Functions

```typescript
describe('createService', () => {
  it('should create service with default options', () => {
    const service = createService();

    assert.ok(service);
    assert.equal(typeof service.method, 'function');
  });

  it('should create service with custom options', () => {
    const options = { timeout: 5000 };
    const service = createService(options);

    assert.equal(service.timeout, 5000);
  });
});
```

### Testing Caching Behavior

```typescript
describe('Cached Function', () => {
  beforeEach(() => {
    clearCache();
  });

  it('should cache results', async () => {
    const spy = sandbox.spy(expensiveOperation);

    const result1 = await cachedFunction();
    const result2 = await cachedFunction();

    assert.equal(result1, result2);
    assert.equal(spy.callCount, 1);
  });

  it('should invalidate cache when cleared', async () => {
    const spy = sandbox.spy(expensiveOperation);

    await cachedFunction();
    clearCache();
    await cachedFunction();

    assert.equal(spy.callCount, 2);
  });
});
```

### Testing Error Conversion

```typescript
describe('Error Converter', () => {
  it('should convert database errors', () => {
    const dbError = new Error('UNIQUE constraint failed');
    const appError = convertError(dbError);

    assert.ok(appError instanceof ConflictError);
    assert.equal(appError.statusCode, 409);
  });

  it('should preserve operational errors', () => {
    const originalError = new ValidationError('Invalid input');
    const convertedError = convertError(originalError);

    assert.strictEqual(convertedError, originalError);
  });
});
```

## Best Practices

### DO:

- ✅ Write focused tests that test one thing
- ✅ Use descriptive test names that explain the behavior
- ✅ Follow AAA pattern: Arrange, Act, Assert
- ✅ Clean up all stubs/spies in afterEach
- ✅ Test both success and failure paths
- ✅ Use strict assertions (`assert.strictEqual`, `assert.deepStrictEqual`)
- ✅ Mock external dependencies (file system, network, databases)
- ✅ Test edge cases and boundary conditions

### DON'T:

- ❌ Mock the system under test
- ❌ Write tests that depend on execution order
- ❌ Use real external services or databases
- ❌ Test implementation details
- ❌ Write overly complex test setups
- ❌ Ignore async/promise rejections
- ❌ Leave console.log statements in tests
- ❌ Test private methods directly

## Running Tests

### Development Workflow

```bash
# Run all unit tests
pnpm test:unit

# Run tests in watch mode during development
pnpm test:unit:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @wsd-ai-services-wespa/backend-common test:unit

# Run single test file
node --test packages/@wsd-ai-services-wespa/backend-common/test/unit/services/logger.test.ts
```

### CI/CD Integration

```bash
# Run all tests with coverage and fail if below threshold
pnpm test:coverage

# Generate coverage reports
pnpm test:coverage -- --reporter=lcov
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure you're using `.js` extensions in imports for ESM
2. **Timeout Issues**: Increase timeout for async operations: `it('test', { timeout: 5000 }, async () => {})`
3. **Memory Leaks**: Always restore sandboxes and clear mocks in afterEach
4. **Coverage Gaps**: Check excluded patterns in .c8rc.json
5. **TypeScript Errors**: Ensure test files are included in tsconfig.json

### Debugging Tests

```bash
# Run tests with Node debugger
node --inspect --test test/unit/**/*.test.ts

# Run specific test with verbose output
NODE_ENV=test node --test --test-reporter=spec test/unit/services/logger.test.ts
```

## Examples by Component Type

See the implemented tests in:

- `packages/@wsd-ai-services-wespa/backend-common/test/unit/classes/exceptions.test.ts` - Error classes and conversion
- `packages/@wsd-ai-services-wespa/backend-common/test/unit/services/logger.test.ts` - Service initialization and lifecycle
- `packages/@wsd-ai-services-wespa/backend-common/test/unit/services/app-version.test.ts` - Factory functions and caching
- `packages/@wsd-ai-services-wespa/backend-common/test/unit/services/cache.test.ts` - Dependency injection with external clients

These provide real-world examples of the patterns described in this document.
