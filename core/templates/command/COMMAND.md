---
name: [command-name]
description: [One-line description of what this command does]
---

# /[plugin-name]:[command-name]

[Brief description of what this command accomplishes and when to use it.]

## Usage

```bash
/[plugin-name]:[command-name] [required-arg] [optional-arg]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `[required-arg]` | Yes | [What this argument is for] |
| `[optional-arg]` | No | [What this argument is for, default value] |

## Examples

```bash
# Basic usage
/[plugin-name]:[command-name] src/

# With optional argument
/[plugin-name]:[command-name] src/ --option value

# Specific use case
/[plugin-name]:[command-name] "specific input"
```

## What It Does

[Numbered list of what happens when this command runs:]

1. **[Step 1]**: [Description]
2. **[Step 2]**: [Description]
3. **[Step 3]**: [Description]

## Entry Point

This command invokes the **@[first-agent]** agent to begin the workflow.

## Workflow

```
[command] --> @[agent1] --> @[agent2] --> @[agent3] --> Complete
```

## Prerequisites

- [Prerequisite 1: e.g., Git repository initialized]
- [Prerequisite 2: e.g., Working directory clean]
- [Prerequisite 3: e.g., Tests passing]

## Output

[Describe what the user will see when the command completes:]

- [Output 1: e.g., Refactored files]
- [Output 2: e.g., Git commits]
- [Output 3: e.g., Summary report]

## Notes

- [Important note 1]
- [Important note 2]
