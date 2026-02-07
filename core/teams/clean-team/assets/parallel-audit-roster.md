# Parallel Audit Roster

Shared sub-agent definitions for parallel codebase analysis. Referenced by both the standalone audit command (`/clean-team:audit`) and the Auditor agent within the clean pipeline (`/clean-team:clean`).

Parallelism is the point. A single agent doing sequential analysis is shallow and slow. Launching specialized auditors simultaneously produces deeper results in less time — each sub-agent focuses on one domain without context-switching.

---

## Launch Instructions

**CRITICAL: Launch ALL relevant auditors in parallel using the Task tool.**

Use a SINGLE message with MULTIPLE Task tool calls (`subagent_type="Explore"`) to run simultaneously. Each sub-agent is read-only — they analyze the codebase but make no changes.

Each sub-agent prompt must include:
1. The project path/scope to analyze
2. The relevant checklist (from `assets/audit-checklists/`)
3. The return format (see below)

---

## Core Auditors (Always Launch)

Read `assets/audit-checklists/core.md` and pass the relevant checklist section to each:

| # | Sub-Agent | Focus |
|---|-----------|-------|
| 1 | File Organization Auditor | Naming, directory structure, file sizes, index exports |
| 2 | Code Quality Auditor | Duplication, dead code, inconsistent patterns, hardcoded values |
| 3 | Scalability Auditor | Coupling, abstraction layers, bottlenecks, god objects |
| 4 | Developer Experience Auditor | README, entry points, imports, types, code style |

### Structure Focus Mode

When focus is `structure`, **replace** the File Organization Auditor (#1) with 5 specialized structure auditors from `assets/audit-checklists/structure.md`. Still run Code Quality (#2), Scalability (#3), and Developer Experience (#4).

| # | Sub-Agent | Focus |
|---|-----------|-------|
| 1a | Root & Config Auditor | Clean root, necessary configs, clear entry point |
| 1b | Folder Structure Auditor | Logical grouping, depth balance, structural opportunities |
| 1c | File Organization Auditor (expanded) | Placement, splitting, consolidation, dead weight |
| 1d | Naming Conventions Auditor | Descriptive names, consistency, non-semantic flags |
| 1e | Documentation Placement Auditor | README presence, co-location, single source of truth |

---

## Web Auditors (If Web Stack Detected)

Launch when CSS, HTML, JSX, React, Apollo, or Prisma are detected. Read `assets/audit-checklists/web.md` and pass the relevant checklist section to each:

| # | Sub-Agent | Launch When |
|---|-----------|-------------|
| 5 | CSS/Styling Auditor | CSS files present |
| 6 | Semantic HTML Auditor | HTML or JSX files present |
| 7 | Accessibility Auditor | Any web project |
| 8 | React/Component Auditor | `react` in dependencies |
| 9 | GraphQL/API Auditor | `@apollo/client` or `@apollo/server` in dependencies |
| 10 | Data Layer Auditor | `prisma` in dependencies |
| 11 | Performance Auditor | Any web project |

---

## Sub-Agent Return Format

Each auditor must return findings in this format:

```markdown
## [Category] Audit Findings

### Critical Issues
- Issue 1: [description] | Location: [path] | Effort: Low/Med/High

### High Priority
- ...

### Medium Priority
- ...

### Low Priority
- ...
```

---

## Consolidation

After ALL parallel auditors complete:

1. **Collect** all sub-agent outputs
2. **Deduplicate** overlapping findings (different auditors may flag the same issue)
3. **Re-prioritize** across all categories (some "high" from one auditor may be "critical" overall)
4. **Assign sequential AUDIT-NNN IDs** across all priority levels
5. **Merge** with any metrics collected separately (tests, analysis scripts, check.js)
6. **Generate** the final consolidated report using `assets/audit-report-template.md`

Every finding in the final report MUST have a unique `AUDIT-NNN` ID. These IDs enable the Phase 2 agents to reference, track, and report remediation status.
