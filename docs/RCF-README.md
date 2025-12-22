# RCF (Requirements Confidence Framework) Guide

This project uses RCF to maintain traceability between business requirements and test verification.

## Quick Start

### Connect to the Repository (via MCP)

```
rcf_connect({ repo: "kuntal-r-d/universal-adaptive-testing-platform" })
```

### Check Project Status

```
rcf_status()
```

### Query Traceability

```javascript
// Check coverage for a requirement
rcf_query({ type: "coverage", target: "REQ-001" })

// Trace an acceptance criterion back to its requirement
rcf_query({ type: "trace-back", target: "AC-001" })

// Trace a requirement forward to see all related items
rcf_query({ type: "trace-forward", target: "REQ-001" })
```

---

## Project Structure

```
adaptive-test/
├── .rcf/
│   └── config.json              # Validation and coverage settings
├── docs/
│   ├── prd/
│   │   ├── PRD-001-*.md         # Human-readable PRD
│   │   └── PRD-001-*.json       # Machine-readable PRD
│   ├── user-stories/
│   │   ├── US-exam-engine.md    # Exam Engine stories
│   │   ├── US-exam-engine.json  # JSON format
│   │   └── US-question-bank.md  # Question Bank stories
│   └── test-specs/              # Test specifications (to be added)
└── rcf-manifest.json            # Project configuration
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

## ID Conventions

| Type | Prefix | Example |
|------|--------|---------|
| Requirement | REQ | REQ-001, REQ-001.1 |
| User Story | US | US-001 |
| Acceptance Criteria | AC | AC-001 |
| Test Specification | TS | TS-001 |
| Test Case | TC | TC-001 |

---

## Coverage Status

| Requirement | User Stories | Acceptance Criteria | Coverage |
|-------------|--------------|---------------------|----------|
| REQ-001 | US-001, US-002, US-003 | AC-001 to AC-007 | ✅ Stories defined |
| REQ-002 | US-004, US-005, US-006 | AC-008 to AC-014 | ✅ Stories defined |
| REQ-003 | Pending | Pending | ⏳ Needs stories |
| REQ-004 | Pending | Pending | ⏳ Needs stories |
| REQ-005 | Pending | Pending | ⏳ Needs stories |
| REQ-006 | Pending | Pending | ⏳ Needs stories |
| REQ-007 | Pending | Pending | ⏳ Needs stories |
| REQ-008 | Pending | Pending | ⏳ Needs stories |

---

## Workflow

1. **Specify**: Create/update PRD with requirements
2. **Build**: Create user stories with acceptance criteria
3. **Review**: Team reviews stories for completeness
4. **Verify**: Create test specifications from acceptance criteria
5. **Sign-off**: Mark requirements as verified when tests pass

---

## Common RCF Commands

| Command | Purpose |
|---------|---------|
| `rcf_connect` | Connect to a repository |
| `rcf_status` | Check connection and stats |
| `rcf_query` | Query traceability data |
| `rcf_explain` | Get methodology guidance |
| `rcf_validate` | Validate document structure |

---

## Next Steps

1. ⏳ Add user stories for REQ-003 through REQ-008
2. ⏳ Create test specifications (TS) for acceptance criteria
3. ⏳ Create test cases (TC) linked to test specifications
4. ⏳ Achieve 100% requirement coverage
