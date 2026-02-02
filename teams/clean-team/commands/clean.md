---
description: Run the 4-agent codebase hygiene workflow
argument-hint: [scope — e.g., "src/" or leave empty for full project]
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# /clean-team:clean

Run the 4-agent cleanup pipeline to organize structure, clean UI code, and polish code quality.

## Scope

$ARGUMENTS

If a scope is provided above, focus cleanup on that directory. Otherwise, clean the full project.

---

## Operating Rules

1. **Autonomous execution** — Agents run without interruption unless they encounter a failure
2. **Commit per agent** — Each agent commits its changes before handing off
3. **Ask on restructuring** — Only major structural changes require user approval
4. **Skip when appropriate** — Stylist skips if no web files exist
5. **Honest verification** — Report failures even if cleanup caused them

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

### Step 1: Organizer

**Question:** "Can I navigate this codebase?"

Invoke the **Organizer** agent to:
1. Audit project structure (root, folders, files, naming, docs)
2. Execute quick tidies (deletes, renames, moves)
3. Execute reorganization (merges, splits, import updates)
4. Ask before any major restructuring
5. Commit changes
6. Hand off to Stylist

### Step 2: Stylist

**Question:** "Is the UI code clean?"

**Skip condition:** If no CSS/HTML/JSX/TSX files exist, skip to Polisher.

Invoke the **Stylist** agent to:
1. Count CSS files and compare to ≤5 target
2. Consolidate CSS to 5-file structure (tokens, base, layouts, components, utilities)
3. Fix HTML semantics (divs → semantic elements)
4. Remove inline styles, deduplicate rules
5. Commit changes
6. Hand off to Polisher

### Step 3: Polisher

**Question:** "What else needs improving?"

Invoke the **Polisher** agent to:
1. Find dead code (unused imports, variables, functions)
2. Find quality issues (magic numbers, debug statements, commented code)
3. Execute safe fixes only
4. Flag risky changes for user review
5. Commit changes
6. Hand off to Verifier

### Step 4: Verifier

**Question:** "Did we break anything?"

Invoke the **Verifier** agent to:
1. Run tests (if they exist)
2. Collect before/after metrics
3. Generate CLEANUP-REPORT.md
4. Report results to user

---

## Flow Diagram

```
/clean-team:clean [scope]
         │
         ▼
┌─────────────────┐
│    Organizer    │  Fix structure: moves, renames, deletes
│                 │  Commit: "chore(structure): ..."
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Stylist     │  Clean UI: CSS consolidation, HTML fixes
│   (skip if no   │  Commit: "style(ui): ..."
│    web files)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Polisher     │  Polish code: dead code, constants
│                 │  Commit: "refactor(quality): ..."
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Verifier     │  Verify: tests, metrics, report
│                 │  Output: CLEANUP-REPORT.md
└────────┬────────┘
         │
         ▼
      Complete
```

---

## Error Handling

### If Organizer Fails
- Report the error
- Ask user how to proceed (retry, skip, abort)

### If Stylist Fails
- Report the error
- CSS consolidation is critical — don't skip lightly
- Ask user: retry, proceed without UI cleanup, or abort

### If Polisher Fails
- Report the error
- Polisher fixes are lower risk — can proceed to Verifier
- Ask user: retry, skip to Verifier, or abort

### If Verifier Reports Test Failures
- Do NOT auto-fix
- Report which tests failed and likely cause
- User decides next steps

---

## Output

The workflow produces:

1. **3 git commits** (one per executing agent)
2. **CLEANUP-REPORT.md** with full metrics and summary
3. **Console summary** with key results

---

## Examples

```bash
# Full project cleanup
/clean-team:clean

# Scope to src/ directory
/clean-team:clean src/

# Scope to specific feature
/clean-team:clean src/features/auth/
```
