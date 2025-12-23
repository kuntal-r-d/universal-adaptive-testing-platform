# Monorepo Pattern

## Overview

This project uses a **pnpm monorepo** structure to manage multiple packages and applications within a single repository. This approach allows for better code sharing, dependency management, and streamlined development workflows.

## Structure

```
wsd-ai-services-wespa/
├── apps/
│   ├── api-service/          # Main API service (deployed)
│   └── spa-admin/            # Admin SPA (local development only)
├── packages/
│   └── @wsd-ai-services-wespa/
│       ├── backend-text-to-data/ # Text-to-data conversion services
│       └── backend-common/       # Common backend utilities
├── docs/
│   └── dev/
│       └── patterns/
├── package.json              # Root workspace configuration
└── pnpm-workspace.yaml       # PNPM workspace definition
```

## Architecture

### Packages (`packages/`)

Shared libraries and utilities that can be consumed by multiple applications:

- **backend-text-to-data**: Core text-to-data conversion services and utilities
- **backend-common**: Common backend configurations, utilities, and shared code

### Applications (`apps/`)

Deployable applications that consume the shared packages:

- **api-service**: Main backend API service providing AI-powered text-to-data endpoints
- **spa-admin**: Admin single-page application for local management (not deployed)

## TypeScript & Quality Tools

### TypeScript Setup

The project is fully configured with TypeScript for type safety and better developer experience.

#### Base Configuration

The root `tsconfig.json` provides base compiler options that all packages extend:

- **Target**: ES2022
- **Module**: NodeNext (ESM support)
- **Strict mode**: Enabled
- **Declaration files**: Generated for all packages
- **Source maps**: Enabled for debugging

#### Package-Specific Configurations

Each package/app has its own `tsconfig.json` that extends the base configuration:

- **Packages** (`packages/*`): Configured with `composite: true` for project references
- **Apps** (`apps/*`): Reference their dependencies via TypeScript project references
- **SPA Admin**: Includes DOM libraries and JSX support

### Build Tools

- **tsup**: Fast TypeScript bundler used for building packages
  - Generates ESM and CJS outputs
  - Creates TypeScript declaration files
  - Watch mode for development

- **tsx**: Fast TypeScript execution for development
  - Used in `api-service` for hot-reloading during development
  - No build step needed during development

### Code Quality Tools

#### ESLint

ESLint is configured with TypeScript support for consistent code quality:

- **Parser**: `@typescript-eslint/parser`
- **Plugins**: TypeScript ESLint, Prettier
- **Rules**: Recommended TypeScript rules with Prettier integration
- **Configuration**: `eslint.config.js` (ESLint flat config)

Key rules:

- No unused variables (with `_` prefix exception for intentionally unused vars)
- Explicit any types trigger warnings
- Prettier formatting enforced as errors

#### Prettier

Prettier ensures consistent code formatting across the monorepo:

- **Line width**: 100 characters
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing commas**: Always
- **Tab width**: 2 spaces

Configuration in `.prettierrc.json`

### Quality Commands

```bash
# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Format code with Prettier
pnpm -w format

# Check formatting (CI)
pnpm -w format:check
```

### Package Scripts

Each package includes these scripts:

**Backend Packages** (`packages/*`):

```json
{
  "build": "tsup src/index.ts --format esm,cjs --dts --clean",
  "dev": "tsup src/index.ts --format esm,cjs --dts --watch",
  "lint": "eslint . --max-warnings 0",
  "type-check": "tsc --noEmit"
}
```

**API Service** (`apps/api-service`):

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsup src/index.ts --format esm --clean",
  "lint": "eslint . --max-warnings 0",
  "type-check": "tsc --noEmit"
}
```

## Workspace Configuration

### Root `package.json`

The root `package.json` defines workspace-level scripts that can execute commands across all packages:

```json
{
  "scripts": {
    "dev": "pnpm --filter \"./apps/*\" --parallel dev",
    "build": "pnpm --filter \"./packages/*\" build && pnpm --filter \"./apps/*\" build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "clean": "pnpm -r clean",
    "type-check": "pnpm -r type-check"
  }
}
```

### `pnpm-workspace.yaml`

Defines which directories are part of the workspace:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

## Package Naming Convention

All packages use scoped naming with the `@wsd-ai-services-wespa/` prefix:

- `@wsd-ai-services-wespa/backend-text-to-data`
- `@wsd-ai-services-wespa/backend-common`
- `@wsd-ai-services-wespa/api-service`
- `@wsd-ai-services-wespa/spa-admin`

## Workspace Dependencies

Internal packages can reference each other using the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@wsd-ai-services-wespa/backend-text-to-data": "workspace:*",
    "@wsd-ai-services-wespa/backend-common": "workspace:*"
  }
}
```

This ensures that local packages are always linked during development.

## Common Commands

All commands should be run from the **root directory**.

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start a specific app
pnpm --filter @wsd-ai-services-wespa/api-service dev
```

### Building

```bash
# Build all packages and apps (packages first, then apps)
pnpm build

# Build a specific package
pnpm --filter @wsd-ai-services-wespa/backend-text-to-data build
```

### Testing

```bash
# Run tests across all workspaces
pnpm test

# Test a specific package
pnpm --filter @wsd-ai-services-wespa/backend-common test
```

### Linting & Type Checking

```bash
# Lint all workspaces
pnpm lint

# Type-check all workspaces
pnpm type-check
```

### Quality Checks

```bash
# Run all quality checks (format, lint, type-check, outdated)
pnpm -w quality

# Check for outdated dependencies
pnpm -w outdated

# Update dependencies to latest versions
pnpm -w outdated:update

# Format code
pnpm -w format

# Check formatting (CI)
pnpm -w format:check
```

### Clean

```bash
# Clean build artifacts from all workspaces
pnpm clean
```

## Adding Dependencies

### Add to a specific package

```bash
# Add a dependency to a specific workspace
pnpm --filter @wsd-ai-services-wespa/api-service add express

# Add a dev dependency
pnpm --filter @wsd-ai-services-wespa/api-service add -D typescript
```

### Add to root (workspace-level)

```bash
# Add a dev dependency at the root level
pnpm add -D -w prettier
```

## Benefits

1. **Code Sharing**: Packages can be easily shared between applications
2. **Dependency Management**: Single lock file for all packages ensures consistency
3. **Atomic Changes**: Changes across multiple packages can be committed together
4. **Performance**: pnpm's linking mechanism is faster and more efficient
5. **Type Safety**: TypeScript types are shared seamlessly across packages
6. **Unified Tooling**: Single configuration for linting, testing, and building

## Best Practices

1. **Keep packages focused**: Each package should have a single, well-defined responsibility
2. **Use workspace protocol**: Always use `workspace:*` for internal dependencies
3. **Build order**: Packages must be built before apps that depend on them
4. **Version management**: Keep all packages in sync with the same versioning scheme
5. **Avoid circular dependencies**: Design package boundaries to prevent circular references

## Development Workflow

1. Install dependencies from root: `pnpm install`
2. Make changes to packages or apps
3. Run from root: `pnpm dev` to start development servers
4. Run quality checks: `pnpm -w quality` to ensure code quality
5. Build from root: `pnpm build` before committing
6. Test from root: `pnpm test` to verify changes

## Requirements

- Node.js >= 24.0.0
- pnpm >= 8.0.0

Install pnpm globally if not already installed:

```bash
npm install -g pnpm
```
