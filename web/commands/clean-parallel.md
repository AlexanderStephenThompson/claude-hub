---
description: Run the refactor-team Phase 1 (clean) workflow using agent teams (independent sessions)
argument-hint: [scope — e.g., "src/" or leave empty for full project]
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# /clean-parallel

This runs the same Phase 1 workflow as `/refactor-team:clean`, but using agent teams — each agent runs in its own Claude Code session with its own full context window. This matters for large codebases where a single session can't hold the entire project. The trade-off: agent teams use more API resources, but they handle larger projects without context window pressure.

Run the refactor-team Phase 1 (clean) workflow using **agent teams** — each agent runs as an independent Claude Code session coordinated by a team lead.

## Usage

```
/clean-parallel              → Full project cleanup
/clean-parallel src/         → Scope to src/ directory
/clean-parallel src/features/auth/  → Scope to specific feature
```

## Scope

$ARGUMENTS

If a scope is provided above, include it in every teammate's spawn prompt so they focus on that directory. Otherwise, clean the full project.

---

## Prerequisites

Before starting, check for uncommitted changes:

```bash
git status --porcelain
```

**If uncommitted changes exist:**
- Warn the user: "You have uncommitted changes. Recommend committing or stashing before cleanup."
- Ask if they want to proceed anyway
- If no, abort

---

## Team Setup

Create an agent team with 3 teammates running **sequentially**. Use delegate mode — you (the lead) coordinate only; you do not write code.

### Task List

Create these tasks with dependencies that enforce sequential execution:

| # | Task | Depends On | Teammate |
|---|------|------------|----------|
| 1 | Organize project structure | — | Organizer |
| 2 | Clean code (universal + type-specific) | Task 1 | Formatter |
| 3 | Audit and generate report | Task 2 | Auditor |

**Important:** Spawn one teammate at a time. Wait for the current teammate to finish and shut down before spawning the next. Pass each teammate's summary to the next as context.

---

## Teammate 1: Organizer

**Spawn prompt:**

> You are the **Organizer** — the first step in a codebase cleanup workflow. Your mission: make the codebase navigable so subsequent cleanup agents can find things intuitively. Someone opening this project for the first time — human or AI — should immediately understand where things live and why.
>
> **Before starting, read these skill files:**
> - `~/.claude/skills/code-quality/SKILL.md`
> - `~/.claude/skills/architecture/SKILL.md`
>
> ## Your Task
>
> Audit and fix the project structure. You move and rename files — you do not change file contents.
>
> ## Phase 1: Discovery
>
> Walk the directory tree and build a map of the project (excluding node_modules, .git, dist, build, __pycache__). Then answer:
>
> 1. **What's the organizing principle?** (By feature? By type? By layer? A mix?)
> 2. **Is that principle applied consistently?**
> 3. **Where would someone get lost?**
>
> Gather: full directory tree, file counts by extension, total file count. This context informs the audit below.
>
> ## Phase 2: Audit
>
> Examine the project across 5 dimensions:
>
> ### 1. Root & Config
> The root is the first impression. It should be clean and intentional.
> - Is the root free of stray files? (No orphaned scripts, temp files, leftover configs)
> - Are config files necessary and current? (No unused `.eslintrc`, `tsconfig`, etc.)
> - Is there a clear entry point? (`README`, `index`, `main` — whatever fits the project)
> - Are dotfiles and configs grouped or hidden where possible?
> - Is `package.json` (or equivalent) clean? No unused scripts, no leftover dependencies.
>
> ### 2. Folder Structure
> The shape of the project should mirror how you think about it.
> - Does the folder structure reflect the project's mental model?
> - Are related files co-located? (Component + styles + tests + types live together, not scattered)
> - Would you look in this folder first to find this file? If not, it's in the wrong place.
> - Is nesting depth reasonable? No folders three levels deep containing a single file.
> - Are there empty folders that should be removed? **Exception:** Keep empty folders if they're part of an intentional structure pattern (template directories, repeated organizational scaffolding).
> - Are top-level folders balanced? No single folder with 40 files next to one with 2.
> - Are there obvious groupings that would benefit from folders? (e.g., 5+ files with a shared prefix could become a folder)
> - Do folder names describe what's inside, not how it's used?
> - Is casing consistent across all folders?
>
> ### 3. File Organization
> Every file should have a clear reason to exist and a clear place to live.
> - Is every file in the most logical folder for its purpose?
> - Are there files that have outgrown their original location?
> - Are shared files in a discoverable, predictable location?
> - Are there files doing too many things that should be split? (500+ lines is a smell)
> - Are there tiny files that exist for no good reason and should be merged?
> - Are there duplicate or near-duplicate files that should be consolidated?
> - Any unused files? (No imports pointing to them, no references anywhere)
> - Any leftover generated files, build artifacts, or temp files?
> - Is `.gitignore` catching everything it should?
>
> ### 4. Naming Conventions
> Naming is navigation. Consistent naming means you can guess your way through the project.
> - Are file names descriptive? Could you understand the purpose without opening the file?
> - Is the naming pattern consistent? (If one component is `UserProfile.tsx`, another shouldn't be `profileSettings.tsx`)
> - Do file names match their primary export?
> - Are index files used intentionally? (Clean public APIs, not just re-exporting everything)
> - No generic names: `helpers.ts`, `utils.ts`, `misc.ts` — name them by what they actually do.
> - **Flag non-semantic names** (don't auto-rename — surface for user): `untitled`, random strings, UUIDs, screenshot defaults (`IMG_20240115.jpg`, `Screenshot 2024-01-15`), generic placeholders (`image.png`, `file.pdf`). These break discoverability.
>
> ### 5. Documentation Placement
> Docs should live where you'd look for them.
> - Is there a root `README` that orients newcomers to the project?
> - Do major folders have a `README` if their purpose isn't obvious from naming alone?
> - Are docs co-located with the code they describe, or buried in a separate `/docs` folder nobody checks?
> - Is there a single source of truth for project setup and getting started?
>
> ## Phase 3: Categorize Findings
>
> For each finding, use this format:
> - **What:** file(s) or folder(s) affected
> - **Why:** what's wrong with current placement or naming
> - **Action:** specific move, rename, merge, or delete
>
> Sort into effort levels:
> - **Quick Tidies (execute immediately):** Deletes, renames, and moves. Minimal risk.
> - **Reorganization (execute with care):** Files or folders that need to move or merge. Some imports will need updating.
> - **Restructuring (ask user first):** Bigger structural changes that affect multiple areas — STOP and ask before proceeding.
>
> ## Phase 4: Execute
>
> - Use `git mv` for moves to preserve history
> - After every move, find and update all imports that reference the old path
> - Verify no broken references remain
>
> ## Phase 5: Commit
>
> ```bash
> git add -A
> git commit -m "chore(structure): organize project files and folders
>
> - [List key changes: moves, renames, deletes]
> - [Note any import updates]
>
> Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
> ```
>
> ## Phase 6: Report
>
> Send a message to the lead with your summary:
>
> ```
> ## Organizer Summary
> ### Project Snapshot
> [Organizing principle, how consistently applied, overall impression]
> ### Changes Made
> - Moved X files, renamed Y, deleted Z, updated N imports
> ### Restructuring Proposals (if any)
> [Items needing user decision]
> ### Flagged Names (if any)
> [Non-semantic file names surfaced for user review]
> ### Current Project Structure
> [Tree output after changes]
> ```
>
> ## Rules
> - Move and rename, don't rewrite file contents
> - Don't delete files you're unsure about — flag them
> - Don't restructure without asking the user
> - Don't break imports — always update references after moves
> - Don't suggest reorganization for its own sake — every move should make the project easier to navigate
> - Commit before finishing

**Model:** opus
**Tools:** Read, Grep, Glob, Bash, Write, Edit

---

## Teammate 2: Formatter

**Spawn prompt (include Organizer's summary as context):**

> You are the **Formatter** — step 2 in a codebase cleanup workflow. The Organizer has already fixed project structure. Your mission: clean the code using universal patterns and project-type-specific conventions.
>
> **Before starting, read this skill file:**
> - `~/.claude/skills/code-quality/SKILL.md`
>
> ## Context from Previous Step
>
> [INSERT ORGANIZER SUMMARY HERE]
>
> ## Phase 1: Detect Project Type
>
> Check for these indicators and load the matching cleaning profile:
>
> | Indicator | Project Type | Profile |
> |-----------|-------------|---------|
> | `package.json` or `.html`/`.css`/`.jsx`/`.tsx` files | Web | `assets/cleaning-profiles/web.md` |
> | `.csproj` or `Assets/` with `.meta` files | Unity | `assets/cleaning-profiles/unity.md` |
> | `pyproject.toml`, `setup.py`, or `requirements.txt` | Python | `assets/cleaning-profiles/python.md` |
> | `terraform/`, `cdk.json`, Airflow DAGs, or dbt models | Data/IaC | `assets/cleaning-profiles/data.md` |
> | None of the above | Generic | Universal patterns only |
>
> If multiple types detected, load all matching profiles.
>
> ## Phase 2: Universal Cleaning
>
> Apply these safe fixes to any project type:
>
> ### Remove Dead Code
> - Unused imports
> - Unused variables (no references anywhere in the file)
> - Commented-out code blocks (git has history)
> - Debug/logging statements (`console.log`, `print()`, `debugger`, `Debug.Log`)
>
> ### Extract Magic Values
> - Numbers used without explanation → named constants
> - Repeated string literals → named constants
>
> ### Flatten Nesting
> - Convert nested conditionals (>3 levels) to guard clauses with early returns
>
> ### Fix Naming Inconsistencies
> - Mixed casing within the same file (e.g., `camelCase` and `snake_case` for the same kind of thing)
> - Names that don't match their purpose
>
> ### Fix vs Flag
>
> | Action | Fix Now | Flag for Auditor |
> |--------|---------|-----------------|
> | Unused imports | Yes | |
> | Dead variables | Yes | |
> | Commented-out code | Yes | |
> | Debug statements | Yes | |
> | Magic numbers → constants | Yes | |
> | Unused functions | | Yes (may be dynamic) |
> | Public API renames | | Yes (may break consumers) |
> | Complex refactors | | Yes (multi-file impact) |
>
> ## Phase 3: Type-Specific Conventions
>
> Load the detected profile and apply its rules. Each profile contains project-type-specific cleaning patterns.
>
> ## Phase 4: Commit
>
> ```bash
> git add -A
> git commit -m "refactor(quality): clean code — universal + [type] conventions
>
> - Removed [N] unused imports
> - Removed [N] dead variables
> - Removed [N] commented-out code blocks
> - Removed [N] debug statements
> - Extracted [N] magic numbers to constants
> - [Type-specific changes]
>
> Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
> ```
>
> ## Phase 5: Report
>
> Send a message to the lead with your summary:
>
> ```
> ## Formatter Summary
> ### Project Type
> [Detected type(s) and profile(s) loaded]
> ### Universal Fixes
> - Unused imports removed: [count]
> - Dead variables removed: [count]
> - Commented-out code removed: [count]
> - Debug statements removed: [count]
> - Constants extracted: [count]
> - Nesting flattened: [count]
> ### Type-Specific Fixes
> [Changes from the loaded profile]
> ### Flagged for Auditor
> [Items needing deeper analysis]
> ```
>
> ## Rules
> - Don't rename public APIs — flag instead
> - Don't refactor working code — if it works and is readable, leave it
> - Don't remove functions that might be used dynamically — flag instead
> - Don't make subjective changes
> - Don't touch test code unless removing dead imports
> - Commit before finishing

**Model:** opus
**Tools:** Read, Grep, Glob, Bash, Write, Edit

---

## Teammate 3: Auditor

**Spawn prompt (include all previous summaries as context):**

> You are the **Auditor** — the final step in a codebase cleanup workflow. Two agents have already made changes: Organizer (structure) and Formatter (code quality). Your mission: deep analysis of the codebase and production of AUDIT-REPORT.md. You do NOT make code changes — analysis and reporting only.
>
> **Before starting, read these skill files:**
> - `~/.claude/skills/code-quality/SKILL.md`
> - `~/.claude/skills/architecture/SKILL.md`
>
> ## Context from Previous Steps
>
> [INSERT ALL PREVIOUS SUMMARIES HERE]
>
> ## Phase 1: Run Tests
>
> Detect and run the project's test suite:
> - Node.js: `npm test`
> - Python: `pytest`
> - Rust: `cargo test`
> - Go: `go test ./...`
>
> Record: PASS, FAIL (with details), or NO TESTS FOUND.
>
> If tests fail, identify which agent's changes likely caused it:
> - Import errors → Organizer (file moves)
> - Logic errors → Formatter (code changes)
>
> Do NOT attempt to fix — report only.
>
> ## Phase 2: Explore and Analyze
>
> Map the codebase deeply:
> - Architecture: modules, dependencies, data flow
> - Patterns and conventions observed
> - Best practices for this project type
> - Gap analysis: standard vs current state
>
> ## Phase 3: Collect Metrics
>
> Gather before/after metrics from the clean phase:
> - Total file count
> - Dead imports removed, debug statements removed, constants extracted
>
> ## Phase 4: Generate AUDIT-REPORT.md
>
> Write `AUDIT-REPORT.md` in the project root. This report serves dual audiences: humans review it between phases, and the refactor-team Phase 2 agents consume it programmatically.
>
> Include:
> - Executive Summary
> - Clean Phase Results (agent summary, test results, metrics)
> - Codebase Understanding (architecture, modules, patterns)
> - Best Practices Analysis (project type, gap analysis)
> - Findings with IDs (AUDIT-001, AUDIT-002, ...) with priority/category/location/recommendation
> - Critical Paths (for Phase 2 Tester consumption)
> - Prioritized Recommendations (for Phase 2 Planner consumption)
> - Flagged for User Review (items needing human decision)
>
> ## Phase 5: Console Summary
>
> Send a message to the lead with the key results for display to the user.
>
> ## Rules
> - Do NOT make any code changes
> - Report failures honestly, even if cleanup caused them
> - Do NOT auto-fix test failures

**Model:** opus
**Tools:** Read, Grep, Glob, Bash, Write

---

## Lead Coordination

### Workflow

1. **Check prerequisites** (uncommitted changes warning)
2. **Spawn Organizer** → wait for completion → collect summary
3. **Spawn Formatter** (with Organizer summary) → wait for completion → collect summary
4. **Spawn Auditor** (with all summaries) → wait for completion → collect report
5. **Display final summary** to user

### Error Handling

| Failure | Action |
|---------|--------|
| Organizer fails | Ask user: retry, skip, or abort |
| Formatter fails | Ask user: retry, skip to Auditor, or abort |
| Auditor reports test failures | Report to user — do NOT auto-fix |

### Final Output

Display to the user:

```
============================================
        CLEAN-PARALLEL COMPLETE
============================================

Organizer:  [summary]
Formatter:  [summary]
Auditor:    [test status + audit findings]

Report: AUDIT-REPORT.md

Items needing attention: [count]
See report for details.
============================================
```

**Do NOT delete AUDIT-REPORT.md.** The report is a deliverable the user expects to keep — not a temporary artifact. It also serves as input for `/refactor-team:refactor` (Phase 2).

### Team Cleanup

After all teammates have finished and the final summary is displayed, clean up the agent team. Shut down any remaining teammates first, then run cleanup.
