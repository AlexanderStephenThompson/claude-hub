---
description: Run the full 8-agent pipeline in two phases — analyze first, then refactor after your approval
argument-hint: [scope — e.g., "src/" or leave empty for full project]
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Task
---

# /clean-team:clean

Run the full 8-agent pipeline in two phases:

1. **Analyze** (Steps 1–3) — Organize structure, clean code, produce a deep audit report
2. **Refactor** (Steps 5–8) — Build a roadmap from the audit, execute it slice by slice

A **checkpoint** separates the two phases. You review the audit findings and decide whether to continue, stop, or read the full report before committing to refactoring.

## Scope

$ARGUMENTS

If a scope is provided above, focus cleanup on that directory. Otherwise, clean the full project.

---

## Operating Rules

1. **Autonomous execution** — Agents run without interruption unless they encounter a failure
2. **Commit per agent** — Each modifying agent commits its changes before handing off
3. **Ask on restructuring** — Only major structural changes require user approval
4. **Detect project type** — Formatter auto-detects and loads the matching cleaning profile
5. **Honest reporting** — The Auditor reports failures even if cleanup caused them
6. **Checkpoint after audit** — Present findings summary and get user confirmation before refactoring
7. **Gate decisions** — Challenger and Verifier can approve, revise (max 2 cycles), or block

---

## Prerequisite Check

Before starting, verify:

```bash
# Check for uncommitted changes
git status --porcelain
```

**If uncommitted changes exist:**
- Warn the user: "You have uncommitted changes. Recommend committing or stashing before cleanup."
- Ask if they want to proceed anyway
- If yes, continue; if no, abort

---

## Workflow

### Phase 1: Analyze

Tell the user:

> **Phase 1: Analyze** — Organizing structure, cleaning code, and producing an audit report. You'll review the findings at a checkpoint before any refactoring begins.

Create a todo list showing the full pipeline. Mark Phase 1 steps as pending and Phase 2 steps as pending:

```
Phase 1: Analyze
  [ ] Organize project structure
  [ ] Format and clean code
  [ ] Deep audit with findings report
  [ ] Checkpoint — review findings

Phase 2: Refactor
  [ ] Assess test coverage
  [ ] Plan refactoring roadmap
  [ ] Challenge the plan (gate)
  [ ] Execute refactoring
  [ ] Verify results (gate)
```

Update each item to in_progress as you start it and completed when done.

### Step 1: Organizer

**Question:** "Can I navigate this codebase?"

Invoke the **@organizer** agent to:
1. Audit project structure (root, folders, files, naming, docs)
2. Execute quick tidies (deletes, renames, moves)
3. Execute reorganization (merges, splits, import updates)
4. Ask before any major restructuring
5. Commit changes
6. Hand off to Formatter

### Step 2: Formatter

**Question:** "Is the code clean?"

Invoke the **@formatter** agent to:
1. Detect project type (web, unity, python, data, or generic)
2. Run universal cleaning (unused imports, dead code, magic numbers, debug stmts)
3. Load and apply project-type-specific profile from `assets/cleaning-profiles/`
4. Commit changes
5. Hand off to Auditor

### Step 3: Auditor

**Question:** "What does the full picture look like?"

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

- **yes** → Continue to Step 5
- **no** → Stop here. AUDIT-REPORT.md is saved for later `/clean-team:refactor`
- **review** → Pause for user to read the full AUDIT-REPORT.md, then ask again

**If Auditor recommended "No refactoring needed":**
- Report this to the user and stop. The codebase is clean.

### Phase 2: Refactor

Tell the user:

> **Phase 2: Refactor** — Building a roadmap from the audit findings and executing it slice by slice with safety gates.

### Step 5: Tester

**Question:** "Is there a safety net for refactoring?"

Invoke the **@tester** agent to:
1. Read AUDIT-REPORT.md (Critical Paths section)
2. Assess current test coverage
3. Write characterization or safety tests if coverage is insufficient
4. Report readiness status

**Stop condition:** If critical areas can't be safely tested → ask user whether to proceed with risk

### Step 6: Planner

**Question:** "What should we refactor, and in what order?"

Invoke the **@planner** agent with AUDIT-REPORT.md and Tester's report to:
1. Create a phased refactoring roadmap (Small → Medium → Large)
2. Define specific slices with commit strategies
3. Map which audit findings each slice addresses

### Step 6.1: Challenger (Gate)

Invoke the **@challenger** agent for roadmap review:
- **Approve** → Continue to Step 7
- **Revise** → Send back to Planner, then re-challenge (max 2 cycles)
- **Block** → Stop. Ask user for missing info

### Step 7: Refactorer

**Question:** "Execute the approved plan."

Invoke the **@refactorer** agent with approved roadmap to:
1. Execute slice by slice
2. Commit per strategy
3. Run tests after each slice
4. Update AUDIT-REPORT.md as findings are addressed

### Step 7.1: Verifier (Gate)

Invoke the **@verifier** agent to validate results:
- **Approve** → Continue to Step 8
- **Route back** → Send to appropriate agent for targeted fixes (max 2 cycles)
- **Block** → Stop. Escalate to user

### Step 8: Finalize

Produce a concise final summary:

```markdown
# Pipeline Complete: [Project Name]

## Outcome
[Shipped / Stopped at checkpoint / Blocked]

## What Changed
- Structure: [Organizer changes]
- Code quality: [Formatter changes]
- Refactoring: [Refactorer changes]

## Audit Findings Addressed
- X of Y findings resolved (Z%)

## Tests Status
- All tests passing
- Coverage: X%

## Git History
- Total commits: N
```

---

## Flow Diagram

```
/clean-team:clean [scope]
         │
═══════════════════════════
  PHASE 1: ANALYZE
═══════════════════════════
         │
         ▼
┌─────────────────┐
│    Organizer    │  Fix structure: moves, renames, deletes
│                 │  Commit: "chore(structure): ..."
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Formatter    │  Clean code: universal + type-specific
│                 │  Commit: "refactor(quality): ..."
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Auditor     │  Deep analysis + report
│                 │  Output: AUDIT-REPORT.md
└────────┬────────┘
         │
         ▼
┌ ─ ─ ─ ─ ─ ─ ─ ┐
  CHECKPOINT       User confirms: yes / no / review
└ ─ ─ ─ ┬ ─ ─ ─ ┘
         │ yes
═══════════════════════════
  PHASE 2: REFACTOR
═══════════════════════════
         │
         ▼
┌─────────────────┐
│     Tester      │  Coverage assessment + safety tests
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Planner     │  Phased refactoring roadmap
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Challenger    │  Gate: approve / revise / block
└────────┬────────┘
         │ approved
         ▼
┌─────────────────┐
│   Refactorer    │  Execute slices, commit per strategy
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Verifier     │  Gate: approve / route back / block
└────────┬────────┘
         │ approved
         ▼
      Complete
```

---

## Error Handling

### If Organizer Fails
- Report the error
- Ask user how to proceed (retry, skip, abort)

### If Formatter Fails
- Report the error
- Ask user: retry, skip to Auditor, or abort

### If Auditor Reports Test Failures
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

The workflow produces:

1. **2+ git commits** (Organizer, Formatter, plus Refactorer commits per slice)
2. **AUDIT-REPORT.md** with deep analysis, metrics, and prioritized findings
3. **Final summary** with overall outcome and findings addressed

---

## Examples

```bash
# Full project clean + audit + refactor
/clean-team:clean

# Scope to src/ directory
/clean-team:clean src/

# Scope to specific feature
/clean-team:clean src/features/auth/
```
