---
description: Push changes to GitHub and deploy customizations to ~/.claude/
argument-hint: [push|deploy|pull]
---

**Mode:** $ARGUMENTS

# Sync Command

Sync customizations between this repo and Claude's local config directory.

---

## Paths

| Name | Path |
|------|------|
| Repository | `c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub` |
| Claude Home | `C:\Users\Alexa\.claude` |

---

## Instructions

### 1. Determine Mode

Check `$ARGUMENTS`:
- **Empty or "push"** (default): Push to GitHub, then deploy
- **"deploy"**: Deploy only, no git operations
- **"pull"**: Pull from GitHub, then deploy

---

### 2. Execute Based on Mode

#### Push Mode (default)

```bash
cd "c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub"
git add -A
git status
```

If there are changes to commit:
1. Analyze the changes with `git diff --cached`
2. Create a conventional commit message based on what changed
3. Push to origin

```bash
git commit -m "type(scope): description"
git push
```

Then proceed to deploy.

#### Deploy Mode

Skip git operations. Proceed directly to deploy.

#### Pull Mode

```bash
cd "c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub"
git pull
```

Then proceed to deploy.

---

### 3. Deploy

Use PowerShell for all file operations (required on Windows).

#### Step 1: Clean stale files

Remove old files first so renamed or deleted items don't linger:

```powershell
Remove-Item 'C:\Users\Alexa\.claude\skills\*' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item 'C:\Users\Alexa\.claude\agents\*.md' -Force -ErrorAction SilentlyContinue
Remove-Item 'C:\Users\Alexa\.claude\commands\*.md' -Force -ErrorAction SilentlyContinue
```

#### Step 2: Copy fresh files from all domain folders

The repo uses domain folders (`core/`, `web/`, `world-building/`, `data/`). Deploy flattens everything into `~/.claude/`. Skills are discovered recursively (supports nested sub-categories like `world-building/unity/skills/`).

```powershell
$repo = 'c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub'
$domains = @('core', 'web', 'world-building', 'data')

foreach ($domain in $domains) {
    # Skills: recursive discovery (finds skills/ at any depth within the domain)
    Get-ChildItem -Path (Join-Path $repo $domain) -Directory -Recurse |
        Where-Object { $_.Name -eq 'skills' } |
        ForEach-Object {
            Copy-Item -Path "$($_.FullName)\*" -Destination 'C:\Users\Alexa\.claude\skills\' -Recurse -Force
        }

    # Agents: flat discovery
    $agentsPath = Join-Path $repo "$domain\agents"
    if (Test-Path $agentsPath) {
        Get-ChildItem "$agentsPath\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination 'C:\Users\Alexa\.claude\agents\' -Force
    }

    # Commands: flat discovery
    $commandsPath = Join-Path $repo "$domain\commands"
    if (Test-Path $commandsPath) {
        Get-ChildItem "$commandsPath\*.md" | Where-Object { $_.Name -ne 'README.md' } | Copy-Item -Destination 'C:\Users\Alexa\.claude\commands\' -Force
    }

}
```

---

### 4. Reinstall Team Plugins

Discover all teams dynamically by scanning for `.claude-plugin/plugin.json` under any domain folder. This ensures new teams are always picked up without editing this file.

```powershell
$repo = 'c:\Users\Alexa\OneDrive\Desktop\_Personal\Personal\claude-hub'
Get-ChildItem $repo -Directory -Recurse | Where-Object {
    Test-Path (Join-Path $_.FullName '.claude-plugin\plugin.json')
} | ForEach-Object { $_.Name }
```

For each team found, uninstall then install:

```bash
claude plugin uninstall <team-name> && claude plugin install <team-name>
```

If a team isn't installed yet, the uninstall will fail silently — just install it.

**Important:** New teams must also be registered in `.claude-plugin/marketplace.json` or `claude plugin install` won't find them.

---

### 5. Sync Global CLAUDE.md

The global `~/.claude/CLAUDE.md` references deployed skills by name. After deploy, verify it only references skills that actually exist:

```powershell
# Get deployed skill names
$deployedSkills = Get-ChildItem 'C:\Users\Alexa\.claude\skills' -Directory | Select-Object -ExpandProperty Name

# Check CLAUDE.md for skill references that don't exist
$claudeMd = Get-Content 'C:\Users\Alexa\.claude\CLAUDE.md' -Raw
```

If `~/.claude/CLAUDE.md` references a skill that wasn't deployed (e.g., a skill removed from the repo), remove that reference. The repo's `CLAUDE.md` is the source of truth for the skill list.

---

### 6. Clean Stale Plugin References

Check `~/.claude/settings.json` for `enabledPlugins` entries that reference teams no longer in the repo. Compare against teams discovered in Step 4 — remove any entries for teams that don't exist.

```powershell
# Read settings.json and check enabledPlugins keys
# Remove any <name>@claude-hub entries where <name> is not a discovered team
```

---

### 7. Verify & Report

```powershell
Get-ChildItem 'C:\Users\Alexa\.claude\skills' -Directory | Select-Object Name
Get-ChildItem 'C:\Users\Alexa\.claude\agents\*.md' | Select-Object Name
Get-ChildItem 'C:\Users\Alexa\.claude\commands\*.md' | Select-Object Name
```

Report what was synced:
- Number of skills deployed
- Number of agents deployed
- Number of commands deployed
- Team plugins reinstalled
- Stale references cleaned (from CLAUDE.md or settings.json)
- Any files that were cleaned up (existed before but not in repo)
- Git status (if push/pull mode)
