# User Stories: Universal Adaptive Testing Platform

**PRD Reference:** PRD-001
**Version:** 1.0.0
**Status:** Draft
**Created:** 2025-12-22
**Last Updated:** 2025-12-22

---

## Overview

This document contains user stories derived from PRD-001: Universal Adaptive Testing Platform. Each user story traces back to a specific requirement and includes testable acceptance criteria.

---

## Core Engine Stories

### US-001: Configure Exam Profile with Algorithm Type

**Requirement:** REQ-001 (Polymorphic Exam Engine)

**As a** Test Administrator
**I want** to create an exam profile and select the algorithm type (Item Adaptive, Section Adaptive, Linear Fixed, or LOFT)
**So that** I can deploy different exam methodologies without requiring code changes

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-001 | Given I am on the exam profile creation page, when I select an algorithm type from the dropdown, then the system saves the selection and displays algorithm-specific configuration options | Yes |
| AC-002 | Given I have selected Item_Adaptive algorithm, when I configure stopping rules, then I can set SEM threshold, min/max question counts, and time limits | Yes |
| AC-003 | Given I have configured an exam profile, when I save it, then the profile is available for assignment to test sessions | Yes |

---

### US-002: Configure Scoring Model for Exam

**Requirement:** REQ-001 (Polymorphic Exam Engine)

**As a** Test Administrator
**I want** to select and configure a scoring model (Rasch, 1PL, 2PL, 3PL, or CTT) for each exam profile
**So that** the exam uses the appropriate psychometric model for scoring and ability estimation

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-004 | Given I am configuring an exam profile, when I select an IRT model, then the system displays relevant parameter configuration options | Yes |
| AC-005 | Given I have selected a 3PL model, when the exam runs, then ability estimates use difficulty, discrimination, and guessing parameters | Yes |
| AC-006 | Given I select CTT scoring, when a test taker completes the exam, then the score is calculated as a simple sum or percentage | Yes |

---

### US-003: Resume Interrupted Exam Session

**Requirement:** REQ-002 (Session State Management)

**As a** Test Taker
**I want** to resume my exam from the exact point where I was disconnected
**So that** network issues do not disadvantage me or cause me to lose progress

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-007 | Given I was disconnected during question 45 with 90 minutes remaining, when I reconnect and resume, then I see question 45 with exactly 90 minutes on the timer | Yes |
| AC-008 | Given I resume a session, when I continue the exam, then all my previous answers are preserved | Yes |
| AC-009 | Given the session state includes a theta estimate, when I resume, then the adaptive algorithm continues from my last estimated ability level | Yes |

---

### US-004: Configure Navigation Mode

**Requirement:** REQ-003 (Navigation Control)

**As a** Test Administrator
**I want** to configure whether test takers can navigate back to previous questions
**So that** I can enforce appropriate navigation rules based on the exam methodology

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-010 | Given I configure unidirectional navigation, when a test taker submits an answer, then the back button is disabled | Yes |
| AC-011 | Given I configure bidirectional navigation, when a test taker is on any question, then they can navigate to any previously answered question | Yes |
| AC-012 | Given bidirectional navigation is enabled, when a test taker flags a question, then they can access a review screen showing all flagged items | Yes |

---

## Content Management Stories

### US-005: Create Multi-Format Questions

**Requirement:** REQ-004 (Dynamic Item Schema)

**As a** Content Author
**I want** to create questions with different interaction types (single select, multi-select, ordering, hotspot, drag-and-drop)
**So that** I can assess different skills and knowledge types appropriately

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-013 | Given I am creating a question, when I select SATA type, then I can add multiple correct options and the system scores partial credit | Yes |
| AC-014 | Given I am creating an ordering question, when I define the correct sequence, then test takers can drag items into order | Yes |
| AC-015 | Given I create a hotspot question, when I upload an image and define clickable regions, then test takers can click on the image to answer | Yes |

---

### US-006: Apply Hierarchical Tags to Questions

**Requirement:** REQ-005 (Hierarchical Tagging)

**As a** Content Author
**I want** to tag questions with a hierarchical taxonomy (Domain > Subject > Topic > Competency)
**So that** questions can be mapped to external syllabi and enable granular analytics

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-016 | Given I am tagging a question, when I select a domain, then I see filtered subjects within that domain | Yes |
| AC-017 | Given I have tagged questions, when I filter the question bank, then I can search by any level of the taxonomy | Yes |
| AC-018 | Given questions are tagged, when analytics are generated, then performance can be reported at any taxonomy level | Yes |

---

### US-007: Manage Psychometric Parameters

**Requirement:** REQ-006 (Psychometric Metadata)

**As a** Psychometrician
**I want** to view and edit the difficulty, discrimination, and guessing parameters for each question
**So that** the adaptive algorithm can accurately select items and estimate ability

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-019 | Given I view a question, when I access psychometric data, then I see current values for β, α, and γ parameters | Yes |
| AC-020 | Given I update parameters after calibration, when I save changes, then the new values are used in subsequent item selection | Yes |
| AC-021 | Given questions have exposure counts, when I view the bank, then I can sort by exposure to identify overused items | Yes |

---

## Content Authoring Stories

### US-008: Generate Questions with AI

**Requirement:** REQ-007 (AI Generation Pipeline)

**As a** Content Author
**I want** to generate draft questions using AI by specifying a topic and exam profile
**So that** I can accelerate question bank development while maintaining quality standards

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-022 | Given I specify a topic and exam profile, when I request AI generation, then the system produces draft questions with stems, options, and rationales | Yes |
| AC-023 | Given AI generates questions, when I view them, then they include suggested taxonomy tags and difficulty estimates | Yes |
| AC-024 | Given AI-generated content, when saved, then all items have DRAFT status and cannot appear in live exams | Yes |

---

### US-009: Review and Approve Draft Questions

**Requirement:** REQ-008 (Human-in-the-Loop Validation)

**As a** Test Administrator
**I want** to review draft questions and approve them for live use
**So that** only validated content appears in actual exams

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-025 | Given a question is in DRAFT status, when I review and approve it, then status changes to REVIEW | Yes |
| AC-026 | Given a question is in REVIEW status, when a second reviewer approves, then status changes to ACTIVE | Yes |
| AC-027 | Given a question is ACTIVE, when I retire it, then status changes to RETIRED and it no longer appears in item selection | Yes |

---

## Analytics Stories

### US-010: View Performance Gap Analysis

**Requirement:** REQ-009 (Gap Analysis)

**As a** Test Taker
**I want** to see how my current ability compares to the passing standard
**So that** I understand my readiness and can focus my study efforts

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-028 | Given I complete a practice exam, when I view my dashboard, then I see my current theta vs. target theta visualized | Yes |
| AC-029 | Given gap analysis is displayed, when I drill down, then I see performance gaps by topic and competency | Yes |
| AC-030 | Given I have multiple practice sessions, when I view trends, then I see how my gap has changed over time | Yes |

---

### US-011: View Predicted Ready Date

**Requirement:** REQ-010 (Velocity Prediction)

**As a** Test Taker
**I want** to see when I am predicted to be ready based on my improvement rate
**So that** I can plan my exam date and study schedule effectively

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-031 | Given I have completed multiple practice sessions, when I view predictions, then I see an estimated ready date | Yes |
| AC-032 | Given my improvement rate changes, when I view the dashboard, then the predicted date updates accordingly | Yes |
| AC-033 | Given I have insufficient data, when I view predictions, then the system displays a message indicating more practice is needed | Yes |

---

### US-012: Receive Personalized Study Recommendations

**Requirement:** REQ-011 (Adaptive Remediation)

**As a** Test Taker
**I want** to receive personalized study recommendations targeting my weakest areas
**So that** I can improve efficiently by focusing on topics where I need the most help

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-034 | Given my performance data shows weakness in Topic X, when I view recommendations, then I see a suggested quiz on Topic X | Yes |
| AC-035 | Given I complete a recommended task, when I return to dashboard, then new recommendations reflect my updated performance | Yes |
| AC-036 | Given multiple weak areas exist, when I view recommendations, then they are prioritized by severity of gap | Yes |

---

## Architecture Stories

### US-013: Add New Exam Type via Strategy

**Requirement:** REQ-012 (Strategy Pattern Implementation)

**As a** System Integrator
**I want** to add support for a new exam type by implementing a strategy class
**So that** the platform can be extended without modifying or risking the core engine

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-037 | Given I create a new strategy class implementing the scoring interface, when I register it, then it appears as an algorithm option | Yes |
| AC-038 | Given I deploy a new strategy, when existing exams run, then they are unaffected by the new code | Yes |
| AC-039 | Given a strategy is registered, when I create an exam profile, then I can select the new algorithm type | Yes |

---

### US-014: Integrate Services via API

**Requirement:** REQ-013 (Service Decoupling)

**As a** System Integrator
**I want** to integrate with the Scoring Service and Content Service via versioned REST APIs
**So that** I can build custom frontends or integrate with external systems

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-040 | Given I call the Scoring Service API, when I submit an answer, then I receive the updated theta and next item selection | Yes |
| AC-041 | Given I call the Content Service API, when I request an item, then I receive the full item content and metadata | Yes |
| AC-042 | Given APIs are versioned, when a new version is released, then the previous version continues to work for backward compatibility | Yes |

---

## Performance Stories

### US-015: Experience Fast Item Transitions

**Requirement:** REQ-014 (Next-Item Latency)

**As a** Test Taker
**I want** to see the next question appear within 200ms of submitting my answer
**So that** my exam experience is smooth and I am not disadvantaged by system delays

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-043 | Given I submit an answer in an adaptive exam, when the next item loads, then it appears in less than 200ms (P95) | Yes |
| AC-044 | Given high system load, when I take an exam, then latency remains under 200ms | Yes |
| AC-045 | Given latency is measured, when reports are generated, then P95 latency metrics are available for monitoring | Yes |

---

### US-016: Scale for Peak Demand

**Requirement:** REQ-015 (Horizontal Scaling)

**As a** Test Administrator
**I want** the system to handle 10,000 concurrent test sessions without performance degradation
**So that** we can conduct large-scale testing events without issues

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-046 | Given 10,000 concurrent sessions, when all users submit answers, then response times remain under SLA | Yes |
| AC-047 | Given traffic spikes, when auto-scaling triggers, then new instances come online within 2 minutes | Yes |
| AC-048 | Given the system is under load, when I view metrics, then I can monitor container health and scaling status | Yes |

---

## Security Stories

### US-017: Control Item Exposure

**Requirement:** REQ-016 (Item Exposure Control)

**As a** Psychometrician
**I want** the system to limit how frequently any single item is shown
**So that** item bank security is maintained and no questions become compromised

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-049 | Given exposure control is configured, when items are selected, then high-exposure items are less likely to be chosen | Yes |
| AC-050 | Given an item reaches its exposure threshold, when selection runs, then it is excluded until exposure resets | Yes |
| AC-051 | Given I view exposure reports, when I analyze the data, then I can see exposure distribution across the item bank | Yes |

---

### US-018: Prevent Question Harvesting

**Requirement:** REQ-017 (Anti-Harvesting Protection)

**As a** Test Administrator
**I want** the system to detect and block users attempting to harvest questions
**So that** the integrity of the question bank is protected

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-052 | Given a user rapidly cycles through exams, when anomaly detection triggers, then their account is flagged | Yes |
| AC-053 | Given rate limiting is configured, when a user exceeds exam attempt limits, then further attempts are blocked | Yes |
| AC-054 | Given suspicious activity is detected, when I view security alerts, then I see details and can take action | Yes |

---

## Data Integrity Stories

### US-019: Access Comprehensive Audit Logs

**Requirement:** REQ-018 (Audit Logging)

**As a** Test Administrator
**I want** to access detailed audit logs of every test session
**So that** I can investigate score validity and potential fraud

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-055 | Given a test session completes, when I access audit logs, then I see every keystroke and timing data | Yes |
| AC-056 | Given answer changes are allowed, when a test taker changes an answer, then both original and final answers are logged | Yes |
| AC-057 | Given audit logs exist, when I attempt to modify them, then the system prevents changes (immutable logs) | Yes |

---

### US-020: Ensure Data Durability

**Requirement:** REQ-019 (ACID Compliance)

**As a** Test Administrator
**I want** exam results to be stored with ACID guarantees
**So that** no results are lost due to system failures or network issues

#### Acceptance Criteria

| ID | Description | Testable |
|----|-------------|----------|
| AC-058 | Given a test taker submits their final answer, when the transaction commits, then the result is durably stored | Yes |
| AC-059 | Given a network failure during result submission, when connection restores, then the transaction either completes or rolls back cleanly | Yes |
| AC-060 | Given database replication is configured, when the primary fails, then the standby takes over with no data loss | Yes |

---

## Traceability Matrix

| User Story | Requirement | Domain | Acceptance Criteria |
|------------|-------------|--------|---------------------|
| US-001 | REQ-001 | Core Engine | AC-001, AC-002, AC-003 |
| US-002 | REQ-001 | Core Engine | AC-004, AC-005, AC-006 |
| US-003 | REQ-002 | Core Engine | AC-007, AC-008, AC-009 |
| US-004 | REQ-003 | Core Engine | AC-010, AC-011, AC-012 |
| US-005 | REQ-004 | Content Management | AC-013, AC-014, AC-015 |
| US-006 | REQ-005 | Content Management | AC-016, AC-017, AC-018 |
| US-007 | REQ-006 | Content Management | AC-019, AC-020, AC-021 |
| US-008 | REQ-007 | Content Authoring | AC-022, AC-023, AC-024 |
| US-009 | REQ-008 | Content Authoring | AC-025, AC-026, AC-027 |
| US-010 | REQ-009 | Analytics | AC-028, AC-029, AC-030 |
| US-011 | REQ-010 | Analytics | AC-031, AC-032, AC-033 |
| US-012 | REQ-011 | Analytics | AC-034, AC-035, AC-036 |
| US-013 | REQ-012 | Architecture | AC-037, AC-038, AC-039 |
| US-014 | REQ-013 | Architecture | AC-040, AC-041, AC-042 |
| US-015 | REQ-014 | Performance | AC-043, AC-044, AC-045 |
| US-016 | REQ-015 | Performance | AC-046, AC-047, AC-048 |
| US-017 | REQ-016 | Security | AC-049, AC-050, AC-051 |
| US-018 | REQ-017 | Security | AC-052, AC-053, AC-054 |
| US-019 | REQ-018 | Data Integrity | AC-055, AC-056, AC-057 |
| US-020 | REQ-019 | Data Integrity | AC-058, AC-059, AC-060 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-22 | Product Team | Initial user stories with 60 acceptance criteria |
