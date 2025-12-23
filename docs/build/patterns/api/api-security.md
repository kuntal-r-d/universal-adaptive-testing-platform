# API Security Patterns

## Overview

This document describes the security patterns and middleware implemented for the WESPA API service, including CORS (Cross-Origin Resource Sharing), CSP (Content Security Policy), and Rate Limiting.

## Security Middleware Stack

The WESPA API uses a layered security approach with middleware applied in this order:

1. **CORS** - Validates request origins and handles preflight requests
2. **Security Headers** - Sets CSP, HSTS, and other security headers via Helmet
3. **Rate Limiting** - Redis-backed request rate limiting per IP
4. **Request Logger** - Logs all requests with security context
5. **API Routes** - Application endpoints
6. **Error Handler** - Centralized error handling (must be last)

**Middleware Order is Critical**: Security middleware must be applied before routes to protect all endpoints.

## CORS (Cross-Origin Resource Sharing)

### Purpose

CORS prevents unauthorized web applications from accessing API resources. It validates request origins and controls what headers and methods are allowed.

### Implementation

**Location**: `packages/@wsd-ai-services-wespa/backend-common/src/middleware/cors.middleware.ts`

**Configuration**: `apps/api-service/src/config/security.config.ts`

```typescript
import { createCorsMiddleware } from '@wsd-ai-services-wespa/backend-common';

// Apply CORS middleware
server.app.use(createCorsMiddleware(securityConfig.cors));
```

### Configuration Options

| Environment Variable | Description                               | Default                             | Example                                         |
| -------------------- | ----------------------------------------- | ----------------------------------- | ----------------------------------------------- |
| `CORS_ORIGINS`       | Comma-separated list of allowed origins   | `[]` (production)                   | `https://app.example.com,https://*.example.com` |
| `CORS_CREDENTIALS`   | Allow credentials (cookies, auth headers) | `true`                              | `true`, `false`                                 |
| `CORS_METHODS`       | Allowed HTTP methods                      | `GET,POST,PUT,DELETE,PATCH,OPTIONS` | Custom list                                     |
| `CORS_MAX_AGE`       | Preflight cache duration (seconds)        | `86400` (24 hours)                  | `3600`                                          |

### Wildcard Pattern Matching

CORS origins support wildcard patterns for subdomains:

- `https://example.com` - Exact match only
- `https://*.example.com` - Matches all subdomains
- `http://localhost:*` - Matches localhost on any port

### Development vs Production

**Development** (`NODE_ENV=development`):

- Allows all `localhost` and `127.0.0.1` origins with any port
- More permissive for hot-reload and dev tools

**Production** (`NODE_ENV=production`):

- Requires explicit origin whitelist via `CORS_ORIGINS`
- Strict validation, rejects unlisted origins

### Preflight Requests

CORS automatically handles OPTIONS preflight requests for:

- Custom headers (Authorization, etc.)
- Methods other than GET/POST
- Credentials in cross-origin requests

### Security Considerations

- **Never use `*` in production** - Always specify explicit origins
- **Case-sensitive matching** - `https://example.com` ≠ `https://EXAMPLE.COM`
- **Protocol matters** - `http://` and `https://` are different origins
- **Port matters** - `https://example.com` ≠ `https://example.com:3000`

### Example Configuration

**.env (Production)**:

```bash
CORS_ORIGINS=https://app.example.com,https://*.example.com,https://admin.example.com
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

**.env (Development)**:

```bash
# Automatically allows localhost:*, no configuration needed
NODE_ENV=development
```

## Content Security Policy (CSP) & Security Headers

### Purpose

Security headers protect against common web vulnerabilities:

- **CSP**: Prevents XSS by controlling resource loading
- **HSTS**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- And more...

### Implementation

**Location**: `packages/@wsd-ai-services-wespa/backend-common/src/middleware/security-headers.middleware.ts`

```typescript
import { createSecurityHeadersMiddleware } from '@wsd-ai-services-wespa/backend-common';

// Apply security headers
server.app.use(createSecurityHeadersMiddleware(securityConfig.securityHeaders));
```

### Security Headers Applied

| Header                      | Value                                          | Purpose                                 |
| --------------------------- | ---------------------------------------------- | --------------------------------------- |
| `Content-Security-Policy`   | Strict policy                                  | Prevents XSS and data injection attacks |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS (production only)          |
| `X-Frame-Options`           | `DENY`                                         | Prevents clickjacking                   |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevents MIME type sniffing             |
| `Referrer-Policy`           | `no-referrer`                                  | Protects referrer information           |
| `X-DNS-Prefetch-Control`    | `off`                                          | Disables DNS prefetching                |
| `X-Download-Options`        | `noopen`                                       | Prevents file execution in IE           |
| `Origin-Agent-Cluster`      | `?1`                                           | Isolates agent clusters                 |

**Removed Headers**:

- `X-Powered-By` - Removed to hide technology stack
- `X-XSS-Protection` - Deprecated and potentially dangerous

### CSP Policy (Production API)

```
default-src 'none';
script-src 'none';
style-src 'none';
img-src 'none';
font-src 'none';
connect-src 'self';
media-src 'none';
object-src 'none';
frame-ancestors 'none';
form-action 'none';
base-uri 'none';
```

This strict policy is appropriate for API-only services. For services with UI, use development preset or customize.

### Development vs Production

**Development**:

- CSP in `report-only` mode (logs violations, doesn't block)
- No HSTS (allows HTTP for local development)
- More permissive script/style directives for dev tools

**Production**:

- CSP in enforce mode (blocks violations)
- HSTS enabled with 2-year max-age
- Strict policies appropriate for API service

### Configuration

| Environment Variable | Description                   | Example                                          |
| -------------------- | ----------------------------- | ------------------------------------------------ |
| `CSP_REPORT_URI`     | CSP violation report endpoint | `https://example.report-uri.com/r/d/csp/enforce` |

### CSP Reporting

To monitor CSP violations in production:

1. Set up CSP reporting service (e.g., report-uri.com)
2. Configure `CSP_REPORT_URI` environment variable
3. Monitor reports for potential XSS attempts or misconfigurations

## Rate Limiting

### Purpose

Rate limiting prevents abuse by limiting the number of requests a client can make in a time window. Protects against:

- Brute force attacks
- DDoS attacks
- API abuse
- Resource exhaustion

### Implementation

**Location**: `packages/@wsd-ai-services-wespa/backend-common/src/middleware/rate-limiter.middleware.ts`

**Storage**: Redis (required for distributed rate limiting)

```typescript
import { createGlobalRateLimiter } from '@wsd-ai-services-wespa/backend-common';

// Apply global rate limiting
server.app.use(createGlobalRateLimiter(securityConfig.rateLimiting.global));
```

### Configuration Options

| Environment Variable     | Description                            | Default                                      | Example           |
| ------------------------ | -------------------------------------- | -------------------------------------------- | ----------------- |
| `RATE_LIMIT_MAX`         | Max requests per window                | `100`                                        | `1000`            |
| `RATE_LIMIT_WINDOW_MS`   | Time window in milliseconds            | `60000` (1 min)                              | `900000` (15 min) |
| `RATE_LIMIT_SKIP_FAILED` | Continue if Redis unavailable          | `true`                                       | `true`, `false`   |
| `RATE_LIMIT_HEADERS`     | Include rate limit headers in response | `true`                                       | `true`, `false`   |
| `RATE_LIMIT_MESSAGE`     | Custom error message                   | `Too many requests, please try again later.` | Custom message    |

### Endpoint-Specific Rate Limits

Configure different limits for different endpoint types:

```bash
# Global limit
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# Auth endpoints (stricter)
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_AUTH_WINDOW_MS=900000

# Search endpoints (moderate)
RATE_LIMIT_SEARCH_MAX=30
RATE_LIMIT_SEARCH_WINDOW_MS=60000
```

### IP Address Tracking

Rate limits are tracked per IP address using:

1. `X-Forwarded-For` header (first IP in list)
2. `X-Real-IP` header
3. Socket remote address (fallback)

**Production Note**: Ensure your reverse proxy (nginx, AWS ALB, etc.) correctly sets `X-Forwarded-For`.

### Rate Limit Headers

Responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-11-11T12:00:00.000Z
Retry-After: 60
```

### Error Response (429 Too Many Requests)

```json
{
  "error": "Too many requests, please try again later.",
  "statusCode": 429
}
```

### Rate Limit Presets

Pre-configured rate limits for common scenarios:

| Preset     | Max Requests | Window | Use Case                 |
| ---------- | ------------ | ------ | ------------------------ |
| `strict`   | 10           | 1 min  | Sensitive operations     |
| `standard` | 100          | 1 min  | General API endpoints    |
| `relaxed`  | 500          | 1 min  | Health checks, metrics   |
| `api`      | 1000         | 15 min | High-volume integrations |
| `auth`     | 5            | 15 min | Login, password reset    |
| `search`   | 30           | 1 min  | Search/query endpoints   |

### Graceful Degradation

If Redis is unavailable:

- **Default behavior** (`RATE_LIMIT_SKIP_FAILED=true`): Allows requests through (fail open)
- **Strict mode** (`RATE_LIMIT_SKIP_FAILED=false`): Blocks requests (fail closed)

**Recommendation**: Use fail-open in production to prevent Redis outages from taking down your API.

### Redis Key Structure

Rate limit keys in Redis:

```
{prefix}rate-limit:{ip}:{method}:{path}
```

Example:

```
wespa:rate-limit:192.168.1.1:GET:/api/users
wespa:global-rate-limit:192.168.1.1
```

Keys automatically expire based on the configured window.

## Security Best Practices

### 1. Environment Configuration

**Never commit secrets to `.env` files**. Use these patterns:

- **Development**: Local `.env` file (gitignored)
- **Staging/Production**: Environment variables from deployment platform
- **CI/CD**: Secrets management system (AWS Secrets Manager, HashiCorp Vault, etc.)

### 2. Origin Whitelist Management

```bash
# Production - explicit whitelist
CORS_ORIGINS=https://app.example.com,https://admin.example.com

# Staging - subdomain wildcard
CORS_ORIGINS=https://*.staging.example.com

# Development - automatic localhost handling
NODE_ENV=development
```

### 3. Rate Limiting Strategy

- **Start strict, relax as needed**: Begin with conservative limits
- **Monitor rate limit hits**: Track how often users hit limits
- **Different limits per endpoint**: Auth < Standard < Health checks
- **Consider user tiers**: Premium users may need higher limits

### 4. CSP Policy Iteration

1. Start with `report-only` mode
2. Monitor violation reports
3. Adjust policy to allow legitimate resources
4. Enable enforcement
5. Continue monitoring

### 5. Redis High Availability

- Use Redis Cluster or Sentinel for production
- Configure `RATE_LIMIT_SKIP_FAILED=true` to prevent cascading failures
- Monitor Redis health and connection pool

### 6. Security Headers Verification

Test security headers using:

- [securityheaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- Browser developer tools

## Testing Security Middleware

### Integration Tests

Comprehensive integration tests are provided:

```bash
# Run all integration tests
pnpm test:integration

# Run specific security tests
pnpm test:integration test/integration/api/security-cors.test.ts
pnpm test:integration test/integration/api/security-headers.test.ts
pnpm test:integration test/integration/api/security-rate-limit.test.ts
```

### Manual Testing

**Test CORS**:

```bash
# Valid origin
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS http://localhost:4500/api/health

# Invalid origin
curl -H "Origin: https://malicious.com" \
     -X OPTIONS http://localhost:4500/api/health
```

**Test Rate Limiting**:

```bash
# Hit endpoint multiple times
for i in {1..10}; do
  curl http://localhost:4500/api/health/ping
  echo "Request $i"
done
```

**Test Security Headers**:

```bash
curl -I http://localhost:4500/api/health/ping | grep -E "(Content-Security-Policy|X-Frame-Options|Strict-Transport-Security)"
```

## Troubleshooting

### CORS Issues

**Problem**: Requests blocked by CORS

**Solutions**:

1. Check `CORS_ORIGINS` includes the requesting origin
2. Verify origin matches exactly (protocol, domain, port)
3. Check browser console for CORS error details
4. Verify OPTIONS preflight succeeds before actual request

### Rate Limiting Issues

**Problem**: Legitimate users hitting rate limits

**Solutions**:

1. Increase `RATE_LIMIT_MAX` or `RATE_LIMIT_WINDOW_MS`
2. Implement user-specific rate limits (not just IP-based)
3. Whitelist specific IPs (trusted services)
4. Use Redis to check current rate limit status

**Problem**: Rate limiting not working

**Solutions**:

1. Verify Redis is running and accessible
2. Check `REDIS_URL` environment variable
3. Test Redis connection: `redis-cli -p 6400 ping`
4. Check logs for rate limiting middleware errors

### CSP Issues

**Problem**: Resources blocked by CSP

**Solutions**:

1. Check browser console for CSP violation details
2. Add allowed sources to CSP directives
3. Use `report-only` mode during development
4. Verify CSP report endpoint receives violations

### Security Header Issues

**Problem**: Missing security headers

**Solutions**:

1. Verify middleware order (headers before routes)
2. Check security headers are enabled in config
3. Test with `curl -I` to see all response headers
4. Verify no other middleware removes headers

## Monitoring & Alerting

### Key Metrics to Monitor

1. **Rate Limit Hits**
   - Track `429` response codes
   - Alert on sudden spikes (potential attack)
   - Monitor per-endpoint hit rates

2. **CORS Rejections**
   - Log rejected origins
   - Alert on new/unexpected origins
   - Track rejection rate over time

3. **CSP Violations**
   - Monitor CSP report endpoint
   - Alert on new violation types
   - Track violation sources

4. **Redis Health**
   - Connection pool utilization
   - Command latency
   - Memory usage
   - Connection failures

### Logging

Security middleware logs include:

```typescript
// CORS rejection
{ origin: 'https://malicious.com', allowedOrigins: [...], event: 'cors_rejected' }

// Rate limit exceeded
{ ip: '192.168.1.1', endpoint: 'GET /api/users', limit: 100, current: 101, event: 'rate_limit_exceeded' }

// Redis failure
{ error: 'Connection refused', event: 'redis_connection_failed' }
```

## Deployment Checklist

Before deploying to production:

- [ ] Set explicit `CORS_ORIGINS` (no wildcards)
- [ ] Configure appropriate `RATE_LIMIT_MAX` based on load testing
- [ ] Enable CSP enforcement mode (`NODE_ENV=production`)
- [ ] Set up CSP reporting endpoint
- [ ] Verify Redis cluster is highly available
- [ ] Configure `X-Forwarded-For` in reverse proxy
- [ ] Test all security headers with online tools
- [ ] Set up monitoring and alerting for security metrics
- [ ] Document rate limits in API documentation
- [ ] Test rate limiting under load
- [ ] Verify HSTS is enabled (production only)
- [ ] Review and test error messages (don't leak information)

## Further Reading

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP: Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
