# TypeScript Configuration

## Overview

This monorepo uses TypeScript throughout with strict type checking enabled. The configuration is designed to provide maximum type safety while maintaining developer productivity.

## Configuration Hierarchy

### Root Configuration (`tsconfig.json`)

The root TypeScript configuration serves as the base for all packages:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### Package Configurations

Each package extends the root configuration and adds package-specific settings:

**Backend Packages**:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Applications with Dependencies**:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "references": [
    { "path": "../../packages/@wsd-ai-services-wespa/backend-text-to-data" },
    { "path": "../../packages/@wsd-ai-services-wespa/backend-common" }
  ]
}
```

**SPA Configuration**:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Key TypeScript Features

### Strict Mode

All strict mode checks are enabled:

- `strict: true` - Enables all strict type-checking options
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noImplicitReturns: true` - Error when not all code paths return a value
- `noFallthroughCasesInSwitch: true` - Error on fallthrough cases in switch

### Module System

- Using **NodeNext** module resolution for full ESM support
- Supports both `import` and `require` through proper package.json exports
- TypeScript project references for efficient incremental compilation

### Type Declarations

- `declaration: true` - Generate `.d.ts` files for all packages
- `declarationMap: true` - Generate source maps for declarations
- `sourceMap: true` - Generate source maps for debugging

## Build Tools

### tsup

Fast TypeScript bundler for libraries:

```bash
# Build for both ESM and CJS
tsup src/index.ts --format esm,cjs --dts --clean

# Watch mode for development
tsup src/index.ts --format esm,cjs --dts --watch
```

**Features**:

- Zero-config bundling
- Automatic code splitting
- TypeScript declaration generation
- Fast rebuilds with caching

### tsx

Fast TypeScript execution for development:

```bash
# Run TypeScript directly
tsx src/index.ts

# Watch mode with auto-restart
tsx watch src/index.ts
```

**Features**:

- No build step needed
- Fast startup time
- Works with ESM and CJS
- Hot module reloading

## Project References

TypeScript project references allow for:

- Faster incremental builds
- Better editor performance
- Enforced boundaries between packages
- Proper dependency ordering

Applications reference their dependencies:

```json
{
  "references": [
    { "path": "../../packages/@wsd-ai-services-wespa/backend-text-to-data" },
    { "path": "../../packages/@wsd-ai-services-wespa/backend-common" }
  ]
}
```

## Type Safety Best Practices

### 1. Avoid `any`

ESLint warns on explicit `any` usage. Use these alternatives:

```typescript
// Bad
function process(data: any) {}

// Good - Use unknown for truly unknown types
function process(data: unknown) {}

// Better - Use generics
function process<T>(data: T) {}

// Best - Use specific types
function process(data: ProcessableData) {}
```

### 2. Unused Variables

Prefix intentionally unused parameters with `_`:

```typescript
// Bad - ESLint error
function handler(req, res) {}

// Good
function handler(_req: Request, res: Response) {}
```

### 3. Return Types

While not required, explicit return types are recommended for public APIs:

```typescript
// Implicit (okay for internal functions)
function add(a: number, b: number) {
  return a + b;
}

// Explicit (better for exported functions)
export function add(a: number, b: number): number {
  return a + b;
}
```

### 4. Type Imports

Use type-only imports when importing only types:

```typescript
// Regular import
import { SomeType, someFunction } from './module';

// Type-only import
import type { SomeType } from './module';
import { someFunction } from './module';
```

## Common Issues & Solutions

### Issue: Module not found after adding workspace dependency

**Solution**: Run `pnpm install` to link workspace packages.

### Issue: Type errors in editor but build succeeds

**Solution**: Restart TypeScript server in your editor or run `pnpm type-check`.

### Issue: Slow type checking

**Solution**:

1. Ensure `skipLibCheck: true` is set
2. Use project references properly
3. Consider excluding unnecessary files

### Issue: Cannot find module with `.js` extension

**Solution**: When using NodeNext module resolution, import statements must use `.js` extensions even for `.ts` files:

```typescript
// Wrong
import { foo } from './module';

// Correct
import { foo } from './module.js';
```

## Editor Configuration

### VS Code

Recommended extensions:

- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features (built-in)

Settings (`.vscode/settings.json`):

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm/IntelliJ

- Enable TypeScript language service
- Enable ESLint
- Enable Prettier
- Set TypeScript version to project version

## Performance Tips

1. **Use project references** - Faster incremental builds
2. **Enable skipLibCheck** - Skip type checking of declaration files
3. **Exclude unnecessary files** - Don't check node_modules or dist
4. **Use composite mode** - Required for project references
5. **Keep tsconfig files focused** - Only include what's necessary

## Commands

```bash
# Type-check all packages
pnpm type-check

# Type-check specific package
pnpm --filter @wsd-ai-services-wespa/backend-common type-check

# Build all packages
pnpm build

# Build specific package in watch mode
pnpm --filter @wsd-ai-services-wespa/backend-text-to-data dev
```
