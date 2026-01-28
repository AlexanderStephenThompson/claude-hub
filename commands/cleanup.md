---
description: Check project structure, file organization, and overall tidiness
argument-hint: [optional scope — e.g., "src/components" or "root"]
---

# Cleanup

ultrathink

Audit the project structure for cleanliness, organization, and navigability. The goal: someone opening this project for the first time — human or AI — should immediately understand where things live and why.

## Scope
$ARGUMENTS

If no scope specified above, audit the full project. Otherwise, focus on the specified area.

---

## Parallel Audit Architecture

This command uses **parallel sub-agents** for focused, deep analysis. Instead of one agent covering everything shallowly, spawn specialists that each go deep on one structural dimension.

---

### Phase 1: Discovery (Sequential)

Walk the directory tree and build a map of the project. Then answer:

1. **What's the organizing principle?** (By feature? By type? By layer? A mix?)
2. **Is that principle applied consistently?**
3. **Where would someone get lost?**

Gather:
- Full directory tree (excluding node_modules, .git, dist, build, __pycache__)
- File counts by extension
- Total file count

This context is shared with all auditors in Phase 2.

---

### Phase 2: Parallel Auditors

**CRITICAL: Launch ALL 5 auditors in parallel using the Task tool.**

Use a SINGLE message with MULTIPLE Task tool calls (subagent_type="Explore") to run these simultaneously. Pass each auditor the directory tree from Phase 1 and their specific checklist below.

Each auditor returns findings in this format:

```markdown
## [Category] Findings

### Issues Found
- **What**: file(s) or folder(s) affected
- **Why**: what's wrong with current placement or naming
- **Action**: specific move, rename, merge, or delete
- **Effort**: Quick Tidy / Reorganization / Restructuring
```

---

#### Auditor 1: Root & Config

The root is the first impression. It should be clean and intentional.

- Is the root free of stray files? (No orphaned scripts, temp files, leftover configs)
- Are config files necessary and current? (No unused `.eslintrc`, `tsconfig`, etc.)
- Is there a clear entry point? (`README`, `index`, `main` — whatever fits the project)
- Are dotfiles and configs grouped or hidden where possible?
- Is `package.json` (or equivalent) clean? No unused scripts, no leftover dependencies.

---

#### Auditor 2: Folder Structure

The shape of the project should mirror how you think about it.

**Logical Grouping**
- Does the folder structure reflect the project's mental model? (Features, domains, layers — whatever the principle is)
- Are related files co-located? (Component + styles + tests + types live together, not scattered)
- Would you look in this folder first to find this file? If not, it's in the wrong place.

**Depth & Balance**
- Is nesting depth reasonable? No folders three levels deep containing a single file.
- Are there empty or near-empty folders that should be removed or merged?
- Are top-level folders balanced? No single folder with 40 files next to one with 2.

**Naming**
- Do folder names describe what's inside, not how it's used? (`components` not `stuff`, `hooks` not `misc`)
- Is casing consistent across all folders? (all kebab-case, all camelCase — pick one)
- Could you guess what's in a folder from its name alone?

---

#### Auditor 3: File Organization

Every file should have a clear reason to exist and a clear place to live.

**Placement**
- Is every file in the most logical folder for its purpose?
- Are there files that have outgrown their original location? (Started as a utility, now it's core logic)
- Are shared files in a discoverable, predictable location? (`shared/`, `common/`, `utils/` — consistently)

**Splitting & Consolidation**
- Are there files doing too many things that should be split? (500+ lines is a smell)
- Are there tiny files that exist for no good reason and should be merged?
- Are there duplicate or near-duplicate files that should be consolidated?

**Dead Weight**
- Any unused files? (No imports pointing to them, no references anywhere)
- Any leftover generated files, build artifacts, or temp files?
- Any commented-out code blocks that should just be deleted?
- Is `.gitignore` catching everything it should? (No `node_modules`, `dist`, `.env` in the repo)

---

#### Auditor 4: Naming Conventions

Naming is navigation. Consistent naming means you can guess your way through the project.

- Are file names descriptive? Could you understand the purpose without opening the file?
- Is the naming pattern consistent? (If one component is `UserProfile.tsx`, another shouldn't be `profileSettings.tsx`)
- Do file names match their primary export? (`useAuth.ts` exports `useAuth`, not `useAuthentication`)
- Are index files used intentionally? (Clean public APIs, not just re-exporting everything)
- No generic names: `helpers.ts`, `utils.ts`, `misc.ts`, `stuff.ts` — name them by what they actually do.

---

#### Auditor 5: Documentation Placement

Docs should live where you'd look for them.

- Is there a root `README` that orients newcomers to the project?
- Do major folders have a `README` if their purpose isn't obvious from naming alone?
- Are docs co-located with the code they describe, or buried in a separate `/docs` folder nobody checks?
- Is there a single source of truth for project setup and getting started?

---

### Phase 3: Synthesis (Sequential)

After ALL auditors complete:

1. **Collect** all auditor outputs
2. **Deduplicate** overlapping findings (e.g., naming issues found by both Auditor 2 and Auditor 4)
3. **Classify** each finding by effort level
4. **Generate** the final report in the output format below

---

## Output Format

Start with an overview, then actionable findings:

### Project Snapshot
A brief summary of the current structure: what the organizing principle is, how consistently it's applied, and the overall impression.

### Findings

Organize by **effort level**:

1. **Quick Tidies** — Deletes, renames, and moves. Minimal risk.
2. **Reorganization** — Files or folders that need to move or merge. Some imports will need updating.
3. **Restructuring** — Bigger structural changes that affect multiple areas. Worth discussing before doing.

For each finding:

- **What**: the file(s) or folder(s) affected

- **Why**: what's wrong with the current placement or naming

- **Action**: the specific move, rename, merge, or delete

### Example

**Weak finding:**
"The utils folder is messy."

**Strong finding:**

**What**: `src/utils/helpers.ts` (320 lines) and `src/utils/formatters.ts` (180 lines)

**Why**: `helpers.ts` contains date formatting, string formatting, and price formatting — all mixed together. `formatters.ts` duplicates two of those functions.

**Action**: Delete `formatters.ts`. Split `helpers.ts` into `src/utils/format-date.ts`, `src/utils/format-string.ts`, and `src/utils/format-price.ts`. Update 12 import paths.

### Avoid
- Suggesting reorganization for its own sake — every move should make the project easier to navigate
- Proposing folder structures borrowed from other projects that don't fit this one
- Flagging things that are already in the right place just to fill the list
- Treating this as a code review — focus on structure, not logic

---

Finally, ask which findings to implement — offer to start with Quick Tidies, work through Reorganization, or discuss Restructuring first.
