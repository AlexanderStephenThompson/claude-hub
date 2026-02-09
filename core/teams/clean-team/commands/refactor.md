---
description: Resume refactoring from an existing AUDIT-REPORT.md
argument-hint: [path] [focus area or guidance]
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# /clean-team:refactor

Resume refactoring from an existing AUDIT-REPORT.md. Use this to resume after stopping at a checkpoint during `/clean-team:clean`, or to refactor a previously audited codebase.

**Target path:** If no path is provided, use the current working directory (`.`).

**Focus guidance:** If the user provides additional context beyond the path (e.g., "focus on naming", "prioritize the auth module", "clean up the API layer"), use this to guide the refactoring priorities. Pass this context to all agents.

**Only ask the user a question if there is a true blocker or an explicit Stop decision.**

## Operating Rules

- **Default:** Proceed autonomously with stated assumptions
- **Max interruption:** One tight question only, if required to proceed safely
- **Agent handoffs:** Always pass full context and latest artifacts
- **Gating decisions:** Approve / Revise / Block (follow routing)
- **Loop policy:** Handle revisions automatically (max 2 cycles per gate)

---

## Prerequisite Check

### 1. Audit Report Required

Check if an audit report exists using the Glob tool to search for `AUDIT-REPORT*.md` in the current directory.

**If found:**
```
Found AUDIT-REPORT.md — proceeding with refactoring.
```

**If NOT found:**
```
No AUDIT-REPORT.md found.

Refactoring requires an audit report. Run:
  /clean-team:clean [scope]
first to generate the audit report.
```
**STOP.** Do not proceed without the audit report.

### 2. Git Status

```bash
git status
```

- **Git missing?** Initialize it (`git init`, initial commit)
- **Dirty working tree?** Warn user, ask to commit or stash first

### 3. Tests Passing

```bash
npm test  # or equivalent
```

- **Tests fail?** Fix them first. Do not refactor on a broken baseline.

---

## Workflow

### Step 1: Assess Tests

Invoke the **@tester** agent.

**If `COVERAGE-REPORT.md` exists** from a previous run, pass it to the Tester as prior context — they may skip re-assessment if coverage hasn't changed.

Tester reads AUDIT-REPORT.md (Critical Paths section) and produces:
- Test Coverage Report (saved to `COVERAGE-REPORT.md`)
- Gaps identified
- New tests written (if needed)
- Readiness status

**Stop condition:** If critical areas can't be safely tested → Ask user whether to proceed with risk

---

### Step 2: Plan Refactoring

Invoke the **@planner** agent with AUDIT-REPORT.md and Tester's report.

**If `REFACTORING-ROADMAP.md` exists** from a previous run, pass it to the Planner — they may reuse or revise it instead of starting from scratch.

Planner produces:
- Refactoring Roadmap (saved to `REFACTORING-ROADMAP.md`)
- Phases (Small → Medium → Large)
- Specific slices with commit strategies
- Audit finding coverage map

---

### Step 2.1: Challenge the Plan (GATE)

Invoke the **@challenger** agent for roadmap review.

Challenger's decision:
- **Approve** → Proceed to Step 3
- **Revise** → Send to Planner, then re-run 2.1 only (max 2 cycles)
- **Block** → Stop. Ask user for missing info

**Do NOT loop back to Step 1 on "Revise."**

---

### Step 3: Refactor (Execution)

Invoke the **@refactorer** agent with approved roadmap.

Refactorer executes:
- Slice by slice
- Semantic branches per slice
- Commits per strategy
- Tests after each slice
- Updates AUDIT-REPORT.md as findings are addressed

Refactorer produces:
- Practical Summary Report
- What changed and why
- Audit findings addressed

---

### Step 4: Verify Results (GATE)

Invoke the **@verifier** agent with completed work.

Verifier's decision:
- **Approve** → Proceed to Step 5
- **Route back** → Send to appropriate agent (max 2 cycles)
- **Block** → Stop. Escalate to user

**Do NOT full re-refactor on "Route back."** Fixes are targeted.

---

### Step 5: Finalize + Report

Produce one concise final summary:

```markdown
# Refactoring Complete: [Project Name]

## Outcome
[Shipped / Blocked]

## What Changed
- Key folders reorganized
- Key functions renamed
- Key modules extracted

## Semantic Clarity Improvements
- Naming clarity: X% → Y%
- Documentation coverage: X% → Y%
- Organization: [description]

## Audit Findings Addressed
- X of Y findings resolved (Z%)
- See updated AUDIT-REPORT.md for details

## Tests Status
- All tests passing
- Coverage: X%

## Git History
- Total commits: N
- All merged and clean

## Follow-ups (If Any)
- [Only if truly needed]
```

---

## User Input

**Arguments:** $ARGUMENTS

Parse the arguments:
- **Path**: First argument (or `.` if not provided)
- **Focus** (optional): Any additional text after the path — use this to prioritize specific areas, modules, or concerns throughout the workflow
