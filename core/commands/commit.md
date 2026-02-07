---
description: Stage all changes and create a well-crafted commit message
argument-hint: [optional commit scope or hint]
---

**Context hint:** $ARGUMENTS

# Commit Command

Conventional commits aren't about being neat — they're about making history searchable. When something breaks, `git log --grep="fix(auth)"` finds every auth fix instantly. When writing a changelog, commits grouped by type write themselves. When reviewing a PR, the commit type tells you what kind of review is needed. A commit history of "fix stuff" and "updates" is worthless for all three use cases.

Stage all changes and create a thoughtful, conventional commit message.

---

## Instructions

1. **Stage all changes:**
   ```bash
   git add .
   ```

2. **Gather context** by running these commands in parallel:
   - `git status` - See what files are staged
   - `git diff --cached` - See the actual changes
   - `git log --oneline -5` - See recent commit style

3. **Analyze the changes** and determine:
   - **Type:** What kind of change is this?
     - `feature` - New feature
     - `fix` - Bug fix
     - `refactor` - Code restructuring without behavior change
     - `style` - Formatting, whitespace, missing semicolons
     - `docs` - Documentation only
     - `test` - Adding or updating tests
     - `chore` - Build, config, dependencies
   - **Scope:** What area of the codebase? (optional, in parentheses)
   - **Summary:** What does this change accomplish? (imperative mood, lowercase, no period)

4. **Craft the commit message** following this format:
   ```
   type(scope): summary

   - Bullet points explaining what changed
   - Focus on WHY, not just what
   - Keep each line under 72 characters
   ```

5. **Create the commit** using a heredoc:
   ```bash
   git commit -m "$(cat <<'EOF'
   type(scope): summary

   - What changed and why
   - Additional context if needed

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

6. **Verify** with `git status` to confirm the commit succeeded.

---

## Commit Message Guidelines

**Good examples:**
```
feature(auth): add password reset flow

- Add forgot password form and email trigger
- Implement reset token generation with 1hr expiry
- Create password update endpoint with validation
```

```
fix(themes): resolve glass theme blur not applying

- Glass theme blur effect wasn't working in Firefox
- Added -moz-backdrop-filter fallback
```

```
refactor(components): extract button styles to shared module

- Reduces duplication across 5 component files
- Creates single source of truth for button variants
```

**Avoid:**
- Vague messages: "fix stuff", "updates", "WIP"
- Describing only what, not why
- Messages that are too long or too short

---

## Output

After committing, show:
```
Committed: {short hash}

{full commit message}

{number} files changed, {insertions} insertions(+), {deletions} deletions(-)
```
