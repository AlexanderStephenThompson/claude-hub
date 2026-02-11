# Clean-Team v4.1.0

An 8-agent pipeline in two phases, separated by a checkpoint where you review findings and decide whether to continue. One command — three modes.

## Two Phases, One Command

```
/clean-team:clean [scope|audit [focus]]

  Phase 1: Analyze     Organizer → Formatter → Auditor
                                                  │
                                            [checkpoint]
                                                  │
  Phase 2: Refactor    Tester → Planner → Challenger → Refactorer → Verifier
```

**Phase 1** organizes, cleans, and audits — producing **AUDIT-REPORT.md** with prioritized findings. At the checkpoint, you review the report and decide: continue to refactoring, stop here, or read the full report first.

**Phase 2** builds a roadmap from those findings and executes it slice by slice with safety gates.

The command auto-detects existing audit reports and offers to resume Phase 2. Pass `audit` as the first argument for read-only analysis without code changes.

---

## Agents

| Phase | # | Agent | Job | Output |
|-------|---|-------|-----|--------|
| **Analyze** | 1 | **Organizer** | File moves, renames, folder organization | git commit |
| | 2 | **Formatter** | Universal cleaning + project-type-specific conventions | git commit |
| | 3 | **Auditor** | Parallel sub-agents for deep analysis | AUDIT-REPORT.md |
| | — | **Checkpoint** | User confirms: continue / stop / review full report | — |
| **Refactor** | 4 | **Tester** | Coverage assessment, writes safety tests | Coverage report |
| | 5 | **Planner** | Phased roadmap from audit findings | Roadmap |
| | 6 | **Challenger** | Gate 1: reviews plan feasibility | Approve/Revise/Block |
| | 7 | **Refactorer** | Executes approved slices | git commits |
| | 8 | **Verifier** | Gate 2: validates behavior + clarity | Approve/Route back/Block |

The Auditor launches 4-12 parallel sub-agents (4 core + up to 8 web, depending on stack) using the shared roster at `assets/parallel-audit-roster.md`.

---

## Usage

| Invocation | Mode | What Happens |
|------------|------|-------------|
| `/clean-team:clean` | Full pipeline | Analyze → checkpoint → refactor |
| `/clean-team:clean src/` | Full pipeline | Same, scoped to src/ |
| `/clean-team:clean audit` | Audit only | Read-only parallel analysis → AUDIT-REPORT.md |
| `/clean-team:clean audit css` | Audit only | Read-only analysis with CSS focus |
| `/clean-team:clean audit structure` | Audit only | Structure focus (expands to 5 sub-auditors) |

If an existing AUDIT-REPORT.md is detected, the command asks whether to resume refactoring or start fresh.

### Examples

```bash
# Full project clean + audit + refactor
/clean-team:clean

# Clean only src/
/clean-team:clean src/

# Read-only audit — full scan
/clean-team:clean audit

# Read-only audit — CSS focus
/clean-team:clean audit css

# Read-only audit — structure focus
/clean-team:clean audit structure

# Read-only audit — accessibility focus
/clean-team:clean audit a11y
```

---

## Skills

Agents inherit shared skills from `~/.claude/skills/`:

| Skill | Used By |
|-------|---------|
| code-quality | All agents |
| architecture | Organizer, Auditor, Planner, Challenger, Refactorer, Verifier |
| security | Planner, Challenger |
| design | Refactorer |
| documentation | Verifier |

**Web project tier enforcement:** When a web project is detected, the Auditor launches a Layer Architecture Auditor sub-agent that checks tier structure, import direction, layer purity, and file placement. Violations flow through the full pipeline: Planner creates migration slices (Data -> Logic -> Presentation), Challenger verifies import direction compliance, Refactorer executes moves with tier boundary awareness, and Verifier confirms all imports flow correctly after refactoring.

---

## Assets

| Asset | Purpose |
|-------|---------|
| `assets/parallel-audit-roster.md` | Shared sub-agent definitions for parallel audit |
| `assets/audit-report-template.md` | AUDIT-REPORT.md generation template |
| `assets/audit-checklists/core.md` | 4 core auditor checklists (always run) |
| `assets/audit-checklists/structure.md` | 5 structure-focus auditor checklists |
| `assets/audit-checklists/web.md` | 8 web auditor checklists (conditional) |
| `assets/cleaning-profiles/*.md` | Project-type-specific cleaning rules (web, unity, python, data) |
| `assets/refactor-checklist.md` | User-facing refactor checklists |
| `assets/commit-templates.md` | Commit message templates |

---

## Gating Logic

- **Checkpoint (after Auditor)**: User confirms before refactoring starts. Can stop, continue, or review.
- **Gate 1 (Challenger)**: Reviews plan before execution. Max 2 revision cycles.
- **Gate 2 (Verifier)**: Confirms behavior unchanged, measures improvement. Max 2 fix cycles.
- **Early exits**: Workflow can stop early if codebase already follows best practices.

---

## Analysis Scripts

```bash
python scripts/analyze_complexity.py <path>     # High-complexity functions
python scripts/analyze_dependencies.py <path>   # Circular dependencies
python scripts/detect_dead_code.py <path>       # Unused code
node scripts/check.js                           # Design system compliance (36 rules)
```

---

## Version History

| Version | Changes |
|---------|---------|
| v4.1.0 | Consolidated three commands into one. `/clean-team:clean` now handles full pipeline, audit-only (`audit` arg), and resume (auto-detected from existing AUDIT-REPORT.md). Removed `/clean-team:audit` and `/clean-team:refactor`. |
| v4.0.0 | Unified pipeline: Phase 1 (Analyze) and Phase 2 (Refactor) run as one command with a checkpoint between them. |
| v3.4.0 | Added css-import-order rule, tier-structure/tier-imports enforcement, Architecture Structure Gate in Organizer |
| v3.3.0 | Parallelized Auditor with shared sub-agent roster, added check.js (31 rules) |
| v3.2.0 | Absorbed improvement-auditor + web-auditor into audit command |
| v3.1.0 | Formatter replaced Stylist + Polisher with universal + type-specific profiles |
| v3.0.0 | Merged old clean-team into refactor-team as Phase 1. Added Auditor (merged Explorer + Researcher). Renamed to clean-team. |
