# FBS-001: Core Engine Foundation

**Status:** Not Started
**Risk Level:** High
**Estimated Hours:** 12
**Dependencies:** None

---

## Summary

Implement the polymorphic exam engine with strategy pattern, session state management, and navigation control. This establishes the foundation for all exam functionality.

---

## User Stories Covered

| Story ID | Title | ACs |
|----------|-------|-----|
| US-001 | Configure Exam Methodology | AC-001, AC-002, AC-003 |
| US-002 | Add New Exam Type | AC-004, AC-005 |
| US-003 | Resume Interrupted Exam | AC-006, AC-007, AC-008 |
| US-004 | Navigate Exam Questions | AC-009, AC-010, AC-011 |

---

## Requirements Traceability

| Requirement | Title | Priority |
|-------------|-------|----------|
| REQ-001 | Polymorphic Exam Engine | Must |
| REQ-002 | Session State Management | Must |
| REQ-003 | Navigation Control | Must |

---

## Testable Outcomes

1. Exam profiles can be created with configurable methodology (CAT, LOFT, LINEAR)
2. New scoring strategies can be added without modifying core engine
3. Interrupted sessions can be resumed with full state restoration
4. Navigation rules are enforced based on exam type configuration

---

## Context Requirements

### PRD Sections
- REQ-001: Polymorphic Exam Engine
- REQ-002: Session State Management
- REQ-003: Navigation Control

### TAD Sections
- System Overview
- Architectural Principles (Strategy Pattern, Configuration Over Code)
- Components (api-service, scoring-service)

### Schemas Required
- `ExamProfile` - Exam configuration with methodology
- `ExamSession` - Session state with theta, responses, position
- `ScoringStrategy` - Interface for scoring algorithms
- `NavigationConfig` - Navigation rules per methodology

---

## Implementation Tasks

### Task 1: Define Core Types and Interfaces

**Acceptance Criteria:** AC-004 (Strategy interface)

```typescript
// packages/@uat/shared-types/src/engine.types.ts

export type ExamMethodology = 'CAT' | 'LOFT' | 'LINEAR' | 'SECTION_ADAPTIVE';

export interface ExamProfile {
  id: string;
  name: string;
  methodology: ExamMethodology;
  config: ExamConfig;
}

export interface ExamConfig {
  scoringModel: '1PL' | '2PL' | '3PL';
  stoppingCriteria: StoppingCriteria;
  navigationAllowed: boolean;
  timeLimitMinutes: number | null;
}

export interface StoppingCriteria {
  type: 'SEM' | 'FIXED_LENGTH' | 'COMBINED';
  semThreshold?: number;
  minItems: number;
  maxItems: number;
}

export interface ScoringStrategy {
  calculateTheta(responses: ItemResponse[], params: ItemParameters[]): ThetaEstimate;
  selectNextItem(currentTheta: number, availableItems: Item[]): Item | null;
  shouldStop(state: SessionState): boolean;
}
```

### Task 2: Implement Exam Profile Service

**Acceptance Criteria:** AC-001, AC-002

Create API endpoints and service for managing exam profiles.

```
POST   /api/v1/exam-profiles     Create exam profile
GET    /api/v1/exam-profiles     List exam profiles
GET    /api/v1/exam-profiles/:id Get exam profile
PUT    /api/v1/exam-profiles/:id Update exam profile
DELETE /api/v1/exam-profiles/:id Delete exam profile
```

**Files to Create:**
- `apps/api-service/src/services/exam-profile/exam-profile.service.ts`
- `apps/api-service/src/api/routes/exam-profiles.ts`
- `apps/api-service/src/api/controllers/exam-profiles.controller.ts`

### Task 3: Implement Strategy Pattern for Scoring

**Acceptance Criteria:** AC-004, AC-005

Create strategy interface and implementations for each methodology.

```
packages/@uat/backend-scoring/src/
├── strategies/
│   ├── index.ts
│   ├── strategy.interface.ts
│   ├── cat.strategy.ts
│   ├── loft.strategy.ts
│   └── linear.strategy.ts
├── factory/
│   └── strategy.factory.ts
```

### Task 4: Implement Session State Management

**Acceptance Criteria:** AC-006, AC-007, AC-008

Create session service with Redis caching and PostgreSQL persistence.

```
POST   /api/v1/sessions          Start new session
GET    /api/v1/sessions/:id      Get session state
PATCH  /api/v1/sessions/:id      Update session (submit answer)
POST   /api/v1/sessions/:id/resume Resume interrupted session
POST   /api/v1/sessions/:id/end  End session
```

**Files to Create:**
- `apps/api-service/src/services/session/session.service.ts`
- `apps/api-service/src/services/session/session.repository.ts`
- `apps/api-service/src/services/session/session-cache.service.ts`
- `apps/api-service/src/api/routes/sessions.ts`
- `apps/api-service/src/api/controllers/sessions.controller.ts`

### Task 5: Implement Navigation Control

**Acceptance Criteria:** AC-009, AC-010, AC-011

Implement navigation rules based on exam methodology configuration.

```typescript
// Navigation rules by methodology
const navigationRules = {
  CAT: { allowBack: false, allowReview: false },
  LOFT: { allowBack: true, allowReview: true },
  LINEAR: { allowBack: true, allowReview: true },
  SECTION_ADAPTIVE: { allowBack: 'within_section', allowReview: 'within_section' }
};
```

---

## Database Schema

```sql
-- Exam Profiles
CREATE TABLE exam_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  methodology VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exam_profile_id UUID REFERENCES exam_profiles(id),
  state JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Session Responses
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  question_id UUID NOT NULL,
  response JSONB NOT NULL,
  is_correct BOOLEAN,
  time_taken_ms INTEGER,
  theta_after DECIMAL(5,3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_responses_session ON responses(session_id);
```

---

## Test Specifications

### US-001/AC-001: Configure Exam Methodology

**File:** `tests/integration/backend/US-001/AC-001.spec.ts`

```typescript
// RCF: US-001, AC-001
// Given the admin dashboard, when I create a new exam profile, 
// then I can select from available methodologies (CAT, LOFT, Linear, Section-Adaptive)

describe('AC-001: Configure Exam Methodology', () => {
  it('TC-001: Should create CAT exam profile with valid methodology', async () => {
    // Arrange
    // Act
    // Assert
  });

  it('TC-002: Should create LOFT exam profile with valid methodology', async () => {
    // Arrange
    // Act
    // Assert
  });

  it('TC-003: Should reject invalid methodology', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### US-003/AC-006: Resume Interrupted Session

**File:** `tests/integration/backend/US-003/AC-006.spec.ts`

```typescript
// RCF: US-003, AC-006
// Given an active exam session that was interrupted, when I return and authenticate, 
// then I see the option to resume my exam

describe('AC-006: Resume Interrupted Session', () => {
  it('TC-001: Should return resumable sessions for authenticated user', async () => {
    // Arrange: Create interrupted session
    // Act: Call resume endpoint
    // Assert: Session is returned with resume option
  });
});
```

---

## Deliverables

### Files to Create

```
packages/@uat/shared-types/src/
└── engine.types.ts

packages/@uat/backend-scoring/src/
├── strategies/
│   ├── index.ts
│   ├── strategy.interface.ts
│   ├── cat.strategy.ts
│   ├── loft.strategy.ts
│   └── linear.strategy.ts
└── factory/
    └── strategy.factory.ts

apps/api-service/src/
├── services/
│   ├── exam-profile/
│   │   ├── exam-profile.service.ts
│   │   └── exam-profile.repository.ts
│   └── session/
│       ├── session.service.ts
│       ├── session.repository.ts
│       └── session-cache.service.ts
├── api/
│   ├── routes/
│   │   ├── exam-profiles.ts
│   │   └── sessions.ts
│   └── controllers/
│       ├── exam-profiles.controller.ts
│       └── sessions.controller.ts

tests/integration/backend/
├── US-001/
│   ├── AC-001.spec.ts
│   ├── AC-002.spec.ts
│   └── AC-003.spec.ts
├── US-002/
│   ├── AC-004.spec.ts
│   └── AC-005.spec.ts
├── US-003/
│   ├── AC-006.spec.ts
│   ├── AC-007.spec.ts
│   └── AC-008.spec.ts
└── US-004/
    ├── AC-009.spec.ts
    ├── AC-010.spec.ts
    └── AC-011.spec.ts
```

---

## Verification Checklist

- [ ] All 11 acceptance criteria have test files
- [ ] Exam profiles can be created with all 4 methodologies
- [ ] Strategy pattern allows adding new strategies without core changes
- [ ] Sessions persist to PostgreSQL with Redis caching
- [ ] Interrupted sessions can be resumed with full state
- [ ] Navigation rules are enforced per methodology
- [ ] Integration tests pass against running server
- [ ] CI pipeline is green

---

## Notes

- Start with CAT methodology as primary implementation
- Redis session cache TTL: 4 hours
- Session state backup to PostgreSQL every 30 seconds
- Use database transactions for session completion

---

## Session History

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-02 | Created | Initial FBS document |

