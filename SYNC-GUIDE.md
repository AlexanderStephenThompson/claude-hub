# Sync Guide for AI Assistants

Instructions for syncing this repository with the local Claude Code installation.

---

## Repository Info

- **Repository**: `AlexanderStephenThompson/claude-hub`
- **URL**: https://github.com/AlexanderStephenThompson/claude-hub

---

## Deployment Targets

| Source | Target | Method |
|--------|--------|--------|
| `skills/` | `~/.claude/skills/` | Copy |
| `agents/` | `~/.claude/agents/` | Copy |
| `commands/` | `~/.claude/commands/` | Copy |
| `teams/` | Claude plugins | Marketplace install |

---

## Common Tasks

### Deploy to Local Claude

```bash
# Deploy skills, agents, and commands
cp -r skills/* ~/.claude/skills/
cp agents/*.md ~/.claude/agents/
cp commands/*.md ~/.claude/commands/
```

### Install Teams via Marketplace

```bash
# Add marketplace (one-time)
claude plugin marketplace add https://github.com/AlexanderStephenThompson/claude-hub

# Install teams
claude plugin install refactor-team
claude plugin install implement-team
claude plugin install diagnose-team
```

### Update Teams

```bash
claude plugin update refactor-team
claude plugin update implement-team
claude plugin update diagnose-team
```

### Push Changes to GitHub

```bash
git add -A
git commit -m "description of changes"
git push
```

---

## Repository Structure

```
claude-hub/
├── .claude-plugin/
│   └── marketplace.json    # Plugin marketplace config
├── agents/                 # Standalone agents
├── commands/               # Slash commands
├── skills/                 # Shared skills (single source of truth)
│   ├── architecture/
│   ├── code-quality/
│   ├── code-standards/
│   ├── design/
│   ├── documentation/
│   ├── security/
│   └── web-*/              # Web-specific skills
├── teams/                  # Plugin teams
│   ├── refactor-team/
│   ├── implement-team/
│   └── diagnose-team/
├── templates/              # Boilerplate for new skills
├── DEPLOYMENT.md
├── README.md
└── SYNC-GUIDE.md
```

---

## Version Tracking

| Component | Location | Version |
|-----------|----------|---------|
| Marketplace | `.claude-plugin/marketplace.json` | 1.0.0 |
| refactor-team | `teams/refactor-team/.claude-plugin/plugin.json` | 2.0.0 |
| implement-team | `teams/implement-team/.claude-plugin/plugin.json` | 1.0.0 |
| diagnose-team | `teams/diagnose-team/.claude-plugin/plugin.json` | 1.0.0 |

---

## Troubleshooting

### Authentication Issues

```bash
gh auth status
gh auth login
```

### Check GitHub Connection

```bash
git remote -v
git fetch
git status
```
