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

### Agents

Standalone agents that load their skill files automatically. Invoke directly with `@agent-name`.

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

| Agent | What It Does |
|-------|--------------|
| [new-codebase-scout](foundations/agents/new-codebase-scout.md) | Explore and document unfamiliar codebases, generate CLAUDE.md |
| [code-improver](foundations/agents/code-improver.md) | Fix naming, magic values, comments, nesting, error handling, docstrings |

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
