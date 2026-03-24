# Skills

> Reusable units of knowledge and workflow that teach Claude how to do something. The primary way to extend Claude Code's capabilities.

---

## What Are Skills?

Skills are markdown files with instructions that Claude follows. They can contain **reference content** (knowledge) and **task content** (step-by-step actions). Skills replace the older "custom commands" system with more features.

**Skills vs Commands:** Both create `/slash-commands`. Skills are recommended because they support subdirectories, frontmatter configuration, subagent execution, dynamic context injection, and argument substitution.

---

## Where Skills Live

| Location | Path | Scope | Priority |
|----------|------|-------|----------|
| Enterprise | Managed by admin | All org users | 1 (highest) |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects | 2 |
| Project | `.claude/skills/<name>/SKILL.md` | This project only | 3 |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Where plugin enabled | 4 (lowest) |

**Monorepo support:** Claude auto-discovers skills from nested `.claude/skills/` directories relative to the file you're working on.

---

## Directory Structure

```
my-skill/
├── SKILL.md              # Main instructions (required)
├── references/            # Detailed docs loaded on-demand
│   └── api-reference.md
├── assets/                # Templates, checklists
│   └── checklist.md
├── scripts/               # Executable code
│   ├── validate.sh
│   └── helper.py
└── examples/              # Example output
    └── sample.md
```

Keep `SKILL.md` under 500 lines. Move detailed material to supporting files and link to them.

---

## SKILL.md Format

```yaml
---
name: my-skill
description: What this skill does and when to use it
---

# Instructions

When using this skill, always:
1. Do this first
2. Then do this
3. Verify the result

For detailed API docs, see [reference.md](references/api-reference.md).
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name (lowercase, hyphens, max 64 chars). Becomes `/slash-command`. Defaults to directory name. |
| `description` | Recommended | What it does and when to use it. Claude uses this for auto-invocation. |
| `argument-hint` | No | Hint for autocomplete: `[issue-number]`, `[filename]` |
| `disable-model-invocation` | No | `true` = manual `/name` only. Default: `false` |
| `user-invocable` | No | `false` = hidden from `/` menu, Claude can still auto-invoke. Default: `true` |
| `allowed-tools` | No | Tools Claude can use without permission when skill is active |
| `model` | No | Model override when skill is active |
| `effort` | No | Effort level: `low`, `medium`, `high`, `max` |
| `context` | No | `fork` = run in isolated subagent context |
| `agent` | No | Subagent type with `context: fork`: `Explore`, `Plan`, `general-purpose`, or custom |
| `hooks` | No | Hooks scoped to this skill's lifecycle |

### String Substitutions

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed when invoking |
| `$ARGUMENTS[N]` or `$N` | Specific argument by 0-based index |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing SKILL.md |

---

## How Skills Get Loaded

**Description** — Always in context so Claude knows what's available.

**Full content** — Loads only when invoked (manually or auto).

**Supporting files** — Loaded on-demand when Claude reads the links.

### Invocation Control

| Setting | You invoke | Claude invokes | Use for |
|---------|-----------|---------------|---------|
| Default | Yes | Yes | General knowledge and tasks |
| `disable-model-invocation: true` | Yes | No | Side-effect actions (`/deploy`, `/commit`) |
| `user-invocable: false` | No | Yes | Background knowledge |

---

## Dynamic Context

Run shell commands before Claude sees the skill with `` !`command` `` syntax:

```yaml
---
name: pr-summary
context: fork
agent: Explore
---

## PR Context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`

Summarize this PR...
```

Commands run as preprocessing. Output replaces the placeholder.

---

## Running in Subagents

```yaml
---
name: deep-research
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly...
```

The subagent receives only the skill content as its prompt (no conversation history). Only use `context: fork` when the skill has an explicit task, not just guidelines.

---

## Permissions

```json
{
  "permissions": {
    "allow": ["Skill(commit)", "Skill(review-pr *)"],
    "deny": ["Skill(deploy *)"]
  }
}
```

- `Skill(name)` — exact match
- `Skill(name *)` — prefix match with any arguments

---

## Best Practices

1. **Clear descriptions** — Include keywords Claude would naturally match
2. **Keep SKILL.md focused** — Under 500 lines, link to supporting files
3. **`disable-model-invocation: true`** for anything with side effects
4. **Use `allowed-tools`** to enforce safe permissions
5. **Use `${CLAUDE_SKILL_DIR}`** to reference bundled scripts
6. **Test both invocation paths** — manual and auto-trigger

---

## Limitations

1. Many skills consume context for descriptions (~2% of window)
2. `context: fork` requires an actionable task, not just guidelines
3. Shell preprocessing (`` !`command` ``) fails silently if command errors
4. Plugin skills cannot reference project skills
5. If both a command and skill create the same `/name`, skill wins

---

## Extended Thinking

Include the word "ultrathink" in skill content to enable extended thinking.

---

## Related

- [slash-commands.md](slash-commands.md) — Built-in commands and legacy custom commands
- [agents.md](agents.md) — Agent definitions that skills can reference
- [mcp-servers.md](mcp-servers.md) — External tools skills can use
