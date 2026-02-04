# PRD-001: Universal Adaptive Testing Platform

**Status:** Draft
**Version:** 1.2.0
**Created:** 2025-12-22
**Last Updated:** 2026-01-02
**Owner:** Product Team

---

## Executive Summary

A configurable, extensible adaptive testing engine supporting multiple exam methodologies (CAT, LOFT, Linear) with AI-augmented content authoring and smart analytics. The platform treats exam rules, stopping criteria, and scoring algorithms as configurable metadata rather than hard-coded logic.

---

## Problem Statement

Current adaptive testing platforms are typically hard-coded for specific exam types (e.g., NCLEX, GMAT), making it costly and time-consuming to adapt them for new domains or methodologies. Organizations need a flexible, extensible platform that can support multiple exam types, scoring models, and content domains without requiring core engine modifications.

---

## Target Users

| Persona | Description |
|---------|-------------|
| **Test Administrators** | Configure exam profiles, manage question banks, and monitor test delivery |
| **Content Authors** | Create, review, and manage question content across multiple domains |
| **Test Takers** | Students and professionals taking adaptive exams for certification or assessment |
| **Psychometricians** | Analyze test performance, calibrate items, and validate scoring models |
| **System Integrators** | Integrate the platform with external LMS and credential systems |

---

## Objectives

1. Enable support for multiple exam methodologies (CAT, LOFT, Linear, Section-Adaptive) through a single configurable engine
2. Reduce time-to-market for new exam types by 80% through pluggable strategy architecture
3. Achieve sub-200ms next-item latency for optimal test-taker experience
4. Provide AI-augmented content authoring to accelerate question bank development
5. Deliver actionable analytics through Smart Coach to improve learner outcomes
6. Empower students with comprehensive progress dashboards and personalized study recommendations
7. Enable administrators to efficiently manage question banks across multiple categories and criteria
8. Launch B2C platform with subscription and purchase options for individual students
9. Provide seamless cross-device experience via web and mobile applications

---

## Scope

### In Scope

- Polymorphic exam engine with configurable algorithms and stopping rules
- Universal question bank supporting multiple item types and domains
- AI-augmented content authoring with human-in-the-loop validation
- Smart Coach analytics including gap analysis and adaptive remediation
- Session state management with resume capability
- Item exposure control and anti-harvesting protection
- Audit logging and ACID-compliant data storage
- Student Progress Dashboard with post-exam analytics and performance insights
- Topic-based learning path with targeted practice exams
- Intelligent exam scheduling based on study time and topic coverage
- Admin Dashboard for question bank and content management
- B2C Platform with exam catalog for individual students
- Student subscription plans and one-time exam purchases
- Mobile app support (iOS and Android) with progress sync

### Out of Scope

- Proctoring and identity verification services (third-party integration only)
- Real-time video-based cheating detection
- Integration with specific LMS platforms (API-first approach for future integrations)
- Psychometric research and item calibration studies (platform supports data export)
- B2B organization features (Phase 2)
- C2C creator marketplace (Phase 3)

---

## Constraints

- Must comply with accessibility standards (WCAG 2.1 AA)
- Must support PostgreSQL as the primary database for ACID compliance
- Scoring Service must be implemented in Python for statistical library support
- Must operate in cloud-agnostic containerized environment (Docker/Kubernetes)
- API response times must meet P95 < 200ms SLA for adaptive item selection

---

## Functional Requirements

### Core Engine Domain

#### REQ-001: Polymorphic Exam Engine

**Priority:** Must
**Category:** Functional
**Domain:** Core Engine

The system must support a "Pluggable Strategy" architecture to handle different exam methodologies dynamically. This includes support for:

- **Algorithm Types:** `Item_Adaptive` (NCLEX/GMAT), `Section_Adaptive` (GRE), `Linear_Fixed` (Standard), `LOFT` (Randomized)
- **Scoring Models:** Configurable IRT models (Rasch, 1PL, 2PL, 3PL) or Classical Test Theory (Summation)
- **Stopping Rules:**
  - *Standard Error Rule:* Stop when SEM < X (e.g., 0.3)
  - *Length Rule:* Min/Max question counts (e.g., Min 75, Max 145)
  - *Time Rule:* Max duration (e.g., 180 mins)

**Rationale:** A pluggable architecture enables rapid deployment of new exam types without modifying core engine code, reducing development time and risk.

---

#### REQ-002: Session State Management

**Priority:** Must
**Category:** Functional
**Domain:** Core Engine

The system must preserve the state of every active exam session. If a user disconnects, they must be able to resume at the exact question index with the exact same timer value. Session state must include:

- Current theta estimate
- Answered items
- Remaining time
- Navigation history

**Rationale:** Session persistence is critical for high-stakes testing where network interruptions should not disadvantage test-takers.

---

#### REQ-003: Navigation Control

**Priority:** Must
**Category:** Functional
**Domain:** Core Engine

The system must support configurable navigation constraints:

- **Unidirectional:** No going back (CAT standard)
- **Bidirectional:** Flag and review (Linear standard)

Navigation mode must be configurable per Exam Profile.

**Rationale:** Different exam methodologies require different navigation rules to maintain test validity and security.

---

### Content Management Domain

#### REQ-004: Dynamic Item Schema

**Priority:** Must
**Category:** Functional
**Domain:** Content Management

The database must use `JSONB` structures to store question content, allowing for:

- **Variable Option Counts:** 2 to N options
- **Interaction Types:** Single Select, Multi-Select (SATA), Ordering, Hotspot (Image coordinates), Drag-and-Drop

**Rationale:** Schema-agnostic storage enables support for any domain without database schema changes.

---

#### REQ-005: Hierarchical Tagging

**Priority:** Must
**Category:** Functional
**Domain:** Content Management

Questions must support a flexible tagging tree (Domain → Subject → Topic → Competency) to map to any external syllabus such as NCLEX Client Needs or GMAT Quant categories.

**Rationale:** Flexible tagging enables content reuse across different exam profiles and supports granular performance analytics.

---

#### REQ-006: Psychometric Metadata

**Priority:** Must
**Category:** Functional
**Domain:** Content Management

Every question record must store:

- Difficulty Parameter (β)
- Discrimination Parameter (α)
- Guessing Parameter (γ)
- Exposure Count (to track how often a question is shown)

**Rationale:** Psychometric metadata is essential for IRT-based adaptive algorithms and item bank security.

---

### Content Authoring Domain

#### REQ-007: AI Generation Pipeline

**Priority:** Should
**Category:** Functional
**Domain:** Content Authoring

The system shall provide an interface to prompt an LLM (via API) to generate draft items based on a specific Exam Profile and Topic. Generated content must include:

- Question stem
- Options
- Correct answer
- Rationale
- Suggested metadata tags

**Rationale:** AI-augmented authoring accelerates question bank development while maintaining quality through human review.

---

#### REQ-008: Human-in-the-Loop Validation

**Priority:** Must
**Category:** Functional
**Domain:** Content Authoring

Generated items must enter a `DRAFT` state. They can only be promoted to `ACTIVE` (live) after manual review and approval by an Admin. The system must support workflow states:

`DRAFT` → `REVIEW` → `ACTIVE` → `RETIRED`

**Rationale:** Human validation ensures content quality and accuracy before items are used in live assessments.

---

### Analytics Domain

#### REQ-009: Gap Analysis

**Priority:** Should
**Category:** Functional
**Domain:** Analytics

The system must compare a user's Current Theta against the Target Theta (Passing Standard) defined in the Exam Profile. Gap analysis must be visualized at overall and topic/competency levels.

**Rationale:** Gap analysis helps learners understand their readiness and focus study efforts effectively.

---

#### REQ-010: Velocity Prediction

**Priority:** Could
**Category:** Functional
**Domain:** Analytics

The system shall calculate a "Ready Date" based on the user's historical rate of improvement (Δθ / Time). Prediction must account for study frequency and topic-specific progress.

**Rationale:** Velocity prediction helps learners plan their study schedule and set realistic exam dates.

---

#### REQ-011: Adaptive Remediation

**Priority:** Should
**Category:** Functional
**Domain:** Analytics

The system must generate dynamic study tasks (e.g., "Take a 20-question quiz on Topic X") specifically targeting the user's lowest-performing metadata tags.

**Rationale:** Targeted remediation improves learning efficiency by focusing on areas of weakness.

---

### Student Analytics Domain

#### REQ-020: Student Progress Dashboard

**Priority:** Must
**Category:** Functional
**Domain:** Student Analytics

The system must provide a comprehensive student dashboard displaying:

- Overall progress and performance trends over time
- Topic-wise proficiency levels with visual charts and graphs
- Historical exam results and score progression
- Current ability estimate (theta) visualization
- Comparison against target passing standards
- Learning streaks and engagement metrics

**Rationale:** Students need visibility into their progress to stay motivated and make informed study decisions.

---

#### REQ-021: Post-Exam Performance Analytics

**Priority:** Must
**Category:** Functional
**Domain:** Student Analytics

After every exam completion, the system must display detailed analytics including:

- Overall score and percentile ranking
- Topic-wise performance breakdown with strengths/weaknesses identification
- Time spent per question and section analysis
- Improvement areas compared to previous attempts
- Specific topics requiring more study time (prioritized list)
- Correct/incorrect answer review with explanations
- Performance trend compared to historical attempts

**Rationale:** Immediate feedback after exams helps students understand their strengths and weaknesses while the experience is fresh.

---

#### REQ-022: Study Time Recommendations

**Priority:** Should
**Category:** Functional
**Domain:** Student Analytics

The system must calculate and display recommended study time per topic based on:

- Current performance gaps (theta difference from target)
- Topic difficulty and weight in the exam
- Student's historical learning velocity
- Time until target exam date

Output must include:
- Specific hour estimates per topic
- Prioritized topic lists ranked by impact
- Weekly study schedule suggestions
- Progress milestones

**Rationale:** Personalized study time recommendations improve learning efficiency by focusing effort on weak areas.

---

### Exam Management Domain

#### REQ-023: Topic-Based Practice Exams

**Priority:** Must
**Category:** Functional
**Domain:** Exam Management

The system must support creation and delivery of topic-specific practice exams that:

- Target individual weak areas identified from analytics
- Allow students to select specific topics or categories for focused practice
- Provide focused assessments before attempting the full exam
- Track topic-specific improvement over multiple attempts
- Support configurable question counts per topic (5, 10, 20, custom)
- Include both adaptive and linear modes for practice

**Rationale:** Topic-focused practice enables targeted improvement and builds confidence in specific knowledge areas.

---

#### REQ-024: Intelligent Exam Scheduling

**Priority:** Should
**Category:** Functional
**Domain:** Exam Management

The system must calculate and suggest optimal exam dates based on:

- Current proficiency level (theta)
- Required topics still to cover
- Estimated study time needed per topic
- Student-defined target scores
- Historical improvement velocity (Δθ / week)
- Available study hours per week (user input)

The scheduler should:
- Integrate with gap analysis to predict readiness dates
- Allow students to set exam date goals and work backwards
- Provide milestone checkpoints leading to the exam
- Send reminders for scheduled topic exams and final exam

**Rationale:** Intelligent scheduling helps students plan their preparation timeline and set realistic exam dates.

---

### Administration Domain

#### REQ-025: Admin Question Management Dashboard

**Priority:** Must
**Category:** Functional
**Domain:** Administration

The system must provide an administrative dashboard for managing questions and question banks, supporting:

- **CRUD Operations:** Add, edit, delete, and clone questions
- **Organization:** Organize by categories, topics, and custom criteria
- **Bulk Operations:** Import/export via CSV, JSON, or Excel
- **Search & Filter:** Advanced filtering by topic, difficulty, status, author, date
- **Psychometrics:** Manage difficulty, discrimination, and guessing parameters
- **Workflow:** Question status management (Draft → Review → Active → Retired)
- **Audit:** Version history and change audit trail
- **Preview:** Test question rendering before publishing

**Rationale:** Efficient question management is essential for maintaining high-quality, organized question banks.

---

#### REQ-026: Question Bank Organization

**Priority:** Must
**Category:** Functional
**Domain:** Administration

The admin dashboard must support organizing questions into multiple question banks with:

- **Categories:** Configurable categories and subcategories (up to 3 levels deep)
- **Difficulty:** Standard levels (Easy, Medium, Hard, Expert) or custom scales
- **Tags:** Topic tags with hierarchical structure matching exam syllabus
- **Exam Types:** Associate questions with specific exam profiles
- **Custom Fields:** User-defined metadata fields for domain-specific criteria
- **Cross-Bank Sharing:** Questions can belong to multiple banks and categories
- **Statistics:** Per-bank statistics (question count, coverage, difficulty distribution)

**Rationale:** Flexible question organization enables efficient content reuse across different exam types and domains.

---

### B2C Platform Domain

#### REQ-027: Platform Exam Catalog

**Priority:** Must
**Category:** Functional
**Domain:** B2C Platform

The system must provide a browsable catalog of platform-owned exams (GMAT, GRE, NCLEX, etc.) that students can discover, preview, and purchase. The catalog must support:

- **Discovery:** Browse by exam type, category, and popularity
- **Filtering:** Filter by difficulty, price, duration, and ratings
- **Preview:** Sample questions and exam overview before purchase
- **Pricing:** Display pricing with subscription vs. one-time options
- **Search:** Full-text search across exam titles and descriptions

**Rationale:** A well-organized exam catalog is essential for B2C discovery and conversion.

---

#### REQ-028: Student Subscription Plans

**Priority:** Must
**Category:** Functional
**Domain:** B2C Platform

The system must support recurring subscription plans that grant students access to multiple exams:

- **Plan Tiers:** Basic (3 exams), Premium (10 exams), Unlimited (all exams)
- **Billing:** Monthly and annual billing options via Stripe
- **Management:** Self-service subscription upgrade, downgrade, and cancellation
- **Access Control:** Automatic access grant/revoke based on subscription status
- **Trials:** Support for free trial periods

**Rationale:** Subscription revenue provides predictable recurring income and encourages student engagement.

---

#### REQ-029: One-Time Exam Purchases

**Priority:** Must
**Category:** Functional
**Domain:** B2C Platform

The system must support one-time purchases of individual exams for students who prefer not to subscribe:

- **Pricing:** Per-exam pricing set by platform administrators
- **Access:** Permanent access to purchased exam with all features
- **Payment:** Secure checkout via Stripe with multiple payment methods
- **Receipt:** Email confirmation and purchase history in student dashboard
- **Bundles:** Support for discounted exam bundles

**Rationale:** One-time purchases offer flexibility for students who only need specific exams.

---

#### REQ-030: Mobile App Support

**Priority:** Should
**Category:** Functional
**Domain:** B2C Platform

The system must provide native mobile applications for iOS and Android that allow students to:

- **Browse:** Discover and purchase exams from the mobile app
- **Take Exams:** Full exam-taking experience optimized for mobile
- **Analytics:** View progress dashboard and post-exam analytics
- **Offline Mode:** Cache exams for offline testing (with sync on reconnect)
- **Notifications:** Push notifications for study reminders and exam availability

**Rationale:** Mobile apps increase accessibility and allow students to study on-the-go.

---

#### REQ-031: Progress Sync Across Devices

**Priority:** Must
**Category:** Functional
**Domain:** B2C Platform

The system must synchronize student progress, exam history, and analytics across all devices in real-time:

- **Seamless Handoff:** Start an exam on one device, continue on another
- **Real-Time Sync:** Progress updates within 5 seconds across devices
- **Conflict Resolution:** Handle concurrent edits gracefully
- **Offline Support:** Queue updates when offline, sync when online
- **Data Consistency:** Ensure exam state integrity across platforms

**Rationale:** Cross-device sync ensures a seamless experience for students who use multiple devices.

---

## Non-Functional Requirements

### Architecture Domain

#### REQ-012: Strategy Pattern Implementation

**Priority:** Must
**Category:** Non-Functional
**Domain:** Architecture

The backend code must use the Strategy Design Pattern for the scoring engine. Adding a new exam type (e.g., LSAT) should require creating a new Strategy Class, not modifying the core engine code.

**Rationale:** Strategy pattern ensures extensibility and maintainability of the scoring engine.

---

#### REQ-013: Service Decoupling

**Priority:** Must
**Category:** Non-Functional
**Domain:** Architecture

The Scoring Service (Python) must be completely decoupled from the Content Service (Express/Strapi). They shall communicate only via defined REST/gRPC APIs with versioned contracts.

**Rationale:** Service decoupling enables independent scaling, deployment, and technology evolution.

---

### Performance Domain

#### REQ-014: Next-Item Latency

**Priority:** Must
**Category:** Non-Functional
**Domain:** Performance

The time between submitting an answer and rendering the next adaptive question must be **< 200 milliseconds** (P95).

**Rationale:** Low latency is critical for test-taker experience and prevents timing advantages/disadvantages.

---

#### REQ-015: Horizontal Scaling

**Priority:** Must
**Category:** Non-Functional
**Domain:** Performance

The system must support horizontal scaling via Docker/Kubernetes to handle spikes in concurrent test-takers without degradation. Target: 10,000 concurrent sessions.

**Rationale:** Horizontal scaling ensures availability during peak testing periods.

---

## Security Requirements

### Security Domain

#### REQ-016: Item Exposure Control

**Priority:** Must
**Category:** Security
**Domain:** Security

The item selection algorithm must include a randomness factor or exposure control method (like the Sympson-Hetter method) to ensure no single question is overused, preserving bank security.

**Rationale:** Exposure control prevents item compromise and maintains test validity over time.

---

#### REQ-017: Anti-Harvesting Protection

**Priority:** Must
**Category:** Security
**Domain:** Security

The API must implement rate limiting and anomaly detection to prevent a single user from scraping the question bank by rapidly cycling through exams.

**Rationale:** Anti-harvesting protection preserves the integrity of the question bank.

---

### Data Integrity Domain

#### REQ-018: Audit Logging

**Priority:** Must
**Category:** Security
**Domain:** Data Integrity

Every keystroke, answer change (if allowed), and time-per-item must be logged for forensic analysis. Logs must be immutable and retained per compliance requirements.

**Rationale:** Comprehensive audit logging supports score validity defense and fraud investigation.

---

#### REQ-019: ACID Compliance

**Priority:** Must
**Category:** Technical
**Domain:** Data Integrity

Exam results and transactions must be stored in a relational database (PostgreSQL) with strict transaction guarantees to prevent data loss during network failures.

**Rationale:** ACID compliance ensures no exam results are lost due to system failures.

---

## Traceability Index

| Requirement ID | Title | Domain | Priority | User Stories |
|---------------|-------|--------|----------|--------------|
| REQ-001 | Polymorphic Exam Engine | Core Engine | Must | US-001, US-002 |
| REQ-002 | Session State Management | Core Engine | Must | US-003 |
| REQ-003 | Navigation Control | Core Engine | Must | US-004 |
| REQ-004 | Dynamic Item Schema | Content Management | Must | US-005 |
| REQ-005 | Hierarchical Tagging | Content Management | Must | US-006 |
| REQ-006 | Psychometric Metadata | Content Management | Must | US-007 |
| REQ-007 | AI Generation Pipeline | Content Authoring | Should | US-008 |
| REQ-008 | Human-in-the-Loop Validation | Content Authoring | Must | US-009 |
| REQ-009 | Gap Analysis | Analytics | Should | US-010 |
| REQ-010 | Velocity Prediction | Analytics | Could | US-011 |
| REQ-011 | Adaptive Remediation | Analytics | Should | US-012 |
| REQ-012 | Strategy Pattern Implementation | Architecture | Must | US-013 |
| REQ-013 | Service Decoupling | Architecture | Must | US-014 |
| REQ-014 | Next-Item Latency | Performance | Must | US-015 |
| REQ-015 | Horizontal Scaling | Performance | Must | US-016 |
| REQ-016 | Item Exposure Control | Security | Must | US-017 |
| REQ-017 | Anti-Harvesting Protection | Security | Must | US-018 |
| REQ-018 | Audit Logging | Data Integrity | Must | US-019 |
| REQ-019 | ACID Compliance | Data Integrity | Must | US-020 |
| REQ-020 | Student Progress Dashboard | Student Analytics | Must | US-021 |
| REQ-021 | Post-Exam Performance Analytics | Student Analytics | Must | US-022 |
| REQ-022 | Study Time Recommendations | Student Analytics | Should | US-023 |
| REQ-023 | Topic-Based Practice Exams | Exam Management | Must | US-024 |
| REQ-024 | Intelligent Exam Scheduling | Exam Management | Should | US-025 |
| REQ-025 | Admin Question Management Dashboard | Administration | Must | US-026 |
| REQ-026 | Question Bank Organization | Administration | Must | US-027 |
| REQ-027 | Platform Exam Catalog | B2C Platform | Must | US-028 |
| REQ-028 | Student Subscription Plans | B2C Platform | Must | US-029 |
| REQ-029 | One-Time Exam Purchases | B2C Platform | Must | US-030 |
| REQ-030 | Mobile App Support | B2C Platform | Should | US-031 |
| REQ-031 | Progress Sync Across Devices | B2C Platform | Must | US-032 |

---

## Glossary

| Term | Definition |
|------|------------|
| **CAT** | Computerized Adaptive Testing - adjusts item difficulty based on test-taker responses |
| **LOFT** | Linear-on-the-Fly Testing - randomly assembled fixed-length tests from a pool |
| **IRT** | Item Response Theory - statistical framework for designing and scoring tests |
| **Theta (θ)** | Ability estimate on the IRT scale, typically ranging from -4 to +4 |
| **SEM** | Standard Error of Measurement - precision of the ability estimate |
| **SATA** | Select All That Apply - multiple-response item type |
| **Sympson-Hetter** | Exposure control method that limits item usage probability |
| **1PL/2PL/3PL** | IRT models with 1, 2, or 3 parameters (difficulty, discrimination, guessing) |
| **Topic Exam** | Focused practice exam targeting specific subjects or competency areas |
| **Question Bank** | Organized collection of questions grouped by criteria for exam assembly |
| **B2C** | Business-to-Consumer - platform selling directly to individual students |
| **Subscription** | Recurring payment plan granting access to multiple exams |
| **Progress Sync** | Real-time synchronization of student data across devices |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-22 | Product Team | Initial RCF-compliant PRD with 19 requirements |
| 1.1.0 | 2026-01-01 | Product Team | Added Student Analytics (REQ-020-022), Exam Management (REQ-023-024), and Administration (REQ-025-026) requirements |
| 1.2.0 | 2026-01-02 | Product Team | Added B2C Platform (REQ-027-031) requirements for Phase 1 deployment |