# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**claude-hub** is a Claude Code customizations repository organized by domain. Everything deploys flat to `~/.claude/` — the domain folders are for human navigation only.

### Domain Structure

| Domain | Contents |
|--------|----------|
| `core/` | Universal skills, 3 teams (clean, implement, diagnose), commands, agents, scripts, templates |
| `web/` | Web skills (7) |
| `world-building/` | Unity + VRChat skills |
| `data/` | Data engineering skills (Python, SQL, pipelines, AWS, IaC) |
| `productivity/` | Thinking and communication tools (explaining skill, improve-prompt, explain commands) |

### Deployment (flat)

| Component | Repo Location | Deploys To |
|-----------|---------------|------------|
| Skills | `*/skills/<name>/` | `~/.claude/skills/<name>/` |
| Commands | `*/commands/<name>.md` | `~/.claude/commands/<name>.md` |
| Agents | `*/agents/<name>.md` | `~/.claude/agents/<name>.md` |
| Teams | `*/teams/<team>/` | Marketplace plugins |
| Templates | `*/templates/<name>/` | Copied manually to start new projects |

**GitHub:** https://github.com/AlexanderStephenThompson/claude-hub

**Key principle:** Skills are the single source of truth. All teams reference shared skills from `~/.claude/skills/`, not embedded copies. The `/sync` command recursively discovers files from all domain folders and flattens on deploy.

## Multi-Agent Teams

| Team | Agents | Workflow |
|------|--------|----------|
| clean-team | 8 | Organizer → Formatter → Auditor → [checkpoint] → Tester → Planner → Challenger → Refactorer → Verifier |
| implement-team | 5 | Planner → Challenger → Implementor → Security → Refactorer |
| diagnose-team | 5 | Clarifier → Investigator → Hypothesizer → Resolver → Validator |

### When to Use Which Team

| Situation | Team | Command |
|-----------|------|---------|
| Quick codebase health check | clean-team | `/clean-team:clean audit` |
| Focused audit (CSS, a11y, perf, structure) | clean-team | `/clean-team:clean audit [focus]` |
| Quick codebase tidying | clean-team | `/clean-team:clean` |
| CSS file sprawl (>5 files) | clean-team | `/clean-team:clean` |
| Existing codebase needs deep refactoring | clean-team | `/clean-team:clean` |
| Legacy code modernization | clean-team | `/clean-team:clean` |
| New feature implementation | implement-team | `/implement-team:implement` |
| Bug fix with design decisions | implement-team | `/implement-team:implement` |
| Security-sensitive features | implement-team | triggers Security agent |
| Stubborn bug that won't stay fixed | diagnose-team | `/diagnose-team:diagnose` |
| "It works but not how I wanted" | diagnose-team | `/diagnose-team:diagnose` |
| Root cause is unclear after multiple attempts | diagnose-team | `/diagnose-team:diagnose` |

### Clean-Team Pipeline

One command with three modes. Auto-detects existing audit reports for resume:

```
/clean-team:clean [scope]        → Full 8-agent pipeline with checkpoint after audit
/clean-team:clean audit [focus]  → Read-only audit (parallel sub-agents, focus modes)
```

## Common Commands

### Sync

`/sync` handles everything: git operations, flat file deployment, marketplace mirror refresh, plugin reinstallation, and stale reference cleanup.

```
/sync           Commit + push to GitHub, then deploy everything
/sync pull      Pull from GitHub, then deploy everything
/sync deploy    Deploy only (no git)
```

Deploy covers: flat files (skills, agents, commands) + `claude plugin marketplace update` + team plugin reinstall + cache cleanup + reference validation. See [sync.md](.claude/commands/sync.md) for full steps.

### Analysis Scripts (clean-team)
```bash
python core/teams/clean-team/scripts/analyze_complexity.py <path>     # High-complexity functions
python core/teams/clean-team/scripts/analyze_dependencies.py <path>   # Circular dependencies
python core/teams/clean-team/scripts/detect_dead_code.py <path>       # Unused code
node core/teams/clean-team/scripts/check.js                           # Design system compliance (36 rules)
```

## Development

| Change Type | Edit Location | Then |
|-------------|---------------|------|
| Core skills | `core/skills/<skill>/` | `/sync deploy` |
| Web skills | `web/skills/<skill>/` | `/sync deploy` |
| World-building skills | `world-building/skills/<skill>/` | `/sync deploy` |
| Data skills | `data/skills/<skill>/` | `/sync deploy` |
| Teams | `*/teams/<team>/` | Update both `plugin.json` AND `.claude-plugin/marketplace.json` (versions must match), then `/sync push` |
| Agents | `core/agents/` | `/sync deploy` |
| Commands | `core/commands/` | `/sync deploy` |
| Templates | `*/templates/<name>/` | Copy to new project directory |

**New teams require two registrations:**
1. Create the team folder with `.claude-plugin/plugin.json` and agents under `<domain>/teams/<team-name>/`
2. Add an entry to `.claude-plugin/marketplace.json` — without this, `claude plugin install` cannot find the team

## File Conventions

- Commands: lowercase (`commit.md`, `clean.md`)
- Agents: kebab-case (`new-codebase-scout.md`)
- Skills: `<domain>/skills/<name>/SKILL.md` as main file
- Audit reports: `AUDIT-REPORT-[YYYY-MM-DD].md`
- Domain folders: lowercase with hyphens (`core`, `web`, `world-building`, `data`)
