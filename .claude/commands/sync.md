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
| Repository | `c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub\claude-customizations` |
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
cd "c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub\claude-customizations"
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
cd "c:\Users\Alexa\OneDrive\Desktop\_Personal\claude-hub\claude-customizations"
git pull
```

Then proceed to deploy.

---

### 3. Deploy

Create directories if needed and copy files:

```bash
mkdir -p "C:\Users\Alexa\.claude\skills"
mkdir -p "C:\Users\Alexa\.claude\agents"
mkdir -p "C:\Users\Alexa\.claude\commands"

cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

---

### 4. Verify & Report

```bash
ls "C:\Users\Alexa\.claude\skills/"
ls "C:\Users\Alexa\.claude\agents/"
ls "C:\Users\Alexa\.claude\commands/"
```

Report what was synced:
- Number of skills deployed
- Number of agents deployed
- Number of commands deployed
- Git status (if push/pull mode)
