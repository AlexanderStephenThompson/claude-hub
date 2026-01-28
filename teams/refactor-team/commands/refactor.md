---
description: Run the full 7-agent refactoring workflow. Fully automated with gated decisions at planning and verification stages.
argument-hint: [path] [focus area or guidance]
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Full Refactoring Workflow

You are running a **fully automated 7-agent refactoring workflow**. The user should not be interrupted with progress checks.

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

Before starting, verify:

```bash
git status  # Git initialized?
npm test    # Tests passing? (or equivalent)
```

- **Git missing?** Initialize it (`git init`, initial commit)
- **Tests fail?** Fix them first. Do not refactor on a broken baseline.

---

## Workflow

### Step 1: Check for Existing Audit

Check if a previous audit report exists using the Glob tool to search for `AUDIT-REPORT*.md` in the current directory.

**Report the result to the user:**

If audit found:
```
✓ Step 1 Complete: Found AUDIT-REPORT-[date].md
  This pre-existing analysis will accelerate the refactoring process.
  The Explorer will validate and build upon these findings.
```

If no audit found:
```
✓ Step 1 Complete: No existing audit found
  The Explorer will perform a fresh codebase analysis.
```

---

### Step 2: Explore

Invoke the **@explorer** agent.

Explorer produces:
- Project Understanding Document
- Architecture overview
- Current patterns and conventions
- Light notes on improvement areas

**Early exit:** If codebase already follows best practices → Report "No Refactoring Needed"

---

### Step 3: Research

Invoke the **@researcher** agent with Explorer's findings.

Researcher produces:
- Best Practices Report
- Universal + project-type-specific standards
- Recommendations prioritized by impact

**Early exit:** If already compliant → Report "Already Compliant"

---

### Step 4: Assess Tests

Invoke the **@tester** agent with Researcher's best practices.

Tester produces:
- Test Coverage Report
- Gaps identified
- New tests written (if needed)
- Readiness status

**Stop condition:** If critical areas can't be safely tested → Ask user whether to proceed with risk

---

### Step 5: Plan Refactoring

Invoke the **@planner** agent with all upstream findings.

Planner produces:
- Refactoring Roadmap
- Phases (Small → Medium → Large)
- Specific slices with commit strategies

---

### Step 5.1: Challenge the Plan (GATE)

Invoke the **@challenger** agent for roadmap review.

Challenger's decision:
- **Approve** → Proceed to Step 6
- **Revise** → Send to Planner, then re-run 5.1 only (max 2 cycles)
- **Block** → Stop. Ask user for missing info

**Do NOT loop back to Steps 1-4 on "Revise."**

---

### Step 6: Refactor (Execution)

Invoke the **@refactorer** agent with approved roadmap.

Refactorer executes:
- Slice by slice
- Semantic branches per slice
- Commits per strategy
- Tests after each slice

Refactorer produces:
- Practical Summary Report
- What changed and why
- How codebase is better

---

### Step 7: Verify Results (GATE)

Invoke the **@verifier** agent with completed work.

Verifier's decision:
- **Approve** → Proceed to Step 8
- **Route back** → Send to appropriate agent (max 2 cycles)
- **Block** → Stop. Escalate to user

**Do NOT full re-refactor on "Route back."** Fixes are targeted.

---

### Step 8: Finalize + Report

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

## Tests Status
- All tests passing: ✅
- Coverage: X%

## Git History
- Total commits: N
- All merged and clean: ✅

## Follow-ups (If Any)
- [Only if truly needed]
```

---

## User Input

**Arguments:** $ARGUMENTS

Parse the arguments:
- **Path**: First argument (or `.` if not provided)
- **Focus** (optional): Any additional text after the path — use this to prioritize specific areas, modules, or concerns throughout the workflow
