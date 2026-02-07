# Diagnose Team Plugin

**Version 1.0.0** -- Diagnostic Workflow for Stubborn Bugs and Implementation Mismatches

A 5-agent diagnostic team for Claude Code that clarifies the problem, investigates the divergence, hypothesizes the root cause, resolves with a minimal TDD fix, and validates against user intent. Autonomous with a gated validation step.

## The Team

```
User Problem --> Clarifier --> Investigator --> Hypothesizer --> Resolver --> Validator
                                                                                |
                                                                             (Gate)
```

| Agent | Role | Model | Color |
|-------|------|-------|-------|
| **Clarifier** | Extracts precise problem definition (intent vs. reality) | Opus | Cyan |
| **Investigator** | Traces execution to find exact point of divergence | Opus | Blue |
| **Hypothesizer** | Generates and validates root cause theories | Opus | Purple |
| **Resolver** | Implements minimal TDD fix targeting root cause | Opus | Green |
| **Validator** | Verifies fix satisfies user intent (Gate) | Opus | Yellow |

## When to Use

- You've tried multiple fixes and it's still wrong
- Something works but not how you envisioned
- The root cause is unclear after previous attempts
- Previous fixes addressed symptoms but the problem returned
- "Close but not quite" situations

## Two Problem Types

| Type | Description | Example |
|------|-------------|---------|
| **Bug** | Something is objectively broken. Code should do X but does Y. | Search returns duplicates despite DISTINCT |
| **Mismatch** | Code works as built, but that's not what the user wanted. | Pagination works but user expected infinite scroll |

## Prerequisites

- **Git** -- Recommended for change tracking and history analysis
- **Test framework** -- Project should have a working test suite for TDD fix cycle

## Installation

```bash
# Load for a single session (from parent directory)
claude --plugin-dir ./diagnose-team

# Or with full path
claude --plugin-dir "path/to/diagnose-team"

# Validate plugin structure
claude plugin validate ./diagnose-team
```

## Quick Start

```bash
# Run the full 5-agent diagnostic workflow
/diagnose-team:diagnose "Search results keep returning duplicates no matter what I try"

# Or invoke individual agents
@clarifier "The auth redirect keeps breaking after every fix"
@investigator  # after clarifier produces Problem Statement
@hypothesizer  # after investigator produces Investigation Report
@resolver      # after hypothesizer produces Hypothesis Report
@validator     # after resolver produces Fix Summary
```

## How It Works

### Autonomous Execution

The workflow runs autonomously with minimal user interruption. You'll only be asked a question if the Clarifier cannot produce a Problem Statement without it (max ONE question), or when the Validator seeks your confirmation on APPROVE.

### The Validator Gate

The Validator is the quality gate with three possible decisions:

1. **APPROVE** -- All success criteria met, root cause addressed, user confirms
2. **REVISE** -- Close but incomplete, routes back to Resolver with specific feedback (max 2 rounds)
3. **ESCALATE** -- Pipeline cannot resolve, needs manual intervention

### Key Principles

1. **Intent Over Tests** -- Tests prove code behavior. This team proves user satisfaction.
2. **Root Cause Over Symptoms** -- If the bug keeps coming back, previous fixes addressed symptoms.
3. **Minimal Change** -- Smallest fix that addresses the root cause.
4. **Test First** -- No fix without a failing test.
5. **User Confirmation Required** -- Validator gets explicit user confirmation.

## Workflow Phases

### Phase 1: Clarify (Clarifier)

- Extract expected behavior (user intent) and observed behavior (reality)
- Identify the precise delta between them
- Classify as Bug or Mismatch
- Document reproduction steps and what has been tried
- Define testable success criteria

### Phase 2: Investigate (Investigator)

- Map execution path from entry point to observed behavior
- Trace step by step, comparing expected vs. observed
- Find the exact point of divergence
- Analyze why previous fix attempts were insufficient
- Document evidence for the divergence

### Phase 3: Hypothesize (Hypothesizer)

- Generate 2-5 ranked hypotheses about the root cause
- Distinguish proximate causes from root causes
- Design and run validation tests for each hypothesis
- Select the most probable root cause
- Define fix direction for the Resolver

### Phase 4: Resolve (Resolver)

- Write a failing test that reproduces the root cause
- Implement the minimal fix that makes it pass
- Run full test suite to verify no regressions
- Verify against every success criterion
- Document scope discipline (what was NOT changed)

### Phase 5: Validate (Validator -- Gate)

- Run reproduction steps from Problem Statement
- Verify every success criterion independently
- Check fix targets root cause, not symptom
- Make decision: APPROVE / REVISE / ESCALATE
- On APPROVE: confirm with user

## Components

### Agents (5)

All in `agents/`:
- `clarifier.md` -- Problem definition and intent extraction
- `investigator.md` -- Systematic divergence tracing
- `hypothesizer.md` -- Root cause analysis and validation
- `resolver.md` -- Minimal TDD fix implementation
- `validator.md` -- Intent verification gate

### Skills Inheritance by Agent

| Agent | Inherits | Why |
|-------|----------|-----|
| Clarifier | code-quality | Understands code structure for problem extraction |
| Investigator | code-quality, architecture | Traces execution across architectural boundaries |
| Hypothesizer | code-quality, architecture | Analyzes root causes across system design |
| Resolver | code-quality | Implements TDD fixes following code standards |
| Validator | code-quality | Verifies fix quality and intent alignment |

### Commands (1)

- `/diagnose-team:diagnose <problem>` -- Run full diagnostic workflow

## File Structure

```
diagnose-team/
+-- .claude-plugin/
|   +-- plugin.json              # Plugin manifest (v1.0.0)
+-- agents/
|   +-- clarifier.md             # Step 1: Problem definition
|   +-- investigator.md          # Step 2: Divergence tracing
|   +-- hypothesizer.md          # Step 3: Root cause analysis
|   +-- resolver.md              # Step 4: Minimal TDD fix
|   +-- validator.md             # Step 5: Intent verification gate
+-- commands/
|   +-- diagnose.md              # Full diagnostic workflow command
+-- README.md
```

## Design Principles

### Team Philosophy

- **Intent over tests** -- User satisfaction is the measure of success, not test coverage
- **Root cause over symptoms** -- Find why it keeps breaking, not just what's broken
- **Minimal change** -- Smallest fix that addresses the root cause
- **Test first** -- Every fix is proven by a test that failed before and passes after
- **Autonomous pipeline** -- Minimal user interruption with a clear gate for confirmation
- **Bounded loops** -- Max 2 revision rounds prevents infinite cycles
- **Responsible escalation** -- ESCALATE is a valid outcome, not a failure

### How This Differs from Implement-Team

The implement-team builds NEW features. The diagnose-team fixes EXISTING problems.

| Aspect | Implement-Team | Diagnose-Team |
|--------|----------------|---------------|
| Entry point | Feature request | Problem description |
| Focus | What to build | What's wrong |
| Planning | Slice plans | Problem statements |
| Review | Plan + diff review | Root cause validation |
| Gate | Challenger (Ship/Fix/Stop) | Validator (Approve/Revise/Escalate) |
| Scope | Feature scope | Minimal fix scope |
| User role | Provides requirements | Confirms fix matches intent |

## Author

Alexander Thompson -- Information Designer & Systems Thinker
