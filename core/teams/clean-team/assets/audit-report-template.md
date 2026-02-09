# Audit Report Template

Use this template when generating AUDIT-REPORT.md. The Auditor agent fills in each section during the clean phase.

---

```markdown
# AUDIT-REPORT.md

**Generated:** [timestamp]
**Scope:** [full project or specified path]
**Phase:** Clean phase complete — ready for user review

---

## Executive Summary

[2-3 sentence summary for humans. What was cleaned, what was found, what's recommended.]

**Clean Phase Status:** [Complete / Complete with issues]
**Findings:** [count] total ([critical] critical, [high] high, [medium] medium, [low] low)
**Recommendation:** [Proceed to refactoring / Address issues first / No refactoring needed]

---

## Clean Phase Results

### Agent Summary

| Agent | Changes | Commit |
|-------|---------|--------|
| Organizer | [X files moved, Y renamed, Z deleted] | [hash] |
| Formatter | [N dead code removals, M constants extracted, type-specific changes] | [hash] |

### Test Results

[✅ PASS / ❌ FAIL / ⚠️ NO TESTS]

[If failed, list which tests and likely cause]

### Metrics Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total files | X | Y | -Z |
| CSS files | X | Y | -Z |
| Dead imports removed | - | N | N |
| Debug statements removed | - | N | N |
| Constants extracted | - | N | N |

---

## Codebase Understanding

### Overview
[What the project does, tech stack, purpose]

### Architecture
[Folder structure diagram, how modules relate]

### Key Modules
[Description of each major module: purpose, dependencies, exports]

### Data Flow
[How data moves through the system — trace key user journeys]

### Patterns & Conventions
[Naming conventions, code patterns, testing patterns observed]

---

## Best Practices Analysis

### Project Type
[React SPA / Node API / Python service / CLI / etc.]

### Standards Applied
- **Universal:** code-quality skill standards
- **Project-specific:** [framework/language conventions]

### Gap Analysis

| Area | Standard | Current State | Gap |
|------|----------|---------------|-----|
| Naming | [expected] | [observed] | [difference] |
| Organization | [expected] | [observed] | [difference] |
| Documentation | [expected] | [observed] | [difference] |
| Testing | [expected] | [observed] | [difference] |
| Error Handling | [expected] | [observed] | [difference] |

---

## Tier Architecture (Web Projects)

_Skip this section if the project is not a web application._

### Current Structure

[Does the project use `01-presentation/` / `02-logic/` / `03-data/`? If so, diagram the tier layout. If not, describe what structure exists and whether it has implicit layer separation.]

### Import Direction Analysis

| Source Tier | Target Tier | Count | Status |
|-------------|-------------|-------|--------|
| Presentation -> Logic | [count] | Valid |
| Logic -> Data | [count] | Valid |
| Data -> Logic | [count] | VIOLATION |
| Logic -> Presentation | [count] | VIOLATION |
| Presentation -> Data | [count] | VIOLATION (layer skip) |

### Misplaced Files

| File | Current Location | Correct Tier | Reason |
|------|-----------------|--------------|--------|
| [file path] | [current folder] | [01-presentation / 02-logic / 03-data] | [why it belongs there] |

### Tier Recommendations

[Specific migration plan, or "Tier architecture is correctly implemented — no changes needed."]

Reference: `~/.claude/skills/architecture/references/web.md`

---

## Findings

### AUDIT-001: [Short descriptive name]

- **Priority:** Critical / High / Medium / Low
- **Category:** Naming / Structure / Testing / Documentation / Error Handling / Performance / Security
- **Location:** path/to/file.ext:line
- **Problem:** [What's wrong — specific]
- **Recommendation:** [What to do — actionable]
- **Effort:** Low / Medium / High
- **Risk:** Low / Medium / High

### AUDIT-002: [Short descriptive name]
...

### AUDIT-NNN: [Short descriptive name]
...

---

## Critical Paths

**For Tester consumption.**

Areas that MUST have test coverage before refactoring:

1. [Module/function — why it's critical]
2. [Module/function — why it's critical]
3. [Module/function — why it's critical]

---

## Prioritized Recommendations

**For Planner consumption.**

### High Priority
1. [Most important improvement with reasoning]
2. [Second most important]

### Medium Priority
1. [Moderate impact improvement]

### Low Priority
1. [Nice-to-have]

---

## Flagged for User Review

Items that need human decision before refactoring:

- [ ] [Item 1 — why it needs user input]
- [ ] [Item 2 — why it needs user input]

---

## Next Steps

1. Review this report
2. Address any flagged items above
3. The pipeline will continue to refactoring, or run `/clean-team:refactor [path] [focus]` to resume later
```
