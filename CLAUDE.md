# CLAUDE.md

## What This Repository Is

This is **claude-hub**, a personal collection of Claude Code customizations including:
- **Teams**: Multi-agent plugin workflows (refactor-team, implement-team, diagnose-team)
- **Skills**: Shared standards and references used by all teams
- **Agents**: Standalone agents (improvement-auditor, codebase-scout)
- **Commands**: Standalone slash commands (/commit, /audit)

## Key Paths

| Name | Path |
|------|------|
| This Repository | `c:\Users\Alexa\Downloads\clawd\claude-customizations` |
| Claude Home | `C:\Users\Alexa\.claude` |
| GitHub | https://github.com/AlexanderStephenThompson/claude-hub |

## Structure

```
claude-customizations/
├── teams/           # Multi-agent plugins (installed via marketplace)
│   ├── refactor-team/   # 7-agent refactoring workflow
│   ├── implement-team/  # 5-agent TDD implementation
│   └── diagnose-team/   # 5-agent diagnostic workflow
├── skills/          # Shared standards (single source of truth)
├── agents/          # Standalone agents
├── commands/        # Standalone slash commands
└── templates/       # Boilerplate for new skills
```

## Common Tasks

### Sync from GitHub
When user says "sync":
```bash
cd "c:\Users\Alexa\Downloads\clawd\claude-customizations"
git pull
cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

### Deploy Only (no git pull)
When user says "deploy":
```bash
cd "c:\Users\Alexa\Downloads\clawd\claude-customizations"
cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

### Push to GitHub
When user says "push":
```bash
cd "c:\Users\Alexa\Downloads\clawd\claude-customizations"
git add -A
git commit -m "description of changes"
git push
```

### Update Plugins After Changes
After modifying team files, plugins must be reinstalled:
```bash
claude plugin uninstall refactor-team && claude plugin install refactor-team
claude plugin uninstall implement-team && claude plugin install implement-team
claude plugin uninstall diagnose-team && claude plugin install diagnose-team
```

Note: `claude plugin marketplace update` only updates the marketplace cache, not installed plugins.

## Key Workflows

### Audit → Refactor Pipeline
1. Run `/audit` to produce `AUDIT-REPORT-[YYYY-MM-DD].md`
2. Run `/refactor-team:refactor` which finds and uses the audit report
3. The refactor workflow has 8 steps with gated decisions at steps 5.1 and 7

### Team Agents
- **refactor-team**: Explorer → Researcher → Tester → Planner → Challenger → Refactorer → Verifier
- **implement-team**: Planner → Challenger → Implementor → Security → Refactorer
- **diagnose-team**: Clarifier → Investigator → Hypothesizer → Resolver → Validator

## Development Guidelines

### Making Changes to Teams
1. Edit files in `teams/<team-name>/`
2. Push to GitHub
3. Reinstall the plugin (uninstall + install)

### Making Changes to Skills
1. Edit files in `skills/<skill-name>/`
2. Deploy: `cp -r skills/* "C:\Users\Alexa\.claude\skills/"`
3. Changes apply immediately (no plugin reinstall needed)

### Making Changes to Agents/Commands
1. Edit files in `agents/` or `commands/`
2. Deploy to `~/.claude/agents/` or `~/.claude/commands/`

## File Naming Conventions

- Audit reports: `AUDIT-REPORT-[YYYY-MM-DD].md`
- Skills: `skills/<name>/SKILL.md` (main file)
- Agents: `agents/<name>.md`
- Commands: `commands/<name>.md`
- Team commands: `teams/<team>/commands/<command>.md`
- Team agents: `teams/<team>/agents/<agent>.md`
