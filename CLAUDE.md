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

**Key principle:** Skills are the single source of truth. All teams reference shared skills from `~/.claude/skills/`, not embedded copies.

## Multi-Agent Teams

| Team | Agents | Workflow |
|------|--------|----------|
| clean-team | 4 | Organizer → Stylist → Polisher → Verifier |
| refactor-team | 7 | Explorer → Researcher → Tester → Planner → Challenger → Refactorer → Verifier |
| implement-team | 5 | Planner → Challenger → Implementor → Security → Refactorer |
| diagnose-team | 5 | Clarifier → Investigator → Hypothesizer → Resolver → Validator |

### When to Use Which Team

| Situation | Team |
|-----------|------|
| Quick codebase tidying | clean-team |
| CSS file sprawl (>5 files) | clean-team |
| Existing codebase needs cleanup | refactor-team |
| Legacy code modernization | refactor-team |
| New feature implementation | implement-team |
| Bug fix with design decisions | implement-team |
| Security-sensitive features | implement-team (triggers Security agent) |
| Stubborn bug that won't stay fixed | diagnose-team |
| "It works but not how I wanted" | diagnose-team |
| Root cause is unclear after multiple attempts | diagnose-team |

### Deep Scan → Refactor Pipeline

```
/deep-scan [focus]        → Produces AUDIT-REPORT-[YYYY-MM-DD].md
/refactor-team:refactor   → Finds and uses the audit report automatically
```

Focus options: `css`, `a11y`, `perf`, `structure` (or omit for full scan).

## Common Commands

### Full Sync (pull + deploy + reinstall)

Use `/sync pull` or run manually:

```bash
git pull
```

```powershell
# Clean stale files
Remove-Item 'C:\Users\Alexa\.claude\skills\*' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item 'C:\Users\Alexa\.claude\agents\*.md' -Force -ErrorAction SilentlyContinue
Remove-Item 'C:\Users\Alexa\.claude\commands\*.md' -Force -ErrorAction SilentlyContinue

# Copy fresh files
Copy-Item -Path 'skills\*' -Destination 'C:\Users\Alexa\.claude\skills\' -Recurse -Force
Copy-Item -Path 'agents\*.md' -Destination 'C:\Users\Alexa\.claude\agents\' -Force
Copy-Item -Path 'commands\*.md' -Destination 'C:\Users\Alexa\.claude\commands\' -Force
```

```bash
# Reinstall team plugins
claude plugin uninstall clean-team && claude plugin install clean-team
claude plugin uninstall refactor-team && claude plugin install refactor-team
claude plugin uninstall implement-team && claude plugin install implement-team
claude plugin uninstall diagnose-team && claude plugin install diagnose-team
```

Note: `claude plugin marketplace update` updates the cache, not installed plugins.

### Analysis Scripts (refactor-team)
```bash
python teams/refactor-team/scripts/analyze_complexity.py <path>     # High-complexity functions
python teams/refactor-team/scripts/analyze_dependencies.py <path>   # Circular dependencies
python teams/refactor-team/scripts/detect_dead_code.py <path>       # Unused code
```

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
