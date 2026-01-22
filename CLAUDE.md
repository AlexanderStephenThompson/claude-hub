# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**claude-hub** is a Claude Code customizations repository containing multi-agent plugin teams, shared skills, standalone agents, and commands.

| Component | Location | Deployment |
|-----------|----------|------------|
| Teams | `teams/` | Marketplace plugins |
| Skills | `skills/` | `~/.claude/skills/` |
| Agents | `agents/` | `~/.claude/agents/` |
| Commands | `commands/` | `~/.claude/commands/` |

**GitHub:** https://github.com/AlexanderStephenThompson/claude-hub

## Architecture

```
Source Repository                    Deployed Location
──────────────────                   ─────────────────
skills/           ─────────────────► ~/.claude/skills/
agents/           ─────────────────► ~/.claude/agents/
commands/         ─────────────────► ~/.claude/commands/
teams/            ─────────────────► plugins/ (via marketplace)
```

**Key principle:** Skills are the single source of truth. All teams reference shared skills from `~/.claude/skills/`, not embedded copies.

### Multi-Agent Teams

| Team | Agents | Workflow |
|------|--------|----------|
| refactor-team | 7 | Explorer → Researcher → Tester → Planner → Challenger → Refactorer → Verifier |
| implement-team | 5 | Planner → Challenger → Implementor → Security → Refactorer |
| diagnose-team | 5 | Clarifier → Investigator → Hypothesizer → Resolver → Validator |

### Audit → Refactor Pipeline

```
/audit                    → Produces AUDIT-REPORT-[YYYY-MM-DD].md
/refactor-team:refactor   → Finds and uses the audit report automatically
```

## Common Commands

### Sync from GitHub
```bash
git pull
cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

### Deploy (no pull)
```bash
cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

### Update Plugins
After modifying team files, reinstall plugins:
```bash
claude plugin uninstall refactor-team && claude plugin install refactor-team
claude plugin uninstall implement-team && claude plugin install implement-team
claude plugin uninstall diagnose-team && claude plugin install diagnose-team
```

Note: `claude plugin marketplace update` updates the cache, not installed plugins.

## Development

| Change Type | Edit Location | Then |
|-------------|---------------|------|
| Teams | `teams/<team>/` | Push + reinstall plugin |
| Skills | `skills/<skill>/` | Deploy to `~/.claude/skills/` |
| Agents | `agents/` | Deploy to `~/.claude/agents/` |
| Commands | `commands/` | Deploy to `~/.claude/commands/` |

## File Conventions

- Commands: lowercase (`commit.md`, `audit.md`)
- Agents: kebab-case (`improvement-auditor.md`)
- Skills: `skills/<name>/SKILL.md` as main file
- Audit reports: `AUDIT-REPORT-[YYYY-MM-DD].md`
