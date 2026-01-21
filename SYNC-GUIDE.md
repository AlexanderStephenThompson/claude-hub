# Sync Guide for AI Assistants

## Paths

| Name | Path |
|------|------|
| Repository | `c:\Users\Alexa\Downloads\clawd\claude-customizations` |
| Claude Home | `C:\Users\Alexa\.claude` |
| GitHub | https://github.com/AlexanderStephenThompson/claude-hub |

---

## Sync (Pull + Deploy)

When user says "sync" or "sync from GitHub":

```bash
# 1. Pull latest
cd "c:\Users\Alexa\Downloads\clawd\claude-customizations"
git pull

# 2. Create directories if needed
mkdir -p "C:\Users\Alexa\.claude\skills"
mkdir -p "C:\Users\Alexa\.claude\agents"
mkdir -p "C:\Users\Alexa\.claude\commands"

# 3. Copy files
cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

---

## Deploy Only

When user says "deploy" (no git pull):

```bash
cd "c:\Users\Alexa\Downloads\clawd\claude-customizations"
cp -r skills/* "C:\Users\Alexa\.claude\skills/"
cp agents/*.md "C:\Users\Alexa\.claude\agents/"
cp commands/*.md "C:\Users\Alexa\.claude\commands/"
```

---

## Push to GitHub

When user says "push":

```bash
cd "c:\Users\Alexa\Downloads\clawd\claude-customizations"
git add -A
git commit -m "description of changes"
git push
```

---

## Update Plugins

When user says "update plugins":

```bash
claude plugin update refactor-team
claude plugin update implement-team
claude plugin update diagnose-team
```

---

## Deployment Map

| Source | Target |
|--------|--------|
| `skills/` | `C:\Users\Alexa\.claude\skills\` |
| `agents/` | `C:\Users\Alexa\.claude\agents\` |
| `commands/` | `C:\Users\Alexa\.claude\commands\` |
| `teams/` | Via marketplace (plugin install) |

---

## Verify

After sync, confirm files exist:

```bash
ls "C:\Users\Alexa\.claude\skills/"
ls "C:\Users\Alexa\.claude\agents/"
ls "C:\Users\Alexa\.claude\commands/"
```
