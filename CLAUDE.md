# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**claude-hub** is a Claude Code customizations repository organized by domain. Everything deploys flat to `~/.claude/` — the domain folders are for human navigation only.

### Domain Structure

| Domain | Contents |
|--------|----------|
| `foundations/` | Universal skills, commands, agents, templates |
| `web-development/` | Web skills, agents, clean-web team |
| `world-building/` | Unity + VRChat skills |
| `data/` | Data engineering skills (Python, SQL, pipelines, AWS, IaC) |
| `productivity/` | Thinking and communication tools (explaining, organize skills; improve-prompt, explain, organize commands) |

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
| clean-web | 4 | Web Restructure → CSS Improver → HTML Improver → Code Improver |

### When to Use

| Situation | Command |
|-----------|---------|
| Web project needs full cleanup (structure + CSS + HTML + code) | `/clean-web:clean` |
| CSS file sprawl (>5 files) | `/clean-web:clean` |
| Scoped cleanup (e.g., just src/) | `/clean-web:clean src/` |

## Common Commands

### Sync

`/sync` handles everything: git operations, flat file deployment, marketplace mirror refresh, plugin reinstallation, and stale reference cleanup.

```
/sync           Commit + push to GitHub, then deploy everything
/sync pull      Pull from GitHub, then deploy everything
/sync deploy    Deploy only (no git)
```

Deploy covers: flat files (skills, agents, commands) + `claude plugin marketplace update` + team plugin reinstall + cache cleanup + reference validation. See [sync.md](.claude/commands/sync.md) for full steps.

### Analysis Scripts (clean-web)
```bash
node web-development/teams/clean-web/scripts/check.js                           # Design system compliance (38 rules)
node web-development/teams/clean-web/scripts/check.js --validate-registry       # Verify rule ↔ skill links
python web-development/teams/clean-web/scripts/analyze_complexity.py <path>     # High-complexity functions
python web-development/teams/clean-web/scripts/analyze_dependencies.py <path>   # Circular dependencies
python web-development/teams/clean-web/scripts/detect_dead_code.py <path>       # Unused code
```

### Rule ↔ Skill Sync

check.js rules and skill files are **linked by rule IDs**. When modifying either:
- **Adding a check.js rule:** Add it to `RULE_SKILLS` registry AND the skill's `## Enforced Rules` table
- **Removing a check.js rule:** Remove from both `RULE_SKILLS` and the skill file
- **Changing severity:** Update both check.js and the skill's table
- **Adding a skill guideline that's automatable:** Consider adding a check.js rule for it
- **Verify links:** `node check.js --validate-registry` confirms all 38 rules are registered

## Development

| Change Type | Edit Location | Then |
|-------------|---------------|------|
| Foundation skills | `foundations/skills/<skill>/` | `/sync deploy` |
| Web skills | `web-development/skills/<skill>/` | `/sync deploy` |
| World-building skills | `world-building/skills/<skill>/` | `/sync deploy` |
| Data skills | `data/skills/<skill>/` | `/sync deploy` |
| Teams | `*/teams/<team>/` | Update both `plugin.json` AND `.claude-plugin/marketplace.json` (versions must match), then `/sync push` |
| Agents | `*/agents/` | `/sync deploy` |
| Commands | `*/commands/` | `/sync deploy` |
| Templates | `*/templates/<name>/` | Copy to new project directory |

**New teams require two registrations:**
1. Create the team folder with `.claude-plugin/plugin.json` and agents under `<domain>/teams/<team-name>/`
2. Add an entry to `.claude-plugin/marketplace.json` — without this, `claude plugin install` cannot find the team

## File Conventions

- Commands: lowercase (`commit.md`, `clean.md`)
- Agents: kebab-case (`new-codebase-scout.md`)
- Skills: `<domain>/skills/<name>/SKILL.md` as main file
- Domain folders: lowercase with hyphens (`foundations`, `web-development`, `world-building`, `data`, `productivity`)
