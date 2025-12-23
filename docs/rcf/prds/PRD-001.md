# PRD-001: Universal Adaptive Testing Platform

**Status:** Draft
**Version:** 1.0.0
**Created:** 2025-12-22
**Last Updated:** 2025-12-22
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

### Out of Scope

- Proctoring and identity verification services (third-party integration only)
- Mobile native applications (web-responsive design only for MVP)
- Real-time video-based cheating detection
- Integration with specific LMS platforms (API-first approach for future integrations)
- Psychometric research and item calibration studies (platform supports data export)

---

## Constraints

- Must comply with accessibility standards (WCAG 2.1 AA)
- Must support PostgreSQL as the primary database for ACID compliance
- Scoring Service must be implemented in Python for statistical library support
- Must operate in cloud-agnostic containerized environment (Docker/Kubernetes)
- API response times must meet P95 < 200ms SLA for adaptive item selection

---

## Functional Requirements

### REQ-001: Polymorphic Exam Engine

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

### REQ-002: Session State Management

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

### REQ-003: Navigation Control

**Priority:** Must
**Category:** Functional
**Domain:** Core Engine

The system must support configurable navigation constraints:

- **Unidirectional:** No going back (CAT standard)
- **Bidirectional:** Flag and review (Linear standard)

Navigation mode must be configurable per Exam Profile.

**Rationale:** Different exam methodologies require different navigation rules to maintain test validity and security.

---

### REQ-004: Dynamic Item Schema

**Priority:** Must
**Category:** Functional
**Domain:** Content Management

The database must use `JSONB` structures to store question content, allowing for:

- **Variable Option Counts:** 2 to N options
- **Interaction Types:** Single Select, Multi-Select (SATA), Ordering, Hotspot (Image coordinates), Drag-and-Drop

**Rationale:** Schema-agnostic storage enables support for any domain without database schema changes.

---

### REQ-005: Hierarchical Tagging

**Priority:** Must
**Category:** Functional
**Domain:** Content Management

Questions must support a flexible tagging tree (Domain → Subject → Topic → Competency) to map to any external syllabus such as NCLEX Client Needs or GMAT Quant categories.

**Rationale:** Flexible tagging enables content reuse across different exam profiles and supports granular performance analytics.

---

### REQ-006: Psychometric Metadata

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

### REQ-007: AI Generation Pipeline

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

### REQ-008: Human-in-the-Loop Validation

**Priority:** Must
**Category:** Functional
**Domain:** Content Authoring

Generated items must enter a `DRAFT` state. They can only be promoted to `ACTIVE` (live) after manual review and approval by an Admin. The system must support workflow states:

`DRAFT` → `REVIEW` → `ACTIVE` → `RETIRED`

**Rationale:** Human validation ensures content quality and accuracy before items are used in live assessments.

---

### REQ-009: Gap Analysis

**Priority:** Should
**Category:** Functional
**Domain:** Analytics

The system must compare a user's Current Theta against the Target Theta (Passing Standard) defined in the Exam Profile. Gap analysis must be visualized at overall and topic/competency levels.

**Rationale:** Gap analysis helps learners understand their readiness and focus study efforts effectively.

---

### REQ-010: Velocity Prediction

**Priority:** Could
**Category:** Functional
**Domain:** Analytics

The system shall calculate a "Ready Date" based on the user's historical rate of improvement (Δθ / Time). Prediction must account for study frequency and topic-specific progress.

**Rationale:** Velocity prediction helps learners plan their study schedule and set realistic exam dates.

---

### REQ-011: Adaptive Remediation

**Priority:** Should
**Category:** Functional
**Domain:** Analytics

The system must generate dynamic study tasks (e.g., "Take a 20-question quiz on Topic X") specifically targeting the user's lowest-performing metadata tags.

**Rationale:** Targeted remediation improves learning efficiency by focusing on areas of weakness.

---

## Non-Functional Requirements

### REQ-012: Strategy Pattern Implementation

**Priority:** Must
**Category:** Non-Functional
**Domain:** Architecture

The backend code must use the Strategy Design Pattern for the scoring engine. Adding a new exam type (e.g., LSAT) should require creating a new Strategy Class, not modifying the core engine code.

**Rationale:** Strategy pattern ensures extensibility and maintainability of the scoring engine.

---

### REQ-013: Service Decoupling

**Priority:** Must
**Category:** Non-Functional
**Domain:** Architecture

The Scoring Service (Python) must be completely decoupled from the Content Service (Express/Strapi). They shall communicate only via defined REST/gRPC APIs with versioned contracts.

**Rationale:** Service decoupling enables independent scaling, deployment, and technology evolution.

---

### REQ-014: Next-Item Latency

**Priority:** Must
**Category:** Non-Functional
**Domain:** Performance

The time between submitting an answer and rendering the next adaptive question must be **< 200 milliseconds** (P95).

**Rationale:** Low latency is critical for test-taker experience and prevents timing advantages/disadvantages.

---

### REQ-015: Horizontal Scaling

**Priority:** Must
**Category:** Non-Functional
**Domain:** Performance

The system must support horizontal scaling via Docker/Kubernetes to handle spikes in concurrent test-takers without degradation. Target: 10,000 concurrent sessions.

**Rationale:** Horizontal scaling ensures availability during peak testing periods.

---

## Security Requirements

### REQ-016: Item Exposure Control

**Priority:** Must
**Category:** Security
**Domain:** Security

The item selection algorithm must include a randomness factor or exposure control method (like the Sympson-Hetter method) to ensure no single question is overused, preserving bank security.

**Rationale:** Exposure control prevents item compromise and maintains test validity over time.

---

### REQ-017: Anti-Harvesting Protection

**Priority:** Must
**Category:** Security
**Domain:** Security

The API must implement rate limiting and anomaly detection to prevent a single user from scraping the question bank by rapidly cycling through exams.

**Rationale:** Anti-harvesting protection preserves the integrity of the question bank.

---

### REQ-018: Audit Logging

**Priority:** Must
**Category:** Security
**Domain:** Data Integrity

Every keystroke, answer change (if allowed), and time-per-item must be logged for forensic analysis. Logs must be immutable and retained per compliance requirements.

**Rationale:** Comprehensive audit logging supports score validity defense and fraud investigation.

---

### REQ-019: ACID Compliance

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

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-22 | Product Team | Initial RCF-compliant PRD with 19 requirements |
