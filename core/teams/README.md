# Plugin Teams

Multi-agent workflows that coordinate specialized agents to accomplish complex tasks. Teams are installed via the Claude Code plugin marketplace and provide slash commands for invocation.

---

## Available Teams

| Team | Agents | Commands | Purpose |
|------|--------|----------|---------|
| [clean-team](./clean-team) | 8 | `/clean-team:audit`, `/clean-team:clean`, `/clean-team:refactor` | Audit, cleanup, and refactoring |
| [implement-team](./implement-team) | 5 | `/implement-team:implement <feature>` | TDD feature implementation |
| [diagnose-team](./diagnose-team) | 5 | `/diagnose-team:diagnose <problem>` | Stubborn bugs and intent-reality gaps |

---

## Clean-Team (8 Agents)

A single continuous pipeline: **clean** (organize, format, audit), **checkpoint** (user confirms), then **refactor** (test, plan, execute, verify).

### Workflow

```
/clean-team:clean [scope]:
  Organizer → Formatter → Auditor → [checkpoint] → Tester → Planner → Challenger → Refactorer → Verifier
                                         ↑                                  ↑              ↑
                                    User confirms                       (Gate 1)       (Gate 2)

/clean-team:refactor [path]:  Resume from existing AUDIT-REPORT.md
  Tester → Planner → Challenger → Refactorer → Verifier

/clean-team:audit [focus]:    Standalone parallel audit
  4-11 sub-agents → AUDIT-REPORT.md
```

### Agents

| Agent | Role | Model |
|-------|------|-------|
| **Organizer** | Audits and fixes project structure (moves, renames, deletes) | Opus |
| **Formatter** | Universal code cleaning + project-type-specific conventions | Opus |
| **Auditor** | Deep analysis: architecture, best practices, metrics → AUDIT-REPORT.md | Opus |
| **Tester** | Assesses coverage, writes safety tests using audit critical paths | Opus |
| **Planner** | Creates prioritized roadmap from audit findings | Opus |
| **Challenger** | Reviews roadmap (Gate 1) — Approve / Revise / Block | Opus |
| **Refactorer** | Executes roadmap slice-by-slice with disciplined commits | Opus |
| **Verifier** | Validates results (Gate 2) — Approve / Route back / Block | Opus |

### Key Features

- **Checkpoint after audit**: User reviews findings summary and confirms before refactoring starts
- **AUDIT-REPORT.md**: Bridge artifact between cleanup and refactoring, consumed by both humans and agents
- **Universal Formatter**: Detects project type, applies universal cleaning + type-specific profiles (web, unity, python, data)
- **Gated execution**: Challenger reviews plans (Gate 1), Verifier validates results (Gate 2)
- **Parallel audit**: Auditor launches 4-12 sub-agents simultaneously via shared roster
- **Standalone audit**: `/clean-team:audit [focus]` with focus modes (css, a11y, perf, structure, etc.)
- **Analysis scripts**: Python scripts for complexity, dependency, and dead code analysis
- **Design system checker**: 36-rule linter for CSS, HTML, and JS

### Analysis Scripts

```bash
python scripts/analyze_complexity.py <path>     # Find high-complexity functions
python scripts/analyze_dependencies.py <path>   # Map circular dependencies
python scripts/detect_dead_code.py <path>       # Find unused code
node scripts/check.js                           # Design system compliance (36 rules)
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

Both types benefit from the same workflow — closing the intent-reality gap.

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
claude plugin install implement-team
claude plugin install diagnose-team
```

## Usage

```bash
# Full pipeline: clean + audit + checkpoint + refactor
/clean-team:clean src/

# Resume refactoring from existing audit report
/clean-team:refactor src/

# Standalone audit with optional focus
/clean-team:audit css

# TDD implementation
/implement-team:implement "Add user authentication with OAuth2"

# Diagnose stubborn bugs
/diagnose-team:diagnose "search results aren't filtering correctly"
```

---

## When to Use Which Team

| Situation | Team |
|-----------|------|
| Quick codebase health check | clean-team (`/clean-team:audit`) |
| Focused audit (CSS, a11y, perf, structure) | clean-team (`/clean-team:audit [focus]`) |
| Quick codebase tidying | clean-team (`/clean-team:clean`) |
| CSS file sprawl (>5 files) | clean-team (`/clean-team:clean`) |
| Existing codebase needs deep refactoring | clean-team (`/clean-team:clean`) |
| Legacy code modernization | clean-team (`/clean-team:clean`) |
| New feature implementation | implement-team |
| Bug fix with design decisions | implement-team |
| Security-sensitive features | implement-team (triggers Security agent) |
| Stubborn bug that won't stay fixed | diagnose-team |
| "It works but not how I wanted" | diagnose-team |
| Root cause is unclear after multiple attempts | diagnose-team |

---

## Design Philosophy

### Agent Principles
- **Separation of concerns**: Each agent has one clear job
- **Gated decisions**: Quality gates at planning and verification stages
- **Loop limits**: Max 2 cycles to prevent infinite loops
- **Early exits**: Stop early if work isn't needed
- **Rich context handoffs**: Full context passed between agents
- **Autonomous execution**: Minimal user interruption
