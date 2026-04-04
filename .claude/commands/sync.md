---
description: Push changes to GitHub and deploy customizations to ~/.claude/
argument-hint: [push|deploy|pull]
---

**Mode:** $ARGUMENTS

# /sync

Sync customizations between this repo and `~/.claude/`. Three modes:

| Mode | Trigger | What Happens |
|------|---------|-------------|
| **Push** | `/sync` or `/sync push` | Commit + push to GitHub, then deploy |
| **Pull** | `/sync pull` | Pull from GitHub, then deploy |
| **Deploy** | `/sync deploy` | Deploy only (no git) |

## Paths

| Name | Path |
|------|------|
| Repo | `/mnt/c/Users/Alexa/Desktop/_Personal/Utility/Tools/claude-hub` |
| Claude | `/mnt/c/Users/Alexa/.claude` |

---

## Step 1: Git

Skip for deploy mode.

**Push mode (default):**

```bash
git add -A && git status
```

If there are changes to commit:
1. Review with `git diff --cached`
2. Create a conventional commit based on what changed
3. Push: `git push 2>&1`. If it fails with "no upstream branch", run `git push --set-upstream origin $(git branch --show-current) 2>&1` instead. Do NOT queue other bash commands until the push completes — it may block on credential prompts.

**Pull mode:**

```bash
git pull
```

---

## Step 2: Deploy

Use Claude Code's native tools for file operations. Only use Bash for git, claude CLI, and deletions.

### 2a: Clear destination folders

```bash
rm -rf /mnt/c/Users/Alexa/.claude/skills/*
rm -f /mnt/c/Users/Alexa/.claude/agents/*.md
rm -f /mnt/c/Users/Alexa/.claude/commands/*.md
rm -rf /mnt/c/Users/Alexa/.claude/plugins/cache/claude-hub
```

### 2b: Discover and deploy flat files

Use **Glob** to find source files, then **Read + Write** to copy each one.

**Skills** (copy entire skill folders):
```
Glob: foundations/**/skills/*/SKILL.md
Glob: domains/**/skills/*/SKILL.md
```
For each match, copy the entire parent folder (the skill folder) to `~/.claude/skills/`.

**Agents** (copy .md files, excluding README.md and paths containing .claude/ or templates/):
```
Glob: foundations/**/agents/*.md
Glob: domains/**/agents/*.md
```
Filter out README.md and any path containing `/.claude/` or `/templates/`. Copy each file to `~/.claude/agents/`.

**Commands** (copy .md files, excluding README.md and paths containing .claude/ or templates/):
```
Glob: foundations/**/commands/*.md
Glob: domains/**/commands/*.md
```
Filter out README.md and any path containing `/.claude/` or `/templates/`. Copy each file to `~/.claude/commands/`.

### 2c: Discover teams

Use **Glob** to find team plugins:
```
Glob: **/.claude-plugin/plugin.json
```
Extract the team name from the parent directory of each match. Store for step 2e.

### 2d: Refresh marketplace mirror

```bash
claude plugin marketplace update
```

The marketplace mirror tracks whatever branch it was cloned from (usually `main`). If you're working on a feature branch, the mirror won't have your changes until they're merged to `main`. This is expected — plugins install from the marketplace mirror, so they reflect the published state, not the working branch.

### 2e: Reinstall each team

For each team discovered in 2c:

```bash
claude plugin uninstall <team-name> 2>/dev/null; claude plugin install <team-name>
```

If a team isn't installed yet, the uninstall fails silently — just install it.

**New teams** must be registered in `.claude-plugin/marketplace.json` or install won't find them. Keep `marketplace.json` version in sync with `plugin.json` version.

> **Optional cleanup:** If skills or teams were removed from the repo, check `~/.claude/CLAUDE.md` for stale skill references and `~/.claude/settings.json` for stale `enabledPlugins` entries.

---

## Step 3: Report

```
Synced:
- X skills, X agents, X commands
- X team plugins reinstalled (team@version, ...)
- Git: [committed + pushed / pulled / skipped]
```
