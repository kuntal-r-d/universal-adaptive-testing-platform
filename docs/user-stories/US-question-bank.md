# User Stories: Question Bank (REQ-002)

**Traces to:** REQ-002 (Universal Question Bank)  
**Status:** Draft  
**Sprint:** Backlog  

---

## US-004: Create Dynamic Question Items

**As a** Content Author  
**I want to** create questions with flexible schemas and variable option counts  
**So that** I can support different question types without database changes  

**Traces to:** REQ-002.1  
**Priority:** Critical  
**Story Points:** 8  

### Acceptance Criteria

#### AC-008: Variable Option Counts
- **Given** I am creating a new question
- **When** I define the answer options
- **Then** I can add between 2 and N options
- **And** the system validates at least 2 options exist

#### AC-009: Multiple Interaction Types
- **Given** I am creating a new question
- **When** I select the interaction type
- **Then** I can choose from:
  - Single Select (radio buttons)
  - Multi-Select/SATA (checkboxes)
  - Ordering (drag to reorder)
  - Hotspot (click on image)
  - Drag-and-Drop (match items)
- **And** the form adapts to show appropriate fields for each type

---

## US-005: Tag Questions with Hierarchical Taxonomy

**As a** Content Author  
**I want to** tag questions with a hierarchical taxonomy  
**So that** questions can be mapped to any exam syllabus structure  

**Traces to:** REQ-002.2  
**Priority:** High  
**Story Points:** 5  

### Acceptance Criteria

#### AC-010: Hierarchical Tag Structure
- **Given** I am tagging a question
- **When** I select tags
- **Then** I can navigate a tree: Domain → Subject → Topic → Competency
- **And** I can select tags at any level of the hierarchy

#### AC-011: Multi-Tag Support
- **Given** I am tagging a question
- **When** I assign tags
- **Then** I can assign multiple tags from different branches
- **And** the question is findable by any assigned tag

---

## US-006: Manage Psychometric Metadata

**As a** Psychometrician  
**I want to** view and edit IRT parameters for questions  
**So that** the adaptive algorithm uses accurate item characteristics  

**Traces to:** REQ-002.3  
**Priority:** Critical  
**Story Points:** 5  

### Acceptance Criteria

#### AC-012: IRT Parameter Display
- **Given** I am viewing a question's metadata
- **When** I look at psychometric data
- **Then** I can see: Difficulty (β), Discrimination (α), Guessing (γ), Exposure Count

#### AC-013: Parameter Editing
- **Given** I have psychometrician permissions
- **When** I edit IRT parameters
- **Then** I can update β, α, γ values
- **And** the system validates parameter ranges (e.g., α > 0)
- **And** changes are logged for audit

#### AC-014: Exposure Tracking
- **Given** a question is administered in an exam
- **When** the exam session completes
- **Then** the exposure count for that question is incremented
- **And** the timestamp of last exposure is recorded

---

## Traceability Matrix

| User Story | Requirement | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-004 | REQ-002.1 | AC-008, AC-009 | Draft |
| US-005 | REQ-002.2 | AC-010, AC-011 | Draft |
| US-006 | REQ-002.3 | AC-012, AC-013, AC-014 | Draft |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-12-22 | Auto-generated | Initial user stories for Question Bank |
