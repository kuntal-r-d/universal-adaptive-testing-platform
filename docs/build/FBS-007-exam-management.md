# FBS-007: Exam Management & Admin

**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 8
**Dependencies:** FBS-002, FBS-005

---

## Summary

Implement topic-based practice exams, intelligent scheduling, admin question dashboard, and question bank organization.

---

## User Stories Covered

| Story ID | Title | ACs |
|----------|-------|-----|
| US-024 | Take Topic-Focused Practice Exam | AC-070, AC-071, AC-072 |
| US-025 | Schedule Exam Intelligently | AC-073, AC-074, AC-075 |
| US-026 | Manage Questions in Admin Dashboard | AC-076, AC-077, AC-078, AC-079 |
| US-027 | Organize Question Banks | AC-080, AC-081, AC-082 |

---

## Requirements Traceability

| Requirement | Title | Priority |
|-------------|-------|----------|
| REQ-023 | Topic-Based Practice Exams | Must |
| REQ-024 | Intelligent Exam Scheduling | Should |
| REQ-025 | Admin Question Management Dashboard | Must |
| REQ-026 | Question Bank Organization | Must |

---

## Testable Outcomes

1. Topic-focused practice exams can be started from weak areas
2. Intelligent exam scheduling suggests optimal dates
3. Admin can CRUD questions with bulk import/export
4. Questions can be organized into multiple banks

---

## Implementation Tasks

### Task 1: Topic Practice Exams
- Generate exam from specific topic
- Link from weak areas in analytics
- Track topic-specific improvement

### Task 2: Intelligent Scheduling
- Calculate readiness based on current proficiency
- Suggest optimal exam date
- Factor in study velocity

### Task 3: Admin Dashboard API
- CRUD endpoints for questions
- Bulk import (CSV, JSON)
- Search and filter
- Preview rendering

### Task 4: Question Bank Organization
- Multi-bank membership
- Category management
- Bank statistics

---

## Deliverables

```
apps/api-service/src/services/topic-exam/
apps/api-service/src/services/scheduling/
apps/spa-platform-admin/
tests/integration/backend/US-024/
tests/integration/backend/US-025/
tests/integration/backend/US-026/
tests/integration/backend/US-027/
```

---

## Session History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-02 | Created | Initial FBS document |

