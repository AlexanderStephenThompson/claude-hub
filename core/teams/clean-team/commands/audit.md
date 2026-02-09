---
description: Run a standalone codebase audit with parallel sub-agents and optional focus area
argument-hint: [focus — e.g., "structure", "css", "a11y", "perf", or leave empty for full scan]
allowed-tools: Read, Grep, Glob, Bash, Task, Write
---

# /clean-team:audit

A standalone audit doesn't clean or refactor — it tells you the truth about your codebase so you can decide what to do next. Without an honest inventory, you're guessing about where the debt is, how bad it is, and what to fix first. The audit produces specific findings with IDs, locations, and prioritized recommendations. This report becomes the input for `/clean-team:refactor`, so the audit work directly drives the next phase of improvement.

This command uses **parallel sub-agents** for deep, focused analysis. Instead of one agent trying to cover everything, it spawns specialized auditors that run simultaneously — each doing a dedicated deep dive on their domain, then consolidating into one prioritized report.

## Usage

```
/clean-team:audit              → Full scan across all categories
/clean-team:audit css          → Focus on CSS/styling issues
/clean-team:audit a11y         → Focus on accessibility
/clean-team:audit perf         → Focus on performance
/clean-team:audit structure    → Focus on file organization (expands to 5 sub-auditors)
/clean-team:audit security     → Focus on security patterns
/clean-team:audit testing      → Focus on test coverage and patterns
```

---

## Focus Mode

$ARGUMENTS

**If a focus area is provided:**
1. Still perform the full audit across all categories
2. Give extra attention and depth to the focus area
3. Prioritize focus-related findings higher in the report
4. Add a dedicated "Focus Area Deep Dive" section

**If no focus is provided:**
- Perform a balanced audit across all categories
- Prioritize by impact-to-effort ratio

**Universal focus areas:** structure, security, testing, documentation, type-safety, error-handling

**Web focus areas** (require web stack detection): css, a11y, perf, react, graphql

---

## Workflow

### Phase 1: Discovery & Stack Detection

**Map the project and detect the tech stack:**

Use dedicated tools (Glob, Grep, Read) instead of shell commands for cross-platform compatibility:

```
# Map the project structure (use Glob tool)
Glob: **/*  → review top-level folders and file types

# Count files by type (use Glob tool with specific patterns)
Glob: **/*.js, **/*.ts, **/*.tsx, **/*.jsx
Glob: **/*.css, **/*.html
Glob: **/*.py, **/*.cs
```

**Project type detection:** Read `~/.claude/skills/architecture/SKILL.md` to find available profiles under "Project Type Profiles." Match detected files against detection hints, then load the matching profile from `~/.claude/skills/architecture/references/`.

**Web stack detection:** Check for CSS, HTML, JSX, React, Apollo, Prisma. If found, read `assets/audit-checklists/web.md` for web-specific audit checklists.

---

### Phase 2: Launch Parallel Auditors

**Read `assets/parallel-audit-roster.md`** for the full sub-agent roster, launch instructions, return format, and consolidation steps.

**Always launch the 4 core auditors** with checklists from `assets/audit-checklists/core.md`.

**If web stack detected, also launch web auditors** with checklists from `assets/audit-checklists/web.md`. Only launch auditors relevant to the detected stack (see roster for mapping).

**If focus = `structure`:** Follow the structure focus mode in the roster — replace File Organization Auditor (#1) with 5 specialized structure auditors from `assets/audit-checklists/structure.md`.

**If a focus area was specified:** All auditors still run, but give extra depth to the focus area and prioritize its findings higher in the final report.

---

### Phase 3: Consolidate Reports

Follow the consolidation instructions in `assets/parallel-audit-roster.md`: collect all sub-agent outputs, deduplicate, re-prioritize, assign AUDIT-NNN IDs, and generate the final report.

---

## Report Template

**CRITICAL:** Use the **Write tool** to create the report file. Never use Bash heredocs (`cat <<EOF`), shell redirects, or Python scripts — these fail on Windows paths with spaces.

Save the report to: `./AUDIT-REPORT-[YYYY-MM-DD].md`

**CRITICAL:** Every finding MUST have a unique `AUDIT-NNN` ID. These IDs enable the clean-team refactoring agents to reference, track, and report remediation status.

```markdown
# Project Audit Report
Generated: [date]
Project: [name from package.json or folder]

## Executive Summary
[2-3 sentences on overall project health and top priorities]

## Detected Stack
- **Frontend:** [React, Vue, etc. or N/A]
- **API:** [GraphQL, REST, etc. or N/A]
- **ORM:** [Prisma, etc. or N/A]
- **Styling:** [CSS, Tailwind, etc. or N/A]
- **Language:** [TypeScript, JavaScript, Python, etc.]

## Focus Area: [area] (if specified)
[Deep analysis of the specified focus area with detailed findings and recommendations]

## Quick Stats
- Total files analyzed: X
- Lines of code: ~X
- Primary language: X
- Key frameworks: X

## Critical Issues (Fix First)
[Issues that actively cause problems or block progress]

### AUDIT-001: [Name]
- **Priority:** Critical
- **Category:** [Naming / Structure / Testing / Documentation / Error Handling / Performance / Security]
- **Location:** path/to/file
- **Problem:** [specific description]
- **Impact:** [why this matters]
- **Recommendation:** [specific action]
- **Effort:** Low/Medium/High

## High Priority (Major Improvements)

### AUDIT-NNN: [Name]
- **Priority:** High
- **Location:** [path]
- **Problem:** [description]
- **Recommendation:** [action]
- **Effort:** Low/Medium/High

## Medium Priority (Moderate Improvements)

### AUDIT-NNN: [Name]
...

## Low Priority (Future Consideration)

### AUDIT-NNN: [Name]
...

---

## Suggested File Renames
| Current | Proposed | Reason |
|---------|----------|--------|
| ... | ... | ... |

## Suggested Moves
| File | From | To | Reason |
|------|------|-----|--------|
| ... | ... | ... | ... |

## Suggested New Structure
[If major restructuring is recommended, show proposed tree]

## Files to Split
| File | Lines | Suggested Split |
|------|-------|-----------------|
| ... | ... | ... |

## Dead Code Candidates
[Files/exports that appear unused - verify before deleting]

## Duplicate Code
[Similar patterns found in multiple places]

---

## Critical Paths
**For Tester consumption.**

Areas that MUST have test coverage before refactoring:
1. [Module/function — why it's critical]
2. [Module/function — why it's critical]

## Prioritized Recommendations
**For Planner consumption.**

### High Priority
1. [Most important improvement with reasoning]

### Medium Priority
1. [Moderate impact improvement]

### Low Priority
1. [Nice-to-have]

## Flagged for User Review

Items that need human decision before refactoring:
- [ ] [Item 1 — why it needs user input]
- [ ] [Item 2 — why it needs user input]

---

## Next Steps

1. Review this report
2. Address any flagged items above
3. Run `/clean-team:clean` for the full pipeline, or `/clean-team:refactor [path] [focus]` to refactor

## Appendix: Full File List
[Collapsible section with complete file tree]
```

---

## Flow Diagram

```
/clean-team:audit [focus]
         |
         v
+-----------------+
|   Discovery &   |  Map project, detect stack, load checklists
| Stack Detection |
+--------+--------+
         |
         v
+-----------------+
| Launch Parallel |  4 core + up to 5 structure + up to 8 web auditors
|   Sub-Agents    |  (all running simultaneously)
+--------+--------+
         |
         v
+-----------------+
|  Consolidate &  |  Dedup, re-prioritize, assign AUDIT-NNN IDs
| Generate Report |
+--------+--------+
         |
         v
  AUDIT-REPORT-[date].md
         |
    User reviews
         |
         v
  /clean-team:clean or /clean-team:refactor
```

---

## Guidelines

1. **Be specific** — Don't say "improve naming." Say "Rename `utils.js` to `string-formatters.js` because it only contains string formatting functions."
2. **Prioritize ruthlessly** — Focus on changes with the highest impact-to-effort ratio.
3. **Respect existing patterns** — Recommend extending conventions, not replacing them.
4. **Consider the team** — Only recommend changes that genuinely help.
5. **No implementation** — Analysis only. The clean-team handles execution.
6. **Check for context** — Look for ARCHITECTURE.md, CONTRIBUTING.md, or similar docs that explain intentional decisions.
7. **Do NOT delete the report** — It's a deliverable the user expects to keep, not a temporary artifact.
