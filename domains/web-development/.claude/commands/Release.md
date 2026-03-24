---
description: Ship a completed milestone — bump version, finalize changelog, tag release
argument-hint: <version number, e.g. v0.2.0>
---

**Release to ship:** $ARGUMENTS

# Release Command

Ship a completed milestone. Finalizes the changelog, bumps the version, updates the roadmap, and creates a git tag.

---

## Preconditions

Before releasing, verify:

1. **Project initialized** — `/Start_Project` has been run
   - Check: `Documentation/project-roadmap.md` exists
   - Check: `Documentation/changelog.md` exists
   - If missing: Show error and direct to `/Start_Project`

2. **Milestone features are complete** — All features in the target milestone are ✅ Complete
   - Check: Feature Index in `Documentation/project-roadmap.md`
   - If incomplete: Show which features remain and direct to `/Feature`

3. **Validators pass** — `npm run validate` succeeds
   - If failing: Show errors and direct user to fix

4. **No open bugs for this milestone** (recommended, not blocking)
   - Check: `Documentation/bugs/` for files with `Status: Open` that reference features in this milestone
   - If found: Warn but allow user to proceed

**If preconditions fail:**
```
❌ Cannot release

Precondition failed: {reason}

{Specific guidance based on failure type}
```

---

## What This Command Does

```
/Release v0.2.0
```

1. **Detect** the target milestone and verify all features are complete
2. **Validate** by running `npm run validate` and checking for open bugs
3. **Finalize** the changelog (move Unreleased entries to versioned section)
4. **Bump** the version in `package.json`
5. **Update** the roadmap and Feature Index
6. **Tag** with a git tag and release summary

---

## Workflow

### Phase 1: Detect Target Milestone

**If version specified:** Use that version (e.g., `/Release v0.2.0`)

**If no version specified:** Auto-detect the next releasable milestone:
- Scan Feature Index for milestones where all features are ✅ Complete
- If multiple found: Ask user which to release
- If none found: Show progress toward nearest completion

**Determine release type:**

| Condition | Release Type | Version Bump |
|-----------|-------------|--------------|
| All features in a 0.0.x milestone complete | PRE-MVP | v0.0.x → v0.0.x+1 |
| Final 0.0.x milestone + MVP declaration | MVP | v0.0.x → v0.1.0 |
| All features in a post-MVP milestone complete | MINOR | v0.X.0 → v0.X+1.0 |
| Bug fixes only, no new features | PATCH | v0.X.Y → v0.X.Y+1 |

**0.0.x-specific logic:**

When the current version is 0.0.x:
1. Default behavior: bump to 0.0.x+1 (next Pre-MVP iteration)
2. If this is the final Pre-MVP milestone, ask: **"Is this the MVP release? Should the next version be v0.1.0?"**
   - If yes: release as v0.1.0 (this milestone IS the MVP)
   - If no: release as v0.0.x+1 (more Pre-MVP work remains)

**Important:** The transition from 0.0.x to 0.1.0 never happens automatically. It always requires explicit user confirmation.

---

### Phase 2: Validate

**Run automated checks:**

1. Run `npm run validate` — all validators must pass
2. Scan `Documentation/bugs/` for open bugs affecting this milestone's features
3. **Verify branch state:**
   - Must be on `main` branch: `git branch --show-current`
   - Main must be clean (no uncommitted changes): `git status --porcelain`
   - No open feature/fix branches for this milestone's features:
     ```bash
     git branch --list "feature/*" "fix/*"
     ```

**If not on main:**
```
❌ Cannot release — not on main branch

Current branch: {current-branch}

Switch to main and merge your work first:
  git checkout main
```

**If unmerged branches exist:**
```
⚠️ Unmerged branches detected

- feature/{name}
- fix/{name}

These may contain work intended for this milestone.

Options:
1. Merge remaining branches first
2. Release anyway (branches are unrelated)
3. Cancel release
```

**If validators fail:**
```
❌ Cannot release — validation failed

Failures:
{validator output}

Fix these issues before releasing.
```

**If open bugs found:**
```
⚠️ Open bugs found for this milestone

- {bug-name} (P{X}) — affects {feature}
- {bug-name} (P{X}) — affects {feature}

Options:
1. Fix bugs first (recommended for P0-P1)
2. Release anyway (acceptable for P2-P3)
3. Cancel release
```

---

### Phase 3: Finalize Changelog

**File:** `Documentation/changelog.md`

**Move `[Unreleased]` entries to a versioned section:**

Before:
```markdown
## [Unreleased]

### Added
- **Kitchen / Planning:** Create weekly meal plan
- **Kitchen / Planning:** Generate shopping list

### Fixed
- **Kitchen / Planning:** Fix missing quantities
```

After:
```markdown
## [Unreleased]

## [0.2.0] — 2026-02-06

### Added
- **Kitchen / Planning:** Create weekly meal plan ([#create-meal-plan](./features/kitchen/planning/create-meal-plan.md))
- **Kitchen / Planning:** Generate shopping list ([#generate-shopping-list](./features/kitchen/planning/generate-shopping-list.md))

### Fixed
- **Kitchen / Planning:** Fix missing quantities ([#fix-missing-quantities](./bugs/fix-missing-quantities.md))
```

**Ensure links are present** for every entry (feature file or bug file).

---

### Phase 4: Bump Version

**File:** `package.json`

Update the `version` field:

```json
{
  "version": "0.2.0"
}
```

**Also update** `Config/constants.ts` if it exists:
```typescript
export const APP = {
  NAME: '[Project Name]',
  VERSION: '0.2.0',
};
```

---

### Phase 5: Update CLAUDE.md Project State

Update the content between `<!-- PROJECT_STATE_START` and `PROJECT_STATE_END -->` in `CLAUDE.md`:

- **Version** — Update to the new version number
- **Current Milestone** — Advance to the next planned milestone (or "All milestones complete" if done)
- **Milestone Progress** — Reset to `0/{N} features` for the new milestone
- **Quick Context → Features** — Update complete count
- **Active Work** — Clear (fresh milestone, nothing in progress yet)
- **What to Read Next** — Point to the next milestone's first feature

### Phase 6: Update Roadmap

**File:** `Documentation/project-roadmap.md`

**Update Release Plan table:**
```markdown
| v0.2.0 | Kitchen / Planning: Shopping list | ✅ Complete <!-- STATUS:complete --> | ... |
```

**Update milestone detail section:**
```markdown
## v0.2.0 — Kitchen / Planning: Generate shopping list

**Goal:** ...
**Released:** 2026-02-06
```

Mark all issues in the milestone's issue table as ✅ Complete.

**Update Feature Index:**
- Confirm all features for this milestone show ✅ <!-- STATUS:complete -->
- (These should already be marked complete by `/Feature`, but verify)

---

### Phase 7: Tag

**Create a git tag with release notes:**

```bash
git tag -a v0.2.0 -m "v0.2.0 — Kitchen / Planning: Generate shopping list

Added:
- Create weekly meal plan
- Generate shopping list from meal plan

Fixed:
- Missing quantities in shopping list"
```

**Tag format:**
- Tag name: `v{X.Y.Z}`
- Message: Release name + summary of Added/Changed/Fixed from changelog

**Commit release changes before tagging:**
```bash
git add -A
git commit -m "release: v{X.Y.Z} — {Release Name}"
```

**Do NOT push automatically.** Inform the user:
```
Tag created locally. Push when ready:
  git push origin main
  git push origin v{X.Y.Z}
```

---

## Output Summary

### Successful Release

```
🚀 Released: v{X.Y.Z} — {Release Name}

📝 Updated files:
1. ✅ Documentation/changelog.md — Unreleased → v{X.Y.Z} ({date})
2. ✅ package.json — version: "{X.Y.Z}"
3. ✅ Config/constants.ts — VERSION: "{X.Y.Z}" (if exists)
4. ✅ CLAUDE.md — Project State (version, next milestone, progress reset)
5. ✅ Documentation/project-roadmap.md — Milestone ✅ Complete
6. ✅ Feature Index — All features confirmed ✅

🏷️ Git tag: v{X.Y.Z}
   Push when ready: git push origin v{X.Y.Z}

📊 Release summary:
   Added: {N} features
   Fixed: {N} bugs
   Modules: {list}

🎯 Next milestone:
   v{next} — {Release Name} ({N} features planned)
```

---

## Examples

### Example 1: Release a Completed Milestone

```
User: /Release v0.2.0

AI: 🚀 Preparing release v0.2.0 — Kitchen / Planning: Generate shopping list

📋 Checking preconditions...
   ✅ All 3 features complete in Feature Index
   ✅ Validators passed
   ⚠️ 1 open bug (P3 Low) — typo in shopping list header

   P3 is low severity. Proceed with release? (y/n)

User: y

AI: 🚀 Released: v0.2.0 — Kitchen / Planning: Generate shopping list

📝 Updated:
   ✅ changelog.md — Unreleased → v0.2.0 (2026-02-06)
   ✅ package.json — version: "0.2.0"
   ✅ project-roadmap.md — v0.2.0 ✅ Complete

🏷️ Git tag: v0.2.0
   Push when ready: git push origin v0.2.0

🎯 Next: v0.3.0 — Garden / Tasks: Track watering routine (4 features planned)
```

### Example 2: Auto-Detect Releasable Milestone

```
User: /Release

AI: 📋 Scanning for releasable milestones...

Found 1 milestone ready to release:
   v0.1.0 — Kitchen / Planning: Create meal plan (2/2 features ✅)

Release v0.1.0? (y/n)

User: y

AI: 🚀 Released: v0.1.0 — Kitchen / Planning: Create meal plan
[... update summary ...]
```

### Example 3: No Milestone Ready

```
User: /Release

AI: 📋 Scanning for releasable milestones...

No milestones ready to release.

Closest to completion:
   v0.2.0 — Kitchen / Planning: Generate shopping list
   Progress: 2/3 features complete (67%)
   Remaining:
   - [ ] track-pantry-inventory (⏳ Planned)

Build the remaining feature:
   /Feature kitchen/planning/track-pantry-inventory
```

### Example 4: PATCH Release for Bug Fixes

```
User: /Release v0.1.1

AI: 🚀 Preparing PATCH release v0.1.1

📋 Bug fixes in this release:
   - Fix login button on mobile Safari (P1)
   - Fix typo in welcome message (P3)

No new features — PATCH version bump confirmed.

[... update summary ...]
```

### Example 5: Release a Pre-MVP Milestone (0.0.x)

```
User: /Release v0.0.2

AI: 🚀 Preparing release v0.0.2 — Kitchen / Planning: Core data models

📋 Checking preconditions...
   ✅ All 2 features complete in Feature Index
   ✅ Validators passed
   ✅ On main branch, clean state

🚀 Released: v0.0.2 — Kitchen / Planning: Core data models

📝 Updated:
   ✅ changelog.md — Unreleased → v0.0.2 (2026-02-09)
   ✅ package.json — version: "0.0.2"
   ✅ project-roadmap.md — v0.0.2 ✅ Complete

🏷️ Git tag: v0.0.2
   Push when ready: git push origin v0.0.2

🎯 Next: v0.0.3 — Kitchen / Planning: Basic UI scaffold (2 features planned)
```

### Example 6: Transition from 0.0.x to MVP (0.1.0)

```
User: /Release

AI: 📋 Scanning for releasable milestones...

Found 1 milestone ready to release:
   v0.0.3 — Kitchen / Planning: Basic UI scaffold (3/3 features ✅)

This is a Pre-MVP milestone (0.0.x). After releasing:
   Is this the MVP release? Should this be v0.1.0?
   (This means a user can now complete one full workflow end-to-end)

   1. Yes — this IS the MVP. Release as v0.1.0.
   2. No — more Pre-MVP work needed. Release as v0.0.3.

User: 1

AI: 🚀 Released: v0.1.0 — Kitchen / Planning: Create weekly meal plan

📝 Updated:
   ✅ changelog.md — Unreleased → v0.1.0 (2026-02-09)
   ✅ package.json — version: "0.1.0"
   ✅ project-roadmap.md — v0.1.0 ✅ Complete (MVP achieved!)

🏷️ Git tag: v0.1.0
   Push when ready: git push origin v0.1.0

🎯 Next: v0.2.0 — Kitchen / Planning: Generate shopping list (3 features planned)
```

---

## Error Handling

### Milestone Not Found

```
❌ Milestone not found: v0.5.0

Available milestones:
- v0.1.0 — Kitchen / Planning: Create meal plan (✅ Complete)
- v0.2.0 — Kitchen / Planning: Generate shopping list (🔄 In Progress, 2/3)
- v0.3.0 — Garden / Tasks: Track watering routine (⏳ Planned)
```

### Features Incomplete

```
❌ Cannot release v0.2.0 — features incomplete

Progress: 2/3 features complete

Remaining:
- [ ] track-pantry-inventory (🔄 In Progress)

Complete remaining features first:
   /Feature kitchen/planning/track-pantry-inventory
```

### Version Already Released

```
❌ Version v0.1.0 already released

Released on: 2026-01-15
Current version: 0.1.0

To release the next milestone:
   /Release v0.2.0
```

---

## Quick Reference

| Situation | What Happens |
|-----------|--------------|
| All features complete | Changelog finalized, version bumped, tag created |
| Features incomplete | Shows remaining features, directs to `/Feature` |
| Bugs exist (P0-P1) | Warns, recommends fixing first |
| Bugs exist (P2-P3) | Warns, allows release |
| No version specified | Auto-detects next releasable milestone |
| PATCH release | Bug-fix only, no feature changes |
| 0.0.x milestone complete | Bumps to 0.0.x+1, asks if this is MVP release |
| 0.0.x → 0.1.0 transition | Requires explicit MVP declaration from user |

**One command. Clean release. All docs finalized.**

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Start_Project` | Initialize a new project (run first) |
| `/Adopt` | Wrap an existing project in this framework |
| `/Feature` | Build features toward a milestone |
| `/New_Idea` | Add features or restructure milestones |
| `/Bug` | Report and fix bugs (PATCH versioning) |
