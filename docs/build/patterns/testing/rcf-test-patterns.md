# RCF Test Suite Patterns

## Overview

This document defines test organization patterns that integrate with the RCF (Requirements and Compliance Framework) traceability system.

## RCF Traceability Chain

```
PRD → REQ → US → AC → TS → TC
```

| Artifact | Meaning             | Scope                                   |
| -------- | ------------------- | --------------------------------------- |
| US       | User Story          | What the user wants to accomplish       |
| AC       | Acceptance Criteria | Specific testable condition within a US |
| TS       | Test Suite          | Single test spec file covering one AC   |
| TC       | Test Case           | Individual test within a TS             |

## Test Types

### Unit Tests

**Purpose:** Test key/core utilities and services in isolation.

**Rule:** Mock ALL dependencies (internal and external).

**Technologies:**

- Backend: `node:test`, `sinon`
- Frontend: `vitest`

**RCF Traceability:** Not required. Unit tests are implementation-focused, not story-focused.

### Integration Tests (RCF)

**Purpose:** Test backend API and/or socket endpoints against a running application instance with real dependencies (database, cache, etc.).

**Rule:** Use ONLY when there is no UI component to test. If a user story has UI, use E2E instead.

**Technologies:** `node:test`, `axios`

**RCF Traceability:** Required. Organized by US/AC.

### E2E Tests (RCF)

**Purpose:** Test full end-to-end user flows via the browser UI.

**Rule:** Use when the user story has a UI element as the primary driver.

**Technologies:** Playwright (headless Chrome only)

**RCF Traceability:** Required. Organized by US/AC.

## Folder Structure

```
tests/
├── unit/
│   ├── apps/
│   │   ├── backend/              # Backend unit tests
│   │   └── frontend/             # Frontend unit tests
│   └── packages/
│       └── shared/               # Shared library unit tests
│
├── integration/
│   └── backend/
│       └── US-{XXX}/             # User Story folder
│           ├── AC-{XXX}.spec.js  # One TS per AC
│           └── AC-{XXX}.spec.js
│
└── e2e/
    └── frontend/
        └── US-{XXX}/             # User Story folder
            ├── AC-{XXX}.spec.js  # One TS per AC
            └── AC-{XXX}.spec.js
```

## File Naming

| Test Type       | Pattern            | Example                   |
| --------------- | ------------------ | ------------------------- |
| Unit (backend)  | `{module}.test.js` | `costCalculator.test.js`  |
| Unit (frontend) | `{module}.test.js` | `useDistribution.test.js` |
| Integration     | `AC-{XXX}.spec.js` | `AC-301.spec.js`          |
| E2E             | `AC-{XXX}.spec.js` | `AC-301.spec.js`          |

## Test Case Numbering

TC numbers are unique within their TS file only. The full traceability path provides global uniqueness.

**Pattern:** `TC-{NNN}` starting at `TC-001` per file.

**Full path example:** `US-123/AC-456/TC-002`

## Test File Structure

### Integration Test Example

```javascript
// tests/integration/backend/US-123/AC-456.spec.js
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';

/**
 * TS: AC-456 - Configuration persists to database
 * US: US-123 - Create dataset configuration
 * REQ: REQ-008
 */
describe('AC-456: Configuration persists to database', () => {
  // TC-001
  it('TC-001: saves configuration with all required fields', async () => {
    // test implementation
  });

  // TC-002
  it('TC-002: returns saved configuration with generated ID', async () => {
    // test implementation
  });

  // TC-003
  it('TC-003: rejects configuration with missing required fields', async () => {
    // test implementation
  });
});
```

### E2E Test Example

```javascript
// tests/e2e/frontend/US-123/AC-456.spec.js
import { test, expect } from '@playwright/test';

/**
 * TS: AC-456 - User can save new configuration
 * US: US-123 - Create dataset configuration
 * REQ: REQ-008
 */
test.describe('AC-456: User can save new configuration', () => {
  // TC-001
  test('TC-001: form submits and shows success message', async ({ page }) => {
    // test implementation
  });

  // TC-002
  test('TC-002: saved configuration appears in list', async ({ page }) => {
    // test implementation
  });
});
```

## Decision Guide: Integration vs E2E

```
Does the User Story involve UI interaction?
│
├── YES → Use E2E tests (Playwright)
│         Location: tests/e2e/frontend/US-{XXX}/
│
└── NO  → Use Integration tests (node:test + axios)
          Location: tests/integration/backend/US-{XXX}/
```

## Traceability Header

Every RCF test file must include a JSDoc header linking back to the RCF chain:

```javascript
/**
 * TS: AC-{XXX} - {AC title/description}
 * US: US-{XXX} - {User story title}
 * REQ: REQ-{XXX}
 */
```

## Summary

| Aspect             | Rule                                        |
| ------------------ | ------------------------------------------- |
| TS per AC          | One test suite file per acceptance criteria |
| TC numbering       | Unique within TS only (TC-001, TC-002, ...) |
| Folder per US      | Group all ACs for a story in one folder     |
| Integration vs E2E | UI present = E2E; No UI = Integration       |
| Unit tests         | Outside RCF traceability; mock everything   |
