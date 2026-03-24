# Agents (Subagents)

> Specialized AI assistants that handle specific tasks within Claude Code, each with their own context window and tool access.

---

## What Are Agents?

Agents are separate Claude Code instances that work on focused tasks. They preserve your main conversation context by keeping exploration, verbose output, and specialized work isolated.

**Two categories:**
- **Subagents** — Run within a single session, report results back
- **Agent Teams** — Fully independent sessions that communicate with each other (see [teams.md](teams.md))

---

## Built-in Agent Types

| Agent | Model | Tools | When Used |
|-------|-------|-------|-----------|
| **Explore** | Haiku | Read-only | Searching/analyzing codebases without changes |
| **Plan** | Inherits | Read-only | Research during plan mode |
| **General-purpose** | Inherits | All | Complex multi-step tasks |
| **Claude Code Guide** | Haiku | All | Questions about Claude Code features |

---

## Defining Custom Agents

### File Location (Priority Order)

| Location | Scope | Priority |
|----------|-------|----------|
| `--agents` CLI flag | Current session only | 1 (highest) |
| `.claude/agents/` | Current project | 2 |
| `~/.claude/agents/` | All projects | 3 |
| Plugin `agents/` | Where plugin enabled | 4 (lowest) |

### File Format

Markdown with YAML frontmatter. The body becomes the agent's system prompt.

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. Analyze code and provide
specific, actionable feedback on quality, security, and best practices.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier, lowercase with hyphens |
| `description` | Yes | When Claude should delegate to this agent |
| `tools` | No | Comma-separated tool allowlist. Inherits all if omitted |
| `disallowedTools` | No | Tools to deny from inherited list |
| `model` | No | `sonnet`, `opus`, `haiku`, full model ID, or `inherit` (default) |
| `permissionMode` | No | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Maximum agentic turns before stopping |
| `skills` | No | Skill names to inject into agent's context at startup |
| `mcpServers` | No | MCP servers scoped to this agent |
| `hooks` | No | Lifecycle hooks active only while agent runs |
| `memory` | No | `user`, `project`, or `local` for persistent cross-session memory |
| `background` | No | `true` to always run as background task |
| `effort` | No | Override effort: `low`, `medium`, `high`, `max` |
| `isolation` | No | `worktree` for isolated git worktree copy |

---

## Spawning Agents

### Natural Language (Implicit)

```
Use the test-runner agent to fix failing tests
```

Claude decides whether to delegate based on the agent's description.

### @-Mention (Explicit)

```
@"code-reviewer (agent)" look at the auth changes
```

Guarantees the specific agent runs.

### Session-Wide (`--agent` flag)

```bash
claude --agent code-reviewer
```

Replaces the default system prompt for the entire session.

### CLI-Defined (Temporary)

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

---

## Key Parameters

### Tool Restrictions

```yaml
# Allowlist only
tools: Read, Glob, Grep

# Denylist
disallowedTools: Write, Edit

# Restrict which subagents can spawn
tools: Agent(worker, researcher), Read, Bash
```

### Background vs Foreground

- **Foreground** — Blocks main conversation. Permission prompts pass through.
- **Background** — Runs concurrently. Permissions pre-approved upfront. Cannot ask clarifying questions.

Set via frontmatter (`background: true`), request ("run this in the background"), or **Ctrl+B** while running.

### MCP Server Scoping

```yaml
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github  # reference already-configured server
```

Inline definitions connect when agent starts, disconnect when it finishes.

---

## Communication

- **Subagent results** return to main conversation. Claude synthesizes findings.
- **SendMessage** resumes a previous agent by ID, preserving full context.
- **Agent teams** use direct messaging between teammates (see [teams.md](teams.md)).

---

## Persistent Memory

```yaml
memory: user    # ~/.claude/agent-memory/<agent-name>/
memory: project # .claude/agent-memory/<agent-name>/
memory: local   # .claude/agent-memory-local/<agent-name>/
```

Survives across conversations. Agent automatically gets Read/Edit tools for memory management.

---

## When to Use Agents vs Direct Tools

| Use Agents When | Use Main Conversation When |
|-----------------|---------------------------|
| Task produces verbose output | Task needs frequent iteration |
| Want tool restrictions for safety | Multiple phases share context |
| Work is self-contained | Making quick targeted changes |
| Want a cheaper/faster model for routine work | Latency matters |

---

## Limitations

1. Subagents cannot spawn other subagents (no nesting)
2. Plugin agents lack `hooks`, `mcpServers`, `permissionMode` fields
3. Agents don't inherit parent conversation history
4. Tool restrictions not retroactive after spawn

---

## Key Files

| Item | Location |
|------|----------|
| User agents | `~/.claude/agents/` |
| Project agents | `.claude/agents/` |
| Agent transcripts | `~/.claude/projects/{project}/{session}/subagents/` |
| Agent memory | `~/.claude/agent-memory/` or `.claude/agent-memory/` |

---

## Related

- [teams.md](teams.md) — Multi-agent team coordination
- [skills.md](skills.md) — Reusable prompts that run in main context
- [mcp-servers.md](mcp-servers.md) — External tool connections
