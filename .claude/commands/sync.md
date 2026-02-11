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
| Home | `C:\Users\Alexa\.claude` |

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

This step handles everything: flat files, plugin marketplace mirror, plugin installation, and reference validation. All sub-steps run every time regardless of mode.

**PowerShell execution:** Write PowerShell scripts to a temp `.ps1` file and run with `powershell -File <path>` to avoid bash escaping issues with `$` variables.

### 2a: Flat files

Clean stale files, then copy fresh ones from all domain folders. Skills are discovered recursively (supports nested sub-categories).

```powershell
$repo = 'c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub'
$home = 'C:\Users\Alexa\.claude'
$domains = @('core', 'web', 'world-building', 'data')

# Clean
Remove-Item "$home\skills\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$home\agents\*.md" -Force -ErrorAction SilentlyContinue
Remove-Item "$home\commands\*.md" -Force -ErrorAction SilentlyContinue

# Copy
foreach ($d in $domains) {
    # Skills (recursive — finds skills/ at any depth)
    Get-ChildItem (Join-Path $repo $d) -Directory -Recurse |
        Where-Object { $_.Name -eq 'skills' } |
        ForEach-Object { Copy-Item "$($_.FullName)\*" "$home\skills\" -Recurse -Force }

    # Agents (flat)
    $a = Join-Path $repo "$d\agents"
    if (Test-Path $a) { Get-ChildItem "$a\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination "$home\agents\" -Force }

    # Commands (flat)
    $c = Join-Path $repo "$d\commands"
    if (Test-Path $c) { Get-ChildItem "$c\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination "$home\commands\" -Force }
}
```

### 2b: Plugin marketplace mirror

**CRITICAL — this must run before plugin reinstall.** The plugin system reads from a local git clone (`~/.claude/plugins/marketplaces/claude-hub/`). Without refreshing it, `claude plugin install` pulls stale versions and the reinstall is a no-op.

```bash
claude plugin marketplace update
```

### 2c: Discover teams and clean stale cache

```powershell
$repo = 'c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub'
$cache = 'C:\Users\Alexa\.claude\plugins\cache\claude-hub'

# Discover teams (any folder with .claude-plugin/plugin.json)
$teams = Get-ChildItem $repo -Directory -Recurse |
    Where-Object { Test-Path (Join-Path $_.FullName '.claude-plugin\plugin.json') } |
    ForEach-Object { $_.Name }

# Remove cache entries for teams no longer in the repo
if (Test-Path $cache) {
    Get-ChildItem $cache -Directory |
        Where-Object { $_.Name -notin $teams } |
        ForEach-Object { Remove-Item $_.FullName -Recurse -Force; "Removed stale cache: $($_.Name)" }
}

$teams
```

### 2d: Reinstall each team

For each team discovered above:

```bash
claude plugin uninstall <team-name> && claude plugin install <team-name>
```

If a team isn't installed yet, the uninstall fails silently — just install it.

**New teams** must be registered in `.claude-plugin/marketplace.json` or `claude plugin install` won't find them. Keep `marketplace.json` version in sync with `plugin.json` version.

### 2e: Validate references

Check for stale references left behind by removed skills or teams:

1. **`~/.claude/CLAUDE.md`** — Read the file and cross-check skill names against `~/.claude/skills/`. Remove any references to skills that weren't deployed. The repo's `CLAUDE.md` is the source of truth.

2. **`~/.claude/settings.json`** — Check `enabledPlugins` for entries referencing teams not discovered above. Remove stale entries.

---

## Step 3: Report

Count what was deployed and report:

```powershell
$home = 'C:\Users\Alexa\.claude'
$skills = (Get-ChildItem "$home\skills" -Directory -ErrorAction SilentlyContinue).Count
$agents = (Get-ChildItem "$home\agents\*.md" -ErrorAction SilentlyContinue).Count
$commands = (Get-ChildItem "$home\commands\*.md" -ErrorAction SilentlyContinue).Count
"$skills skills, $agents agents, $commands commands"
```

Report format:

```
Synced:
- X skills, X agents, X commands
- X team plugins reinstalled (team@version, team@version, ...)
- Stale references cleaned: [list or "none"]
- Git: [committed + pushed / pulled / skipped]
```
