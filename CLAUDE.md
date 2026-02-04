# Claude Code Orchestra

**Multi-Agent Collaboration Framework**

Claude Code integrates Codex CLI (deep reasoning) and Gemini CLI (large-scale research), leveraging each agent's strengths to accelerate development.

---

## Why This Exists

| Agent | Strength | Use For |
|-------|----------|---------|
| **Claude Code** | Orchestration, user interaction | Overall coordination, task management |
| **Codex CLI** | Deep reasoning, design decisions, debugging | Design consultation, error analysis, trade-off evaluation |
| **Gemini CLI** | 1M tokens, multimodal, web search | Codebase-wide analysis, library research, PDF/video processing |

**IMPORTANT**: Tasks difficult for a single agent can be solved through 3-agent collaboration.

---

## Context Management (CRITICAL)

Claude Code context is **200k tokens**, but effectively **70-100k** due to tool definitions, etc.

**YOU MUST** call Codex/Gemini via subagent (when output exceeds 10 lines).

| Output Size | Method | Reason |
|-------------|--------|--------|
| 1-2 sentences | Direct call OK | No overhead needed |
| 10+ lines | **Via subagent** | Protect main context |
| Analysis report | Subagent → save to file | Persist details in `.claude/docs/` |

```
# MUST: Via subagent (large output)
Task(subagent_type="general-purpose", prompt="Consult Codex on design and return summary")

# OK: Direct call (small output only)
Bash("codex exec ... 'Answer in one sentence'")
```

---

## Quick Reference

### When to Use Codex

- Design decisions ("How to implement?" "Which pattern?")
- Debugging ("Why doesn't it work?" "What's causing the error?")
- Comparison ("Which is better, A or B?")

→ Details: `.claude/rules/codex-delegation.md`

### When to Use Gemini

- Research ("Look this up" "What's the latest info?")
- Large-scale analysis ("Understand the entire codebase")
- Multimodal ("Analyze this PDF/video")

→ Details: `.claude/rules/gemini-delegation.md`

---

## Workflow

```
/startproject <feature-name>
```

1. Gemini analyzes repository (via subagent)
2. Claude gathers requirements and creates plan
3. Codex reviews plan (via subagent)
4. Claude creates task list
5. **Post-implementation review in separate session** (recommended)

→ Details: `/startproject`, `/plan`, `/tdd` skills

---

## Tech Stack

- **TypeScript** / **Express.js**
- **npm** or **pnpm** for package management
- **ESLint** + **Prettier** (lint/format) / **tsc** (type check) / **Vitest** (test)
- `npm run lint` / `npm run test` / `npm run build`

→ Details: `.claude/rules/dev-environment.md`

---

## Documentation

| Location | Content |
|----------|---------|
| `.claude/rules/` | Coding, security, language rules |
| `.claude/docs/DESIGN.md` | Design decision records |
| `.claude/docs/research/` | Gemini research results |
| `.claude/logs/cli-tools.jsonl` | Codex/Gemini I/O logs |

---

## Language Protocol

- **Thinking & Code**: English
- **User Communication**: English
