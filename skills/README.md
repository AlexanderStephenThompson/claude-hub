# Skills (Single Source of Truth)

Shared skills that all teams and agents can reference. Each skill is a comprehensive module containing standards, references, assets, and scripts.

## Available Skills

### Core Skills (Complete)

Fully developed skills with comprehensive standards, examples, and checklists.

| Skill | Purpose | Status |
|-------|---------|--------|
| [architecture/](./architecture/) | Architecture principles, module boundaries, design patterns | Complete |
| [code-quality/](./code-quality/) | TDD, naming conventions, docstrings, 3-tier structure | Complete |
| [code-standards/](./code-standards/) | Language-specific standards (JavaScript, Python, SQL) | Complete |
| [design/](./design/) | Design system, semantic HTML, CSS formatting, component states | Complete |
| [documentation/](./documentation/) | SemVer, changelog, feature specs, module templates | Complete |
| [security/](./security/) | OWASP Top 10, input validation, auth patterns | Complete |

### Web Skills

Web-specific skills with comprehensive SKILL.md content. These do not yet have `assets/`, `references/`, or `scripts/` subdirectories like core skills.

| Skill | Purpose |
|-------|---------|
| [web-accessibility/](./web-accessibility/) | WCAG 2.1 AA compliance, ARIA, keyboard nav, focus management |
| [web-css/](./web-css/) | CSS architecture, design tokens, BEM naming, responsive patterns |
| [web-graphql/](./web-graphql/) | GraphQL patterns, Apollo |
| [web-performance/](./web-performance/) | Performance optimization |
| [web-react/](./web-react/) | React patterns, hooks, state |
| [web-testing/](./web-testing/) | Frontend testing strategies |

## Skill Relationships

Skills have defined boundaries to avoid duplication. See each skill's "Scope and Boundaries" section.

```
                    ┌─────────────┐
                    │ code-quality│ (TDD, naming, docstrings)
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │architecture│   │code-standards│   │documentation│
    │(layering, │    │(JS, Python, │    │(versioning, │
    │ modules)  │    │   SQL)      │    │  changelog) │
    └───────────┘    └─────────────┘    └─────────────┘

         ┌─────────────────┬─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ design  │      │web-access-│     │  web-css  │
    │(tokens, │ ───► │  ibility  │ ◄── │(variables,│
    │semantic │      │(WCAG,ARIA)│     │   BEM)    │
    │  HTML)  │      └───────────┘     └───────────┘
    └─────────┘
         │
    ┌────▼────┐
    │security │ (OWASP, validation, auth)
    └─────────┘
```

**Key relationships:**
- `design` defines principles; `web-css` implements them
- `web-accessibility` extends `design` with WCAG compliance
- `code-quality` is foundational; most skills build on it
- `security` is independent but referenced by high-stakes workflows

## Skill Structure

Each skill contains:

```
skill-name/
├── SKILL.md           # Main standards document (the source of truth)
├── assets/            # Templates, checklists, configs
├── references/        # Detailed reference guides
└── scripts/           # Validation and analysis tools
```

## Usage

**For Teams:** Reference skills in agent definitions to inherit standards.

**For Agents:** Load relevant SKILL.md and references based on task context.

**For Developers:** Use as authoritative guidelines for all work.

## Key Principle

> **These skills are the single source of truth.** All teams, agents, and workflows reference these shared skills. Edits here propagate everywhere.
