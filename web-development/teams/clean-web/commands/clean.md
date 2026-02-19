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

## Tool Usage — MANDATORY

Use the right tool for each job. **Never use Bash for file operations or text parsing.** Paths with special characters (`&`, spaces, parentheses) will break bash commands silently.

| Task | Use | Never |
|------|-----|-------|
| Find files | **Glob** | `find`, `ls`, `git ls-files` |
| Search file contents | **Grep** | `grep`, `rg`, `cat \| grep` |
| Read files or script output | **Read** | `cat`, `head`, `tail`, `wc -l` |
| Parse/count script results | **Read** the output, then analyze it yourself | `grep -oP`, `sed`, `sort \| uniq -c`, `awk` |
| Git operations | **Bash** | — (correct use) |
| Run scripts (check.js, Python) | **Bash** | — (correct use) |

## Operating Rules

1. **Autonomous execution** — Agents run without interruption unless they hit a true blocker
2. **Commit per phase** — Each agent commits its changes phase by phase before handing off
3. **Skip what doesn't apply** — Detect project shape first, skip agents with no work to do
4. **One question max** — Only ask the user if there's a hard blocker (build failure that can't be auto-fix, ambiguous root items)
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

**1. Check for web source files:**

Use Glob to check if the project has any source files (`.js`, `.ts`, `.jsx`, `.tsx`, `.html`, `.css` — excluding `node_modules/`, `dist/`, `build/`).
- No source files at all → `SKIP_RESTRUCTURE = true`
- Source files exist → `SKIP_RESTRUCTURE = false`

> **Note:** Do NOT skip web-restructure just because 3-tier directories exist. Even with tiers in place, there may be stray files outside the tier structure, files with naming convention violations, reverse-direction imports, or circular dependencies. web-restructure's Phase 1 inventory will detect what (if anything) needs attention.

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
  Source files:      [N found / none — skipping restructure]
  3-tier structure:  [exists — restructure will audit / not found — restructure will create]
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

## Deterministic Scan

Before launching any agent, run the automated scripts to establish a deterministic baseline. These catch exact-match violations that agents should fix, not rediscover.

**Run all scripts sequentially.** Scripts exit non-zero when they find violations — that's expected, not an error. Append `|| true` to every command so the exit code doesn't abort the scan or cancel sibling calls.

Where `<team-scripts>` is the path to this team's `scripts/` directory (resolve from the plugin installation path or the repo).

```bash
node <team-scripts>/check.js --root <project-path> 2>&1 || true
```

```bash
python <team-scripts>/analyze_complexity.py <project-path> 2>&1 || true
```

```bash
python <team-scripts>/analyze_dependencies.py <project-path> 2>&1 || true
```

```bash
python <team-scripts>/detect_dead_code.py <project-path> 2>&1 || true
```

**Run these sequentially, not in parallel.** If any script fails or returns a non-zero exit code when run in parallel, Claude Code cancels the sibling calls (`Sibling tool call errored`). Sequential execution avoids this.

**To parse results:** Read the Bash output directly — you already have it from the tool result. Do NOT re-run the scripts or pipe output through `grep`/`sed`/`awk`/`sort | uniq -c`. Just read the output and categorize the findings yourself.

**Parse results into agent-specific findings:**

| check.js rule category | Pass to |
|------------------------|---------|
| CSS rules (12) + `css-file-count` + `css-file-names` | css-improver |
| HTML rules (11) | html-improver |
| JS rules (10) | code-improver |
| `tier-structure` | web-restructure |

| Python script | Pass to |
|--------------|---------|
| `analyze_complexity.py` (high-complexity functions) | code-improver |
| `analyze_dependencies.py` (circular deps) | web-restructure |
| `detect_dead_code.py` (unused exports) | code-improver |

**Present a summary** to the user:

```
Deterministic scan:
  check.js:    [N] errors, [N] warnings across [N] files
  Complexity:  [N] high-complexity functions found
  Dependencies: [N] circular dependencies found
  Dead code:   [N] unused exports found
```

If check.js or the Python scripts aren't available (e.g., no Node.js or Python installed), skip the deterministic scan and note it: "Deterministic scan skipped — node/python not available. Agents will scan probabilistically."

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

**Skip if** `SKIP_RESTRUCTURE = true`. Mark as completed: "SKIPPED (no source files found)"

**If running:**

Tell the user: "Step 1/4: web-restructure — Moving files into 3-tier architecture and cleaning the project root."

Invoke the **@web-restructure** agent. Pass any scope from `$ARGUMENTS`. If the deterministic scan ran, include: "check.js found these tier-structure violations: [list]. analyze_dependencies.py found these circular dependencies: [list]. Fix these first, then proceed with your normal phases."

**After it returns:**
- Read its handoff for: tier paths, build status, CSS file locations, unknown root items
- If build failed and the agent couldn't fix it: ask the user — "web-restructure encountered a build failure. Retry import fixes, skip to css-improver, or stop?"
- Save the handoff context (tier paths, CSS locations) for Step 2

---

## Step 2: css-improver

**Skip if** `SKIP_CSS = true`. Mark as completed: "SKIPPED (no CSS files found)"

**If running:**

Tell the user: "Step 2/4: css-improver — Consolidating CSS to 5-file architecture and replacing hardcoded values with design tokens."

Invoke the **@css-improver** agent. If web-restructure ran, pass in the context: "CSS files may have moved to `source/01-presentation/styles/`. The project now uses 3-tier architecture." If the deterministic scan ran, include: "check.js found these CSS violations: [list the 12 CSS rule findings + css-file-count + css-file-names]. Fix these deterministic findings first, then proceed with your normal phases."

**After it returns:**
- Read its handoff for: canonical CSS file list, deleted/renamed selectors, token system info
- Save the selector changes for Step 3 (the class-name contract)

---

## Step 3: html-improver

**Skip if** `SKIP_HTML = true`. Mark as completed: "SKIPPED (no HTML/JSX/TSX files found)"

**If running:**

Tell the user: "Step 3/4: html-improver — Replacing div-soup with semantic landmarks, fixing interactive elements, and cleaning class bloat."

Invoke the **@html-improver** agent. If css-improver ran, pass in the context: "css-improver deleted/renamed these selectors: [list from handoff]. In Phase 9 (Class Discipline), do not remove classes that were renamed — only remove classes confirmed as unused." If the deterministic scan ran, include: "check.js found these HTML violations: [list the 11 HTML rule findings]. Fix these deterministic findings first, then proceed with your normal phases."

**After it returns:**
- Read its handoff for: files modified, Tailwind migration status

---

## Step 4: code-improver

**Skip if** `SKIP_CODE = true`. Mark as completed: "SKIPPED (no JS/TS files found)"

**If running:**

Tell the user: "Step 4/4: code-improver — Fixing naming, extracting magic values, flattening nesting, and improving error handling."

Invoke the **@code-improver** agent. If web-restructure ran, pass in the context: "The project uses 3-tier architecture. Source files are in `source/01-presentation/`, `source/02-logic/`, `source/03-data/`." If the deterministic scan ran, include: "check.js found these JS violations: [list the 10 JS rule findings]. analyze_complexity.py found these high-complexity functions: [list]. detect_dead_code.py found these unused exports: [list]. Fix these deterministic findings first, then proceed with your normal phases."

**After it returns:**
- Read its handoff for: languages, files modified, key metrics

---

## Final Summary

After all agents complete, compile a single report from their handoffs:

```
CLEAN-WEB PIPELINE COMPLETE

Deterministic scan:
  check.js:         [N] errors, [N] warnings → [N] fixed by agents
  Complexity:       [N] high-complexity functions → [N] addressed
  Dependencies:     [N] circular deps → [N] resolved
  Dead code:        [N] unused exports → [N] removed

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
