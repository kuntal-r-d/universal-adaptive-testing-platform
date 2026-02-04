# TAD-001: Universal Adaptive Testing Platform

**Phase:** Phase 1 - B2C Platform
**Version:** 1.0.0
**Status:** Draft
**Created:** 2026-01-02
**PRD Reference:** PRD-001

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architectural Principles](#architectural-principles)
3. [System Components](#system-components)
4. [Data Architecture](#data-architecture)
5. [Integration Architecture](#integration-architecture)
6. [Security Architecture](#security-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [Operational Concerns](#operational-concerns)
9. [Architectural Decisions](#architectural-decisions)
10. [Traceability](#traceability)

---

## System Overview

The Universal Adaptive Testing Platform is a cloud-native adaptive testing system built as a TypeScript pnpm monorepo with microservices architecture. Phase 1 focuses on B2C delivery, enabling individual students to discover, purchase, and take adaptive exams via web and mobile applications.

### Key Characteristics

| Characteristic | Description |
|---------------|-------------|
| **Architecture Style** | Microservices with shared packages |
| **Primary Language** | TypeScript (Node.js + React/Vue) |
| **Secondary Language** | Python (Scoring Service) |
| **Database** | PostgreSQL 16 + Redis 7 |
| **Deployment** | Kubernetes on AWS EKS |
| **CI/CD** | GitHub Actions |

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Client Applications                          │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│   spa-student   │ spa-platform-   │         mobile-app              │
│   (Vue 3)       │ admin (Vue 3)   │      (React Native)             │
└────────┬────────┴────────┬────────┴────────────┬────────────────────┘
         │                 │                      │
         └────────────────┬┴──────────────────────┘
                          │
                 ┌────────▼────────┐
                 │   API Gateway    │
                 │ api.uatplatform  │
                 └────────┬────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
┌────────▼────────┐ ┌────▼─────────┐ ┌────▼─────────┐
│   api-service   │ │   scoring-   │ │   External   │
│   (Express)     │ │   service    │ │   Services   │
│                 │ │   (FastAPI)  │ │   (Stripe,   │
│                 │ │              │ │    Auth0)    │
└────────┬────────┘ └──────────────┘ └──────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│ Postgres│ │ Redis │
│   16    │ │   7   │
└─────────┘ └───────┘
```

---

## Architectural Principles

### 1. Configuration Over Code

Exam rules, scoring algorithms, and stopping criteria are metadata-driven, not hard-coded. This enables rapid deployment of new exam types without code changes.

**Example:**
```json
{
  "examProfile": {
    "methodology": "CAT",
    "scoringModel": "3PL",
    "stoppingCriteria": {
      "type": "SEM",
      "threshold": 0.3,
      "minItems": 20,
      "maxItems": 60
    }
  }
}
```

### 2. Strategy Pattern for Extensibility

New exam types can be added by implementing strategy interfaces without modifying core engine code.

```typescript
interface ScoringStrategy {
  calculateTheta(responses: Response[], params: ItemParams[]): number;
  selectNextItem(theta: number, available: Item[]): Item;
  shouldStop(state: SessionState): boolean;
}
```

### 3. Service Decoupling

Scoring, content, and session services communicate via versioned APIs only. No direct database sharing between services.

### 4. Mobile-First Design

All features work seamlessly across web and mobile with real-time synchronization. APIs are designed to support offline-first mobile patterns.

### 5. Progressive Enhancement

The platform is offline-capable with graceful degradation when connectivity is limited. Exams can be cached and taken offline with sync on reconnect.

---

## System Components

### Applications

#### api-service (Backend)

**Technology:** Node.js / Express / TypeScript
**Port:** 3000

The core REST API service handling all platform operations.

| Responsibility | Description |
|---------------|-------------|
| Exam Sessions | Create, manage, and persist exam sessions |
| Question Delivery | Serve questions with navigation control |
| Authentication | JWT validation and user management |
| Payments | Stripe webhook handling |
| Progress Sync | Coordinate cross-device synchronization |

**Key Endpoints:**

```
POST   /api/v1/sessions          Create new exam session
GET    /api/v1/sessions/:id      Get session state
PATCH  /api/v1/sessions/:id      Update session (submit answer)
POST   /api/v1/sessions/:id/end  Complete exam session

GET    /api/v1/exams             List available exams
GET    /api/v1/exams/:id         Get exam details
GET    /api/v1/exams/:id/preview Get sample questions

GET    /api/v1/users/me/progress Get user progress
GET    /api/v1/users/me/analytics Get detailed analytics
```

#### scoring-service (Backend)

**Technology:** Python / FastAPI
**Port:** 3001

Psychometric scoring service implementing IRT algorithms.

| Algorithm | Description |
|-----------|-------------|
| 1PL (Rasch) | Single-parameter model (difficulty) |
| 2PL | Two-parameter model (difficulty, discrimination) |
| 3PL | Three-parameter model (difficulty, discrimination, guessing) |

**Key Endpoints:**

```
POST   /score/estimate-theta     Calculate ability estimate
POST   /score/select-next-item   Choose optimal next question
POST   /score/evaluate-stopping  Check if exam should end
GET    /score/item-information   Get item information function
```

#### spa-student (Frontend)

**Technology:** Vue 3 / Vite / TypeScript

The student-facing web application providing:

- Exam catalog with search and filters
- Full exam-taking experience
- Progress dashboard with charts
- Post-exam analytics
- Subscription and purchase management

#### spa-platform-admin (Frontend)

**Technology:** Vue 3 / Vite / TypeScript

Platform administrator dashboard for:

- Question bank management (CRUD, bulk operations)
- Exam profile configuration
- User management
- Analytics and reporting
- Content workflow (Draft → Review → Active)

#### mobile-app (Mobile)

**Technology:** React Native / TypeScript

Cross-platform mobile application supporting:

- Exam taking optimized for touch
- Offline exam caching
- Push notifications for study reminders
- Real-time progress sync

### Shared Packages

| Package | Purpose | Key Exports |
|---------|---------|-------------|
| `@uat/backend-common` | Shared utilities | Logger, Exceptions, Middleware |
| `@uat/backend-scoring` | IRT algorithms | RaschStrategy, ThreePLStrategy |
| `@uat/backend-payments` | Stripe integration | SubscriptionManager, PurchaseHandler |
| `@uat/shared-types` | Type definitions | ExamTypes, UserTypes, SessionTypes |

---

## Data Architecture

### PostgreSQL Schema

```sql
-- Core Tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth0_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  methodology VARCHAR(50) NOT NULL, -- CAT, LOFT, LINEAR
  config JSONB NOT NULL, -- Scoring params, stopping rules
  price_cents INTEGER,
  subscription_tier VARCHAR(50), -- basic, premium, unlimited
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content JSONB NOT NULL, -- Flexible question content
  psychometrics JSONB NOT NULL, -- {alpha, beta, gamma}
  tags JSONB NOT NULL, -- Hierarchical tags
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exam_profile_id UUID REFERENCES exam_profiles(id),
  state JSONB NOT NULL, -- Current theta, responses, position
  status VARCHAR(50) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  question_id UUID REFERENCES questions(id),
  response JSONB NOT NULL,
  is_correct BOOLEAN,
  time_taken_ms INTEGER,
  theta_after DECIMAL(5,3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2C Tables
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL, -- basic, premium, unlimited
  status VARCHAR(50) DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exam_profile_id UUID REFERENCES exam_profiles(id),
  stripe_payment_id VARCHAR(255),
  amount_cents INTEGER,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exam_profile_id UUID REFERENCES exam_profiles(id),
  current_theta DECIMAL(5,3),
  topic_scores JSONB,
  last_activity TIMESTAMPTZ,
  sync_token VARCHAR(255) -- For cross-device sync
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status) WHERE status = 'active';
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX idx_audit_logs_session ON audit_logs(session_id);
```

### Redis Data Structures

```
# Active Session State (Hash)
session:{id} → {
  theta: "1.234",
  position: "15",
  remaining_time: "1800000",
  last_activity: "1704200400000"
}
TTL: 4 hours

# Pre-fetched Questions (List)
session:{id}:prefetch → [question_id_1, question_id_2, ...]
TTL: 30 minutes

# Rate Limiting (Counter)
ratelimit:{user_id}:{endpoint} → count
TTL: 60 seconds

# Sync Tokens (String)
sync:{user_id} → "token_value"
TTL: 24 hours
```

---

## Integration Architecture

### External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Stripe** | Payments | REST API + Webhooks |
| **Auth0** | Authentication | OAuth 2.0 / OIDC |
| **SendGrid** | Email | REST API |
| **Firebase** | Push Notifications | Firebase SDK |

### Stripe Integration

```typescript
// Subscription Flow
POST /api/v1/subscriptions/create-checkout
→ Stripe Checkout Session
→ Redirect to Stripe
→ Webhook: checkout.session.completed
→ Activate subscription

// One-Time Purchase Flow
POST /api/v1/purchases/create-checkout
→ Stripe Checkout Session
→ Redirect to Stripe
→ Webhook: checkout.session.completed
→ Grant exam access
```

### Auth0 Integration

```typescript
// Authentication Flow
1. User clicks "Sign In"
2. Redirect to Auth0 Universal Login
3. User authenticates (email, social, MFA)
4. Auth0 redirects back with code
5. Exchange code for tokens
6. Store JWT in HttpOnly cookie
7. Validate JWT on each API request
```

---

## Security Architecture

### Authentication

| Aspect | Implementation |
|--------|---------------|
| Provider | Auth0 |
| Token Type | JWT (RS256) |
| Access Token TTL | 15 minutes |
| Refresh Token TTL | 7 days |
| MFA | Optional (recommended for admins) |

### Authorization

```typescript
enum Role {
  STUDENT = 'student',
  ADMIN = 'admin',
  CONTENT_AUTHOR = 'content_author',
  PSYCHOMETRICIAN = 'psychometrician'
}

// Middleware Example
const requireRole = (role: Role) => (req, res, next) => {
  if (!req.user.roles.includes(role)) {
    throw new ForbiddenError();
  }
  next();
};
```

### Data Protection

| Data Type | Protection |
|-----------|------------|
| In Transit | TLS 1.3 |
| At Rest | AES-256 (AWS RDS encryption) |
| PII | Encrypted columns, access logged |
| Exam Content | Rate-limited, no bulk export |

### Anti-Harvesting Measures

1. **Rate Limiting:** 100 requests/minute per user
2. **Anomaly Detection:** Pattern matching on rapid question access
3. **Exposure Control:** Sympson-Hetter method limits item usage
4. **Audit Logging:** All question accesses logged

---

## Deployment Architecture

### Kubernetes Cluster

```yaml
# Deployment Example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-service
  template:
    spec:
      containers:
      - name: api-service
        image: uatplatform/api-service:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Domain Configuration

| Domain | Application | Purpose |
|--------|-------------|---------|
| `app.uatplatform.com` | spa-student | Student web app |
| `admin.uatplatform.com` | spa-platform-admin | Admin dashboard |
| `api.uatplatform.com` | api-service | REST API |

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test:unit

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t api-service .

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: kubectl apply -f k8s/
```

---

## Operational Concerns

### Monitoring Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Metrics | Prometheus + Grafana | System and business metrics |
| Logging | Pino → CloudWatch | Structured JSON logs |
| Tracing | OpenTelemetry | Distributed request tracing |
| Alerting | PagerDuty | On-call notifications |

### Key Metrics

```
# Latency
api_request_duration_seconds{endpoint="/api/v1/sessions/:id", quantile="0.95"}

# Throughput
api_requests_total{status="200"}

# Business Metrics
exams_completed_total
subscriptions_active_total
```

### SLAs

| Metric | Target |
|--------|--------|
| Next-Item Latency | P95 < 200ms |
| Availability | 99.9% uptime |
| Concurrent Sessions | 10,000 |

### Backup Strategy

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| PostgreSQL | Daily snapshot | 30 days |
| Point-in-Time Recovery | Continuous | 7 days |
| Cross-Region Replication | Async | Real-time |

---

## Architectural Decisions

### ADR-001: Strategy Pattern for Exam Methodologies

**Decision:** Use Strategy design pattern for scoring and item selection algorithms.

**Rationale:** Enables adding new exam types (LSAT, MCAT, etc.) by implementing strategy interfaces without modifying core engine code. Supports REQ-001 (Polymorphic Exam Engine) and REQ-012 (Strategy Pattern Implementation).

**Consequences:**
- (+) Easy to add new exam types
- (+) Testing is simplified (mock strategies)
- (-) Slight complexity increase in dependency injection

---

### ADR-002: PostgreSQL with JSONB for Questions

**Decision:** Store question content in JSONB columns rather than normalized tables.

**Rationale:** Different question types (MCQ, SATA, drag-drop) have different structures. JSONB provides schema flexibility while maintaining ACID compliance. Supports REQ-004 (Dynamic Item Schema) and REQ-019 (ACID Compliance).

**Consequences:**
- (+) No schema migrations for new question types
- (+) Full-text search with GIN indexes
- (-) No foreign key constraints within JSONB

---

### ADR-003: Redis for Session State

**Decision:** Use Redis for active session storage with PostgreSQL as durable backup.

**Rationale:** Sub-200ms latency requirement for next-item selection cannot be met with database round-trips alone. Redis provides in-memory speed with persistence. Supports REQ-002 (Session State Management) and REQ-014 (Next-Item Latency).

**Consequences:**
- (+) Achieves <50ms session reads
- (+) Atomic operations for concurrent updates
- (-) Requires session sync to PostgreSQL

---

### ADR-004: Stripe for Payments

**Decision:** Use Stripe as the exclusive payment processor.

**Rationale:** Industry-standard solution with subscription billing, one-time payments, invoicing, and excellent developer experience. Supports REQ-028 (Subscriptions) and REQ-029 (Purchases).

**Consequences:**
- (+) Reduced PCI compliance scope
- (+) Built-in subscription management
- (-) Platform fees (2.9% + $0.30)

---

### ADR-005: React Native for Mobile

**Decision:** Build mobile app with React Native instead of native iOS/Android.

**Rationale:** Maximizes code sharing with web, strong TypeScript support, and near-native performance. Single codebase for iOS and Android. Supports REQ-030 (Mobile App Support).

**Consequences:**
- (+) 80%+ code reuse
- (+) Faster development velocity
- (-) Some platform-specific code needed

---

### ADR-006: Python for Scoring Service

**Decision:** Implement scoring service in Python with FastAPI instead of Node.js.

**Rationale:** Python ecosystem provides mature statistical libraries (NumPy, SciPy) essential for IRT implementations. FastAPI offers excellent performance and automatic OpenAPI docs. Supports REQ-012 (Strategy Pattern) and REQ-013 (Service Decoupling).

**Consequences:**
- (+) Access to pyirt, catsim libraries
- (+) Familiar to psychometricians
- (-) Additional language in tech stack

---

## Traceability

### Requirements to Architecture Mapping

| Requirement | Architectural Component | ADR |
|-------------|------------------------|-----|
| REQ-001 | Strategy pattern in scoring-service | ADR-001 |
| REQ-002 | Redis session storage | ADR-003 |
| REQ-004 | PostgreSQL JSONB | ADR-002 |
| REQ-012 | ScoringStrategy interface | ADR-001 |
| REQ-013 | Separate scoring-service | ADR-006 |
| REQ-014 | Redis caching | ADR-003 |
| REQ-019 | PostgreSQL transactions | ADR-002 |
| REQ-027 | spa-student catalog | - |
| REQ-028 | Stripe subscriptions | ADR-004 |
| REQ-029 | Stripe payments | ADR-004 |
| REQ-030 | React Native app | ADR-005 |
| REQ-031 | Redis sync tokens | ADR-003 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | Architecture Team | Initial TAD for Phase 1 B2C |