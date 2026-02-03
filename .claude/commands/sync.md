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
| Repository | `c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub` |
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
cd "c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub"
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
cd "c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub"
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

#### Step 2: Copy fresh files from repo

```powershell
Copy-Item -Path 'c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub\skills\*' -Destination 'C:\Users\Alexa\.claude\skills\' -Recurse -Force
Copy-Item -Path 'c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub\agents\*.md' -Destination 'C:\Users\Alexa\.claude\agents\' -Force
Copy-Item -Path 'c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub\commands\*.md' -Destination 'C:\Users\Alexa\.claude\commands\' -Force
```

---

### 4. Reinstall Team Plugins

Uninstall and reinstall all teams so plugin manifests stay current:

```bash
claude plugin uninstall clean-team && claude plugin install clean-team
claude plugin uninstall refactor-team && claude plugin install refactor-team
claude plugin uninstall implement-team && claude plugin install implement-team
claude plugin uninstall diagnose-team && claude plugin install diagnose-team
```

If a team isn't installed yet, the uninstall will fail silently — just install it.

---

### 5. Verify & Report

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
- Any files that were cleaned up (existed before but not in repo)
- Git status (if push/pull mode)
