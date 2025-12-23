# Code Quality

## Overview

This project maintains high code quality standards through automated tooling, consistent formatting, and strict type checking. All quality checks are enforced in the development workflow and can be run locally before committing.

## Quick Reference

```bash
# Run all quality checks (recommended before committing)
pnpm -w quality

# Individual checks
pnpm -w format:check      # Check code formatting
pnpm lint              # Lint all code
pnpm type-check        # Type-check TypeScript
pnpm -w outdated          # Check for outdated dependencies
pnpm test              # Run tests
```

## Quality Tools

### 1. Prettier - Code Formatting

**Purpose**: Ensures consistent code style across the entire codebase.

**Configuration**: `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Commands**:

```bash
# Format all files
pnpm -w format

# Check formatting (CI/pre-commit)
pnpm -w format:check

# Format specific files
prettier --write "apps/api-service/**/*.ts"
```

**Formatting Rules**:

- **Line length**: 100 characters maximum
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at end of statements
- **Trailing commas**: Always use in multi-line structures
- **Arrow functions**: Always wrap parameters in parentheses
- **Line endings**: LF (Unix-style)
- **Tabs**: Use 2 spaces, not tabs

**Editor Integration**:

Most editors support format-on-save. Configure your editor:

- **VS Code**: Install "Prettier - Code formatter" extension
- **WebStorm**: Built-in Prettier support
- **Vim/Neovim**: Use vim-prettier or conform.nvim

### 2. ESLint - Code Linting

**Purpose**: Catches bugs, enforces best practices, and maintains code quality.

**Configuration**: `eslint.config.js` (Flat Config)

**Key Rules**:

- **TypeScript strict rules**: Enforced via `@typescript-eslint/eslint-plugin`
- **No unused variables**: Error (except prefixed with `_`)
- **No explicit `any`**: Warning (use `unknown` or specific types)
- **Prettier integration**: Formatting issues treated as errors
- **Console statements**: Allowed (we suppress no-console)

**Commands**:

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @wsd-ai-services-wespa/api-service lint

# Auto-fix issues
pnpm --filter @wsd-ai-services-wespa/api-service lint --fix
```

**Zero Warnings Policy**:

All packages use `--max-warnings 0` to ensure warnings are addressed immediately. This prevents technical debt accumulation.

**Common Issues**:

```typescript
// ❌ Bad - unused variable
function handler(req, res) {
  return res.json({ status: 'ok' });
}

// ✅ Good - prefix unused with _
function handler(_req, res) {
  return res.json({ status: 'ok' });
}

// ❌ Bad - explicit any
function process(data: any) {
  return data.value;
}

// ✅ Good - use unknown or specific type
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
}

// ✅ Better - use generics
function process<T extends { value: string }>(data: T) {
  return data.value;
}
```

### 3. TypeScript - Type Checking

**Purpose**: Provides static type analysis to catch type errors before runtime.

**Configuration**: `tsconfig.json` (root) + package-specific configs

**Strict Mode**: All strict checks enabled

- `strict: true` - All strict type-checking options
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused parameters
- `noImplicitReturns: true` - All code paths must return
- `noFallthroughCasesInSwitch: true` - No fallthrough in switch statements

**Commands**:

```bash
# Type-check all packages
pnpm type-check

# Type-check specific package
pnpm --filter @wsd-ai-services-wespa/backend-common type-check

# Type-check with watch mode
cd packages/@wsd-ai-services-wespa/backend-common && tsc --noEmit --watch
```

**Best Practices**:

1. **Explicit return types for public APIs**:

   ```typescript
   // ✅ Good
   export function calculateTotal(items: Item[]): number {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   ```

2. **Use type guards**:

   ```typescript
   function isUser(value: unknown): value is User {
     return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
   }
   ```

3. **Leverage utility types**:
   ```typescript
   type PartialUser = Partial<User>;
   type RequiredUser = Required<User>;
   type UserKeys = keyof User;
   type UserValues = User[keyof User];
   ```

### 4. Dependency Management

**Purpose**: Keep dependencies up-to-date and secure.

**Commands**:

```bash
# Check for outdated dependencies
pnpm -w outdated

# Update all dependencies to latest (within semver ranges)
pnpm update -r

# Update all dependencies to absolute latest versions
pnpm -w outdated:update

# Check for security vulnerabilities
pnpm audit

# Fix security vulnerabilities
pnpm audit --fix
```

**Outdated Dependencies Strategy**:

1. **Regular checks**: Run `pnpm -w outdated` weekly
2. **Review changes**: Check changelogs before updating major versions
3. **Test thoroughly**: Run full test suite after updates
4. **Update incrementally**: Don't update everything at once
5. **Pin critical versions**: Use exact versions for critical dependencies

**Dependency Version Ranges**:

- `^1.2.3` - Compatible with 1.x.x (allow minor and patch)
- `~1.2.3` - Compatible with 1.2.x (allow patch only)
- `1.2.3` - Exact version (no updates)

**Workspace Dependencies**:

Always use `workspace:*` for internal dependencies:

```json
{
  "dependencies": {
    "@wsd-ai-services-wespa/backend-common": "workspace:*"
  }
}
```

## Comprehensive Quality Check

The `quality` command runs all checks in sequence:

```bash
pnpm -w quality
```

This command executes:

1. **Format check** (`pnpm -w format:check`) - Verifies code formatting
2. **Lint** (`pnpm lint`) - Checks code quality and style
3. **Type check** (`pnpm type-check`) - Validates TypeScript types
4. **Outdated check** (`pnpm -w outdated`) - Shows outdated dependencies

**Use this command**:

- Before committing code
- Before creating pull requests
- As part of CI/CD pipeline
- After pulling latest changes

## Pre-commit Workflow

**Recommended workflow before committing**:

```bash
# 1. Format code
pnpm -w format

# 2. Run quality checks
pnpm -w quality

# 3. Build to ensure no build errors
pnpm build

# 4. Run tests
pnpm test

# 5. Commit if all checks pass
git add .
git commit -m "Your commit message"
```

**Pro Tip**: Use a git pre-commit hook to automate checks:

```bash
# .git/hooks/pre-commit
#!/bin/sh
pnpm -w quality && pnpm build
```

## Continuous Integration (CI)

**Recommended CI pipeline**:

```yaml
# Example GitHub Actions workflow
steps:
  - name: Install dependencies
    run: pnpm install --frozen-lockfile

  - name: Check formatting
    run: pnpm -w format:check

  - name: Lint
    run: pnpm lint

  - name: Type check
    run: pnpm type-check

  - name: Build
    run: pnpm build

  - name: Test
    run: pnpm test

  - name: Check outdated dependencies
    run: pnpm -w outdated || true # Don't fail on outdated deps

  - name: Security audit
    run: pnpm audit --audit-level moderate
```

## IDE Configuration

### VS Code

**Recommended Extensions**:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter (`esbenp.prettier-vscode`)
- TypeScript and JavaScript Language Features (built-in)

**Settings** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.eol": "\n"
}
```

### WebStorm / IntelliJ IDEA

**Configuration**:

1. **Prettier**:
   - Enable: Settings → Languages & Frameworks → JavaScript → Prettier
   - Check "On save" and "On code reformat"

2. **ESLint**:
   - Enable: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
   - Set "Run eslint --fix on save"

3. **TypeScript**:
   - Use project TypeScript version: Settings → Languages & Frameworks → TypeScript
   - Enable TypeScript Language Service

## Code Review Checklist

When reviewing code, verify:

- [ ] Code is formatted with Prettier
- [ ] No ESLint warnings or errors
- [ ] TypeScript compiles without errors
- [ ] No unused imports or variables
- [ ] No `any` types (unless absolutely necessary)
- [ ] Functions have clear, descriptive names
- [ ] Complex logic has explanatory comments
- [ ] New dependencies are justified
- [ ] Tests are included for new features
- [ ] Documentation is updated

## Quality Metrics

**Target metrics**:

- ✅ **Zero linting warnings**
- ✅ **Zero type errors**
- ✅ **100% formatted code**
- ✅ **No critical security vulnerabilities**
- 🎯 **< 5 outdated major dependencies**
- 🎯 **Test coverage > 80%** (when tests are implemented)

## Troubleshooting

### Format check fails but files look correct

**Issue**: Line ending differences (CRLF vs LF)

**Solution**:

```bash
# Configure git to use LF
git config core.autocrlf false
git config core.eol lf

# Re-clone or reset files
pnpm -w format
```

### ESLint shows errors for valid TypeScript

**Issue**: ESLint parser not recognizing TypeScript features

**Solution**:

1. Check `@typescript-eslint/parser` is installed
2. Verify `eslint.config.js` is properly configured
3. Restart your editor's ESLint server

### Type errors in editor but `tsc` succeeds

**Issue**: Editor using wrong TypeScript version

**Solution**:

- **VS Code**: CMD/CTRL + Shift + P → "TypeScript: Select TypeScript Version" → "Use Workspace Version"
- **WebStorm**: Settings → TypeScript → Use project TypeScript

### Outdated check exits with error

**Issue**: `pnpm -w outdated` exits with code 1 when packages are outdated

**Note**: This is expected behavior. In CI, use `pnpm -w outdated || true` to not fail the pipeline.

## Best Practices Summary

1. **Run `pnpm -w quality` before every commit**
2. **Format code automatically on save**
3. **Fix linting warnings immediately**
4. **Use strict TypeScript settings**
5. **Check for outdated dependencies weekly**
6. **Run security audits regularly**
7. **Keep the quality bar high** - Don't compromise on quality for speed
8. **Review code quality in pull requests**
9. **Automate quality checks in CI/CD**
10. **Document quality standards for the team**

## Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [pnpm Documentation](https://pnpm.io/)
- [Node Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
