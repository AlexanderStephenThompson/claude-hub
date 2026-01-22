# Refactor Team Plugin

**Version 2.0.0** — Comprehensive skills library

A 7-agent refactoring team for Claude Code that explores, researches, tests, plans, challenges, executes, and verifies code improvements. Powered by 6 specialized skills covering code quality, architecture, design, security, documentation, and language standards.

## The Team

```
Explorer → Researcher → Tester → Planner → Challenger → Refactorer → Verifier
```

| Agent | Role | Model | Color |
|-------|------|-------|-------|
| **Explorer** | Deep dives into codebase, documents what exists | Opus | 🟢 Green |
| **Researcher** | Identifies best practices for project type | Opus | 🔵 Blue |
| **Tester** | Assesses coverage, writes safety tests | Opus | 🟣 Purple |
| **Planner** | Creates prioritized refactoring roadmap | Opus | 🟠 Orange |
| **Challenger** | Reviews roadmap for feasibility (Gate 1) | Opus | 🔴 Red |
| **Refactorer** | Executes roadmap with discipline | Opus | 🟢 Green |
| **Verifier** | Validates results, measures improvement (Gate 2) | Opus | 🟣 Purple |

## Prerequisites

- **Git** — Required for safe refactoring (version control)
- **Python 3.8+** — Required for analysis scripts

## Installation

```bash
# Load for a single session (from parent directory)
claude --plugin-dir ./refactor-team

# Or with full path
claude --plugin-dir "path/to/refactor-team"

# Validate plugin structure
claude plugin validate ./refactor-team
```

## Quick Start

```bash
# Run the full 7-agent workflow
/refactor-team:refactor src/

# Or invoke individual agents
@explorer src/
@researcher  # after explorer completes
@tester      # after researcher completes
# ... and so on
```

## How It Works

### Autonomous Execution

The workflow runs autonomously with minimal user interruption. You'll only be asked questions if there's a true blocker.

### Gated Decisions

Two quality gates ensure safety:

1. **Challenger Gate** (after planning)
   - Reviews roadmap for feasibility
   - Approve → execution proceeds
   - Revise → planner adjusts (max 2 cycles)
   - Block → work stops

2. **Verifier Gate** (after execution)
   - Confirms behavior unchanged
   - Measures clarity improvement
   - Approve → complete
   - Route back → targeted fixes (max 2 cycles)
   - Block → work stops

### Early Exits

The workflow can exit early if:
- Explorer finds codebase already follows best practices
- Researcher confirms already compliant with standards
- Tester finds critical areas that can't be safely tested (asks user whether to proceed with risk)

## Components

### Agents (7)

All in `agents/`:
- `explorer.md` — Codebase understanding
- `researcher.md` — Best practices research
- `tester.md` — Coverage assessment
- `planner.md` — Roadmap creation
- `challenger.md` — Feasibility review
- `refactorer.md` — Disciplined execution
- `verifier.md` — Results validation

### Commands (1)

- `/refactor-team:refactor [path]` — Run full workflow

### Skills (6)

Comprehensive skill library for code quality:

| Skill | Purpose |
|-------|---------|
| **code-quality** | TDD, complexity metrics, naming conventions, pattern detection |
| **architecture** | 3-tier layering, module boundaries, dependency rules |
| **design** | Design tokens, semantic HTML, CSS formatting, accessibility |
| **security** | OWASP Top 10, input validation, auth patterns, threat modeling |
| **documentation** | SemVer, changelog format, feature specs, module templates |
| **code-standards** | Language-specific standards (JS, Python, SQL, testing) |

**Skills inheritance by agent:**

| Agent | Inherits | Why |
|-------|----------|-----|
| Explorer | architecture, code-quality | Understands structure and quality |
| Researcher | code-quality, architecture | Knows standards and patterns |
| Tester | code-quality | Follows TDD and testing best practices |
| Planner | code-quality, architecture, security | Plans with security awareness |
| Challenger | code-quality, architecture, security | Reviews for security risks |
| Refactorer | code-quality, design | Executes with clean design patterns |
| Verifier | code-quality, documentation | Validates docs and quality |

### Scripts (3)

Analysis tools in `scripts/`:
- `analyze_complexity.py` — Find high-complexity functions
- `detect_dead_code.py` — Find unused code
- `analyze_dependencies.py` — Map circular dependencies

**Usage:**
```bash
python scripts/analyze_complexity.py <path> --format text
python scripts/analyze_dependencies.py <path> --format text
python scripts/detect_dead_code.py <path> --format text
```

## Workflow Phases

### Phase 1: Understanding (Explorer + Researcher)

- Explorer maps architecture, modules, patterns
- Researcher identifies best practices for project type
- Light observations flagged for deeper analysis

### Phase 2: Safety Net (Tester)

- Assess current test coverage
- Identify critical gaps
- Write characterization tests if needed
- Establish safety net for refactoring

### Phase 3: Planning (Planner + Challenger)

- Synthesize all findings into roadmap
- Organize into phases: Small → Medium → Large
- Break into specific, actionable slices
- Challenger reviews for feasibility

### Phase 4: Execution (Refactorer)

Executes the roadmap in three ordered phases:

| Phase | Target | Risk | Commit Strategy |
|-------|--------|------|-----------------|
| **Small** | Naming, docs, dead code removal | Low | 1 commit per slice |
| **Medium** | Folder reorg, module extraction | Medium | Multiple commits per slice |
| **Large** | Architecture, state management | High | Many commits per slice |

- Execute slices in order (dependencies respected)
- Test after every slice
- Maintain clean git history

### Phase 5: Verification (Verifier)

- Confirm behavior unchanged (tests prove)
- Measure semantic clarity improvement
- Before/after comparison
- Final approval decision

## File Structure

```
refactor-team/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest (v2.0.0)
├── agents/
│   ├── explorer.md              # Step 1: Understand
│   ├── researcher.md            # Step 2: Research
│   ├── tester.md                # Step 3: Test coverage
│   ├── planner.md               # Step 4: Plan
│   ├── challenger.md            # Step 5: Review (Gate 1)
│   ├── refactorer.md            # Step 6: Execute
│   └── verifier.md              # Step 7: Verify (Gate 2)
├── commands/
│   └── refactor.md              # Full workflow command
├── scripts/
│   ├── analyze_complexity.py
│   ├── analyze_dependencies.py
│   └── detect_dead_code.py
└── README.md
```

**Note:** Skills (code-quality, architecture, design, etc.) are shared across all teams and live at the repository root in `skills/`. They are deployed to `~/.claude/skills/` and referenced by agents via their frontmatter.

## Design Principles

### Agent Philosophy

- **Separation of concerns** — Each agent has one job
- **Gated decisions** — Quality gates at planning and verification
- **Loop limits** — Max 2 cycles to prevent infinite loops
- **Early exits** — Stop early if codebase is already clean
- **Rich context handoffs** — Full context passed forward
- **Autonomous execution** — Minimal user interruption

### Skills Architecture

- **Layered inheritance** — Agents inherit only skills relevant to their role
- **Reference materials** — Deep-dive guides for standards and patterns
- **Actionable assets** — Templates and checklists for consistent execution
- **Automated scripts** — Python tools for analysis and validation
- **Domain coverage** — Quality, architecture, design, security, documentation, standards

## Author

Alexander Thompson — Information Designer & Systems Thinker
