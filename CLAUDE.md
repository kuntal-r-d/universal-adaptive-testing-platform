# Universal Adaptive Testing Platform - AI Context

## Project Summary
A configurable, extensible adaptive testing engine supporting multiple exam methodologies (CAT, LOFT, Linear) with AI-augmented content authoring and smart analytics.

## Technology Stack
- **Runtime**: Node.js v22+
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (workspaces)
- **Backend**: Express.js
- **Frontend**: Next.js (React)
- **Databases**: PostgreSQL (ACID transactions), MongoDB (flexible schemas + app settings)
- **Cache**: Redis
- **LLM Integration**: LiteLLM (unified API for multiple LLM providers)
- **Testing**: node:test, Sinon.js, c8 coverage
- **Build**: tsup (packages), tsx (development)

## App Settings (MongoDB)
Application settings are stored in MongoDB to enable admin configuration without code deployment:
- Feature flags and toggles
- LLM provider settings (model selection, temperature, etc.)
- Exam configuration defaults
- UI/UX customization options
- Rate limits and quotas

## LLM Integration (LiteLLM)
LiteLLM provides a unified interface for AI-augmented features:
- Content authoring assistance
- Question generation and validation
- Analytics and insights
- Supports multiple providers (OpenAI, Anthropic, etc.) via single API

## RCF Framework
This project follows the Requirements Confidence Framework (RCF):
- **PRD-001**: 31 requirements (24 MUST, 5 SHOULD, 1 COULD)
- **User Stories**: 32 user stories with 104 acceptance criteria
- **TAD-001**: 10 architectural decisions
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
apps/
  api-service/             # Main API service (Express.js)
  spa-student/             # Student portal (Next.js)
  spa-admin/               # Admin dashboard (Next.js)
packages/@uat/
  backend-common/          # Shared utilities, middleware, services
  backend-scoring/         # Scoring engine (IRT algorithms)
  backend-integration-tests/  # Test infrastructure
  ui-components/           # Shared React components
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

