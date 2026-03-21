# Clean-Web v1.0.0

A 4-agent pipeline for cleaning web projects.

```
web-restructure → css-improver → html-improver → code-improver
```

## Usage

```
/clean-web:clean              Full pipeline
/clean-web:clean src/         Scoped to a directory
```

The orchestrator detects project shape and skips agents that don't apply.

## Pipeline

| Step | Agent | What It Does | Phases | Skills |
|------|-------|-------------|--------|--------|
| 1 | web-restructure | 3-tier architecture + root hygiene | 8 | architecture, code-quality |
| 2 | css-improver | 5-file CSS architecture + design tokens | 10 | web-css, code-quality |
| 3 | html-improver | Semantic markup + accessibility | 10 | design, web-accessibility, code-quality |
| 4 | code-improver | Naming, magic values, nesting, error handling | 9 | code-quality |

### Why This Order

- **Structure first** — Files need stable locations before other agents touch them
- **CSS second** — Consolidate stylesheets before HTML references class names
- **HTML third** — Fix semantic markup after CSS classes are canonical
- **Code last** — Naming and readability polish on everything

### Skip Detection

| Condition | Agent Skipped |
|-----------|--------------|
| 3-tier directories already exist with files | web-restructure |
| No `.css` files found | css-improver |
| No `.html`/`.jsx`/`.tsx` files found | html-improver |
| No `.js`/`.ts` files found | code-improver |

### Agent Handoff Contract

Each agent passes structured context to the next:

| From | To | What's Passed |
|------|-----|--------------|
| web-restructure | css-improver | Tier paths, CSS file locations |
| css-improver | html-improver | Deleted/renamed selectors (class-name contract) |
| html-improver | code-improver | Tailwind migration status |

## Relationship to Other Teams

- **clean-web** focuses on web-specific structural concerns (file architecture, CSS, HTML semantics, code readability)
- **clean-team** handles general code quality, testing, and review gates (audit, plan, challenge, refactor, verify)
- They can be run sequentially: clean-web first (structure and presentation), then clean-team (deep quality)
