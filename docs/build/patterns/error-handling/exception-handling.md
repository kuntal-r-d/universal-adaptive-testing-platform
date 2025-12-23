# Exception Handling Pattern

## Overview

The WESPA project uses a standardized exception handling system via the `@wsd-ai-services-wespa/backend-common` package. This ensures consistent error responses across all services and proper error classification.

## Core Principle

**All catch blocks MUST use `Exceptions.convert()` to normalize errors.**

This converts any error (Error objects, strings, unknown types) into a standardized `AppError` with proper HTTP status codes and operational classification.

## Exception Classes

### AppError (Base Class)

Base error class for all application errors.

```typescript
import { AppError } from '@wsd-ai-services-wespa/backend-common';

throw new AppError('Something went wrong', 500, true);
```

**Parameters:**

- `message` (string): Error message
- `statusCode` (number): HTTP status code (default: 500)
- `isOperational` (boolean): Whether error is expected (default: true)
- `originalError` (Error | null): Original error for stack trace preservation

### ValidationError (400)

For invalid input data.

```typescript
import { ValidationError } from '@wsd-ai-services-wespa/backend-common';

throw new ValidationError('Invalid email format', { email: 'Must be valid email' });
```

### AuthenticationError (401)

For missing or invalid credentials.

```typescript
import { AuthenticationError } from '@wsd-ai-services-wespa/backend-common';

throw new AuthenticationError('Invalid credentials');
```

### AuthorizationError (403)

For insufficient permissions.

```typescript
import { AuthorizationError } from '@wsd-ai-services-wespa/backend-common';

throw new AuthorizationError('Admin access required');
```

### NotFoundError (404)

For resource not found scenarios.

```typescript
import { NotFoundError } from '@wsd-ai-services-wespa/backend-common';

throw new NotFoundError('User not found');
```

### ConflictError (409)

For resource conflicts (e.g., duplicate entries).

```typescript
import { ConflictError } from '@wsd-ai-services-wespa/backend-common';

throw new ConflictError('Email already exists');
```

### RateLimitError (429)

For rate limiting violations.

```typescript
import { RateLimitError } from '@wsd-ai-services-wespa/backend-common';

throw new RateLimitError('Too many requests, try again later');
```

## Using Exceptions.convert()

### Basic Usage

**ALWAYS** use `Exceptions.convert()` in catch blocks to normalize errors:

```typescript
import { convert } from '@wsd-ai-services-wespa/backend-common';

try {
  await riskyOperation();
} catch (error) {
  throw convert(error, 'RiskyOperation');
}
```

### With Context

The second parameter adds context to error messages:

```typescript
try {
  await database.query(sql);
} catch (error) {
  throw convert(error, 'Database query');
}
// Error message becomes: "Database query: <original message>"
```

### In Express Route Handlers

```typescript
import { Router, type Request, type Response, type NextFunction } from 'express';
import { convert, ValidationError } from '@wsd-ai-services-wespa/backend-common';

const router = Router();

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await createUser({ email, name });
    res.json(user);
  } catch (error) {
    next(convert(error, 'Create user'));
  }
});
```

### In Service Functions

```typescript
import { convert, NotFoundError } from '@wsd-ai-services-wespa/backend-common';

export const getUserById = async (id: string) => {
  try {
    const user = await database.users.findById(id);

    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }

    return user;
  } catch (error) {
    throw convert(error, 'Get user by ID');
  }
};
```

## Automatic Error Handling

The web server from `backend-common` automatically converts errors to standardized responses.

**IMPORTANT**: Error responses are returned as flat objects, NOT nested under an "error" property.

**Operational Errors** (expected errors):

```json
{
  "message": "User not found",
  "statusCode": 404
}
```

**Programming Errors** (unexpected errors):

```json
{
  "message": "Internal server error",
  "statusCode": 500
}
```

**Validation Errors** (with details):

```json
{
  "message": "Invalid input",
  "statusCode": 400,
  "details": {
    "email": "Must be valid email",
    "age": "Must be positive number"
  }
}
```

### HTTP Status Codes

The HTTP response status code matches the `statusCode` property in the JSON response:

```bash
curl -i http://localhost:4500/api/nonexistent
# HTTP/1.1 404 Not Found
# {"message":"Route not found","statusCode":404}
```

## Automatic Error Type Detection

`Exceptions.convert()` automatically detects and converts common error types:

### Database Errors

Mongoose/MongoDB errors are automatically converted:

```typescript
// MongoDB duplicate key error (code 11000) → ConflictError (409)
// Mongoose ValidationError → ValidationError (400)
// MongoNetworkError → AppError (503)
```

### Authentication Errors

JWT errors are automatically converted:

```typescript
// JsonWebTokenError → AuthenticationError (401, "Invalid token")
// TokenExpiredError → AuthenticationError (401, "Token expired")
```

### HTTP Errors

Axios/fetch errors are automatically converted:

```typescript
// HTTP 4xx errors → AppError with matching status code
```

## Utility Functions

### isOperational()

Check if an error is operational (expected) vs programming error:

```typescript
import { isOperational } from '@wsd-ai-services-wespa/backend-common';

if (isOperational(error)) {
  // Expected error - log as warning
} else {
  // Programming error - log as error, alert team
}
```

### getStatusCode()

Extract HTTP status code from any error:

```typescript
import { getStatusCode } from '@wsd-ai-services-wespa/backend-common';

const statusCode = getStatusCode(error); // Returns 500 for non-AppError
```

## Best Practices

1. **Always use Exceptions.convert()** in catch blocks
2. **Add meaningful context** to help debugging
3. **Use specific error classes** when throwing new errors
4. **Preserve stack traces** by passing original error
5. **Don't catch and ignore** - always handle or propagate
6. **Operational vs Programming**: Use appropriate `isOperational` flag

## Anti-Patterns

❌ **Don't catch without converting:**

```typescript
try {
  await operation();
} catch (error) {
  throw error; // Missing convert()
}
```

✅ **Always convert:**

```typescript
try {
  await operation();
} catch (error) {
  throw convert(error, 'Operation');
}
```

---

❌ **Don't lose context:**

```typescript
catch (error) {
  throw convert(error); // Missing context
}
```

✅ **Add context:**

```typescript
catch (error) {
  throw convert(error, 'User registration');
}
```

---

❌ **Don't create generic errors for known cases:**

```typescript
if (!user) {
  throw new AppError('Not found', 404);
}
```

✅ **Use specific error classes:**

```typescript
if (!user) {
  throw new NotFoundError('User not found');
}
```

## Integration with Web Server

The web server automatically handles all errors via middleware:

1. All unhandled errors are caught by the error middleware
2. Errors are converted to AppError using `Exceptions.convert()`
3. HTTP status code is extracted
4. Appropriate JSON response is sent
5. Stack traces are hidden for non-operational errors

No additional error handling configuration is needed in route handlers - just throw errors or pass them to `next()`.

## Testing Exception Handling

When writing tests, you can verify error types:

```typescript
import { ValidationError } from '@wsd-ai-services-wespa/backend-common';

it('should throw ValidationError for invalid input', async () => {
  await expect(createUser({ email: '' })).rejects.toThrow(ValidationError);
});
```

## Summary

- ✅ Use `Exceptions.convert()` in all catch blocks
- ✅ Add context strings for better debugging
- ✅ Use specific error classes when throwing
- ✅ Let the web server middleware handle the rest
- ✅ Trust the automatic error type detection
