# Audit Report -- claude-hub

**Date:** 2026-02-07
**Scope:** Full project
**Auditor:** clean-team Auditor (Phase 1)
**Phase 1 Summary:** Organizer fixed structure (3 empty dirs, 1 vestigial file, 17 broken links, 2 renames). Formatter cleaned code (5 unused imports, 11 magic numbers, 1 misleading stub).

---

## Executive Summary

The claude-hub repository is a well-organized documentation and tooling project with 20 skills, 3 multi-agent teams (18 agents), 8 commands, and 13 analysis/validation scripts. Domain boundaries (core, web, world-building, data) are clean and the flat deployment model is consistent. The primary concerns are: (1) all Python scripts crash on Windows terminals due to emoji/Unicode characters in text output, (2) the 984-line check.js monolith has a single function (checkCSS) spanning 799 lines with cyclomatic complexity of 159, (3) agent frontmatter conventions are inconsistent across teams, and (4) several files at root should be cleaned up. The codebase is healthy overall -- most findings are medium-priority consistency and maintainability improvements, not correctness issues.

---

## Metrics

| Metric | Value |
|--------|-------|
| Total files | 165 |
| Markdown files | 141 |
| Python files | 12 |
| JavaScript files | 1 |
| JSON files | 6 |
| Other files | 5 (.gitignore, .sh, .svg, .html, nul) |
| Skills (real) | 20 |
| Teams | 3 |
| Agents (total) | 18 + 1 standalone |
| Commands | 8 |
| Analysis scripts | 13 |
| Test files | 0 |
| Total Python LOC | ~5,630 |
| Total JS LOC | 984 |

---

## Phase 1 Changes

### Organizer

- Removed 3 empty directories: web/teams/, web/templates/ (wrong level), world-building/Blender/
- Removed 1 vestigial file: requirements.txt
- Fixed 17 broken links in core/skills/README.md
- Renamed world-building/Unity/ to unity/ and VR Chat/ to vr-chat/ (kebab-case consistency)

### Formatter

- Removed 5 unused imports across Python scripts
- Extracted 11 magic numbers into named constants
- Fixed a misleading stub method (_check_form) description in check_accessibility.py

---

## Codebase Architecture

### Structure

The project follows a domain-based organization (core, web, world-building, data) with flat deployment to ~/.claude/. Core domain contains all 3 teams (clean-team with 8 agents, implement-team with 5, diagnose-team with 5), 4 skills (architecture, code-quality, documentation, security), standalone commands (commit, orient), and templates. Web domain has 7 skills (1 with scripts, 6 SKILL.md-only) plus 1 project template. World-building has unity (1 skill) and vr-chat (3 skills). Data has 5 skills with assets and references.

### Key Design Patterns

1. **Flat deployment model**: Domain folders provide human navigation; sync deploys everything flat to ~/.claude/
2. **Skills as single source of truth**: Teams reference deployed skill paths, not repo paths
3. **Two-phase pipeline**: Clean phase produces AUDIT-REPORT.md, user reviews, refactor phase consumes it
4. **Parallel audit**: Auditor launches 4-11 sub-agents simultaneously via shared roster

---

## Findings

### Critical

None.

### High

#### AUDIT-001: Python scripts crash on Windows due to Unicode emoji in text output

- **Priority:** High
- **Category:** Error Handling / Compatibility
- **Location:** 8 of 12 Python scripts
- **Problem:** All scripts that produce text output use emoji characters (checkmarks, warning signs, arrows, etc.) in their format_text_report() or format_text_output() functions. On Windows terminals using cp1252 encoding, these cause UnicodeEncodeError and the script crashes before producing any output. Confirmed failures in detect_dead_code.py and analyze_dependencies.py. All scripts with emoji in output are affected: scan_secrets.py, check_dependencies.py, validate_docs.py, check_naming.py, check_accessibility.py, and validate_design_tokens.py.
- **Recommendation:** Either (a) replace emoji with ASCII equivalents ([OK], [!!], -->) or (b) set sys.stdout.reconfigure(encoding="utf-8") at script entry, or (c) add PYTHONIOENCODING=utf-8 to script invocation. Option (a) is most portable.
- **Effort:** Low
- **Risk:** Low (output formatting only)

#### AUDIT-002: check.js is a 984-line monolith with extreme complexity

- **Priority:** High
- **Category:** Structure / Maintainability
- **Location:** core/teams/clean-team/scripts/check.js
- **Problem:** Single file contains all CSS (10 rules), HTML (11 rules), JS (9 rules), and project-level (1 rule) checking logic. The checkCSS() function alone spans 799 lines with cyclomatic complexity of 159 and nesting depth 8. checkHTML() spans 190 lines (complexity 36). checkJS() spans 320 lines (complexity 63). Adding or modifying rules requires navigating a massive function with deeply nested conditionals.
- **Recommendation:** Split into 4 modules: css-checker.js, html-checker.js, js-checker.js, and check.js (main entry point + shared utilities + project checks). Each checker exports a function matching the current signature.
- **Effort:** Medium
- **Risk:** Low (no external consumers, internal refactor)

### Medium

#### AUDIT-003: Agent frontmatter conventions are inconsistent across teams

- **Priority:** Medium
- **Category:** Consistency
- **Location:** All 19 agent files across 3 teams + 1 standalone
- **Problem:** Three inconsistencies: (1) Name casing -- clean-team uses PascalCase (Organizer), implement/diagnose use lowercase (planner). (2) Description format -- clean-team uses YAML multiline (>), others use single-line. (3) Field presence -- some have when_to_invoke, examples, tools; others omit them.
- **Recommendation:** Standardize on one convention per field. Suggested: lowercase names, multiline > descriptions, when_to_invoke and tools on all agents.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-004: Duplicate color assignments in clean-team

- **Priority:** Medium
- **Category:** Consistency
- **Location:** core/teams/clean-team/agents/
- **Problem:** Two color collisions: Tester and Verifier both use purple; Auditor and Refactorer both use green.
- **Recommendation:** Reassign: Verifier to yellow, Auditor to blue.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-005: VOID_ELEMENTS constant defined but never used

- **Priority:** Medium
- **Category:** Dead Code
- **Location:** web/skills/design/scripts/check_accessibility.py:35-38
- **Problem:** The VOID_ELEMENTS set (14 HTML void elements) is defined at module level but never referenced by any function.
- **Recommendation:** Either remove the constant or implement it for self-closing tag validation.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-006: _check_form is an empty stub with no implementation path

- **Priority:** Medium
- **Category:** Dead Code / Documentation
- **Location:** web/skills/design/scripts/check_accessibility.py:259-260
- **Problem:** _check_form() is called in handle_starttag() but contains only a docstring. It silently does nothing when encountering form elements, giving a false sense of coverage.
- **Recommendation:** Either implement form accessibility checks or remove the method and its call site with a TODO comment.
- **Effort:** Medium (if implementing) / Low (if removing)
- **Risk:** Low

#### AUDIT-007: Unused import Dict in analyze_complexity.py

- **Priority:** Medium
- **Category:** Dead Code
- **Location:** core/teams/clean-team/scripts/analyze_complexity.py:24
- **Problem:** Dict is imported from typing but never used. Dead code detector confirmed.
- **Recommendation:** Remove Dict from the import statement.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-008: nul file is a Windows artifact in the working directory

- **Priority:** Medium
- **Category:** Structure
- **Location:** nul (project root, 341 bytes)
- **Problem:** A file named nul exists at project root containing error output from a previous command. Created by Bash redirecting to nul on Windows. Listed in .gitignore but pollutes the working directory.
- **Recommendation:** Delete the file.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-009: Project-Structure.md is a deprecated redirect still at root

- **Priority:** Medium
- **Category:** Structure
- **Location:** Project-Structure.md (project root)
- **Problem:** Contains only a deprecation notice. Adds clutter and may confuse readers.
- **Recommendation:** Delete the file. The architecture skill is the authoritative source.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-010: CHANGELOG.md uses old team name (refactor-team) throughout

- **Priority:** Medium
- **Category:** Documentation
- **Location:** CHANGELOG.md (11 occurrences of refactor-team)
- **Problem:** The changelog was written before the rename to clean-team. Readers will be confused.
- **Recommendation:** Add a note at the top of the 3.0.0 section clarifying the rename.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-011: High cyclomatic complexity in multiple Python analysis scripts

- **Priority:** Medium
- **Category:** Code Quality
- **Location:** Multiple scripts
- **Problem:** Several functions exceed the MAX_CYCLOMATIC_COMPLEXITY = 10 threshold: check_accessibility.py (14, 16, 14, 13), validate_design_tokens.py (14, 13), check_dependencies.py (12, 22), detect_dead_code.py (20), analyze_dependencies.py (18), analyze_complexity.py (17), check_complexity.py (11, 13). These scripts enforce complexity limits but exceed them themselves.
- **Recommendation:** Refactor format_text_output() functions (common pattern) and extract sub-checkers.
- **Effort:** Medium
- **Risk:** Low

#### AUDIT-012: Six web skills are SKILL.md-only with no supporting files

- **Priority:** Medium
- **Category:** Content Completeness
- **Location:** web/skills/web-accessibility/, web-css/, web-graphql/, web-performance/, web-react/, web-testing/
- **Problem:** These 6 skills have only SKILL.md with no assets/, references/, or scripts/. Core skills have full sub-structures.
- **Recommendation:** Document as deliberate decision, or track expansion as backlog.
- **Effort:** High (if filling in) / Low (if documenting)
- **Risk:** Low

### Low

#### AUDIT-013: Inconsistent string quote style across Python files

- **Priority:** Low
- **Category:** Consistency
- **Location:** All 12 Python files
- **Problem:** Mix of single and double quotes without a clear pattern.
- **Recommendation:** Adopt single quotes as standard. Add pyproject.toml for enforcement.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-014: implement-team challenger description has embedded examples with literal backslash-n

- **Priority:** Low
- **Category:** Consistency / Readability
- **Location:** core/teams/implement-team/agents/challenger.md:3
- **Problem:** Single extremely long line with literal escape sequences and example blocks. Difficult to read and edit.
- **Recommendation:** Move examples to dedicated examples: field and use YAML multiline for description.
- **Effort:** Low
- **Risk:** Low

#### AUDIT-015: No automated tests for any scripts

- **Priority:** Low
- **Category:** Testing
- **Location:** All 13 scripts across the project
- **Problem:** Zero test files. Scripts have complex logic (regex, parsing, graph traversal) prone to edge-case bugs.
- **Recommendation:** Add smoke tests that verify each script runs without error on known input.
- **Effort:** Medium
- **Risk:** Low

#### AUDIT-016: Template placeholders use underscore prefix convention not documented

- **Priority:** Low
- **Category:** Documentation
- **Location:** core/templates/skill/ (files prefixed with _)
- **Problem:** Convention not documented in template README or checklist.
- **Recommendation:** Add a note to core/templates/README.md explaining the convention.
- **Effort:** Low
- **Risk:** Low

---

## Critical Paths (for Phase 2 Tester)

Since this is a documentation/tooling repository, critical paths are the analysis scripts that teams depend on:

1. **Design system checker** (core/teams/clean-team/scripts/check.js) -- 31 rules across CSS, HTML, JS
2. **Complexity analyzer** (core/teams/clean-team/scripts/analyze_complexity.py) -- Processes Python and JS/TS
3. **Dead code detector** (core/teams/clean-team/scripts/detect_dead_code.py) -- Used by Auditor and Formatter
4. **Dependency analyzer** (core/teams/clean-team/scripts/analyze_dependencies.py) -- Used by Auditor
5. **Accessibility checker** (web/skills/design/scripts/check_accessibility.py) -- Used by web auditors

All five must work correctly on Windows (the primary platform) for the clean-team pipeline to function.

---

## Prioritized Recommendations (for Phase 2 Planner)

### Priority 1: Fix Windows compatibility (AUDIT-001)
Fix the Unicode encoding crash in Python scripts. This blocks reliable script execution on the primary platform.

### Priority 2: Split check.js monolith (AUDIT-002)
Break the 984-line file into 4 modules. Highest-complexity code in the project.

### Priority 3: Standardize agent frontmatter (AUDIT-003, AUDIT-004, AUDIT-014)
Pick one convention for naming, description format, and field presence. Apply across all 19 agents. Fix color collisions.

### Priority 4: Clean up dead code and root clutter (AUDIT-005 through AUDIT-009)
Remove VOID_ELEMENTS, resolve _check_form stub, remove unused Dict import, delete nul and Project-Structure.md.

### Priority 5: Address script self-compliance (AUDIT-011)
The analysis scripts should meet the complexity standards they enforce on other projects.

---

## Flagged for User Review

1. **AUDIT-006: _check_form stub** -- Should form accessibility checks be implemented, or is this feature not planned?

2. **AUDIT-010: CHANGELOG old names** -- Confirm whether adding a clarifying note about the refactor-team to clean-team rename is desired.

3. **AUDIT-012: Bare web skills** -- Six web skills have SKILL.md only with no supporting files. Is this deliberate or an expansion backlog?

4. **AUDIT-015: No script tests** -- Given this is a personal tooling repo, is investing in script test coverage worth the effort?

---

## Analysis Tool Results

### Complexity Analysis (core/)

- 11 files analyzed, 148 functions, 4,849 total lines
- Top hotspots: check.js (score 118), check_dependencies.py (score 120), detect_dead_code.py (score 109)
- 20+ functions exceed complexity thresholds

### Complexity Analysis (web/)

- 2 files analyzed, 26 functions, 781 total lines
- Top hotspots: check_accessibility.py (score 100), validate_design_tokens.py (score 64)

### Dead Code Detection (core/)

- 1 finding: unused import Dict in analyze_complexity.py:24

### Dead Code Detection (web/)

- No findings

### Script Execution Failures

- detect_dead_code.py core/ -- crashes with UnicodeEncodeError on text output (works with --format json)
- analyze_dependencies.py core/teams/clean-team/scripts/ -- crashes with same encoding error
