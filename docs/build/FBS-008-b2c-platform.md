# FBS-008: B2C Platform

**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 14
**Dependencies:** FBS-007

---

## Summary

Implement exam catalog, subscription plans, one-time purchases, mobile app, and cross-device progress sync.

---

## User Stories Covered

| Story ID | Title | ACs |
|----------|-------|-----|
| US-028 | Browse Exam Catalog | AC-083, AC-084, AC-085, AC-086 |
| US-029 | Subscribe to Exam Plans | AC-087, AC-088, AC-089, AC-090 |
| US-030 | Purchase Individual Exams | AC-091, AC-092, AC-093, AC-094 |
| US-031 | Use Mobile App | AC-095, AC-096, AC-097, AC-098 |
| US-032 | Sync Progress Across Devices | AC-099, AC-100, AC-101, AC-102 |

---

## Requirements Traceability

| Requirement | Title | Priority |
|-------------|-------|----------|
| REQ-027 | Platform Exam Catalog | Must |
| REQ-028 | Student Subscription Plans | Must |
| REQ-029 | One-Time Exam Purchases | Must |
| REQ-030 | Mobile App Support | Should |
| REQ-031 | Progress Sync Across Devices | Must |

---

## Testable Outcomes

1. Exam catalog is browsable with filters and search
2. Subscriptions can be created and managed via Stripe
3. One-time purchases grant permanent exam access
4. Mobile app provides optimized exam experience
5. Progress syncs across devices in real-time

---

## Implementation Tasks

### Task 1: Exam Catalog
- Browsable catalog with categories
- Filtering and search
- Exam detail pages with samples
- Pricing display

### Task 2: Stripe Subscriptions
- Checkout session creation
- Webhook handling
- Subscription management (upgrade/downgrade/cancel)
- Access control based on plan

### Task 3: One-Time Purchases
- Purchase checkout flow
- Grant permanent access
- Purchase history
- Bundle discounts

### Task 4: Mobile App
- React Native project setup
- Exam-taking UI optimized for touch
- Offline caching
- Push notifications

### Task 5: Progress Sync
- Sync token management
- Real-time updates (< 5 seconds)
- Conflict resolution
- Offline queue with sync on reconnect

---

## Deliverables

```
apps/spa-student/
apps/mobile-app/
packages/@uat/backend-payments/
apps/api-service/src/services/catalog/
apps/api-service/src/services/sync/
tests/integration/backend/US-028/
tests/integration/backend/US-029/
tests/integration/backend/US-030/
tests/integration/backend/US-031/
tests/integration/backend/US-032/
```

---

## Session History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-02 | Created | Initial FBS document |

