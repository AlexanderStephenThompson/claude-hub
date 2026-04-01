# Official Web Template

A comprehensive project template with built-in standards enforcement, automated documentation, and a structured workflow for building high-quality web applications.

---

## 📋 Process Overview

1. **Clone & Install** → `npm install` then `npm run validate` (shows guidance)
2. **Run `/Start_Project` or `/Convert`** → Generate project documentation (new or existing project)
3. **Review** `Documentation/project-roadmap.md` → Validate your plan
4. **Pick first feature** → From the first milestone
5. **Build** → `/Feature` handles TDD, standards, and completion
6. **New ideas?** → `/New_Idea` adds features or restructures milestones
7. **Found a bug?** → `/Bug` reports and tracks the fix
8. **Milestone done?** → `/Release` ships it (version bump, changelog, tag)
9. **Repeat** → Auto-tracked progress

### **Six Commands, Complete Workflow**

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/Start_Project` | New project | 7-phase interview → generates all documentation |
| `/Convert` | Existing project | Scans codebase → generates docs → enables all commands. Also upgrades already-converted projects. |
| `/Feature` | Building | Lock → Research → Build with TDD → validate → update all docs |
| `/New_Idea` | Anytime | Capture → Refine (pressure-test) → Place → spec. Also restructures milestones. |
| `/Bug` | Something broken | Reports bug → tracks fix → PATCH version bump |
| `/Release` | Milestone complete | Finalizes changelog → bumps version → creates git tag |

### **Resumable Workflows**

`/Feature` and `/New_Idea` save progress to `.claude/dispatch/`. If a session ends mid-workflow (on phone, lost connection, etc.), running the command again picks up exactly where you left off. No work lost, no repeated steps.

---

## 📋 How /Start_Project Works

Run `/Start_Project` to generate your complete project documentation.

### **7-Phase Interview**

1. **Problem & Vision** → What problem? For whom?
2. **Capabilities** → What can users do? What's the "aha" moment?
3. **Architecture** → Organize into Programs → Modules → Features
4. **Roadmap** → Sequence features from v0.0.1 to v1.0
5. **Tech Stack** → Choose infrastructure, services, operations
6. **Scope** → Define constraints, what's out, open questions
7. **Review** → Validate, clarify, surface risks

### **What Gets Generated**

1. **project-roadmap.md** → Complete roadmap with milestones, dependencies, tech stack
2. **Module explainers** → One per module with feature table and dependencies
3. **Feature specs** → One per feature with user story, acceptance criteria, standards checklist
4. **architecture.md** → System diagram, components, data flow
5. **changelog.md** → Version history (Keep a Changelog format)
6. **01-presentation/styles/global.css** → Complete design system with all tokens
7. **Config/** → environment.ts and constants.ts based on your tech stack
8. **.husky/pre-commit** → Pre-commit hook running fast validators
9. **GitHub templates** → Issue templates for features

### **How Dependencies Shape Your Roadmap**

During the `/Start_Project` interview, the AI analyzes feature dependencies to automatically structure your roadmap:

**Dependency Analysis:**
- Identifies which modules depend on others (e.g., "Shopping List" requires "Meal Plans")
- Determines foundation features that enable other features
- Maps cross-module dependencies

**Milestone Sequencing:**
- **Foundation First:** Features with no dependencies go in early milestones (v0.0.1)
- **Progressive Building:** Dependent features are sequenced after their dependencies
- **Logical Flow:** Milestones follow natural dependency chains

**Example:**
```
v0.0.1 → Project setup, CI, core data models
v0.0.2 → Basic meal plan data layer
v0.1.0 → Create Meal Plan — MVP (first complete workflow)
v0.2.0 → Generate Shopping List (depends on meal plan)
v0.3.0 → Track Pantry Inventory (depends on shopping list)
```

**In the Generated Files:**
- **project-roadmap.md** includes a dependency map showing module relationships
- **Module explainers** list what each module enables and what it depends on
- **Feature sequencing** within modules follows dependency order

This ensures you build features in the right order, avoiding blockers where a feature needs functionality that hasn't been built yet.

---

### **Complete Workflow**

```
┌─────────────────────────────────────────────────┐
│  You run: /Start_Project                       │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  INTERVIEW PHASES   │
        │  (7 conversational  │
        │   questions)        │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │  AI gathers:                            │
        │  • Problem/solution/philosophy          │
        │  • Programs, modules, features          │
        │  • Roadmap (v0.0.1 → v1.0)              │
        │  • Tech stack decisions                 │
        │  • Constraints & scope                  │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼───────────────────────────────┐
        │  DOCUMENTATION GENERATION                │
        │                                          │
        │  References 3 templates for structure:   │
        │  ├─ project-roadmap-template.md          │
        │  ├─ module-template.md                   │
        │  └─ feature-development.md               │
        │                                          │
        │  Generates YOUR project files:           │
        │  1. project-roadmap.md                   │
        │  2. Module explainers × N                │
        │  3. Feature specs × Z                    │
        │  4. architecture.md                      │
        │  5. changelog.md                         │
        │  6. 01-presentation/styles/global.css                    │
        │  7. Config/ (environment + constants)    │
        │  8. .husky/pre-commit                    │
        │  9. GitHub issue template                │
        └──────────┬───────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  YOU GET:           │
        │  ✅ Complete spec   │
        │  ✅ Ready to build  │
        │  ✅ All docs synced │
        └─────────────────────┘
```

---

## 📋 How /New_Idea Works

Run `/New_Idea` anytime during development to add new features to your project. The command captures your raw idea, pressure-tests it collaboratively against the existing roadmap, then places and specs it.

```
/New_Idea Add ability to export meal plans as PDF
```

### **7-Phase Process**

1. **Capture** → Write raw idea to dispatch artifact for persistence
2. **Refine** → Collaborative pressure-testing: what problem does it solve, does it overlap, effort vs. impact, proceed/merge/park?
3. **Place** → Determines program/module (or creates new ones if needed)
4. **Dependencies** → Analyzes what it depends on and what it enables
5. **Milestone** → Assigns to existing milestone, new milestone, or "Maybe Later"
6. **Generate** → Creates feature spec from template
7. **Update** → Updates module explainer, roadmap, dependency map, changelog

### **Three Outcomes from Refine**

| Outcome | What Happens |
|---------|-------------|
| **Proceed** | Idea passes pressure-test → continues to Place, Spec, and Update |
| **Park** | Nice idea, wrong timing → archived in `.claude/dispatch/ideas/` with reasoning |
| **Merge** | Overlaps with existing feature → optionally update that feature's spec |

### **Resumable**

If a session ends after Capture but before Refine, running `/New_Idea` again resumes at Refine. If it ends after Refine, resumes at Place with context pre-filled.

### **Handles Edge Cases**

- **New module needed?** → Creates module explainer first
- **Circular dependency?** → Flags it and asks how to resolve
- **Duplicate feature?** → Surfaces existing feature during Refine
- **Low priority?** → Offers parking or "Maybe Later" option

### **Example**

```
User: /New_Idea Export meal plan as PDF

AI: [Captures idea, scans roadmap]
    Let me pressure-test this with you.

    What problem does exporting to PDF solve — printing, sharing, or offline access?

User: Printing weekly plans for the fridge.

AI: Clear use case. Low-medium effort, high impact. No overlap with existing features.
    Recommendation: proceed. Kitchen / Planning is the right home.

    📍 Placing in Kitchen / Planning.
    🔗 Depends on: "Create meal plan"
    📅 Milestone: v0.3.0

    ✅ Created: /Documentation/features/kitchen/planning/export-meal-plan-pdf.md
    ✅ Updated: Module explainer, roadmap, dependency map
```

**See:** [.claude/commands/New_Idea.md](./.claude/commands/New_Idea.md)

---

## 📋 How /Bug Works

Different from `/Feature` — optimized for quick fixes with PATCH versioning.

```
/Bug Login button doesn't work on mobile
```

### **Bug vs Feature**

| Aspect | /Bug | /Feature |
|--------|------|----------|
| **Purpose** | Fix something broken | Add something new |
| **Version** | PATCH (0.1.0 → 0.1.1) | MINOR (0.1.0 → 0.2.0) |
| **Changelog** | "### Fixed" | "### Added" |
| **Template** | Short (no user story) | Full (user story, acceptance criteria) |
| **Workflow** | Fast — describe, fix, done | Full — spec, build, validate, complete |

### **Bug Lifecycle**

```
Open → In Progress → Fixed
```

### **Severity Levels**

| Severity | When to Use |
|----------|-------------|
| **P0 Critical** | App is broken, users blocked |
| **P1 High** | Major feature broken, workaround exists |
| **P2 Medium** | Minor feature broken, low impact |
| **P3 Low** | Cosmetic or edge case issue |

**See:** [.claude/commands/Bug.md](./.claude/commands/Bug.md)

---

## 📋 How /Release Works

Ship a completed milestone with one command.

```
/Release v0.2.0
```

### **What It Does**

1. **Validates** all features in the milestone are complete
2. **Runs** `npm run validate` to confirm standards pass
3. **Finalizes** changelog (moves Unreleased entries to versioned section with date)
4. **Bumps** version in `package.json` and `Config/constants.ts`
5. **Updates** roadmap and Feature Index to mark milestone complete
6. **Creates** git tag `vX.Y.Z` with release summary

### **Release Types**

| Type | When | Version Bump | Example |
|------|------|-------------|---------|
| **PRE-MVP** | 0.0.x milestone complete | v0.0.x → v0.0.x+1 | `/Release v0.0.2` |
| **MVP** | Final 0.0.x + MVP declaration | v0.0.x → v0.1.0 | `/Release v0.1.0` |
| **MINOR** | Post-MVP milestone complete | v0.X.0 → v0.X+1.0 | `/Release v0.2.0` |
| **PATCH** | Bug fixes only | v0.X.Y → v0.X.Y+1 | `/Release v0.1.1` |

### **Auto-Detection**

Run `/Release` with no argument and it scans for milestones where all features are complete.

**See:** [.claude/commands/Release.md](./.claude/commands/Release.md)

---

## 📋 How /Convert Works

One command for two scenarios: bring a raw project into the framework, or upgrade an already-converted project to the latest template.

```
/Convert                    ← auto-detects which mode
/Convert /path/to/project   ← target a specific project
```

### **Two Modes**

| Your Project | Mode | What Happens |
|-------------|------|-------------|
| No framework yet | **Fresh Convert** | 5-agent pipeline scans, migrates, documents (9 phases) |
| Already has framework | **Upgrade** | Diffs against latest template, updates what's outdated (4 phases) |

### **Fresh Convert — 5-Agent Pipeline**

| Agent | What It Does |
|-------|-------------|
| **Scanner** | Deep-reads codebase, classifies every file, builds dependency map |
| **Architect** | Plans where each file goes in 01-presentation/, 02-logic/, 03-data/ |
| **Migrator** | Moves files with `git mv`, updates all import paths |
| **Documenter** | Generates roadmap, features, modules, changelog, architecture |
| **Verifier** | Runs validators, checks imports, produces ADOPT-REPORT.md |

### **Upgrade**

Updates template-owned files (Standards, validators, CLAUDE.md template sections) while preserving all project-specific content (roadmap, features, changelog, code). Shows a diff report before applying.

### **What Gets Detected Automatically (Fresh Convert)**

| Source | What It Finds |
|--------|--------------|
| `package.json` | Project name, version, tech stack, dependencies |
| Folder structure | Programs, modules, feature boundaries |
| File contents | Presentation vs logic vs data classification |
| Git tags | Past releases and dates |
| Git log | Feature completion dates, current work |
| Import graphs | Module and feature dependencies |
| Test files | What's tested and working |

### **Convert vs Start_Project**

| | `/Start_Project` | `/Convert` (Fresh) |
|--|-----------------|----------|
| **For** | New projects (no code) | Existing projects (code already written) |
| **Interview** | Full 7-phase (30+ questions) | Scan first, ask gaps (5-8 questions) |
| **Features** | All Planned | Mix of Complete, In Progress, Planned |
| **Changelog** | Empty template | Backfilled from git history |
| **Milestones** | All future | Past (from tags) + future (from interview) |
| **File structure** | Creates empty 3-tier folders | Moves existing files INTO 3-tier |
| **Agents** | None (single command) | 5-agent pipeline |

**See:** [.claude/commands/Convert.md](./.claude/commands/Convert.md) and [.claude/agents/](./.claude/agents/)

---

## 🌿 Branching Strategy

This template uses **GitHub Flow** — all work happens on feature branches that merge back to `main`.

### **Branch Naming**

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/{feature-name}` | `feature/create-meal-plan` |
| Bug fix | `fix/{bug-name}` | `fix/login-button-mobile-safari` |
| Release | No branch (tag on `main`) | Tag: `v0.2.0` |

### **How Commands Manage Branches**

| Command | Creates Branch | Merges Branch |
|---------|---------------|---------------|
| `/Feature` | `feature/{name}` at start | Merges to `main` at completion |
| `/Bug` | `fix/{name}` at fix start | Merges to `main` when fixed |
| `/Release` | None | Tags `main` |
| `/New_Idea` | None | None (documentation only) |

### **Workflow**

```
main ──●──────────────────────────────●──── tag v0.1.0
        \                            /
         └── feature/create-meal-plan ┘
              (commits on branch)
```

1. `/Feature` creates branch from latest `main`
2. All code and doc changes happen on the feature branch
3. On completion, `/Feature` merges to `main` with `--no-ff`
4. Branch is deleted after merge
5. `/Release` tags `main` when a milestone is complete

### **Rules**

- `main` is always the latest stable state
- Never commit directly to `main` during feature/bug work
- Merge commits preserve branch history (`--no-ff`)
- Delete branches after merge

---

## 📋 What's Included in This Template

### **Standards & Enforcement**

Comprehensive standards that are automatically enforced through validators:

- **[Code Quality Standards](./Standards/Code-Quality.md)** - 3-tier architecture, TDD, naming conventions
- **[Design Standards](./Standards/Design.md)** - Design system, semantic HTML, accessibility (WCAG AA)
- **[Documentation Standards](./Standards/Documentation.md)** - Semantic versioning, living documentation
- **[Security Standards](./Standards/Security.md)** - OWASP Top 10, authentication, data protection
- **[Standards Checklist](./Standards/Checklist.md)** - Scope-filtered verification checklist

### **Automated Validators**

5 validators automatically check your code before commits and feature completion:

1. **Design Tokens** - Blocks hardcoded CSS values
2. **Architecture Boundaries** - Enforces 3-tier architecture (presentation → logic → data)
3. **File Naming** - Validates naming conventions
4. **Secret Scanner** - Prevents hardcoded secrets
5. **Documentation Sync** - Ensures docs match code reality

**See:** [Validator Summary](./.claude/VALIDATOR-SUMMARY.md)

---

## 🏗️ Project Structure

After running `/Start_Project`, your project will follow this structure:

```
project-root/
├── 01-presentation/          # UI layer (components, pages, styles)
│   └── styles/global.css   # Design system tokens (generated)
├── 02-logic/                 # Business logic (services, use cases)
├── 03-data/                  # Data layer (repositories, API clients)
├── tests/e2e/               # Layer 3 behavioral tests
├── Config/                   # Configuration (generated)
│   ├── environment.ts       # Environment variables
│   └── constants.ts         # App constants
├── Documentation/
│   ├── project-roadmap.md   # Your living roadmap (generated)
│   ├── architecture.md      # System architecture (generated)
│   ├── changelog.md         # Version history (generated)
│   ├── bugs/                # Bug reports (created by /Bug)
│   └── features/
│       └── {program}/
│           └── {module}/
│               ├── _{module}.md      # Module explainer (generated)
│               └── {feature}.md      # Feature specs (generated)
├── Standards/               # Non-negotiable quality standards
│   ├── Checklist.md        # Scope-filtered compliance checklist
│   ├── Code-Quality.md
│   ├── Design.md
│   ├── Documentation.md
│   └── Security.md
├── .claude/
│   ├── commands/           # AI commands
│   └── validators/         # Automated standards enforcement
├── .husky/
│   └── pre-commit          # Pre-commit validation hook (generated)
└── README.md              # This file
```

---

## 🏗️ Building Your Project

### **Where to Track Progress**

Your project has **three levels of progress tracking**:

#### **1. Project Roadmap** (High-Level Overview)
**File:** `Documentation/project-roadmap.md`

This is your **living document** and source of truth. Check here to:
- ✅ See all milestones (v0.0.1, v0.0.2, v0.1.0, v0.2.0, etc.)
- ✅ View milestone status: ⏳ Planned → 🔄 In Progress → ✅ Complete
- ✅ Track overall progress (e.g., "v0.1.0: 2/3 features complete")
- ✅ See dependency map (which modules depend on others)
- ✅ Review the roadmap table with all versions

**Example:**
```markdown
## Roadmap: v0.0.1 → v1.0

| Version | Release Name | Goal | Modules | Key Features | Status |
|---------|-------------|------|---------|--------------|--------|
| v0.0.1 | Kitchen / Planning: Project setup | Foundation | Planning | Setup, CI, data models | ✅ Complete |
| v0.1.0 | Kitchen / Planning: Create meal plan | MVP: First workflow | Planning | Create plan, Edit plan | 🔄 In Progress (1/2) |
| v0.2.0 | Kitchen / Planning: Shopping list | Shop from plans | Planning | Generate list | ⏳ Planned |
```

#### **2. Module Explainers** (Mid-Level Detail)
**Files:** `Documentation/features/{program}/{module}/_{module}.md`

Check module explainers to:
- ✅ See all features in a module
- ✅ View feature status (⏳ Planned, 🔄 In Progress, ✅ Complete)
- ✅ Track module completion (e.g., "3/6 features complete - 50%")
- ✅ Understand module dependencies

**Example:** `Documentation/features/kitchen/planning/_planning.md`
```markdown
**Status:** In Progress
**Features:** 4 total (1 complete, 1 in progress, 2 planned)

| Feature | Status | Description |
|---------|--------|-------------|
| Create meal plan | ✅ Complete | Users can create weekly meal plans |
| Generate shopping list | 🔄 In Progress | Auto-generate list from meal plan |
| Track pantry inventory | ⏳ Planned | Track what's in the pantry |
| Export meal plan | ⏳ Planned | Export plan to PDF or share |
```

#### **3. Feature Files** (Detailed Specs)
**Files:** `Documentation/features/{program}/{module}/{feature-name}.md`

Each feature file contains:
- ✅ Current status (Planned → In Progress → Complete)
- ✅ User story (As a / I want / So that)
- ✅ Acceptance criteria (testable checkboxes)
- ✅ Data model (if applicable)
- ✅ Technical notes
- ✅ **Standards Checklist** (scope-filtered items to verify)

**Example:** `Documentation/features/kitchen/planning/create-meal-plan.md`
```markdown
**Status:** In Progress
**Started:** 2026-01-03

## User Story
As a homesteader
I want to create a weekly meal plan
So that I can organize my meals and know what to cook

## Acceptance Criteria
- [x] User can create a new meal plan
- [x] User can select a week start date
- [ ] User can add breakfast, lunch, dinner for each day
- [ ] User can save the meal plan
```

---

### **How to Build Features**

Two ways to start:

```
/Feature kitchen/planning/create-meal-plan    ← you know which feature
/Feature                                       ← let it pick for you
```

**`/Feature` without arguments** reads your roadmap and presents the highest-leverage features with met dependencies. You pick, it locks.

**The command handles everything:**
1. **Lock** → Picks the feature, assesses project state, sets scope boundaries
2. **Research** → Explores codebase for patterns, pitfalls, and reusable code
3. **Build** → TDD across 3-tier architecture (data → logic → presentation)
4. **Validate** → Standards checklist, automated validators
5. **Complete** → Update all docs, merge to main, clean up

**Resumable:** If you stop after Lock or Research (e.g., working from phone), running `/Feature` again picks up where you left off.

---

### **The Complete Build Cycle**

Here's the full workflow from picking a feature to marking it complete:

```
┌─────────────────────────────────────────────────┐
│ 1. CHECK ROADMAP                                │
│    Open: Documentation/project-roadmap.md       │
│    Find: Current milestone (e.g., v0.0.1)       │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ 2. PICK FEATURE     │
        │    Open: _module.md │
        │    Check deps       │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 3. READ FEATURE SPEC                    │
        │    Open: feature-name.md                │
        │    Review:                              │
        │    • User story                         │
        │    • Acceptance criteria                │
        │    • Data model                         │
        │    • Technical notes                    │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 4. CREATE BRANCH & UPDATE STATUS        │
        │    git checkout -b feature/{name}       │
        │                                         │
        │    Edit feature-name.md:                │
        │    Status: Planned → In Progress        │
        │    Started: [today's date]              │
        │                                         │
        │    Edit _module.md:                     │
        │    Update feature table (⏳ → 🔄)       │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 5. INSTRUCT AI TO BUILD                 │
        │    Share feature spec with AI           │
        │    Reference standards                  │
        │    Build using TDD (Red-Green-Refactor) │
        │    • Data layer (03-data)               │
        │    • Logic layer (02-logic)             │
        │    • Presentation layer (01-presentation│
        │    Use design tokens from global.css    │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 6. VERIFY STANDARDS CHECKLIST            │
        │    Open: Standards/Checklist.md         │
        │    Go through ALL active-scope items:             │
        │    ☐ Code Quality (15 items)            │
        │    ☐ Design (32 items)                  │
        │    ☐ Documentation (10 items)           │
        │    ☐ Security (13 items)                │
        │                                         │
        │    Fix any failures                     │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 7. DOCUMENT CHECKLIST COMPLETION        │
        │    Edit feature-name.md:                │
        │                                         │
        │    ### Standards Checklist              │
        │    Status: ✅ All standards met         │
        │    - [x] Code Quality verified          │
        │    - [x] Design standards met           │
        │    - [x] Documentation updated          │
        │    - [x] Security reviewed              │
        │                                         │
        │    Verified by: [Your Name]             │
        │    Date: [Today]                        │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 8. FEATURE AUTO-COMPLETES               │
        │    When all criteria met, /Feature      │
        │    validates and updates all docs       │
        │                                         │
        │    This automatically updates:          │
        │    ✅ Feature file (status → Complete)  │
        │    ✅ Module explainer (progress count) │
        │    ✅ Project roadmap (milestone status)│
        │    ✅ Changelog (adds entry)            │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 9. MERGE TO MAIN                        │
        │    /Feature auto-merges:                │
        │    git checkout main                    │
        │    git merge --no-ff feature/{name}     │
        │    git branch -d feature/{name}         │
        └──────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ 10. RELEASE MILESTONE (when ready)      │
        │    When all features in a milestone are  │
        │    complete, run:                        │
        │    /Release v{X.Y.Z}                    │
        │                                          │
        │    This automatically:                   │
        │    ✅ Finalizes changelog with date      │
        │    ✅ Bumps version in package.json      │
        │    ✅ Updates roadmap (✅ Complete)       │
        │    ✅ Creates git tag                    │
        └─────────────────────────────────────────┘
```

---

### **Example: Building Your First Feature**

Building **"Create meal plan"** from the Kitchen/Planning module:

```
/Feature kitchen/planning/create-meal-plan
```

**That's it.** The AI:
1. Marks it "In Progress" (updates feature file, module, roadmap)
2. Builds it (TDD, design tokens, architecture, standards)
3. Validates (runs all validators)
4. Marks it "Complete" (updates all docs atomically)

**Result:**
- ✅ Feature implemented with tests
- ✅ All documentation updated automatically
- ✅ Progress tracked: Module 1/4 (25%), Milestone v0.1.0 1/2 (50%)

---

### **Tips for Working with AI**

#### **✅ DO:**
- Share the feature spec file path explicitly
- Reference standards files (`Standards/Code-Quality.md`, etc.)
- Ask for TDD (tests first, then implementation)
- Request design token usage from `global.css`
- Verify standards checklist before marking complete
- Build incrementally (data → logic → presentation)

#### **❌ DON'T:**
- Skip reading the feature spec
- Allow hardcoded CSS values (validators will block them)
- Skip writing tests (coverage validator will fail)
- Violate 3-tier architecture (validator will block invalid imports)
- Mark features complete without verifying all active-scope checklist items
- Build multiple features simultaneously (complete one, then move to next)

---

### **Where Everything Lives**

Quick reference for finding what you need:

| I need to... | Look here |
|-------------|-----------|
| See overall project progress | `Documentation/project-roadmap.md` (roadmap table) |
| Find which milestone a feature is in | `Documentation/project-roadmap.md` (Feature Index) |
| Check milestone status | `Documentation/project-roadmap.md` (milestone sections) |
| View module progress | `Documentation/features/{program}/{module}/_{module}.md` |
| Read a feature spec | `Documentation/features/{program}/{module}/{feature-name}.md` |
| See feature dependencies | `Documentation/project-roadmap.md` (Feature Dependencies) |
| Verify standards | `Standards/Checklist.md` |
| Reference design tokens | `01-presentation/styles/global.css` |
| See what changed | `Documentation/changelog.md` |
| Understand the system | `Documentation/architecture.md` |
| See current branch | `git branch --show-current` |
| See open feature/fix branches | `git branch --list "feature/*" "fix/*"` |

---

## 🔍 Key Principles

### **1. Living Documentation**
Documentation updates automatically as you build. Status always reflects reality.

### **2. Standards First**
Every feature must pass all active-scope checklist items before completion. No exceptions.

### **3. Design System Enforcement**
All CSS values come from `01-presentation/styles/global.css`. Hardcoded values are automatically blocked.

### **4. 3-Tier Architecture**
- **presentation** → **logic** → **data**
- Valid dependency flow enforced by validators
- Reverse imports are automatically blocked

### **5. Test-Driven Development**
- Red → Green → Refactor is mandatory
- Minimum 80% code coverage enforced
- Every file has a corresponding test file

---

## 📚 Documentation

| Topic | File |
|-------|------|
| **Getting Started** | This README |
| **Project Structure** | [Documentation/Project-Structure.md](./Documentation/Project-Structure.md) |
| **Standards Overview** | [Standards.md](./Standards.md) |
| **Standards Checklist** | [Standards/Checklist.md](./Standards/Checklist.md) |
| **Validator Details** | [.claude/VALIDATOR-SUMMARY.md](./.claude/VALIDATOR-SUMMARY.md) |

### **Commands**

| Command | Purpose | File |
|---------|---------|------|
| `/Start_Project` | Generate project documentation from interview | [.claude/commands/Start_Project.md](./.claude/commands/Start_Project.md) |
| `/Convert` | Convert existing project or upgrade to latest template | [.claude/commands/Convert.md](./.claude/commands/Convert.md) |
| `/Feature` | Build a feature from spec to completion | [.claude/commands/Feature.md](./.claude/commands/Feature.md) |
| `/New_Idea` | Add features or restructure milestones | [.claude/commands/New_Idea.md](./.claude/commands/New_Idea.md) |
| `/Bug` | Report and fix bugs (PATCH versioning) | [.claude/commands/Bug.md](./.claude/commands/Bug.md) |
| `/Release` | Ship a completed milestone | [.claude/commands/Release.md](./.claude/commands/Release.md) |

---

## ✨ What Makes This Template Different

### **Automated Documentation Sync**
Unlike traditional templates where documentation falls out of sync with code, this system keeps everything current automatically.

### **Standards Automated**
5 validators automate key standards. You verify what cannot be automated.

### **GitHub-Ready Structure**
Documentation maps directly to GitHub (Programs = Labels, Modules = Project Boards, Features = Issues)

### **Premium UI by Default**
Design system follows S-Tier SaaS standards (Stripe, Airbnb, Linear) with full dark mode support.

### **Security Built-In**
OWASP Top 10 protections, secret scanning, and security checklist for every feature.

---

## 📄 License

[Add your license here]

---

## 🤝 Contributing

[Add contribution guidelines here]

---

**Built with standards. Maintained with automation. Delivered with quality.**
