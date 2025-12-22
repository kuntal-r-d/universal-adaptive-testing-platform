# RCF (Requirements Confidence Framework) Guide

This project uses RCF to maintain traceability between business requirements and test verification for the **Universal Adaptive Testing Platform**.

---

## Table of Contents

1. [Setup Steps Completed](#setup-steps-completed)
2. [Project Structure](#project-structure)
3. [Traceability Hierarchy](#traceability-hierarchy)
4. [RCF Tools Reference](#rcf-tools-reference)
5. [RCF Resources Reference](#rcf-resources-reference)
6. [RCF Prompts Reference](#rcf-prompts-reference)
7. [ID Conventions](#id-conventions)
8. [Coverage Status](#coverage-status)
9. [Workflow](#workflow)
10. [Next Steps](#next-steps)

---

## Setup Steps Completed

The following steps were completed to configure RCF for this project:

### Step 1: Initialize RCF Structure ✅

Created the foundational folder structure and configuration files:

```bash
# Created directories
mkdir -p .rcf docs/prd docs/user-stories docs/test-specs
```

**Files Created:**
| File | Purpose |
|------|---------|
| `rcf-manifest.json` | Project configuration - defines paths, ID prefixes, and metadata |
| `.rcf/config.json` | Validation rules - traceability requirements and coverage thresholds |

### Step 2: Convert Product Requirements to RCF PRD Format ✅

Transformed the original `product requirements.md` into structured RCF format:

- Assigned unique IDs to each requirement (REQ-001 to REQ-008)
- Created sub-requirement IDs (REQ-001.1, REQ-001.2, etc.)
- Added metadata (priority, category, status)
- Created both Markdown (.md) and JSON (.json) versions

**Files Created:**
- `docs/prd/PRD-001-universal-adaptive-testing.md`
- `docs/prd/PRD-001-universal-adaptive-testing.json`

### Step 3: Create User Stories from Requirements ✅

Created User Stories with Acceptance Criteria following the Given/When/Then format:

- Linked each User Story to its parent Requirement
- Defined testable Acceptance Criteria with unique IDs
- Created traceability matrices

**Files Created:**
- `docs/user-stories/US-exam-engine.md` (US-001 to US-003, AC-001 to AC-007)
- `docs/user-stories/US-exam-engine.json`
- `docs/user-stories/US-question-bank.md` (US-004 to US-006, AC-008 to AC-014)

### Step 4: Connect RCF Tools to Repository ✅

- Committed all RCF files to Git
- Pushed to GitHub (`kuntal-r-d/universal-adaptive-testing-platform`)
- Consolidated to single `main` branch

### Step 5: Documentation ✅

- Created this RCF-README.md guide
- Added traceability documentation

---

## Project Structure

```
adaptive-test/
├── .rcf/
│   └── config.json                           # Validation and coverage settings
├── docs/
│   ├── prd/
│   │   ├── PRD-001-universal-adaptive-testing.md    # Human-readable PRD
│   │   └── PRD-001-universal-adaptive-testing.json  # Machine-readable PRD
│   ├── user-stories/
│   │   ├── US-exam-engine.md                 # Exam Engine stories (REQ-001)
│   │   ├── US-exam-engine.json               # JSON format for tooling
│   │   └── US-question-bank.md               # Question Bank stories (REQ-002)
│   ├── test-specs/                           # Test specifications (to be added)
│   └── RCF-README.md                         # This documentation
├── product requirements.md                    # Original requirements document
└── rcf-manifest.json                         # RCF project configuration
```

---

## Traceability Hierarchy

```
PRD-001: Universal Adaptive Testing Platform
│
├── REQ-001: Polymorphic Exam Engine
│   ├── US-001: Configure Exam Profile
│   │   ├── AC-001: Algorithm Selection
│   │   ├── AC-002: Scoring Model Configuration
│   │   └── AC-003: Stopping Rules Definition
│   ├── US-002: Resume Interrupted Exam Session
│   │   ├── AC-004: Session State Preservation
│   │   └── AC-005: Session Timeout Handling
│   └── US-003: Navigate Exam Based on Profile Rules
│       ├── AC-006: Unidirectional Navigation
│       └── AC-007: Bidirectional Navigation
│
├── REQ-002: Universal Question Bank
│   ├── US-004: Create Dynamic Question Items
│   │   ├── AC-008: Variable Option Counts
│   │   └── AC-009: Multiple Interaction Types
│   ├── US-005: Tag Questions with Hierarchical Taxonomy
│   │   ├── AC-010: Hierarchical Tag Structure
│   │   └── AC-011: Multi-Tag Support
│   └── US-006: Manage Psychometric Metadata
│       ├── AC-012: IRT Parameter Display
│       ├── AC-013: Parameter Editing
│       └── AC-014: Exposure Tracking
│
├── REQ-003: AI-Augmented Authoring (stories pending)
├── REQ-004: Smart Coach Analytics (stories pending)
├── REQ-005: Extensibility & Modularity (stories pending)
├── REQ-006: Performance & Latency (stories pending)
├── REQ-007: Security & Integrity (stories pending)
└── REQ-008: Data Integrity (stories pending)
```

---

## RCF Tools Reference

### Connection & Status Tools

#### `rcf_connect` - Connect to Repository

Connects to a GitHub repository containing RCF documentation.

**Use Case for This Project:**
```javascript
// Connect to the Universal Adaptive Testing Platform repository
rcf_connect({ 
  repo: "kuntal-r-d/universal-adaptive-testing-platform",
  branch: "main"  // Optional, defaults to main
})
```

**When to Use:**
- Starting a new session to work with RCF
- After switching to this project from another

---

#### `rcf_status` - Check Connection Status

Returns current connection status, active PRD, and project statistics.

**Use Case for This Project:**
```javascript
rcf_status()

// Expected output:
// - Connected: kuntal-r-d/universal-adaptive-testing-platform
// - Active PRD: PRD-001
// - Requirements: 8
// - User Stories: 6 (defined) / 16 (target)
// - Acceptance Criteria: 14
```

**When to Use:**
- Verify you're connected to the correct project
- Check overall project statistics
- Before making changes to ensure correct context

---

#### `rcf_disconnect` - Clear Session

Disconnects from the current project and clears session state.

**Use Case for This Project:**
```javascript
rcf_disconnect()
```

**When to Use:**
- Switching to a different project
- Ending your RCF session

---

#### `rcf_sync` - Sync with Remote

Synchronizes local cache with the remote GitHub repository.

**Use Case for This Project:**
```javascript
// Check for changes and refresh
rcf_sync()

// Force full resync
rcf_sync({ force: true })
```

**When to Use:**
- After someone else pushes changes to the repository
- When you suspect your local cache is stale

---

### Query & Traceability Tools

#### `rcf_query` - Query Traceability Data

The primary tool for querying traceability relationships.

**Use Cases for This Project:**

```javascript
// 1. Check coverage for a requirement
rcf_query({ type: "coverage", target: "REQ-001" })
// Returns: US-001, US-002, US-003 with their ACs

// 2. Trace an acceptance criterion back to its requirement
rcf_query({ type: "trace-back", target: "AC-005" })
// Returns: AC-005 → US-002 → REQ-001.2 → REQ-001

// 3. Trace a requirement forward to all related items
rcf_query({ type: "trace-forward", target: "REQ-002" })
// Returns: REQ-002 → US-004, US-005, US-006 → AC-008 to AC-014

// 4. Get details of a single requirement
rcf_query({ type: "requirement", target: "REQ-001" })

// 5. Get details of a single user story
rcf_query({ type: "story", target: "US-003" })
```

**Query Types:**
| Type | Description | Example Target |
|------|-------------|----------------|
| `coverage` | Check REQ coverage | REQ-001 |
| `trace-forward` | REQ → US → AC | REQ-002 |
| `trace-back` | AC → US → REQ | AC-007 |
| `affected-by` | FBS → REQs | FBS-001 |
| `stories-for-fbs` | FBS → USs | FBS-002 |
| `requirement` | Single REQ details | REQ-003 |
| `story` | Single US details | US-005 |

---

#### `rcf_coverage` - Project-Level Coverage Analysis

Returns comprehensive coverage summary across all requirements.

**Use Case for This Project:**
```javascript
// Get full coverage analysis
rcf_coverage()

// Filter by coverage status
rcf_coverage({ filter: "uncovered" })  // REQ-003 to REQ-008
rcf_coverage({ filter: "covered" })    // REQ-001, REQ-002
rcf_coverage({ filter: "partial" })    // Stories but missing ACs
```

**When to Use:**
- Sprint planning to identify uncovered requirements
- Progress reporting to stakeholders
- Before release to ensure all requirements are tested

---

### PRD Management Tools

#### `rcf_prd_view` - View PRD as Markdown

**Use Case for This Project:**
```javascript
// View the active PRD (PRD-001)
rcf_prd_view()

// View a specific PRD
rcf_prd_view({ prdId: "PRD-001" })
```

---

#### `rcf_prd_generate_start` - Generate New PRD

Start background PRD generation from requirements themes.

**Use Case for This Project (if creating new PRD):**
```javascript
rcf_prd_generate_start({
  productName: "Universal Adaptive Testing Platform",
  problemStatement: "Need configurable, extensible adaptive testing engine",
  targetUsers: ["Test-Takers", "Content Authors", "Administrators", "Psychometricians"],
  requirementThemes: [
    { name: "Exam Engine", description: "Adaptive and linear exam support" },
    { name: "Question Bank", description: "Dynamic question storage and tagging" },
    { name: "AI Authoring", description: "LLM-powered question generation" },
    { name: "Analytics", description: "Smart coach and gap analysis" }
  ],
  depth: "comprehensive"
})
```

---

#### `rcf_prd_edit_start` - Edit PRD

Make amendments to the existing PRD.

**Use Cases for This Project:**
```javascript
// Add a new requirement
rcf_prd_edit_start({
  amendments: "Add REQ-009 for multi-tenant support with organization isolation"
})

// Modify existing requirement priority
rcf_prd_edit_start({
  amendments: "Change REQ-003 priority from 'high' to 'critical'"
})

// Add acceptance criteria detail
rcf_prd_edit_start({
  amendments: "Add more detail to REQ-006.1 about specific latency thresholds for different question types"
})
```

---

#### `rcf_prd_save` - Save PRD to Git

Save PRD changes and optionally create a PR.

**Use Case for This Project:**
```javascript
// Save with auto-generated PR
rcf_prd_save({ createPr: true })

// Save with custom branch and message
rcf_prd_save({
  branchName: "feature/prd-add-multitenancy",
  commitMessage: "feat(prd): Add multi-tenant support requirement",
  createPr: true,
  prTitle: "Add REQ-009: Multi-tenant Support"
})
```

---

### User Stories Tools

#### `rcf_stories_view` - View User Stories

**Use Case for This Project:**
```javascript
// View all user stories for active PRD
rcf_stories_view()
```

---

#### `rcf_stories_generate_start` - Generate User Stories

Generate user stories from PRD requirements.

**Use Case for This Project:**
```javascript
// Generate stories for remaining requirements
rcf_stories_generate_start({
  options: {
    maxStoriesPerReq: 3,
    maxAcPerStory: 5
  }
})
```

**When to Use:**
- After creating/updating the PRD
- To generate US-007 to US-016 for REQ-003 to REQ-008

---

#### `rcf_stories_edit_start` - Edit User Stories

**Use Cases for This Project:**
```javascript
// Add a new user story
rcf_stories_edit_start({
  amendments: "Add US-007 for AI question generation: As a Content Author, I want to generate draft questions using AI so that I can create content faster"
})

// Add acceptance criteria to existing story
rcf_stories_edit_start({
  amendments: "Add AC-015 to US-006: Given I edit IRT parameters, When I save, Then an audit log entry is created"
})

// Modify existing story
rcf_stories_edit_start({
  amendments: "Update US-002 to include offline mode resume capability"
})
```

---

#### `rcf_stories_save` - Save User Stories to Git

**Use Case for This Project:**
```javascript
rcf_stories_save({
  createPr: true,
  prTitle: "feat(stories): Add user stories for AI Authoring (REQ-003)"
})
```

---

### TAD (Technical Architecture Document) Tools

#### `rcf_tad_generate_start` - Generate TAD

Generate technical architecture from PRD and User Stories.

**Use Case for This Project:**
```javascript
rcf_tad_generate_start({
  techStack: ["Python", "Node.js", "PostgreSQL", "React", "Redis"],
  patterns: ["microservices", "event-driven", "CQRS"],
  constraints: [
    "Must support horizontal scaling",
    "< 200ms P95 latency for item selection",
    "ACID compliance for exam results"
  ],
  comprehensiveness: "comprehensive"
})
```

---

#### `rcf_tad_view` - View TAD

**Use Case for This Project:**
```javascript
rcf_tad_view()
rcf_tad_view({ includeExtractedConcerns: true })
```

---

#### `rcf_tad_edit_start` - Edit TAD

**Use Cases for This Project:**
```javascript
// Update technology choice
rcf_tad_edit_start({
  amendments: "Change database from PostgreSQL to CockroachDB for better horizontal scaling",
  sections: ["dataArchitecture"]
})

// Add security consideration
rcf_tad_edit_start({
  amendments: "Add OAuth2/OIDC integration for SSO support",
  sections: ["securityArchitecture"]
})
```

---

### Validation & Schema Tools

#### `rcf_schema` - Get Document Schema

Retrieve JSON schemas for creating valid RCF documents.

**Use Case for This Project:**
```javascript
// Get PRD schema for programmatic creation
rcf_schema({ documentType: "PRD" })

// Get User Stories schema
rcf_schema({ documentType: "UserStories" })
```

---

#### `rcf_validate` - Validate Document

Validate PRD or UserStories JSON without storing.

**Use Case for This Project:**
```javascript
// Validate a new requirement before adding
rcf_validate({
  documentType: "PRD",
  document: { /* PRD JSON */ },
  deepValidation: true
})
```

---

#### `rcf_import_prd` - Import External PRD

Import a pre-built PRD JSON as draft.

**Use Case for This Project:**
```javascript
// If PRD was created in external tool
rcf_import_prd({
  prd: { /* PRD JSON matching schema */ },
  returnMarkdown: true
})
```

---

### Knowledge & Learning Tools

#### `rcf_explain` - Query RCF Methodology

Get guidance on RCF concepts and best practices.

**Use Cases for This Project:**
```javascript
// Understand traceability
rcf_explain({ topic: "traceability", depth: "with_examples" })

// Learn about numbering conventions
rcf_explain({ topic: "numbering", depth: "detailed" })

// Understand the testing flow
rcf_explain({ topic: "testing", depth: "detailed" })
```

**Available Topics:**
| Topic | Description |
|-------|-------------|
| `overview` | Core RCF concepts |
| `traceability` | Linking requirements to tests |
| `process` | RCF workflow steps |
| `documents` | Document types and structure |
| `prd` | PRD creation best practices |
| `user-stories` | User story format and ACs |
| `tad` | Technical architecture docs |
| `testing` | Test specifications and cases |
| `numbering` | ID conventions and patterns |
| `conversion` | Converting existing docs to RCF |

---

## RCF Resources Reference

Access RCF documentation and schemas via MCP resources.

### Documentation Resources

| Resource URI | Description | Use Case |
|--------------|-------------|----------|
| `rcf://docs/overview` | Core RCF concepts | Understand the PRD → REQ → US → AC → TS → TC hierarchy |
| `rcf://docs/quickstart` | Step-by-step setup | Reference when setting up RCF in a new project |
| `rcf://docs/document-structure` | Document relationships | Understand how PRD, User Stories, and TAD relate |
| `rcf://docs/build-process` | 5-step build cycle | Follow Specify → Build → Review → Verify → Sign-off |

### Schema Resources

| Resource URI | Description | Use Case |
|--------------|-------------|----------|
| `rcf://schemas/prd` | PRD JSON schema | Validate `PRD-001-universal-adaptive-testing.json` |
| `rcf://schemas/user-stories` | User Stories schema | Validate `US-exam-engine.json` structure |

---

## RCF Prompts Reference

Interactive prompts for learning and setup.

### `rcf_getting_started` - Setup Guide

Interactive guide for connecting to RCF repositories.

**When to Use:**
- First time setting up RCF in a project
- Onboarding new team members

### `rcf_tutor` - Interactive Learning

Q&A session to learn RCF methodology.

**Use Cases for This Project:**
- Training new team members on RCF workflow
- Understanding how to write good acceptance criteria
- Learning traceability best practices

---

## ID Conventions

| Type | Prefix | Format | Examples |
|------|--------|--------|----------|
| Product Requirements Doc | PRD | PRD-NNN | PRD-001 |
| Requirement | REQ | REQ-NNN or REQ-NNN.N | REQ-001, REQ-001.1 |
| User Story | US | US-NNN | US-001, US-015 |
| Acceptance Criteria | AC | AC-NNN | AC-001, AC-014 |
| Test Specification | TS | TS-NNN | TS-001 |
| Test Case | TC | TC-NNN | TC-001, TC-042 |

---

## Coverage Status

| Requirement | Title | User Stories | Acceptance Criteria | Coverage |
|-------------|-------|--------------|---------------------|----------|
| REQ-001 | Polymorphic Exam Engine | US-001, US-002, US-003 | AC-001 to AC-007 | ✅ Stories defined |
| REQ-002 | Universal Question Bank | US-004, US-005, US-006 | AC-008 to AC-014 | ✅ Stories defined |
| REQ-003 | AI-Augmented Authoring | Pending | Pending | ⏳ Needs stories |
| REQ-004 | Smart Coach Analytics | Pending | Pending | ⏳ Needs stories |
| REQ-005 | Extensibility & Modularity | Pending | Pending | ⏳ Needs stories |
| REQ-006 | Performance & Latency | Pending | Pending | ⏳ Needs stories |
| REQ-007 | Security & Integrity | Pending | Pending | ⏳ Needs stories |
| REQ-008 | Data Integrity | Pending | Pending | ⏳ Needs stories |

**Summary:**
- Requirements: 8 total
- Covered: 2 (25%)
- Pending: 6 (75%)
- Acceptance Criteria: 14 defined

---

## Workflow

The RCF build cycle for this project:

### 1. Specify 📝
Create/update PRD with requirements using `rcf_prd_edit_start`

### 2. Build 🔨
Generate user stories with `rcf_stories_generate_start` or `rcf_stories_edit_start`

### 3. Review 👀
- Team reviews stories for completeness
- Check coverage with `rcf_coverage()`
- Validate traceability with `rcf_query({ type: "trace-forward", target: "REQ-XXX" })`

### 4. Verify ✓
- Create test specifications in `docs/test-specs/`
- Link each TS to its parent AC
- Create test cases (TC) for each TS

### 5. Sign-off ✅
- Run tests and mark requirements as verified
- Update status to "approved" when all tests pass

---

## Next Steps

### Immediate Actions
1. ⏳ Generate user stories for REQ-003 (AI-Augmented Authoring)
2. ⏳ Generate user stories for REQ-004 (Smart Coach Analytics)
3. ⏳ Generate user stories for REQ-005 through REQ-008

### Future Actions
4. ⏳ Generate Technical Architecture Document (TAD) using `rcf_tad_generate_start`
5. ⏳ Create test specifications (TS) for acceptance criteria
6. ⏳ Create test cases (TC) linked to test specifications
7. ⏳ Achieve 100% requirement coverage

---

## Quick Reference Commands

```javascript
// Connect to project
rcf_connect({ repo: "kuntal-r-d/universal-adaptive-testing-platform" })

// Check status
rcf_status()

// View PRD
rcf_prd_view()

// Check coverage
rcf_coverage()
rcf_coverage({ filter: "uncovered" })

// Query specific requirement
rcf_query({ type: "trace-forward", target: "REQ-001" })

// Generate remaining stories
rcf_stories_generate_start()

// Save changes
rcf_stories_save({ createPr: true })
```

---

*Last Updated: December 22, 2024*
