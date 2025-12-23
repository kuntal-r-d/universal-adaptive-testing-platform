# Universal Adaptive Testing Platform

A configurable, extensible adaptive testing engine supporting multiple exam methodologies (CAT, LOFT, Linear) with AI-augmented content authoring and smart analytics.

## Features

- **Polymorphic Exam Engine**: Support for Item Adaptive (CAT), Section Adaptive, Linear Fixed, and LOFT algorithms
- **Pluggable Scoring Models**: Rasch, 1PL, 2PL, 3PL IRT models and Classical Test Theory
- **Session State Management**: Full session persistence with resume capability
- **AI-Augmented Content**: LLM-powered question generation with human-in-the-loop validation
- **Smart Coach Analytics**: Gap analysis, velocity prediction, and adaptive remediation
- **Enterprise Security**: Item exposure control, anti-harvesting protection, audit logging

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- Docker & Docker Compose (for databases)

### Installation

```bash
# Clone the repository
git clone https://github.com/kuntal-r-d/universal-adaptive-testing-platform.git
cd universal-adaptive-testing-platform

# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL, MongoDB, Redis)
docker-compose up -d postgres mongodb redis

# Start development server
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build all packages and apps |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:integration` | Run integration tests |
| `pnpm quality` | Run format, lint, and type checks |

## Project Structure

```
├── apps/                    # Deployable applications
│   └── api-service/         # Main API service
├── packages/@uat/           # Shared packages
│   ├── backend-common/      # Shared utilities, middleware
│   ├── backend-scoring/     # IRT scoring algorithms
│   └── backend-integration-tests/
├── docs/                    # RCF Documentation
│   ├── rcf/                 # JSON documents
│   ├── product/             # Requirements (markdown)
│   ├── architecture/        # TAD
│   └── build/               # Build coordination
└── tests/                   # Test files
```

## RCF Methodology

This project follows the **Requirements Confidence Framework (RCF)** for AI-assisted development:

- **PRD-001**: Product Requirements Document (19 requirements)
- **User Stories**: 20 user stories with 60 acceptance criteria
- **Full Traceability**: Every test traces back to requirements

See `docs/RCF-README.md` for detailed methodology documentation.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/exams` | GET/POST | Exam profiles |
| `/api/sessions` | GET/POST | Test sessions |
| `/api/sessions/:id/answer` | POST | Submit answer |
| `/api/sessions/:id/resume` | POST | Resume session |

## Technology Stack

- **Runtime**: Node.js v22+
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (workspaces)
- **Backend**: Express.js
- **Databases**: PostgreSQL, MongoDB
- **Cache**: Redis
- **Testing**: node:test, Sinon.js

## Contributing

1. Follow the RCF methodology for new features
2. Ensure all tests pass: `pnpm test`
3. Run quality checks: `pnpm quality`
4. Add RCF traceability comments to code

## License

MIT

