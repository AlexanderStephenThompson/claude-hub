# Diagnose Team Plugin

**Version 1.0.0** — Intent-Reality Gap Closer

A 5-agent diagnostic team for when normal approaches fail. Handles stubborn bugs and implementation mismatches by systematically closing the gap between **intent** (what the user wants) and **reality** (what the code does).

## When to Use

Use diagnose-team when:
- You've tried multiple times and it's still wrong
- Something works but not the way you envisioned
- The root cause is unclear
- Previous fixes addressed symptoms but the problem returned
- "Close but not quite"

Do NOT use for:
- Simple, obvious bugs (fix directly)
- New features (use implement-team)
- Code cleanup (use refactor-team)

## The Team

```
Clarifier → Investigator → Hypothesizer → Resolver → Validator
                                                        ↑
                                                     (Gate)
```

| Agent | Role | Model |
|-------|------|-------|
| **Clarifier** | Entry point. Nails down what the user actually wants vs what's happening | Opus |
| **Investigator** | Traces execution to find WHERE reality diverges from intent | Opus |
| **Hypothesizer** | Generates and tests theories about WHY the divergence happens | Opus |
| **Resolver** | Implements the minimal fix using TDD discipline | Opus |
| **Validator** | Final gate. Confirms the fix satisfies user intent (not just tests) | Opus |

## Quick Start

```bash
# Run the diagnostic workflow
/diagnose-team:diagnose the search isn't returning expected results

# Or just start with context
/diagnose-team:diagnose
```

## How It Works

### Phase 1: Understand (Clarifier)

Most debugging failures happen because we solve the wrong problem. Clarifier prevents this by:
- Extracting what the user actually wants (expected behavior)
- Documenting what's actually happening (observed behavior)
- Defining the precise delta between them
- Establishing reproduction steps
- Getting user confirmation before proceeding

### Phase 2: Locate (Investigator)

Now that we know what's wrong, find where it happens:
- Maps the execution path
- Inserts checkpoints
- Traces data through the system
- Identifies the first point where expected ≠ actual

### Phase 3: Diagnose (Hypothesizer)

We know WHERE. Now figure out WHY:
- Generates multiple theories (minimum 3)
- Ranks by likelihood
- Designs tests to validate/invalidate each
- Executes tests
- Identifies the root cause

### Phase 4: Fix (Resolver)

With validated root cause, implement the fix:
- Writes a failing test that reproduces the bug FIRST
- Implements the minimal fix
- Verifies no regressions
- Creates clean commit

### Phase 5: Validate (Validator)

"Tests pass" isn't enough. Confirm user satisfaction:
- Checks all success criteria from Problem Statement
- Verifies reproduction now shows expected behavior
- Tests edge cases
- **Gets user confirmation** that intent is satisfied
- Approves / Routes back for revision / Escalates

## Key Principles

### Intent Over Tests
Tests prove code behavior. This team proves user satisfaction. "It passes tests" means nothing if the user is still unhappy.

### Root Cause Over Symptoms
If the bug keeps coming back, previous fixes addressed symptoms. This team digs deeper to find the actual cause.

### Minimal Change
Resolver makes the smallest fix that addresses the root cause. No "while I'm here" improvements.

### Test First
No fix without a failing test. This proves we understand the problem and prevents regression.

### User Confirmation Required
Validator gets explicit user confirmation. The user knows what they wanted—tests don't.

## Gating Logic

**Validator Gate:**
- **APPROVE:** Intent satisfied, problem resolved
- **REVISE:** Close but not quite, route back to Resolver (max 2 rounds)
- **ESCALATE:** Fundamentally wrong, needs manual intervention

## Two Problem Types

### Type 1: Bug
Something is objectively broken. Code should do X but does Y.

**Focus:** Find the error and fix it.

### Type 2: Mismatch
Code works as built, but that's not what the user wanted. The spec was wrong or intent was misunderstood.

**Focus:** Understand what user actually wants, then adjust.

Both types benefit from the same workflow—closing the intent-reality gap.

## Components

### Agents (5)

All in `agents/`:
- `clarifier.md` — Understand intent vs reality
- `investigator.md` — Find divergence point
- `hypothesizer.md` — Root cause analysis
- `resolver.md` — Minimal TDD fix
- `validator.md` — Verify user satisfaction

### Skills Inheritance by Agent

| Agent | Inherits | Why |
|-------|----------|-----|
| Clarifier | code-quality | Understands quality standards |
| Investigator | code-quality, architecture | Traces through architecture |
| Hypothesizer | code-quality, architecture | Analyzes root causes in context |
| Resolver | code-quality, code-standards | Implements fixes with TDD |
| Validator | code-quality | Validates against quality criteria |

### Commands (1)

- `/diagnose-team:diagnose <problem>` — Run full workflow

## File Structure

```
diagnose-team/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── agents/
│   ├── clarifier.md          # Step 1: Understand intent
│   ├── investigator.md       # Step 2: Find divergence
│   ├── hypothesizer.md       # Step 3: Root cause
│   ├── resolver.md           # Step 4: Fix it
│   └── validator.md          # Step 5: Verify intent (Gate)
├── commands/
│   └── diagnose.md           # Full workflow command
└── README.md
```

## Design Philosophy

### Why 5 Agents?

Each agent has one clear job:
1. **Clarifier:** Understand the problem
2. **Investigator:** Find where it happens
3. **Hypothesizer:** Figure out why
4. **Resolver:** Fix it minimally
5. **Validator:** Confirm it's right

Separation prevents conflation. You can't fix what you don't understand.

### Why Clarifier First?

Most "debugging" fails because we're solving the wrong problem. Clarifier forces articulation of intent before any investigation.

### Why Hypothesizer?

"The bug is in line 42" isn't enough. Knowing WHERE doesn't tell us WHY. Hypothesizer generates and tests theories to find root cause.

### Why Validator?

Tests prove code behavior. They don't prove user satisfaction. A bug can be "fixed" (tests pass) but the user is still unhappy. Validator catches this.

## Author

Alexander Thompson — Information Designer & Systems Thinker
