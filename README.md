# Claude Customizations

Personal Claude Code customizations: multi-agent teams, shared skills, standalone commands, and agents. Domain folders are for human navigation — `/sync deploy` flattens everything into `~/.claude/`.

---

## Core

Universal tools that apply to any project.

### Teams

| Command | Agents | Workflow |
|---------|--------|----------|
| `/clean-team:audit [focus]` | parallel | Standalone audit with parallel sub-agents → AUDIT-REPORT.md |
| `/clean-team:clean [scope]` | 3 | Organizer → Formatter → Auditor → AUDIT-REPORT.md |
| `/clean-team:refactor [path]` | 5 | Tester → Planner → Challenger → Refactorer → Verifier |
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

## Web

Web development tools — CSS, HTML, accessibility, React, and frontend testing.

Skills: design, web-accessibility, web-css, web-react, web-graphql, web-performance, web-testing

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
