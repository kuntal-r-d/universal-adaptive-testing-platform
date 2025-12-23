# Universal Adaptive Testing Platform - AI Context

## Project Summary
A configurable, extensible adaptive testing engine supporting multiple exam methodologies (CAT, LOFT, Linear) with AI-augmented content authoring and smart analytics.

## Technology Stack
- **Runtime**: Node.js v22+
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (workspaces)
- **Backend**: Express.js
- **Databases**: PostgreSQL (ACID transactions), MongoDB (flexible schemas)
- **Cache**: Redis
- **Testing**: node:test, Sinon.js, c8 coverage
- **Build**: tsup (packages), tsx (development)

## RCF Framework
This project follows the Requirements Confidence Framework (RCF):
- **PRD-001**: 19 requirements defining system capabilities
- **User Stories**: 20 user stories with 60 acceptance criteria
- All code should trace back to requirements via RCF comments

## Key Requirements (REQ-XXX)
- REQ-001: Polymorphic Exam Engine (pluggable strategies)
- REQ-002: Session State Management (resume capability)
- REQ-014: Next-Item Latency (<200ms P95)
- REQ-019: ACID Compliance (PostgreSQL)

## Code Conventions
1. Use `.js` extension in imports
2. Named exports for controllers/services
3. `Exceptions.convert()` in catch blocks
4. `global.logger` for logging
5. RCF traceability comments: `// RCF: REQ-XXX, US-XXX`

## Workspace Structure
```
apps/api-service/          # Main API service
packages/@uat/
  backend-common/          # Shared utilities, middleware, services
  backend-scoring/         # Scoring engine (IRT algorithms)
  backend-integration-tests/  # Test infrastructure
docs/
  rcf/                     # JSON documents (manifest, PRD, stories)
  product/                 # Markdown requirements
  architecture/            # TAD document
  build/                   # Build index, FBS, patterns
```

## Testing Pattern
- Unit tests: `test/unit/*.test.ts`
- Integration tests: `tests/integration/backend/US-XXX/AC-XXX.spec.ts`
- One file per Acceptance Criterion
- TC-001, TC-002, etc. per file

## Quick Commands
```bash
pnpm dev              # Start development
pnpm build            # Build all
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests
pnpm quality          # Format + lint + type-check
```

