# Claude Customizations

Personal Claude Code customizations: multi-agent teams, shared skills, standalone commands, and agents. Domain folders are for human navigation — `/sync deploy` flattens everything into `~/.claude/`.

---

## Foundations

Universal tools that apply to any project.

### Teams

| Command | Agents | Workflow |
|---------|--------|----------|
| `/clean-team:clean [scope\|audit [focus]]` | 8 | Full pipeline, audit-only, or resume — one command, three modes |
| `/implement-team:implement <feature>` | 5 | Plan → Challenge → Implement (TDD) → Security → Refactor |
| `/diagnose-team:diagnose <problem>` | 5 | Clarify → Investigate → Hypothesize → Resolve → Validate |

### Commands

| Command | What It Does |
|---------|--------------|
| `/commit` | Stage changes, craft a conventional commit message |
| `/orient` | Orient yourself to a new project |

### Agents

| Agent | What It Does |
|-------|--------------|
| [new-codebase-scout](foundations/agents/new-codebase-scout.md) | Explore and document unfamiliar codebases, generate CLAUDE.md |
| [code-improver](foundations/agents/code-improver.md) | Fix naming, magic values, comments, nesting, error handling, docstrings |

Skills: architecture, code-quality, documentation, security

---

## Web

Web development tools — CSS, HTML, accessibility, and frontend performance.

### Agents

| Agent | What It Does |
|-------|--------------|
| [css-improver](web-development/agents/css-improver.md) | Consolidate CSS to 5-file architecture with design tokens |
| [html-improver](web-development/agents/html-improver.md) | Replace div-soup with semantic, accessible HTML |
| [web-restructure](web-development/agents/web-restructure.md) | Reorganize a web project into 3-tier architecture |

Skills: architecture, design, web-accessibility, web-css, web-performance

---

## Standalone Agents (WIP — Clean Team)

These four agents are standalone, testable pieces of what will become the clean-team pipeline. Each owns a specific domain, loads its skill files automatically, and can be invoked directly on any project with `@agent-name`. The goal: confirm each piece works independently before composing them into a cohesive team.

### Overview

| Agent | Domain | Phases | Skills Loaded | Invocation |
|-------|--------|--------|---------------|------------|
| [css-improver](web-development/agents/css-improver.md) | CSS cleanup & tokenization | 10 | `web-css`, `code-quality` | `@css-improver` |
| [html-improver](web-development/agents/html-improver.md) | Semantic HTML & accessibility | 10 | `design`, `web-accessibility`, `code-quality` | `@html-improver` |
| [code-improver](foundations/agents/code-improver.md) | Code readability & clarity | 9 | `code-quality` | `@code-improver` |
| [web-restructure](web-development/agents/web-restructure.md) | 3-tier architecture migration | 8 | `architecture`, `code-quality` | `@web-restructure` |

---

### CSS Improver

Takes CSS from any state to a clean, tokenized architecture. The core problem it solves: AI-generated CSS drifts across sessions — similar components end up with slightly different padding, colors, and spacing. One edit becomes a partial fix because `#fff`, `white`, and `rgb(255,255,255)` are the same color in different formats. This agent unifies everything into shared token-based rules so one edit propagates everywhere.

No Tailwind, no PostCSS. Vanilla CSS with design tokens.

| Phase | What It Does |
|-------|-------------|
| 1. Baseline | Inventory CSS files, count hardcoded values, detect existing tokens |
| 2. Structure | Migrate to 5-file architecture (`reset → global → layouts → components → overrides`) |
| 3. Dead CSS | Remove unused selectors, duplicates, empty rules, commented-out blocks |
| 4. Consistency | Hunt near-duplicates — group by visual role, normalize values, merge 80%+ identical rules |
| 5. Tokenize | Replace repeated hardcoded values with CSS variables in `:root` |
| 6. Property Order | Normalize to 5-group convention (positioning → box model → typography → visual → animation) |
| 7. Component States | Ensure all interactive elements have default, hover, active, focus, disabled |
| 8. Responsive | Convert `max-width` queries to mobile-first `min-width`, standardize breakpoints |
| 9. Validate | Re-run baseline scans, compare before vs after — every metric should improve |
| 10. Report | Before/after summary with per-merge detail for near-duplicate consolidation |

**Reads:** `web-css/references/file-architecture.md`, `web-css/assets/token-reference.md`, `web-css/assets/css-patterns.md`

---

### HTML Improver

Makes HTML semantic and accessible. Replaces div-soup with correct elements, fixes heading hierarchy, ensures interactive elements are proper buttons/links, adds form labels, and cleans up class bloat. If Tailwind utility chains are present, extracts them into semantic CSS classes rather than extending them.

| Phase | What It Does |
|-------|-------------|
| 1. Scan | Find all HTML/JSX/TSX files, count violations by category |
| 2. Landmarks | Replace `<div>` wrappers with `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>` |
| 3. Headings | Fix heading hierarchy — one `<h1>` per page, no skipped levels |
| 4. Interactive | Convert clickable divs/spans to `<button>`, navigation divs to `<a>`, add keyboard support |
| 5. Forms | Add `<label>` to every input, group with `<fieldset>`, use correct input types |
| 6. Images | Add meaningful `alt` text, mark decorative images with `alt=""`, use `<figure>` where appropriate |
| 7. Lists & Data | Replace div-lists with `<ul>`/`<ol>`, div-tables with `<table>`, use `<dl>` for key-value pairs |
| 8. Content | Fix `<b>` → `<strong>`, `<i>` → `<em>`, add `<time>`, `<address>`, `<abbr>` where applicable |
| 9. Class Discipline | Reduce to 1-3 classes per element, extract Tailwind chains into semantic CSS classes |
| 10. Report | Before/after counts per violation category |

**Reads:** `design/references/semantic-html.md`, `design/references/accessibility-guide.md`, `design/assets/component-states-checklist.md`, `design/assets/anti-patterns.md`

---

### Code Improver

Language-agnostic code readability cleanup. Makes code that works into code that communicates. Detects the project's language(s) and adapts naming conventions (Python `snake_case` vs JS `camelCase` vs C# `PascalCase`). Doesn't change behavior — tests must still pass after every phase.

| Phase | What It Does |
|-------|-------------|
| 1. Scan | Detect language(s), count magic values, abbreviations, generic names, dead code, deep nesting |
| 2. Naming | Fix abbreviations (`usr` → `user`), generic names, booleans without prefix, directional clarity |
| 3. Magic Values | Extract hardcoded numbers and strings into named constants |
| 4. Dead Code | Remove commented-out code, unused imports/variables, contextless TODOs |
| 5. Comments | Remove "what" comments, fix stale comments, add "why" comments where needed |
| 6. Function Clarity | Early returns over nesting, extract large functions, simplify complex expressions |
| 7. Error Handling | Fix empty catches, generic exceptions, add boundary validation |
| 8. Docstrings | Add documentation to public APIs (purpose, params, returns, errors, examples) |
| 9. Report | Before/after metrics with change counts per category |

**Reads:** `code-quality/references/naming-reference.md`, `code-quality/references/error-handling-reference.md`, `code-quality/assets/docstring-templates.md`

---

### Web Restructure

Reorganizes a web project into the 3-tier architecture (`01-presentation/` → `02-logic/` → `03-data/`). No auto-detection guesswork — you invoke it knowing it's a web project. Moves files bottom-up (data tier first, then logic, then presentation) so dependencies always point downward. Uses `git mv` for every move to preserve history.

| Phase | What It Does |
|-------|-------------|
| 1. Inventory | Find every source file, record current location and what it does |
| 2. Tier Mapping | Classify each file into presentation, logic, or data using placement guide |
| 3. Dependency Check | Map imports, flag circular dependencies that will break during moves |
| 4. Create Structure | Create `01-presentation/`, `02-logic/`, `03-data/` directories |
| 5. Move Files | `git mv` files bottom-up — data tier first, logic second, presentation last |
| 6. Clean Up | Remove empty directories, update entry points and configs |
| 7. Verify | Confirm project builds/runs, all imports resolve, no circular dependencies |
| 8. Report | File movement summary, tier distribution, any unresolved issues |

**Reads:** `architecture/references/web.md`

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

# Install team plugins (one-time)
claude plugin marketplace add https://github.com/AlexanderStephenThompson/claude-hub
claude plugin install clean-team implement-team diagnose-team
```

Skills are the single source of truth. Teams reference `~/.claude/skills/`, not embedded copies. Updating a skill and running `/sync deploy` propagates the change everywhere.
