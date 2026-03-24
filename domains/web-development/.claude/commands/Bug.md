---
description: Report and track bugs with a streamlined workflow
argument-hint: <Brief description of the bug>
---

**Bug to report:** $ARGUMENTS

# Bug Command

A streamlined workflow for reporting, tracking, and fixing bugs. Different from `/Feature` - optimized for quick fixes with PATCH versioning.

---

## Preconditions

Before reporting bugs, verify:

1. **Project initialized** - `/Start_Project` has been run
   - Check: `Documentation/project-roadmap.md` exists
   - If missing: Show error and direct to `/Start_Project`

---

## What This Command Does

```
/Bug Login button doesn't work on mobile
```

1. **Capture** the bug with essential details
2. **Classify** severity and affected feature
3. **Create** bug report file
4. **Track** in changelog under "Fixed"
5. **When fixed** - update status, bump PATCH version

---

## Bug vs Feature

| Aspect | /Bug | /Feature |
|--------|------|----------|
| **Purpose** | Fix something broken | Add something new |
| **Version** | PATCH (0.1.0 → 0.1.1) | MINOR (0.1.0 → 0.2.0) |
| **Changelog** | "### Fixed" | "### Added" |
| **Template** | Short (no user story) | Full (user story, acceptance criteria) |
| **Workflow** | Fast - describe, fix, done | Full - spec, build, validate, complete |

---

## Workflow

### Phase 1: Capture the Bug

**Gather essential information:**

1. **What's broken?** (One sentence)
2. **Which feature does this affect?** (Link to feature file if exists)
3. **Severity?**
   - P0 Critical: App is broken, users blocked
   - P1 High: Major feature broken, workaround exists
   - P2 Medium: Minor feature broken, low impact
   - P3 Low: Cosmetic or edge case issue

4. **Steps to reproduce** (if not obvious)

---

### Phase 2: Create Bug Report

**Create file:** `Documentation/bugs/{bug-name}.md`

**Bug file template:**

```markdown
# Bug: {Title}

**Severity:** {P0 Critical | P1 High | P2 Medium | P3 Low}
**Affects:** [{feature-name}](../features/{program}/{module}/{feature}.md)
**Status:** Open
**Reported:** {date}

---

## Description

{What's wrong - one paragraph}

---

## Steps to Reproduce

1. {Step 1}
2. {Step 2}
3. {Step 3}

**Expected:** {What should happen}
**Actual:** {What happens instead}

---

## Environment

- Browser/Device: {if relevant}
- Version: {current version}

---

## Fix

**Status:** {Pending | In Progress | Fixed}
**Fixed in:** v{X.Y.Z}

{Implementation notes after fixed}

---

## Related

- Feature: [{feature-name}](../features/{program}/{module}/{feature}.md)
```

---

### Phase 3: Update Changelog

**Add to `Documentation/changelog.md`:**

```markdown
## [Unreleased]

### Fixed
- **{Feature area}:** {Bug description} ([#{bug-name}](./bugs/{bug-name}.md))
```

---

### Phase 4: Fix the Bug

**Create a fix branch:**

```bash
git checkout main
git pull origin main
git checkout -b fix/{bug-name}
```

- If branch `fix/{bug-name}` already exists (resuming): `git checkout fix/{bug-name}`
- If working tree has uncommitted changes: warn and ask to stash or commit first

**When fixing:**

1. Follow the same standards as features (TDD, design tokens, etc.)
2. Reference the bug file for context
3. Update the bug file with fix details
4. Commit progress on the fix branch: `git commit -m "fix({area}): {description}"`

**After fixing:**

1. Update bug file: `Status: Open` → `Status: Fixed`
2. Add fix notes to bug file
3. Run validators: `npm run validate`

---

### Phase 5: Complete the Bug Fix

**When ready to complete:**

1. **Verify the fix works**
2. **Update bug file:**
   ```markdown
   **Status:** Fixed
   **Fixed in:** v{current-version}

   ## Fix
   {What was changed and why}
   ```

3. **Update changelog** (if not already done)

4. **Bump PATCH version** in package.json (if releasing):
   ```
   v0.1.0 → v0.1.1
   ```

5. **Merge fix branch to main:**
   ```bash
   git add -A
   git commit -m "fix({affected-area}): {bug-name}"

   git checkout main
   git pull origin main
   git merge --no-ff fix/{bug-name} -m "Merge fix/{bug-name}: {one-line description}"
   git branch -d fix/{bug-name}
   ```

   If merge conflicts occur, resolve them before continuing.

---

## Output Summary

### When Reporting a Bug

```
🐛 Bug reported: {bug-name}

📋 Details:
   Severity: {P0-P3}
   Affects: {feature-name}
   Status: Open

📝 Created:
   ✅ Documentation/bugs/{bug-name}.md
   ✅ Added to changelog under "### Fixed"

🌿 Branch: fix/{bug-name} (create when you start fixing)

🔧 Next steps:
   1. Investigate and fix the issue
   2. Update bug file with fix notes
   3. Mark as Fixed when complete
```

### When Completing a Bug Fix

```
✅ Bug fixed: {bug-name}

🌿 Branch: fix/{bug-name} → merged to main (branch deleted)

📝 Updated:
   ✅ Bug file - Status: Fixed
   ✅ Changelog - Entry updated
   ✅ Version - v{X.Y.Z}

📊 Bug stats:
   Open: {N}
   Fixed this version: {M}
```

---

## Examples

### Example 1: Report a P1 Bug

```
User: /Bug Login button doesn't respond on mobile Safari

AI: 🐛 Let me capture this bug.

📋 Bug Details:
   - What: Login button unresponsive on mobile Safari
   - Severity: P1 High (login is critical)
   - Affects: Auth / Login feature

📝 Creating bug report...

✅ Created: Documentation/bugs/login-button-mobile-safari.md
✅ Added to changelog under "### Fixed"

🔧 Ready to fix? I can investigate the issue now.
```

### Example 2: Quick P3 Bug

```
User: /Bug Typo in welcome message - says "Welome"

AI: 🐛 Quick fix - let me handle this.

📋 Bug Details:
   - What: Typo "Welome" in welcome message
   - Severity: P3 Low (cosmetic)
   - Affects: Onboarding / Welcome

📝 Created: Documentation/bugs/typo-welcome-message.md

This is a quick fix. Want me to fix it now and mark complete?
```

### Example 3: Complete a Bug Fix

```
User: /Bug login-button-mobile-safari

AI: 📋 Bug: login-button-mobile-safari
   Status: Open → Checking if fixed...

   The issue was a touch event handler that didn't work in Safari.
   Fix: Added `touchstart` event listener alongside `click`.

✅ Bug fixed!

📝 Updated:
   - Bug file status: Fixed
   - Fix notes added
   - Changelog entry confirmed

🔢 This will be included in the next PATCH release.
```

---

## Severity Guidelines

| Severity | Criteria | Response Time |
|----------|----------|---------------|
| **P0 Critical** | App unusable, data loss risk, security issue | Fix immediately |
| **P1 High** | Major feature broken, no workaround | Fix this sprint |
| **P2 Medium** | Feature degraded, workaround exists | Fix when possible |
| **P3 Low** | Cosmetic, edge case, minor annoyance | Fix eventually |

---

## Bug Lifecycle

```
┌─────────┐     ┌─────────────┐     ┌─────────┐
│  Open   │ ──► │ In Progress │ ──► │  Fixed  │
└─────────┘     └─────────────┘     └─────────┘
     │                                    │
     │         (If can't fix)             │
     └──────────────────────────────────┘
                Won't Fix / Duplicate
```

---

## Directory Structure

```
Documentation/
├── bugs/
│   ├── login-button-mobile-safari.md
│   ├── typo-welcome-message.md
│   └── ...
├── features/
│   └── ...
└── changelog.md  ← Bug fixes go under "### Fixed"
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Report new bug | `/Bug {description}` |
| Check bug status | `/Bug {bug-name}` (existing bug) |
| List open bugs | Check `Documentation/bugs/` for files with `Status: Open` |

**One command. Fast fixes. Proper tracking.**

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Start_Project` | Initialize a new project from scratch |
| `/Adopt` | Wrap an existing project in this framework |
| `/Feature` | Build new features (not bug fixes) |
| `/New_Idea` | Add features or restructure milestones |
| `/Release` | Ship a completed milestone (or PATCH release for bug batches) |
