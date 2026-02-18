---
description: Clean a web project — restructure, CSS, HTML, then code quality
argument-hint: [scope] — optional directory, e.g., "src/"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Task
---

# /clean-web:clean

A 4-agent pipeline that takes a web project from messy to clean:

```
web-restructure → css-improver → html-improver → code-improver
```

Each agent runs its full phase sequence, commits after each phase, and writes a handoff summary for the next agent. Agents that don't apply are skipped automatically.

## Arguments

$ARGUMENTS

---

## Operating Rules

1. **Autonomous execution** — Agents run without interruption unless they hit a true blocker
2. **Commit per phase** — Each agent commits its changes phase by phase before handing off
3. **Skip what doesn't apply** — Detect project shape first, skip agents with no work to do
4. **One question max** — Only ask the user if there's a hard blocker (build failure that can't be auto-fixed, ambiguous root items)
5. **Pass context forward** — Extract key facts from each agent's handoff and pass to the next agent
6. **Don't change behavior** — Every agent preserves existing functionality. The page must look and work identical after each step.

---

## Prerequisite Check

Before running any agent, verify the environment.

### Git Status

```bash
git status --porcelain
```

- **No git?** Initialize: `git init` + initial commit of all current files
- **Uncommitted changes?** Warn: "You have uncommitted changes. Recommend committing or stashing before cleanup." Ask whether to proceed.

---

## Project Shape Detection

Detect what work is needed before launching any agent. All detection is read-only.

**1. Check for 3-tier structure:**

Use Glob to check if `source/01-presentation/`, `source/02-logic/`, `source/03-data/` exist with files in them.
- All three exist with files → `SKIP_RESTRUCTURE = true`
- Otherwise → `SKIP_RESTRUCTURE = false`

**2. Check for CSS files:**

```
Glob: **/*.css (exclude node_modules/, dist/, build/)
```
- Count = 0 → `SKIP_CSS = true`
- Count > 0 → `SKIP_CSS = false`

**3. Check for HTML/JSX/TSX files:**

```
Glob: **/*.html, **/*.jsx, **/*.tsx (exclude node_modules/, dist/, build/)
```
- Count = 0 → `SKIP_HTML = true`
- Count > 0 → `SKIP_HTML = false`

**4. Check for JS/TS logic files:**

```
Glob: **/*.js, **/*.ts, **/*.jsx, **/*.tsx (exclude node_modules/, dist/, build/)
```
- Count = 0 → `SKIP_CODE = true`
- Count > 0 → `SKIP_CODE = false`

### Present Detection Results

Show the user what was detected and what will run:

```
Project shape:
  3-tier structure:  [exists — skipping restructure / not found — will restructure]
  CSS files:         [N found / none — skipping css-improver]
  HTML/JSX/TSX:      [N found / none — skipping html-improver]
  JS/TS files:       [N found / none — skipping code-improver]

Pipeline:
  [1] web-restructure:  [WILL RUN / SKIP]
  [2] css-improver:     [WILL RUN / SKIP]
  [3] html-improver:    [WILL RUN / SKIP]
  [4] code-improver:    [WILL RUN / SKIP]
```

If ALL four agents would be skipped, report "Project is already clean — nothing to do." and stop.

---

## Progress Tracking

Create a todo list showing the full pipeline before starting:

```
[ ] web-restructure — 3-tier architecture + root hygiene
[ ] css-improver    — 5-file CSS architecture + design tokens
[ ] html-improver   — semantic markup + accessibility
[ ] code-improver   — naming, magic values, nesting, error handling
```

Mark skipped agents as completed immediately with a note. Update each to in_progress when starting, completed when the agent returns.

---

## Step 1: web-restructure

**Skip if** `SKIP_RESTRUCTURE = true`. Mark as completed: "SKIPPED (3-tier structure already exists)"

**If running:**

Tell the user: "Step 1/4: web-restructure — Moving files into 3-tier architecture and cleaning the project root."

Invoke the **@web-restructure** agent. Pass any scope from `$ARGUMENTS`.

**After it returns:**
- Read its handoff for: tier paths, build status, CSS file locations, unknown root items
- If build failed and the agent couldn't fix it: ask the user — "web-restructure encountered a build failure. Retry import fixes, skip to css-improver, or stop?"
- Save the handoff context (tier paths, CSS locations) for Step 2

---

## Step 2: css-improver

**Skip if** `SKIP_CSS = true`. Mark as completed: "SKIPPED (no CSS files found)"

**If running:**

Tell the user: "Step 2/4: css-improver — Consolidating CSS to 5-file architecture and replacing hardcoded values with design tokens."

Invoke the **@css-improver** agent. If web-restructure ran, pass in the context: "CSS files may have moved to `source/01-presentation/styles/`. The project now uses 3-tier architecture."

**After it returns:**
- Read its handoff for: canonical CSS file list, deleted/renamed selectors, token system info
- Save the selector changes for Step 3 (the class-name contract)

---

## Step 3: html-improver

**Skip if** `SKIP_HTML = true`. Mark as completed: "SKIPPED (no HTML/JSX/TSX files found)"

**If running:**

Tell the user: "Step 3/4: html-improver — Replacing div-soup with semantic landmarks, fixing interactive elements, and cleaning class bloat."

Invoke the **@html-improver** agent. If css-improver ran, pass in the context: "css-improver deleted/renamed these selectors: [list from handoff]. In Phase 9 (Class Discipline), do not remove classes that were renamed — only remove classes confirmed as unused."

**After it returns:**
- Read its handoff for: files modified, Tailwind migration status

---

## Step 4: code-improver

**Skip if** `SKIP_CODE = true`. Mark as completed: "SKIPPED (no JS/TS files found)"

**If running:**

Tell the user: "Step 4/4: code-improver — Fixing naming, extracting magic values, flattening nesting, and improving error handling."

Invoke the **@code-improver** agent. If web-restructure ran, pass in the context: "The project uses 3-tier architecture. Source files are in `source/01-presentation/`, `source/02-logic/`, `source/03-data/`."

**After it returns:**
- Read its handoff for: languages, files modified, key metrics

---

## Final Summary

After all agents complete, compile a single report from their handoffs:

```
CLEAN-WEB PIPELINE COMPLETE

Agents:
  web-restructure:  [ran — N commits / SKIPPED]
  css-improver:     [ran — N commits / SKIPPED]
  html-improver:    [ran — N commits / SKIPPED]
  code-improver:    [ran — N commits / SKIPPED]

[Include each agent's before/after summary from their handoff]

Total commits: [N]
```

---

## Error Handling

| Failure | Response |
|---------|----------|
| web-restructure build failure | Ask: retry imports / skip to css / stop |
| css-improver finds nothing to do | Mark "SKIPPED (already clean)", proceed |
| html-improver finds nothing to do | Mark "SKIPPED (already clean)", proceed |
| code-improver mid-phase failure | Report what completed, ask: continue / stop |
| Agent returns no handoff | Proceed without context — next agent's Phase 1 scan will detect the current state |
