---
description: Run the full 5-agent diagnostic workflow for stubborn bugs and implementation mismatches
argument-hint: <problem description>
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

You are running a fully automated 5-agent diagnostic workflow. The user should not be interrupted with progress checks. Only ask the user a question if there is a true blocker (Clarifier cannot produce a Problem Statement) or a Validator APPROVE confirmation.

---

## When to Use This Command

- You've tried multiple fixes and it's still wrong
- Something works but not how you envisioned
- The root cause is unclear after previous attempts
- Previous fixes addressed symptoms but the problem returned
- "Close but not quite" situations

---

## Operating Rules

- **Default**: Proceed autonomously with stated assumptions.
- **Max user interruption**: The Clarifier may ask ONE question if truly blocking. The Validator asks for confirmation on APPROVE. No other interruptions.
- **Agent handoffs**: Always pass full context and the latest artifacts (Problem Statement, Investigation Report, Hypothesis Report, Fix Summary).
- **Gating decisions**: Validator makes APPROVE / REVISE / ESCALATE decisions.
- **Loop policy**: Handle REVISE automatically (max 2 rounds back to Resolver); ESCALATE on fundamental issues or after 2 failed rounds.
- **Scope discipline**: Fix the identified root cause. Nothing else. No "while I'm here" improvements.

---

## Prerequisite Check

Before starting, verify:
- Git initialized in target directory (`git status` works)
- Working directory clean (no uncommitted changes that would complicate debugging)
- Tests passing (if test suite exists) — establishes a known-good baseline

If git is missing: Note it but proceed (git is helpful, not required).
If tests fail: Note the failures as baseline context. These are pre-existing issues, not caused by the current problem.

---

## Two Problem Types

Classify during Clarifier phase:

**Type 1: Bug** — Something is objectively broken. Code should do X but does Y.
- Investigation traces execution to find WHERE it breaks
- Hypothesis explains WHY it breaks
- Fix corrects the specific breakage

**Type 2: Mismatch** — Code works as built, but that's not what the user wanted.
- Investigation maps current behavior vs. intended behavior
- Hypothesis identifies WHERE the design diverges from intent
- Fix closes the gap between implementation and intent

---

## Workflow

### Step 1: Clarify

Invoke the Clarifier agent with the problem description.

The Clarifier will:
1. Absorb the user's problem description and any referenced code/logs
2. Extract expected behavior (intent) and observed behavior (reality)
3. Classify as Bug or Mismatch
4. Produce a Problem Statement with:
   - Expected and observed behavior
   - The precise delta
   - Reproduction steps
   - What has been tried
   - Testable success criteria
   - Explicit assumptions

The Clarifier may ask the user ONE question if something is truly ambiguous. Otherwise, it states assumptions and proceeds.

**Output**: Problem Statement with success criteria.

### Step 2: Investigate

Invoke the Investigator agent with the Problem Statement.

The Investigator will:
1. Map the execution path from entry point to observed behavior
2. Trace step by step, comparing expected vs. observed at each step
3. Find the exact point of divergence
4. Document evidence for the divergence
5. Analyze why previous fix attempts were insufficient

**Output**: Investigation Report with execution trace and divergence point.

### Step 3: Hypothesize

Invoke the Hypothesizer agent with the Investigation Report.

The Hypothesizer will:
1. Generate 2-5 ranked hypotheses about WHY the divergence exists
2. Distinguish proximate causes from root causes
3. Design and run validation tests for each hypothesis
4. Select the most probable root cause
5. Define a fix direction for the Resolver
6. Explain why previous fixes failed

**Output**: Hypothesis Report with validated root cause and fix direction.

### Step 4: Resolve

Invoke the Resolver agent with the Hypothesis Report.

The Resolver will:
1. Write a failing test that reproduces the root cause
2. Implement the minimal fix that makes the test pass
3. Run the full test suite to verify no regressions
4. Verify against each success criterion from the Problem Statement
5. Document what changed and what was NOT changed (scope discipline)

**Output**: Fix Summary with test proof and success criteria verification.

### Step 5: Validate (Gate)

Invoke the Validator agent with the Fix Summary and original Problem Statement.

The Validator will:
1. Run the reproduction steps from the Problem Statement
2. Verify every success criterion independently
3. Check that the fix targets the root cause, not a symptom
4. Check for regressions
5. Make a decision:

**APPROVE** → Fix satisfies user intent. Confirm with user.
**REVISE** → Fix is close but not complete. Route back to Resolver with specific feedback (max 2 rounds).
**ESCALATE** → Fix is fundamentally wrong or pipeline cannot resolve. Explain to user what needs manual intervention.

### Handling REVISE

When the Validator returns REVISE:
1. Route the Validator's specific feedback to the Resolver
2. Resolver writes a new failing test for the gap, extends the fix
3. Resolver returns updated Fix Summary
4. Validator re-evaluates
5. Max 2 rounds. After round 2: must APPROVE or ESCALATE.

### Handling ESCALATE

When the Validator returns ESCALATE:
1. Present the ESCALATE decision to the user
2. Include what was accomplished (partial progress)
3. Include why the pipeline cannot complete
4. Include specific recommendations for manual intervention
5. Pipeline stops.

---

## Final Summary

After APPROVE (and user confirmation), produce a concise summary:

```markdown
## Diagnosis Complete

### Problem
[One sentence summary of the original problem]

### Root Cause
[One sentence summary of the root cause found]

### Fix Applied
[One sentence summary of what was changed]

### Files Changed
- [file 1]: [what changed]
- [file 2]: [what changed]

### Tests Added
- [test name]: [what it verifies]

### Success Criteria
- [x] [Criterion 1] — verified
- [x] [Criterion 2] — verified
- [x] [Criterion 3] — verified

### Key Insight
[Why previous fixes failed and why this one will stick — the most valuable learning from the diagnosis]
```

---

## Key Principles

1. **Intent Over Tests** — Tests prove code behavior. This team proves user satisfaction.
2. **Root Cause Over Symptoms** — If the bug keeps coming back, previous fixes addressed symptoms.
3. **Minimal Change** — Smallest fix that addresses the root cause.
4. **Test First** — No fix without a failing test.
5. **User Confirmation Required** — Validator gets explicit user confirmation on APPROVE.

---

## Problem to Diagnose

$ARGUMENTS
