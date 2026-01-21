---
description: Run the full 5-agent diagnostic workflow for stubborn bugs and implementation mismatches. Use when normal approaches have failed.
argument-hint: <problem description or context>
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Diagnostic Workflow

You are running a **5-agent diagnostic workflow** for problems that resist normal fixes. This team specializes in closing the gap between **intent and reality**.

**Use this when:**
- You've tried multiple times and it's still wrong
- Something isn't working the way the user envisioned
- The root cause is unclear
- Previous fixes addressed symptoms but the problem returned

**This is NOT for:**
- Simple, obvious bugs (fix directly)
- New features (use implement-team)
- Code cleanup (use refactor-team)

---

## Operating Rules

- **Default:** Proceed autonomously with stated assumptions
- **User interruption:** Ask the user questions during Clarifier phase to nail down intent; after that, only interrupt for true blockers
- **Agent handoffs:** Always pass full context and artifacts to the next agent
- **Loop limits:** Max 2 revision cycles at Resolver/Validator gate
- **Intent is king:** "Tests pass" is necessary but not sufficient. The user must confirm satisfaction.

---

## Prerequisite Check

Before starting, verify:

```bash
git status  # Git initialized?
npm test    # Tests passing? (baseline)
```

- **Git missing?** Initialize it first
- **Baseline tests failing?** Note which ones — don't confuse pre-existing failures with new ones

---

## Workflow

### Step 1: Clarify the Problem

Invoke the **@clarifier** agent.

**Goal:** Close the gap between what the user says and what they mean.

Clarifier produces:
- **Problem Statement** with:
  - Expected behavior (concrete, testable)
  - Observed behavior (concrete, reproducible)
  - The delta between them
  - Reproduction steps
  - Success criteria

**Key interaction:** Clarifier will ask the user questions to nail down intent. This is the ONE phase where user interaction is expected.

**Early exit:** If the problem is already crystal clear, confirm and proceed.

**Output:** Problem Statement document

---

### Step 2: Investigate the Divergence

Invoke the **@investigator** agent with the Problem Statement.

**Goal:** Find WHERE reality diverges from intent.

Investigator produces:
- **Investigation Report** with:
  - Execution path traced
  - Checkpoints verified
  - Divergence point identified
  - Evidence collected

**No user interaction:** Investigator works autonomously.

**Output:** Investigation Report with divergence point

---

### Step 3: Hypothesize Root Cause

Invoke the **@hypothesizer** agent with Investigation findings.

**Goal:** Figure out WHY the divergence happens.

Hypothesizer produces:
- **Hypothesis Report** with:
  - Multiple theories generated (minimum 3)
  - Likelihood ranking
  - Tests designed for each
  - Tests executed
  - Root cause validated

**Loop condition:** If all hypotheses fail, generate new ones (max 2 rounds).

**Output:** Validated root cause with fix direction

---

### Step 4: Resolve the Issue

Invoke the **@resolver** agent with validated hypothesis.

**Goal:** Fix the root cause with minimal change.

Resolver produces:
- **Fix Report** with:
  - Failing test written first
  - Minimal fix implemented
  - Test now passes
  - All regressions checked
  - Clean commit

**TDD discipline:** No fix without a failing test first.

**Output:** Fix with tests and commit

---

### Step 5: Validate User Intent (GATE)

Invoke the **@validator** agent with Fix Report.

**Goal:** Confirm the fix satisfies user intent, not just tests.

Validator checks:
- All success criteria from Problem Statement
- Reproduction now shows expected behavior
- Edge cases handled
- No side effects
- **User confirms satisfaction**

Validator's decision:
- **APPROVE** → Complete
- **REVISE** → Route to Resolver with specific issues (max 2 rounds)
- **ESCALATE** → Manual intervention needed

**User interaction:** Validator will ask user to confirm the problem is solved.

---

### Step 6: Complete

If APPROVED, produce final summary:

```markdown
# Diagnosis Complete: [Problem Title]

## Problem
[What was wrong - from Problem Statement]

## Root Cause
[What caused it - from Hypothesis Report]

## Fix
[What was changed - from Fix Report]

## Verification
- Problem no longer reproduces: ✅
- All success criteria met: ✅
- User confirms intent satisfied: ✅
- Tests prevent regression: ✅

## Commit
[hash]: [message]

## Lessons Learned (Optional)
- [What made this bug tricky]
- [How to prevent similar bugs]

---

🎉 **Intent and reality are now aligned.**
```

---

## Routing Summary

```
User → Clarifier (understand intent)
           ↓
       Investigator (find WHERE)
           ↓
       Hypothesizer (find WHY)
           ↓
       Resolver (fix it)
           ↓
       Validator (GATE) ←──┐
           │               │
           ├─ APPROVE → Complete
           │               │
           └─ REVISE ──────┘ (max 2 rounds)
```

---

## When Things Go Wrong

### Can't Clarify Intent
User can't articulate what they want:
- Try concrete examples
- Show alternatives
- Define by negation ("what would be wrong?")
- If truly stuck, note uncertainty and proceed

### Can't Reproduce
Problem doesn't reproduce:
- Verify environment differences
- Check data/config
- Document conditions
- Proceed with caution if intermittent

### Can't Find Root Cause
All hypotheses fail after 2 rounds:
- Review investigation for missed clues
- Consider the problem might be environmental
- Document uncertainty, make best guess

### Fix Causes New Problems
Resolver's change breaks other things:
- Don't commit broken state
- Route back to Hypothesizer (different approach needed)

### User Still Unhappy
Validator reports user not satisfied after fix:
- Round 1: Revise with specific feedback
- Round 2: If still wrong, escalate - problem may be misunderstood

---

## User Input

**Arguments:** $ARGUMENTS

Parse the arguments as:
- **Problem context:** Any description the user provided
- **Files/paths mentioned:** Focus areas for investigation

If no arguments provided, Clarifier will begin by asking the user to describe the problem.
