# Codebase Architecture Overview

This document provides a template architecture for a **TypeScript pnpm monorepo** following the RCF (Requirements Confidence Framework) methodology.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MONOREPO ROOT                                   │
│                         (pnpm workspace + TypeScript)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DEPLOYABLE APPS                              │    │
│  │                           (apps/)                                    │    │
│  │  ┌─────────────────────┐    ┌─────────────────────┐                 │    │
│  │  │    api-service      │    │     spa-admin       │                 │    │
│  │  │  (Express Backend)  │    │   (Vue/Vite SPA)    │                 │    │
│  │  │                     │    │                     │                 │    │
│  │  │  • API Routes       │    │  • Admin UI         │                 │    │
│  │  │  • Controllers      │    │  • Config Mgmt      │                 │    │
│  │  │  • Config           │    │  • Monitoring       │                 │    │
│  │  │  • Swagger Docs     │    │                     │                 │    │
│  │  └─────────┬───────────┘    └─────────────────────┘                 │    │
│  │            │                                                         │    │
│  └────────────┼─────────────────────────────────────────────────────────┘    │
│               │ depends on                                                   │
│               ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       SHARED PACKAGES                                │    │
│  │                 (packages/@{scope}/)                                 │    │
│  │                                                                      │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │    │
│  │  │  backend-common │  │ backend-text-   │  │ backend-integration │  │    │
│  │  │                 │  │   to-data       │  │      -tests         │  │    │
│  │  │ • Exceptions    │  │                 │  │                     │  │    │
│  │  │ • Logger        │  │ • SQL Sanitizer │  │ • Test Helpers      │  │    │
│  │  │ • Middleware    │  │ • Query Parser  │  │ • Test Server       │  │    │
│  │  │ • DB Services   │  │ • Security      │  │ • Coverage Tools    │  │    │
│  │  │ • Utilities     │  │   Validators    │  │                     │  │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │    │
│  │                                                                      │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure Template

```
project-root/
│
├── 📁 apps/                                 # Deployable applications
│   ├── 📁 api-service/                      # Backend API service
│   │   ├── 📁 src/
│   │   │   ├── 📁 api/
│   │   │   │   ├── 📁 controllers/          # Request handlers
│   │   │   │   ├── 📁 routes/               # Route definitions
│   │   │   │   └── index.ts                 # API aggregator
│   │   │   ├── 📁 config/                   # App configuration
│   │   │   │   ├── index.ts                 # Config exports
│   │   │   │   ├── security.config.ts       # Security settings
│   │   │   │   └── swagger.ts               # API docs config
│   │   │   └── index.ts                     # Entry point
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── 📁 spa-admin/                        # Frontend SPA (optional)
│       ├── 📁 src/
│       ├── package.json
│       └── tsconfig.json
│
├── 📁 packages/                             # Shared libraries
│   └── 📁 @{scope}/                         # Scoped packages
│       │
│       ├── 📁 backend-common/               # Shared backend utilities
│       │   ├── 📁 src/
│       │   │   ├── 📁 classes/              # Custom classes
│       │   │   │   └── exceptions.ts        # Error classes
│       │   │   ├── 📁 middleware/           # Express middleware
│       │   │   │   ├── cors.middleware.ts
│       │   │   │   ├── rate-limiter.middleware.ts
│       │   │   │   ├── request-logger.ts
│       │   │   │   └── security-headers.middleware.ts
│       │   │   ├── 📁 services/             # Shared services
│       │   │   │   ├── cache.ts             # Redis/caching
│       │   │   │   ├── logger.ts            # Pino logger
│       │   │   │   ├── mongodb.ts           # MongoDB client
│       │   │   │   ├── postgres.ts          # PostgreSQL client
│       │   │   │   └── web-server.ts        # Express server factory
│       │   │   ├── 📁 types/                # Shared types
│       │   │   │   └── global.d.ts
│       │   │   ├── 📁 utils/                # Utility functions
│       │   │   └── index.ts                 # Package exports
│       │   ├── 📁 test/
│       │   │   ├── 📁 unit/                 # Unit tests
│       │   │   └── 📁 integration/          # Integration tests
│       │   ├── package.json
│       │   ├── tsconfig.json
│       │   └── tsconfig.build.json
│       │
│       ├── 📁 backend-{feature}/            # Feature-specific package
│       │   ├── 📁 src/
│       │   │   ├── 📁 module/
│       │   │   │   └── 📁 {module-name}/
│       │   │   │       ├── 📁 config/
│       │   │   │       ├── 📁 core/
│       │   │   │       ├── 📁 types/
│       │   │   │       ├── 📁 validators/
│       │   │   │       └── index.ts
│       │   │   └── index.ts
│       │   └── 📁 test/
│       │
│       └── 📁 backend-integration-tests/    # Shared test infrastructure
│           ├── 📁 src/
│           │   ├── 📁 helpers/
│           │   │   ├── test-database.ts
│           │   │   └── test-server.ts
│           │   ├── 📁 coverage/
│           │   └── 📁 generators/
│           └── 📁 test/
│               └── 📁 integration/
│                   └── 📁 api/              # API integration tests
│
├── 📁 docs/                                 # RCF Documentation
│   ├── 📁 rcf/                              # RCF JSON documents
│   │   ├── rcf.manifest.json                # Project manifest
│   │   ├── PRD-001.json                     # Requirements
│   │   ├── PRD-001-user-stories.json        # User stories
│   │   └── PRD-001-tad.json                 # Architecture
│   │
│   ├── 📁 product/                          # Product domain (markdown)
│   │   ├── PRD-001-{Project}-PRODUCT_REQUIREMENTS.md
│   │   └── PRD-001-{Project}-USER-STORIES.md
│   │
│   ├── 📁 architecture/                     # Architecture domain
│   │   └── TAD-001-{Project}.md
│   │
│   └── 📁 build/                            # Build coordination
│       ├── INDEX.md                         # Feature tracker
│       ├── FBS-001-{feature}.md             # Feature build specs
│       └── 📁 patterns/                     # Implementation patterns
│           ├── 📁 api/
│           ├── 📁 code-quality/
│           ├── 📁 data/
│           ├── 📁 error-handling/
│           ├── 📁 observability/
│           ├── 📁 security/
│           └── 📁 testing/
│
├── 📁 scripts/                              # Build/utility scripts
│   ├── docker-build.sh
│   └── generate-version.sh
│
├── 📁 .github/                              # CI/CD
│   ├── 📁 actions/
│   │   └── 📁 setup-environment/
│   └── 📁 workflows/
│       ├── ci-push-pr.yml
│       ├── ci-main.yml
│       └── release.yml
│
├── 📁 .claude/                              # AI assistant commands
│   └── 📁 commands/
│
├── docker-compose.yml                       # Local development
├── docker-compose.ci.yml                    # CI environment
├── Dockerfile                               # Container build
├── pnpm-workspace.yaml                      # Workspace config
├── package.json                             # Root package
├── tsconfig.json                            # Root TS config
├── eslint.config.js                         # Linting
├── .prettierrc.json                         # Formatting
├── .cursorrules                             # Cursor AI rules
├── CLAUDE.md                                # Claude AI context
└── README.md
```

---

## Package Dependency Flow

```
                    ┌─────────────────────────────────┐
                    │          DEPLOYABLE             │
                    │                                 │
                    │  ┌───────────┐  ┌───────────┐  │
                    │  │api-service│  │ spa-admin │  │
                    │  └─────┬─────┘  └───────────┘  │
                    │        │                       │
                    └────────┼───────────────────────┘
                             │
                             │ imports
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                         SHARED PACKAGES                             │
│                                                                     │
│   ┌─────────────────────┐          ┌─────────────────────────┐     │
│   │   backend-common    │◄─────────│   backend-text-to-data  │     │
│   │                     │          │                         │     │
│   │  • Exceptions       │          │  • SQL Sanitizer        │     │
│   │  • Logger           │          │  • Query Validators     │     │
│   │  • DB Services      │          │                         │     │
│   │  • Middleware       │          └─────────────────────────┘     │
│   │  • Utils            │                                          │
│   └─────────────────────┘          ┌─────────────────────────┐     │
│            ▲                       │ backend-integration-    │     │
│            │                       │       tests             │     │
│            └───────────────────────│                         │     │
│                                    │  • Test helpers         │     │
│                                    │  • Test server          │     │
│                                    └─────────────────────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Configuration Files

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/@{scope}/*'
  - 'apps/*'
```

### Root package.json (Key Scripts)

```json
{
  "name": "project-root",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @{scope}/api-service dev",
    "build": "pnpm -r --filter './packages/**' build && pnpm -r --filter './apps/**' build",
    "test:unit": "pnpm -r test:unit",
    "test:integration": "pnpm -r test:integration",
    "test:coverage": "pnpm -r test:coverage",
    "lint": "pnpm -r lint",
    "type-check": "pnpm -r type-check",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "quality": "pnpm format:check && pnpm lint && pnpm type-check"
  }
}
```

### Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## RCF Document Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RCF TRACEABILITY CHAIN                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐                                                   │
│   │      PRD        │  Product Requirements Document                    │
│   │   (REQ-XXX)     │  "What the system must do"                        │
│   └────────┬────────┘                                                   │
│            │                                                            │
│            ▼                                                            │
│   ┌─────────────────┐                                                   │
│   │  User Stories   │  User-focused scenarios                           │
│   │   (US-XXX)      │  "Who, what, why"                                 │
│   └────────┬────────┘                                                   │
│            │                                                            │
│            ▼                                                            │
│   ┌─────────────────┐                                                   │
│   │   Acceptance    │  Testable conditions                              │
│   │    Criteria     │  "Given/When/Then"                                │
│   │   (AC-XXX)      │                                                   │
│   └────────┬────────┘                                                   │
│            │                                                            │
│            ▼                                                            │
│   ┌─────────────────┐                                                   │
│   │   Test Suites   │  Integration/E2E test files                       │
│   │   (TS-XXX)      │  1 file per AC                                    │
│   └────────┬────────┘                                                   │
│            │                                                            │
│            ▼                                                            │
│   ┌─────────────────┐                                                   │
│   │   Test Cases    │  Individual test assertions                       │
│   │   (TC-XXX)      │  Numbered per file                                │
│   └─────────────────┘                                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## App Structure Pattern

### Backend API Service

```
apps/api-service/
├── src/
│   ├── api/
│   │   ├── controllers/           # Request handlers (named exports)
│   │   │   ├── health.controller.ts
│   │   │   └── {feature}.controller.ts
│   │   ├── routes/                # Route definitions
│   │   │   ├── health.ts
│   │   │   └── {feature}.ts
│   │   └── index.ts               # Route aggregator
│   │
│   ├── config/
│   │   ├── index.ts               # getConfig() centralized
│   │   ├── security.config.ts     # Security middleware config
│   │   └── swagger.ts             # OpenAPI configuration
│   │
│   └── index.ts                   # Entry point
│
├── .env.example
├── package.json
└── tsconfig.json
```

### Shared Package Pattern

```
packages/@{scope}/{package-name}/
├── src/
│   ├── classes/                   # Custom classes
│   ├── middleware/                # Express middleware
│   ├── services/                  # Service modules
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Utility functions
│   └── index.ts                   # Barrel exports
│
├── test/
│   ├── unit/                      # Mirrors src/ structure
│   │   ├── classes/
│   │   ├── services/
│   │   └── utils/
│   └── integration/
│
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## Key Conventions

| Area | Convention |
|------|------------|
| **Imports** | Use `.js` extension (NodeNext resolution) |
| **Exports** | Named exports for controllers/services |
| **Types** | Use `type` keyword for type-only imports |
| **Errors** | Always use `Exceptions.convert()` in catch blocks |
| **Logging** | Use `global.logger` (no imports) |
| **Testing** | node:test + Sinon.js, AAA pattern |
| **Dependencies** | `workspace:*` for internal packages |

---

## Quick Start Checklist

- [ ] Initialize pnpm workspace with `pnpm-workspace.yaml`
- [ ] Create root `package.json` with workspace scripts
- [ ] Create root `tsconfig.json` with NodeNext module resolution
- [ ] Set up ESLint + Prettier configuration
- [ ] Create `apps/` directory for deployable services
- [ ] Create `packages/@{scope}/` for shared libraries
- [ ] Set up `docs/` with RCF structure
- [ ] Initialize `docs/rcf/rcf.manifest.json`
- [ ] Create `.github/workflows/` for CI/CD
- [ ] Add `docker-compose.yml` for local development
- [ ] Create `.cursorrules` or `CLAUDE.md` for AI assistance

---

## Technology Stack Summary

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js v24+ |
| **Language** | TypeScript (strict mode) |
| **Package Manager** | pnpm (workspaces) |
| **Backend Framework** | Express.js |
| **Frontend** | Vue/Vite/Vuetify (optional) |
| **Database** | MongoDB, PostgreSQL |
| **Cache** | Redis |
| **Testing** | node:test, Sinon.js, c8 |
| **Linting** | ESLint (flat config) |
| **Formatting** | Prettier |
| **Build** | tsup (packages), tsx (dev) |
| **Container** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
