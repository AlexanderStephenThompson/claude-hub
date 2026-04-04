# [Project Name] — Project Roadmap

> **Living document:** Source of truth for what we're building, our plan to get there, and current progress.

**Problem:** [What pain exists? Who feels it? What happens if it's not solved?]

**Solution:** [How does this project solve the problem? What's the core insight? Describe the experience in 3-4 sentences—what can users do, and why does it feel different from alternatives?]

**Philosophy:** [1-2 sentences on design principles that guide decisions]

---

## At a Glance

**System:** [Project Name]
**Totals:** [X] Programs → [Y] Modules → [Z] Features

<!--
HIERARCHY:
- Programs = major domains or modes of the app (2-4 typically)
- Modules = capabilities within each program (3-6 per program)
- Features = specific things users can do (3-6 per module)

MODULE LINKS:
- Link to module explainer: features/{program}/{module}/_{module}.md
- Underscore prefix sorts explainer first in folder
-->

### {Program 1 Name} (Program) — {One-word domain}

| Module | Features |
|--------|----------|
| [{module}](features/{program}/{module}/_{module}.md) | feature-1, feature-2, feature-3 |

### {Program 2 Name} (Program) — {One-word domain}

| Module | Features |
|--------|----------|
| [{module}](features/{program}/{module}/_{module}.md) | feature-1, feature-2, feature-3 |

---

## Target User

[Who is this for? Be specific—not "everyone." What makes them unique?]

---

## GitHub Mapping

| Hierarchy | GitHub Tool | Notes |
|-----------|-------------|-------|
| System | Repository | The whole codebase lives here |
| Program | Label | Tag issues by program |
| Module | Project | Each module gets its own kanban board |
| Feature | Issue | One issue = one unit of work |

---

## Branching Convention

**Strategy:** GitHub Flow — feature branches from `main`, merge back with merge commits.

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/{feature-name}` | `feature/create-meal-plan` |
| Bug fix | `fix/{bug-name}` | `fix/login-button-mobile-safari` |
| Release | No branch (tag on `main`) | Tag: `v0.2.0` |

- `/Feature` creates branch at start, merges to `main` at completion
- `/Bug` creates branch when fixing, merges when fix is verified
- `/Release` tags `main` — no release branches
- All merges use `--no-ff` (preserves branch history)
- `main` is always deployable

---

## Versioning Mindset

> Full versioning rules: [Standards/Documentation.md — Section 1.4](../../Standards/Documentation.md#14-pre-mvp-versioning-00x)

- **0.0.x**: Pre-MVP milestones — real milestones with full feature tracking, building toward MVP
- **0.1.0**: MVP — first complete, end-to-end user workflow
- **0.2.0+**: Post-MVP milestones, adding features and value
- **1.0.0**: Production-ready (feature complete, polished, documented, ready for real users)

Transition from 0.0.x to 0.1.0 requires an explicit MVP declaration via `/Release`.

---

## Release Plan

> Strategic sequencing from project setup to production ready.

<!--
SEQUENCING PRINCIPLES:
1. Dependencies first — Build foundational modules before dependent ones
2. Risk early — Tackle hardest/riskiest features in v0.0.x-v0.3.0 while there's time to pivot
3. Value increments — Each version delivers something demonstrable, not just "setup"
4. User journey — Prioritize completing one full user workflow over partial coverage of many
5. Magic moment — Plan which version delivers the core "aha" experience

VERSION DEFINITIONS:
- v0.0.x = Pre-MVP milestones (setup, foundations, early features building toward MVP)
- v0.1.0 = MVP (first complete user flow, end-to-end, core infrastructure in place)
- v0.2.0-v0.9.0 = Build toward value (add modules/features in dependency order, each version delivers something usable)
- v1.0.0 = Production ready (feature complete per spec, polished UX, error handling, documentation, ready for real users)

0.0.x GUIDANCE:
- 0.0.x iterations are real milestones with full feature tracking (same as 0.1.0+)
- Typical 0.0.x milestones: project skeleton + CI, core data models, foundational module(s)
- Each 0.0.x should deliver something demonstrable, not just "setup"
- Transition to 0.1.0 requires explicit MVP declaration via /Release
-->

### Module Dependencies

```
[Foundation Module] → [Dependent Module A]
                   ↘ [Dependent Module B] → [Final Module]
```

### Feature Dependencies

<!--
FEATURE DEPENDENCIES:
Map individual feature-to-feature dependencies, not just module-level.
This captures cases where a specific feature (not its whole module) must exist first.

FORMAT: source-feature ──→ dependent-feature
Group by source feature. Omit features with no dependencies.
-->

```
{feature-a} ──→ {feature-b}
             ──→ {feature-c}
{feature-d} ──→ {feature-e}
```

### Milestones

| Version | Release Name | Goal | Modules | Key Features | Unlocks |
|---------|-------------|------|---------|--------------|---------|
| v0.0.1 | {Program} / {Module}: {Feature} | {What this sets up} | {Module A} | {Feature 1, 2} | Project foundation |
| v0.0.2 | {Program} / {Module}: {Feature} | {What this enables} | {Module A} | {Feature 3, 4} | Core data models ready |
| v0.1.0 | {Program} / {Module}: {Feature} | MVP: {What users can do} | {Module B} | {Feature 5, 6} | First complete workflow |
| v0.2.0 | {Program} / {Module}: {Feature} | {What users can do} | {Module C} | {Feature 7, 8} | Builds on MVP, enables v0.3 |
| v0.3.0 | {Program} / {Module}: {Feature} | {Magic moment} | {Module D} | {Feature 9, 10} | Core value delivered |
| v1.0.0 | {Program} / {Module}: {Feature} | Production ready | All modules | Polish, errors, docs | Ready for real users |

<!--
RELEASE NAMING FORMAT: vX.Y.Z — [Program] / [Module]: [Headline Feature]
- Program: Major domain (noun) — e.g., Kitchen, Garden
- Module: Capability area (noun-phrase) — e.g., Planning, Tasks
- Feature: The headline capability of that release (verb/noun-phrase)

SINGLE-MODULE MILESTONE:
- v0.0.1 — Kitchen / Planning: Project setup and CI
- v0.0.2 — Kitchen / Planning: Core meal plan data model
- v0.1.0 — Kitchen / Planning: Create weekly meal plan
- v0.2.0 — Kitchen / Planning: Generate shopping list
- v0.4.1 — Kitchen / Planning: Fix missing quantities

MULTI-MODULE MILESTONE:
Use the headline feature's program/module. List ALL modules in the Modules column.
- v0.5.0 — Kitchen / Planning: Meal plan sharing  (Modules column: Planning, Social)
- v0.8.0 — Garden / Layout: Companion planting     (Modules column: Layout, Plants)

The Release Name always references one headline feature. The Modules column and
the milestone detail section below list every module involved.
-->

---

## v0.0.1 — {Program} / {Module}: {Feature}

**Goal:** {2-4 sentences: What does this iteration set up? What infrastructure or foundation does it establish? Why is this the right starting point?}

### Module: {module}

{1-2 sentences: What this module does and why it matters for this milestone.}

| Issue | Status |
|-------|--------|
| [#1 — Issue title](../../issues/1) | ⏳ <!-- STATUS:planned --> |
| [#2 — Issue title](../../issues/2) | ⏳ <!-- STATUS:planned --> |

---

## v0.0.2 — {Program} / {Module}: {Feature}

**Goal:** {2-4 sentences: What does this iteration build on top of v0.0.1? What new capability is established?}

### Module: {module}

{1-2 sentences: What this module does and why it matters for this milestone.}

| Issue | Status |
|-------|--------|
| [#3 — Issue title](../../issues/3) | ⏳ <!-- STATUS:planned --> |
| [#4 — Issue title](../../issues/4) | ⏳ <!-- STATUS:planned --> |

<!--
0.0.x MILESTONE DETAIL SECTIONS:
- Add one section per 0.0.x milestone, following the same format as 0.1.0+ milestones
- Goal should explain what this iteration sets up and why it matters
- The final 0.0.x milestone should clearly lead into the MVP (v0.1.0)
- Delete this comment and adjust the example sections above when filling in real milestones
-->

---

## v0.1.0 — {Program} / {Module}: {Feature}

**Goal:** {2-4 sentences: What can users do after this release? What does it prove? This is the MVP — the first complete, end-to-end user workflow.}

### Module: {module}

{1-2 sentences: What this module does and why it matters for this milestone.}

| Issue | Status |
|-------|--------|
| [#5 — Issue title](../../issues/5) | ⏳ <!-- STATUS:planned --> |
| [#6 — Issue title](../../issues/6) | ⏳ <!-- STATUS:planned --> |

---

## v1.0.0 — {Program} / {Module}: {Feature}

**Goal:** The stable release. All features from v0.x are tested, polished, and performant. New users can understand the value and start using it within five minutes.

| Issue | Status |
|-------|--------|
| [#X — Full QA pass](../../issues/X) | ⏳ <!-- STATUS:planned --> |
| [#X — Performance optimization](../../issues/X) | ⏳ <!-- STATUS:planned --> |
| [#X — Onboarding flow](../../issues/X) | ⏳ <!-- STATUS:planned --> |
| [#X — Deploy to production](../../issues/X) | ⏳ <!-- STATUS:planned --> |

---

## Feature Index

> Every feature mapped to its milestone, module, and current status. Single source of truth for "where is feature X?"

<!--
FEATURE INDEX:
- Generated by /Start_Project
- Updated by /Feature (status changes), /New_Idea (new features, restructuring), /Release (milestone completion)
- Sort by milestone (ascending), then by module, then by feature name
- Structured comments enable reliable AI parsing alongside human-readable emoji
-->

| Feature | Module | Milestone | Status |
|---------|--------|-----------|--------|
| [{feature-1}](features/{program}/{module}/{feature-1}.md) | [{module}](features/{program}/{module}/_{module}.md) | v0.0.1 | ⏳ <!-- STATUS:planned --> |
| [{feature-2}](features/{program}/{module}/{feature-2}.md) | [{module}](features/{program}/{module}/_{module}.md) | v0.0.2 | ⏳ <!-- STATUS:planned --> |
| [{feature-3}](features/{program}/{module}/{feature-3}.md) | [{module}](features/{program}/{module}/_{module}.md) | v0.1.0 | ⏳ <!-- STATUS:planned --> |
| [{feature-4}](features/{program}/{module}/{feature-4}.md) | [{module}](features/{program}/{module}/_{module}.md) | v0.2.0 | ⏳ <!-- STATUS:planned --> |

---

## Status Key

| Icon | Meaning | Structured Comment |
|------|---------|-------------------|
| ⏳ | Planned | `<!-- STATUS:planned -->` |
| 🔄 | In Progress | `<!-- STATUS:in-progress -->` |
| ✅ | Complete | `<!-- STATUS:complete -->` |
| 🚫 | Blocked | `<!-- STATUS:blocked -->` |

<!--
STRUCTURED COMMENTS:
Every status emoji in a table cell should be followed by a structured HTML comment.
These are invisible to humans reading the markdown but enable reliable AI parsing.

Pattern: {emoji} <!-- STATUS:{value} -->
Values: planned, in-progress, complete, blocked

For progress fields: **Progress:** 2/5 features <!-- PROGRESS:2/5 -->
-->

---

## Technical Approach

> High-level technology decisions that constrain implementation choices.

### Core Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | TBD | UI framework, bundler, styling |
| API | TBD | REST, GraphQL, tRPC |
| Logic | TBD | Backend runtime and framework |
| Data | TBD | Database type, ORM |

### Infrastructure

| Category | Technology | Rationale |
|----------|------------|-----------|
| Hosting | TBD | Where the app runs |
| Cache | TBD | Fast lookups, sessions |
| Files | TBD | Image/media storage |
| Jobs | TBD | Background tasks, scheduled work |

### Services

| Category | Technology | Rationale |
|----------|------------|-----------|
| Auth | TBD | Login, sessions, permissions |
| Notifications | TBD | Email, push, SMS |
| Search | TBD | Full-text search |
| Payments | TBD | Payment processing |

### Operations

| Category | Technology | Rationale |
|----------|------------|-----------|
| Observability | TBD | Logging, errors, monitoring |
| CI/CD | TBD | Build, test, deploy pipeline |

<!--
DESIGN SYSTEM:
All UI projects must follow the Design System standards defined in Standards.md.
This includes tokenized design, light/dark mode support, and premium UI guidelines.
Design System is NOT configurable per-project—it's a standard.
-->

---

## Constraints

[Timeline, budget, team size, platform requirements, technical skills available]

---

## Out of Scope (v1.0)

[What you're explicitly NOT building. Features intentionally excluded.]

---

## Open Questions

| Question | Impact | Status |
|----------|--------|--------|
| [Unresolved question?] | [What it affects] | Open |

---

## Maybe Later

[Ideas worth remembering for future versions, but not in v1.0 scope.]
