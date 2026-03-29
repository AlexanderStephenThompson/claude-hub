---
description: Build a feature from spec to completion with automatic documentation updates
argument-hint: [program/module/feature-name]
---

**Feature to build:** $ARGUMENTS

# Feature Command

One command to build a feature from start to finish. Locks the task, researches the approach, builds it, updates all documentation.

---

## Resume Detection

Before starting, check for in-progress dispatch artifacts from a previous session:

1. **Read** `.claude/dispatch/features/` directory
2. **If a session-lock exists but no research artifact:**
   ```
   📋 Resuming feature: {slug}

   Found session lock from {date} — picking up at Research.

   Locked task: {feature name}
   Scope: {IN/OUT summary}
   ```
   → Skip Lock, resume at Research
3. **If a research artifact exists:**
   ```
   📋 Resuming feature: {slug}

   Found research from {date} — picking up at Build.

   Approach: {one-line from research-sprint.md}
   ```
   → Skip Lock and Research, resume at Build with research context loaded
4. **If feature is already "In Progress"** (existing behavior) → Resume building as before
5. **If nothing exists** → Start at Lock

---

## Preconditions

Before building features, verify:

1. **Project initialized** - `/Start_Project` has been run
   - Check: `Documentation/project-roadmap.md` exists
   - Check: `Documentation/changelog.md` exists
   - If missing: Show error and direct to `/Start_Project`

2. **Feature spec exists** - Feature file has been created
   - Check: `/Documentation/features/{program}/{module}/{feature-name}.md` exists
   - If missing AND no `$ARGUMENTS` provided: deferred to Lock phase (Lock will help pick a feature)
   - If missing AND `$ARGUMENTS` provided: Show error and direct to `/New_Idea`

3. **Dependencies met** (optional but recommended)
   - Check: Parent module explainer exists
   - Check: Required features are complete (if specified in Technical Notes)

**If preconditions fail:**
```
❌ Cannot build feature

Precondition failed: Project not initialized

Run /Start_Project first to create:
- Documentation/project-roadmap.md
- Documentation/changelog.md
- Documentation/architecture.md

Then use /New_Idea to add features to the backlog.
```

---

## What This Command Does

```
/Feature kitchen/planning/create-meal-plan    ← explicit feature
/Feature                                       ← auto-pick highest-leverage feature
```

1. **Lock** the session to a single feature (auto-pick or explicit)
2. **Research** patterns, pitfalls, and approach in the codebase
3. **Build** following all standards (TDD, design tokens, architecture)
4. **Validate** with automated validators
5. **Complete** and update all documentation atomically

---

## Lock

Select and lock to a single feature for this session. The value is in exclusion — knowing what you're NOT doing is as important as knowing what you are.

### If explicit feature path provided

If `$ARGUMENTS` contains a feature path (e.g., `kitchen/planning/create-meal-plan`):
1. Verify the feature spec exists at `Documentation/features/{path}.md`
2. Read the spec and confirm status is "Planned" or "In Progress"
3. Lock to this feature

### If no feature path provided

If `$ARGUMENTS` is empty or `/Feature` is invoked bare:
1. **Read project state:**
   - `Documentation/project-roadmap.md` — current milestones and progress
   - Feature Index — all features with their status
   - Recent git log (last 10-15 commits) — what's been worked on
   - Module explainers for the current milestone

2. **Identify candidates** — features with:
   - Status: Planned `<!-- STATUS:planned -->`
   - All dependencies met (dependent features are Complete)
   - In the current or next milestone

3. **Present top candidates** (2-3 max):
   ```
   🔒 Session Lock — Pick your feature

   Current milestone: v0.1.0 — Kitchen / Planning (1/3 complete)

   Ready to build:
   1. generate-shopping-list — Auto-generate grocery list from meal plan
      Dependencies met: ✅ (create-meal-plan complete)
      Effort: Medium

   2. save-meal-plan-template — Save plans as reusable templates
      Dependencies met: ✅ (create-meal-plan complete)
      Effort: Low

   Which one? (or describe what you'd rather work on)
   ```

4. **User picks** → lock to that feature

### Write session lock artifact

After selection (explicit or picked), write `.claude/dispatch/features/{slug}/session-lock.md`:

```markdown
# Session Lock: {feature-name}

**Date:** {current date}
**Feature:** {program}/{module}/{feature-name}
**Spec:** Documentation/features/{program}/{module}/{feature-name}.md

## Project State
**Current milestone:** v{X.Y.Z} — {milestone name} ({N}/{M} complete)
**Recent work:** {summary of last 5-10 commits}
**In progress:** {any features currently in progress, or "None"}

## Scope Boundary
**IN:** {what this session covers — from acceptance criteria}
**OUT:** {what is explicitly excluded — other features, refactoring, etc.}

## Success Criteria
{Acceptance criteria copied from feature spec}

## Research Needs
- {What patterns to look for in the codebase}
- {What similar features exist to reference}
- {Any external APIs or libraries to investigate}
```

**Commit:** `git add .claude/dispatch/features/{slug}/session-lock.md && git commit -m "feature: lock — {slug}"`

---

## Research

Explore the codebase to build a concrete approach before writing any code. This is read-only investigation — no code changes.

**Steps:**

1. **Read the feature spec** at `Documentation/features/{program}/{module}/{feature-name}.md`
   - Extract acceptance criteria, data model, technical notes
   - Note the Standards Checklist scopes

2. **Read the module explainer** at `Documentation/features/{program}/{module}/_{module}.md`
   - Understand the module's existing features and architecture
   - Note integration points

3. **Explore for existing patterns:**
   - Search the codebase for similar implementations (features in the same module, similar data models)
   - Check for reusable utilities, shared components, helper functions
   - Look at how existing tests are structured in this area
   - Check `03-data/` for existing data models that need extending
   - Check `02-logic/` for existing services to hook into
   - Check `01-presentation/` for existing components to reference

4. **Identify pitfalls:**
   - Dependency conflicts or circular import risks
   - Data model changes that affect other features
   - Edge cases from the acceptance criteria

5. **Design the approach** following 3-tier build order (data → logic → presentation):
   - Which files to create and where
   - Which existing files to modify
   - What tests to write at each layer
   - What order to build in

**Write** `.claude/dispatch/features/{slug}/research-sprint.md`:

```markdown
# Research Sprint: {feature-name}

**Date:** {current date}

## Existing Patterns
{What the codebase already does that's relevant — specific files and functions}

## Recommended Approach

### Data Layer (03-data/)
- {Files to create/modify}
- {Data models, repositories, API clients}

### Logic Layer (02-logic/)
- {Files to create/modify}
- {Services, business rules, validation}

### Presentation Layer (01-presentation/)
- {Files to create/modify}
- {Components, styles, hooks}

## Test Strategy
- **Unit:** {what to test per layer}
- **Integration:** {what boundaries to test}
- **Behavioral:** {what user flows to cover}

## Pitfalls
- {Edge cases, gotchas, things to avoid}

## Reusable Code Found
- {Existing utilities, components, patterns to leverage — with file paths}
```

**Commit:** `git add .claude/dispatch/features/{slug}/research-sprint.md && git commit -m "feature: research — {slug}"`

---

## Workflow by Status

### If Status: Planned

**Actions:**
1. **Create and switch to feature branch:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/{feature-name}
   ```
   - If branch `feature/{feature-name}` already exists (resuming work): `git checkout feature/{feature-name}`
   - If working tree has uncommitted changes: warn the user and ask to stash or commit first
2. Mark feature as "In Progress"
3. Update module explainer table (⏳ → 🔄)
4. Update project roadmap milestone status
5. Read and understand the feature spec
6. Begin building (see Build Process below)

### If Status: In Progress

**Actions:**
0. **Verify you are on the correct branch:**
   - Check: `git branch --show-current`
   - If not on `feature/{feature-name}`: `git checkout feature/{feature-name}`
   - If branch does not exist: create it with `git checkout -b feature/{feature-name}`
1. Check what's been built so far
2. Continue building remaining acceptance criteria
3. When all criteria met → proceed to validation and completion

### If Status: Complete

**Response:**
```
✅ Feature already complete

Feature: {program}/{module}/{feature-name}
Completed: {date}

Nothing to do. Pick another feature from the roadmap.
```

---

## Build Process

When building a feature, follow this exact process:

### 1. Read the Feature Spec and Research

**File:** `/Documentation/features/{program}/{module}/{feature-name}.md`

**Extract:**
- User story (who, what, why)
- Acceptance criteria (testable requirements)
- Data model (if applicable)
- Technical notes
- Related features

**Also load research context** if `.claude/dispatch/features/{slug}/research-sprint.md` exists:
- Use the recommended approach as a guide (not blindly — the feature spec is authoritative)
- Reference the reusable code and patterns identified
- Follow the suggested test strategy per layer
- Be aware of the documented pitfalls

### 2. Load Standards from Skills

**Read the feature's `Scopes:` field** to determine which skills to load.

`core` and `docs` are always active. Additional scopes (`ui`, `api`, `auth`, `data`) activate based on the feature.

**Read the `## Builder Checklist` section from each active skill:**

| Scope | Skill Path | When Active |
|-------|-----------|-------------|
| `core` | `~/.claude/skills/code-quality/SKILL.md` | Always |
| `core` | `~/.claude/skills/architecture/SKILL.md` | Always |
| `ui` | `~/.claude/skills/design/SKILL.md` | `ui` scope active |
| `ui` | `~/.claude/skills/web-css/SKILL.md` | `ui` scope active |
| `ui` | `~/.claude/skills/web-accessibility/SKILL.md` | `ui` scope active |
| `api`, `auth`, `data` | `~/.claude/skills/security/SKILL.md` | Any of these scopes active |

Also read `01-presentation/styles/global.css` if `ui` scope is active (project-specific design tokens).

**Hold these checklist constraints in context for the entire build.** When a checklist item is ambiguous, read the full skill narrative for deeper guidance.

**If the feature spec has no `Scopes:` field**, infer scopes from the feature's layers:
- Touches `01-presentation/` → add `ui`
- Exposes/consumes HTTP endpoints → add `api`
- Involves login, signup, roles, permissions → add `auth`
- Touches `03-data/`, repositories, migrations → add `data`

### 3. Build Using 4-Layer TDD

Build each acceptance criterion using the **4-layer validation framework** across the **3-tier architecture**. TDD within each layer, one layer at a time.

**For each acceptance criterion:**

#### Step A: Data Layer (`03-data/{domain}/`)

```
1. Write Layer 1 (Unit) tests for repositories, API clients, mappers
   — All tests fail (Red)
2. Write minimal data layer code to pass
   — Tests pass (Green)
3. Refactor while keeping tests green

4. Write Layer 2 (Integration) tests for data boundaries
   — Database queries return correct data, API calls return expected shapes
5. Write minimal code to pass integration tests
6. Refactor
```

#### Step B: Logic Layer (`02-logic/{domain}/`)

```
1. Write Layer 1 (Unit) tests for services, business rules, validation
   — Mock the data layer, test pure logic
2. Write minimal logic code to pass
3. Refactor

4. Write Layer 2 (Integration) tests for logic-to-data wiring
   — Services call repositories correctly, data flows through
5. Write minimal code to pass integration tests
6. Refactor
```

#### Step C: Presentation Layer (`01-presentation/features/{feature}/`) — if `ui` scope

```
1. Write Layer 1 (Unit) tests for components
   — Renders with correct props, state transformations work
2. Write minimal component code to pass
3. Refactor

4. Write Layer 2 (Integration) tests for presentation-to-logic wiring
   — Components call services, display returned data
5. Write minimal code to pass
6. Refactor

7. Write Layer 3 (Behavioral) test in tests/e2e/
   — Simulate real interaction: click, type, navigate, verify result
8. Write minimal code to pass the behavioral test
9. Refactor
```

#### Step D: Layer 4 — Human Verification

After all automated layers pass for all acceptance criteria, generate the **change-specific** manual checklist (see Validation & Completion below).

**Import rules (enforced by validator):**
- ✅ presentation → logic → data
- ❌ data → logic (blocked)
- ❌ logic → presentation (blocked)

### 4. Use Design Tokens

**All CSS values from `01-presentation/styles/global.css`:**

```css
/* ✅ Correct */
.button {
  background: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
}

/* ❌ Wrong - validator will block */
.button {
  background: #3B82F6;
  padding: 16px;
  border-radius: 4px;
}
```

### 6. Commit on the Feature Branch

All work happens on the feature branch. Commit after each meaningful unit:
- After each TDD cycle (Red-Green-Refactor) for an acceptance criterion
- After each layer is complete (data, logic, presentation)

**Commit message format:**

```bash
git add {specific-files}
git commit -m "feat({module}): {what changed}"
```

**Examples:**
```bash
git commit -m "feat(planning): add MealPlanRepository with findAll and create"
git commit -m "feat(planning): add MealPlanService with validation logic"
git commit -m "feat(planning): add MealPlanForm component"
```

---

## Validation & Completion

When all acceptance criteria have been built using the 4-layer TDD workflow:

### 1. Verify Layers 1-3 Are Green

**Run the full test suite** to confirm all automated layers pass:

```
Layer 1 (Unit):        ✅ All passing — logic works in isolation
Layer 2 (Integration): ✅ All passing — pieces connect correctly
Layer 3 (Behavioral):  ✅ All passing — user flows work end-to-end
```

**If any layer fails:** Fix the failing tests before proceeding.

### 2. Run Standards Validators

**Execute:** `npm run validate`

**Must pass:** Design tokens, architecture boundaries, file naming, secrets, documentation sync.

**If any fail:** Fix issues before proceeding.

**Also run the deterministic checker** (same checker the refactoring agents use — running it here catches violations proactively):

```bash
# Web projects
node domains/web-development/teams/clean-web/scripts/check.js --root <source-dir>

# Data projects
python domains/data/teams/clean-data/scripts/check_data.py --root <source-dir>
```

Fix any violations before committing. This ensures code written by the builder meets the same standards the refactorer would enforce later.

### 3. Layer 4 — Change-Specific Human Verification

**Generate a manual checklist specific to what this feature actually changed.** Do not use generic checks. Analyze which files, components, and flows were modified, then ask the human to verify only the things automated tests cannot judge.

**How to build the Layer 4 checklist:**

1. **List what changed** — Which components, services, pages, styles, or data models were added or modified?
2. **For each change, ask the right question:**

| What changed | Ask the human to verify |
|-------------|------------------------|
| Component/page | Does it look right visually? Spacing, alignment, hierarchy? |
| Form | Submit with real data — does the result make sense? |
| Chart/visualization | Does the chart display realistic data correctly? |
| Layout/responsive | Check at your actual screen width. Try resizing. |
| Animation/transition | Does it feel smooth? Too fast? Too slow? |
| API integration | Does real data flow through correctly? |
| Dark mode | Toggle themes — does it look right in both? |
| Accessibility | Tab through it — is the focus order logical? |
| Error state | Trigger a real error — is the message helpful? |
| Data display | Does the data on screen match what you'd expect from the source? |

3. **Check adjacent flows** — Did anything the user was already doing break?

**Present the generated checklist:**

```
🧪 Layer 4: Human Verification

Layers 1-3 passed. Active scopes: {list active scopes}

This feature modified: {list of components/files/flows that changed}

**Verify these specific changes:**
- [ ] {specific check based on what changed}
- [ ] {specific check based on what changed}
- [ ] {specific check based on what changed}

**Check nothing broke:**
- [ ] {adjacent flow that could have been affected}

Ready to mark complete? (y/n)
```

**If user says no:** Ask what needs fixing, continue building.

**If user says yes:** Proceed to mark complete.

### 3. Update Standards Checklist

Mark in the feature file, listing only the scopes that were active:
```markdown
### Standards Checklist
**Active scopes:** `core` `ui` `docs` (example — use actual scopes)
**Status:** ✅ All active-scope standards met

- [x] Code Quality (`core`) — verified
- [x] Design (`ui`) — verified
- [x] Documentation (`docs`) — verified
- [ ] ~~Security (`api` `auth` `data`)~~ — not in scope

**Verified by:** {user} + AI
**Date:** {today}
```

### 4. Update Feature File

**File:** `/Documentation/features/{program}/{module}/{feature-name}.md`

```markdown
**Milestone:** v{X.Y.Z}
**Status:** Complete <!-- STATUS:complete -->
**Completed:** {current-date}
```

### 5. Update Module Explainer

**File:** `/Documentation/features/{program}/{module}/_{module}.md`

Update feature table:
```markdown
| Feature | Description | Milestone | Status |
|---------|-------------|-----------|--------|
| Create meal plan | Users can create weekly meal plans | v0.1.0 | ✅ Complete <!-- STATUS:complete --> |
```

Update completion count:
```markdown
**Progress:** 1/4 features <!-- PROGRESS:1/4 -->
```

### 6. Update Project Roadmap

**File:** `/Documentation/project-roadmap.md`

Update milestone progress:
```markdown
| v0.1.0 | Kitchen / Planning: Create meal plan | 🔄 In Progress (1/2) <!-- STATUS:in-progress --> | ... |
```

If all features in milestone complete:
```markdown
| v0.1.0 | Kitchen / Planning: Create meal plan | ✅ Complete <!-- STATUS:complete --> | ... |
```

### 7. Update Feature Index

**File:** `/Documentation/project-roadmap.md` (Feature Index section)

Update the feature's row:
```markdown
| [create-meal-plan](features/kitchen/planning/create-meal-plan.md) | [Planning](features/kitchen/planning/_planning.md) | v0.1.0 | ✅ <!-- STATUS:complete --> |
```

### 8. Update Changelog

**File:** `/Documentation/changelog.md`

Add entry under current version:
```markdown
## [0.1.0] - Unreleased

### Added
- **Kitchen / Planning:** Create weekly meal plan ([#create-meal-plan](./features/kitchen/planning/create-meal-plan.md))
```

### 9. Update CLAUDE.md Project State

Update the content between `<!-- PROJECT_STATE_START` and `PROJECT_STATE_END -->` in `CLAUDE.md`:

- **Milestone Progress** — Update feature count (e.g., `2/4 features`)
- **Quick Context → Features** — Update complete/planned counts
- **Active Work** — Remove this feature from "in progress", or note "No features in progress"
- **What to Read Next** — Suggest the next unbuilt feature in the current milestone

**When starting a feature (Planned → In Progress):**
- Add to **Active Work**: `🔄 {feature-name} — {one-line description}`

**When completing a feature (In Progress → Complete):**
- Remove from **Active Work** (or replace with next feature suggestion)
- Update **Milestone Progress** count
- If all features in milestone are complete, update **Current Milestone** to note it's ready for `/Release`

### 10. Merge Feature Branch to Main

After all documentation updates are committed on the feature branch:

```bash
# Commit any remaining changes on the feature branch
git add -A
git commit -m "docs({module}): mark {feature-name} complete, update roadmap and changelog"

# Switch to main and pull latest
git checkout main
git pull origin main

# Merge with merge commit (preserves branch history)
git merge --no-ff feature/{feature-name} -m "Merge feature/{feature-name}: {one-line description}"

# Delete the feature branch
git branch -d feature/{feature-name}

# Clean up dispatch artifacts
rm -rf .claude/dispatch/features/{slug}/
git add .claude/dispatch/ && git commit -m "chore: clean dispatch artifacts for {feature-name}"
```

**If merge conflict occurs:**
```
⚠️ Merge conflict detected

Conflicts in:
- {file1}
- {file2}

Resolve conflicts manually, then:
  git add {resolved-files}
  git merge --continue

After resolving, verify validators still pass:
  npm run validate
```

---

## Output Summary

### When Starting (Planned → In Progress)

```
🚀 Starting feature: {program}/{module}/{feature-name}

🌿 Branch: feature/{feature-name} (created from main)
🎯 Active scopes: core, ui, docs (example — read from feature spec)

📝 Updated files:
1. ✅ Feature file - Status: Planned → In Progress
2. ✅ Module explainer - Feature marked 🔄 In Progress
3. ✅ Project roadmap - Milestone marked 🔄 In Progress
4. ✅ Feature Index - Status updated
5. ✅ CLAUDE.md - Active Work updated

📋 Feature Spec:
{User story and acceptance criteria}

🔨 Building with:
- TDD (tests first)
- Design tokens from global.css (if ui scope)
- 3-tier architecture (data → logic → presentation)
- Standards filtered to active scopes (~{N} items)

Let's build this feature...
```

### When Completing (In Progress → Complete)

```
✅ Feature complete: {program}/{module}/{feature-name}

🌿 Branch: feature/{feature-name} → merged to main (branch deleted)

📝 Updated files:
1. ✅ Feature file - Status: Complete, Completed: {date}
2. ✅ Module explainer - Progress: 1/4 complete (25%)
3. ✅ Project roadmap - Milestone: 1/2 complete (50%)
4. ✅ Feature Index - Status: ✅ Complete
5. ✅ Changelog - Entry added
6. ✅ CLAUDE.md - Project State updated (progress, active work)
7. 🧹 Cleaned: .claude/dispatch/features/{slug}/ (artifacts removed)

🎯 Next feature:
{next-feature-name} in {module}

📊 Progress:
- Module "{module}": 1/4 features (25%)
- Milestone v0.1.0: 1/2 features (50%)
```

---

## Error Handling

### Feature Not Found

```
❌ Feature not found

Path: /Documentation/features/{program}/{module}/{feature-name}.md

Check:
1. Feature name spelling (use kebab-case)
2. Program and module names are correct
3. Feature file exists

Available features in {program}/{module}:
- create-meal-plan
- generate-shopping-list
```

### Validators Failed

```
❌ Cannot complete feature - validation failed

Failures:
1. Design tokens: 3 hardcoded values
   - src/components/Button.css:12 (color: #3B82F6)

2. Architecture: 1 boundary violation
   - 03-data/UserRepo.ts imports from 02-logic

Fix these issues, then continue building.
```

### Standards Checklist Incomplete

```
❌ Cannot complete feature - checklist incomplete

Active scopes: core, ui, docs
Missing items in active scopes:
- [ ] Design standards met (ui)
- [ ] Documentation updated (docs)

Complete all active-scope checklist items before marking done.
(Items outside active scopes are skipped.)
```

---

## Examples

### Example 1: Explicit Feature — Lock, Research, Build

```
User: /Feature kitchen/planning/create-meal-plan

AI: [Writes session lock artifact]
🔒 Locked: kitchen/planning/create-meal-plan

Current milestone: v0.1.0 — Kitchen / Planning (0/3 complete)
Scope IN: Create meal plan feature (4 acceptance criteria)
Scope OUT: Shopping list, templates, export

Researching approach...

[Reads codebase, writes research artifact]
📋 Research complete:
- No existing data models to extend (first feature)
- Will create MealPlan model in 03-data/kitchen/
- MealPlanService in 02-logic/kitchen/
- MealPlanForm + MealPlanPage in 01-presentation/
- Test pattern: following the project template structure

🚀 Starting build. Feature status → In Progress

📋 Building:
As a homesteader, I want to create a weekly meal plan...

Let me start with the data layer tests...

[AI builds the feature using TDD, updates status when complete]
```

### Example 2: Auto-Pick Feature (no arguments)

```
User: /Feature

AI: 🔒 Session Lock — Pick your feature

Current milestone: v0.1.0 — Kitchen / Planning (1/3 complete)

Ready to build:
1. generate-shopping-list — Auto-generate grocery list from meal plan
   Dependencies met: ✅ (create-meal-plan complete)
   Effort: Medium

2. save-meal-plan-template — Save plans as reusable templates
   Dependencies met: ✅ (create-meal-plan complete)
   Effort: Low

Which one?

User: Shopping list.

AI: [Writes session lock, researches, begins building...]
```

### Example 3: Resume from Previous Research

```
User: /Feature

AI: 📋 Resuming feature: generate-shopping-list

Found research from 2026-03-26 — picking up at Build.

Approach: Create ShoppingList model, aggregate ingredients from
MealPlan, deduplicate, sort by category.

🚀 Starting build...

[Skips Lock and Research, goes straight to building]
```

### Example 4: Already Complete

```
User: /Feature kitchen/planning/create-meal-plan

AI: ✅ Feature already complete

Feature: kitchen/planning/create-meal-plan
Completed: 2026-01-03

Nothing to do. Next feature in this module:
- generate-shopping-list (Planned)
```

---

## Quick Reference

| Situation | What Happens |
|-----------|--------------|
| No arguments, no dispatch artifacts | Lock (pick feature) → Research → Build → Validate → Complete |
| Explicit feature path, no dispatch artifacts | Lock (to that feature) → Research → Build → Validate → Complete |
| Session lock exists, no research | Resume at Research → Build → Validate → Complete |
| Research exists | Resume at Build → Validate → Complete |
| Feature already In Progress | Resume building (existing behavior) |
| Feature already Complete | Nothing — suggest next feature |

**One command. Lock, research, build, complete. All docs updated automatically.**

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Start_Project` | Initialize a new project (run first) |
| `/Convert` | Convert an existing project or upgrade to latest template |
| `/New_Idea` | Add new features or restructure milestones |
| `/Bug` | Report and fix bugs (different workflow, PATCH versioning) |
| `/Release` | Ship a completed milestone |
