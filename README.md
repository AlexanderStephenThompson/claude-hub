# Claude Customizations

Personal Claude Code customizations: multi-agent teams, shared skills, standalone commands, and agents. Domain folders are for human navigation — `/sync deploy` flattens everything into `~/.claude/`.

---

## Core

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
| [new-codebase-scout](core/agents/new-codebase-scout.md) | Explore and document unfamiliar codebases, generate CLAUDE.md |

Skills: architecture, code-quality, documentation, security

---

## Productivity

Thinking and communication tools — not tied to any project type.

### Commands

| Command | What It Does |
|---------|--------------|
| `/improve-prompt` | Analyze and refine a rough prompt with annotated improvements |
| `/explain` | Produce a clear explanation using the Subject or Situational framework |

Skills: explaining

---

## Web

Web development tools — CSS, HTML, accessibility, React, and frontend testing.

Skills: design, web-accessibility, web-css, web-performance

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
