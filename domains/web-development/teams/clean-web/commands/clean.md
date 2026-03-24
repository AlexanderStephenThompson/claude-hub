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

**Never use Bash for file operations or text parsing.** Paths with `&`, spaces, or parentheses break bash silently.

| Task | Correct Tool | BANNED — never use these |
|------|-------------|-----------------------------|
| Find/list files or directories | **Glob** | `find`, `ls`, `ls -la`, `git ls-files`, `git ls-tree` |
| Search file contents | **Grep** | `grep`, `rg`, `cat \| grep`, `git ls-files \| grep` |
| Read a file or script output | **Read** | `cat`, `head`, `tail`, `git show`, `git diff`, `git cat-file` |
| Count files or lines | **Glob** (count results) / **Read** | `wc -l`, `git ls-files \| wc -l`, `\| wc -l` |
| Parse/count script results | **Read** the output, then analyze it yourself | `grep -oP`, `sed`, `sort \| uniq -c`, `awk` |

**Bash is ONLY for these operations — nothing else:**
- `git add`, `git commit` (actual git write operations)
- `node check.js`, `python scripts/*.py` (run analysis scripts)
- `node sort-css-properties.js <path>` (CSS property sorter)
- `node unit-zero.js <path>` (strip redundant units from zero)
- `node fix-imports-order.js <path>` (reorder CSS imports to cascade order)
- `node scaffold-css.js <path>` (copy 5 template CSS files to target directory)
- `node strip-debug.js <path>` (remove console/debugger statements)
- `node fix-double-equals.js <path>` (== to ===, != to !==)
- `node fix-var.js <path>` (var to let)
- `npm run build`, `npm run test`, `npm run validate` (run project commands)

**Never write automation scripts** (`.js`, `.py`, `.sh`) to process files in bulk. Agents CAN run pre-built team scripts that ship with the pipeline.

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
| CSS rules (14) + `css-file-count` + `css-file-names` | css-improver |
| HTML rules (10) | html-improver |
| JS rules (8) | code-improver |
| `tier-structure` + `tier-imports` | web-restructure |

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

## Deterministic Pre-Fix

After scanning, run all mechanical fix scripts **before** any agent launches. These are zero-judgment fixes that would otherwise waste agent context rediscovering what scripts can handle deterministically.

**Scope resolution:** All pre-fix scripts handle recursive file discovery internally. Pass the project root as `<project-source-directory>` and `<project-css-directory>` — the scripts will find `.js`/`.ts`/`.css` files wherever they are, even before web-restructure has organized them.

**Run sequentially**, same as the scan. Append `|| true` to each command.

```bash
node <team-scripts>/strip-debug.js <project-source-directory> 2>&1 || true
```

```bash
node <team-scripts>/fix-var.js <project-source-directory> 2>&1 || true
```

```bash
node <team-scripts>/fix-double-equals.js <project-source-directory> 2>&1 || true
```

```bash
node <team-scripts>/unit-zero.js <project-css-directory> 2>&1 || true
```

These handle:
- `strip-debug.js` — removes `console.log`, `console.debug`, `console.warn`, `debugger`
- `fix-var.js` — converts `var` to `let`
- `fix-double-equals.js` — converts `==` to `===`, `!=` to `!==`
- `unit-zero.js` — replaces `0px`, `0em`, `0rem` with unitless `0`

**Read** the output of each script to confirm what was changed. If any script modified files, stage and commit once:

```bash
git add -A && git commit -m "fix: apply deterministic pre-fixes (debug, var, ===, unit-zero)"
```

If no scripts made changes, skip the commit.

**Re-scan** to establish the post-pre-fix baseline. This is what agents will work from — only violations that require judgment remain.

If the initial scan was skipped (check.js not available), skip the re-scan too. Pre-fix scripts still run (they don't depend on check.js), but there's no deterministic baseline to pass to agents — they'll detect issues probabilistically in their supplementary scans.

**If check.js is available:**

```bash
node <team-scripts>/check.js --root <project-path> 2>&1 || true
```

**Present the delta** to the user:

```
Deterministic pre-fix:
  Scripts run:     4 (strip-debug, fix-var, fix-double-equals, unit-zero)
  Files modified:  [N] files across [N] scripts
  Commit:          [hash] (or "no changes")

Remaining violations (for agents):
  check.js:    [N] errors, [N] warnings across [N] files
```

The remaining violations are what gets passed to agents. Use these post-pre-fix numbers (not the original scan numbers) in all agent invocations.

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

Invoke the **@web-restructure** agent. Pass any scope from `$ARGUMENTS`. If the deterministic scan ran, include: "check.js found these tier-structure violations (post-pre-fix): [list]. analyze_dependencies.py found these circular dependencies: [list]. Fix these first, then proceed with your normal phases."

**After it returns:**

Parse its structured handoff fields:
- `TIER_PATHS` — which tier directories were created/confirmed
- `BUILD_STATUS` — PASS or FAIL (and what failed)
- `CSS_LOCATIONS` — where CSS files now live (needed by css-improver)
- `UNKNOWN_ROOT_ITEMS` — items flagged for user decision
- `FILES_MOVED` / `IMPORTS_UPDATED` — counts for final summary

If `BUILD_STATUS` is FAIL and the agent couldn't fix it: ask the user — "web-restructure encountered a build failure. Retry import fixes, skip to css-improver, or stop?"

Save `TIER_PATHS` and `CSS_LOCATIONS` for Step 2.

---

## Step 2: css-improver

**Skip if** `SKIP_CSS = true`. Mark as completed: "SKIPPED (no CSS files found)"

**If running:**

Tell the user: "Step 2/4: css-improver — Consolidating CSS to 5-file architecture and replacing hardcoded values with design tokens."

Invoke the **@css-improver** agent. If web-restructure ran, pass in the context: "CSS files may have moved to `source/01-presentation/styles/`. The project now uses 3-tier architecture." If web-restructure was SKIPPED, pass: "web-restructure was skipped. Source files remain in their original structure. Detect CSS file locations in your Phase 1 inventory." Include: "The orchestrator already ran `unit-zero.js` — zero values are clean. Don't re-run it." If the deterministic scan ran, include: "check.js found these CSS violations (post-pre-fix): [list the 14 CSS rule findings + css-file-count + css-file-names]. Fix these remaining findings first, then proceed with your normal phases."

**After it returns:**

Parse its structured handoff fields:
- `CSS_FILES` — canonical file paths (the 5-file list) → forward to Step 3 context
- `SELECTORS_DELETED` — class names removed (merged into others) → **forward to Step 3**
- `SELECTORS_RENAMED` — old → new name mappings → **forward to Step 3**
- `TOKEN_SYSTEM` — whether `:root` tokens exist and naming convention → save for summary
- `TOKENS_ADDED` — count of new CSS variables → save for summary
- `DEAD_CSS_REMOVED` — count of selectors removed → save for summary
- `NEAR_DUPLICATES_MERGED` — count of groups unified → save for summary

---

## Step 3: html-improver

**Skip if** `SKIP_HTML = true`. Mark as completed: "SKIPPED (no HTML/JSX/TSX files found)"

**If running:**

Tell the user: "Step 3/4: html-improver — Replacing div-soup with semantic landmarks, fixing interactive elements, and cleaning class bloat."

Invoke the **@html-improver** agent. If css-improver ran, pass in the context: "css-improver deleted/renamed these selectors: `SELECTORS_DELETED`: [list], `SELECTORS_RENAMED`: [list]. In Phase 9 (Class Discipline), do not remove classes that were renamed — only remove classes confirmed as unused." If the deterministic scan ran, include: "check.js found these HTML violations (post-pre-fix): [list the 11 HTML rule findings]. Fix these remaining findings first, then proceed with your normal phases."

**After it returns:**

Parse its structured handoff fields:
- `FILES_MODIFIED` — count of HTML/JSX/TSX files changed → save for summary
- `TAILWIND_MIGRATION` — whether utility chains were extracted to CSS → save for summary
- `REMAINING_CLASS_BLOAT` — elements still above 3 classes → save for summary
- `LANDMARKS_ADDED` — count of semantic elements added → save for summary
- `BUTTONS_FIXED` — count of div→button conversions + types added → save for summary
- `LABELS_ADDED` — count of form labels added → save for summary

---

## Step 4: code-improver

**Skip if** `SKIP_CODE = true`. Mark as completed: "SKIPPED (no JS/TS files found)"

**If running:**

Tell the user: "Step 4/4: code-improver — Fixing naming, extracting magic values, flattening nesting, and improving error handling."

Invoke the **@code-improver** agent. If web-restructure ran, pass in the context: "The project uses 3-tier architecture. Source files are in `source/01-presentation/`, `source/02-logic/`, `source/03-data/`." If web-restructure was SKIPPED, pass: "web-restructure was skipped. Source files remain in their original structure." Include: "The orchestrator already ran `strip-debug.js`, `fix-var.js`, and `fix-double-equals.js` — debug statements, `var`, and `==` are clean. Don't re-run these scripts." If the deterministic scan ran, include: "check.js found these JS violations (post-pre-fix): [list the 8 JS rule findings]. analyze_complexity.py found these high-complexity functions: [list]. detect_dead_code.py found these unused exports: [list]. Fix these remaining findings first, then proceed with your normal phases."

**After it returns:**

Parse its structured handoff fields:
- `LANGUAGES` — detected languages → save for summary
- `FILES_MODIFIED` — total count → save for summary
- `NAMES_IMPROVED` — count of variables/functions renamed → save for summary
- `CONSTANTS_EXTRACTED` — count of magic values named → save for summary
- `DEAD_CODE_REMOVED` — lines of dead code removed → save for summary
- `FUNCTIONS_EXTRACTED` — count of new focused functions → save for summary
- `ERRORS_FIXED` — count of catch blocks improved → save for summary
- `DOCSTRINGS_ADDED` — count of public APIs documented → save for summary

---

## Post-Pipeline Verification

After all agents complete, re-run `check.js` to verify the pipeline actually fixed what it claimed.

If check.js wasn't available (initial scan was skipped), skip this entire section. Report: "Post-pipeline verification skipped — check.js not available." Jump to Final Summary using only agent handoff data.

**If check.js is available:**

```bash
node <team-scripts>/check.js --root <project-path> 2>&1 || true
```

**Compare three snapshots:**

| Snapshot | When | Purpose |
|----------|------|---------|
| Initial scan | Before pre-fix scripts | Total violations found |
| Post-pre-fix | After scripts, before agents | What scripts fixed mechanically |
| Post-pipeline | After all agents | What agents fixed with judgment |

**What to report:**
- **Fixed by scripts:** Initial − Post-pre-fix counts
- **Fixed by agents:** Post-pre-fix − Post-pipeline counts
- **Regressions:** Any rule that has MORE violations in post-pipeline than post-pre-fix (agents introduced new violations)
- **Unfixed:** Remaining violations in post-pipeline

If regressions exist, list them explicitly — these are bugs agents introduced and should be called out.

---

## Final Summary

After verification, compile a single report from the three snapshots and agent handoffs:

```
CLEAN-WEB PIPELINE COMPLETE

Deterministic results (check.js):
                     Initial → Post-Pre-Fix → Post-Pipeline
  Errors:            [N]        [N]             [N]
  Warnings:          [N]        [N]             [N]
  Fixed by scripts:  [N]
  Fixed by agents:   [N]
  Regressions:       [N] (list any rules that got worse)
  Remaining:         [N]

Pre-fix scripts:
  strip-debug:       [N files changed / no changes]
  fix-var:           [N files changed / no changes]
  fix-double-equals: [N files changed / no changes]
  unit-zero:         [N files changed / no changes]

Analysis scripts:
  Complexity:        [N] high-complexity functions → [N] addressed by code-improver
  Dependencies:      [N] circular deps → [N] resolved by web-restructure
  Dead code:         [N] unused exports → [N] removed by code-improver

Agents:
  web-restructure:   [ran — N commits / SKIPPED]
  css-improver:      [ran — N commits / SKIPPED]
  html-improver:     [ran — N commits / SKIPPED]
  code-improver:     [ran — N commits / SKIPPED]

[Include each agent's before/after summary from their handoff]

Total commits: [N] (1 pre-fix + [N] agent commits)
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
