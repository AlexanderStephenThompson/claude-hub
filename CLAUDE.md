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
| Quick codebase health check | clean-team | `/clean-team:audit` |
| Focused audit (CSS, a11y, perf, structure) | clean-team | `/clean-team:audit [focus]` |
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

The clean-team has three entry points. All produce or consume AUDIT-REPORT.md:

```
/clean-team:clean [scope]    → Full 8-agent pipeline with checkpoint after audit
/clean-team:refactor [path]  → Resume refactoring from existing AUDIT-REPORT.md
/clean-team:audit [focus]    → Standalone audit (parallel sub-agents, focus modes)
```

## Common Commands

### Full Sync (pull + deploy + reinstall)

Use `/sync pull` or run manually:

```bash
git pull
```

```powershell
$repo = 'c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub'
$domains = @('core', 'web', 'world-building', 'data')

# Clean stale files
Remove-Item 'C:\Users\Alexa\.claude\skills\*' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item 'C:\Users\Alexa\.claude\agents\*.md' -Force -ErrorAction SilentlyContinue
Remove-Item 'C:\Users\Alexa\.claude\commands\*.md' -Force -ErrorAction SilentlyContinue

# Copy fresh files from all domains (skills discovered recursively for nested sub-categories)
foreach ($domain in $domains) {
    Get-ChildItem -Path (Join-Path $repo $domain) -Directory -Recurse |
        Where-Object { $_.Name -eq 'skills' } |
        ForEach-Object { Copy-Item "$($_.FullName)\*" 'C:\Users\Alexa\.claude\skills\' -Recurse -Force }
    $ap = Join-Path $repo "$domain\agents"
    if (Test-Path $ap) { Get-ChildItem "$ap\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination 'C:\Users\Alexa\.claude\agents\' -Force }
    $cp = Join-Path $repo "$domain\commands"
    if (Test-Path $cp) { Get-ChildItem "$cp\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination 'C:\Users\Alexa\.claude\commands\' -Force }
}
```

```bash
# Reinstall team plugins (discovers teams dynamically from any domain folder)
# For each team found, run:
claude plugin uninstall <team-name> && claude plugin install <team-name>
```

Note: `claude plugin marketplace update` updates the cache, not installed plugins. New teams are picked up automatically via `.claude-plugin/marketplace.json`.

**Post-deploy checks** (the `/sync` command handles these automatically):
- Verify `~/.claude/CLAUDE.md` only references skills that were deployed (remove stale refs)
- Verify `~/.claude/settings.json` `enabledPlugins` only lists installed teams (remove stale refs)

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
| Teams | `*/teams/<team>/` | Update `.claude-plugin/marketplace.json`, `/sync push` |
| Agents | `core/agents/` | `/sync deploy` |
| Commands | `core/commands/` | `/sync deploy` |
| Templates | `*/templates/<name>/` | Copy to new project directory |

**New teams require two registrations:**
1. Create the team folder with `.claude-plugin/plugin.json` and agents under `<domain>/teams/<team-name>/`
2. Add an entry to `.claude-plugin/marketplace.json` — without this, `claude plugin install` cannot find the team

## File Conventions

- Commands: lowercase (`commit.md`, `audit.md`)
- Agents: kebab-case (`new-codebase-scout.md`)
- Skills: `<domain>/skills/<name>/SKILL.md` as main file
- Audit reports: `AUDIT-REPORT-[YYYY-MM-DD].md`
- Domain folders: lowercase with hyphens (`core`, `web`, `world-building`, `data`)
