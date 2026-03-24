# Teams (Multi-Agent Coordination)

> Coordinated groups of Claude Code instances working together on complex tasks. Experimental feature.

---

## What Are Teams?

Agent teams are multiple Claude Code sessions working in parallel. One session acts as **team lead**, others act as **teammates** with their own context windows. Unlike subagents, teammates communicate directly with each other.

**Status:** Experimental. Enable in settings.json:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

---

## Core Architecture

| Component | Role |
|-----------|------|
| **Team lead** | Creates team, spawns teammates, coordinates work |
| **Teammates** | Separate Claude Code instances with own context |
| **Task list** | Shared work items at `~/.claude/tasks/{team-name}/` |
| **Mailbox** | Messaging system for inter-agent communication |

---

## Starting a Team

Use natural language:

```
I'm designing a CLI tool for tracking TODOs. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

You can specify team size, models, and whether to require plan approval.

---

## Display Modes

| Mode | How It Works | Requirement |
|------|-------------|-------------|
| **In-process** (default) | All in one terminal. Shift+Down to cycle. | Any terminal |
| **Split panes** | Each teammate gets its own pane. | tmux or iTerm2 |

Configure: `"teammateMode": "in-process"` in settings.json or `--teammate-mode` flag.

---

## Communication

- **Direct message:** Send to one specific teammate
- **Broadcast:** Send to all teammates (use sparingly — scales token cost)
- **Task list:** Shared work items teammates self-claim

### Task Management

Tasks flow: **pending** → **in progress** → **completed**

- Lead assigns tasks or teammates self-claim
- Tasks can have dependencies (blocked until deps complete)
- Aim for 5-6 tasks per teammate

### Plan Approval Gate

```
Spawn an architect to refactor auth. Require plan approval before changes.
```

Teammates submit plans for lead review. Rejected plans get feedback.

---

## Context & Information

Each teammate:
- Loads CLAUDE.md, MCP servers, skills automatically
- Does NOT inherit lead's conversation history
- Receives context via spawn prompt (make it detailed)

---

## Use Cases

**Parallel review** — Multiple reviewers with different lenses (security, performance, testing) on the same code.

**Competing hypotheses** — Independent investigators debating root causes.

**Independent features** — Each teammate owns separate files/modules.

**Cross-layer coordination** — Frontend, backend, and test changes in parallel.

---

## Teams vs Subagents

| Aspect | Subagents | Teams |
|--------|-----------|-------|
| Communication | Report to lead only | Direct teammate messaging |
| Coordination | Lead manages all | Shared task list |
| Best for | Focused isolated tasks | Complex collaboration, debate |
| Token cost | Lower | Higher (independent sessions) |
| Parallelism | Within one context | True parallel execution |

**Choose subagents** for quick focused workers. **Choose teams** when agents need to discuss and challenge each other.

---

## Best Practices

1. **Verify the task benefits from parallelism** — sequential work doesn't need teams
2. **5-6 tasks per teammate** keeps everyone productive
3. **Avoid file conflicts** — break work so each teammate owns different files
4. **Provide rich spawn context** — teammates don't inherit conversation history
5. **Only lead should clean up** — teammates' team context may not resolve correctly
6. **Start with 3-5 teammates** — beyond that, coordination overhead exceeds value

---

## Limitations

| Limitation | Workaround |
|-----------|-----------|
| No session resumption with in-process teammates | Spawn new teammates after `/resume` |
| Task status can lag | Check manually or nudge via lead |
| One team per session | Clean up before starting a new one |
| No nested teams | Teammates can't spawn their own teams |
| Lead is fixed | Can't promote or transfer leadership |
| Split panes need tmux/iTerm2 | In-process mode works in any terminal |

---

## Key Files

| Item | Location |
|------|----------|
| Team config | `~/.claude/teams/{team-name}/config.json` |
| Task list | `~/.claude/tasks/{team-name}/` |
| Enable | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings env |

---

## Hooks for Quality Gates

- **TeammateIdle** — Runs when teammate about to go idle. Exit code 2 sends feedback, keeps teammate working.
- **TaskCompleted** — Runs when task marked complete. Exit code 2 prevents completion, sends feedback.

---

## Related

- [agents.md](agents.md) — Individual agent definitions
- [skills.md](skills.md) — Skills available to all teammates
- [remote-work.md](remote-work.md) — Running teams in CI/cloud
