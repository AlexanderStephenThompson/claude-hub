# Implement Team Plugin

**Version 1.0.0** — Strict TDD Implementation Workflow

A 5-agent implementation team for Claude Code that plans, challenges, implements with strict TDD, reviews security, and refactors. Fully automated with gated decisions at planning and implementation stages.

## The Team

```
Planner --> Challenger --> Implementor --> Challenger --> Security/Refactorer --> Ship
```

| Agent | Role | Model | Color |
|-------|------|-------|-------|
| **Planner** | Decomposes requests into testable slice plans | Sonnet | Red |
| **Challenger** | Reviews plans and diffs for quality (Gates) | Sonnet | Orange |
| **Implementor** | Executes plans with strict TDD discipline | Sonnet | Green |
| **Security** | Reviews security-sensitive changes | Sonnet | Purple |
| **Refactorer** | Improves structure without behavior change | Sonnet | Blue |

## Prerequisites

- **Git** — Required for version control
- **Test framework** — Project must have a working test suite

## Installation

```bash
# Load for a single session (from parent directory)
claude --plugin-dir ./implement-team

# Or with full path
claude --plugin-dir "path/to/implement-team"

# Validate plugin structure
claude plugin validate ./implement-team
```

## Quick Start

```bash
# Run the full 5-agent workflow
/implement-team:implement "Add user authentication with JWT tokens"

# Or invoke individual agents
@planner "Add search to the dashboard"
@challenger  # after planner completes
@implementor # after challenger approves
# ... and so on
```

## How It Works

### Autonomous Execution

The workflow runs autonomously with minimal user interruption. You'll only be asked questions if there's a true blocker or a Stop-ship decision.

### Gated Decisions

Two quality gates ensure safety:

1. **Plan Review Gate** (after planning)
   - Challenger reviews slice plan for feasibility
   - Ship -> implementation proceeds
   - Ship with fixes -> planner adjusts (max 2 cycles)
   - Stop-ship -> work stops, user asked for missing info

2. **Diff Review Gate** (after implementation)
   - Challenger reviews code changes
   - Ship -> continue to security/refactor or finalize
   - Ship with fixes -> implementor fixes (max 2 cycles)
   - Stop-ship -> work stops

### Early Exit: Trivial Requests

For trivial changes (single-line fix, typo correction):
- Skip full planning workflow
- Implement directly with TDD discipline
- Quick diff review by Challenger
- Ship

### Conditional Steps

**Security Review** — Triggered when work touches:
- Authentication, authorization, sessions, tokens
- Payments or financial flows
- PII or regulated data
- Multi-tenant boundaries
- Publicly exposed endpoints
- File upload/download, template rendering
- New dependencies, infrastructure changes

**Refactor** — Triggered when:
- Challenger flagged structural issues
- Implementor noted maintainability concerns
- Code structure would benefit from improvement

## Components

### Agents (5)

All in `agents/`:
- `planner.md` — Slice plan creation
- `challenger.md` — Plan and diff review
- `implementor.md` — Strict TDD execution
- `security.md` — Security review
- `refactorer.md` — Structure improvement

### Skills Inheritance by Agent

| Agent | Inherits | Why |
|-------|----------|-----|
| Planner | code-quality, architecture, security | Plans with architectural and security awareness |
| Challenger | code-quality, architecture, security | Reviews for security risks and architecture |
| Implementor | code-quality, code-standards | Follows TDD and language standards |
| Security | security | Focused security review |
| Refactorer | code-quality, design | Executes with clean design patterns |

### Commands (1)

- `/implement-team:implement <feature>` — Run full workflow

## Workflow Phases

### Phase 1: Planning (Planner)

- Frame the problem (goal, non-goals, constraints)
- Decompose into 1-3 vertical slices
- Define testable acceptance criteria (Given/When/Then)
- Specify API contracts with semantic naming
- Identify dependency boundaries
- Define Docs Delta (what docs ship with code)
- List top 3 risks with mitigations

### Phase 2: Plan Review (Challenger)

- Review slice plan for feasibility
- Check assumptions are explicit
- Verify acceptance criteria are testable
- Validate dependency isolation strategy
- Decision: Ship / Ship with fixes / Stop-ship

### Phase 3: Implementation (Implementor)

Strict TDD execution:

| Phase | Action |
|-------|--------|
| **RED** | Write failing test for acceptance criterion |
| **GREEN** | Implement minimum code to pass |
| **REFACTOR** | Improve without changing behavior |

Requirements:
- Tests fail before code is written
- All acceptance criteria have passing tests
- Edge cases covered
- Docstrings on all public APIs
- Docs-site updates per Docs Delta

### Phase 4: Diff Review (Challenger)

- Review code changes
- Verify tests cover all criteria
- Check documentation completeness
- Decision: Ship / Ship with fixes / Stop-ship

### Phase 5: Security Review (Conditional)

If high-stakes work:
- Threat Model Lite (assets, entry points, trust boundaries)
- Security requirements verification
- Decision: Pass / Pass with fixes / Stop-ship

### Phase 6: Refactor (Conditional)

If structural issues flagged:
- Improve structure without behavior change
- Maintain test coverage
- Re-verify with Challenger

### Phase 7: Finalize

Final summary:
- What changed (files, modules, dependencies)
- Tests added (unit, integration, edge cases)
- Documentation updated
- Follow-ups if any

## File Structure

```
implement-team/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest (v1.0.0)
├── agents/
│   ├── planner.md               # Step 1: Plan slices
│   ├── challenger.md            # Step 2 & 4: Review gates
│   ├── implementor.md           # Step 3: Strict TDD
│   ├── security.md              # Step 5: Security review
│   └── refactorer.md            # Step 6: Structure improvement
├── commands/
│   └── implement.md             # Full workflow command
└── README.md
```

## Design Principles

### Agent Philosophy

- **Separation of concerns** — Each agent has one job
- **Gated decisions** — Quality gates at planning and implementation
- **Loop limits** — Max 2 cycles to prevent infinite loops
- **Early exits** — Trivial requests skip full workflow
- **Strict TDD** — Red-Green-Refactor is non-negotiable
- **Docs ship with code** — Documentation is a deliverable, not an afterthought
- **Autonomous execution** — Minimal user interruption

### TDD Discipline

- Tests are written BEFORE implementation
- Each test must fail before code is written
- Minimal implementation to pass tests
- Refactoring only after tests pass
- No speculative features or "while I'm here" changes

## Web App Template Integration

When working on Web App Template projects, additional requirements apply:

### Build Order
Implement in this order: Data (03-data) -> Logic (02-logic) -> Presentation (01-presentation)

### Validators
All 8 validators must pass before shipping:
- `validate:tokens` — No hardcoded CSS
- `validate:arch` — Architecture boundaries
- `validate:coverage` — 80% test coverage
- `validate:naming` — File naming conventions
- `validate:secrets` — No hardcoded secrets
- `validate:docs` — Documentation structure
- `validate:html` — Semantic HTML
- `validate:contrast` — WCAG AA contrast

### Documentation Updates
- Feature file status
- Module explainer feature table
- Roadmap milestone status
- Changelog version entry

## Author

Alexander Thompson — Information Designer & Systems Thinker
