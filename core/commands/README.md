# Standalone Commands

Slash commands stored in `~/.claude/commands/`. Invoked directly with `/command-name` in any conversation.

---

## Available Commands

### General

| Command | Description | Output |
|---------|-------------|--------|
| [/commit](./commit.md) | Stage all changes and create a conventional commit | Git commit |
| [/orient](./orient.md) | Orient yourself to this project before starting work | Context summary |

### Quality & Analysis

| Command | Description | Output |
|---------|-------------|--------|
| [/ui-audit](../../web/commands/ui-audit.md) | Audit HTML semantics and CSS for consolidation | UI code findings |

### Repo Management

| Command | Description | Output |
|---------|-------------|--------|
| /sync | Push, pull, or deploy customizations to ~/.claude/ | Sync report |

> **Note:** `/sync` is a [project-level command](../../.claude/commands/sync.md) — always available in this repo, not deployed.

> **Note:** `/refactor-team:audit` produces reports that `/refactor-team:refactor` can consume automatically.

---

## Web Commands

Additional commands in `web/commands/`:

| Command | Description |
|---------|-------------|
| [/clean-parallel](../../web/commands/clean-parallel.md) | Run refactor-team Phase 1 using experimental parallel agent teams |

---

## Installing Commands

Commands deploy to `~/.claude/commands/` via `/sync deploy`. They become available immediately after placement.

## Creating Custom Commands

Commands are markdown files with optional YAML frontmatter:

```markdown
---
description: Short description shown in /help
argument-hint: [optional args]
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Command Name

Instructions for Claude to follow when this command is invoked.

$ARGUMENTS  <!-- Placeholder for user-provided arguments -->
```

### Frontmatter Options

| Field | Purpose |
|-------|---------|
| `description` | Shown in command listings |
| `argument-hint` | Placeholder text for expected arguments |
| `allowed-tools` | Restrict which tools the command can use |
