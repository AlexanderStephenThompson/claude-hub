---
description: Clean a data project -- restructure, SQL, Python, then pipeline/IaC
argument-hint: [scope] -- optional directory, e.g., "etl/"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Task
---

# /clean-data:clean

A 4-agent pipeline that takes a data project from messy to clean:

```
data-restructure -> sql-improver -> python-improver -> pipeline-improver
```

Each agent runs its full phase sequence, commits after each phase, and writes a handoff summary for the next agent. Agents that don't apply are skipped automatically.

## Arguments

$ARGUMENTS

---

## Tool Usage -- MANDATORY

**Never use Bash for file operations or text parsing.**

| Task | Correct Tool | BANNED |
|------|-------------|--------|
| Find/list files | **Glob** | `find`, `ls`, `git ls-files` |
| Search file contents | **Grep** | `grep`, `rg`, `cat \| grep` |
| Read a file | **Read** | `cat`, `head`, `tail` |
| Count files or lines | **Glob** / **Read** | `wc -l` |
| Parse script results | **Read** the output | `grep -oP`, `sed`, `sort \| uniq -c`, `awk` |

**Bash is ONLY for:**
- `git add`, `git commit` (git write operations)
- `python check_data.py`, `python strip_print.py`, `python fix_sql_keywords.py`, `python fix_bare_except.py`, `python fix_hardcoded_dates.py` (run scripts)
- `pip install`, `python -m pytest` (run project commands)

### Bash Output Handling

Bash commands may run in the background. When this happens:
- **Wait for the task completion notification** before reading results. It arrives automatically.
- **Do NOT** repeatedly Read the output file to poll — you will get empty reads and waste turns.
- **Do NOT** run additional bash commands (`sleep`, `cat`, `type`) to check on the first one — they queue behind it.
- Run bash commands **one at a time** for scripts. Do not queue the next script until the previous one's notification arrives.

## Operating Rules

1. **Autonomous execution** -- Agents run without interruption unless they hit a true blocker
2. **Commit per phase** -- Each agent commits changes phase by phase
3. **Skip what doesn't apply** -- Detect project shape first, skip irrelevant agents
4. **One question max** -- Only ask for hard blockers
5. **Pass context forward** -- Extract key facts from each agent's handoff
6. **Don't change behavior** -- Every agent preserves existing functionality

---

## Prerequisite Check

### Git Status

```bash
git status --porcelain
```

- **No git?** Initialize: `git init` + initial commit
- **Uncommitted changes?** Warn and ask whether to proceed.

---

## Project Shape Detection

**1. Check for source files:**

Use Glob for `.py`, `.sql`, `.tf`, `.yaml` files (excluding `node_modules/`, `.git/`, `__pycache__/`, `.venv/`).
- No source files -> stop: "No data project files found."

**2. Check for SQL files:**

```
Glob: **/*.sql (exclude __pycache__/, .venv/, .git/)
```
- Count = 0 -> `SKIP_SQL = true`
- Count > 0 -> `SKIP_SQL = false`

**3. Check for Python files:**

```
Glob: **/*.py (exclude __pycache__/, .venv/, .git/)
```
- Count = 0 -> `SKIP_PYTHON = true`
- Count > 0 -> `SKIP_PYTHON = false`

**4. Check for pipeline/IaC files:**

```
Glob: **/*.tf, **/dags/*.py, **/*.yaml (exclude __pycache__/, .venv/, .git/)
```
- Count = 0 -> `SKIP_PIPELINE = true`
- Count > 0 -> `SKIP_PIPELINE = false`

### Present Detection Results

```
Project shape:
  SQL files:       [N found / none -- skipping sql-improver]
  Python files:    [N found / none -- skipping python-improver]
  Pipeline/IaC:    [N found / none -- skipping pipeline-improver]

Pipeline:
  [1] data-restructure:  [WILL RUN / SKIP]
  [2] sql-improver:      [WILL RUN / SKIP]
  [3] python-improver:   [WILL RUN / SKIP]
  [4] pipeline-improver: [WILL RUN / SKIP]
```

If ALL agents would be skipped, report "Nothing to clean." and stop.

---

## Deterministic Scan

Run check_data.py to establish a deterministic baseline.

```bash
python <team-scripts>/check_data.py --root <project-path> 2>&1 || true
```

If check_data.py isn't available (no Python installed), skip the scan: "Deterministic scan skipped. Agents will scan probabilistically."

**Parse results into agent-specific findings:**

| check_data.py rule category | Pass to |
|------------------------------|---------|
| Structure rules (4): `data-layer-structure`, `dag-naming`, `config-separation`, `test-presence` | data-restructure |
| SQL rules (7): `no-select-star`, `cte-for-complex`, `no-function-on-index`, `prefer-window-function`, `no-implicit-join`, `upsert-pattern`, `explicit-column-types` | sql-improver |
| Python rules (10): `no-iterrows`, `no-chained-indexing`, `explicit-dtypes`, `schema-validation`, `boto3-outside-handler`, `no-hardcoded-dates`, `no-print-logging`, `idempotent-writes`, `no-bare-except`, `no-secrets` | python-improver |
| Pipeline/IaC rules (6): `remote-state`, `required-tags`, `no-hardcoded-values`, `s3-hive-partitions`, `parquet-format`, `config-separation` | pipeline-improver |

Note: `config-separation` is relevant to both data-restructure (moves config files) and pipeline-improver (parameterizes values). Pass to both.

**Present a summary:**

```
Deterministic scan:
  check_data.py: [N] errors, [N] warnings across [N] files
```

---

## Deterministic Pre-Fix

Run mechanical fix scripts before agents launch.

**Scope resolution:** Both scripts handle recursive file discovery. Pass the project root.

**Run sequentially.** Append `|| true` to each command.

```bash
python <team-scripts>/strip_print.py <project-root> 2>&1 || true
```

```bash
python <team-scripts>/fix_sql_keywords.py <project-root> 2>&1 || true
```

```bash
python <team-scripts>/fix_bare_except.py <project-root> 2>&1 || true
```

```bash
python <team-scripts>/fix_hardcoded_dates.py <project-root> 2>&1 || true
```

If any script modified files, commit once:

```bash
git add -A && git commit -m "fix: apply deterministic pre-fixes (print removal, SQL keywords, bare excepts, hardcoded dates)"
```

If no changes, skip the commit.

**If check_data.py is available, re-scan:**

```bash
python <team-scripts>/check_data.py --root <project-path> 2>&1 || true
```

If the initial scan was skipped (check_data.py not available), skip the re-scan too.

**Present the delta:**

```
Deterministic pre-fix:
  Scripts run:     4 (strip-print, fix-sql-keywords, fix-bare-except, fix-hardcoded-dates)
  Files modified:  [N] files
  Commit:          [hash] (or "no changes")

Remaining violations (for agents):
  check_data.py: [N] errors, [N] warnings across [N] files
```

Use post-pre-fix numbers in all agent invocations.

---

## Progress Tracking

```
[ ] data-restructure  -- project layout + config separation
[ ] sql-improver      -- query optimization + idempotency
[ ] python-improver   -- vectorization, dtypes, error handling
[ ] pipeline-improver -- pipeline patterns + IaC
```

---

## Step 1: data-restructure

**Skip if** no source files found. Mark: "SKIPPED"

**If running:**

Tell the user: "Step 1/4: data-restructure -- Organizing project into proper layer structure."

Invoke **@data-restructure**. Pass scope from `$ARGUMENTS`. Always include the deterministic findings — if the scan ran, pass: "check_data.py found these structure violations (post-pre-fix): [list]. Fix these first, then proceed." If the scan was skipped, pass: "Deterministic scan was not available. No check_data.py baseline exists. Your Phase 1 inventory is the sole authority — run every phase fully with no reduced scope."

**After it returns:**

Parse structured handoff fields:
- `LAYER_PATHS` -- directories created/confirmed -> forward to Steps 2-4
- `SQL_LOCATIONS` -- where SQL files now live -> **forward to Step 2**
- `PYTHON_LOCATIONS` -- where Python files now live -> **forward to Step 3**
- `FRAMEWORK` -- detected framework -> forward to all agents
- `BUILD_STATUS` -- PASS or FAIL
- `FILES_MOVED` / `IMPORTS_UPDATED` -- save for summary
- `UNKNOWN_ROOT_ITEMS` -- items for user decision

---

## Step 2: sql-improver

**Skip if** `SKIP_SQL = true`. Mark: "SKIPPED (no SQL files)"

**If running:**

Tell the user: "Step 2/4: sql-improver -- Optimizing queries, adding CTEs, fixing joins."

Invoke **@sql-improver**. If data-restructure ran, pass: "SQL files are in [SQL_LOCATIONS]. Project uses [FRAMEWORK]." If data-restructure was SKIPPED, pass: "data-restructure was skipped. Detect SQL file locations in Phase 1." Include: "The orchestrator already ran `fix_sql_keywords.py` -- keywords are uppercased. Don't re-run it." Always include the deterministic findings — if the scan ran, pass: "check_data.py found these SQL violations (post-pre-fix): [list]. Fix these first." If the scan was skipped, pass: "Deterministic scan was not available. Your Phase 1 supplementary scan is the sole authority — fix every violation it finds with no reduced scope."

**After it returns:**

Parse structured handoff fields:
- `FILES_MODIFIED` -> save for summary
- `SELECT_STAR_FIXED` -> save for summary
- `CTES_ADDED` -> save for summary
- `JOINS_OPTIMIZED` -> save for summary
- `UPSERTS_ADDED` -> save for summary
- `QUERIES_FORMATTED` -> save for summary

---

## Step 3: python-improver

**Skip if** `SKIP_PYTHON = true`. Mark: "SKIPPED (no Python files)"

**If running:**

Tell the user: "Step 3/4: python-improver -- Vectorizing, adding schemas, fixing error handling."

Invoke **@python-improver**. If data-restructure ran, pass: "Python files are in [PYTHON_LOCATIONS]. Project uses [FRAMEWORK]." If data-restructure was SKIPPED, pass: "data-restructure was skipped. Detect file locations in Phase 1." Include: "The orchestrator already ran `strip_print.py`, `fix_bare_except.py`, and `fix_hardcoded_dates.py` -- print statements, bare excepts, and hardcoded dates are clean. Don't re-run them." Always include the deterministic findings — if the scan ran, pass: "check_data.py found these Python violations (post-pre-fix): [list]. Fix these first." If the scan was skipped, pass: "Deterministic scan was not available. Your Phase 1 supplementary scan is the sole authority — fix every violation it finds with no reduced scope."

**After it returns:**

Parse structured handoff fields:
- `FILES_MODIFIED` -> save for summary
- `ITERROWS_REMOVED` -> save for summary
- `SCHEMAS_ADDED` -> save for summary
- `DTYPES_ADDED` -> save for summary
- `PRINTS_REPLACED` -> save for summary
- `EXCEPTS_FIXED` -> save for summary
- `BOTO3_MOVED` -> save for summary

---

## Step 4: pipeline-improver

**Skip if** `SKIP_PIPELINE = true`. Mark: "SKIPPED (no pipeline/IaC files)"

**If running:**

Tell the user: "Step 4/4: pipeline-improver -- Fixing idempotency, quality gates, IaC patterns."

Invoke **@pipeline-improver**. If data-restructure ran, pass: "Project uses [FRAMEWORK]. Files are organized in [LAYER_PATHS]." If data-restructure was SKIPPED, pass: "data-restructure was skipped. Detect structure in Phase 1." Always include the deterministic findings — if the scan ran, pass: "check_data.py found these pipeline/IaC violations (post-pre-fix): [list]. Fix these first." If the scan was skipped, pass: "Deterministic scan was not available. Your Phase 1 supplementary scan is the sole authority — fix every violation it finds with no reduced scope."

**After it returns:**

Parse structured handoff fields:
- `FILES_MODIFIED` -> save for summary
- `IDEMPOTENCY_FIXES` -> save for summary
- `QUALITY_GATES_ADDED` -> save for summary
- `PARAMS_EXTRACTED` -> save for summary
- `TAGS_ADDED` -> save for summary
- `SECRETS_REMOVED` -> save for summary
- `PARTITIONS_FIXED` -> save for summary

---

## Post-Pipeline Verification

After all agents complete, re-run check_data.py to verify.

If check_data.py wasn't available (initial scan was skipped), skip this section. Report: "Post-pipeline verification skipped -- check_data.py not available." Jump to Final Summary.

**If check_data.py is available:**

```bash
python <team-scripts>/check_data.py --root <project-path> 2>&1 || true
```

**Compare three snapshots:**

| Snapshot | When | Purpose |
|----------|------|---------|
| Initial scan | Before pre-fix scripts | Total violations found |
| Post-pre-fix | After scripts, before agents | What scripts fixed |
| Post-pipeline | After all agents | What agents fixed |

**Report:**
- **Fixed by scripts:** Initial - Post-pre-fix counts
- **Fixed by agents:** Post-pre-fix - Post-pipeline counts
- **Regressions:** Rules with MORE violations post-pipeline than post-pre-fix
- **Unfixed:** Remaining violations

---

## Final Summary

```
CLEAN-DATA PIPELINE COMPLETE

Deterministic results (check_data.py):
                     Initial -> Post-Pre-Fix -> Post-Pipeline
  Errors:            [N]        [N]             [N]
  Warnings:          [N]        [N]             [N]
  Fixed by scripts:  [N]
  Fixed by agents:   [N]
  Regressions:       [N]
  Remaining:         [N]

Pre-fix scripts:
  strip-print:       [N files changed / no changes]
  fix-sql-keywords:  [N files changed / no changes]
  fix-bare-except:   [N files changed / no changes]
  fix-hardcoded-dates: [N files changed / no changes]

Agents:
  data-restructure:  [ran -- N commits / SKIPPED]
  sql-improver:      [ran -- N commits / SKIPPED]
  python-improver:   [ran -- N commits / SKIPPED]
  pipeline-improver: [ran -- N commits / SKIPPED]

[Include each agent's key metrics from handoff]

Total commits: [N]
```

---

## Error Handling

| Failure | Response |
|---------|----------|
| data-restructure import failure | Ask: retry / skip to sql-improver / stop |
| sql-improver finds nothing to do | Mark "SKIPPED (already clean)", proceed |
| python-improver finds nothing to do | Mark "SKIPPED (already clean)", proceed |
| pipeline-improver mid-phase failure | Report what completed, ask: continue / stop |
| Agent returns no handoff | **WARN the next agent explicitly.** Pass: "[previous-agent] returned no structured handoff. Handoff-dependent decisions must use your own Phase 1 scan — do not assume prior work was completed." Never silently proceed as if the handoff was empty. |
