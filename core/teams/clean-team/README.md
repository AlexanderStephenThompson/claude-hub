# Refactor Team v3.1

An 8-agent refactoring team in two phases: **CLEAN** (safe iterative fixes + audit) then **REFACTOR** (planned deeper changes from the audit).

## Two Phases, One Pipeline

```
Phase 1 — CLEAN (/clean-team:clean)
  Organizer → Formatter → Auditor → AUDIT-REPORT.md

                    ↓ User reviews report ↓

Phase 2 — REFACTOR (/clean-team:refactor)
  Tester → Planner → Challenger → Refactorer → Verifier
```

The **AUDIT-REPORT.md** is the bridge between phases. Phase 1 produces it, the user reviews it, and Phase 2 consumes it.

---

## Phase 1: Clean (3 Agents)

Safe, iterative cleanup that ends with a deep analysis report.

| # | Agent | Job | Output |
|---|-------|-----|--------|
| 1 | **Organizer** | File moves, renames, folder organization | git commit |
| 2 | **Formatter** | Universal cleaning + project-type-specific conventions | git commit |
| 3 | **Auditor** | Deep analysis: architecture, best practices, metrics, findings | AUDIT-REPORT.md |

## Phase 2: Refactor (5 Agents)

Planned refactoring driven by the audit report. Requires AUDIT-REPORT.md.

| # | Agent | Job | Output |
|---|-------|-----|--------|
| 5 | **Tester** | Coverage assessment, writes safety tests | Coverage report |
| 6 | **Planner** | Phased roadmap from audit findings | Roadmap |
| 7 | **Challenger** | Gate 1: reviews plan feasibility | Approve/Revise/Block |
| 8 | **Refactorer** | Executes approved slices | git commits |
| 9 | **Verifier** | Gate 2: validates behavior + clarity | Approve/Route back/Block |

---

## Commands

```bash
# Phase 1: Clean and audit
/clean-team:clean [scope]

# Phase 2: Refactor from audit report
/clean-team:refactor [path] [focus]
```

### Examples

```bash
# Full project clean + audit
/clean-team:clean

# Clean only src/
/clean-team:clean src/

# Refactor with focus on naming
/clean-team:refactor src/ focus on naming

# Refactor the auth module
/clean-team:refactor src/auth/
```

---

## Skills

Agents inherit shared skills from `~/.claude/skills/`:

| Skill | Used By |
|-------|---------|
| code-quality | All agents |
| architecture | Organizer, Auditor, Planner, Challenger |
| security | Planner, Challenger |
| documentation | Verifier |

---

## Gating Logic

- **Gate 1 (Challenger)**: Reviews plan before execution. Max 2 revision cycles.
- **Gate 2 (Verifier)**: Confirms behavior unchanged, measures improvement. Max 2 fix cycles.
- **Early exits**: Workflow can stop early if codebase already follows best practices.

---

## Analysis Scripts

```bash
python scripts/analyze_complexity.py <path>     # High-complexity functions
python scripts/analyze_dependencies.py <path>   # Circular dependencies
python scripts/detect_dead_code.py <path>       # Unused code
```

---

## What Changed from v2.0

| Before (v2.0) | After (v3.0) | After (v3.1) |
|----------------|--------------|--------------|
| clean-team (4 agents) + clean-team (7 agents) | One team, 9 agents, 2 phases | 8 agents, 2 phases |
| Two separate installations | One installation | — |
| CLEANUP-REPORT.md (metrics only) | AUDIT-REPORT.md (metrics + architecture + gaps + findings) | — |
| Explorer + Researcher (2 analysis agents) | Auditor (1 agent, deeper analysis) | — |
| Manual handoff between teams | Audit report bridges phases automatically | — |
| `/clean-team:clean` | `/clean-team:clean` | — |
| — | Stylist (web-only) + Polisher | Formatter (universal + type-specific profiles) |
