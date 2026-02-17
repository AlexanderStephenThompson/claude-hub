---
description: Clean, audit, or refactor a codebase — one command, three modes
argument-hint: [scope|"audit" [focus]] — e.g., "src/", "audit", "audit css"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Task
---

# /clean-team:clean

One command for everything. Three modes, auto-detected:

| Invocation | Mode | What Happens |
|------------|------|-------------|
| `/clean-team:clean` | Full pipeline | Analyze → checkpoint → refactor (auto-detects existing audit report) |
| `/clean-team:clean src/` | Full pipeline | Same, scoped to src/ |
| `/clean-team:clean audit` | Audit only | Read-only parallel analysis → AUDIT-REPORT.md |
| `/clean-team:clean audit css` | Audit only | Read-only analysis with focus area |

## Arguments

$ARGUMENTS

---

## Mode Detection

Silently determine which mode to run. Do NOT narrate the detection steps — just do them and announce the result.

1. **If the first argument is `audit`** (case-insensitive) → **Mode B: Audit Only**. Remaining arguments become the focus area.

2. **Otherwise**, glob for `AUDIT-REPORT*.md` in the current directory:
   - **Found** → Ask the user: "Found existing audit report ([filename]). Resume refactoring from it, or start fresh?"
     - Resume → **Mode C**
     - Fresh → **Mode A** (will overwrite existing report)
   - **Not found** → **Mode A: Full Pipeline**. Any arguments become the scope (directory path).

### Mode Summary

| Mode | Trigger | What Runs |
|------|---------|-----------|
| **A: Full Pipeline** | Default (no audit report found) | All 8 agents with checkpoint |
| **B: Audit Only** | First arg is "audit" | Parallel sub-agents → AUDIT-REPORT.md (read-only) |
| **C: Resume** | Audit report exists + user confirms | Phase 2 agents only (Tester → Verifier) |

---

## Operating Rules

1. **Autonomous execution** — Agents run without interruption unless they encounter a failure
2. **Commit per agent** — Each modifying agent commits its changes before handing off
3. **Ask on restructuring** — Only major structural changes require user approval
4. **Detect project type** — Formatter auto-detects and loads the matching cleaning profile
5. **Honest reporting** — The Auditor reports failures even if cleanup caused them
6. **Checkpoint after audit** — Present findings summary and get user confirmation before refactoring (Mode A only)
7. **Gate decisions** — Challenger and Verifier can approve, revise (max 2 cycles), or block
8. **Minimal interruption** — Only ask the user a question if there is a true blocker or an explicit stop decision

---

## Prerequisite Check

Before starting any mode, verify:

### Git Status

```bash
git status --porcelain
```

- **Git missing?** (Mode A/C) Initialize it (`git init`, initial commit)
- **Uncommitted changes?** Warn the user: "You have uncommitted changes. Recommend committing or stashing before cleanup." Ask if they want to proceed anyway.

### Tests Passing (Mode C only)

```bash
npm test  # or equivalent
```

- **Tests fail?** Fix them first. Do not refactor on a broken baseline.

---

## Mode A: Full Pipeline

Tell the user:

> **Phase 1: Analyze** — Organizing structure, cleaning code, and producing an audit report. You'll review the findings at a checkpoint before any refactoring begins.

Create a todo list showing the full pipeline:

```
Phase 1: Analyze
  [ ] Organizer — structure, root cleanup, 3-tier alignment
  [ ] Formatter — dead code, unused imports, style conventions
  [ ] Auditor — deep parallel analysis → AUDIT-REPORT.md
  [ ] Checkpoint — review findings before refactoring

Phase 2: Refactor
  [ ] Tester — assess coverage, write safety-net tests
  [ ] Planner — build phased roadmap from audit findings
  [ ] Challenger — review roadmap feasibility (gate)
  [ ] Refactorer — execute slices, commit per change
  [ ] Verifier — confirm behavior preserved (gate)
```

Update each item to in_progress as you start it and completed when done.

### Step 1: Organizer

**Tell the user before launching:**

> **Step 1: Organizer** — Making sure the project structure is navigable and follows the 3-tier model (`01-presentation/` → `02-logic/` → `03-data/`). This means: cleaning stray files from the root, checking that source files live in the right tier, and flagging any major restructuring for your approval before touching it.

Invoke the **@organizer** agent to:
1. Audit project structure (root, folders, files, naming, docs)
2. Evaluate Architecture Structure Gate (web projects — mandatory)
3. Execute quick tidies (deletes, renames, moves)
4. Execute reorganization (merges, splits, import updates)
5. Ask before any major restructuring (including tier introduction)
6. Commit changes
7. Hand off to Formatter with Tier Health status

### Step 1.1: Tier Architecture Check (Web Projects)

After the Organizer returns, check its Tier Health status from the handoff.

**If Tier Health is "no tiers" or "partially missing":**

Present the user with the Organizer's finding and ask:

> The Organizer found this is a web project without 3-tier architecture (`01-presentation/` → `02-logic/` → `03-data/`). This is a significant structural change that would reorganize your source files.
>
> Options:
> 1. **Include tier migration in refactoring** — The Planner will create a migration plan during Phase 2
> 2. **Skip tier work** — Focus on code quality improvements only
> 3. **Stop here** — Review the project structure before proceeding

Record the user's choice. Pass it to the Planner as context:
- Option 1: `Tier migration: APPROVED by user`
- Option 2: `Tier migration: SKIPPED by user`
- Option 3: Stop the pipeline

**If Tier Health is "clean" or "reorganized":** Continue silently to Step 2.

### Step 2: Formatter

**Tell the user before launching:**

> **Step 2: Formatter** — Cleaning code without changing behavior. Removes unused imports, dead code, magic numbers, and debug statements. Detects the project type (web, Unity, Python, etc.) and applies its specific conventions — for web projects that includes CSS file structure (5-file architecture) and design token enforcement.

Invoke the **@formatter** agent to:
1. Detect project type (web, unity, python, data, or generic)
2. Run universal cleaning (unused imports, dead code, magic numbers, debug stmts)
3. Load and apply project-type-specific profile from `assets/cleaning-profiles/`
4. Commit changes
5. Hand off to Auditor

### Step 3: Auditor

**Tell the user before launching:**

> **Step 3: Auditor** — Deep analysis with parallel sub-agents. Launches 4+ specialized auditors simultaneously (code quality, structure, scalability, developer experience — plus web-specific auditors for CSS, React, accessibility, and performance if applicable). Runs `check.js` for automated rule enforcement. Everything consolidates into AUDIT-REPORT.md with prioritized, numbered findings.

Invoke the **@auditor** agent to:
1. Explore the codebase deeply (architecture, modules, patterns, data flow)
2. Analyze against best practices for this project type
3. Run tests and collect before/after metrics
4. Generate AUDIT-REPORT.md with structured findings
5. Produce a checkpoint summary with finding counts and top priorities

### Step 4: Checkpoint

**Question:** "Should we continue to refactoring?"

Present the Auditor's checkpoint summary to the user and ask:

```
Continue to refactoring? (yes / no / review full report)
```

- **yes** → Continue to Phase 2: Refactor
- **no** → Stop here. AUDIT-REPORT.md is saved for later (re-run `/clean-team:clean` to resume)
- **review** → Pause for user to read the full AUDIT-REPORT.md, then ask again

**If Auditor recommended "No refactoring needed":**
- Report this to the user and stop. The codebase is clean.

After checkpoint approval, continue to **Phase 2: Refactor** below.

---

## Mode B: Audit Only

Read-only analysis — no Organizer, no Formatter, no git commits. Launches parallel sub-agents for deep focused analysis and consolidates into a single prioritized report.

Tell the user:

> **Audit Only** — Running read-only analysis with parallel sub-agents. No code changes will be made.

Create a todo list:

```
Audit Only
  [ ] Discover project and detect stack
  [ ] Launch parallel auditors
  [ ] Consolidate findings into report
```

Update each item to in_progress as you start it and completed when done.

### Focus Area

Parse remaining arguments after "audit" as the focus area.

**If a focus area is provided:**
1. Still perform the full audit across all categories
2. Give extra attention and depth to the focus area
3. Prioritize focus-related findings higher in the report
4. Add a dedicated "Focus Area Deep Dive" section

**If no focus is provided:**
- Perform a balanced audit across all categories
- Prioritize by impact-to-effort ratio

**Universal focus areas:** structure, security, testing, documentation, type-safety, error-handling

**Web focus areas** (require web stack detection): css, a11y, perf, react, graphql

### Step 1: Discovery & Stack Detection

Map the project and detect the tech stack:

```
# Map the project structure (use Glob tool)
Glob: **/*  → review top-level folders and file types

# Count files by type (use Glob tool with specific patterns)
Glob: **/*.js, **/*.ts, **/*.tsx, **/*.jsx
Glob: **/*.css, **/*.html
Glob: **/*.py, **/*.cs
```

**Project type detection:** Read `~/.claude/skills/architecture/SKILL.md` to find available profiles under "Project Type Profiles." Match detected files against detection hints, then load the matching profile from `~/.claude/skills/architecture/references/`.

**Web stack detection:** Check for CSS, HTML, JSX, React, Apollo, Prisma. If found, read `assets/audit-checklists/web.md` for web-specific audit checklists.

### Step 2: Launch Parallel Auditors

**Read `assets/parallel-audit-roster.md`** for the full sub-agent roster, launch instructions, return format, and consolidation steps.

**Always launch the 4 core auditors** with checklists from `assets/audit-checklists/core.md`.

**If web stack detected, also launch web auditors** with checklists from `assets/audit-checklists/web.md`. Only launch auditors relevant to the detected stack (see roster for mapping).

**If focus = `structure`:** Follow the structure focus mode in the roster — replace File Organization Auditor (#1) with 5 specialized structure auditors from `assets/audit-checklists/structure.md`.

**If a focus area was specified:** All auditors still run, but give extra depth to the focus area and prioritize its findings higher in the final report.

### Step 3: Consolidate & Report

Follow the consolidation instructions in `assets/parallel-audit-roster.md`: collect all sub-agent outputs, deduplicate, re-prioritize, assign AUDIT-NNN IDs, and write the final report using the **Write tool** (never Bash heredocs or scripts).

**CRITICAL:** Use the **Write tool** to create the report file. Never use Bash heredocs (`cat <<EOF`), shell redirects, or Python scripts — these fail on Windows paths with spaces.

Write the report using `assets/audit-report-template.md` as the template. Save to: `./AUDIT-REPORT-[YYYY-MM-DD].md`

**CRITICAL:** Every finding MUST have a unique `AUDIT-NNN` ID.

### Audit Guidelines

1. **Be specific** — Don't say "improve naming." Say "Rename `utils.js` to `string-formatters.js` because it only contains string formatting functions."
2. **Prioritize ruthlessly** — Focus on changes with the highest impact-to-effort ratio.
3. **Respect existing patterns** — Recommend extending conventions, not replacing them.
4. **No implementation** — Analysis only. No code changes.
5. **Check for context** — Look for ARCHITECTURE.md, CONTRIBUTING.md, or similar docs that explain intentional decisions.
6. **Do NOT delete the report** — It's a deliverable the user expects to keep.

**After writing the report, stop.** Tell the user:

```
Audit complete. Report saved to AUDIT-REPORT-[date].md.

To clean and refactor, run: /clean-team:clean
```

---

## Mode C: Resume Refactoring

Requires an existing AUDIT-REPORT.md. The mode detection already confirmed this exists.

Tell the user:

> **Phase 2: Refactor** — Resuming from an existing audit report. Building a roadmap and executing it slice by slice with safety gates.

Create a todo list:

```
Phase 2: Refactor (resume)
  [ ] Tester — assess coverage, write safety-net tests
  [ ] Planner — build phased roadmap from audit findings
  [ ] Challenger — review roadmap feasibility (gate)
  [ ] Refactorer — execute slices, commit per change
  [ ] Verifier — confirm behavior preserved (gate)
```

Update each item to in_progress as you start it and completed when done.

Continue to **Phase 2: Refactor** below.

---

## Phase 2: Refactor

> Mode A reaches this section after the checkpoint. Mode C starts here directly.

Tell the user:

> **Phase 2: Refactor** — Building a roadmap from the audit findings and executing it slice by slice with safety gates.

### Step 5: Tester

**Tell the user before launching:**

> **Step 5: Tester** — Checking whether there's a safety net for refactoring. Assesses current test coverage against the audit's critical paths. If coverage is too low on areas we're about to refactor, writes characterization tests to lock in existing behavior before anything changes.

Invoke the **@tester** agent to:
1. Read AUDIT-REPORT.md (Critical Paths section)
2. Assess current test coverage
3. Write characterization or safety tests if coverage is insufficient
4. Report readiness status

> **Resume mode:** If `COVERAGE-REPORT.md` exists from a previous run, pass it to the Tester as prior context — they may skip re-assessment if coverage hasn't changed.

**Stop condition:** If critical areas can't be safely tested → ask user whether to proceed with risk

### Step 6: Planner

**Tell the user before launching:**

> **Step 6: Planner** — Turning the audit findings into a sequenced refactoring roadmap. Organizes into phases (Small → Medium → Large), defines specific slices with files and commit strategies, and maps which audit findings each slice resolves. For web projects, independently verifies tier architecture and includes migration slices if needed.

Invoke the **@planner** agent with AUDIT-REPORT.md, Tester's report, and the user's tier architecture decision (from Step 1.1) to:
1. Create a phased refactoring roadmap (Small → Medium → Large)
2. Define specific slices with commit strategies
3. Map which audit findings each slice addresses
4. If tier migration was approved by the user, include tier introduction slices

> **Resume mode:** If `REFACTORING-ROADMAP.md` exists from a previous run, pass it to the Planner — they may reuse or revise it instead of starting from scratch.

### Step 6.1: Challenger (Gate)

**Tell the user before launching:**

> **Step 6.1: Challenger** — Quality gate reviewing the roadmap through three lenses: feasibility (can it be executed?), semantic correctness (will it improve clarity?), and behavioral preservation (will tests stay green?). Can approve, send back for revision, or block on stop-ship triggers.

Invoke the **@challenger** agent. Tell it to **read `REFACTORING-ROADMAP.md` from disk** for the full roadmap:
- **Approve** → Continue to Step 7
- **Revise** → Send back to Planner, then re-challenge (max 2 cycles). Do NOT loop back to Tester.
- **Block** → Stop. Ask user for missing info

### Step 7: Refactorer

**Tell the user before launching:**

> **Step 7: Refactorer** — Executing the approved roadmap slice by slice. Each slice gets its own commit(s), tests run after every change, and the app stays working at every step. Tier boundaries are respected — files land in the correct tier and import direction is verified after structural changes.

Invoke the **@refactorer** agent. Tell it to **read `REFACTORING-ROADMAP.md` from disk** for the full slice details:
1. Execute slice by slice
2. Commit per strategy
3. Run tests after each slice
4. Update AUDIT-REPORT.md as findings are addressed

### Step 7.1: Verifier (Gate)

**Tell the user before launching:**

> **Step 7.1: Verifier** — Final quality gate. Confirms behavior is unchanged (tests prove it), measures semantic clarity improvement (naming, docs, organization), and produces a before/after comparison. Can approve, route back for targeted fixes, or block.

Invoke the **@verifier** agent to validate results:
- **Approve** → Continue to Step 8
- **Route back** → Send to appropriate agent for targeted fixes (max 2 cycles). Do NOT full re-refactor.
- **Block** → Stop. Escalate to user

### Step 8: Finalize

Produce a concise final summary:

```markdown
# Pipeline Complete: [Project Name]

## Outcome
[Shipped / Stopped at checkpoint / Blocked]

## What Changed
- Structure: [Organizer changes] (Mode A only)
- Code quality: [Formatter changes] (Mode A only)
- Refactoring: [Refactorer changes]

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

## Follow-ups (If Any)
- [Only if truly needed]
```

---

## Flow Diagram

```
/clean-team:clean [args]
         │
         ▼
┌─────────────────┐
│  Mode Detection │  Parse args → A, B, or C
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    │         │          │
    ▼         ▼          ▼
  Mode A    Mode B     Mode C
  (full)   (audit)   (resume)
    │         │          │
    ▼         │          │
═══════════   │          │
 PHASE 1:    │          │
 ANALYZE     │          │
═══════════   │          │
    │         │          │
    ▼         ▼          │
 Organizer  Discovery    │
    │         │          │
    ▼         ▼          │
 Formatter  Parallel     │
    │       Auditors     │
    ▼         │          │
  Auditor   Consolidate  │
    │         │          │
    ▼         ▼          │
 CHECKPOINT  DONE        │
    │                    │
    ├────────────────────┘
    ▼
═══════════
 PHASE 2:
 REFACTOR
═══════════
    │
    ▼
  Tester → Planner → Challenger → Refactorer → Verifier
    │
    ▼
 Complete
```

---

## Error Handling

### If Organizer Fails (Mode A)
- Report the error
- Ask user how to proceed (retry, skip, abort)

### If Formatter Fails (Mode A)
- Report the error
- Ask user: retry, skip to Auditor, or abort

### If Auditor Reports Test Failures (Mode A)
- Do NOT auto-fix
- Report which tests failed and likely cause
- The audit report will include this information

### If Tester Can't Achieve Safe Coverage
- Report which areas are risky
- Ask user: proceed with risk, or stop

### If Challenger Blocks the Plan
- Report why
- Ask user for the missing information or decision

### If Refactorer Fails Mid-Execution
- Report which slice failed and why (e.g., test failure after slice 3 of 5)
- Completed slices remain committed — do NOT roll back successful work
- Ask user: fix the issue and continue, skip this slice, or stop

### If Verifier Routes Back
- Targeted fixes only (max 2 cycles)
- If still failing after 2 cycles, stop and report

---

## Output

| Mode | Produces |
|------|----------|
| **A: Full Pipeline** | 2+ git commits, AUDIT-REPORT.md, final summary |
| **B: Audit Only** | AUDIT-REPORT-[date].md (no commits, read-only) |
| **C: Resume** | Refactoring commits, updated AUDIT-REPORT.md, final summary |

---

## Examples

```bash
# Full project clean + audit + refactor
/clean-team:clean

# Scope to src/ directory
/clean-team:clean src/

# Read-only audit — full scan
/clean-team:clean audit

# Read-only audit — CSS focus
/clean-team:clean audit css

# Read-only audit — structure focus (expands to 5 sub-auditors)
/clean-team:clean audit structure

# Read-only audit — accessibility focus
/clean-team:clean audit a11y

# Read-only audit — security focus
/clean-team:clean audit security
```
