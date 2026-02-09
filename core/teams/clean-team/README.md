# Clean-Team v4.0.0

An 8-agent pipeline that cleans, audits, and refactors codebases in one continuous flow with a checkpoint after the audit.

## One Pipeline, Eight Agents

```
/clean-team:clean [scope]
  Organizer → Formatter → Auditor → [checkpoint] → Tester → Planner → Challenger → Refactorer → Verifier
```

The **AUDIT-REPORT.md** is the bridge between cleanup and refactoring. The Auditor produces it, presents a checkpoint summary, and the user confirms whether to continue. No more forgetting to run a second command.

There is also a standalone audit command (`/clean-team:audit`) that skips cleaning and produces the report directly using parallel sub-agents, and a resume command (`/clean-team:refactor`) for picking up from an existing audit report.

---

## Agents

| # | Agent | Job | Output |
|---|-------|-----|--------|
| 1 | **Organizer** | File moves, renames, folder organization | git commit |
| 2 | **Formatter** | Universal cleaning + project-type-specific conventions | git commit |
| 3 | **Auditor** | Parallel sub-agents for deep analysis: architecture, best practices, metrics, findings | AUDIT-REPORT.md + checkpoint summary |
| — | **Checkpoint** | User confirms: continue / stop / review full report | — |
| 4 | **Tester** | Coverage assessment, writes safety tests | Coverage report |
| 5 | **Planner** | Phased roadmap from audit findings | Roadmap |
| 6 | **Challenger** | Gate 1: reviews plan feasibility | Approve/Revise/Block |
| 7 | **Refactorer** | Executes approved slices | git commits |
| 8 | **Verifier** | Gate 2: validates behavior + clarity | Approve/Route back/Block |

The Auditor launches 4-12 parallel sub-agents (4 core + up to 8 web, depending on stack) using the shared roster at `assets/parallel-audit-roster.md`.

---

## Commands

```bash
# Full pipeline: clean + audit + checkpoint + refactor
/clean-team:clean [scope]

# Resume refactoring from existing AUDIT-REPORT.md
/clean-team:refactor [path] [focus]

# Standalone audit (parallel sub-agents, optional focus)
/clean-team:audit [focus]
```

### Examples

```bash
# Full project clean + audit + refactor
/clean-team:clean

# Clean only src/
/clean-team:clean src/

# Standalone audit focused on CSS
/clean-team:audit css

# Standalone audit focused on structure (expands to 5 sub-auditors)
/clean-team:audit structure

# Resume refactoring with focus on naming
/clean-team:refactor src/ focus on naming

# Resume refactoring on the auth module
/clean-team:refactor src/auth/
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
| v4.0.0 | Merged two-phase pipeline into one continuous flow with checkpoint after Auditor. `/clean-team:clean` now runs all 8 agents. `/clean-team:refactor` repurposed as resume entry point. |
| v3.4.0 | Added css-import-order rule, tier-structure/tier-imports enforcement, Architecture Structure Gate in Organizer |
| v3.3.0 | Parallelized Auditor with shared sub-agent roster, added check.js (31 rules) |
| v3.2.0 | Absorbed improvement-auditor + web-auditor into `/clean-team:audit` command |
| v3.1.0 | Formatter replaced Stylist + Polisher with universal + type-specific profiles |
| v3.0.0 | Merged old clean-team into refactor-team as Phase 1. Added Auditor (merged Explorer + Researcher). Renamed to clean-team. |
