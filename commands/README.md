# Standalone Commands

Reference documentation for Claude Code slash commands stored in `~/.claude/commands/`. These commands are invoked directly with `/command-name` and run within the current conversation context.

---

## Available Commands

| Command | Description | Output |
|---------|-------------|--------|
| [/commit](./Commit.md) | Stage all changes and create a conventional commit | Git commit |

> **Note:** The project audit functionality has been moved to the [Improvement Auditor](../agents/improvement-auditor.md) agent for better autonomous operation.

---

## /commit

**Purpose**: Automate the creation of well-crafted, conventional commit messages.

### What It Does

1. Stages all changes (`git add .`)
2. Gathers context (status, diff, recent commits)
3. Analyzes changes to determine type and scope
4. Crafts a conventional commit message
5. Creates the commit with proper formatting

### Commit Types

| Type | When to Use |
|------|-------------|
| `feature` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `style` | Formatting, whitespace |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Build, config, dependencies |

### Message Format

```
type(scope): summary

- Bullet points explaining what changed
- Focus on WHY, not just what
- Keep each line under 72 characters

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Example Output

```
feature(auth): add password reset flow

- Add forgot password form and email trigger
- Implement reset token generation with 1hr expiry
- Create password update endpoint with validation

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Usage

```bash
/commit                    # Analyze and commit all changes
/commit auth              # Hint that changes relate to auth
/commit "login feature"   # Provide context for the commit
```

---

## Installing Commands

Commands are stored in `~/.claude/commands/`. To install:

```bash
# Create commands directory if it doesn't exist
mkdir -p ~/.claude/commands

# Copy command file
cp Commit.md ~/.claude/commands/
```

Commands become available immediately after placing the `.md` file in the directory.

---

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

## Steps

1. Do this
2. Then this
3. Finally this

$ARGUMENTS  <!-- Placeholder for user-provided arguments -->
```

### Frontmatter Options

| Field | Purpose |
|-------|---------|
| `description` | Shown in command listings |
| `argument-hint` | Placeholder text for expected arguments |
| `allowed-tools` | Restrict which tools the command can use |
