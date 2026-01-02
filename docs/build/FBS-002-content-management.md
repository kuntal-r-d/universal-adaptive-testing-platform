# FBS-002: Content Management

**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 8
**Dependencies:** FBS-001

---

## Summary

Implement question storage with JSONB, hierarchical tagging, psychometric metadata management, and content workflow (draft → review → active).

---

## User Stories Covered

| Story ID | Title | ACs |
|----------|-------|-----|
| US-005 | Store Flexible Question Content | AC-012, AC-013, AC-014 |
| US-006 | Tag Questions Hierarchically | AC-015, AC-016, AC-017 |
| US-007 | Manage Psychometric Parameters | AC-018, AC-019, AC-020 |
| US-009 | Approve Draft Questions | AC-024, AC-025, AC-026 |

---

## Requirements Traceability

| Requirement | Title | Priority |
|-------------|-------|----------|
| REQ-004 | Dynamic Item Schema | Must |
| REQ-005 | Hierarchical Tagging | Must |
| REQ-006 | Psychometric Metadata | Must |
| REQ-008 | Human-in-the-Loop Validation | Must |

---

## Testable Outcomes

1. Questions can be created with flexible JSONB content structure
2. Questions can be tagged with hierarchical taxonomy
3. Psychometric parameters can be set and bulk imported
4. Questions follow workflow from draft to active status

---

## Implementation Tasks

### Task 1: Question JSONB Schema
- Define flexible question content structure
- Support MCQ, SATA, fill-blank, drag-drop types
- Enable media attachments (images, audio)

### Task 2: Hierarchical Tagging
- Implement tag tree with up to 5 levels
- Enable tag inheritance for searches
- Create tag management API

### Task 3: Psychometric Parameters
- Store alpha, beta, gamma parameters
- Support bulk import from calibration data
- Track exposure counts and calibration dates

### Task 4: Content Workflow
- Implement status transitions (DRAFT → PENDING_REVIEW → ACTIVE → RETIRED)
- Create approval API endpoints
- Log workflow history

---

## Deliverables

```
apps/api-service/src/services/question/
apps/api-service/src/api/routes/questions.ts
tests/integration/backend/US-005/
tests/integration/backend/US-006/
tests/integration/backend/US-007/
tests/integration/backend/US-009/
```

---

## Session History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-02 | Created | Initial FBS document |

