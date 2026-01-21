# Deployment Guide

How to deploy customizations to your local Claude Code installation.

## Target Locations

```
~/.claude/
├── agents/          # Standalone agents
├── commands/        # Slash commands
├── skills/          # Shared skills (single source of truth)
└── plugins/         # Installed teams (via marketplace)
```

## Deployment Commands

### Deploy Skills (Single Source of Truth)

```bash
# Create skills directory if it doesn't exist
mkdir -p ~/.claude/skills

# Copy all skills
cp -r skills/* ~/.claude/skills/
```

### Deploy Agents

```bash
# Copy standalone agents
cp agents/*.md ~/.claude/agents/
```

### Deploy Commands

```bash
# Copy slash commands
cp commands/*.md ~/.claude/commands/
```

### Install Teams (via Marketplace)

```bash
# Add marketplace (one-time)
claude plugin marketplace add https://github.com/AlexanderStephenThompson/claude-hub

# Install teams
claude plugin install refactor-team
claude plugin install implement-team
claude plugin install diagnose-team
```

## How Teams Reference Skills

Teams (plugins) reference skills from `~/.claude/skills/` by name:

```yaml
# In an agent file (e.g., explorer.md)
skills:
  - architecture      # Loads ~/.claude/skills/architecture/SKILL.md
  - code-quality      # Loads ~/.claude/skills/code-quality/SKILL.md
```

## Update Workflow

When you modify a skill:

1. Edit the skill in `skills/` (source of truth)
2. Re-deploy to `~/.claude/skills/`
3. All teams and agents automatically use the updated skill

```bash
# Quick update after editing skills
cp -r skills/* ~/.claude/skills/
```

## Full Deployment Script

```bash
#!/bin/bash
# deploy.sh - Deploy all customizations

CLAUDE_DIR="$HOME/.claude"

# Create directories
mkdir -p "$CLAUDE_DIR/agents"
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$CLAUDE_DIR/skills"

# Deploy
cp -r skills/* "$CLAUDE_DIR/skills/"
cp agents/*.md "$CLAUDE_DIR/agents/"
cp commands/*.md "$CLAUDE_DIR/commands/"

echo "Deployed to $CLAUDE_DIR"
```
