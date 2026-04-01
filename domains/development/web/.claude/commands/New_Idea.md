---
description: Add a new feature idea or restructure milestones, updating all documentation
argument-hint: <Describe your new idea OR restructuring action>
---

**New idea:** $ARGUMENTS

# New Idea Command

Capture a new feature idea and integrate it into the existing project structure, or restructure existing milestones. Updates all relevant documentation.

---

## Mode Detection

Determine which mode to use based on `$ARGUMENTS`:

| If arguments describe... | Mode | Workflow |
|--------------------------|------|----------|
| A new feature or capability | **New Idea** | Capture → Refine → Place → Dependencies → Milestone → Spec → Update docs |
| Moving a feature between milestones | **Restructure** | Phase 5b |
| Reordering milestones | **Restructure** | Phase 5b |
| Splitting or merging milestones | **Restructure** | Phase 5b |

**Restructure triggers** (keywords): move, reorder, split, merge, restructure, reschedule, swap, shift, reorganize

```
/New_Idea Move export-pdf from v0.3.0 to v0.2.0     → Restructure mode
/New_Idea Merge v0.4.0 and v0.5.0                    → Restructure mode
/New_Idea Add ability to export meal plans as PDF     → New Idea mode
```

---

## Preconditions

Before adding new ideas, verify:

1. **Project initialized** - `/Start_Project` has been run
   - Check: `Documentation/project-roadmap.md` exists
   - If missing: Show error and direct to `/Start_Project`

**If preconditions fail:**
```
❌ Cannot add new idea

Precondition failed: Project not initialized

Run /Start_Project first to:
- Define your project scope and architecture
- Create the initial roadmap and milestones
- Set up the feature structure

Then use /New_Idea to add features to the backlog.
```

---

## Resume Detection

Before starting, check for in-progress idea artifacts from a previous session:

1. **Read** `.claude/dispatch/ideas/` directory
2. **If a capture exists but no refined artifact:**
   ```
   📋 Resuming idea: {slug}

   Found capture from {date} — picking up at Refine.
   ```
   → Skip Capture, resume at Refine
3. **If a refined artifact exists with "proceed" recommendation:**
   ```
   📋 Resuming idea: {slug}

   Found refined idea from {date} — picking up at Place.

   Summary: {one-line from refined.md}
   Recommended placement: {program}/{module}
   ```
   → Skip Capture and Refine, resume at Phase 3 (Place) with refined context pre-filled
4. **If nothing exists** → Start at Capture (normal flow)

---

## What This Command Does

```
/New_Idea Add ability to export meal plans as PDF
```

1. **Capture** the raw idea and write a dispatch artifact
2. **Refine** through collaborative pressure-testing against the roadmap
3. **Place** it in the right program/module (or create new ones)
4. **Assess** dependencies and impact on existing features
5. **Assign** to a milestone (existing or new)
6. **Generate** feature spec file
7. **Update** all documentation atomically

---

## Workflow

### Phase 1: Capture

Write the raw idea to a dispatch artifact for persistence.

**Steps:**
1. Generate slug from the idea description (kebab-case, e.g., `export-meal-plan-pdf`)
2. Quick-read `Documentation/project-roadmap.md` to note likely program/module placement
3. Create `.claude/dispatch/ideas/{slug}/capture.md`:

```markdown
# Idea Capture: {idea name}

**Date:** {current date}
**Raw input:** {verbatim $ARGUMENTS}

## Quick Assessment
**Likely placement:** {program}/{module} (based on roadmap scan)
**Similar features spotted:** {list any from Feature Index, or "None"}

## Open Questions for Refine
- What problem does this solve for the user?
- Is this distinct from {similar-feature} or an extension of it?
- What's the rough effort level?
```

4. Commit: `git add .claude/dispatch/ideas/{slug}/capture.md && git commit -m "idea: capture — {slug}"`

---

### Phase 2: Refine

Collaborative pressure-testing of the idea before committing to roadmap placement. This is a conversation, not a checklist — ask one question at a time and build on the answers.

**Pressure-test questions** (ask naturally, skip what's already clear):

1. **What problem does this actually solve?** — Not "what does it do" but "what pain does it remove or what value does it create?" Push past surface-level answers.
2. **Does this overlap with anything already planned?** — Check the Feature Index for similar capabilities. If overlap found, ask: "Is this the same thing, an extension of it, or genuinely different?"
3. **What's the effort vs. impact?** — Quick gut-check: is this a weekend feature or a month-long effort? Does the impact justify the investment?
4. **Where does it probably belong?** — Suggest program/module based on the capture's quick assessment. Confirm or adjust.
5. **Should this proceed, merge, or park?**
   - **Proceed**: Clear value, manageable effort, no conflicts → continue to Phase 3
   - **Merge**: Overlaps with existing feature → suggest updating that feature's spec instead
   - **Park**: Nice idea but wrong timing, too much effort, or unclear value → archive with reasoning

**Write conclusions to** `.claude/dispatch/ideas/{slug}/refined.md`:

```markdown
# Idea Refined: {idea name}

**Date:** {current date}
**Recommendation:** Proceed | Merge with {feature} | Park

## Problem Statement
{One clear paragraph on what problem this solves}

## Assessment
**Effort:** Low / Medium / High
**Impact:** Low / Medium / High
**Conflicts:** None | {list}
**Overlaps:** None | {feature names}

## Placement
**Program:** {program}
**Module:** {module} (existing | new)

## Reasoning
{Why this recommendation — what came out of the conversation}
```

**Commit:** `git add .claude/dispatch/ideas/{slug}/refined.md && git commit -m "idea: refine — {slug}"`

**Short-circuit outcomes:**

- **If "Park":**
  ```
  💤 Idea parked: {slug}

  Reason: {one-line reasoning}
  Location: .claude/dispatch/ideas/{slug}/refined.md

  This idea isn't deleted — it's archived with context.
  Revisit anytime by checking .claude/dispatch/ideas/.
  ```
  → **Done.** Do not proceed to Phase 3.

- **If "Merge":**
  ```
  🔗 Idea merges with existing feature: {existing-feature}

  Suggestion: Update {existing-feature}'s spec to include this capability.
  Feature file: Documentation/features/{program}/{module}/{existing-feature}.md

  Want me to update the existing feature spec now?
  ```
  → If user says yes, update the existing feature spec and stop. If no, done.

- **If "Proceed":** Continue to Phase 3 with refined context loaded.

---

### Phase 3: Place in Structure

**Determine fit:**

| Question | Action |
|----------|--------|
| Does it fit an existing module? | Add to that module |
| Does it fit an existing program but needs new module? | Create new module |
| Is it a new domain entirely? | Create new program + module |

**Ask if unclear:**
- "This sounds like it belongs in {program}/{module}. Does that feel right, or should it live elsewhere?"

**If creating new module:**
- Create module explainer (`_module-name.md`)
- Add to project roadmap's "At a Glance" section

---

### Phase 4: Assess Dependencies

**Analyze:**

1. **What does this feature depend on?**
   - Which existing features must be complete first?
   - Any new infrastructure/data models needed?

2. **What will depend on this feature?**
   - Does this unlock other planned features?
   - Should any existing features be updated to use this?

3. **Does this change existing dependencies?**
   - Review dependency map in project-roadmap.md
   - Flag any circular dependencies

**Output:** Dependency list (depends on, enables)

---

### Phase 5: Assign to Milestone

**Decision tree:**

```
Is this a bug fix or small improvement?
  └─► PATCH to current version (v0.X.Y+1)

Is the project in Pre-MVP (0.0.x)?
  └─► Yes:
      ├─► Does it fit in the current or next 0.0.x iteration?
      │   └─► Yes: Add to that 0.0.x milestone
      │   └─► No: Is it MVP-essential or post-MVP?
      │       ├─► MVP-essential: Add to the planned 0.1.0 milestone
      │       └─► Post-MVP: Add to a later milestone (v0.2.0+) or Maybe Later
      └─► Note: Transition from 0.0.x to 0.1.0 happens via /Release, not /New_Idea
  └─► No (project is 0.1.0+):
      ├─► Is this a new capability users can do?
      │   └─► MINOR version bump needed
      ├─► Does it fit an in-progress milestone?
      │   └─► Yes: Add to that milestone
      │   └─► No: Continue...
      ├─► Does it have dependencies on unreleased features?
      │   └─► Yes: Place AFTER those features' milestone
      │   └─► No: Continue...
      └─► Is it high priority / core value?
          └─► Yes: Earlier milestone (v0.2.0-v0.4.0)
          └─► No: Later milestone (v0.5.0+) or Maybe Later
```

**Ask if priority unclear:**
- "Should this be in the next milestone, or is it a 'nice to have' for later?"

**Options:**
- Add to existing milestone (0.0.x or post-MVP)
- Create new milestone (0.0.x iteration or post-MVP milestone)
- Add to "Maybe Later" (not committed to v1.0)

**Note:** `/New_Idea` never creates the 0.1.0 milestone itself. If the project is in 0.0.x and the feature is MVP-essential, add it to the existing planned 0.1.0 milestone. The actual transition from 0.0.x to 0.1.0 happens through `/Release`.

---

### Phase 5b: Restructure Milestones

> **Only runs in Restructure mode.** Skips Phases 1-5 and 6. Goes directly to Phase 7 after restructuring.

**Read current state first:**
1. Read `Documentation/project-roadmap.md` — Release Plan table, Feature Index, dependency maps
2. Identify the features and milestones involved

#### Operation: Move Feature

Move a feature from one milestone to another.

**Steps:**
1. Identify the feature and source/target milestones
2. **Validate dependencies** — Ensure the feature's dependencies are still met in the target milestone (no feature can land before its dependencies)
3. If dependency violation: warn and suggest alternatives
4. Update all affected files (see Phase 6)

**Ask if ambiguous:**
- "Move {feature} from v{X} to v{Y}. This feature depends on {dep} (in v{Z}). That's still satisfied. Proceed?"

#### Operation: Reorder Milestones

Change the sequence of milestones.

**Steps:**
1. Show current order with dependency annotations
2. Propose the new order
3. **Validate dependency chains** — No milestone can come before a milestone it depends on
4. If violation: show which dependencies break and suggest valid orderings
5. Renumber versions if needed (e.g., swapping v0.3.0 and v0.4.0)
6. Update all affected files

**Ask:**
- "Reorder v0.3.0 before v0.2.0? This would require {module} features to be available earlier. Is that correct?"

#### Operation: Split Milestone

Break one milestone into two.

**Steps:**
1. Show all features in the target milestone
2. Ask user which features go into each split
3. Assign version numbers (original version + new version, may require renumbering later milestones)
4. Create new milestone section with goal
5. Update all affected files

**Ask:**
- "v0.3.0 has 5 features. Which ones should go into the new milestone?"

#### Operation: Merge Milestones

Combine two milestones into one.

**Steps:**
1. Show features from both milestones
2. Determine surviving version number (earlier version wins)
3. Combine feature lists, pick headline feature
4. Remove the merged milestone's section
5. Renumber later milestones if needed
6. Update all affected files

**Ask:**
- "Merge v0.3.0 and v0.4.0 into v0.3.0? The combined milestone will have {N} features. What should the headline feature be?"

#### Dependency Validation (all operations)

Before committing any restructuring change:

```
✅ Dependency check passed
   - All feature dependencies satisfied in new ordering
   - No circular dependencies introduced

OR

⚠️ Dependency conflict detected

   {feature-a} depends on {feature-b}
   But after this change, {feature-a} would be in v0.2.0
   while {feature-b} is in v0.3.0

   Options:
   1. Also move {feature-b} to v0.2.0
   2. Move {feature-a} to v0.3.0 instead
   3. Cancel restructuring
```

---

### Phase 6: Generate Feature Spec

**Create file:** `/Documentation/features/{program}/{module}/{feature-name}.md`

**Use template:** `Documentation/project-planning/feature-development.md`

**Fill in:**
- One-line description
- Module link
- Milestone: v{X.Y.Z}
- Status: Planned `<!-- STATUS:planned -->`
- Priority: Based on milestone placement
- User story (As a / I want / So that)
- Basic scenario
- Acceptance criteria (testable checkboxes)
- Data model (if applicable)
- Technical notes with dependencies
- Standards Checklist reference
- Related features (dependencies)

---

### Phase 7: Update Documentation

**All updates are atomic — either all succeed or none:**

#### 1. Module Explainer
**File:** `/Documentation/features/{program}/{module}/_{module}.md`

Add to feature table:
```markdown
| {feature-name} | {one-line description} | v{X.Y.Z} | ⏳ Planned <!-- STATUS:planned --> |
```

Update progress count:
```markdown
**Progress:** 2/5 features <!-- PROGRESS:2/5 --> → 2/6 features <!-- PROGRESS:2/6 -->
```

#### 2. Project Roadmap
**File:** `/Documentation/project-roadmap.md`

**If adding to existing milestone:**
- Add feature to milestone's feature list
- Update "Key Features" column in roadmap table

**If creating new milestone:**
- Add row to roadmap table
- Create milestone section with goal and issue table

**If dependencies changed:**
- Update dependency map diagram

**If new module created:**
- Add to "At a Glance" section under appropriate program

#### 3. Feature Index
**File:** `/Documentation/project-roadmap.md` (Feature Index section)

Add row for the new feature:
```markdown
| [{feature-name}](features/{program}/{module}/{feature-name}.md) | [{module}](features/{program}/{module}/_{module}.md) | v{X.Y.Z} | ⏳ <!-- STATUS:planned --> |
```

**For restructuring operations:** Update the Milestone column for moved features; add/remove rows for split/merge operations.

#### 4. Feature Dependencies
**File:** `/Documentation/project-roadmap.md` (Feature Dependencies section)

If this feature has feature-level dependencies:
```markdown
{dependency-feature} ──→ {new-feature}
```

If an existing feature depends on this new feature, add that connection too.

#### 5. Changelog (if milestone is in progress)
**File:** `/Documentation/changelog.md`

Add placeholder under unreleased version:
```markdown
### Planned
- **{program} / {module}:** {feature-name} ([#{feature-name}](./features/{program}/{module}/{feature-name}.md))
```

#### 6. CLAUDE.md Project State
**File:** `CLAUDE.md`

Update the content between `<!-- PROJECT_STATE_START` and `PROJECT_STATE_END -->`:

- **Quick Context → Features** — Increment total and planned counts
- **Quick Context → Modules** — Update if new module was created
- **Quick Context → Programs** — Update if new program was created

---

## Output Summary

### If Proceeding (full flow)

```
✅ New idea captured: {feature-name}

📍 Placement:
   Program: {program}
   Module: {module}
   Milestone: v0.X.0 — {Release Name}

📋 Dependencies:
   Depends on: {list or "None"}
   Enables: {list or "None"}

📝 Files created/updated:
   ✅ Created: /Documentation/features/{program}/{module}/{feature-name}.md
   ✅ Updated: /Documentation/features/{program}/{module}/_{module}.md
   ✅ Updated: /Documentation/project-roadmap.md
   ✅ Updated: CLAUDE.md (Project State — feature counts)
   [✅ Updated: /Documentation/changelog.md] (if applicable)
   [✅ Created: _{new-module}.md] (if new module)
   🧹 Cleaned: .claude/dispatch/ideas/{slug}/ (artifacts removed)

📊 Project totals:
   Before: X Programs → Y Modules → Z Features
   After: X Programs → Y Modules → Z+1 Features

🎯 Next steps:
   - Review feature spec for completeness
   - When ready to build: /Feature {program}/{module}/{feature-name}
```

### If Parked

```
💤 Idea parked: {slug}

Reason: {one-line reasoning}
Location: .claude/dispatch/ideas/{slug}/refined.md

This idea isn't deleted — it's archived with context.
Revisit anytime by checking .claude/dispatch/ideas/.
```

### If Merged

```
🔗 Idea merges with: {existing-feature}

Feature file: Documentation/features/{program}/{module}/{existing-feature}.md
[✅ Updated spec] (if user requested changes)
🧹 Cleaned: .claude/dispatch/ideas/{slug}/ (artifacts removed)
```

---

## Examples

### Example 1: Add to Existing Module

```
User: /New_Idea Export meal plan as PDF

AI: [Writes capture artifact]
📝 Captured: export-meal-plan-pdf

Quick scan shows this likely fits in Kitchen / Planning. I also noticed
"create-meal-plan" in the Feature Index — this would depend on that.

Let me pressure-test this with you before we place it.

What problem does exporting to PDF actually solve? Is this about printing,
sharing with someone, or offline access?

User: Mainly for printing weekly plans to stick on the fridge.

AI: That's clear — physical reference for the week. Quick effort check:
this is essentially a render-to-PDF of an existing view. I'd call it
low-medium effort, high impact since it's a natural extension of meal planning.

I don't see anything overlapping in the Feature Index. This is distinct
from the meal plan itself.

Recommendation: proceed. Kitchen / Planning is the right home.
Does that feel right?

User: Yep.

AI: [Writes refined artifact, continues to Place]

📍 Placing in Kitchen / Planning.

🔗 Dependencies:
- Depends on: "Create meal plan" (needs a plan to export)
- Enables: Nothing currently planned

📅 Milestone: This is a nice enhancement. I'd suggest v0.3.0 after core planning is done.
   Does that timing work, or is this higher priority?

User: That works.

AI: ✅ New idea captured: export-meal-plan-pdf

[Creates feature file, updates module, updates roadmap, cleans up dispatch artifacts]
```

### Example 2: Idea Gets Parked

```
User: /New_Idea AI-powered recipe suggestions based on pantry

AI: [Writes capture artifact]
📝 Captured: ai-recipe-suggestions

Interesting — let me check what's in the roadmap.

I see you have pantry tracking and a recipe database both planned for later
milestones (v0.4.0+). This feature would depend on both of those.

What problem does AI recipe suggestion solve that browsing recipes wouldn't?

User: Reduces decision fatigue — you open the app and it tells you what to cook.

AI: Clear value. But the dependencies are heavy — pantry inventory AND a recipe
database need to exist first. Plus AI integration adds its own complexity.

Effort: High. Impact: High but deferred — can't deliver value until v0.5.0+.
I'd recommend parking this. The idea is solid but the prerequisites aren't
close to ready. Worth revisiting once pantry and recipes ship.

Park it?

User: Yeah, park it.

AI: 💤 Idea parked: ai-recipe-suggestions

Reason: Depends on pantry + recipe features not yet built. Revisit post-v0.4.0.
Location: .claude/dispatch/ideas/ai-recipe-suggestions/refined.md
```

### Example 3: Idea Merges with Existing Feature

```
User: /New_Idea Create grocery list from meal plan

AI: [Writes capture artifact]
📝 Captured: create-grocery-list

Hold on — I see "generate-shopping-list" already in Kitchen / Planning
(planned for v0.2.0). That sounds like the same thing.

Is "grocery list from meal plan" the same as "generate shopping list,"
or are these genuinely different capabilities?

User: Oh, same thing. Didn't realize it was already there.

AI: 🔗 Idea merges with existing feature: generate-shopping-list

Feature file: Documentation/features/kitchen/planning/generate-shopping-list.md

Want me to update that spec to mention the "from meal plan" angle,
or is it already covered?

User: It's already covered.

AI: Got it — no changes needed. Cleaning up the dispatch artifact.
```

### Example 4: Move Feature Between Milestones

```
User: /New_Idea Move export-meal-plan-pdf from v0.4.0 to v0.3.0

AI: 🔀 Restructuring: Move feature between milestones

📋 Current state:
   Feature: export-meal-plan-pdf
   From: v0.4.0 — Kitchen / Planning: Export features
   To: v0.3.0 — Kitchen / Planning: Smart shopping

🔗 Dependency check:
   ✅ export-meal-plan-pdf depends on: create-meal-plan (v0.1.0 ✅)
   ✅ All dependencies satisfied in v0.3.0

📝 Updated:
   ✅ Feature file — Milestone: v0.4.0 → v0.3.0
   ✅ Feature Index — Milestone column updated
   ✅ Roadmap — v0.3.0 feature list updated, v0.4.0 feature list updated
   ✅ Module explainer — Milestone column updated
```

### Example 5: Merge Two Milestones

```
User: /New_Idea Merge v0.4.0 and v0.5.0

AI: 🔀 Restructuring: Merge milestones

📋 Current state:
   v0.4.0 — Garden / Layout: Track beds (3 features)
   v0.5.0 — Garden / Layout: Companion planting (2 features)

Combined: 5 features, all in Garden / Layout

📅 Merged milestone: v0.4.0 — Garden / Layout: Track beds
   (v0.5.0+ milestones renumbered: v0.6.0 → v0.5.0, etc.)

What should the headline feature be?

User: Keep "Track beds"

AI: ✅ Milestones merged

📝 Updated:
   ✅ Roadmap — v0.4.0 expanded, v0.5.0 removed, later milestones renumbered
   ✅ Feature Index — 5 features now show v0.4.0
   ✅ Feature files — Milestone field updated for 2 moved features
   ✅ Module explainer — Milestone column updated
```

---

## Edge Cases

### Duplicate Feature
```
⚠️ Similar feature may exist

Found: "generate-shopping-list" in Kitchen/Planning
Your idea: "create grocery list from meal plan"

Are these the same feature, or different enough to be separate?
```

### Circular Dependency
```
⚠️ Potential circular dependency detected

Your feature depends on: "track-pantry"
But "track-pantry" was planned to depend on: "shopping-list"
And your feature would enable: "shopping-list"

This creates: track-pantry → shopping-list → [your feature] → track-pantry

Options:
1. Remove dependency on track-pantry
2. Restructure track-pantry's dependencies
3. Merge features

How should we resolve this?
```

### No Clear Module Fit
```
🤔 This doesn't fit cleanly into existing modules.

Your idea: "Share recipes with friends"

This touches:
- Kitchen/Recipes (the content)
- A new "Social" or "Sharing" module (the action)

Options:
1. Add to Kitchen/Recipes as a feature
2. Create new program: Social
3. Create new module: Kitchen/Sharing

Which structure makes sense for your project?
```

---

## Quick Reference

### New Idea Mode

| Situation | Action |
|-----------|--------|
| Fresh idea | Capture → Refine → Place → full flow |
| Resuming (capture exists) | Skip to Refine |
| Resuming (refined exists) | Skip to Place with pre-filled context |
| Refine says "park" | Archive with reasoning, done |
| Refine says "merge" | Point to existing feature, optionally update its spec |
| Clear fit in existing module | Create feature file, update module + roadmap + Feature Index |
| Needs new module | Create module explainer first, then feature |
| Needs new program | Discuss scope — may need mini `/Start_Project` interview |
| Has dependencies | Document in feature file + update both dependency maps |
| Low priority | Offer "Maybe Later" as option |
| Duplicate suspected | Surface existing feature during Refine, ask to clarify |

### Restructure Mode

| Operation | What Changes |
|-----------|-------------|
| Move feature | Feature file, Feature Index, both milestones, module explainer |
| Reorder milestones | Roadmap table, milestone sections, Feature Index, feature files |
| Split milestone | New milestone section, Feature Index, moved feature files |
| Merge milestones | Remove milestone, renumber later milestones, Feature Index, feature files |

---

## Files Touched

| File | When |
|------|------|
| `.claude/dispatch/ideas/{slug}/capture.md` | Always (created in Capture, cleaned up on completion) |
| `.claude/dispatch/ideas/{slug}/refined.md` | Always (created in Refine, cleaned up on completion or kept if parked) |
| `/Documentation/features/{program}/{module}/{feature}.md` | If proceeding (created) |
| `/Documentation/features/{program}/{module}/_{module}.md` | If proceeding (updated) |
| `/Documentation/project-roadmap.md` | If proceeding (updated) |
| `/Documentation/changelog.md` | If milestone is in progress |
| `/Documentation/features/{program}/{module}/_{new-module}.md` | If new module needed |
| `CLAUDE.md` | If proceeding (Project State — feature/module counts) |

**One idea — captured, pressure-tested, then integrated. All docs synced.**

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Start_Project` | Initialize a new project from scratch |
| `/Convert` | Convert an existing project or upgrade to latest template |
| `/Feature` | Build a feature after adding it |
| `/Bug` | Report bugs (not new features) |
| `/Release` | Ship a completed milestone |
