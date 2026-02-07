# [Team Name] Plugin

**Version X.X.X** — [Brief tagline]

[One paragraph description of what this team does and when to use it.]

## The Team

```
[Workflow diagram showing agent flow]
Agent1 --> Agent2 --> Agent3 --> ...
```

| Agent | Role | Model | Color |
|-------|------|-------|-------|
| **[Agent1]** | [Brief role description] | [Model] | [Color] |
| **[Agent2]** | [Brief role description] | [Model] | [Color] |
| **[Agent3]** | [Brief role description] | [Model] | [Color] |

## Prerequisites

- **Git** — [Why required]
- **[Other]** — [Why required]

## Installation

```bash
# Load for a single session (from parent directory)
claude --plugin-dir ./[team-name]

# Or with full path
claude --plugin-dir "path/to/[team-name]"

# Validate plugin structure
claude plugin validate ./[team-name]
```

## Quick Start

```bash
# Run the full workflow
/[team-name]:[command] [arguments]

# Or invoke individual agents
@[agent1] [arguments]
@[agent2]  # after [agent1] completes
# ... and so on
```

## How It Works

### Autonomous Execution

[Describe how the workflow runs with minimal user interruption.]

### Gated Decisions

[Describe quality gates and when they fire:]

1. **[Gate 1 Name]** (after [phase])
   - [What it does]
   - [Possible outcomes]

2. **[Gate 2 Name]** (after [phase])
   - [What it does]
   - [Possible outcomes]

### Early Exits

The workflow can exit early if:
- [Condition 1]
- [Condition 2]

## Components

### Agents ([N])

All in `agents/`:
- `[agent1].md` — [Brief description]
- `[agent2].md` — [Brief description]
- `[agent3].md` — [Brief description]

### Skills Inheritance by Agent

| Agent | Inherits | Why |
|-------|----------|-----|
| [Agent1] | [skill1], [skill2] | [Reason] |
| [Agent2] | [skill1] | [Reason] |
| [Agent3] | [skill1], [skill3] | [Reason] |

### Commands ([N])

- `/[team-name]:[command]` — [Description]

### Scripts (if any)

- `scripts/[script].py` — [Description]

## Workflow Phases

### Phase 1: [Phase Name] ([Agents])

[Description of what happens in this phase]

### Phase 2: [Phase Name] ([Agents])

[Description of what happens in this phase]

### Phase 3: [Phase Name] ([Agents])

[Description of what happens in this phase]

## File Structure

```
[team-name]/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── agents/
│   ├── [agent1].md           # Step 1: [Description]
│   ├── [agent2].md           # Step 2: [Description]
│   └── [agent3].md           # Step 3: [Description]
├── commands/
│   └── [command].md          # Full workflow command
├── scripts/                  # (optional)
│   └── [script].py
└── README.md
```

**Note:** Skills are shared across all teams and live at the repository root in `skills/`. They are deployed to `~/.claude/skills/` and referenced by agents via their frontmatter.

## Design Principles

### Agent Philosophy

- **Separation of concerns** — Each agent has one job
- **Gated decisions** — Quality gates at key points
- **Loop limits** — Max N cycles to prevent infinite loops
- **Early exits** — Stop early if appropriate
- **Rich context handoffs** — Full context passed forward
- **Autonomous execution** — Minimal user interruption

## Author

[Author Name] — [Brief description]
