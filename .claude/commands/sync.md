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
| Repo | `c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub` |
| Claude | `C:\Users\Alexa\.claude` |

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
3. `git push`

**Pull mode:**

```bash
git pull
```

---

## Step 2: Deploy

Handles everything: flat files, plugin marketplace, and plugin installation. All sub-steps run every time regardless of mode.

**PowerShell execution:** Write scripts to a temp `.ps1` file and run with `powershell -File <path>` to avoid bash `$` variable escaping issues.

### 2a: Flat files, team discovery, and cache cleanup

One script that deploys flat files, discovers teams, clears stale plugin cache, and counts results:

```powershell
$repo = 'c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub'
$claude = 'C:\Users\Alexa\.claude'
$domains = @('core', 'web', 'world-building', 'data')

# --- Deploy flat files ---
Remove-Item "$claude\skills\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$claude\agents\*.md" -Force -ErrorAction SilentlyContinue
Remove-Item "$claude\commands\*.md" -Force -ErrorAction SilentlyContinue

foreach ($d in $domains) {
    # Skills (recursive — finds skills/ at any depth)
    Get-ChildItem (Join-Path $repo $d) -Directory -Recurse |
        Where-Object { $_.Name -eq 'skills' } |
        ForEach-Object { Copy-Item "$($_.FullName)\*" "$claude\skills\" -Recurse -Force }

    # Agents (flat)
    $a = Join-Path $repo "$d\agents"
    if (Test-Path $a) { Get-ChildItem "$a\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination "$claude\agents\" -Force }

    # Commands (flat)
    $c = Join-Path $repo "$d\commands"
    if (Test-Path $c) { Get-ChildItem "$c\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination "$claude\commands\" -Force }
}

# --- Discover teams ---
$teams = Get-ChildItem $repo -Directory -Recurse |
    Where-Object { Test-Path (Join-Path $_.FullName '.claude-plugin\plugin.json') } |
    ForEach-Object { $_.Name }

# --- Clear plugin cache (rebuilt fresh on install) ---
$cache = "$claude\plugins\cache\claude-hub"
if (Test-Path $cache) { Remove-Item $cache -Recurse -Force }

# --- Report counts ---
$skills = (Get-ChildItem "$claude\skills" -Directory -ErrorAction SilentlyContinue).Count
$agents = (Get-ChildItem "$claude\agents\*.md" -ErrorAction SilentlyContinue).Count
$commands = (Get-ChildItem "$claude\commands\*.md" -ErrorAction SilentlyContinue).Count
"Deployed: $skills skills, $agents agents, $commands commands"
"Teams: $($teams -join ', ')"
```

### 2b: Refresh marketplace mirror

**CRITICAL — must run before plugin reinstall.** The plugin system reads from a local git clone, not GitHub directly. Without refreshing, `claude plugin install` pulls stale versions.

```bash
claude plugin marketplace update
```

### 2c: Reinstall each team

For each team from 2a:

```bash
claude plugin uninstall <team-name> && claude plugin install <team-name>
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
