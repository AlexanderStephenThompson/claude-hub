---
description: Convert an existing project to the framework, or upgrade an already-converted project to the latest template
argument-hint: <path to project, or blank for current directory>
---

**Target project:** $ARGUMENTS

# Convert Command

One command for both scenarios: bring a raw project into the framework, or upgrade an already-converted project to the latest template format. Detects which mode automatically.

---

## Mode Detection

Check if the framework has already been applied:

| Check | Result | Mode |
|-------|--------|------|
| `Documentation/project-roadmap.md` does NOT exist | Raw project | **Fresh Convert** — full adoption flow |
| `Documentation/project-roadmap.md` exists | Already converted | **Upgrade** — update to latest template |

```
/Convert                    → Detect mode from current directory
/Convert /path/to/project   → Detect mode from specified path
```

---

# Mode A: Fresh Convert

> For projects that have never used this framework. Scans the codebase, moves files into 3-tier structure, and generates all documentation.

After conversion, `/Feature`, `/New_Idea`, `/Bug`, and `/Release` all work going forward.

This mode orchestrates **5 specialized agents** that handle the heavy lifting:

| Agent | Role |
|-------|------|
| **adopt-scanner** | Deep scan codebase, classify files, build dependency map |
| **adopt-architect** | Plan 3-tier file placement, map hierarchy, plan import rewrites |
| **adopt-migrator** | Execute file moves, update imports, merge configs |
| **adopt-documenter** | Generate roadmap, features, modules, changelog, architecture |
| **adopt-verifier** | Run validators, check imports, verify documentation |

**How it differs from `/Start_Project`:**

| | `/Start_Project` | `/Convert` (Fresh) |
|--|-----------------|----------|
| **For** | New projects (no code yet) | Existing projects (code already written) |
| **Interview** | Full 7-phase (30+ questions) | Scan first, ask only gaps (5-8 questions) |
| **Features** | All Planned | Mix of Complete, In Progress, Planned |
| **Changelog** | Empty template | Backfilled from git history |
| **Milestones** | All future | Past (from tags) + future (from interview) |
| **File structure** | Creates empty 3-tier folders | Moves existing files INTO 3-tier |

---

## Preconditions (Fresh Convert)

Before converting, verify:

1. **Source code exists** — There's something to scan
   - Check: `package.json` OR `src/` OR recognizable project files exist
   - If empty: Show error and direct to `/Start_Project`

**If no source code:**
```
No project found

No source code detected in {directory}.

If this is a new project, use /Start_Project instead.
```

---

## Fresh Convert Workflow — 9 Phases

```
/Convert [path]
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

1. Verify source code exists (`package.json`, `src/`, or other project files)

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
Converted: {Project Name}

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

# Mode B: Upgrade

> For projects already using the framework. Updates project-level files to match the latest template without touching project-specific content (roadmap, features, custom code).

---

## What Gets Upgraded

Template-owned files evolve over time. The slash commands themselves auto-update via `/sync`, but project-level files generated at conversion time can drift behind the current template.

### Always Updated (safe — template-owned, no project customization)

| File / Directory | What Changes |
|-----------------|-------------|
| `Standards/Code-Quality.md` | Latest code quality standards |
| `Standards/Checklist.md` | Latest checklist with scope tags |
| `.claude/validators/` | Latest validator scripts |
| `.claude/agents/` | Latest adopt agents (adopt-scanner, etc.) |
| `.claude/settings.json` | New permissions, hooks (merged, not replaced) |
| `.husky/pre-commit` | Latest pre-commit hook commands (appended if custom hooks exist) |
| `Documentation/project-planning/` | Latest templates (feature-development.md, module-template.md, project-roadmap-template.md) |

### Merged (template sections updated, project content preserved)

| File | Template Sections | Project Sections (preserved) |
|------|-------------------|------------------------------|
| `CLAUDE.md` | Developer Experience, Slash Commands, Architecture, Documentation Sync, Checklist Scopes, Status Conventions, Build Order, File Naming, Path Syntax, Branching Convention | Project State block (`<!-- PROJECT_STATE_START` ... `PROJECT_STATE_END -->`), any custom sections |
| `README.md` | Process Overview, command descriptions, build cycle diagrams | Project name, description, quickstart, any custom sections |

### Never Touched (project-owned)

| File / Directory | Why |
|-----------------|-----|
| `Documentation/project-roadmap.md` | Project-specific roadmap |
| `Documentation/features/**` | Project-specific feature specs and module explainers |
| `Documentation/changelog.md` | Project-specific version history |
| `Documentation/architecture.md` | Project-specific architecture |
| `01-presentation/styles/global.css` | Project-specific design tokens |
| `Config/` | Project-specific configuration |
| All source code | Obviously |

---

## Upgrade Workflow — 4 Phases

```
/Convert [path]  (project already has framework)
       │
       ▼
┌──────────────────┐
│  1. Scan Current │  Read project files, detect what's outdated
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  2. Diff Report  │  Show what would change
│                  │  ← USER CHECKPOINT
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  3. Apply        │  Update files, merge where needed
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  4. Verify       │  Run validators, confirm everything works
└──────────────────┘
```

---

## Upgrade Phase 1: Scan Current State

Read the project's current framework files and compare against the latest template.

**Steps:**

1. **Read the latest template files** from the web template source:
   - `Standards/Code-Quality.md`
   - `Standards/Checklist.md`
   - `Documentation/project-planning/*.md` (templates)
   - `.claude/validators/`, `.claude/agents/`, `.claude/settings.json`
   - `.husky/pre-commit`
   - `CLAUDE.md` (template version, not project-specific)
   - `README.md` (template sections only)

2. **Read the project's current versions** of those same files

3. **Compare and categorize:**
   - **Up to date** — file matches template (no action)
   - **Outdated** — template has changed (needs update)
   - **Missing** — template file doesn't exist in project yet (needs creation)
   - **Custom** — project has content not in template (preserve)

---

## Upgrade Phase 2: Diff Report

Present what would change:

```
🔄 Upgrade Report

Template has evolved. Here's what's outdated in your project:

REPLACE (template-owned, safe to overwrite):
  ✏️ Standards/Code-Quality.md — 3 new rules added
  ✏️ Standards/Checklist.md — 2 items updated
  ✏️ .claude/validators/arch.js — boundary check improved

CREATE (new template files):
  ➕ .claude/dispatch/ — new directory for resumable workflows

MERGE (template + project content):
  🔀 CLAUDE.md — Slash Commands table updated, Resumable Workflows section added
     Your Project State block is preserved.
  🔀 .claude/settings.json — 2 new permissions added
     Your existing permissions preserved.

ALREADY UP TO DATE:
  ✅ Documentation/project-planning/feature-development.md
  ✅ .husky/pre-commit

Apply these updates?
```

**If user wants to skip specific updates:** Respect their choices.
**If user approves:** Proceed to Phase 3.

---

## Upgrade Phase 3: Apply Updates

For each file in the approved update list:

### Replace Files (template-owned)

Simply overwrite with the latest template version:

```bash
# Copy from template source
cp {template-source}/Standards/Code-Quality.md Standards/Code-Quality.md
cp {template-source}/Standards/Checklist.md Standards/Checklist.md
# etc.
```

### Create Missing Files

Create new directories and files that the latest template includes:

```bash
mkdir -p .claude/dispatch
# Copy any new template files
```

### Merge Files (template + project)

For files with both template and project content:

**CLAUDE.md merge strategy:**
1. Read the project's current `CLAUDE.md`
2. Extract the Project State block (`<!-- PROJECT_STATE_START` ... `PROJECT_STATE_END -->`)
3. Extract any custom sections the user added (sections not in the template)
4. Write the latest template CLAUDE.md
5. Re-insert the Project State block
6. Re-insert any custom sections at the end

**README.md merge strategy:**
1. Read the project's current `README.md`
2. Identify template sections (Process Overview, command tables, build cycle) vs. project sections (project name, description, quickstart, custom sections)
3. Update template sections with latest content
4. Preserve all project-specific sections in place

**settings.json merge strategy:**
1. Read project's current `.claude/settings.json`
2. Read template's `.claude/settings.json`
3. Union the `permissions.allow` arrays (add new, keep existing)
4. Preserve any project-specific settings

**Commit:** `chore: upgrade framework to latest template`

---

## Upgrade Phase 4: Verify

1. Run `npm run validate` — confirm all validators pass with the updated files
2. Check that no project-specific content was lost (spot-check Project State, feature counts)
3. Report results:

```
✅ Upgrade complete

Updated:
  ✏️ Standards/Code-Quality.md
  ✏️ Standards/Checklist.md
  ✏️ .claude/validators/arch.js
  ➕ .claude/dispatch/ (created)
  🔀 CLAUDE.md (template sections updated, Project State preserved)
  🔀 .claude/settings.json (2 permissions added)

Verification: {PASS / PASS WITH WARNINGS}

Your project-specific files are untouched:
  Documentation/project-roadmap.md
  Documentation/features/**
  Documentation/changelog.md
  All source code
```

---

# Shared Sections

## Error Handling

### Agent Fails Mid-Pipeline (Fresh Convert)

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

Conversion works best with git history (for release reconstruction),
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

I can still convert, but I'll need more info manually:
  - Project name
  - Tech stack
  - Version number

Want to proceed, or create package.json first?
  npm init -y
```

---

## Edge Cases

### Fresh Convert Edge Cases

| Situation | Behavior |
|-----------|----------|
| Existing `Documentation/` folder | Ask: merge, skip, or rename to `Documentation-old/` |
| Existing `Standards/` folder | Ask: overwrite or skip |
| Existing `CHANGELOG.md` | Parse and integrate rather than regenerate |
| No git repo | Convert without history; recommend `git init` first |
| No git tags | Treat current state as v0.1.0 (or use package.json version) |
| Monorepo | Ask which package/workspace to convert |
| Flat folder structure | Propose single program; user restructures via `/New_Idea` later |
| Hundreds of files | Scanner groups by folder, presents summary first |
| Non-JavaScript project | Detect language from extensions; adapt accordingly |
| Existing linting/formatting | Preserve; validators are additive, not replacement |

### Upgrade Edge Cases

| Situation | Behavior |
|-----------|----------|
| Project has custom sections in CLAUDE.md | Preserve at end of file after template sections |
| Project modified a Standards file | Warn, show diff, ask: overwrite or skip |
| New validator added to template | Add it, update pre-commit hook |
| Validator removed from template | Remove it, update pre-commit hook |
| Project has custom validators | Preserve alongside template validators |
| Template renamed a file | Delete old, create new, warn user |
| `.claude/settings.json` has conflicting permissions | Union — never remove existing permissions |

---

## Examples

### Example 1: Fresh Convert — React + Express Project

```
User: /Convert

AI: No framework detected — running Fresh Convert.

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

I need your help with 5 questions...

[Phase 3: Gap interview — user answers 5 questions]
[Phase 4: Architect plans migration]

AI: Migration Plan Ready

Files to move: 29
Import rewrites: 47
Renames: 3

Approve?

User: Yes

[Phases 6-9: Migrate, document, verify, summarize]

AI: Converted: Recipe Manager

Architecture: 2 Programs → 4 Modules → 10 Features
Verification: PASS
```

### Example 2: Upgrade Existing Project

```
User: /Convert

AI: Framework detected — running Upgrade.

🔄 Upgrade Report

REPLACE:
  ✏️ Standards/Checklist.md — 2 items updated
  ✏️ .claude/validators/arch.js — improved boundary check

CREATE:
  ➕ .claude/dispatch/ — resumable workflow support

MERGE:
  🔀 CLAUDE.md — Slash Commands table updated (new Lock/Research/Capture/Refine
     descriptions), Resumable Workflows table added
  🔀 .claude/settings.json — 1 new permission added

ALREADY UP TO DATE:
  ✅ Standards/Code-Quality.md
  ✅ Documentation/project-planning/*.md

Apply these updates?

User: Yes

AI: ✅ Upgrade complete

Updated: 4 files
Created: 1 directory
Merged: 2 files
Verification: PASS

Your roadmap, features, changelog, and source code are untouched.
```

### Example 3: Upgrade with Custom Modifications

```
User: /Convert

AI: Framework detected — running Upgrade.

🔄 Upgrade Report

REPLACE:
  ✏️ Standards/Code-Quality.md — 3 new rules added

CONFLICT:
  ⚠️ Standards/Checklist.md — you've added custom items to this file.
     The template version has also changed.

     Options:
     1. Overwrite (you'll lose your custom items)
     2. Skip (keep your version, miss template updates)
     3. Merge (add template changes, keep your custom items at the end)

MERGE:
  🔀 CLAUDE.md — Slash Commands updated

Apply? (I'll ask about the conflict.)

User: Merge the checklist.

AI: Got it — merging template updates into your Checklist while preserving
your custom items.

[Applies updates]

✅ Upgrade complete
```

---

## Quick Reference

### Fresh Convert

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

### Upgrade

| Phase | What Happens | Who Does It | User Input |
|-------|-------------|-------------|------------|
| 1. Scan | Compare project against latest template | You (orchestrator) | None |
| 2. Diff | Show what would change | You (orchestrator) | Approve or skip items |
| 3. Apply | Update/create/merge files | You (orchestrator) | Resolve conflicts |
| 4. Verify | Run validators | You (orchestrator) | Review results |

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Start_Project` | Initialize a NEW project from scratch (no existing code) |
| `/Feature` | Build features (available after conversion) |
| `/New_Idea` | Add features or restructure milestones |
| `/Bug` | Report and fix bugs |
| `/Release` | Ship a completed milestone |
