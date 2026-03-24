# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- PROJECT_STATE_START
## Project State

This section is auto-maintained by slash commands. It gives you immediate context without reading multiple files.

**Project:** Not initialized — run `/Start_Project` or `/Adopt`
**Version:** 0.0.0
**Current Milestone:** None
**Milestone Progress:** N/A

### Quick Context
| Key | Value |
|-----|-------|
| Programs | — |
| Modules | — |
| Features | — (— complete, — planned) |
| Tech Stack | Not decided |

### Active Work
No features in progress.

### What to Read Next
- Run `/Start_Project` to initialize, or `/Adopt` to wrap an existing project.

PROJECT_STATE_END -->

## Commands

```bash
# Run all validators (fresh projects pass with guidance)
npm run validate

# Individual validators
npm run validate:tokens      # Design tokens - no hardcoded CSS
npm run validate:arch        # Architecture boundaries - 3-tier
npm run validate:naming      # File naming conventions
npm run validate:secrets     # No hardcoded secrets
npm run validate:sync        # Documentation sync - docs match reality
```

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/Start_Project` | Initialize project — 7-phase interview generates all documentation |
| `/Feature {program}/{module}/{feature}` | Build feature with TDD, update all docs atomically |
| `/New_Idea {description}` | Add feature or restructure milestones (move, reorder, split, merge) |
| `/Bug {description}` | Report bug, track fix with PATCH versioning |
| `/Release {version}` | Ship a completed milestone — bump version, finalize changelog, tag |
| `/Adopt` | Adopt framework for existing project — scan codebase, generate docs |

## Architecture

**3-Tier Structure** (validators enforce dependency flow):
```
01-presentation/  →  02-logic/  →  03-data/
       ↓                ↓             ↓
     config           config        config      (any tier → config)
```

Valid: presentation → logic → data, any tier → config
Invalid: data → logic, logic → presentation (blocked by validator)

**Organization:** Feature-based within each tier. Each tier has its own `shared/` for internal reuse.

**Key Folders:**
- `tests/e2e/` — Layer 3 behavioral tests (Playwright, full user flows)
- `Documentation/features/{program}/{module}/` — Feature specs and module explainers
- `Documentation/project-roadmap.md` — Living roadmap (source of truth for milestones)
- `Standards/` — Quality standards (scope-filtered checklist)
- `01-presentation/styles/global.css` — Design tokens (all CSS values must reference these)
- `.claude/commands/` — Slash command definitions
- `.claude/validators/` — Automated validators
- `.claude/agents/` — 5 adopt-team agents

## Documentation Sync

Every slash command that changes project state also updates the **Project State** section at the top of this file. This keeps CLAUDE.md accurate without manual maintenance.

| Command | What it updates in Project State |
|---------|----------------------------------|
| `/Start_Project` | Initializes all fields — project name, tech stack, programs, modules, features, first milestone |
| `/Feature` | Active Work (in progress / completed), milestone progress, feature counts |
| `/New_Idea` | Feature counts, module counts (if new module created) |
| `/Bug` | Active Work (if bug is in progress) |
| `/Release` | Version, current milestone advances, milestone progress resets |
| `/Adopt` | Same as `/Start_Project` — full initialization from scan results |

**If Project State looks stale**, run `npm run validate:sync` to check, or read `Documentation/project-roadmap.md` directly for ground truth.

## Checklist Scopes

The standards checklist uses **scope tags** so only relevant items apply per feature. Feature specs declare active scopes in a `Scopes:` field.

| Scope | Always? | When |
|-------|---------|------|
| `core` | Yes | Architecture, testing, naming, error handling |
| `docs` | Yes | Documentation updates |
| `ui` | No | Presentation layer — CSS, HTML, accessibility, responsive |
| `api` | No | HTTP endpoints — validation, CORS, rate limiting |
| `auth` | No | Identity and permissions — login, roles, sessions |
| `data` | No | Persistence — repositories, migrations, encryption |

If a feature spec has no `Scopes:` field, infer from which layers it touches.

## Status Conventions

- **Tables** (roadmap, modules, Feature Index): Emoji + structured comment (e.g., `⏳ <!-- STATUS:planned -->`)
- **Frontmatter** (feature files): Text + structured comment (e.g., `Status: Planned <!-- STATUS:planned -->`)
- **Progress fields**: Text + structured comment (e.g., `**Progress:** 2/5 features <!-- PROGRESS:2/5 -->`)

## Build Order

When implementing features:
1. Data layer first (`03-data/` — repositories, API clients)
2. Logic layer (`02-logic/` — services, business rules)
3. Presentation layer (`01-presentation/` — React components)

Always use 4-Layer TDD: Unit → Integration → Behavioral → Human Verification (see `Standards/Code-Quality.md`)

## File Naming

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Services: `PascalCaseService.ts` (e.g., `EmailService.ts`)
- Repositories: `PascalCaseRepository.ts`
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- CSS: `kebab-case.css`
- Tests: Match source + `.test` (e.g., `Button.test.tsx`)

## Path Syntax

Use `{braces}` for template variables in documentation:
- `Documentation/features/{program}/{module}/{feature}.md`
- `Documentation/features/{program}/{module}/_{module}.md` (module explainer)

## Branching Convention

**Strategy:** GitHub Flow (feature branches from `main`, merge commits)

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/{feature-name}` | `feature/create-meal-plan` |
| Bug fix | `fix/{bug-name}` | `fix/login-button-mobile-safari` |
| Release | No branch (tag on `main`) | Tag: `v0.2.0` |

- `/Feature` and `/Bug` auto-manage branches (create, commit, merge, delete)
- Merge uses `--no-ff` to preserve branch history
- `main` is always deployable — never commit directly during feature work
