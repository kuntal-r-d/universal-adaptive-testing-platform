# Build Index

**Project:** Universal Adaptive Testing Platform
**PRD:** PRD-001
**TAD:** TAD-001
**Build Sequence:** BS-001
**Phase:** Phase 1 - B2C Platform
**Last Updated:** 2026-01-02

---

## Overview

This Build Index tracks all Feature Build Specifications (FBS) for Phase 1 B2C of the Universal Adaptive Testing Platform. Each FBS groups related user stories and acceptance criteria that can be built and verified together.

**Build Philosophy:** Foundation-first approach building core engine infrastructure before layering on content management, analytics, and B2C features. Each FBS delivers testable, user-facing functionality.

**Generation Strategy:** dependency-first

---

## Phase 1 B2C - Feature Build Sequence

| FBS ID | Feature | User Stories | Dependencies | Status | Est. Hours |
|--------|---------|--------------|--------------|--------|------------|
| FBS-001 | Core Engine Foundation | US-001, US-002, US-003, US-004 | None | Not Started | 12 |
| FBS-002 | Content Management | US-005, US-006, US-007, US-009 | FBS-001 | Not Started | 8 |
| FBS-003 | Scoring Service & Architecture | US-013, US-014, US-015, US-016 | FBS-001 | Not Started | 12 |
| FBS-004 | Security & Data Integrity | US-017, US-018, US-019, US-020 | FBS-001, FBS-003 | Not Started | 8 |
| FBS-005 | Student Analytics | US-010, US-011, US-012, US-021, US-022, US-023 | FBS-001, FBS-003 | Not Started | 10 |
| FBS-006 | AI Content Generation | US-008 | FBS-002 | Not Started | 6 |
| FBS-007 | Exam Management & Admin | US-024, US-025, US-026, US-027 | FBS-002, FBS-005 | Not Started | 8 |
| FBS-008 | B2C Platform | US-028, US-029, US-030, US-031, US-032 | FBS-007 | Not Started | 14 |

**Total Estimated Hours:** 78

---

## Status Legend

| Status | Description |
|--------|-------------|
| Not Started | FBS not yet begun |
| Specifying | Writing test specifications (SPECIFY phase) |
| Building | Implementation in progress (BUILD phase) |
| Reviewing | Code review and gap analysis (REVIEW phase) |
| Verifying | Running tests, fixing issues (VERIFY phase) |
| Complete | All tests passing, signed off (SIGN-OFF complete) |
| Blocked | Waiting on dependency |

---

## Dependency Graph

```
FBS-001 (Core Engine Foundation)
    ├── FBS-002 (Content Management)
    │       ├── FBS-006 (AI Content Generation)
    │       └── FBS-007 (Exam Management & Admin) ←─┐
    │               └── FBS-008 (B2C Platform)     │
    ├── FBS-003 (Scoring & Architecture)           │
    │       ├── FBS-004 (Security & Data Integrity)│
    │       └── FBS-005 (Student Analytics) ───────┘
    └── FBS-004 (Security & Data Integrity)
```

---

## Feature Build Specifications

### FBS-001: Core Engine Foundation

**Document:** `docs/build/FBS-001-core-engine.md`
**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 12

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-001 | Configure Exam Methodology | AC-001, AC-002, AC-003 | Not Started |
| US-002 | Add New Exam Type | AC-004, AC-005 | Not Started |
| US-003 | Resume Interrupted Exam | AC-006, AC-007, AC-008 | Not Started |
| US-004 | Navigate Exam Questions | AC-009, AC-010, AC-011 | Not Started |

**Testable Outcomes:**
- Exam profiles can be created with configurable methodology (CAT, LOFT, LINEAR)
- New scoring strategies can be added without modifying core engine
- Interrupted sessions can be resumed with full state restoration
- Navigation rules are enforced based on exam type configuration

**Covers Requirements:** REQ-001, REQ-002, REQ-003

---

### FBS-002: Content Management

**Document:** `docs/build/FBS-002-content-management.md`
**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 8
**Depends On:** FBS-001

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-005 | Store Flexible Question Content | AC-012, AC-013, AC-014 | Not Started |
| US-006 | Tag Questions Hierarchically | AC-015, AC-016, AC-017 | Not Started |
| US-007 | Manage Psychometric Parameters | AC-018, AC-019, AC-020 | Not Started |
| US-009 | Approve Draft Questions | AC-024, AC-025, AC-026 | Not Started |

**Testable Outcomes:**
- Questions can be created with flexible JSONB content structure
- Questions can be tagged with hierarchical taxonomy
- Psychometric parameters can be set and bulk imported
- Questions follow workflow from draft to active status

**Covers Requirements:** REQ-004, REQ-005, REQ-006, REQ-008

---

### FBS-003: Scoring Service & Architecture

**Document:** `docs/build/FBS-003-scoring-architecture.md`
**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 12
**Depends On:** FBS-001

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-013 | Implement Scoring Strategy | AC-036, AC-037, AC-038 | Not Started |
| US-014 | Call Scoring Service | AC-039, AC-040, AC-041 | Not Started |
| US-015 | Receive Next Question Quickly | AC-042, AC-043, AC-044 | Not Started |
| US-016 | Scale During Peak Periods | AC-045, AC-046, AC-047 | Not Started |

**Testable Outcomes:**
- Scoring strategies implement defined interface correctly
- Scoring service is callable via REST API with versioned contracts
- Next-item selection completes in < 200ms (P95)
- System scales horizontally under load

**Covers Requirements:** REQ-012, REQ-013, REQ-014, REQ-015

---

### FBS-004: Security & Data Integrity

**Document:** `docs/build/FBS-004-security-integrity.md`
**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 8
**Depends On:** FBS-001, FBS-003

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-017 | Control Item Exposure | AC-048, AC-049, AC-050 | Not Started |
| US-018 | Prevent Question Harvesting | AC-051, AC-052, AC-053 | Not Started |
| US-019 | Review Audit Logs | AC-054, AC-055, AC-056 | Not Started |
| US-020 | Ensure Exam Results Persist | AC-057, AC-058, AC-059 | Not Started |

**Testable Outcomes:**
- Item exposure limits are enforced during selection
- Rate limiting blocks excessive requests
- All test-taker actions are logged immutably
- Exam results persist with transaction guarantees

**Covers Requirements:** REQ-016, REQ-017, REQ-018, REQ-019

---

### FBS-005: Student Analytics

**Document:** `docs/build/FBS-005-student-analytics.md`
**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 10
**Depends On:** FBS-001, FBS-003

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-010 | View Learning Gaps | AC-027, AC-028, AC-029 | Not Started |
| US-011 | Predict Readiness Date | AC-030, AC-031, AC-032 | Not Started |
| US-012 | Get Personalized Study Tasks | AC-033, AC-034, AC-035 | Not Started |
| US-021 | View Progress Dashboard | AC-060, AC-061, AC-062 | Not Started |
| US-022 | Review Post-Exam Analytics | AC-063, AC-064, AC-065, AC-066 | Not Started |
| US-023 | Get Study Time Recommendations | AC-067, AC-068, AC-069 | Not Started |

**Testable Outcomes:**
- Gap analysis displays current vs target theta
- Readiness date is predicted based on improvement velocity
- Personalized study tasks are generated
- Progress dashboard shows charts and trends
- Post-exam analytics display detailed breakdown
- Study time recommendations are calculated per topic

**Covers Requirements:** REQ-009, REQ-010, REQ-011, REQ-020, REQ-021, REQ-022

---

### FBS-006: AI Content Generation

**Document:** `docs/build/FBS-006-ai-generation.md`
**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 6
**Depends On:** FBS-002

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-008 | Generate Questions with AI | AC-021, AC-022, AC-023 | Not Started |

**Testable Outcomes:**
- AI can generate draft questions from topic prompts
- Generated questions are marked as DRAFT status
- Users can edit, accept, or reject generated questions

**Covers Requirements:** REQ-007

---

### FBS-007: Exam Management & Admin

**Document:** `docs/build/FBS-007-exam-management.md`
**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 8
**Depends On:** FBS-002, FBS-005

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-024 | Take Topic-Focused Practice Exam | AC-070, AC-071, AC-072 | Not Started |
| US-025 | Schedule Exam Intelligently | AC-073, AC-074, AC-075 | Not Started |
| US-026 | Manage Questions in Admin Dashboard | AC-076, AC-077, AC-078, AC-079 | Not Started |
| US-027 | Organize Question Banks | AC-080, AC-081, AC-082 | Not Started |

**Testable Outcomes:**
- Topic-focused practice exams can be started from weak areas
- Intelligent exam scheduling suggests optimal dates
- Admin can CRUD questions with bulk import/export
- Questions can be organized into multiple banks

**Covers Requirements:** REQ-023, REQ-024, REQ-025, REQ-026

---

### FBS-008: B2C Platform

**Document:** `docs/build/FBS-008-b2c-platform.md`
**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 14
**Depends On:** FBS-007

| User Story | Title | ACs | Status |
|------------|-------|-----|--------|
| US-028 | Browse Exam Catalog | AC-083, AC-084, AC-085, AC-086 | Not Started |
| US-029 | Subscribe to Exam Plans | AC-087, AC-088, AC-089, AC-090 | Not Started |
| US-030 | Purchase Individual Exams | AC-091, AC-092, AC-093, AC-094 | Not Started |
| US-031 | Use Mobile App | AC-095, AC-096, AC-097, AC-098 | Not Started |
| US-032 | Sync Progress Across Devices | AC-099, AC-100, AC-101, AC-102 | Not Started |

**Testable Outcomes:**
- Exam catalog is browsable with filters and search
- Subscriptions can be created and managed via Stripe
- One-time purchases grant permanent exam access
- Mobile app provides optimized exam experience
- Progress syncs across devices in real-time

**Covers Requirements:** REQ-027, REQ-028, REQ-029, REQ-030, REQ-031

---

## Test Coverage Summary

| FBS | Total ACs | Tests Written | Tests Passing |
|-----|-----------|---------------|---------------|
| FBS-001 | 11 | 0 | 0 |
| FBS-002 | 12 | 0 | 0 |
| FBS-003 | 12 | 0 | 0 |
| FBS-004 | 12 | 0 | 0 |
| FBS-005 | 19 | 0 | 0 |
| FBS-006 | 3 | 0 | 0 |
| FBS-007 | 13 | 0 | 0 |
| FBS-008 | 20 | 0 | 0 |
| **Total** | **102** | **0** | **0** |

---

## RCF Build Process

For each FBS, follow the 5-step cycle:

1. **SPECIFY** - Write Test Specification (TS) from Acceptance Criteria
2. **BUILD** - Implement code to satisfy the acceptance criteria
3. **REVIEW** - Review implementation against specifications, identify gaps
4. **VERIFY** - Implement and run test cases (TC) against running service
5. **SIGN-OFF** - All tests pass, CI green, move to next FBS

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-02 | Build Team | Initial Build Index aligned with BS-001 |
