# PRD-001: Universal Adaptive Testing Platform

**Status:** Draft  
**Version:** 1.0.0  
**Created:** 2024-12-22  
**Last Updated:** 2024-12-22  
**Owner:** Product Team  

---

## Executive Summary

A configurable, extensible adaptive testing engine supporting multiple exam methodologies (CAT, LOFT, Linear) with AI-augmented content authoring and smart analytics.

---

## Functional Requirements

### REQ-001: Polymorphic Exam Engine

**Priority:** Critical  
**Category:** Core Engine  

The system must support a "Pluggable Strategy" architecture to handle different exam methodologies dynamically.

#### REQ-001.1: Engine Configuration Profile

The system shall allow administrators to define an "Exam Profile" with specific parameters:

- **Algorithm Types:** `Item_Adaptive` (NCLEX/GMAT), `Section_Adaptive` (GRE), `Linear_Fixed` (Standard), `LOFT` (Randomized)
- **Scoring Models:** Configurable IRT models (Rasch, 1PL, 2PL, 3PL) or Classical Test Theory (Summation)
- **Stopping Rules:**
  - *Standard Error Rule:* Stop when SEM < X (e.g., 0.3)
  - *Length Rule:* Min/Max question counts (e.g., Min 75, Max 145)
  - *Time Rule:* Max duration (e.g., 180 mins)

#### REQ-001.2: Session State Management

The system must preserve the state of every active exam. If a user disconnects, they must be able to resume at the exact question index with the exact same timer value.

#### REQ-001.3: Navigation Control

The system must support configurable navigation constraints:

- *Unidirectional:* No going back (CAT standard)
- *Bidirectional:* Flag and review (Linear standard)

---

### REQ-002: Universal Question Bank (CMS)

**Priority:** Critical  
**Category:** Content Management  

The content management system must be schema-agnostic to support any domain (Nursing, Business, Engineering).

#### REQ-002.1: Dynamic Item Schema

The database must use `JSONB` structures to store question content, allowing for:

- **Variable Option Counts:** 2 to N options
- **Interaction Types:** Single Select, Multi-Select (SATA), Ordering, Hotspot (Image coordinates), Drag-and-Drop

#### REQ-002.2: Hierarchical Tagging

Questions must support a flexible tagging tree (Domain → Subject → Topic → Competency) to map to any external syllabus.

#### REQ-002.3: Psychometric Metadata

Every question record must store:

- Difficulty Parameter (β)
- Discrimination Parameter (α)
- Guessing Parameter (γ)
- Exposure Count (to track how often a question is shown)

---

### REQ-003: AI-Augmented Authoring

**Priority:** High  
**Category:** Content Generation  

#### REQ-003.1: Generation Pipeline

The system shall provide an interface to prompt an LLM (via API) to generate draft items based on a specific "Exam Profile" and "Topic."

#### REQ-003.2: Human-in-the-Loop Validation

Generated items must enter a `DRAFT` state. They can only be promoted to `ACTIVE` (live) after manual review and approval by an Admin.

---

### REQ-004: Smart Coach Analytics

**Priority:** High  
**Category:** Analytics & Insights  

#### REQ-004.1: Gap Analysis

The system must compare a user's `Current Theta` against the `Target Theta` (Passing Standard) defined in the Exam Profile.

#### REQ-004.2: Velocity Prediction

The system shall calculate a "Ready Date" based on the user's historical rate of improvement (Δθ / Time).

#### REQ-004.3: Adaptive Remediation

The system must generate dynamic study tasks (e.g., "Take a 20-question quiz on Topic X") specifically targeting the user's lowest-performing metadata tags.

---

## Non-Functional Requirements

### REQ-005: Extensibility & Modularity

**Priority:** Critical  
**Category:** Architecture  

#### REQ-005.1: Strategy Pattern Implementation

The backend code (Python/Node) must use the Strategy Design Pattern for the scoring engine. Adding a new exam type (e.g., "LSAT") should require creating a new Strategy Class, not modifying the core engine code.

#### REQ-005.2: Service Decoupling

The "Scoring Service" (Python) must be completely strictly decoupled from the "Content Service" (Strapi/Express). They shall communicate only via defined REST/gRPC APIs.

---

### REQ-006: Performance & Latency

**Priority:** Critical  
**Category:** Performance  

#### REQ-006.1: Next-Item Latency

The time between submitting an answer and rendering the next adaptive question must be **< 200 milliseconds** (P95).

#### REQ-006.2: Concurrent User Scaling

The system must support horizontal scaling (via Docker/Kubernetes) to handle spikes in concurrent test-takers without degradation.

---

### REQ-007: Security & Integrity

**Priority:** Critical  
**Category:** Security  

#### REQ-007.1: Item Exposure Control

The item selection algorithm must include a "randomness factor" or exposure control method (like the Sympson-Hetter method) to ensure no single question is overused, preserving bank security.

#### REQ-007.2: Anti-Harvesting Protection

The API must implement rate limiting and anomaly detection to prevent a single user from "scraping" the question bank by rapidly cycling through exams.

---

### REQ-008: Data Integrity

**Priority:** Critical  
**Category:** Data Management  

#### REQ-008.1: Audit Logging

Every keystroke, answer change (if allowed), and time-per-item must be logged for forensic analysis.

#### REQ-008.2: ACID Compliance

Exam results and transactions must be stored in a relational database (PostgreSQL) with strict transaction guarantees to prevent data loss during network failures.

---

## Traceability Index

| Requirement ID | Description | User Stories |
|---------------|-------------|--------------|
| REQ-001 | Polymorphic Exam Engine | US-001, US-002, US-003 |
| REQ-002 | Universal Question Bank | US-004, US-005, US-006 |
| REQ-003 | AI-Augmented Authoring | US-007, US-008 |
| REQ-004 | Smart Coach Analytics | US-009, US-010, US-011 |
| REQ-005 | Extensibility & Modularity | US-012 |
| REQ-006 | Performance & Latency | US-013 |
| REQ-007 | Security & Integrity | US-014, US-015 |
| REQ-008 | Data Integrity | US-016 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-12-22 | Auto-generated | Initial PRD creation from product requirements |
