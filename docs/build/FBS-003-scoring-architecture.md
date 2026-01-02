# FBS-003: Scoring Service & Architecture

**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 12
**Dependencies:** FBS-001

---

## Summary

Implement Python scoring service with IRT algorithms (1PL, 2PL, 3PL), decoupled API, and performance optimizations for sub-200ms latency.

---

## User Stories Covered

| Story ID | Title | ACs |
|----------|-------|-----|
| US-013 | Implement Scoring Strategy | AC-036, AC-037, AC-038 |
| US-014 | Call Scoring Service | AC-039, AC-040, AC-041 |
| US-015 | Receive Next Question Quickly | AC-042, AC-043, AC-044 |
| US-016 | Scale During Peak Periods | AC-045, AC-046, AC-047 |

---

## Requirements Traceability

| Requirement | Title | Priority |
|-------------|-------|----------|
| REQ-012 | Strategy Pattern Implementation | Must |
| REQ-013 | Service Decoupling | Must |
| REQ-014 | Next-Item Latency | Must |
| REQ-015 | Horizontal Scaling | Must |

---

## Testable Outcomes

1. Scoring strategies implement defined interface correctly
2. Scoring service is callable via REST API with versioned contracts
3. Next-item selection completes in < 200ms (P95)
4. System scales horizontally under load

---

## Implementation Tasks

### Task 1: Python Scoring Service Setup
- Create FastAPI service structure
- Implement IRT scoring algorithms (1PL, 2PL, 3PL)
- Add theta estimation with MLE/EAP methods

### Task 2: API Contract Definition
- Define REST API endpoints with OpenAPI spec
- Implement versioned API contracts
- Add response validation

### Task 3: Performance Optimization
- Pre-fetch candidate questions
- Redis caching for item parameters
- Connection pooling

### Task 4: Kubernetes Scaling
- Define HPA configuration
- Load testing to validate 10,000 sessions
- Monitoring and alerting setup

---

## Deliverables

```
apps/scoring-service/
packages/@uat/backend-scoring/
tests/integration/backend/US-013/
tests/integration/backend/US-014/
tests/integration/backend/US-015/
tests/integration/backend/US-016/
```

---

## Session History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-02 | Created | Initial FBS document |

