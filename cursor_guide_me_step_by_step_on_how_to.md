# guide me step by step on how to get started
_Exported on 12/22/2025 at 14:16:55 GMT+6 from Cursor (2.1.50)_

---

**User**

guide me step by step on how to get started when i have got an idea to work on and i want to use this rcf framwork

---

**Cursor**

I'll help you get started with RCF for your new idea! Let me pull up the relevant documentation to give you a comprehensive step-by-step guide.

Let me check the local knowledge base files:

Now let me also look at the templates and build process to give you a complete picture:

Now I have all the information needed. Here's your **step-by-step guide to getting started with RCF** when you have an idea:

---

# 🚀 Getting Started with RCF: From Idea to Implementation

## The Big Picture

RCF (Requirements Confidence Framework) creates an **unbreakable chain of traceability** from your business idea down to verified test cases:

```
PRD → REQ → US → AC → TS → TC
```

| Level | What It Is | Example |
|-------|-----------|---------|
| **PRD** | Product Requirements Document | PRD-001 |
| **REQ** | Individual requirement | REQ-010 |
| **US** | User Story | US-101 |
| **AC** | Acceptance Criteria | AC-201 |
| **TS** | Test Suite (one file per AC) | `AC-201.spec.ts` |
| **TC** | Test Case | TC-001 |

---

## Step-by-Step Guide

### **Step 1: Initialize Your Repository**

First, set up RCF structure in your new project:

```bash
# Create your repo on GitHub, then use the RCF tool:
rcf_repo_initialise({ repo: "your-username/your-project" })
```

This creates the standard directory structure:

```
your-project/
├── docs/
│   ├── product/          # PRD and User Stories go here
│   ├── architecture/     # Technical Architecture (TAD)
│   └── build/            # Build Index and FBS files
│       ├── INDEX.md      # Tracks all features and their status
│       └── patterns/     # Development patterns
├── tests/
│   ├── unit/
│   ├── integration/backend/US-XXX/   # RCF test files
│   └── e2e/frontend/US-XXX/
└── src/
```

---

### **Step 2: Connect to Your Project**

```bash
rcf_connect({ repo: "your-username/your-project" })
```

This syncs your project so RCF tools can help you track traceability.

---

### **Step 3: Create Your PRD (Product Requirements Document)**

This is where you define **WHAT** you're building. Use the template structure:

**Key sections:**
1. **Executive Summary** - 2-4 paragraphs explaining your idea
2. **In Scope** - What will be built (REQ-001, REQ-002, etc.)
3. **Out of Scope** - What won't be built (prevents scope creep!)
4. **Functional Requirements** - Grouped by domain
5. **Non-Functional Requirements** - Performance, reliability, scalability

**Guidelines for writing requirements:**
- Number sequentially: `REQ-001`, `REQ-002`, etc.
- Be specific and testable
- Focus on "what" not "how"
- One capability per requirement
- Typical PRD has **25-35 requirements**

**Example requirement:**

```markdown
### Authentication & Security

- **REQ-014:** Authentication and Authorization

  Authenticate users via OAuth/JWT and enforce role-based access control.
```

**Save to:** `docs/product/PRD-001-{YourProjectName}-PRODUCT_REQUIREMENTS.md`

---

### **Step 4: Generate User Stories with Acceptance Criteria**

For each requirement, create **2-5 user stories**, each with **2-4 acceptance criteria**.

**Format:**

```markdown
## REQ-014: Authentication and Authorization

### US-101: As a developer, I need API authentication via JWT

**AC-201:** System accepts valid JWT tokens
**AC-202:** System validates token signature and expiry

### US-102: As an admin, I need role-based access control

**AC-203:** Admin role can access all resources
**AC-204:** User role is restricted to permitted resources only
```

**Save to:** `docs/product/PRD-001-{YourProjectName}-USER-STORIES.md`

---

### **Step 5: Validate Coverage (Critical Gate!)**

Before proceeding, ensure **all requirements have stories with acceptance criteria**:

```bash
rcf_coverage({})
```

**You must see:**
- `coveragePercent: 100`
- `mustHaveUncovered: []`
- `uncoveredReqs: []`

⚠️ **Do not proceed to architecture until coverage is validated!**

---

### **Step 6: Create Technical Architecture Document (TAD)**

Now define **HOW** you'll build it. The TAD includes:

- System architecture diagram
- Component breakdown
- Technology decisions
- Integration patterns
- Data flow

**Save to:** `docs/architecture/TAD-001-{YourProjectName}.md`

---

### **Step 7: Create the Build Index**

The Build Index is your **master tracking document** for all features:

```markdown
# Build Index

## Project: {Project Name}
## PRD: PRD-001

| FBS     | Feature           | Status      | REQs    | USs            | Dependencies |
|---------|-------------------|-------------|---------|----------------|--------------|
| FBS-001 | Core Auth         | Not Started | REQ-014 | US-101, US-102 | -            |
| FBS-002 | User Management   | Not Started | REQ-015 | US-105-108     | FBS-001      |
| FBS-003 | Data Processing   | Not Started | REQ-010 | US-120-125     | FBS-001      |
```

**Save to:** `docs/build/INDEX.md`

---

### **Step 8: Build Feature by Feature (The 5-Step Cycle)**

For each Feature Build Specification (FBS), follow this cycle:

```
┌──────────────────────────────────────────────────────────────┐
│  1. SPECIFY - Write test specifications from ACs            │
│     - Create AC-XXX.spec.ts files with test scenarios        │
│     - Define what "working" looks like                       │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  2. BUILD - Implement code to satisfy acceptance criteria    │
│     - Write the actual functionality                         │
│     - Include unit tests (80% coverage target)               │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  3. REVIEW - Compare implementation against specs            │
│     - Point-by-point review against each AC                  │
│     - Identify gaps, edge cases, missing error handling      │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  4. VERIFY - Run tests against running service               │
│     - Execute integration/E2E tests                          │
│     - All tests must pass                                    │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  5. SIGN-OFF - Confirm RCF traceability, move to next FBS    │
│     - CI pipeline passes                                     │
│     - Update BUILD INDEX status                              │
└──────────────────────────────────────────────────────────────┘
```

---

### **Step 9: Test File Organization**

Tests follow RCF traceability structure:

```
tests/integration/backend/
└── US-101/                    # One folder per User Story
    ├── AC-201.spec.ts         # One file per Acceptance Criterion
    │   ├── TC-001: Valid token returns 200
    │   ├── TC-002: Token with valid claims accepted
    │   └── TC-003: Token from trusted issuer accepted
    └── AC-202.spec.ts
        ├── TC-001: Invalid signature returns 401
        └── TC-002: Valid signature proceeds
```

**RCF Path:** `US-101/AC-201/TC-001`

---

## Quick Reference Checklist

| Phase | Duration | Deliverable | Success Criteria |
|-------|----------|-------------|------------------|
| 1. Requirements | 1-2 weeks | PRD with 25-35 REQs | Stakeholder approval |
| 2. Decomposition | 1 week | 80+ User Stories | All REQs have stories |
| 3. Verification | 1 week | Test Suites & Cases | 100% AC coverage |
| 4. Implementation | 4-8 weeks | Working code | All tests pass |
| 5. Validation | Ongoing | Confidence metrics | >95% coverage |

---

## Available RCF Tools

| Task | Command |
|------|---------|
| Initialize a new repo | `rcf_repo_initialise({ repo: "owner/repo" })` |
| Connect to your project | `rcf_connect({ repo: "owner/repo" })` |
| Check coverage | `rcf_coverage({})` |
| Query traceability | `rcf_query({ type: "coverage", target: "REQ-001" })` |
| Trace AC back to requirement | `rcf_query({ type: "trace-back", target: "AC-101" })` |
| Get PRD schema | `rcf_schema({ documentType: "PRD" })` |
| Validate your PRD | `rcf_validate({ documentType: "PRD", document: {...} })` |
| Explain RCF concepts | `rcf_explain({ topic: "traceability" })` |

---

## Your First Session Prompt Template

When starting with Claude/AI assistant, use this:

```
I have a new project idea: {describe your idea in 2-3 sentences}

I want to use the RCF framework to build this systematically.

Let's start by:
1. Creating the PRD with clear requirements (REQ-XXX)
2. Breaking requirements into user stories (US-XXX) with acceptance criteria (AC-XXX)
3. Validating coverage before we proceed to architecture

Help me structure my requirements following RCF principles.
```

---

Would you like me to help you start with your specific idea? Tell me what you're building and we can create your PRD together!

```plaintext
PRD → REQ → US → AC → TS → TC
```

```shellscript
# Create your repo on GitHub, then use the RCF tool:
rcf_repo_initialise({ repo: "your-username/your-project" })
```

```plaintext
your-project/
├── docs/
│   ├── product/          # PRD and User Stories go here
│   ├── architecture/     # Technical Architecture (TAD)
│   └── build/            # Build Index and FBS files
│       ├── INDEX.md      # Tracks all features and their status
│       └── patterns/     # Development patterns
├── tests/
│   ├── unit/
│   ├── integration/backend/US-XXX/   # RCF test files
│   └── e2e/frontend/US-XXX/
└── src/
```

```shellscript
rcf_connect({ repo: "your-username/your-project" })
```

```markdown
### Authentication & Security

- **REQ-014:** Authentication and Authorization

  Authenticate users via OAuth/JWT and enforce role-based access control.
```

```markdown
## REQ-014: Authentication and Authorization

### US-101: As a developer, I need API authentication via JWT

**AC-201:** System accepts valid JWT tokens
**AC-202:** System validates token signature and expiry

### US-102: As an admin, I need role-based access control

**AC-203:** Admin role can access all resources
**AC-204:** User role is restricted to permitted resources only
```

```shellscript
rcf_coverage({})
```

```markdown
# Build Index

## Project: {Project Name}
## PRD: PRD-001

| FBS     | Feature           | Status      | REQs    | USs            | Dependencies |
|---------|-------------------|-------------|---------|----------------|--------------|
| FBS-001 | Core Auth         | Not Started | REQ-014 | US-101, US-102 | -            |
| FBS-002 | User Management   | Not Started | REQ-015 | US-105-108     | FBS-001      |
| FBS-003 | Data Processing   | Not Started | REQ-010 | US-120-125     | FBS-001      |
```

```plaintext
┌──────────────────────────────────────────────────────────────┐
│  1. SPECIFY - Write test specifications from ACs            │
│     - Create AC-XXX.spec.ts files with test scenarios        │
│     - Define what "working" looks like                       │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  2. BUILD - Implement code to satisfy acceptance criteria    │
│     - Write the actual functionality                         │
│     - Include unit tests (80% coverage target)               │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  3. REVIEW - Compare implementation against specs            │
│     - Point-by-point review against each AC                  │
│     - Identify gaps, edge cases, missing error handling      │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  4. VERIFY - Run tests against running service               │
│     - Execute integration/E2E tests                          │
│     - All tests must pass                                    │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  5. SIGN-OFF - Confirm RCF traceability, move to next FBS    │
│     - CI pipeline passes                                     │
│     - Update BUILD INDEX status                              │
└──────────────────────────────────────────────────────────────┘
```

```plaintext
tests/integration/backend/
└── US-101/                    # One folder per User Story
    ├── AC-201.spec.ts         # One file per Acceptance Criterion
    │   ├── TC-001: Valid token returns 200
    │   ├── TC-002: Token with valid claims accepted
    │   └── TC-003: Token from trusted issuer accepted
    └── AC-202.spec.ts
        ├── TC-001: Invalid signature returns 401
        └── TC-002: Valid signature proceeds
```

```plaintext
I have a new project idea: {describe your idea in 2-3 sentences}

I want to use the RCF framework to build this systematically.

Let's start by:
1. Creating the PRD with clear requirements (REQ-XXX)
2. Breaking requirements into user stories (US-XXX) with acceptance criteria (AC-XXX)
3. Validating coverage before we proceed to architecture

Help me structure my requirements following RCF principles.
```

---

**User**

provide me guideline on how to provide prompt or communicaate with rcf with my idea on hand , step by step

---

**Cursor**

# RCF Communication Guide: Prompts for Each Step

Here's a practical, step-by-step guide on exactly **what to say** when working with RCF tools at each stage of your project.

---

## 🎯 Stage 1: Starting with Your Idea

### Prompt Template: Initial Idea Discussion

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

**Example:**

```
I have an idea for a project and want to use RCF methodology.

**The Idea:** A personal finance tracker that helps users categorize 
expenses automatically using AI and provides spending insights.

**Problem it solves:** People struggle to track where their money goes 
and make better financial decisions.

**Target users:** Individual consumers who want to understand their 
spending patterns.

**Key capabilities I envision:**
- Import bank transactions (CSV/API)
- AI-powered expense categorization
- Monthly spending reports and trends
- Budget alerts when overspending

Help me structure this into an RCF-compliant PRD with clear requirements.
```

---

## 🎯 Stage 2: Creating the PRD

### Prompt Template: Generate Requirements

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

### Prompt Template: Refine Requirements

```
Review these requirements and help me:

1. Are any too vague to be testable?
2. Are any combining multiple capabilities (should be split)?
3. Am I missing any obvious requirements for this type of product?
4. Should any be moved to "Out of Scope" for v1?

[Paste your current requirements list]
```

### Prompt Template: Prioritize Requirements

```
Help me prioritize these requirements into:

- **Must Have** (Core MVP - cannot launch without)
- **Should Have** (Important but can launch without)
- **Nice to Have** (Future enhancements)

Consider: user value, technical dependencies, and effort.

[Paste your requirements list]
```

---

## 🎯 Stage 3: Creating User Stories

### Prompt Template: Generate User Stories from Requirements

```
Now let's decompose these requirements into User Stories.

For each requirement, create 2-5 user stories using this format:

**US-XXX:** As a [user type], I want to [action] so that [benefit]

Then for each user story, define 2-4 acceptance criteria:

**AC-XXX:** [Specific, testable condition that must be true]

Start with: REQ-001 [paste requirement description]
```

### Prompt Template: Generate Stories for Multiple Requirements

```
Generate user stories and acceptance criteria for these requirements:

REQ-001: [Description]
REQ-002: [Description]
REQ-003: [Description]

Follow the numbering convention:
- US numbers: US-101, US-102, US-103...
- AC numbers: AC-201, AC-202, AC-203...

Each AC must be:
- Specific and measurable
- Testable (can write a test for it)
- Independent (doesn't depend on other ACs)
```

### Prompt Template: Review User Story Coverage

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

## 🎯 Stage 4: Validating Coverage

### Prompt Template: Check Coverage

```
Let's validate RCF coverage before proceeding to architecture.

Here are my requirements and their user stories:

REQ-001: [Title]
  - US-101: [Story] → AC-201, AC-202
  - US-102: [Story] → AC-203, AC-204

REQ-002: [Title]
  - US-103: [Story] → AC-205, AC-206

[Continue for all REQs]

Please verify:
1. Every REQ has at least one US
2. Every US has at least 2 ACs
3. No gaps in the traceability chain
```

**Or use the RCF tool directly:**

```
Run rcf_coverage({}) and tell me if there are any gaps to address.
```

---

## 🎯 Stage 5: Technical Architecture (TAD)

### Prompt Template: Create TAD

```
Now let's create the Technical Architecture Document (TAD).

Based on:
- PRD: [Link or paste key requirements]
- User Stories: [Link or paste key stories]

Define:
1. **System Architecture** - High-level component diagram
2. **Technology Stack** - Languages, frameworks, databases
3. **Component Breakdown** - What each major component does
4. **Data Model** - Key entities and relationships
5. **API Design** - Main endpoints and contracts
6. **Integration Points** - External services/dependencies
7. **Security Approach** - Auth, encryption, access control
```

### Prompt Template: Review Architecture

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

## 🎯 Stage 6: Build Planning

### Prompt Template: Create Build Index

```
Help me create the Build Index to sequence my features.

Based on:
- Requirements: REQ-001 to REQ-XXX
- User Stories: US-101 to US-XXX
- Technical dependencies from TAD

Create FBS (Feature Build Specification) entries:

| FBS     | Feature      | REQs    | USs         | Dependencies |
|---------|--------------|---------|-------------|--------------|

Order by:
1. Technical dependencies (what must exist first)
2. User value (deliver value early)
3. Risk (tackle risky parts early)
```

### Prompt Template: Create FBS for a Feature

```
Create FBS-XXX for: [Feature Name]

This feature covers:
- REQs: [List]
- User Stories: [List with ACs]

Include:
1. **Domain Model** - Entities, flows, contracts for this feature
2. **Implementation Approach** - How to build it (referencing TAD)
3. **AC Mapping** - Which AC maps to which implementation point
4. **Tasks** - Breakdown into buildable tasks
5. **Dependencies** - What must exist before this FBS
```

---

## 🎯 Stage 7: Building Features (The 5-Step Cycle)

### Prompt: Step 1 - SPECIFY

```
We're starting FBS-XXX: [Feature Name]

**Step 1: SPECIFY**

For these acceptance criteria:
- AC-XXX: [Description]
- AC-XXX: [Description]

Help me write the test specifications. For each AC, define:
- Test file location: tests/integration/backend/US-XXX/AC-XXX.spec.ts
- Test scenarios (TC-001, TC-002, etc.)
- What each test should verify
```

### Prompt: Step 2 - BUILD

```
**Step 2: BUILD**

Now let's implement the feature to pass these tests.

Test specifications:
[Paste or reference the test specs from Step 1]

Implementation approach from FBS:
[Paste relevant FBS sections]

Build the code to satisfy these acceptance criteria.
```

### Prompt: Step 3 - REVIEW

```
**Step 3: REVIEW**

Review the implementation against the acceptance criteria:

| AC | Criteria | Status | Notes |
|----|----------|--------|-------|
| AC-XXX | [Description] | ✅/❌/⚠️ | [Gap or issue] |

Identify:
1. Any AC not fully implemented?
2. Missing edge cases?
3. Error handling gaps?
4. Security concerns?
```

### Prompt: Step 4 - VERIFY

```
**Step 4: VERIFY**

Run the test suite for this feature:

- tests/integration/backend/US-XXX/AC-XXX.spec.ts
- tests/integration/backend/US-XXX/AC-YYY.spec.ts

Report results and help fix any failures.
```

### Prompt: Step 5 - SIGN-OFF

```
**Step 5: SIGN-OFF**

Feature: FBS-XXX [Feature Name]

Checklist:
- [ ] All AC test files created and passing
- [ ] Unit tests at 80%+ coverage
- [ ] CI pipeline green
- [ ] Build Index updated

If all pass, update:
1. FBS-XXX status to "Complete"
2. INDEX.md status for this FBS
3. Note any technical debt or follow-ups
```

---

## 🎯 Session Management Prompts

### Starting a New Session

```
Read these documents to understand where we are:

1. docs/build/INDEX.md (overall progress)
2. docs/build/FBS-XXX-[feature].md (current feature)
3. docs/architecture/TAD-001.md (if needed)

Current status: [Where you left off]
Let's continue with: [Next task]
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

---

## 📋 Quick Reference: Prompt Patterns

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

---

## 🎯 Example: Complete Flow for a Small Idea

**Idea:** A simple URL shortener

```
Session 1: "I want to build a URL shortener. Help me create an RCF-compliant 
PRD with requirements for: creating short URLs, redirecting, tracking clicks, 
and basic analytics."

Session 2: "Now decompose REQ-001 (Create Short URLs) and REQ-002 (Redirect) 
into user stories with acceptance criteria."

Session 3: "Validate my coverage and create the TAD for a simple Node.js 
backend with Redis for URL storage."

Session 4: "Create the Build Index. I think FBS-001 should be core URL 
operations, FBS-002 should be analytics."

Session 5: "Let's start FBS-001. SPECIFY: Write test specs for AC-201 
(valid URLs get shortened) and AC-202 (short URLs redirect correctly)."

Session 6: "BUILD: Implement the URL shortening service to pass these tests."

Session 7: "REVIEW: Check implementation against ACs. Then VERIFY: Run tests."

Session 8: "SIGN-OFF: Update Build Index, move to FBS-002."
```

---

Would you like to start with your idea now? Just tell me what you're building and we'll begin with structuring it into RCF!

```plaintext
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

```plaintext
I have an idea for a project and want to use RCF methodology.

**The Idea:** A personal finance tracker that helps users categorize 
expenses automatically using AI and provides spending insights.

**Problem it solves:** People struggle to track where their money goes 
and make better financial decisions.

**Target users:** Individual consumers who want to understand their 
spending patterns.

**Key capabilities I envision:**
- Import bank transactions (CSV/API)
- AI-powered expense categorization
- Monthly spending reports and trends
- Budget alerts when overspending

Help me structure this into an RCF-compliant PRD with clear requirements.
```

```plaintext
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

```plaintext
Review these requirements and help me:

1. Are any too vague to be testable?
2. Are any combining multiple capabilities (should be split)?
3. Am I missing any obvious requirements for this type of product?
4. Should any be moved to "Out of Scope" for v1?

[Paste your current requirements list]
```

```plaintext
Help me prioritize these requirements into:

- **Must Have** (Core MVP - cannot launch without)
- **Should Have** (Important but can launch without)
- **Nice to Have** (Future enhancements)

Consider: user value, technical dependencies, and effort.

[Paste your requirements list]
```

```plaintext
Now let's decompose these requirements into User Stories.

For each requirement, create 2-5 user stories using this format:

**US-XXX:** As a [user type], I want to [action] so that [benefit]

Then for each user story, define 2-4 acceptance criteria:

**AC-XXX:** [Specific, testable condition that must be true]

Start with: REQ-001 [paste requirement description]
```

```plaintext
Generate user stories and acceptance criteria for these requirements:

REQ-001: [Description]
REQ-002: [Description]
REQ-003: [Description]

Follow the numbering convention:
- US numbers: US-101, US-102, US-103...
- AC numbers: AC-201, AC-202, AC-203...

Each AC must be:
- Specific and measurable
- Testable (can write a test for it)
- Independent (doesn't depend on other ACs)
```

```plaintext
Review my user stories for REQ-XXX:

[Paste user stories and ACs]

Questions:
1. Do these stories fully cover the requirement?
2. Are any acceptance criteria missing edge cases?
3. Are the ACs specific enough to write tests for?
4. Should any stories be split or combined?
```

```plaintext
Let's validate RCF coverage before proceeding to architecture.

Here are my requirements and their user stories:

REQ-001: [Title]
  - US-101: [Story] → AC-201, AC-202
  - US-102: [Story] → AC-203, AC-204

REQ-002: [Title]
  - US-103: [Story] → AC-205, AC-206

[Continue for all REQs]

Please verify:
1. Every REQ has at least one US
2. Every US has at least 2 ACs
3. No gaps in the traceability chain
```

```plaintext
Run rcf_coverage({}) and tell me if there are any gaps to address.
```

```plaintext
Now let's create the Technical Architecture Document (TAD).

Based on:
- PRD: [Link or paste key requirements]
- User Stories: [Link or paste key stories]

Define:
1. **System Architecture** - High-level component diagram
2. **Technology Stack** - Languages, frameworks, databases
3. **Component Breakdown** - What each major component does
4. **Data Model** - Key entities and relationships
5. **API Design** - Main endpoints and contracts
6. **Integration Points** - External services/dependencies
7. **Security Approach** - Auth, encryption, access control
```

```plaintext
Review this architecture against my requirements:

[Paste TAD sections]

Questions:
1. Does this architecture support all functional requirements?
2. Are non-functional requirements (performance, scaling) addressed?
3. What are the main technical risks?
4. Are there simpler alternatives for any component?
```

```plaintext
Help me create the Build Index to sequence my features.

Based on:
- Requirements: REQ-001 to REQ-XXX
- User Stories: US-101 to US-XXX
- Technical dependencies from TAD

Create FBS (Feature Build Specification) entries:

| FBS     | Feature      | REQs    | USs         | Dependencies |
|---------|--------------|---------|-------------|--------------|

Order by:
1. Technical dependencies (what must exist first)
2. User value (deliver value early)
3. Risk (tackle risky parts early)
```

```plaintext
Create FBS-XXX for: [Feature Name]

This feature covers:
- REQs: [List]
- User Stories: [List with ACs]

Include:
1. **Domain Model** - Entities, flows, contracts for this feature
2. **Implementation Approach** - How to build it (referencing TAD)
3. **AC Mapping** - Which AC maps to which implementation point
4. **Tasks** - Breakdown into buildable tasks
5. **Dependencies** - What must exist before this FBS
```

```plaintext
We're starting FBS-XXX: [Feature Name]

**Step 1: SPECIFY**

For these acceptance criteria:
- AC-XXX: [Description]
- AC-XXX: [Description]

Help me write the test specifications. For each AC, define:
- Test file location: tests/integration/backend/US-XXX/AC-XXX.spec.ts
- Test scenarios (TC-001, TC-002, etc.)
- What each test should verify
```

```plaintext
**Step 2: BUILD**

Now let's implement the feature to pass these tests.

Test specifications:
[Paste or reference the test specs from Step 1]

Implementation approach from FBS:
[Paste relevant FBS sections]

Build the code to satisfy these acceptance criteria.
```

```plaintext
**Step 3: REVIEW**

Review the implementation against the acceptance criteria:

| AC | Criteria | Status | Notes |
|----|----------|--------|-------|
| AC-XXX | [Description] | ✅/❌/⚠️ | [Gap or issue] |

Identify:
1. Any AC not fully implemented?
2. Missing edge cases?
3. Error handling gaps?
4. Security concerns?
```

```plaintext
**Step 4: VERIFY**

Run the test suite for this feature:

- tests/integration/backend/US-XXX/AC-XXX.spec.ts
- tests/integration/backend/US-XXX/AC-YYY.spec.ts

Report results and help fix any failures.
```

```plaintext
**Step 5: SIGN-OFF**

Feature: FBS-XXX [Feature Name]

Checklist:
- [ ] All AC test files created and passing
- [ ] Unit tests at 80%+ coverage
- [ ] CI pipeline green
- [ ] Build Index updated

If all pass, update:
1. FBS-XXX status to "Complete"
2. INDEX.md status for this FBS
3. Note any technical debt or follow-ups
```

```plaintext
Read these documents to understand where we are:

1. docs/build/INDEX.md (overall progress)
2. docs/build/FBS-XXX-[feature].md (current feature)
3. docs/architecture/TAD-001.md (if needed)

Current status: [Where you left off]
Let's continue with: [Next task]
```

```plaintext
Before we end:

1. Update FBS-XXX status section with completed tasks
2. Update INDEX.md if any feature status changed
3. Summarize what to pick up next session
4. Stage changes for commit with RCF traceability:

git commit -m "feat(FBS-XXX): [what was done]

RCF: US-XXX/AC-XXX"
```

```plaintext
Session 1: "I want to build a URL shortener. Help me create an RCF-compliant 
PRD with requirements for: creating short URLs, redirecting, tracking clicks, 
and basic analytics."

Session 2: "Now decompose REQ-001 (Create Short URLs) and REQ-002 (Redirect) 
into user stories with acceptance criteria."

Session 3: "Validate my coverage and create the TAD for a simple Node.js 
backend with Redis for URL storage."

Session 4: "Create the Build Index. I think FBS-001 should be core URL 
operations, FBS-002 should be analytics."

Session 5: "Let's start FBS-001. SPECIFY: Write test specs for AC-201 
(valid URLs get shortened) and AC-202 (short URLs redirect correctly)."

Session 6: "BUILD: Implement the URL shortening service to pass these tests."

Session 7: "REVIEW: Check implementation against ACs. Then VERIFY: Run tests."

Session 8: "SIGN-OFF: Update Build Index, move to FBS-002."
```

---

**User**

could you please update the RCF Communication Guide section to include how the MCP server tools work alongside each prompt to accomplish the steps:

---

**Cursor**

Let me first check what MCP tools are available in the RCF server:

Now I have the complete picture. Here's the updated **RCF Communication Guide with MCP Tools**:

---

# RCF Communication Guide: Prompts for Each Step

This guide shows you **what to say** to work with RCF. The MCP server handles all the complexity - templates, validation, and tool orchestration - automatically behind the scenes.

---

## 🎯 How It Works: Just Use Natural Language

**You don't need to know tool syntax or parameters.** Simply describe what you want, and the AI assistant with RCF MCP tools will:

1. ✅ **Select the right tool** automatically
2. ✅ **Load the appropriate template** (PRD, User Stories, TAD templates are built-in)
3. ✅ **Structure the output** according to RCF standards
4. ✅ **Apply numbering conventions** (REQ-XXX, US-XXX, AC-XXX)
5. ✅ **Validate** against schemas
6. ✅ **Save to Git** with proper file paths

---

## 📋 Available MCP Server Resources

The RCF MCP server provides these resources you can reference:

| Resource | What It Contains |
|----------|------------------|
| `rcf://docs/overview` | Core RCF concepts, hierarchy (PRD→REQ→US→AC→TS→TC) |
| `rcf://docs/quickstart` | Step-by-step implementation guide |
| `rcf://docs/document-structure` | Document types and relationships |
| `rcf://docs/build-process` | The 5-step build cycle |
| `rcf://schemas/prd` | PRD JSON schema |
| `rcf://schemas/user-stories` | User Stories JSON schema |

---

## 📋 Available MCP Server Prompts

The server provides **2 interactive prompts** you can invoke directly:

| Prompt | Purpose | When to Use |
|--------|---------|-------------|
| `rcf_getting_started` | Setup guide for connecting to RCF repositories | First time setup |
| `rcf_tutor` | Interactive Q&A tutoring session | Learning RCF methodology |

---

## 🎯 Stage 1: Project Setup

### Initialize a New Repository

**Just say:**
```
I have a new project idea and want to use RCF. 
Initialize the RCF structure in my GitHub repository: github.com/myuser/my-project
```

**What happens:** Server creates `rcf-manifest.json`, directory structure, and opens a PR.

---

### Connect to Your Project

**Just say:**
```
Connect to my project at github.com/myuser/my-project
```

**What happens:** Server syncs traceability data and establishes your session.

---

### Check Project Status

**Just say:**
```
What's the current status of my RCF project?
```

**What happens:** Server shows connected repo, active PRD, and statistics.

---

## 🎯 Stage 2: Creating the PRD

### Generate PRD from Your Idea

**Just say:**
```
I want to build a personal finance tracker that categorizes expenses 
using AI and shows spending insights.

Target users: Individual consumers
Key capabilities: Import transactions, AI categorization, spending reports, budget alerts

Generate an RCF-compliant PRD.
```

**What happens:** 
- Server uses built-in PRD template
- Generates 20-30 requirements (REQ-001, REQ-002, etc.)
- Structures by domain (Core, Data, Security, etc.)
- Returns formatted PRD markdown

---

### View Current PRD

**Just say:**
```
Show me the current PRD.
```

---

### Edit/Refine the PRD

**Just say:**
```
Update the PRD:
- Add a requirement for user notifications
- Remove REQ-015, it's out of scope for v1
- Make REQ-003 more specific about rate limiting
```

**What happens:** Server applies your amendments and returns updated PRD.

---

### Save PRD to Git

**Just say:**
```
Save the PRD to Git and create a PR.
```

**What happens:** Server creates branch, commits file, opens PR.

---

## 🎯 Stage 3: Creating User Stories

### Generate User Stories from PRD

**Just say:**
```
Generate user stories with acceptance criteria from the PRD.
```

**What happens:**
- Server reads current PRD
- Uses built-in User Stories template
- Creates 2-5 stories per requirement (US-101, US-102, etc.)
- Each story gets 2-4 acceptance criteria (AC-201, AC-202, etc.)

---

### View Current Stories

**Just say:**
```
Show me the user stories.
```

---

### Edit User Stories

**Just say:**
```
Edit the user stories:
- Add error handling acceptance criteria to US-103
- Split US-105 into separate create and update stories
- Add a caching story for REQ-008
```

---

### Save Stories to Git

**Just say:**
```
Save the user stories to Git.
```

---

## 🎯 Stage 4: Validate Coverage (Critical Gate!)

### Check Coverage

**Just say:**
```
Check if all requirements have adequate coverage.
```

**What you need to see:**
- `coveragePercent: 100`
- `mustHaveUncovered: []`
- `uncoveredReqs: []`

⚠️ **Do NOT proceed until coverage is 100%!**

---

### Trace Requirements

**Just say:**
```
Show me all stories and ACs for REQ-010.
```

or

```
What requirement does AC-205 trace back to?
```

---

## 🎯 Stage 5: Technical Architecture (TAD)

### Generate TAD

**Just say:**
```
Generate the Technical Architecture Document.
Consider: React frontend, Node.js backend, PostgreSQL database.
```

**What happens:**
- Server extracts architectural concerns from PRD and stories
- Uses built-in TAD template
- Generates system overview, components, data architecture, security, deployment

---

### View Current TAD

**Just say:**
```
Show me the technical architecture.
```

---

### Edit TAD

**Just say:**
```
Update the TAD:
- Change database from PostgreSQL to MongoDB
- Add Redis caching layer
- Update deployment for Kubernetes
```

---

### Save TAD to Git

**Just say:**
```
Save the TAD to Git.
```

---

## 🎯 Stage 6: Learning & Reference

### Get RCF Guidance

**Just say:**
```
Explain how RCF traceability works.
```

Available topics: `overview`, `traceability`, `process`, `documents`, `prd`, `user-stories`, `tad`, `testing`, `numbering`, `conversion`

---

### Get Document Schemas

**Just say:**
```
Show me the JSON schema for PRD documents.
```

---

### Validate Document JSON

**Just say:**
```
Validate this PRD JSON before importing it:
[paste your JSON]
```

---

### Import External PRD

**Just say:**
```
Import this PRD I created manually:
[paste your PRD JSON]
```

---

## 🎯 Complete Workflow: Example Conversation

Here's what a typical RCF session looks like:

### Session 1: Setup & PRD

```
You: "Initialize RCF in my repo github.com/myuser/todo-app"
→ Server creates structure, opens PR

You: "Connect to the project"
→ Server establishes session

You: "Generate a PRD for a todo app with task management, 
     categories, due dates, and notifications"
→ Server generates PRD with ~25 requirements

You: "Save it to Git"
→ Server creates PR with PRD file
```

### Session 2: User Stories

```
You: "Generate user stories from the PRD"
→ Server creates ~80 user stories with ~200 acceptance criteria

You: "Check coverage"
→ Server reports 100% coverage (or gaps to fix)

You: "Save stories to Git"
→ Server creates PR with stories file
```

### Session 3: Architecture

```
You: "Generate TAD using React and Node.js"
→ Server generates complete technical architecture

You: "Save TAD to Git"
→ Server creates PR with TAD file
```

---

## 📋 Quick Reference: What to Say

| Stage | Example Prompt |
|-------|----------------|
| **Setup** | "Initialize RCF in my repo owner/repo" |
| **Connect** | "Connect to my project" |
| **Generate PRD** | "Generate a PRD for [describe your idea]" |
| **Edit PRD** | "Update the PRD: [describe changes]" |
| **Generate Stories** | "Generate user stories from the PRD" |
| **Edit Stories** | "Edit the stories: [describe changes]" |
| **Check Coverage** | "Check coverage" |
| **Trace** | "Trace REQ-005 forward" or "Trace AC-201 back" |
| **Generate TAD** | "Generate the TAD using [tech preferences]" |
| **Edit TAD** | "Update the TAD: [describe changes]" |
| **Save** | "Save the [PRD/stories/TAD] to Git" |
| **Learn** | "Explain [RCF topic]" |

---

## 🔧 Session Management

### Starting a New Session

**Just say:**
```
Connect to my project and show me the current status.
What's the next thing we should work on?
```

### Switching Branches

**Just say:**
```
Switch to branch feature/new-requirements
```

### Syncing with Remote

**Just say:**
```
Sync with the remote repository
```

### Switching PRDs

**Just say:**
```
Switch to PRD-002
```

---

**That's it!** Just describe what you want in natural language. The MCP server handles all the complexity behind the scenes.

---

**User**

the prompt and template will be handled by the mcp sever?

---

**Cursor**

Yes! The RCF MCP server handles both **prompts** and **templates** for you. Let me show you what's available:

Yes! The MCP server handles both **prompts** and **templates** automatically. Here's how:

---

## 🎯 MCP Server-Provided Prompts

The server exposes **2 interactive prompts** you can invoke:

| Prompt | Purpose | How to Use |
|--------|---------|------------|
| `rcf_getting_started` | Step-by-step connection guide | Just invoke it - no args needed |
| `rcf_tutor` | Interactive Q&A tutoring session | Optional: `topic`, `experience` level |

**Example usage:**
```javascript
// Get setup help
rcf_getting_started()

// Start a tutoring session
rcf_tutor({ topic: "traceability", experience: "beginner" })
```

---

## 🎯 Templates Are Built Into the Tools

You **don't need to provide templates** - the MCP server has them built-in and uses them automatically when generating documents:

| Template | Used By | Location in Server |
|----------|---------|-------------------|
| PRD Template | `rcf_prd_generate_start` | `knowledge/templates/PRD-TEMPLATE.md` |
| User Stories Template | `rcf_stories_generate_start` | `knowledge/templates/USER-STORIES-TEMPLATE.md` |
| TAD Template | `rcf_tad_generate_start` | `knowledge/templates/TAD-TEMPLATE.md` |
| FBS Template | (manual reference) | `knowledge/templates/FBS-TEMPLATE.md` |
| Build Index Template | (manual reference) | `knowledge/templates/BUILD-INDEX-TEMPLATE.md` |
| Test Suite Template | (manual reference) | `knowledge/templates/TS-TEMPLATE.ts` |

When you call `rcf_prd_generate_start({ ... })`, the server:
1. Loads the PRD template internally
2. Uses it to structure the LLM generation
3. Returns a properly formatted PRD

---

## 🎯 Knowledge Base for Guidance

The server also provides **resources** (documentation you can access):

| Resource URI | Content |
|--------------|---------|
| `rcf://docs/overview` | Core RCF concepts and hierarchy |
| `rcf://docs/quickstart` | Step-by-step implementation guide |
| `rcf://docs/document-structure` | Document types and relationships |
| `rcf://docs/build-process` | The 5-step build cycle |
| `rcf://schemas/prd` | PRD JSON schema |
| `rcf://schemas/user-stories` | User Stories JSON schema |

And the `rcf_explain` tool for on-demand guidance:
```javascript
rcf_explain({ topic: "traceability", depth: "with_examples" })
```

---

## 🎯 What This Means for You

**You just describe your idea in natural language.** The MCP server handles:

1. ✅ **Loading the right template** for each document type
2. ✅ **Structuring the output** according to RCF standards
3. ✅ **Numbering conventions** (REQ-XXX, US-XXX, AC-XXX)
4. ✅ **Validation** against schemas
5. ✅ **Saving to Git** with proper file paths

**Your workflow is simply:**

```
You: "Generate a PRD for a todo app with task management and reminders"

Server: (internally uses PRD template + LLM)
        → Returns fully structured PRD-001 with REQ-001 through REQ-025

You: "Generate user stories from the PRD"

Server: (internally uses User Stories template + PRD context)
        → Returns US-101 through US-150 with AC-201 through AC-400

You: "Save it to Git"

Server: → Creates branch, commits files, opens PR
```

You never need to manually work with templates - just describe what you want!

