# Claude Customizations

Personal Claude Code customizations: multi-agent teams, shared skills, standalone commands, and agents. Domain folders are for human navigation — `/sync deploy` flattens everything into `~/.claude/`.

---

## Web Development

Web-specific tools: a cleanup team, standalone agents, and skills.

### Team: clean-web

A 4-agent pipeline for cleaning web projects, backed by deterministic scripts for double coverage.

| Command | What It Does |
|---------|-------------|
| `/clean-web:clean` | Full pipeline — restructure → CSS → HTML → code |
| `/clean-web:clean src/` | Scoped to a directory |

**Pipeline:** `web-restructure → css-improver → html-improver → code-improver`

The orchestrator runs deterministic scripts first (check.js, complexity analysis, dependency analysis, dead code detection), then passes findings to each agent. Agents fix the deterministic violations first, then do their own probabilistic scan on top.

**Scripts** (also runnable standalone):
```bash
node web-development/teams/clean-web/scripts/check.js                       # 36 design system rules
python web-development/teams/clean-web/scripts/analyze_complexity.py <path> # High-complexity functions
python web-development/teams/clean-web/scripts/analyze_dependencies.py <path> # Circular dependencies
python web-development/teams/clean-web/scripts/detect_dead_code.py <path>   # Unused exports
```

#### Step 1: web-restructure — 3-Tier Architecture Migration

Organizes files into `01-presentation/` → `02-logic/` → `03-data/` with one-way dependency flow. Skills: `architecture`, `code-quality`

| Phase | What It Does |
|-------|-------------|
| 1. Inventory | Glob all source files, catalog types, detect file naming convention violations |
| 2. Tier Mapping | Assign each file to a tier based on content analysis |
| 3. Dependency Check | Trace imports to find reverse/cross-tier dependencies |
| 4. Create Structure | Build the `source/01-*/02-*/03-*` directory tree |
| 5. Move Files | Relocate files in dependency order (data → logic → presentation) |
| 6. Clean Up | Update imports, fix broken references, standardize file naming conventions |
| 7. Verify | Confirm no broken imports, no circular dependencies |
| 8. Report | Before/after summary with tier distribution and files renamed |

#### Step 2: css-improver — CSS Cleanup & Tokenization

Consolidates CSS to a 5-file architecture (`reset → global → layouts → components → overrides`) with design tokens. Skills: `web-css`, `code-quality`

| Phase | What It Does |
|-------|-------------|
| 1. Baseline | Glob all CSS files, count rules, identify current structure |
| 2. Structure | Consolidate to 5-file architecture, fix import order |
| 3. Dead CSS | Remove unused selectors confirmed by Grep across HTML/JSX |
| 4. Consistency | Fix AI-generated drift — near-duplicate values, format mismatches |
| 5. Tokenize | Extract hardcoded colors, spacing, fonts into CSS custom properties |
| 6. Property Order | Enforce consistent property ordering within rules |
| 7. Component States | Ensure interactive elements have all 5 states (default, hover, active, focus, disabled) |
| 8. Responsive | Convert `max-width` to `min-width` (mobile-first), consolidate breakpoints |
| 9. Validate | Final check — no hardcoded values, no dead CSS, correct structure |
| 10. Report | Before/after metrics: file count, rule count, token count, dead CSS removed |

#### Step 3: html-improver — Semantic HTML & Accessibility

Replaces div-soup with correct semantic elements and ensures WCAG compliance. Skills: `design`, `web-accessibility`, `code-quality`

| Phase | What It Does |
|-------|-------------|
| 1. Scan | Glob all HTML/JSX, flag div-soup, missing landmarks, accessibility gaps, missing lazy loading, redundant attributes |
| 2. Landmarks & Structure | Add `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, `<section>`, `<article>` |
| 3. Heading Hierarchy | Fix skipped levels, ensure single `<h1>`, logical nesting |
| 4. Interactive Elements | Replace clickable `<div>`/`<span>` with `<button>` or `<a>`, add keyboard handlers |
| 5. Forms | Add `<label>` associations, `<fieldset>`/`<legend>` grouping, input types |
| 6. Images & Media | Add meaningful `alt` text, `loading="lazy"` for below-fold images, `<figure>`/`<figcaption>` |
| 7. Lists & Data | Replace manual bullet patterns with `<ul>`/`<ol>`, key-value pairs with `<dl>` |
| 8. Content Elements | Use `<time>`, `<address>`, `<blockquote>`, `<code>`, `<abbr>` where appropriate |
| 9. Class Discipline | Remove bloated class lists (>4 classes), clean up redundant boolean attributes and empty attributes |
| 10. Report | Before/after metrics: div count, semantic elements, accessibility gaps, lazy loading added, attributes cleaned |

#### Step 4: code-improver — Naming, Structure & Readability

Final polish — makes code that works into code that communicates. Skills: `code-quality`

| Phase | What It Does |
|-------|-------------|
| 1. Scan | Glob all source files, identify naming issues, magic values, debug statements, complexity hotspots |
| 2. Naming | Rename unclear variables, functions, classes to reveal intent |
| 3. Magic Values | Extract hardcoded numbers and strings into named constants |
| 4. Dead Code | Remove unused imports, unreachable branches, commented-out blocks, debug statements |
| 5. Comments | Remove noise comments, keep only "why" comments, fix stale comments |
| 6. Function Clarity | Extract long functions, reduce nesting with early returns, separate concerns |
| 7. Error Handling | Replace silent catches, add specific error types, fail fast at boundaries |
| 8. Docstrings | Add purpose, params, returns, errors, examples to public APIs |
| 9. Report | Before/after metrics: naming fixes, constants extracted, dead code removed, functions simplified |

### Standalone Agents

These agents also run independently outside the pipeline. Invoke directly with `@agent-name`.

| Agent | Domain | Phases | Skills Loaded |
|-------|--------|--------|---------------|
| [css-improver](web-development/agents/css-improver.md) | CSS cleanup & tokenization | 10 | `web-css`, `code-quality` |
| [html-improver](web-development/agents/html-improver.md) | Semantic HTML & accessibility | 10 | `design`, `web-accessibility`, `code-quality` |
| [web-restructure](web-development/agents/web-restructure.md) | 3-tier architecture migration | 8 | `architecture`, `code-quality` |

Skills: architecture, design, web-css, web-accessibility, web-performance

---

## Foundations

Universal tools that apply to any project.

### Commands

| Command | What It Does |
|---------|--------------|
| `/commit` | Stage changes, craft a conventional commit message |
| `/orient` | Orient yourself to a new project |
| `/sync` | Deploy all customizations to `~/.claude/` |

### Agents

| Agent | What It Does | Skills Loaded |
|-------|-------------|---------------|
| [new-codebase-scout](foundations/agents/new-codebase-scout.md) | Explore and document unfamiliar codebases, generate CLAUDE.md | — |
| [code-improver](foundations/agents/code-improver.md) | Fix naming, magic values, comments, nesting, error handling, docstrings | `code-quality` |

<details>
<summary>new-codebase-scout phases</summary>

| Phase | What It Does |
|-------|-------------|
| 1. Initial Survey | Read README, package files, entry points to understand purpose |
| 2. Build & Run | Identify build system, run commands, verify working state |
| 3. Tech Stack | Catalog languages, frameworks, dependencies |
| 4. Architecture | Map directory structure, module boundaries, data flow |
| 5. Tests | Find test framework, run tests, note coverage |
| 6. Patterns | Identify conventions, naming standards, design patterns |
| 7. Tribal Knowledge | Capture gotchas, workarounds, implicit conventions into CLAUDE.md |

</details>

<details>
<summary>code-improver phases</summary>

| Phase | What It Does |
|-------|-------------|
| 1. Scan | Glob all source files, identify naming issues, magic values, debug statements, complexity hotspots |
| 2. Naming | Rename unclear variables, functions, classes to reveal intent |
| 3. Magic Values | Extract hardcoded numbers and strings into named constants |
| 4. Dead Code | Remove unused imports, unreachable branches, commented-out blocks, debug statements |
| 5. Comments | Remove noise comments, keep only "why" comments, fix stale comments |
| 6. Function Clarity | Extract long functions, reduce nesting with early returns, separate concerns |
| 7. Error Handling | Replace silent catches, add specific error types, fail fast at boundaries |
| 8. Docstrings | Add purpose, params, returns, errors, examples to public APIs |
| 9. Report | Before/after metrics: naming fixes, constants extracted, dead code removed, functions simplified |

</details>

Skills: code-quality, documentation, security

---

## Productivity

Thinking and communication tools — not tied to any project type.

### Commands

| Command | What It Does |
|---------|--------------|
| `/improve-prompt` | Analyze and refine a rough prompt with annotated improvements |
| `/explain` | Produce a clear explanation using the Subject or Situational framework |
| `/organize` | Analyze folder structures using L1/L2/L3 framework |

Skills: explaining, organize

---

## World Building

Unity game development and VRChat content creation.

Skills: unity-csharp, vrc-udon, vrc-worlds, vrc-avatars

---

## Data

Data engineering and cloud infrastructure.

Skills: data-python, data-sql, data-pipelines, data-aws, data-iac

---

## Setup

```bash
# Deploy skills, commands, and agents
/sync deploy

# Install team plugin (one-time)
claude plugin marketplace add https://github.com/AlexanderStephenThompson/claude-hub
claude plugin install clean-web
```

Skills are the single source of truth. Teams reference `~/.claude/skills/`, not embedded copies. Updating a skill and running `/sync deploy` propagates the change everywhere.
