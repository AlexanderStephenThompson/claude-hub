<!-- Derived from ~/.claude/skills/documentation/SKILL.md
     For agent consumption, read the skill directly.
     This file is a human-readable convenience copy for project browsing. -->

# Documentation Standards

**Version:** 1.0
**Last Updated:** 2026-01-03

> Non-negotiable documentation standards for all agents. These are not preferences—they are requirements.

---

## Table of Contents

1. [Semantic Versioning](#1-semantic-versioning) - Release naming and versioning rules
2. [Documentation Requirements](#2-documentation-requirements) - What to document and where
3. [Folder Structure](#3-folder-structure) - /Documentation organization
4. [Feature Specifications](#4-feature-specifications) - Feature file requirements

---

## 1. Semantic Versioning

We use standard Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking change to expected behavior, inputs/outputs, or file structure
- **MINOR**: New user-visible capability or workflow outcome (may span multiple modules)
- **PATCH**: Bug fixes, small improvements, formatting tweaks (no new capability)

### 1.1 Release Naming (Human-Readable)

Every release uses this title format for clarity and fast scanning:

`vX.Y.Z — [Program] / [Module]: [Feature]`

- **Program**: Major domain or mode (noun) (e.g., Kitchen, Garden)
- **Module**: Capability area (noun-phrase) (e.g., Planning, Inventory, Tasks)
- **Feature**: Specific user action (verb/noun-phrase) (e.g., Generate shopping list)

**Examples:**
- `v0.2.0 — Kitchen / Planning: Create weekly meal plan`
- `v0.3.0 — Garden / Tasks: Track watering routine`
- `v0.4.0 — Kitchen / Planning: Generate shopping list`
- `v0.4.1 — Kitchen / Planning: Fix missing quantities`

### 1.2 Scope Tags (Optional, Machine-Friendly)

When helpful, include a scope tag in release notes and commit messages:

- **scope**: `kebab-case` dotted path
- **format**: `program.module.feature`

**Examples:**
- `scope: kitchen.planning.generate-shopping-list`
- `scope: garden.tasks.track-watering-routine`

### 1.3 Compatibility Rules

Use a **MAJOR** bump when any of these change in a breaking way:
- File/folder paths or naming conventions (kebab-case rules, required files)
- Required inputs or workflow order (new required phase, removed step)
- Output contract (required sections, templates, tables, verification behavior)

Use a **MINOR** bump when:
- A new workflow outcome is added
- A module gains a new feature users can run end-to-end
- Generated docs gain new non-breaking sections/files

Use a **PATCH** bump when:
- Fixes to generation bugs, formatting, typos, or small behavior corrections
- Performance or reliability improvements without changing the contract

### 1.4 Pre-MVP Versioning (0.0.x)

This project uses a pragmatic versioning approach for early development:

- **0.0.x**: Pre-MVP milestones — real milestones with full feature tracking, building toward MVP
- **0.1.0**: MVP (Minimum Viable Product) — first complete, usable workflow
- **0.2.0+**: Post-MVP milestones, adding features and value
- **1.0.0**: Production-ready (feature complete, polished, documented)

> **SemVer deviation:** 0.0.x is conventionally reserved for hotfixes. Here it is intentionally used for Pre-MVP development milestones, making 0.1.0 a clear marker for the first usable version.

#### 0.0.x Milestone Rules

1. **0.0.x iterations are real milestones.** They use the same 6-column Release Plan table, the same milestone detail sections, and the same `/Feature` tracking as any post-MVP milestone.
2. **Version bumping within 0.0.x:** Each completed milestone increments PATCH: 0.0.1 → 0.0.2 → 0.0.3. There is no MINOR bump within 0.0.x.
3. **Transition to 0.1.0 is an explicit decision.** The final 0.0.x release becomes 0.1.0 only when the user declares MVP readiness via `/Release`. It is never automatic.
4. **What belongs in 0.0.x:** Project setup, CI/CD, foundational data models, core infrastructure, early features that are prerequisites for the MVP workflow. Each 0.0.x milestone should deliver something demonstrable, not just "setup."
5. **What belongs in 0.1.0:** The first complete, end-to-end user workflow. A user can accomplish a real task from start to finish.

#### Boundary: When to Move from 0.0.x to 0.1.0

Ask: **"Can a user complete one full workflow end-to-end?"**

- **No** → Still 0.0.x (foundations, partial capabilities, infrastructure)
- **Yes** → This is the MVP. Release as 0.1.0.

### 1.5 Pre-Release Policy (Optional)

We avoid heavy use of alpha/beta tags during early internal development.
We may use Release Candidates only when preparing for `v1.0.0`:

- `v1.0.0-rc.1`: Share-ready candidate (only blocker fixes allowed after this)
- `v1.0.0`: Share-ready MVP release

---

## 2. Documentation Requirements

> Standard documentation requirements for all agent teams.

All teams must keep the `/Documentation` folder updated as they work. Documentation ships with code.

**Why /Documentation Matters (For Agents AND Users)**

**For Users:**
- Single source of truth for project structure
- Tracks feature status and milestones
- Links code to GitHub Issues

**For Agents:**
- **Read /Documentation FIRST** to understand project context before working
- Feature specs contain acceptance criteria you need to implement
- Module explainers show architecture and dependencies
- Past decisions are documented — don't reinvent the wheel

**The feedback loop:**
```
Agent reads /Documentation → Understands context → Does work → Updates /Documentation → Next agent reads /Documentation
```

When you update /Documentation, you're helping the next agent (including future you) understand the project.

---

## 3. Folder Structure

```
/Documentation/
  project-roadmap.md       # Living document: plan + progress tracking
  architecture.md          # System design overview
  changelog.md             # Version history (Keep a Changelog format)
  features/
    [program-name]/
      [module-name]/
        _[module-name].md  # Module explainer (underscore sorts first)
        feature-name-1.md  # Uses Documentation/project-planning/feature-development.md
        feature-name-2.md  # Uses Documentation/project-planning/feature-development.md
```

**Key Files:**
- `project-roadmap.md` - Strategic roadmap (v0.0.1 → v1.0), milestone tracking, tech stack
- `architecture.md` - System design, data flow, key components
- `changelog.md` - Version history following [Keep a Changelog](https://keepachangelog.com/) format
- Module explainers (`_*.md`) - Module overview, features, dependencies
- Feature files - User stories, acceptance criteria, technical notes with **Standards Checklist**

---

## 4. Feature Specifications

Each feature file follows `Documentation/project-planning/feature-development.md` and includes a **Standards Checklist** that references the standards. See the template for the complete structure.

**Required Elements in Every Feature File:**
- One-line description
- Module reference and status
- User story (As a / I want / So that)
- Overview and basic scenario
- Acceptance criteria (testable checkboxes)
- Data model (if applicable)
- Technical notes with Standards Checklist
- Open questions
- Related features

---

## 5. Feature Completion Process

> **Reference:** See `.claude/commands/Feature.md` for complete workflow details.

### Building Features

**DO NOT manually update documentation.** Use the `/Feature` command:

```
/Feature {program}/{module}/{feature-name}
```

**Example:**
```
/Feature kitchen/planning/create-meal-plan
```

This single command handles the entire lifecycle:
1. Marks feature as "In Progress"
2. Builds the feature (TDD, design tokens, architecture)
3. Runs all validators
4. Marks feature as "Complete"
5. Updates all documentation atomically

### What Gets Updated Automatically

1. **Feature file** (`/Documentation/features/{program}/{module}/{feature}.md`)
   - Status: Planned → In Progress → Complete
   - Start date and completion date added

2. **Module explainer** (`/Documentation/features/{program}/{module}/_{module}.md`)
   - Feature status in table updated (⏳ → 🔄 → ✅)
   - Completion count updated (2/6 → 3/6)

3. **Project roadmap** (`/Documentation/project-roadmap.md`)
   - Milestone status updated
   - If all features complete: Milestone marked ✅

4. **Changelog** (`/Documentation/changelog.md`)
   - Entry added under correct version
   - If milestone complete: Version marked as released

5. **Devlog** (`/devlog.md`) - Optional
   - Key learnings appended

### Validation Before Completion

The `/Feature` command automatically verifies:
- ✅ All validators pass (`npm run validate`)
- ✅ Standards Checklist complete (all active-scope items)
- ✅ All acceptance criteria met

**Features cannot be marked complete until validation passes.**

---

## Status Formats

| Context | Format | Values |
|---------|--------|--------|
| **project-roadmap.md** (milestones, issues) | Emoji | ⏳ Planned, 🔄 In Progress, ✅ Complete, 🚫 Blocked |
| **Module/feature files** | Text | Planned, In Progress, Complete |
| **Open questions** | Text | Open, Resolved |

**Rationale:** Emoji in project-roadmap for visual scanning. Text in feature/module files for easier AI parsing.
