# Plugin Teams

Multi-agent workflows that coordinate specialized agents to accomplish complex tasks. Teams are installed via the Claude Code plugin marketplace and provide slash commands for invocation.

---

## Available Teams

| Team | Agents | Command | Purpose |
|------|--------|---------|---------|
| [clean-team](./clean-team) | 4 | `/clean-team:clean [scope]` | Codebase hygiene and CSS consolidation |
| [refactor-team](./refactor-team) | 7 | `/refactor-team:refactor [path]` | Code refactoring with safety gates |
| [implement-team](./implement-team) | 5 | `/implement-team:implement <feature>` | TDD feature implementation |
| [diagnose-team](./diagnose-team) | 5 | `/diagnose-team:diagnose <problem>` | Stubborn bugs and intent-reality gaps |

---

## Clean Team (4 Agents)

A codebase hygiene workflow that organizes structure, cleans UI code, polishes remaining issues, and verifies results.

### Workflow

```
Organizer → Stylist → Polisher → Verifier
```

### Agents

| Agent | Role | Model |
|-------|------|-------|
| **Organizer** | Audits and fixes project structure (moves, renames, deletes) | Opus |
| **Stylist** | Cleans UI code, enforces CSS ≤5 files, fixes HTML semantics | Opus |
| **Polisher** | Removes dead code, extracts constants, flags risky changes | Opus |
| **Verifier** | Runs tests, generates CLEANUP-REPORT.md with before/after metrics | Opus |

### Key Features

- **CSS consolidation**: Stylist enforces ≤5 CSS files for vanilla CSS projects
- **Commit per agent**: Each agent commits its changes before handoff
- **Skip conditions**: Stylist skips if no web files exist
- **Verification report**: CLEANUP-REPORT.md with metrics comparison

### When to Use

| Situation | Use Clean Team |
|-----------|---------------|
| Before major work | Start with a clean codebase |
| After organic growth | Clean up accumulated mess |
| Before handoff | Leave codebase navigable for next developer |
| CSS file sprawl | Consolidate to 5-file structure |

---

## Refactor Team (7 Agents)

A comprehensive refactoring workflow that explores, researches, tests, plans, challenges, executes, and verifies code improvements.

### Workflow

```
Explorer → Researcher → Tester → Planner → Challenger → Refactorer → Verifier
                                              ↑              ↓
                                           (Gate 1)      (Gate 2)
```

### Agents

| Agent | Role | Model |
|-------|------|-------|
| **Explorer** | Deep-dives into codebase, documents architecture, patterns, and improvement areas | Opus |
| **Researcher** | Identifies best practices for the project type, prioritizes recommendations | Opus |
| **Tester** | Assesses test coverage, identifies gaps, writes safety net tests | Opus |
| **Planner** | Creates prioritized refactoring roadmap organized into Small → Medium → Large phases | Opus |
| **Challenger** | Reviews roadmap for feasibility (Gate 1) - Approve / Revise / Block | Opus |
| **Refactorer** | Executes roadmap slice-by-slice with disciplined commits | Opus |
| **Verifier** | Validates results and measures improvement (Gate 2) - Approve / Route back / Block | Opus |

### Skills (6)

The refactor-team includes a comprehensive skills library that agents inherit:

| Skill | Contents |
|-------|----------|
| **code-quality** | TDD checklist, naming patterns, testing pyramid, complexity metrics |
| **architecture** | Module boundaries, design patterns, migration patterns, decision records |
| **design** | Semantic HTML, accessibility, CSS formatting, responsive breakpoints |
| **security** | OWASP Top 10, input validation, auth patterns, threat modeling |
| **documentation** | SemVer guide, changelog format, feature specs, module templates |
| **code-standards** | Language-specific standards (JavaScript, Python, SQL, testing) |

### Gating Logic

- **Gate 1 (Challenger)**: Reviews plan before execution. Max 2 revision cycles.
- **Gate 2 (Verifier)**: Confirms behavior unchanged, measures improvement. Max 2 fix cycles.
- **Early exits**: Workflow can stop early if codebase already follows best practices.

### Analysis Scripts

```bash
python scripts/analyze_complexity.py <path>     # Find high-complexity functions
python scripts/analyze_dependencies.py <path>   # Map circular dependencies
python scripts/detect_dead_code.py <path>       # Find unused code
```

---

## Implement Team (5 Agents)

A TDD implementation workflow that plans features, challenges the plan, implements with strict test-first discipline, and optionally reviews for security and structural issues.

### Workflow

```
Planner → Challenger → Implementor → Challenger → [Security] → [Refactorer] → Ship
             ↑             ↑             ↓             ↓
          (Gate 1)      (Gate 2)    (conditional)  (conditional)
```

### Agents

| Agent | Role | Model |
|-------|------|-------|
| **Planner** | Decomposes requests into 1-3 vertical slices with testable acceptance criteria | Sonnet |
| **Challenger** | Reviews plans (Gate 1) and diffs (Gate 2) through 3 lenses: Security, Complexity, Reliability | Sonnet |
| **Implementor** | Strict TDD executor - failing tests first, minimal code, refactor | Sonnet |
| **Security** | Threat modeling for high-stakes code (auth, payments, PII, multi-tenant) | Sonnet |
| **Refactorer** | Improves code structure without behavior change | Sonnet |

### Double Challenger Gate

The Challenger fires twice per feature:

1. **Plan Review (Gate 1)**: Evaluates the plan before any code is written
2. **Diff Review (Gate 2)**: Evaluates the implementation before shipping

Decisions: **Ship** / **Ship with fixes** / **Stop-ship**

### Conditional Agents

- **Security Agent**: Invoked when work touches auth, payments, PII, multi-tenant, public endpoints, file handling, or infra changes
- **Refactorer Agent**: Invoked when Challenger flags structural issues (god files, poor naming, duplication)

### TDD Discipline

The Implementor follows strict Red-Green-Refactor:

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve without changing behavior

No new behavior without a failing test. Ever.

---

## Diagnose Team (5 Agents)

A diagnostic workflow for when normal approaches fail. Handles stubborn bugs and implementation mismatches by systematically closing the gap between **intent** (what the user wants) and **reality** (what the code does).

### When to Use

- You've tried multiple times and it's still wrong
- Something works but not the way you envisioned
- The root cause is unclear
- Previous fixes addressed symptoms but the problem returned
- "Close but not quite"

### Workflow

```
Clarifier → Investigator → Hypothesizer → Resolver → Validator
                                                         ↑
                                                      (Gate)
```

### Agents

| Agent | Role | Model |
|-------|------|-------|
| **Clarifier** | Entry point. Nails down what the user actually wants vs what's happening | Opus |
| **Investigator** | Traces execution to find WHERE reality diverges from intent | Opus |
| **Hypothesizer** | Generates and tests theories about WHY the divergence happens | Opus |
| **Resolver** | Implements the minimal fix using TDD discipline | Opus |
| **Validator** | Final gate. Confirms the fix satisfies user intent (not just tests) | Opus |

### Two Problem Types

**Type 1: Bug** — Something is objectively broken. Code should do X but does Y.

**Type 2: Mismatch** — Code works as built, but that's not what the user wanted. The spec was wrong or intent was misunderstood.

Both types benefit from the same workflow—closing the intent-reality gap.

### Key Principles

1. **Intent Over Tests**: Tests prove code behavior. This team proves user satisfaction.
2. **Root Cause Over Symptoms**: If the bug keeps coming back, previous fixes addressed symptoms.
3. **Minimal Change**: Smallest fix that addresses the root cause.
4. **Test First**: No fix without a failing test.
5. **User Confirmation Required**: Validator gets explicit user confirmation.

### Gating Logic

**Validator Gate:**
- **APPROVE**: Intent satisfied, problem resolved
- **REVISE**: Close but not quite, route back to Resolver (max 2 rounds)
- **ESCALATE**: Fundamentally wrong, needs manual intervention

---

## Installation

```bash
# Add marketplace (one-time)
claude plugin marketplace add https://github.com/AlexanderStephenThompson/claude-hub

# Install teams
claude plugin install clean-team
claude plugin install refactor-team
claude plugin install implement-team
claude plugin install diagnose-team
```

## Usage

```bash
# Clean up codebase structure and UI code
/clean-team:clean src/

# Full 7-agent refactoring workflow
/refactor-team:refactor src/

# Full 5-agent TDD implementation
/implement-team:implement "Add user authentication with OAuth2"

# Diagnose stubborn bugs or implementation mismatches
/diagnose-team:diagnose "search results aren't filtering correctly"
```

---

## How Agent Invocation Works

Commands don't use special syntax to invoke agents. Instead:

1. **Automatic delegation**: Claude reads agent `description` fields and delegates when the task matches
2. **Natural language**: "Use the X agent to..." requests work
3. **Sequential flow**: One agent completes → returns context → next agent invoked

The `@explorer` and `@researcher` text in command files are **descriptive instructions**, not programmatic invocations. Claude reads these as guidance and uses its built-in delegation system.

---

## Design Philosophy

### Agent Principles
- **Separation of concerns**: Each agent has one clear job
- **Gated decisions**: Quality gates at planning and verification stages
- **Loop limits**: Max 2 cycles to prevent infinite loops
- **Early exits**: Stop early if work isn't needed
- **Rich context handoffs**: Full context passed between agents
- **Autonomous execution**: Minimal user interruption

### When to Use Which Team

| Situation | Team |
|-----------|------|
| Quick codebase tidying | clean-team |
| CSS file sprawl (>5 files) | clean-team |
| Project structure is messy | clean-team |
| Existing codebase needs deep refactoring | refactor-team |
| Legacy code modernization | refactor-team |
| New feature implementation | implement-team |
| Bug fix with design decisions | implement-team |
| Code structure improvements | refactor-team |
| Security-sensitive features | implement-team (triggers Security agent) |
| Stubborn bug that won't stay fixed | diagnose-team |
| "It works but not how I wanted" | diagnose-team |
| Root cause is unclear after multiple attempts | diagnose-team |
