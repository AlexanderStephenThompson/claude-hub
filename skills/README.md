# Skills (Single Source of Truth)

Shared skills that all teams and agents can reference. Each skill is a comprehensive module containing standards, references, assets, and scripts.

## Available Skills

### Core Skills (Complete)

| Skill | Purpose |
|-------|---------|
| [architecture/](./architecture/) | Architecture principles, module boundaries, design patterns |
| [code-quality/](./code-quality/) | TDD, naming conventions, docstrings, 3-tier structure |
| [code-standards/](./code-standards/) | Language-specific standards (JavaScript, Python, SQL) |
| [design/](./design/) | Design system, semantic HTML, CSS, accessibility |
| [documentation/](./documentation/) | SemVer, changelog, feature specs, module templates |
| [security/](./security/) | OWASP Top 10, input validation, auth patterns |

### Web-Specific Skills (Stubs)

| Skill | Purpose |
|-------|---------|
| [web-accessibility/](./web-accessibility/) | WCAG compliance, screen readers, keyboard nav |
| [web-css/](./web-css/) | CSS architecture, methodologies |
| [web-graphql/](./web-graphql/) | GraphQL patterns, Apollo |
| [web-performance/](./web-performance/) | Performance optimization |
| [web-react/](./web-react/) | React patterns, hooks, state |
| [web-testing/](./web-testing/) | Frontend testing strategies |

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
