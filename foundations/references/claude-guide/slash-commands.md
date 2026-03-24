# Slash Commands

> Built-in and custom commands invoked by typing `/` in Claude Code.

---

## How Commands Work

Type `/` to see the autocomplete menu. Filter by typing letters: `/dep` shows deploy-related commands. Commands can accept arguments after the name.

---

## Built-in Commands

These are hard-coded in Claude Code and cannot be modified:

| Command | Purpose |
|---------|---------|
| `/help` | Show all available commands |
| `/config` or `/settings` | Open settings interface |
| `/model [model]` | Select or change model |
| `/effort [level]` | Adjust reasoning effort (`low`, `medium`, `high`, `max`, `auto`) |
| `/permissions` | View or update tool permissions |
| `/memory` | Edit CLAUDE.md memory files |
| `/agents` | Manage agent configurations |
| `/skills` | List available skills |
| `/mcp` | Check MCP server status and authenticate |
| `/rewind` or `/checkpoint` | Rewind conversation to a previous point |
| `/cost` | Show token usage statistics |
| `/export [filename]` | Export conversation as plain text |
| `/context` | Visualize current context usage |
| `/debug [description]` | Troubleshoot session issues |
| `/branch [name]` or `/fork` | Create a conversation branch |
| `/resume [session]` | Resume a past conversation |
| `/compact` | Compress conversation context |
| `/clear` | Clear conversation history |
| `/tasks` | View background and remote tasks |

Built-in commands are NOT available through the Skill tool and cannot be invoked programmatically.

---

## Custom Commands (Legacy)

Custom commands live as single `.md` files:

```
~/.claude/commands/deploy.md      # Personal (all projects)
.claude/commands/deploy.md        # Project-specific
```

These create `/deploy` and work identically to skills. **Skills are now recommended** over commands because they support subdirectories, frontmatter, and more features.

If both `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` exist, the skill takes precedence.

---

## Custom Commands vs Skills

| Aspect | Commands | Skills |
|--------|----------|--------|
| File | `.claude/commands/name.md` | `.claude/skills/name/SKILL.md` |
| Structure | Single file | Directory with supporting files |
| Frontmatter | Same YAML format | Same YAML format |
| Supporting files | Not supported | Supported |
| Auto-invocation control | Same | Same |
| Recommendation | Legacy | Preferred |

Both systems are fully merged. See [skills.md](skills.md) for the complete reference on creating custom commands/skills.

---

## Bundled Skills (Ship with Claude Code)

| Skill | Purpose |
|-------|---------|
| `/batch <instruction>` | Orchestrate large-scale changes across 5-30 parallel worktrees |
| `/simplify [focus]` | Review recent changes for reuse, quality, and efficiency |
| `/debug [description]` | Troubleshoot session issues by reading debug log |
| `/loop [interval] <prompt>` | Run a prompt repeatedly on an interval |
| `/claude-api` | Load Claude API reference for your project language |

---

## Arguments

Commands accept space-separated arguments:

```
/fix-issue 123
/migrate-component SearchBar React Vue
```

In the skill/command file, use `$ARGUMENTS` (all args) or `$0`, `$1`, `$2` (positional). See [skills.md](skills.md) for details.

---

## Related

- [skills.md](skills.md) — Full reference on creating custom commands/skills
- [agents.md](agents.md) — Agent definitions invocable from commands
