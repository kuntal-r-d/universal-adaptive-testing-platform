# RCF (Requirements Confidence Framework) Guide

This project uses RCF to maintain traceability between business requirements and test verification for the **Universal Adaptive Testing Platform**.

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [RCF MCP Tools for Setup & Documentation](#rcf-mcp-tools-for-setup--documentation)
3. [Setup Steps Completed](#setup-steps-completed)
4. [Project Structure](#project-structure)
5. [Traceability Hierarchy](#traceability-hierarchy)
6. [RCF Communication Guide - Prompts for Each Stage](#rcf-communication-guide---prompts-for-each-stage)
7. [The 5-Step Build Cycle](#the-5-step-build-cycle)
8. [RCF Tools Reference](#rcf-tools-reference)
9. [RCF Resources Reference](#rcf-resources-reference)
10. [RCF Prompts Reference](#rcf-prompts-reference)
11. [ID Conventions](#id-conventions)
12. [Coverage Status](#coverage-status)
13. [Workflow](#workflow)
14. [Session Management](#session-management)
15. [Next Steps](#next-steps)

---

## The Big Picture

RCF (Requirements Confidence Framework) creates an **unbreakable chain of traceability** from your business idea down to verified test cases:

```
PRD → REQ → US → AC → TS → TC
```

| Level | What It Is | This Project Example |
|-------|-----------|----------------------|
| **PRD** | Product Requirements Document | PRD-001 (Universal Adaptive Testing Platform) |
| **REQ** | Individual Requirement | REQ-001 (Polymorphic Exam Engine) |
| **US** | User Story | US-001 (Configure Exam Profile) |
| **AC** | Acceptance Criteria | AC-001 (Algorithm Selection) |
| **TS** | Test Suite (one file per AC) | `AC-001.spec.ts` |
| **TC** | Test Case | TC-001 (Select Item_Adaptive algorithm) |

### RCF Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRD-001: Universal Adaptive Testing Platform          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
   ┌─────────┐                ┌─────────┐                 ┌─────────┐
   │ REQ-001 │                │ REQ-002 │                 │ REQ-003 │ ...
   │ Exam    │                │ Question│                 │ AI      │
   │ Engine  │                │ Bank    │                 │Authoring│
   └────┬────┘                └────┬────┘                 └─────────┘
        │                          │
   ┌────┴────┐                ┌────┴────┐
   ▼         ▼                ▼         ▼
┌──────┐  ┌──────┐         ┌──────┐  ┌──────┐
│US-001│  │US-002│         │US-004│  │US-005│
└──┬───┘  └──────┘         └──┬───┘  └──────┘
   │                          │
┌──┴──────────────┐      ┌────┴────────────┐
▼        ▼        ▼      ▼        ▼        ▼
AC-001  AC-002  AC-003  AC-008  AC-009  AC-010
   │
┌──┴──────────────┐
▼        ▼        ▼
TC-001  TC-002  TC-003
```

---

## RCF MCP Tools for Setup & Documentation

This section maps which RCF MCP tools, resources, and prompts to use for each phase of project setup and documentation generation.

### 🚀 Initial Setup Phase

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Learn RCF basics** | 📚 `rcf://docs/overview` (Resource) | Understand core RCF concepts and hierarchy |
| **Get setup guidance** | 💬 `rcf_getting_started` (Prompt) | Interactive guide for connecting to RCF repositories |
| **Initialize new repo** | 🔧 `rcf_repo_initialise` (Tool) | Creates manifest, directories, and opens a PR |
| **Understand structure** | 📚 `rcf://docs/document-structure` (Resource) | Learn document types and relationships |
| **Learn numbering** | 🔧 `rcf_explain({ topic: "numbering" })` (Tool) | Understand ID conventions (REQ, US, AC, etc.) |

### 📄 PRD (Product Requirements Document) Generation

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Get PRD schema** | 🔧 `rcf_schema({ documentType: "PRD" })` (Tool) | Retrieve JSON schema for PRD structure |
| **Access PRD schema** | 📚 `rcf://schemas/prd` (Resource) | Alternative: PRD JSON schema via resource |
| **Learn PRD best practices** | 🔧 `rcf_explain({ topic: "prd" })` (Tool) | PRD creation guidance |
| **Generate new PRD** | 🔧 `rcf_prd_generate_start` (Tool) | Background task to generate PRD from themes |
| **Check generation status** | 🔧 `rcf_prd_generate_status` (Tool) | Monitor PRD generation progress |
| **Get generation result** | 🔧 `rcf_prd_generate_result` (Tool) | Retrieve completed PRD |
| **Import existing PRD** | 🔧 `rcf_import_prd` (Tool) | Import pre-built PRD JSON as draft |
| **Validate PRD** | 🔧 `rcf_validate({ documentType: "PRD" })` (Tool) | Validate PRD JSON before import |
| **Edit PRD** | 🔧 `rcf_prd_edit_start` (Tool) | Make amendments to PRD |
| **View PRD** | 🔧 `rcf_prd_view` (Tool) | View PRD as markdown |
| **Save PRD to Git** | 🔧 `rcf_prd_save` (Tool) | Commit PRD and create PR |

### 📝 User Stories Generation

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Get User Stories schema** | 🔧 `rcf_schema({ documentType: "UserStories" })` (Tool) | Retrieve JSON schema for User Stories |
| **Access schema** | 📚 `rcf://schemas/user-stories` (Resource) | Alternative: User Stories schema via resource |
| **Learn story format** | 🔧 `rcf_explain({ topic: "user-stories" })` (Tool) | User story format and ACs guidance |
| **Generate stories** | 🔧 `rcf_stories_generate_start` (Tool) | Background task to generate from PRD |
| **Check generation status** | 🔧 `rcf_stories_status` (Tool) | Monitor story generation progress |
| **Get generation result** | 🔧 `rcf_stories_result` (Tool) | Retrieve completed stories |
| **Edit stories** | 🔧 `rcf_stories_edit_start` (Tool) | Make amendments to stories |
| **View stories** | 🔧 `rcf_stories_view` (Tool) | View stories as markdown |
| **Save stories to Git** | 🔧 `rcf_stories_save` (Tool) | Commit stories and create PR |

### 🏗️ TAD (Technical Architecture Document) Generation

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Learn TAD structure** | 🔧 `rcf_explain({ topic: "tad" })` (Tool) | Technical architecture docs guidance |
| **Generate TAD** | 🔧 `rcf_tad_generate_start` (Tool) | Background task using two-stage pipeline |
| **Check generation status** | 🔧 `rcf_tad_status` (Tool) | Monitor TAD generation progress |
| **Get generation result** | 🔧 `rcf_tad_result` (Tool) | Retrieve completed TAD |
| **Edit TAD** | 🔧 `rcf_tad_edit_start` (Tool) | Make amendments to TAD sections |
| **View TAD** | 🔧 `rcf_tad_view` (Tool) | View TAD as markdown |
| **Save TAD to Git** | 🔧 `rcf_tad_save` (Tool) | Commit TAD and create PR |

### 🔗 Connection & Traceability

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Connect to repo** | 🔧 `rcf_connect` (Tool) | Connect to GitHub repository |
| **Check status** | 🔧 `rcf_status` (Tool) | Get connection status and stats |
| **Sync with remote** | 🔧 `rcf_sync` (Tool) | Refresh from GitHub |
| **Switch PRD** | 🔧 `rcf_switch_prd` (Tool) | Switch to different PRD |
| **Switch branch** | 🔧 `rcf_switch_branch` (Tool) | Switch to different branch |
| **Disconnect** | 🔧 `rcf_disconnect` (Tool) | Clear session state |

### 📊 Coverage & Traceability Queries

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Learn traceability** | 🔧 `rcf_explain({ topic: "traceability" })` (Tool) | Understand REQ→US→AC→TS→TC chain |
| **Project coverage** | 🔧 `rcf_coverage` (Tool) | Project-level coverage analysis |
| **Query traceability** | 🔧 `rcf_query` (Tool) | Trace forward/backward, coverage |
| **Understand process** | 📚 `rcf://docs/build-process` (Resource) | 5-step build cycle documentation |

### 🎓 Learning & Onboarding

| Task | RCF MCP Tool/Resource/Prompt | Description |
|------|------------------------------|-------------|
| **Interactive learning** | 💬 `rcf_tutor` (Prompt) | Q&A session to learn RCF methodology |
| **Quick start guide** | 📚 `rcf://docs/quickstart` (Resource) | Step-by-step implementation guide |
| **Topic explanation** | 🔧 `rcf_explain({ topic: "..." })` (Tool) | Get guidance on specific topics |

### 🔄 Complete Workflow with RCF MCP

Here's the recommended sequence for setting up a new project:

```
1. LEARN
   └── rcf_getting_started (prompt) → rcf://docs/overview (resource)

2. INITIALIZE  
   └── rcf_repo_initialise (tool) → creates manifest & structure

3. CONNECT
   └── rcf_connect (tool) → establishes session

4. GENERATE PRD
   └── rcf_schema (tool) → rcf_prd_generate_start (tool) → rcf_prd_save (tool)

5. GENERATE USER STORIES
   └── rcf_stories_generate_start (tool) → rcf_stories_save (tool)

6. GENERATE TAD (optional)
   └── rcf_tad_generate_start (tool) → rcf_tad_save (tool)

7. VERIFY
   └── rcf_coverage (tool) → rcf_query (tool)

8. ITERATE
   └── rcf_prd_edit_start / rcf_stories_edit_start / rcf_tad_edit_start (tools)
```

---

## Setup Steps Completed

The following steps were completed to configure RCF for this project. Each step shows the **RCF MCP tools/resources that can be used** (marked with 🔧/📚/💬) alongside the manual approach taken.

### Step 1: Initialize RCF Structure ✅

**RCF MCP Alternative:**
| Tool/Resource | Command |
|---------------|---------|
| 💬 Prompt | `rcf_getting_started` - Interactive setup guidance |
| 🔧 Tool | `rcf_repo_initialise({ repo: "kuntal-r-d/universal-adaptive-testing-platform" })` |
| 📚 Resource | `rcf://docs/quickstart` - Step-by-step guide |

**Manual Approach Used:**
```bash
# Created directories
mkdir -p .rcf docs/prd docs/user-stories docs/test-specs
```

**Files Created:**
| File | Purpose |
|------|---------|
| `rcf-manifest.json` | Project configuration - defines paths, ID prefixes, and metadata |
| `.rcf/config.json` | Validation rules - traceability requirements and coverage thresholds |

---

### Step 2: Convert Product Requirements to RCF PRD Format ✅

**RCF MCP Alternative:**
| Tool/Resource | Command |
|---------------|---------|
| 🔧 Tool | `rcf_schema({ documentType: "PRD" })` - Get PRD JSON schema |
| 📚 Resource | `rcf://schemas/prd` - PRD schema reference |
| 🔧 Tool | `rcf_prd_generate_start({ productName: "...", ... })` - Auto-generate PRD |
| 🔧 Tool | `rcf_import_prd({ prd: {...} })` - Import existing PRD JSON |
| 🔧 Tool | `rcf_validate({ documentType: "PRD", document: {...} })` - Validate structure |
| 🔧 Tool | `rcf_explain({ topic: "prd" })` - PRD best practices |

**Manual Approach Used:**
Transformed the original `product requirements.md` into structured RCF format:

- Assigned unique IDs to each requirement (REQ-001 to REQ-008)
- Created sub-requirement IDs (REQ-001.1, REQ-001.2, etc.)
- Added metadata (priority, category, status)
- Created both Markdown (.md) and JSON (.json) versions

**Files Created:**
- `docs/prd/PRD-001-universal-adaptive-testing.md`
- `docs/prd/PRD-001-universal-adaptive-testing.json`

---

### Step 3: Create User Stories from Requirements ✅

**RCF MCP Alternative:**
| Tool/Resource | Command |
|---------------|---------|
| 🔧 Tool | `rcf_schema({ documentType: "UserStories" })` - Get User Stories schema |
| 📚 Resource | `rcf://schemas/user-stories` - User Stories schema reference |
| 🔧 Tool | `rcf_stories_generate_start()` - Auto-generate from PRD |
| 🔧 Tool | `rcf_stories_status({ taskId })` - Check generation progress |
| 🔧 Tool | `rcf_stories_result({ taskId })` - Get generated stories |
| 🔧 Tool | `rcf_explain({ topic: "user-stories" })` - Story format guidance |

**Manual Approach Used:**
Created User Stories with Acceptance Criteria following the Given/When/Then format:

- Linked each User Story to its parent Requirement
- Defined testable Acceptance Criteria with unique IDs
- Created traceability matrices

**Files Created:**
- `docs/user-stories/US-exam-engine.md` (US-001 to US-003, AC-001 to AC-007)
- `docs/user-stories/US-exam-engine.json`
- `docs/user-stories/US-question-bank.md` (US-004 to US-006, AC-008 to AC-014)

---

### Step 4: Connect RCF Tools to Repository ✅

**RCF MCP Tools Used:**
| Tool | Command |
|------|---------|
| 🔧 Tool | `rcf_connect({ repo: "kuntal-r-d/universal-adaptive-testing-platform" })` |
| 🔧 Tool | `rcf_status()` - Verify connection |
| 🔧 Tool | `rcf_sync()` - Sync with remote |

**Actions Completed:**
- Committed all RCF files to Git
- Pushed to GitHub (`kuntal-r-d/universal-adaptive-testing-platform`)
- Consolidated to single `main` branch

---

### Step 5: Documentation ✅

**RCF MCP Resources Used:**
| Resource | Purpose |
|----------|---------|
| 📚 Resource | `rcf://docs/overview` - Core concepts reference |
| 📚 Resource | `rcf://docs/document-structure` - Document relationships |
| 📚 Resource | `rcf://docs/build-process` - Workflow documentation |
| 🔧 Tool | `rcf_explain({ topic: "traceability" })` - Traceability guidance |
| 🔧 Tool | `rcf_explain({ topic: "numbering" })` - ID conventions |

**Files Created:**
- `docs/RCF-README.md` - This comprehensive guide
- Traceability hierarchy documentation
- Tool/Resource/Prompt reference

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

## RCF Communication Guide - Prompts for Each Stage

This section provides **exact prompts** to use when working with RCF tools at each stage of the project, along with the **MCP server tools** that accomplish each step.

---

### 🎯 Stage 1: Starting with Your Idea

#### MCP Server Tools for This Stage:

| Step | MCP Tool/Resource | What It Does |
|------|-------------------|--------------|
| Learn RCF basics | 💬 `rcf_getting_started` (Prompt) | Interactive setup guidance |
| Understand concepts | 📚 `rcf://docs/overview` (Resource) | Core RCF methodology docs |
| Initialize repo | 🔧 `rcf_repo_initialise` (Tool) | Creates manifest & directory structure |
| Get topic help | 🔧 `rcf_explain({ topic: "overview" })` | Explains RCF concepts |

#### MCP Workflow:

```javascript
// Step 1a: Use the getting started prompt for guidance
// → Use prompt: rcf_getting_started

// Step 1b: Read the overview documentation
// → Access resource: rcf://docs/overview

// Step 1c: Initialize RCF in your repository
rcf_repo_initialise({ 
  repo: "kuntal-r-d/universal-adaptive-testing-platform",
  projectName: "Universal Adaptive Testing Platform",
  description: "Configurable adaptive testing engine with AI authoring"
})
// Creates: rcf-manifest.json, .rcf/, docs/prd/, docs/user-stories/
```

#### Prompt Template: Initial Idea Discussion

```
I have an idea for a project and want to use RCF methodology.

**The Idea:** [Describe your idea in 2-5 sentences]

**Problem it solves:** [What pain point does this address?]

**Target users:** [Who will use this?]

**Key capabilities I envision:**
- [Capability 1]
- [Capability 2]
- [Capability 3]

Help me structure this into an RCF-compliant PRD with clear requirements.
```

#### Example for This Project:

```
I have an idea for a project and want to use RCF methodology.

**The Idea:** A Universal Adaptive Testing Platform that supports multiple 
exam methodologies (CAT, LOFT, Linear) with AI-augmented content authoring 
and smart analytics for learner progress.

**Problem it solves:** Educational institutions need configurable, extensible 
testing systems that can adapt to different exam types without custom development.

**Target users:** 
- Test-Takers (students, certification candidates)
- Content Authors (subject matter experts)
- Administrators (exam managers)
- Psychometricians (test analysts)

**Key capabilities I envision:**
- Pluggable exam engine supporting multiple algorithms
- Universal question bank with JSONB flexibility
- AI-powered question generation with human review
- Smart coach analytics with gap analysis

Help me structure this into an RCF-compliant PRD with clear requirements.
```

---

### 🎯 Stage 2: Creating the PRD

#### MCP Server Tools for This Stage:

| Step | MCP Tool/Resource | What It Does |
|------|-------------------|--------------|
| Get PRD schema | 🔧 `rcf_schema({ documentType: "PRD" })` | Returns JSON schema for PRD structure |
| Access schema | 📚 `rcf://schemas/prd` (Resource) | PRD schema via resource |
| Learn PRD format | 🔧 `rcf_explain({ topic: "prd" })` | PRD best practices guidance |
| Generate PRD | 🔧 `rcf_prd_generate_start` (Tool) | Auto-generates PRD from themes |
| Check status | 🔧 `rcf_prd_generate_status` (Tool) | Monitor generation progress |
| Get result | 🔧 `rcf_prd_generate_result` (Tool) | Retrieve completed PRD |
| Import existing | 🔧 `rcf_import_prd` (Tool) | Import pre-built PRD JSON |
| Validate PRD | 🔧 `rcf_validate` (Tool) | Validate structure before import |

#### MCP Workflow:

```javascript
// Step 2a: Get the PRD schema to understand structure
rcf_schema({ documentType: "PRD", format: "full" })
// Returns: JSON schema with all required fields

// Step 2b: Generate PRD automatically (recommended for new projects)
const taskId = rcf_prd_generate_start({
  productName: "Universal Adaptive Testing Platform",
  problemStatement: "Educational institutions need configurable testing systems",
  targetUsers: ["Test-Takers", "Content Authors", "Administrators", "Psychometricians"],
  requirementThemes: [
    { name: "Exam Engine", description: "Adaptive and linear exam support" },
    { name: "Question Bank", description: "Dynamic question storage with JSONB" },
    { name: "AI Authoring", description: "LLM-powered question generation" },
    { name: "Analytics", description: "Smart coach and gap analysis" }
  ],
  depth: "comprehensive"  // Options: minimal, standard, comprehensive
})

// Step 2c: Monitor generation progress
rcf_prd_generate_status({ taskId: taskId })
// Returns: { stage: "generating", progress: 60, estimatedTimeRemaining: "2m" }

// Step 2d: Get the generated PRD
rcf_prd_generate_result({ taskId: taskId, returnMarkdown: true })
// Returns: Complete PRD with REQ-001 to REQ-XXX

// Step 2e: View the PRD
rcf_prd_view()
// Returns: Rendered markdown of active PRD
```

#### Alternative: Import Existing PRD

```javascript
// If you created PRD manually, validate and import it
rcf_validate({
  documentType: "PRD",
  document: { /* your PRD JSON */ },
  deepValidation: true
})
// Returns: { valid: true/false, errors: [], warnings: [] }

// Then import
rcf_import_prd({
  prd: { /* your PRD JSON */ },
  returnMarkdown: true
})
```

#### Prompt Template: Generate Requirements

```
Based on my idea, help me create the PRD sections:

1. **Executive Summary** - 2-3 paragraphs explaining the product
2. **In Scope** - List of REQ-XXX requirements (aim for 20-35)
3. **Out of Scope** - What we're NOT building in v1

For requirements, organize them by domain:
- Core Functionality
- Data Management  
- User Interface
- Security & Access
- Performance & Reliability

Each requirement should be:
- Specific and testable
- Focused on WHAT not HOW
- One capability per requirement
```

#### Prompt Template: Refine Requirements

```
Review these requirements and help me:

1. Are any too vague to be testable?
2. Are any combining multiple capabilities (should be split)?
3. Am I missing any obvious requirements for this type of product?
4. Should any be moved to "Out of Scope" for v1?

[Paste your current requirements list]
```

#### MCP Tool for Editing PRD:

```javascript
// Edit PRD with natural language amendments
rcf_prd_edit_start({
  amendments: "Add REQ-009 for multi-language support. Change REQ-003 priority to critical.",
  returnMarkdown: true
})

// Check edit status
rcf_prd_edit_status({ taskId: "..." })

// Get edit result
rcf_prd_edit_result({ taskId: "...", returnMarkdown: true })

// Save PRD to Git
rcf_prd_save({
  createPr: true,
  prTitle: "feat(prd): Add multi-language support requirement"
})
```

#### Example for This Project:

```
Review these requirements for the Universal Adaptive Testing Platform:

REQ-001: Polymorphic Exam Engine - Support Item_Adaptive, Section_Adaptive, 
         Linear_Fixed, and LOFT algorithms
REQ-002: Universal Question Bank - Schema-agnostic CMS with JSONB storage
REQ-003: AI-Augmented Authoring - LLM-powered question generation with HITL

Questions:
1. Is REQ-001 too broad? Should algorithms be separate requirements?
2. Is REQ-002 specific enough for testing?
3. What security requirements am I missing?
```

---

### 🎯 Stage 3: Creating User Stories

#### MCP Server Tools for This Stage:

| Step | MCP Tool/Resource | What It Does |
|------|-------------------|--------------|
| Get schema | 🔧 `rcf_schema({ documentType: "UserStories" })` | Returns User Stories JSON schema |
| Access schema | 📚 `rcf://schemas/user-stories` (Resource) | Schema via resource |
| Learn format | 🔧 `rcf_explain({ topic: "user-stories" })` | Story format guidance |
| Generate stories | 🔧 `rcf_stories_generate_start` (Tool) | Auto-generate from PRD |
| Check status | 🔧 `rcf_stories_status` (Tool) | Monitor generation progress |
| Get result | 🔧 `rcf_stories_result` (Tool) | Retrieve completed stories |
| Edit stories | 🔧 `rcf_stories_edit_start` (Tool) | Amend existing stories |
| View stories | 🔧 `rcf_stories_view` (Tool) | View as markdown |
| Save stories | 🔧 `rcf_stories_save` (Tool) | Commit to Git |

#### MCP Workflow:

```javascript
// Step 3a: Ensure you're connected to the project
rcf_connect({ repo: "kuntal-r-d/universal-adaptive-testing-platform" })

// Step 3b: Generate user stories from the PRD
const taskId = rcf_stories_generate_start({
  prdId: "PRD-001",  // Optional, defaults to active PRD
  options: {
    maxStoriesPerReq: 3,   // Max 3 stories per requirement
    maxAcPerStory: 5       // Max 5 acceptance criteria per story
  }
})

// Step 3c: Monitor generation progress
rcf_stories_status({ taskId: taskId })
// Returns: { 
//   status: "in_progress", 
//   currentRequirement: "REQ-003",
//   progress: 40,
//   estimatedTimeRemaining: "3m" 
// }

// Step 3d: Get the generated stories
rcf_stories_result({ taskId: taskId, returnMarkdown: true })
// Returns: Complete user stories with US-001 to US-XXX, AC-001 to AC-XXX

// Step 3e: View the stories
rcf_stories_view()
// Returns: Rendered markdown of all user stories
```

#### MCP Tool for Editing Stories:

```javascript
// Edit stories with natural language
rcf_stories_edit_start({
  amendments: `
    Add US-007 for REQ-003: As a Content Author, I want to generate 
    questions using AI, so that I can create content faster.
    
    Add AC-015: Given I provide a topic and difficulty level,
    When I request AI generation,
    Then the system generates 5 draft questions.
    
    Add AC-016: Given questions are in draft state,
    When I review and approve them,
    Then they move to active status.
  `,
  returnMarkdown: true
})

// Check edit status
rcf_stories_edit_status({ taskId: "..." })

// Get edit result
rcf_stories_edit_result({ taskId: "...", returnMarkdown: true })

// Save to Git
rcf_stories_save({
  createPr: true,
  prTitle: "feat(stories): Add user stories for AI Authoring (REQ-003)"
})
```

#### Prompt Template: Generate User Stories from Requirements

```
Now let's decompose these requirements into User Stories.

For each requirement, create 2-5 user stories using this format:

**US-XXX:** As a [user type], I want to [action] so that [benefit]

Then for each user story, define 2-4 acceptance criteria:

**AC-XXX:** [Specific, testable condition that must be true]

Start with: REQ-001 [paste requirement description]
```

#### Example for This Project:

```
Decompose REQ-001 (Polymorphic Exam Engine) into user stories:

REQ-001: The system must support a "Pluggable Strategy" architecture 
to handle different exam methodologies dynamically.

Create user stories for:
- Administrator configuring exam profiles
- Test-taker experiencing adaptive exams
- Test-taker resuming interrupted sessions
- System handling navigation constraints

Follow numbering: US-001, US-002, US-003...
AC numbering: AC-001, AC-002, AC-003...
```

#### Prompt Template: Review User Story Coverage

```
Review my user stories for REQ-XXX:

[Paste user stories and ACs]

Questions:
1. Do these stories fully cover the requirement?
2. Are any acceptance criteria missing edge cases?
3. Are the ACs specific enough to write tests for?
4. Should any stories be split or combined?
```

---

### 🎯 Stage 4: Validating Coverage

#### MCP Server Tools for This Stage:

| Step | MCP Tool/Resource | What It Does |
|------|-------------------|--------------|
| Project coverage | 🔧 `rcf_coverage` (Tool) | Project-level coverage analysis |
| Query traceability | 🔧 `rcf_query` (Tool) | Trace forward/backward, coverage |
| Check status | 🔧 `rcf_status` (Tool) | Connection status and stats |
| Learn traceability | 🔧 `rcf_explain({ topic: "traceability" })` | Traceability guidance |
| Understand process | 📚 `rcf://docs/build-process` (Resource) | 5-step build cycle docs |

#### MCP Workflow:

```javascript
// Step 4a: Check project-wide coverage
rcf_coverage()
// Returns: {
//   summary: { total: 8, covered: 2, uncovered: 6, coveragePercent: 25 },
//   requirements: [
//     { id: "REQ-001", status: "covered", stories: ["US-001", "US-002", "US-003"] },
//     { id: "REQ-002", status: "covered", stories: ["US-004", "US-005", "US-006"] },
//     { id: "REQ-003", status: "uncovered", stories: [] },
//     ...
//   ]
// }

// Step 4b: Filter to see only uncovered requirements
rcf_coverage({ filter: "uncovered" })
// Returns: REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008

// Step 4c: Query specific requirement coverage
rcf_query({ type: "coverage", target: "REQ-001" })
// Returns: Detailed coverage for REQ-001 with all linked US and AC

// Step 4d: Trace forward from requirement to see all linked items
rcf_query({ type: "trace-forward", target: "REQ-001" })
// Returns: REQ-001 → US-001, US-002, US-003 → AC-001 to AC-007

// Step 4e: Trace backward from acceptance criteria to requirement
rcf_query({ type: "trace-back", target: "AC-005" })
// Returns: AC-005 → US-002 → REQ-001.2 → REQ-001

// Step 4f: Get single requirement details
rcf_query({ type: "requirement", target: "REQ-002" })

// Step 4g: Get single story details
rcf_query({ type: "story", target: "US-003" })
```

#### Coverage Gate Check:

```javascript
// Before proceeding to architecture, verify 100% coverage
const coverage = rcf_coverage()

if (coverage.summary.coveragePercent < 100) {
  console.log("⚠️ Cannot proceed! Uncovered requirements:")
  coverage.requirements
    .filter(r => r.status === "uncovered")
    .forEach(r => console.log(`  - ${r.id}`))
} else {
  console.log("✅ 100% coverage - ready for architecture!")
}
```

#### Prompt Template: Check Coverage

```
Let's validate RCF coverage before proceeding to architecture.

Here are my requirements and their user stories:

REQ-001: [Title]
  - US-001: [Story] → AC-001, AC-002
  - US-002: [Story] → AC-003, AC-004

REQ-002: [Title]
  - US-003: [Story] → AC-005, AC-006

[Continue for all REQs]

Please verify:
1. Every REQ has at least one US
2. Every US has at least 2 ACs
3. No gaps in the traceability chain
```

#### Using RCF Tools:

```javascript
// Connect to the project
rcf_connect({ repo: "kuntal-r-d/universal-adaptive-testing-platform" })

// Check coverage
rcf_coverage({})

// Expected output should show:
// - coveragePercent: 100
// - uncoveredReqs: []

// If gaps exist, query specific requirements:
rcf_query({ type: "coverage", target: "REQ-003" })
```

⚠️ **Do not proceed to architecture until coverage is validated!**

---

### 🎯 Stage 5: Technical Architecture (TAD)

#### MCP Server Tools for This Stage:

| Step | MCP Tool/Resource | What It Does |
|------|-------------------|--------------|
| Learn TAD format | 🔧 `rcf_explain({ topic: "tad" })` | TAD structure guidance |
| Generate TAD | 🔧 `rcf_tad_generate_start` (Tool) | Auto-generate from PRD + Stories |
| Check status | 🔧 `rcf_tad_status` (Tool) | Monitor generation progress |
| Get result | 🔧 `rcf_tad_result` (Tool) | Retrieve completed TAD |
| View TAD | 🔧 `rcf_tad_view` (Tool) | View as markdown |
| Edit TAD | 🔧 `rcf_tad_edit_start` (Tool) | Amend specific sections |
| Save TAD | 🔧 `rcf_tad_save` (Tool) | Commit to Git |

#### MCP Workflow:

```javascript
// Step 5a: Ensure coverage is 100% before generating TAD
rcf_coverage()
// ⚠️ TAD generation requires complete user stories coverage

// Step 5b: Generate TAD using two-stage pipeline
// Stage 1: Extracts architectural concerns from PRD and Stories
// Stage 2: Generates TAD sections with accumulated decision context
const taskId = rcf_tad_generate_start({
  prdId: "PRD-001",  // Optional, defaults to active PRD
  techStack: ["Python", "Node.js", "PostgreSQL", "React", "Redis"],
  patterns: ["microservices", "strategy-pattern", "CQRS", "event-driven"],
  constraints: [
    "< 200ms P95 latency for next-item selection",
    "Horizontal scaling via Docker/Kubernetes",
    "ACID compliance for exam results",
    "Must support 10,000 concurrent test-takers"
  ],
  comprehensiveness: "comprehensive"  // Options: simple (3 calls), standard (6 calls), comprehensive (11 calls)
})

// Step 5c: Monitor generation progress
rcf_tad_status({ taskId: taskId })
// Returns: {
//   status: "in_progress",
//   stage: "generation",  // "extraction" or "generation"
//   currentSection: "dataArchitecture",
//   progress: 60,
//   estimatedTimeRemaining: "4m"
// }

// Step 5d: Get the generated TAD
rcf_tad_result({ taskId: taskId, returnMarkdown: true })
// Returns: Complete TAD with all architectural sections

// Step 5e: View the TAD
rcf_tad_view()
// Returns: Rendered markdown of TAD

// Step 5f: View with extracted concerns (useful for understanding decisions)
rcf_tad_view({ includeExtractedConcerns: true })
```

#### MCP Tool for Editing TAD:

```javascript
// Edit specific sections of the TAD
rcf_tad_edit_start({
  amendments: "Add OAuth2/OIDC integration for SSO support. Update database to CockroachDB for better horizontal scaling.",
  sections: ["securityArchitecture", "dataArchitecture"],  // Optional: target specific sections
  returnMarkdown: true
})

// Available sections:
// - systemOverview
// - principles
// - components
// - dataArchitecture
// - integrationArchitecture
// - securityArchitecture
// - deploymentArchitecture
// - operationalConcerns
// - architecturalDecisions

// Check edit status
rcf_tad_edit_status({ taskId: "..." })

// Get edit result
rcf_tad_edit_result({ taskId: "...", returnMarkdown: true })

// Save to Git
rcf_tad_save({
  createPr: true,
  prTitle: "feat(tad): Add OAuth2/SSO and CockroachDB architecture"
})
```

#### Prompt Template: Create TAD

```
Now let's create the Technical Architecture Document (TAD).

Based on:
- PRD: PRD-001 Universal Adaptive Testing Platform
- User Stories: US-001 to US-006 (currently defined)

Define:
1. **System Architecture** - High-level component diagram
2. **Technology Stack** - Languages, frameworks, databases
3. **Component Breakdown** - What each major component does
4. **Data Model** - Key entities and relationships
5. **API Design** - Main endpoints and contracts
6. **Integration Points** - External services/dependencies
7. **Security Approach** - Auth, encryption, access control
```

#### Prompt Template: Review Architecture

```
Review this architecture against my requirements:

[Paste TAD sections]

Questions:
1. Does this architecture support all functional requirements?
2. Are non-functional requirements (performance, scaling) addressed?
3. What are the main technical risks?
4. Are there simpler alternatives for any component?
```

---

### 🎯 Stage 6: Build Planning

#### MCP Server Tools for This Stage:

| Step | MCP Tool/Resource | What It Does |
|------|-------------------|--------------|
| Query coverage | 🔧 `rcf_coverage` (Tool) | See which requirements have stories |
| Query by FBS | 🔧 `rcf_query({ type: "stories-for-fbs" })` | Get stories for a feature |
| Check affected | 🔧 `rcf_query({ type: "affected-by" })` | See REQs affected by FBS |
| Trace forward | 🔧 `rcf_query({ type: "trace-forward" })` | REQ → US → AC chain |
| Understand process | 📚 `rcf://docs/build-process` (Resource) | 5-step build cycle |

#### MCP Workflow:

```javascript
// Step 6a: Get current coverage to understand what's ready to build
rcf_coverage()
// Shows which requirements have complete user stories

// Step 6b: For each FBS, query related stories
rcf_query({ type: "stories-for-fbs", target: "FBS-001" })
// Returns: All user stories linked to FBS-001

// Step 6c: Trace dependencies for a requirement
rcf_query({ type: "trace-forward", target: "REQ-001" })
// Returns: REQ-001 → US-001, US-002, US-003 → AC-001 to AC-007

// Step 6d: See what's affected by a feature
rcf_query({ type: "affected-by", target: "FBS-002" })
// Returns: Requirements that depend on FBS-002
```

#### Prompt Template: Create Build Index

```
Help me create the Build Index to sequence my features.

Based on:
- Requirements: REQ-001 to REQ-008
- User Stories: US-001 to US-006 (defined), US-007 to US-016 (pending)
- Technical dependencies from TAD

Create FBS (Feature Build Specification) entries:

| FBS     | Feature           | REQs    | USs            | Dependencies |
|---------|-------------------|---------|----------------|--------------|

Order by:
1. Technical dependencies (what must exist first)
2. User value (deliver value early)
3. Risk (tackle risky parts early)
```

#### Example Build Index for This Project:

```markdown
# Build Index

## Project: Universal Adaptive Testing Platform
## PRD: PRD-001

| FBS     | Feature                 | Status      | REQs          | USs            | Dependencies |
|---------|-------------------------|-------------|---------------|----------------|--------------|
| FBS-001 | Core Exam Engine        | Not Started | REQ-001       | US-001-003     | -            |
| FBS-002 | Question Bank CMS       | Not Started | REQ-002       | US-004-006     | FBS-001      |
| FBS-003 | AI Authoring            | Not Started | REQ-003       | US-007-008     | FBS-002      |
| FBS-004 | Smart Coach Analytics   | Not Started | REQ-004       | US-009-011     | FBS-001      |
| FBS-005 | Security & Integrity    | Not Started | REQ-007       | US-014-015     | FBS-001      |
| FBS-006 | Data Integrity & Audit  | Not Started | REQ-008       | US-016         | FBS-001      |
```

---

## The 5-Step Build Cycle

For each Feature Build Specification (FBS), follow this cycle:

```
┌──────────────────────────────────────────────────────────────┐
│  1. SPECIFY - Write test specifications from ACs            │
│     - Create AC-XXX.spec.ts files with test scenarios       │
│     - Define what "working" looks like                      │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  2. BUILD - Implement code to satisfy acceptance criteria   │
│     - Write the actual functionality                        │
│     - Include unit tests (80% coverage target)              │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  3. REVIEW - Compare implementation against specs           │
│     - Point-by-point review against each AC                 │
│     - Identify gaps, edge cases, missing error handling     │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  4. VERIFY - Run tests against running service              │
│     - Execute integration/E2E tests                         │
│     - All tests must pass                                   │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  5. SIGN-OFF - Confirm RCF traceability, move to next FBS   │
│     - CI pipeline passes                                    │
│     - Update BUILD INDEX status                             │
└──────────────────────────────────────────────────────────────┘
```

### Step 1: SPECIFY - Prompts

```
We're starting FBS-001: Core Exam Engine

**Step 1: SPECIFY**

For these acceptance criteria:
- AC-001: Algorithm Selection (select from Item_Adaptive, Section_Adaptive, etc.)
- AC-002: Scoring Model Configuration (Rasch, 1PL, 2PL, 3PL, Classical)
- AC-003: Stopping Rules Definition (SEM, min/max questions, duration)

Help me write the test specifications. For each AC, define:
- Test file location: tests/integration/backend/US-001/AC-001.spec.ts
- Test scenarios (TC-001, TC-002, etc.)
- What each test should verify
```

#### Test File Organization for This Project:

```
tests/integration/backend/
└── US-001/                           # Configure Exam Profile
    ├── AC-001.spec.ts                # Algorithm Selection
    │   ├── TC-001: Select Item_Adaptive algorithm
    │   ├── TC-002: Select Section_Adaptive algorithm
    │   ├── TC-003: Select Linear_Fixed algorithm
    │   └── TC-004: Select LOFT algorithm
    ├── AC-002.spec.ts                # Scoring Model Configuration
    │   ├── TC-001: Configure Rasch model
    │   ├── TC-002: Configure 3PL model with parameters
    │   └── TC-003: Validate parameter ranges
    └── AC-003.spec.ts                # Stopping Rules Definition
        ├── TC-001: Set SEM threshold
        ├── TC-002: Set min/max question counts
        └── TC-003: Validate min < max constraint
```

### Step 2: BUILD - Prompts

```
**Step 2: BUILD**

Now let's implement FBS-001: Core Exam Engine to pass these tests.

Test specifications:
- AC-001.spec.ts: Algorithm selection tests
- AC-002.spec.ts: Scoring model tests
- AC-003.spec.ts: Stopping rules tests

Implementation approach from TAD:
- Use Strategy Pattern for exam algorithms
- PostgreSQL for exam profiles
- JSONB for flexible configuration

Build the code to satisfy these acceptance criteria.
```

### Step 3: REVIEW - Prompts

```
**Step 3: REVIEW**

Review the implementation for FBS-001 against the acceptance criteria:

| AC     | Criteria                      | Status | Notes              |
|--------|-------------------------------|--------|--------------------|
| AC-001 | Algorithm Selection           | ✅/❌/⚠️ |                    |
| AC-002 | Scoring Model Configuration   | ✅/❌/⚠️ |                    |
| AC-003 | Stopping Rules Definition     | ✅/❌/⚠️ |                    |

Identify:
1. Any AC not fully implemented?
2. Missing edge cases?
3. Error handling gaps?
4. Security concerns?
```

### Step 4: VERIFY - Prompts

```
**Step 4: VERIFY**

Run the test suite for FBS-001:

- tests/integration/backend/US-001/AC-001.spec.ts
- tests/integration/backend/US-001/AC-002.spec.ts
- tests/integration/backend/US-001/AC-003.spec.ts

Report results and help fix any failures.
```

### Step 5: SIGN-OFF - Prompts

```
**Step 5: SIGN-OFF**

Feature: FBS-001 Core Exam Engine

Checklist:
- [ ] All AC test files created and passing
- [ ] Unit tests at 80%+ coverage
- [ ] CI pipeline green
- [ ] Build Index updated

If all pass, update:
1. FBS-001 status to "Complete"
2. docs/build/INDEX.md status
3. Note any technical debt or follow-ups
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

## Session Management

### Starting a New Session

```
Read these documents to understand where we are:

1. docs/build/INDEX.md (overall progress)
2. docs/build/FBS-XXX-[feature].md (current feature)
3. docs/RCF-README.md (project overview)

Current status: [Where you left off]
Let's continue with: [Next task]
```

#### Example for This Project:

```
Read these documents to understand where we are:

1. docs/prd/PRD-001-universal-adaptive-testing.md
2. docs/user-stories/US-exam-engine.md
3. docs/RCF-README.md

Current status: PRD and User Stories for REQ-001, REQ-002 are complete
Let's continue with: Generate user stories for REQ-003 (AI-Augmented Authoring)
```

### Ending a Session

```
Before we end:

1. Update FBS-XXX status section with completed tasks
2. Update INDEX.md if any feature status changed
3. Summarize what to pick up next session
4. Stage changes for commit with RCF traceability:

git commit -m "feat(FBS-XXX): [what was done]

RCF: US-XXX/AC-XXX"
```

#### Example Commit for This Project:

```bash
git commit -m "feat(FBS-001): Implement exam profile configuration

RCF: US-001/AC-001, US-001/AC-002, US-001/AC-003

- Add ExamProfile entity with algorithm selection
- Implement Strategy Pattern for scoring models
- Add validation for stopping rules

Traces to: REQ-001.1"
```

### Quick Reference: Prompt Patterns

| Stage | Key Phrase to Use |
|-------|-------------------|
| **Starting** | "I have an idea for... help me structure it into RCF" |
| **PRD** | "Create requirements REQ-XXX that are specific and testable" |
| **User Stories** | "Decompose REQ-XXX into user stories with acceptance criteria" |
| **Coverage** | "Validate coverage - every REQ has US, every US has AC" |
| **TAD** | "Create architecture that supports these requirements" |
| **Build Index** | "Sequence features by dependencies and user value" |
| **FBS** | "Break this feature into the 5-step cycle: SPECIFY→BUILD→REVIEW→VERIFY→SIGN-OFF" |
| **Testing** | "Create test file AC-XXX.spec.ts with TC-001, TC-002..." |

### Example: Complete Session Flow for This Project

```
Session 1: "Connect to the Universal Adaptive Testing Platform repo and 
show me the current RCF status. What requirements have user stories?"

Session 2: "Generate user stories for REQ-003 (AI-Augmented Authoring). 
Create US-007 and US-008 with acceptance criteria AC-015 through AC-020."

Session 3: "Validate coverage using rcf_coverage(). Show me which 
requirements still need user stories."

Session 4: "Generate the TAD for this project. We're using Python for 
scoring engine, Node.js for content service, PostgreSQL, and React."

Session 5: "Create the Build Index. Start with FBS-001 (Core Exam Engine) 
since other features depend on it."

Session 6: "Let's start FBS-001. SPECIFY: Write test specs for AC-001 
(algorithm selection) and AC-002 (scoring model configuration)."

Session 7: "BUILD: Implement the ExamProfile service with Strategy Pattern 
for algorithms. Make tests pass."

Session 8: "REVIEW: Check implementation against ACs. Then VERIFY: Run tests.
Then SIGN-OFF: Update Build Index and move to FBS-002."
```

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
