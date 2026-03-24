---
description: Adopt this framework for an existing project — scan codebase, generate documentation
argument-hint: <path to project, or blank for current directory>
---

**Target project:** $ARGUMENTS

# Adopt Command

Scan an existing codebase, move it into the 3-tier structure, and generate all documentation. After adoption, `/Feature`, `/New_Idea`, `/Bug`, and `/Release` all work going forward.

This command orchestrates **5 specialized agents** that handle the heavy lifting:

| Agent | Role |
|-------|------|
| **adopt-scanner** | Deep scan codebase, classify files, build dependency map |
| **adopt-architect** | Plan 3-tier file placement, map hierarchy, plan import rewrites |
| **adopt-migrator** | Execute file moves, update imports, merge configs |
| **adopt-documenter** | Generate roadmap, features, modules, changelog, architecture |
| **adopt-verifier** | Run validators, check imports, verify documentation |

**How it differs from `/Start_Project`:**

| | `/Start_Project` | `/Adopt` |
|--|-----------------|----------|
| **For** | New projects (no code yet) | Existing projects (code already written) |
| **Interview** | Full 7-phase (30+ questions) | Scan first, ask only gaps (5-8 questions) |
| **Features** | All Planned | Mix of Complete, In Progress, Planned |
| **Changelog** | Empty template | Backfilled from git history |
| **Milestones** | All future | Past (from tags) + future (from interview) |
| **File structure** | Creates empty 3-tier folders | Moves existing files INTO 3-tier |

---

## Preconditions

Before adopting, verify:

1. **NOT already adopted** — Framework hasn't been applied yet
   - Check: `Documentation/project-roadmap.md` must NOT exist
   - If exists: Show error and direct to other commands

2. **Source code exists** — There's something to scan
   - Check: `package.json` OR `src/` OR recognizable project files exist
   - If empty: Show error and direct to `/Start_Project`

**If already adopted:**
```
Already adopted

This project already has the framework:
  Documentation/project-roadmap.md exists

Use these commands instead:
  /Feature — Build features
  /New_Idea — Add features or restructure milestones
  /Bug — Report and fix bugs
  /Release — Ship completed milestones
```

**If no source code:**
```
No project found

No source code detected in {directory}.

If this is a new project, use /Start_Project instead.
```

---

## Workflow — 9 Phases

```
/Adopt [path]
       │
       ▼
┌──────────────────┐
│  1. Setup        │  Check preconditions, detect conflicts
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  2. Scanner      │  AGENT: adopt-scanner
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  3. Present +    │  Show findings, ask 5-8 gap questions
│     Interview    │  ← USER CHECKPOINT
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  4. Architect    │  AGENT: adopt-architect
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  5. Approve Plan │  Show migration plan for approval
│                  │  ← USER CHECKPOINT
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  6. Migrator     │  AGENT: adopt-migrator
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  7. Documenter   │  AGENT: adopt-documenter
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  8. Verifier     │  AGENT: adopt-verifier
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  9. Summary      │  Show results + next steps
└──────────────────┘
```

---

## Phase 1: Setup (You Handle This)

### Determine Target

**If path argument provided:** Use that directory.
**If no argument:** Use current working directory.

### Check Preconditions

1. Verify `Documentation/project-roadmap.md` does NOT exist
2. Verify source code exists (`package.json`, `src/`, or other project files)

### Check for Conflicts

Scan for existing folders that the framework would create:

| Folder | If Exists |
|--------|-----------|
| `Documentation/` | Ask: merge content, skip, or rename to `Documentation-old/` |
| `Standards/` | Ask: overwrite with template standards, or skip |
| `01-presentation/styles/` | Ask: merge (add tokens alongside existing styles), or skip |
| `.husky/` | Ask: append validators to existing hooks, or skip |

---

## Phase 2: Scanner (Delegate to Agent)

Delegate to the **adopt-scanner** agent. It will:

1. Distinguish template files from dumped project files
2. Extract project identity, tech stack, folder structure
3. Classify every file by architectural layer (presentation, logic, data)
4. Detect features and assign statuses from git history
5. Map dependencies between modules and features
6. Reconstruct version history from git tags
7. Detect existing design tokens

**Output:** Scan Report (structured markdown document)

The agent has detailed scan targets and heuristics. See `.claude/agents/adopt-scanner.md`.

---

## Phase 3: Present Findings + Gap Interview (You Handle This)

### Present Scan Results

Show the user a structured summary:

```
Scan complete. Here's what I found:

PROJECT: {name} — {description}
VERSION: {current version} ({N} past releases found)
STACK: {frontend} + {backend} + {database}

PROPOSED HIERARCHY:
  {Program 1} (Program)
    {Module A} ({N} features)
      - {feature-1} (✅ Complete — {date})
      - {feature-2} (🔄 In Progress)
    {Module B} ({N} features)
      ...

FILE CLASSIFICATION:
  {N} presentation files → 01-presentation/
  {N} logic files → 02-logic/
  {N} data files → 03-data/
  {N} config/root files (stay in place)

DEPENDENCIES:
  {module-a} → {module-b}

RELEASE HISTORY:
  v{X.Y.Z} — {date}
  Current: v{X.Y.Z} (unreleased)

I need your help with {N} questions to fill in the gaps.
```

### Gap Interview

Ask ONLY questions the scan couldn't answer. Skip any that were answered by the scan.

**Typical gap questions:**

1. **Vision** (if README doesn't explain): "What problem does this solve? Who is it for?"
2. **Philosophy** (almost never in code): "Any design principles guiding decisions?"
3. **Hierarchy confirmation**: "I proposed {N} programs and {M} modules. Does this mapping look right?"
4. **Feature confirmation**: "I found {N} features. Are these correct? Any missing or miscategorized?"
5. **Status confirmation**: "I marked these as Complete based on git history. Any corrections?"
6. **Future milestones**: "What do you want to build next?"
7. **Constraints**: "Any constraints I should know about?"
8. **Out of scope**: "What's explicitly NOT in scope for v1.0?"

**Rules:**
- Skip questions the scan answered
- Present scan findings alongside each question for confirmation
- Maximum ~8 questions (not the 30+ from `/Start_Project`)
- Confirm hierarchy and file classifications before proceeding

**Gate:** User confirms hierarchy, feature list, and file classifications before Phase 4.

---

## Phase 4: Architect (Delegate to Agent)

Delegate to the **adopt-architect** agent with:
- The Scan Report
- The user's confirmed answers from the gap interview

It will:

1. Refine file classifications from the Scanner
2. Plan exact destination for every file in the 3-tier structure
3. Plan subfolder structure within each tier
4. Compute all import path rewrites
5. Detect conflicts (collisions, circular deps, ambiguous files)

**Output:** Migration Plan (file move table, import rewrite table, config merge plan)

See `.claude/agents/adopt-architect.md`.

---

## Phase 5: Approve Migration Plan (You Handle This)

Present the Architect's Migration Plan to the user:

```
Migration Plan Ready

Files to move: {N}
Import rewrites: {M}
Renames: {R}

Key moves:
  src/components/ → 01-presentation/{program}/{module}/
  src/services/ → 02-logic/{program}/{module}/
  src/repositories/ → 03-data/{program}/{module}/

Conflicts: {N} (see details)
Ambiguous files: {N} (need your decision)

{Show conflict/ambiguity details}

Approve this plan? I'll move the files and update all imports.
```

**If user wants changes:** Adjust the plan and re-present.
**If user approves:** Proceed to Phase 6.

---

## Phase 6: Migrator (Delegate to Agent)

Delegate to the **adopt-migrator** agent with:
- The approved Migration Plan
- Any user decisions on ambiguous files

It will:

1. Create destination folder structure
2. Move files using `git mv` (preserves history)
3. Update all import paths
4. Merge configs (package.json, tsconfig.json)
5. Clean up empty directories and .gitkeep files
6. Commit: `chore(adopt): migrate project files to 3-tier structure`

**Output:** Migration Report (what moved, what changed, commit hash)

See `.claude/agents/adopt-migrator.md`.

---

## Phase 7: Documenter (Delegate to Agent)

Delegate to the **adopt-documenter** agent with:
- The Scan Report
- The user's confirmed answers
- The Migration Report

It will generate all 10 documentation deliverables:

1. `project-roadmap.md` — Feature Index, milestones, dependencies
2. Folder structure verification
3. Module explainers — `_{module}.md` per module
4. Feature files — one per feature with status from git
5. `architecture.md` — system diagram, components, tech stack
6. `changelog.md` — backfilled from git tags
7. `global.css` — design tokens (detected or generated)
8. Config files — `environment.ts`, `constants.ts`
9. Pre-commit hook verification
10. `CLAUDE.md` — project-specific guidance

**Output:** All documentation files + commit

See `.claude/agents/adopt-documenter.md`.

---

## Phase 8: Verifier (Delegate to Agent)

Delegate to the **adopt-verifier** agent.

It will:

1. Run all validators (`npm run validate`)
2. Check import integrity (no broken imports)
3. Verify documentation completeness (every feature has a file)
4. Check file naming compliance
5. Verify 3-tier structure integrity (no reverse dependencies)

**Output:** `ADOPT-REPORT.md` with pass/fail status for each check

See `.claude/agents/adopt-verifier.md`.

---

## Phase 9: Summary (You Handle This)

Present the final results:

```
Adopted: {Project Name}

Architecture: {N} Programs → {M} Modules → {F} Features

Migration:
  {N} files moved into 3-tier structure
  {M} import paths updated
  {R} files renamed to match conventions

History imported:
  {X} past releases reconstructed from git tags
  {Y} features marked Complete
  {Z} features marked Planned

Documentation:
  ✅ project-roadmap.md (with Feature Index)
  ✅ architecture.md
  ✅ changelog.md (backfilled from git history)
  ✅ {N} module explainers
  ✅ {F} feature files
  ✅ CLAUDE.md

Verification: {PASS / PASS WITH WARNINGS / FAIL}
  See ADOPT-REPORT.md for details

Next steps:
  1. Review Documentation/project-roadmap.md
  2. Run: npm run validate
  3. Pick your next feature: /Feature {next-feature}
```

---

## Error Handling

### Agent Fails Mid-Pipeline

| Failed Agent | Action |
|-------------|--------|
| Scanner | Report error. User can retry or provide info manually. |
| Architect | Report error. Scanner output is still valid — can retry Architect. |
| Migrator | CRITICAL: Report error. Check which files moved. May need `git reset` to undo partial migration. |
| Documenter | Report error. Migration is complete — can retry Documenter independently. |
| Verifier | Report error. Everything else is done — can run validators manually. |

### No Git Repository

```
No git repository detected

Adoption works best with git history (for release reconstruction),
but it's not required.

Proceeding without:
  - Release history (changelog starts fresh)
  - Feature date detection (all existing features dated "today")
  - Branch verification

Recommendation: Initialize git first:
  git init && git add -A && git commit -m "Initial commit"
```

### No package.json

```
No package.json found

I can still adopt, but I'll need more info manually:
  - Project name
  - Tech stack
  - Version number

Want to proceed, or create package.json first?
  npm init -y
```

---

## Edge Cases

| Situation | Behavior |
|-----------|----------|
| Existing `Documentation/` folder | Ask: merge, skip, or rename to `Documentation-old/` |
| Existing `Standards/` folder | Ask: overwrite or skip |
| Existing `CHANGELOG.md` | Parse and integrate rather than regenerate |
| No git repo | Adopt without history; recommend `git init` first |
| No git tags | Treat current state as v0.1.0 (or use package.json version) |
| Monorepo | Ask which package/workspace to adopt |
| Flat folder structure | Propose single program; user restructures via `/New_Idea` later |
| Hundreds of files | Scanner groups by folder, presents summary first |
| Non-JavaScript project | Detect language from extensions; adapt accordingly |
| Existing linting/formatting | Preserve; validators are additive, not replacement |

---

## Examples

### Example 1: React + Express Project

```
User: /Adopt

[Phase 1: Setup — no conflicts detected]

[Phase 2: Scanner runs]

AI: Scan complete. Here's what I found:

PROJECT: recipe-manager — A meal planning and recipe management app
VERSION: 0.3.2 (3 git tags: v0.1.0, v0.2.0, v0.3.0)
STACK: React + Vite + Express + PostgreSQL + Prisma + Jest

PROPOSED HIERARCHY:
  Kitchen (Program)
    Recipes (4 features) — all ✅ Complete
    Planning (3 features) — 2 ✅, 1 🔄

  Account (Program)
    Auth (2 features) — all ✅ Complete
    Profile (1 feature) — ✅ Complete

FILE CLASSIFICATION:
  15 presentation files → 01-presentation/
  8 logic files → 02-logic/
  6 data files → 03-data/
  4 config files (stay at root)

I need your help with 5 questions...

[Phase 3: Gap interview — user answers 5 questions]

[Phase 4: Architect plans migration]

AI: Migration Plan Ready

Files to move: 29
Import rewrites: 47
Renames: 3 (to match naming conventions)

Approve?

User: Yes

[Phase 6: Migrator moves files, updates imports, commits]
[Phase 7: Documenter generates all docs, commits]
[Phase 8: Verifier checks everything]

AI: Adopted: Recipe Manager

Architecture: 2 Programs → 4 Modules → 10 Features
Migration: 29 files moved, 47 imports updated
Verification: PASS
```

### Example 2: Project with No Git Tags

```
User: /Adopt

AI: ...
VERSION: 1.0.0 (from package.json, 0 git tags found)

No git tags found — I'll treat the current state as the first version.
Changelog will start with a single entry for existing work.
...
```

### Example 3: Project with Conflicts

```
User: /Adopt

AI: Existing folders detected:

- Documentation/ (has 3 files: API-docs.md, deployment-guide.md, setup.md)
- .husky/ (has pre-commit hook running eslint)

For each:
1. Merge — Add framework files alongside existing ones
2. Skip — Don't touch this folder
3. Rename — Move existing to {folder}-old/

How should I handle each?

User: Merge both

AI: Got it.
- Documentation/ — Framework files added alongside your existing docs
- .husky/pre-commit — Validator commands appended after your eslint check

Continuing...
```

---

## Quick Reference

| Phase | What Happens | Who Does It | User Input |
|-------|-------------|-------------|------------|
| 1. Setup | Check preconditions, conflicts | You (orchestrator) | Resolve conflicts |
| 2. Scan | Deep read entire codebase | adopt-scanner agent | None |
| 3. Present + Interview | Show findings, ask gaps | You (orchestrator) | Review + answer 5-8 questions |
| 4. Plan | Design migration + hierarchy | adopt-architect agent | None |
| 5. Approve | Show migration plan | You (orchestrator) | Approve or adjust |
| 6. Migrate | Move files, update imports | adopt-migrator agent | None |
| 7. Document | Generate all docs | adopt-documenter agent | None |
| 8. Verify | Run validators, check integrity | adopt-verifier agent | None |
| 9. Summary | Present results | You (orchestrator) | Review and proceed |

**5 agents. 3 user checkpoints. Full framework enabled.**

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Start_Project` | Initialize a NEW project from scratch |
| `/Feature` | Build features (available after adoption) |
| `/New_Idea` | Add features or restructure milestones |
| `/Bug` | Report and fix bugs |
| `/Release` | Ship a completed milestone |
