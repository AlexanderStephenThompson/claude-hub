---
description: Start a structured interview to define a software project, then generate complete documentation.
argument-hint: <Briefly describe your project idea>
---


**Project to spec:** $ARGUMENTS

# Project Generator

Help users define software projects through structured conversation, then generate complete documentation.

---

## Operating Rules

- **Conversational**: One question at a time during interview phases
- **Adaptive**: If user provides a dump of ideas, organize rather than re-asking
- **Summarize**: Recap after each phase before moving on
- **No assumptions**: Ask rather than guess on architecture decisions
- **Complete output**: Generate all files at the end, not incrementally


---

## When to Trigger

- User runs `/Start_Project` command
- User says "let's spec out [project]" or "help me plan [project]"
- User asks to define, scope, or architect a new project
- User wants to organize a vague idea into buildable scope

---

## Complexity Handling

Adapt the workflow based on what the user brings:

| Situation | Approach |
|-----------|----------|
| Vague idea | Start Phase 1, draw out details |
| Feature list ready | Skip to Phase 3, organize what they have |
| Existing spec | Review and fill gaps |
| Clone with changes | "It's like X but Y" — extract the delta |
| Tech undecided | "TBD" is valid—don't block on it |

---

## Interview Process

Run conversationally—one question at a time, summarize after each phase.

---

### Phase 1: Problem & Vision

**Goal:** Understand what we're solving and for whom.

**Ask:**
- What pain does this solve? Who feels it?
- What exists today? What's wrong with it?
- If this works perfectly, what changes?

**Extract:** Problem statement, solution paragraph, philosophy statement, target user.

**Gate:** Summarize and confirm before proceeding.

---

### Phase 2: Capabilities Brainstorm

**Goal:** List everything users can do—quantity over quality.

**Ask:**
- What can users DO? List every action/feature—don't filter yet.
- What's the magic moment? The feature you'd demo to hook someone.
- What's table stakes vs. differentiator?

**Extract:** Raw feature list, "aha" moment, must-haves vs nice-to-haves.

**Gate:** Read back feature list. Ask "What's missing?" Confirm before proceeding.

---

### Phase 3: Grouping & Architecture

**Goal:** Organize features into programs and modules using the 4-level hierarchy.

**The 4-Level Hierarchy:**

| Level | Definition | GitHub Mapping | Count |
|-------|------------|----------------|-------|
| System | The entire application | Repository | 1 |
| Program | Major domain or mode | Label (e.g., `program:task-management`) | 2-4 total |
| Module | Capability area | GitHub Project Board (kanban per module) | 3-6 per program |
| Feature | Specific user action | GitHub Issue | 3-6 per module |

**Documentation Structure Maps to GitHub:**

```
/Documentation/features/
└── {program}/               ← GitHub label: program:{name}
    └── {module}/            ← GitHub Project board
        ├── _{module}.md     ← Module overview
        ├── feature-1.md     ← GitHub Issue #1
        └── feature-2.md     ← GitHub Issue #2
```

**Process:**
1. Review feature list with user
2. Identify natural clusters → Programs (create labels)
3. Group capabilities within each → Modules (create project boards)
4. Assign features to modules (becomes issues on boards)

**Validate:**
- Can Program A work without Program B?
- Does each module have 3-6 features?
- Could you ship one module independently?
- Does each program deserve its own GitHub label?

**Extract:** Programs (with label names), modules (with board structure), features assigned, cross-program connections.

**Gate:** Present architecture table with GitHub mapping. Confirm before proceeding.

---

### Phase 4: Sequencing & Milestones

**Goal:** Create a clear roadmap from v0.0.1 to v1.0 with strategic sequencing, including Pre-MVP iterations.

**Step 1: Identify Dependencies**

Map module and feature dependencies:

**Ask:**
- Which modules are foundational? (Must exist for others to work)
- Which features within a module must come first?
- What's the critical path? (Longest chain of dependencies)
- Are there circular dependencies? (Flag these for architectural review)

**Create a module dependency map:**
```
Module A (foundation) → Module B → Module D
                     ↘ Module C → Module D
```

**Create a feature dependency map:**

In addition to module-level dependencies, map individual feature-to-feature dependencies. This captures cases where a specific feature (not its whole module) must exist first.

```
create-meal-plan ──→ generate-shopping-list
                 ──→ export-meal-plan-pdf
track-pantry ──────→ smart-shopping-suggestions
```

**Step 2: Define Milestone Strategy**

**Version Definitions:**

| Version | Purpose | Criteria |
|---------|---------|----------|
| v0.0.x | Pre-MVP milestones | Real milestones with full feature tracking. Setup, foundations, early features building toward MVP. Each should deliver something demonstrable. |
| v0.1.0 | MVP (Proof of concept) | First complete user flow, end-to-end. Core infrastructure in place. User can accomplish a real task. |
| v0.2.0-v0.9.0 | Build toward value | Add modules/features in dependency order. Each version delivers something usable. |
| v1.0.0 | Production ready | Feature complete per spec. Polished UX. Error handling. Documentation. Ready for real users. |

> **Versioning rules:** See [Standards/Documentation.md Section 1.4](../../Standards/Documentation.md#14-pre-mvp-versioning-00x) for full 0.0.x rules. 0.0.x milestones use the same tracking (6-column table, milestone details, `/Feature`) as 0.1.0+ milestones.

**Sequencing Principles:**

1. **Dependencies first** - Build foundational modules before dependent ones
2. **Risk early** - Tackle hardest/riskiest features in v0.1-v0.3 while there's time to pivot
3. **Value increments** - Each version should deliver a complete capability, not half-features
4. **User journey** - Prioritize completing one full user workflow over partial coverage of many
5. **Magic moment** - Plan which version delivers the core "aha" experience

**Step 3: Plan the Roadmap**

**Ask for each milestone:**
- What does this version let users DO that they couldn't before?
- What's the demo-able outcome? (The thing you'd show someone)
- Which modules/features go into this version?
- Why this sequence? (What dependencies or value does this unlock?)

**For 0.0.x iterations specifically, also ask:**
- What foundational work needs to happen before the MVP is possible?
- What setup, infrastructure, or data models should be in place first?
- Can any of this foundational work be grouped into demonstrable milestones?
- How many Pre-MVP iterations make sense? (Typically 1-3)

**Create a roadmap table:**

| Version | Release Name | Goal | Modules | Key Features | Unlocks |
|---------|-------------|------|---------|--------------|---------|
| v0.0.1 | Program / Module: Feature | [Foundation/setup] | Module A | Feature 1, 2 | Project foundation |
| v0.0.2 | Program / Module: Feature | [Core models/infra] | Module A | Feature 3, 4 | Ready for MVP features |
| v0.1.0 | Program / Module: Feature | MVP: [User can do X] | Module B | Feature 5, 6 | First complete workflow |
| v0.2.0 | Program / Module: Feature | [User can do Y] | Module C | Feature 7, 8 | Builds on MVP, enables v0.3 |
| v0.3.0 | Program / Module: Feature | [Magic moment] | Module D | Feature 9, 10 | Core value delivered |
| v1.0.0 | Program / Module: Feature | [Production ready] | All modules | Polish, errors, docs | Ready for real users |

**Step 4: Validate the Roadmap**

**Check:**
- Can you build v0.0.2 without v0.0.1 being complete? (No = good sequencing)
- Does each version deliver something demonstrable? (0.0.x: demonstrable foundation; 0.1.0+: user value)
- Is the magic moment before v0.5.0? (Don't wait too long)
- Are risky/unknown features front-loaded? (v0.0.x-v0.3.0)
- Could you stop at any version and have something useful? (Incremental value)
- Is the boundary between the last 0.0.x and v0.1.0 clear? (v0.1.0 = first complete user workflow)

**Semantic Versioning:**

We use standard Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking change to expected behavior, inputs/outputs, or file structure
- **MINOR**: New user-visible capability or workflow outcome (may span multiple modules)
- **PATCH**: Bug fixes, small improvements, formatting tweaks (no new capability)

**Release Naming Format:**

Each milestone/release uses this title format:

`vX.Y.Z — [Program] / [Module]: [Headline Feature]`

The feature should be the **headline capability** of that release—what users can now do.

**Single-module examples:**
- `v0.1.0 — Kitchen / Planning: Create weekly meal plan` — First complete workflow
- `v0.2.0 — Kitchen / Planning: Generate shopping list` — Builds on meal plans
- `v0.3.0 — Garden / Tasks: Track watering routine` — New program unlocked
- `v0.4.1 — Kitchen / Planning: Fix missing quantities` — Patch to existing feature

**Multi-module milestones:** Use the headline feature's program/module in the name. List ALL involved modules in the roadmap table's Modules column and in the milestone detail section.
- `v0.5.0 — Kitchen / Planning: Meal plan sharing` — Modules column: Planning, Social
- `v0.8.0 — Garden / Layout: Companion planting` — Modules column: Layout, Plants

**Optional Scope Tags:**

For commit messages and release notes: `program.module.feature` (kebab-case)

**Extract:**
- Module dependency map (which modules depend on what)
- Feature dependency map (which individual features depend on what)
- Roadmap table (version, release name, goal, modules, features, what it unlocks)
- Rationale for sequencing (why this order)
- Risk items front-loaded in early versions

**Gate:** Present complete roadmap table showing the path from v0.0.1 to v1.0, including Pre-MVP iterations. Confirm sequencing makes sense and the 0.0.x-to-0.1.0 boundary is clear before proceeding.



---
### Phase 5: Technical Approach

**Goal:** Establish technology constraints and lock the default stack.

**Decision rule (per category):** Choose one: **Defaults (recommended)**, **Suggest an alternative**, or **TBD**.

---

#### Core Stack (required)

| Category | What it covers | Default (your stack) | Notes / Options |
|----------|----------------|----------------------|-----------------|
| Frontend | UI framework, bundler, styling | React + Vite + plain HTML/CSS/JS | Styling stays simple: CSS (no SCSS/Sass). Design system in /01-presentation/styles/global.css |
| API | REST, GraphQL, RPC | GraphQL (served from Node/Express) | REST is allowed for simple endpoints; GraphQL is the default contract layer. |
| Logic | Backend runtime + framework | Node.js + Express.js | JavaScript-only backend. |
| Data | Database, ORM, caching | Postgres + Prisma + Redis | Postgres = system of record; Prisma = ORM; Redis = cache/sessions/queues as needed. |

#### Pre-check: Existing Design System

Before asking design questions, check if the user has provided a design system:

**Check:** Is there a theme folder in `01-presentation/styles/` (any folder other than the default files)?

- **If yes:** Read the folder — it contains instructions and everything needed to generate `global.css`. Confirm:
  "✅ Found design system in 01-presentation/styles/{folder-name}/ — using this for the project."
  Skip the design questions below.

- **If no:** Proceed with the design questions below.

#### Design System (required for UI projects)

| Category | What to ask | Example |
|----------|-------------|---------|
| Primary Brand Color | Hex code or color name | #3B82F6 (blue), #10B981 (green), etc. |
| Color Preference | Light/airy vs. dark/bold | "Light and clean" or "Bold and vibrant" |

---

#### Infrastructure (ask which apply)

| Category | What it covers | Default (AWS + IaC) | Notes / Options |
|----------|----------------|---------------------|-----------------|
| Hosting (Frontend) | Where the UI runs | S3 + CloudFront | Static React build deployed to S3, served via CloudFront. |
| Hosting (API) | Where the backend runs | ECS Fargate + ALB | Default is containerized API. Alt: Lambda for smaller apps. |
| Cache | Fast lookups, sessions | ElastiCache (Redis) | Matches Redis in core stack. |
| Files | Image/media storage | S3 | Optional: CloudFront in front of S3 for public assets. |
| Jobs | Background tasks, scheduled work | SQS + ECS worker + EventBridge | Keep jobs out of request/response path. |
| IaC | Repeatable infrastructure | Terraform (default) | Alt: AWS CDK if you want JS-first IaC later. |

---

#### Services (ask which apply)

| Category | What it covers | Default | Notes / Options |
|----------|----------------|---------|-----------------|
| Auth | Login, sessions, permissions | AWS Cognito (default) | Alt: Auth0 / Clerk if you want less AWS surface area. |
| Notifications | Email, push, SMS | Email: SES (default) | Alt: SNS for SMS; push depends on platform. |
| Search | Full-text search | AWS OpenSearch (if needed) | Optional: skip until there’s real search demand. |
| Payments | Payment processing | Stripe | Default payment provider. |

---

#### Operations (ask which apply)

| Category | What it covers | Default | Notes / Options |
|----------|----------------|---------|-----------------|
| Observability | Logging, errors, monitoring | CloudWatch + structured logging | Optional: Sentry for app-level error visibility. |
| CI/CD | Build, test, deploy pipeline | GitHub Actions → AWS deploy | Repeatable deploys with minimal manual steps. |

---

**Output expectation:** For each category above, mark it as **Defaults**, **Alternative**, or **TBD** (and note why if not Defaults).


---

### Phase 6: Constraints & Scope

**Goal:** Surface unknowns and boundaries.

**Ask:**
- What are constraints? (Timeline, budget, team, platform)
- What's explicitly OUT of scope for v1.0?
- What don't you know yet?

**Extract:** Constraints, Out of Scope list, Open Questions, Maybe Later ideas.

**Gate:** Confirm captured before proceeding.

---

### Phase 7: Final Review & Clarification

**Goal:** Tighten loose ends before generating documentation.

**Revisit TBDs:**
- Review any "TBD" answers from earlier phases
- Ask: "You mentioned [X] was uncertain—any clarity now, or flag as open question?"

**Check for gaps:**

| Gap Type | What to Look For |
|----------|------------------|
| Thin modules | Only 1-2 features? May need more, or merge |
| Orphan features | Doesn't fit a module? May need new module |
| Missing dependencies | Does Module B need Module A's data? |
| Unclear boundaries | Where does one feature end and another begin? |

**Clarify assumptions:**
- Surface any assumptions you're making
- Ask: "I'm assuming [X]—is that right?"

**Surface risks:**

| Category | Questions to Ask |
|----------|------------------|
| Technical | What could be hard to build? |
| User flows | Any paths that seem tricky? |
| Data | Empty states, large datasets, bad input? |
| Integration | Where do systems touch? What could break? |

**Priority check:**
- What's most critical to get right?
- Anything that seemed important but now feels less essential?

**Final questions:**
1. "Let me recap what I have: [summary]. What's missing or wrong?"
2. "Any last thoughts on [weakest area]?"
3. "What's the one thing that would make this spec useless if I got it wrong?"

**Extract:** Resolved TBDs, new open questions, corrected assumptions, priority notes, risks.

**Gate:** User confirms ready → Proceed to Documentation Generation.

---

## Documentation Generation

After all phases, generate these files using the following templates as the structure:

- `Documentation/project-planning/project-roadmap-template.md` - For the main project roadmap
- `Documentation/project-planning/module-template.md` - For each module explainer
- `Documentation/project-planning/feature-development.md` - For each feature file

### 1. project-roadmap.md

Create `/Documentation/project-roadmap.md` following the structure in `Documentation/project-planning/project-roadmap-template.md`.

Fill all sections:
- Problem / Solution / Philosophy
- At a Glance (programs → modules → features hierarchy)
- Target User
- GitHub Mapping (4-level hierarchy: System→Program→Module→Feature)
- Module Dependencies map + Feature Dependencies map
- Milestones table + detailed sections (use structured comments: `<!-- STATUS:planned -->`)
- **Feature Index** — flat table mapping every feature to its milestone, module, and status
- Technical Approach (all four sub-tables: Core Stack, Infrastructure, Services, Operations)
- Constraints
- Out of Scope
- Open Questions
- Maybe Later

### 2. Folder Structure

```
/Documentation/
  project-roadmap.md
  architecture.md
  changelog.md
  features/
    {program}/
      {module}/
        _{module}.md        ← module explainer (underscore sorts first)
        feature-1.md        ← one file per feature
        feature-2.md
        feature-3.md
/Config/
  environment.ts            ← environment variables
  constants.ts              ← app constants
/.husky/
  pre-commit                ← runs fast validators before commits
```

### 3. Module Explainers

For each module, create `/Documentation/features/{program}/{module}/_{module}.md` following the structure in `Documentation/project-planning/module-template.md`.

Include:
- Module overview and purpose
- Feature table listing all features in the module (with Milestone column and structured status comments)
- Structured progress count: `**Progress:** 0/{N} features <!-- PROGRESS:0/{N} -->`
- Dependencies and connections to other modules

### 4. Feature Files (REQUIRED)

**CRITICAL:** For every feature listed in a module's feature table, you MUST create a separate `.md` file.

Each feature file follows the structure in `Documentation/project-planning/feature-development.md`.

**Requirements:**
- Path: `/Documentation/features/{program}/{module}/{feature-name}.md`
- One file per feature — no exceptions
- The feature name in the filename should match the feature name in the module's table

**Each feature file includes:**
- One-line description
- Module link, milestone (v{X.Y.Z}), and status with structured comment (`<!-- STATUS:planned -->`)
- User story (As a / I want / So that)
- Overview and basic scenario
- Acceptance criteria (testable checkboxes)
- Data model (if applicable)
- Technical notes with **Standards Checklist** (references Standards.md)
- Open questions
- Related features

**Example:** If a module lists 3 features (login, logout, password-reset), create:
```
/Documentation/features/{program}/{module}/
  _{module}.md         ← module explainer
  login.md             ← feature file
  logout.md            ← feature file
  password-reset.md    ← feature file
```

**Verification:** After creating module explainers, count the total features across all modules. You must have that many feature files created.

### 5. Architecture Doc

Create `/Documentation/architecture.md` with:
- Overview
- System Diagram
- Key Components table
- Data Flow
- Design Decisions table
- Conventions

### 6. Changelog

Create `/Documentation/changelog.md` following Keep a Changelog format.

Use the Semantic Versioning scheme from Phase 4:
- Release titles: `vX.Y.Z — [Program] / [Module]: [Feature]`
- Optional scope tags: `program.module.feature`

### 7. Design System (global.css)

Create `/01-presentation/styles/global.css` with the complete design system based on the project context gathered during the interview.

**Source priority:**
1. Theme folder in `01-presentation/styles/` (if exists) — read its instructions and use directly
2. Interview responses from Phase 5 — generate tokens from brand color and preference

**Include all design tokens:**
- Color palette (neutrals, semantic colors, dark mode)
- Typography scale (font families, sizes, weights, line heights)
- Spacing units (4px base system)
- Border radii (sm, md, lg, full)
- Shadows (sm, md, lg)
- Z-index layers (dropdown, sticky, modal, tooltip)

**Additional styles:**
- CSS reset/normalize
- Base styles (body, headings, paragraphs)
- Utility classes (if needed)
- Dark mode styles using `@media (prefers-color-scheme: dark)`
- Accessibility preferences (prefers-reduced-motion)

**Primary brand color** should be determined during the interview (Phase 5: Technical Approach).

### 8. Config Files

Create `/Config/` folder with environment and constants based on tech stack choices from Phase 5.

**Create `/Config/environment.ts`:**
```typescript
// Environment configuration
// Values come from environment variables with sensible defaults

export const ENV = {
  // API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

  // Feature flags (add as needed)
  // ENABLE_FEATURE_X: process.env.REACT_APP_ENABLE_FEATURE_X === 'true',
};
```

**Create `/Config/constants.ts`:**
```typescript
// Application constants
// These don't change between environments

export const APP = {
  NAME: '[Project Name]',
  VERSION: '0.1.0',
};

export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_ITEMS_PER_PAGE: 50,
};

// Add project-specific constants based on features defined
```

Customize these files based on the tech stack and features defined during the interview.

### 9. Pre-commit Hooks (Husky)

Set up Husky pre-commit hooks to run fast validators before every commit.

**Create `/.husky/pre-commit`:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit standards checks..."

# Run fast validators (blocking)
node .claude/validators/design-tokens.js || exit 1
node .claude/validators/architecture-boundaries.js || exit 1
node .claude/validators/file-naming.js || exit 1
node .claude/validators/secret-scanner.js || exit 1

echo "✅ All pre-commit checks passed!"
```

**Note:** The pre-commit hook runs the fast validators (~2 seconds total):
1. Design tokens - No hardcoded CSS values
2. Architecture boundaries - 3-tier architecture respected
3. File naming - Conventions followed
4. Secret scanner - No hardcoded secrets
5. Documentation sync - Docs match reality

The slower validators (test coverage, documentation, semantic HTML, contrast) run when `/Feature` completes.

**After generating, instruct user to run:**
```bash
npx husky install
chmod +x .husky/pre-commit
```

### 10. Update CLAUDE.md Project State

Replace the content between `<!-- PROJECT_STATE_START` and `PROJECT_STATE_END -->` in `CLAUDE.md` with the actual project data:

```markdown
<!-- PROJECT_STATE_START -->
## Project State

This section is auto-maintained by slash commands. It gives you immediate context without reading multiple files.

**Project:** {Project Name} — {one-line description}
**Version:** 0.0.0
**Current Milestone:** v0.0.1 — {Release Name}
**Milestone Progress:** 0/{N} features

### Quick Context
| Key | Value |
|-----|-------|
| Programs | {count} ({list names}) |
| Modules | {count} ({list names}) |
| Features | {total} (0 complete, {total} planned) |
| Tech Stack | {Frontend} + {API} + {Data} |

### Active Work
No features in progress. Start with:
```
/Feature {first-feature-path}
```

### What to Read Next
- `Documentation/project-roadmap.md` — Full roadmap with milestones and dependencies
- `Documentation/architecture.md` — System design and data flow
- `Documentation/features/{first-program}/{first-module}/_{module}.md` — First module to build

<!-- PROJECT_STATE_END -->
```

**This is critical** — CLAUDE.md is what AI reads first in every session. The Project State section ensures immediate context.

### 11. Rewrite README.md

Replace the template README with a project-specific version:

```markdown
# {Project Name}

{Solution paragraph from Phase 1}

---

## Getting Started

### Prerequisites
- Node.js >= 18
- {tech-stack-specific prerequisites}

### Setup
\`\`\`bash
npm install
npx husky install
npm run validate
\`\`\`

### Development Workflow
1. Check the roadmap: `Documentation/project-roadmap.md`
2. Pick a feature from the current milestone
3. Build it: `/Feature {program}/{module}/{feature-name}`
4. When milestone is done: `/Release v{X.Y.Z}`

---

## Project Structure

\`\`\`
{project-name}/
├── 01-presentation/     # UI layer
├── 02-logic/            # Business logic
├── 03-data/             # Data layer
├── Config/              # Environment and constants
├── 01-presentation/styles/global.css    # Design system tokens
├── Documentation/       # Living project documentation
├── Standards/           # Quality standards
└── .claude/             # AI commands and validators
\`\`\`

---

## Current Status

**Version:** 0.0.0
**Current Milestone:** v0.0.1 — {Release Name}
**Progress:** 0/{N} features

See `Documentation/project-roadmap.md` for the full roadmap.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run validate` | Run all automated validators |
| `/Feature {path}` | Build a feature from spec to completion |
| `/New_Idea {desc}` | Add a feature or restructure milestones |
| `/Bug {desc}` | Report and fix a bug |
| `/Release {ver}` | Ship a completed milestone |
```

Customize based on the project's tech stack and features. The README should answer "what is this, how do I set it up, and what do I do next" — not describe the template system.

### 12. Git Branching Convention

Include the project's branching strategy in the generated `Documentation/project-roadmap.md` under a "## Branching Convention" section (placed after "## GitHub Mapping" and before "## Versioning Mindset").

**Content to generate:**

```markdown
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
```

---

## Output Summary

After generating all files, present this summary:

```
## Project Spec Generated

**Project:** [Name]
**Architecture:** [X] Programs → [Y] Modules → [Z] Features

### Files Created/Updated
- CLAUDE.md — Project State section populated (AI reads this first every session)
- README.md — Rewritten with project-specific setup and status
- project-roadmap.md (living document tracking plan + progress)
- architecture.md
- changelog.md
- global.css (complete design system with tokens)
- Config/environment.ts (environment variables)
- Config/constants.ts (app constants)
- .husky/pre-commit (pre-commit validation hook)
- Branching convention (documented in project-roadmap.md)
- {N} module explainers (_{module}.md files)
- {Z} feature files ← MUST match total feature count above

### Verification
✓ Feature file count ([Z]) matches total features in project roadmap

### Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | [choice] |
| API | [choice] |
| Logic | [choice] |
| Data | [choice] |

### Roadmap (v0.0.1 → v1.0)

| Version | Release Name | Goal | Modules | Unlocks |
|---------|-------------|------|---------|---------|
| v0.0.1 | [Program / Module: Feature] | [Foundation/setup] | [X] | Project foundation |
| v0.0.x | [Program / Module: Feature] | [Pre-MVP work] | [X] | Ready for MVP |
| v0.1.0 | [Program / Module: Feature] | MVP: [User can do X] | [Y] | First complete workflow |
| v0.2.0 | [Program / Module: Feature] | [What users can do] | [Z] | Builds on MVP |
| v1.0.0 | [Program / Module: Feature] | Production ready | All | Ready for real users |

**Total:** [N] versions planned, [M] modules, [F] features

### Dependency Map

```
[Foundation Module] → [Dependent Module A]
                   ↘ [Dependent Module B] → [Final Module]
```

### Next Steps

1. Install dependencies: `npm install`
2. Set up pre-commit hooks: `npx husky install && chmod +x .husky/pre-commit`
3. Run validators to verify setup: `npm run validate`
4. Review project-roadmap.md for accuracy
5. Create GitHub issues from feature specs (optional)
6. Begin first milestone implementation
```

---

## Style Guidelines

- Conversational during interview—one question at a time
- If user dumps ideas, organize rather than re-ask
- Summarize each phase: "Here's what I have so far..."
- "TBD" is valid for technical decisions
- kebab-case for folders and files
- Programs = nouns, Modules = noun-phrases, Features = verb/noun-phrases

### Status Formats

| Context | Format | Values |
|---------|--------|--------|
| project-roadmap.md (milestones, issues, Feature Index) | Emoji + structured comment | ⏳ `<!-- STATUS:planned -->`, 🔄 `<!-- STATUS:in-progress -->`, ✅ `<!-- STATUS:complete -->`, 🚫 `<!-- STATUS:blocked -->` |
| Module files (feature table) | Emoji + structured comment | Same as above |
| Module files (progress) | Text + structured comment | `**Progress:** 2/5 features <!-- PROGRESS:2/5 -->` |
| Feature files (status) | Text + structured comment | `**Status:** Planned <!-- STATUS:planned -->` |
| Open questions | Text | Open, Resolved |

Emoji stays for human readability. Structured HTML comments enable reliable AI parsing.

---

After the interview, use the information gained to generate a complete project roadmap and documentation for the described software project.

---

## Related Commands

| Command | When to Use |
|---------|-------------|
| `/Convert` | Convert an existing project or upgrade to latest template |
| `/Feature` | Build a feature from the generated spec |
| `/New_Idea` | Add features or restructure milestones mid-project |
| `/Bug` | Report and fix bugs (PATCH versioning) |
| `/Release` | Ship a completed milestone |

