# FBS-005: Student Analytics

**Status:** Not Started
**Risk Level:** Medium
**Estimated Hours:** 10
**Dependencies:** FBS-001, FBS-003

---

## Summary

Implement gap analysis, velocity prediction, adaptive remediation, progress dashboard, post-exam analytics, and study time recommendations.

---

## User Stories Covered

| Story ID | Title | ACs |
|----------|-------|-----|
| US-010 | View Learning Gaps | AC-027, AC-028, AC-029 |
| US-011 | Predict Readiness Date | AC-030, AC-031, AC-032 |
| US-012 | Get Personalized Study Tasks | AC-033, AC-034, AC-035 |
| US-021 | View Progress Dashboard | AC-060, AC-061, AC-062 |
| US-022 | Review Post-Exam Analytics | AC-063, AC-064, AC-065, AC-066 |
| US-023 | Get Study Time Recommendations | AC-067, AC-068, AC-069 |

---

## Requirements Traceability

| Requirement | Title | Priority |
|-------------|-------|----------|
| REQ-009 | Gap Analysis | Should |
| REQ-010 | Velocity Prediction | Could |
| REQ-011 | Adaptive Remediation | Should |
| REQ-020 | Student Progress Dashboard | Must |
| REQ-021 | Post-Exam Performance Analytics | Must |
| REQ-022 | Study Time Recommendations | Should |

---

## Testable Outcomes

1. Gap analysis displays current vs target theta
2. Readiness date is predicted based on improvement velocity
3. Personalized study tasks are generated
4. Progress dashboard shows charts and trends
5. Post-exam analytics display detailed breakdown
6. Study time recommendations are calculated per topic

---

## Implementation Tasks

### Task 1: Gap Analysis Service
- Calculate current vs target theta per topic
- Highlight weak areas
- Drill-down to specific gaps

### Task 2: Velocity Prediction
- Track improvement rate over time
- Predict readiness date
- Handle insufficient data gracefully

### Task 3: Adaptive Remediation
- Generate prioritized study tasks
- Link to relevant practice content
- Update recommendations on completion

### Task 4: Progress Dashboard API
- Aggregate progress data
- Generate chart data points
- Historical comparisons

### Task 5: Post-Exam Analytics
- Calculate detailed performance breakdown
- Topic-wise analysis
- Time analysis per question
- Historical comparison

### Task 6: Study Time Recommendations
- Calculate hours needed per topic
- Prioritize by impact on score
- Adjust based on target exam date

---

## Deliverables

```
apps/api-service/src/services/analytics/
apps/api-service/src/api/routes/analytics.ts
tests/integration/backend/US-010/
tests/integration/backend/US-011/
tests/integration/backend/US-012/
tests/integration/backend/US-021/
tests/integration/backend/US-022/
tests/integration/backend/US-023/
```

---

## Session History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-02 | Created | Initial FBS document |

