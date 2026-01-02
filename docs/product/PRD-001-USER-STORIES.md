# User Stories: Universal Adaptive Testing Platform

**PRD ID:** PRD-001
**Version:** 1.0.0
**Generated:** 2026-01-02
**Total Stories:** 32
**Total Acceptance Criteria:** 102

---

## Overview

This document contains user stories derived from the Universal Adaptive Testing Platform PRD. Stories are organized by domain and trace back to their source requirements.

---

## Core Engine Domain

### US-001: Configure Exam Methodology

**Persona:** Test Administrator
**Requirement:** REQ-001 (Polymorphic Exam Engine)

> As a Test Administrator, I want to configure different exam methodologies (CAT, LOFT, Linear) through a single interface, so that I can deploy new exam types without requiring code changes.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-001 | Given the admin dashboard, when I create a new exam profile, then I can select from available methodologies (CAT, LOFT, Linear, Section-Adaptive) |
| AC-002 | Given a CAT exam profile, when I configure scoring parameters, then I can set IRT model type, theta bounds, and stopping criteria |
| AC-003 | Given a configured exam profile, when the system loads it, then the correct strategy is dynamically applied without restart |

---

### US-002: Add New Exam Type

**Persona:** System Integrator
**Requirement:** REQ-001 (Polymorphic Exam Engine)

> As a System Integrator, I want to add a new exam type by creating a strategy class, so that I can extend the platform without modifying core engine code.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-004 | Given the strategy interface, when I implement a new scoring strategy, then it can be registered and used by exam profiles |
| AC-005 | Given a new strategy class, when I deploy it, then existing exams continue to work unchanged |

---

### US-003: Resume Interrupted Exam

**Persona:** Test Taker
**Requirement:** REQ-002 (Session State Management)

> As a Test Taker, I want to resume an exam that was interrupted, so that I can continue from where I left off without losing progress.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-006 | Given an active exam session that was interrupted, when I return and authenticate, then I see the option to resume my exam |
| AC-007 | Given a resumed session, when I continue, then my previous answers, current question, and remaining time are restored |
| AC-008 | Given a session interruption, when the system saves state, then it completes within 2 seconds |

---

### US-004: Navigate Exam Questions

**Persona:** Test Taker
**Requirement:** REQ-003 (Navigation Control)

> As a Test Taker, I want to navigate between questions according to the exam's rules, so that I can review and change answers when permitted by the exam type.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-009 | Given a linear exam with review enabled, when I complete a question, then I can go back to previous questions |
| AC-010 | Given a CAT exam, when I answer a question, then I cannot go back (forward-only navigation) |
| AC-011 | Given a section-adaptive exam, when I finish a section, then I cannot return to that section |

---

## Content Management Domain

### US-005: Store Flexible Question Content

**Persona:** Content Author
**Requirement:** REQ-004 (Dynamic Item Schema)

> As a Content Author, I want to create questions with varied content structures, so that I can support different question types and domains without schema changes.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-012 | Given the question editor, when I create a multiple-choice question, then I can add text, images, and formatted content |
| AC-013 | Given the question editor, when I create a SATA question, then I can specify multiple correct answers |
| AC-014 | Given the database, when questions are stored, then they use JSONB allowing schema flexibility |

---

### US-006: Tag Questions Hierarchically

**Persona:** Content Author
**Requirement:** REQ-005 (Hierarchical Tagging)

> As a Content Author, I want to organize questions using a hierarchical tag system, so that I can easily find and reuse questions across different exams.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-015 | Given a question, when I add tags, then I can select from a hierarchical taxonomy tree |
| AC-016 | Given a tagged question, when I search by parent tag, then all questions with child tags are also returned |
| AC-017 | Given the tag tree, when I add a new tag category, then it can be nested up to 5 levels deep |

---

### US-007: Manage Psychometric Parameters

**Persona:** Psychometrician
**Requirement:** REQ-006 (Psychometric Metadata)

> As a Psychometrician, I want to set and update psychometric parameters for questions, so that I can ensure accurate adaptive scoring using calibrated item parameters.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-018 | Given a question, when I edit it, then I can set difficulty (beta), discrimination (alpha), and guessing (gamma) parameters |
| AC-019 | Given psychometric data from calibration, when I import it, then parameters are updated in bulk |
| AC-020 | Given a question without parameters, when used in CAT, then default values are applied with a warning |

---

## Content Authoring Domain

### US-008: Generate Questions with AI

**Persona:** Content Author
**Requirement:** REQ-007 (AI Generation Pipeline)

> As a Content Author, I want to use AI to generate draft questions, so that I can accelerate question bank development.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-021 | Given the content authoring interface, when I provide a topic and parameters, then AI generates draft questions |
| AC-022 | Given AI-generated questions, when created, then they are marked as DRAFT status |
| AC-023 | Given AI generation, when I review output, then I can edit, accept, or reject each question |

---

### US-009: Approve Draft Questions

**Persona:** Content Author
**Requirement:** REQ-008 (Human-in-the-Loop Validation)

> As a Content Author, I want to review and approve draft questions through a workflow, so that I can ensure all published questions meet quality standards.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-024 | Given a draft question, when I submit for review, then it moves to PENDING_REVIEW status |
| AC-025 | Given a pending question, when a reviewer approves it, then it moves to ACTIVE status |
| AC-026 | Given an active question, when I need to retire it, then it moves to RETIRED status and is excluded from new exams |

---

## Analytics Domain

### US-010: View Learning Gaps

**Persona:** Test Taker
**Requirement:** REQ-009 (Gap Analysis)

> As a Test Taker, I want to see where my ability stands compared to the target, so that I can understand what I need to improve to pass the exam.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-027 | Given my dashboard, when I view gap analysis, then I see my current theta vs target theta |
| AC-028 | Given gap analysis, when displayed, then topics where I'm below target are highlighted |
| AC-029 | Given topic gaps, when I click on one, then I see specific weak areas within that topic |

---

### US-011: Predict Readiness Date

**Persona:** Test Taker
**Requirement:** REQ-010 (Velocity Prediction)

> As a Test Taker, I want to know when I'll be ready to pass the exam, so that I can plan my study schedule and exam date effectively.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-030 | Given my progress history, when I view predictions, then I see an estimated readiness date |
| AC-031 | Given my improvement velocity, when calculated, then the readiness date adjusts based on my learning rate |
| AC-032 | Given insufficient data, when prediction is unavailable, then I see a message explaining why |

---

### US-012: Get Personalized Study Tasks

**Persona:** Test Taker
**Requirement:** REQ-011 (Adaptive Remediation)

> As a Test Taker, I want to receive targeted study recommendations, so that I can focus my study time on areas that need the most improvement.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-033 | Given my performance data, when I request recommendations, then I receive prioritized study tasks |
| AC-034 | Given study tasks, when displayed, then they link to relevant practice questions or content |
| AC-035 | Given completed tasks, when I mark them done, then my recommendations update accordingly |

---

## Architecture Domain

### US-013: Implement Scoring Strategy

**Persona:** System Integrator
**Requirement:** REQ-012 (Strategy Pattern Implementation)

> As a System Integrator, I want to add new scoring algorithms using the strategy pattern, so that I can extend scoring capabilities without modifying core code.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-036 | Given the scoring service, when I implement a new strategy, then it follows the defined interface |
| AC-037 | Given multiple strategies, when an exam selects one, then only that strategy is invoked |
| AC-038 | Given a strategy implementation, when I deploy it, then unit tests verify correct behavior |

---

### US-014: Call Scoring Service

**Persona:** System Integrator
**Requirement:** REQ-013 (Service Decoupling)

> As a System Integrator, I want to call the scoring service through a defined API, so that I can integrate scoring independently from content management.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-039 | Given the API gateway, when I call the scoring endpoint, then it routes to the scoring service |
| AC-040 | Given a scoring request, when processed, then the response includes theta estimate and standard error |
| AC-041 | Given service versioning, when APIs change, then old versions remain available during transition |

---

## Performance Domain

### US-015: Receive Next Question Quickly

**Persona:** Test Taker
**Requirement:** REQ-014 (Next-Item Latency)

> As a Test Taker, I want to receive the next adaptive question without noticeable delay, so that I can have a smooth testing experience without frustrating waits.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-042 | Given I submit an answer, when the next question loads, then it appears within 200ms (P95) |
| AC-043 | Given high load, when 1000 concurrent users submit answers, then P95 latency remains under 200ms |
| AC-044 | Given question pre-fetching, when I'm answering, then the next likely question is cached |

---

### US-016: Scale During Peak Periods

**Persona:** Test Administrator
**Requirement:** REQ-015 (Horizontal Scaling)

> As a Test Administrator, I want to handle large numbers of concurrent test-takers, so that I can ensure all students can test during high-demand periods.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-045 | Given Kubernetes deployment, when load increases, then pods auto-scale horizontally |
| AC-046 | Given 10,000 concurrent sessions, when all are active, then system performance remains stable |
| AC-047 | Given load decrease, when traffic drops, then pods scale down to save resources |

---

## Security Domain

### US-017: Control Item Exposure

**Persona:** Psychometrician
**Requirement:** REQ-016 (Item Exposure Control)

> As a Psychometrician, I want to prevent individual questions from being overexposed, so that I can maintain test security and item validity.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-048 | Given item selection, when choosing next question, then exposure control limits are applied |
| AC-049 | Given exposure statistics, when I review them, then I see usage rates per item |
| AC-050 | Given overexposed items, when limits are reached, then they are temporarily excluded from selection |

---

### US-018: Prevent Question Harvesting

**Persona:** Test Administrator
**Requirement:** REQ-017 (Anti-Harvesting Protection)

> As a Test Administrator, I want to detect and prevent attempts to collect questions, so that I can protect the question bank from theft.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-051 | Given API requests, when rate limits are exceeded, then further requests are blocked |
| AC-052 | Given unusual patterns, when detected, then an alert is triggered for review |
| AC-053 | Given a blocked user, when they attempt access, then they see a security notice |

---

## Data Integrity Domain

### US-019: Review Audit Logs

**Persona:** Test Administrator
**Requirement:** REQ-018 (Audit Logging)

> As a Test Administrator, I want to review complete logs of test-taker actions, so that I can investigate suspicious behavior and defend score validity.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-054 | Given a completed exam, when I view audit logs, then I see all actions with timestamps |
| AC-055 | Given audit logs, when stored, then they are immutable and tamper-evident |
| AC-056 | Given audit requirements, when querying logs, then I can filter by session, user, or time range |

---

### US-020: Ensure Exam Results Persist

**Persona:** Test Taker
**Requirement:** REQ-019 (ACID Compliance)

> As a Test Taker, I want to trust that my exam results are safely stored, so that I can know my results won't be lost due to technical issues.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-057 | Given exam completion, when results are saved, then they use database transactions |
| AC-058 | Given a network failure during save, when connection is restored, then the save completes |
| AC-059 | Given saved results, when queried, then they are consistent and complete |

---

## Student Analytics Domain

### US-021: View Progress Dashboard

**Persona:** Test Taker
**Requirement:** REQ-020 (Student Progress Dashboard)

> As a Test Taker, I want to see my overall learning progress in one place, so that I can stay motivated and track my improvement over time.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-060 | Given my dashboard, when I log in, then I see progress charts showing ability trends |
| AC-061 | Given multiple exams taken, when displayed, then I see historical results and comparisons |
| AC-062 | Given topic proficiency, when visualized, then I see a breakdown by subject area |

---

### US-022: Review Post-Exam Analytics

**Persona:** Test Taker
**Requirement:** REQ-021 (Post-Exam Performance Analytics)

> As a Test Taker, I want to understand my performance immediately after an exam, so that I can identify strengths and weaknesses while the experience is fresh.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-063 | Given exam completion, when results display, then I see overall score and percentile |
| AC-064 | Given post-exam analytics, when viewing, then I see topic-wise performance breakdown |
| AC-065 | Given time data, when displayed, then I see average time per question and outliers |
| AC-066 | Given previous attempts, when compared, then I see improvement or regression by topic |

---

### US-023: Get Study Time Recommendations

**Persona:** Test Taker
**Requirement:** REQ-022 (Study Time Recommendations)

> As a Test Taker, I want to know how much time to spend on each topic, so that I can allocate my limited study time effectively.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-067 | Given my performance gaps, when I view recommendations, then I see estimated hours per topic |
| AC-068 | Given prioritized topics, when displayed, then they are ordered by impact on overall score |
| AC-069 | Given a target exam date, when I set it, then recommendations adjust to fit the timeline |

---

## Exam Management Domain

### US-024: Take Topic-Focused Practice Exam

**Persona:** Test Taker
**Requirement:** REQ-023 (Topic-Based Practice Exams)

> As a Test Taker, I want to practice questions from specific weak topics, so that I can improve targeted areas before the full exam.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-070 | Given my dashboard, when I select a weak topic, then I can start a focused practice exam |
| AC-071 | Given a topic exam, when I complete it, then I see topic-specific analytics |
| AC-072 | Given topic practice history, when reviewed, then I see improvement trends for that topic |

---

### US-025: Schedule Exam Intelligently

**Persona:** Test Taker
**Requirement:** REQ-024 (Intelligent Exam Scheduling)

> As a Test Taker, I want to know the best date to take my exam, so that I can maximize my chances of passing by testing when ready.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-073 | Given my current proficiency, when I request scheduling help, then I see a suggested exam date |
| AC-074 | Given a target score, when I set it, then the suggested date accounts for the gap |
| AC-075 | Given my study velocity, when calculated, then the prediction uses my historical learning rate |

---

## Administration Domain

### US-026: Manage Questions in Admin Dashboard

**Persona:** Test Administrator
**Requirement:** REQ-025 (Admin Question Management Dashboard)

> As a Test Administrator, I want to efficiently manage the question bank, so that I can maintain high-quality, organized question content.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-076 | Given the admin dashboard, when I access questions, then I can add, edit, and delete them |
| AC-077 | Given bulk operations, when I import questions, then I can use CSV or JSON formats |
| AC-078 | Given search and filter, when I query, then I can find questions by topic, difficulty, or status |
| AC-079 | Given question preview, when I test rendering, then I see exactly what test-takers will see |

---

### US-027: Organize Question Banks

**Persona:** Test Administrator
**Requirement:** REQ-026 (Question Bank Organization)

> As a Test Administrator, I want to organize questions into logical banks and categories, so that I can efficiently reuse content across multiple exam types.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-080 | Given the admin dashboard, when I create a question bank, then I can assign categories and metadata |
| AC-081 | Given a question, when I assign it, then it can belong to multiple banks |
| AC-082 | Given bank statistics, when I view them, then I see question counts and coverage metrics |

---

## B2C Platform Domain

### US-028: Browse Exam Catalog

**Persona:** Test Taker
**Requirement:** REQ-027 (Platform Exam Catalog)

> As a Test Taker, I want to discover and explore available exams, so that I can find the right exam for my certification goals.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-083 | Given the platform homepage, when I browse exams, then I see a catalog with categories |
| AC-084 | Given the catalog, when I filter by exam type or price, then results update accordingly |
| AC-085 | Given an exam listing, when I click it, then I see details including sample questions |
| AC-086 | Given search, when I type a query, then relevant exams are shown with highlighted matches |

---

### US-029: Subscribe to Exam Plans

**Persona:** Test Taker
**Requirement:** REQ-028 (Student Subscription Plans)

> As a Test Taker, I want to subscribe to access multiple exams, so that I can get better value with bundled exam access.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-087 | Given subscription plans, when I view them, then I see Basic, Premium, and Unlimited tiers |
| AC-088 | Given plan selection, when I subscribe, then payment is processed via Stripe |
| AC-089 | Given an active subscription, when I access exams, then included exams are unlocked |
| AC-090 | Given subscription management, when I upgrade or cancel, then changes take effect immediately |

---

### US-030: Purchase Individual Exams

**Persona:** Test Taker
**Requirement:** REQ-029 (One-Time Exam Purchases)

> As a Test Taker, I want to buy a single exam without subscribing, so that I can pay only for what I need.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-091 | Given an exam listing, when I click purchase, then I can complete checkout with Stripe |
| AC-092 | Given a completed purchase, when confirmed, then I have permanent access to that exam |
| AC-093 | Given my purchase history, when I view it, then I see all purchased exams and receipts |
| AC-094 | Given exam bundles, when available, then I can purchase multiple exams at a discount |

---

### US-031: Use Mobile App

**Persona:** Test Taker
**Requirement:** REQ-030 (Mobile App Support)

> As a Test Taker, I want to access exams and analytics on my phone, so that I can study anywhere, anytime.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-095 | Given the mobile app, when I log in, then I see my dashboard and available exams |
| AC-096 | Given an exam on mobile, when I take it, then the experience is optimized for touch |
| AC-097 | Given offline mode, when enabled, then I can take cached exams without internet |
| AC-098 | Given push notifications, when enabled, then I receive study reminders |

---

### US-032: Sync Progress Across Devices

**Persona:** Test Taker
**Requirement:** REQ-031 (Progress Sync Across Devices)

> As a Test Taker, I want to access my progress from any device, so that I can seamlessly switch between devices without losing work.

#### Acceptance Criteria

| ID | Description |
|----|-------------|
| AC-099 | Given I start an exam on web, when I open the mobile app, then I can continue from where I left off |
| AC-100 | Given progress updates, when synced, then changes appear across devices within 5 seconds |
| AC-101 | Given offline changes, when I reconnect, then they sync automatically without data loss |
| AC-102 | Given concurrent edits, when conflicts occur, then the most recent change wins with notification |

---

## Traceability Matrix

| Requirement | User Stories | Acceptance Criteria |
|-------------|--------------|---------------------|
| REQ-001 | US-001, US-002 | AC-001 to AC-005 |
| REQ-002 | US-003 | AC-006 to AC-008 |
| REQ-003 | US-004 | AC-009 to AC-011 |
| REQ-004 | US-005 | AC-012 to AC-014 |
| REQ-005 | US-006 | AC-015 to AC-017 |
| REQ-006 | US-007 | AC-018 to AC-020 |
| REQ-007 | US-008 | AC-021 to AC-023 |
| REQ-008 | US-009 | AC-024 to AC-026 |
| REQ-009 | US-010 | AC-027 to AC-029 |
| REQ-010 | US-011 | AC-030 to AC-032 |
| REQ-011 | US-012 | AC-033 to AC-035 |
| REQ-012 | US-013 | AC-036 to AC-038 |
| REQ-013 | US-014 | AC-039 to AC-041 |
| REQ-014 | US-015 | AC-042 to AC-044 |
| REQ-015 | US-016 | AC-045 to AC-047 |
| REQ-016 | US-017 | AC-048 to AC-050 |
| REQ-017 | US-018 | AC-051 to AC-053 |
| REQ-018 | US-019 | AC-054 to AC-056 |
| REQ-019 | US-020 | AC-057 to AC-059 |
| REQ-020 | US-021 | AC-060 to AC-062 |
| REQ-021 | US-022 | AC-063 to AC-066 |
| REQ-022 | US-023 | AC-067 to AC-069 |
| REQ-023 | US-024 | AC-070 to AC-072 |
| REQ-024 | US-025 | AC-073 to AC-075 |
| REQ-025 | US-026 | AC-076 to AC-079 |
| REQ-026 | US-027 | AC-080 to AC-082 |
| REQ-027 | US-028 | AC-083 to AC-086 |
| REQ-028 | US-029 | AC-087 to AC-090 |
| REQ-029 | US-030 | AC-091 to AC-094 |
| REQ-030 | US-031 | AC-095 to AC-098 |
| REQ-031 | US-032 | AC-099 to AC-102 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | Product Team | Initial user stories for Phase 1 B2C (31 requirements, 32 stories, 102 ACs) |

