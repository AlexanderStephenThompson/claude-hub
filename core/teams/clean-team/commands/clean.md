---
description: Run the 3-agent clean phase — organize, format, then audit
argument-hint: [scope — e.g., "src/" or leave empty for full project]
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Task
---

# /clean-team:clean

Run the 3-agent clean phase to organize structure, clean code, and produce an audit report.

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
6. Hand off to Formatter

### Step 2: Formatter

**Question:** "Is the code clean?"

Invoke the **Formatter** agent to:
1. Detect project type (web, unity, python, data, or generic)
2. Run universal cleaning (unused imports, dead code, magic numbers, debug stmts)
3. Load and apply project-type-specific profile from `assets/cleaning-profiles/`
4. Commit changes
5. Hand off to Auditor

### Step 3: Auditor

**Question:** "What does the full picture look like?"

Invoke the **Auditor** agent to:
1. Explore the codebase deeply (architecture, modules, patterns, data flow)
2. Analyze against best practices for this project type
3. Run tests and collect before/after metrics
4. Generate AUDIT-REPORT.md with structured findings
5. Report results to user

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
      Complete
         │
   User reviews AUDIT-REPORT.md
         │
         ▼
   /clean-team:refactor (Phase 2)
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

---

## Output

The workflow produces:

1. **2 git commits** (one per modifying agent: Organizer, Formatter)
2. **AUDIT-REPORT.md** with deep analysis, metrics, and prioritized findings
3. **Console summary** with key results and next steps

---

## Examples

```bash
# Full project cleanup and audit
/clean-team:clean

# Scope to src/ directory
/clean-team:clean src/

# Scope to specific feature
/clean-team:clean src/features/auth/
```
