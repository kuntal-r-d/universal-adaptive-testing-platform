# User Stories: Exam Engine (REQ-001)

**Traces to:** REQ-001 (Polymorphic Exam Engine)  
**Status:** Draft  
**Sprint:** Backlog  

---

## US-001: Configure Exam Profile

**As an** Administrator  
**I want to** define an Exam Profile with specific algorithm, scoring, and stopping parameters  
**So that** I can configure the system for different exam types without code changes  

**Traces to:** REQ-001.1  
**Priority:** Critical  
**Story Points:** 8  

### Acceptance Criteria

#### AC-001: Algorithm Selection
- **Given** I am on the Exam Profile configuration page
- **When** I select an algorithm type
- **Then** I can choose from: `Item_Adaptive`, `Section_Adaptive`, `Linear_Fixed`, `LOFT`
- **And** the selected algorithm is saved to the profile

#### AC-002: Scoring Model Configuration  
- **Given** I have selected an algorithm type
- **When** I configure the scoring model
- **Then** I can choose from: Rasch, 1PL, 2PL, 3PL, or Classical (Summation)
- **And** the model parameters are validated before saving

#### AC-003: Stopping Rules Definition
- **Given** I am configuring an adaptive exam profile
- **When** I define stopping rules
- **Then** I can set:
  - Standard Error threshold (SEM < X)
  - Minimum question count
  - Maximum question count  
  - Maximum duration in minutes
- **And** the system validates that min < max for question counts

---

## US-002: Resume Interrupted Exam Session

**As a** Test-Taker  
**I want to** resume my exam exactly where I left off after a disconnection  
**So that** I don't lose my progress or time due to technical issues  

**Traces to:** REQ-001.2  
**Priority:** Critical  
**Story Points:** 5  

### Acceptance Criteria

#### AC-004: Session State Preservation
- **Given** I am taking an exam and my connection drops
- **When** I reconnect and return to the exam
- **Then** I am at the exact question I was viewing
- **And** my previous answers are preserved
- **And** the timer reflects the exact remaining time (not reset)

#### AC-005: Session Timeout Handling
- **Given** my session has been inactive for longer than the allowed timeout
- **When** I attempt to resume
- **Then** I am shown a clear message explaining the session expired
- **And** my partial results are saved for review

---

## US-003: Navigate Exam Based on Profile Rules

**As a** Test-Taker  
**I want to** navigate through questions according to the exam's navigation rules  
**So that** my exam experience matches the configured exam type  

**Traces to:** REQ-001.3  
**Priority:** High  
**Story Points:** 3  

### Acceptance Criteria

#### AC-006: Unidirectional Navigation (CAT Mode)
- **Given** the exam profile has `navigation: unidirectional`
- **When** I submit an answer
- **Then** I cannot go back to previous questions
- **And** the "Previous" button is hidden or disabled

#### AC-007: Bidirectional Navigation (Review Mode)
- **Given** the exam profile has `navigation: bidirectional`
- **When** I am viewing any question
- **Then** I can navigate forward and backward
- **And** I can flag questions for review
- **And** I can see a question map showing my progress

---

## Traceability Matrix

| User Story | Requirement | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-001 | REQ-001.1 | AC-001, AC-002, AC-003 | Draft |
| US-002 | REQ-001.2 | AC-004, AC-005 | Draft |
| US-003 | REQ-001.3 | AC-006, AC-007 | Draft |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-12-22 | Auto-generated | Initial user stories for Exam Engine |
