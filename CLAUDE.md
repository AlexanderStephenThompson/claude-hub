# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**claude-hub** is a Claude Code customizations repository organized by domain. Everything deploys flat to `~/.claude/` — the domain folders are for human navigation only.

### Top-Level Structure

| Folder | Purpose |
|--------|---------|
| `foundations/` | Universal skills (code-quality, architecture, security, documentation, explaining, organize), commands, agents, templates |
| `domains/` | Project-specific skill domains (below) |

### Domains (`domains/`)

| Domain | Contents |
|--------|----------|
| `web-development/` | Web skills, agents, clean-web team |
| `world-building/` | Unity + VRChat skills, organized by platform (unity/, vr-chat/) |
| `data/` | Data skills by discipline: analytics (Python, SQL), engineering (pipelines, AWS, IaC), science (ML, stats — future) |

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

## Builder vs Refactorer Pattern

Skills serve two consumer types through different sections of the same file:

| Consumer | Primary section | When | Goal |
|----------|----------------|------|------|
| **Builder** | `## Builder Checklist` | Before writing code | Conform from the start |
| **Refactorer** | `## Enforced Rules` | After code exists | Find and fix violations |

Both read the same narrative sections for detailed guidance. Both run `check.js` — builders as a post-build gate (expect 0 violations), refactorers as a before/after delta.

Every skill contains: `## The Problem` (why standards exist), `## Consumption` (how each consumer reads the file), `## Builder Checklist`, and `## Enforced Rules`. Agent templates at `foundations/templates/agent/` provide `BUILDER-AGENT.md` and `REFACTORER-AGENT.md` for creating new agents of each type.

## Multi-Agent Teams

| Team | Agents | Workflow |
|------|--------|----------|
| clean-web | 4 | Web Restructure → CSS Improver → HTML Improver → Code Improver |
| clean-data | 4 | Data Restructure → SQL Improver → Python Improver → Pipeline Improver |

### When to Use

| Situation | Command |
|-----------|---------|
| Web project needs full cleanup (structure + CSS + HTML + code) | `/clean-web:clean` |
| CSS file sprawl (>5 files) | `/clean-web:clean` |
| Scoped cleanup (e.g., just src/) | `/clean-web:clean src/` |
| Data project needs cleanup (SQL + Python + pipeline + IaC) | `/clean-data:clean` |
| ETL code has iterrows, bare excepts, hardcoded dates | `/clean-data:clean` |
| SQL queries need optimization (SELECT *, no CTEs) | `/clean-data:clean` |

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
node domains/web-development/teams/clean-web/scripts/check.js                           # Design system compliance (38 rules)
node domains/web-development/teams/clean-web/scripts/check.js --validate-registry       # Verify rule ↔ skill links
python domains/web-development/teams/clean-web/scripts/analyze_complexity.py <path>     # High-complexity functions
python domains/web-development/teams/clean-web/scripts/analyze_dependencies.py <path>   # Circular dependencies
python domains/web-development/teams/clean-web/scripts/detect_dead_code.py <path>       # Unused code
```

### Analysis Scripts (clean-data)
```bash
python domains/data/teams/clean-data/scripts/check_data.py                              # Data project compliance (26 rules)
python domains/data/teams/clean-data/scripts/check_data.py --validate-registry          # Verify rule -> skill links
python domains/data/teams/clean-data/scripts/strip_print.py <path>                      # Remove print() from production code
python domains/data/teams/clean-data/scripts/fix_sql_keywords.py <path>                 # Uppercase SQL keywords
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
| Web skills | `domains/web-development/skills/<skill>/` | `/sync deploy` |
| World-building skills | `domains/world-building/<platform>/skills/<skill>/` | `/sync deploy` |
| Data skills | `domains/data/<sub-category>/skills/<skill>/` | `/sync deploy` |
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
- Skills: `<domain>/skills/<name>/SKILL.md` as main file (some domains nest by sub-category: `<domain>/<sub-category>/skills/<name>/`)
- Domain folders: lowercase with hyphens (`foundations`, `web-development`, `world-building`, `data`, `productivity`)
- References: kebab-case (`master-user-profile.md`)
- Architecture references: centralized in `foundations/skills/architecture/references/` (domain-specific files like `web.md`, `unity.md`, `data-iac.md` live here, not in each domain)
