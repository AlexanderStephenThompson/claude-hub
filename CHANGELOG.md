# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2026-02-11

### Changed
- **clean-team v4.0.0 → v4.1.0** — Consolidated three commands (`/clean-team:clean`, `/clean-team:audit`, `/clean-team:refactor`) into one: `/clean-team:clean [scope|audit [focus]]`. Mode detection routes to full pipeline, audit-only, or resume based on arguments and existing audit report.
- **Two-phase communication** — Pipeline now explicitly announces Phase 1 (Analyze) and Phase 2 (Refactor) with phase-labeled todo lists showing all 9 steps.
- **Auditor Write tool reinforcement** — Added 3 layers of instruction to prevent Bash heredoc usage on Windows (Core Principle, action point, output section).
- **`/sync` command rewritten** — Simplified from 7 steps to 3. Added marketplace mirror refresh before plugin reinstall. Removed duplicate deploy scripts from CLAUDE.md.
- **`marketplace.json`** — Updated clean-team version from 3.3.0 to 4.1.0.

### Removed
- `/clean-team:audit` command — Folded into `/clean-team:clean audit [focus]`
- `/clean-team:refactor` command — Folded into `/clean-team:clean` (auto-detected resume from existing audit report)

---

## [4.0.0] - 2026-02-10

### Changed
- **clean-team v3.4.0 → v4.0.0** — Unified pipeline: Phase 1 (Analyze: Organizer → Formatter → Auditor) and Phase 2 (Refactor: Tester → Planner → Challenger → Refactorer → Verifier) run as one command with a checkpoint between them.
- **Renamed refactor-team → clean-team** — The team was originally called refactor-team (v1.0–v3.4). Renamed to clean-team to better reflect its expanded scope (cleanup + audit + refactoring).
- **Design tokens** — Revised design token system and skill updates.

---

## [3.1.0] - 2026-02-07

### Added
- **Layer Architecture Auditor** — New parallel sub-agent for web projects. Checks tier structure, dependency direction, layer purity, file placement, and module boundaries. Registered in parallel-audit-roster (#5, launches for any web project).
- **Tier Architecture section** in audit report template — Import direction analysis, misplaced files table, migration recommendations for web projects.
- **Tier Migration Rules** in Planner Phase 3 — Concrete rules for creating migration slices when audit report identifies tier violations. Sequences Data -> Logic -> Presentation.
- **Tier Architecture Compliance** checks in Challenger Lens 2 — Import direction, file placement, reverse dependency prevention, migration sequencing. Stop-ship trigger for reverse tier imports.
- **Tier Architecture (Flag Only)** section in web cleaning profile — Formatter flags violations during cleaning without acting on them.
- **Web project template** at `web/templates/web-project/` — Project roadmap template + README referencing architecture skill.
- **Project Infrastructure** section in `architecture/references/web.md` — Documentation/, validators, and getting-started patterns absorbed from Project-Structure.md.

### Changed
- **clean-team v3.3.0 -> v3.4.0** — 3-tier architecture enforcement for web projects across all pipeline agents.
- **Organizer** — Folder Structure dimension now detects tier structure in web projects. Tier introduction and file migration routed through Restructuring (ask-user-first).
- **Refactorer** — Added `architecture` skill dependency. New Core Principle #8: "Tier Boundaries Are Sacred."
- **Verifier** — Added `architecture` skill dependency. New Tier Architecture metrics table and qualitative checks.
- **architecture skill `references/web.md`** — Now the single source of truth for web project structure. Absorbed Project Infrastructure content from Project-Structure.md.
- **audit-checklists/web.md** — Now has 8 auditor sections (was 7). Layer Architecture Auditor added first.
- **parallel-audit-roster.md** — Now has 12 web auditors (was 11). Layer Architecture Auditor listed first with priority note.
- **Project-Structure.md** — Deprecated. Replaced with pointer to `architecture/references/web.md`.
- **project-roadmap-template.md** — Moved to `web/templates/web-project/project-roadmap.md`.

---

## [3.0.0] - 2026-02-05

> **Note:** v3.0.0–v3.4.0 used the name **refactor-team**. This was renamed to **clean-team** in v4.0.0.

### Added
- **Domain folder structure** — Organized repo into `core/`, `web/`, `world-building/`, `data/`. Sync deploys flat to `~/.claude/`.
- **diagnose-team v1.0.0** — 5-agent diagnostic workflow: Clarifier → Investigator → Hypothesizer → Resolver → Validator
- **`/refactor-team:audit [focus]`** — Standalone parallel audit command with focus modes (css, a11y, perf, structure, security, testing, documentation, type-safety, error-handling). Absorbs improvement-auditor + web-auditor.
- Audit checklist assets (`core.md`, `structure.md`, `web.md`) in `refactor-team/assets/audit-checklists/`
- Cleaning profiles for Formatter agent (`web.md`, `unity.md`, `python.md`, `data.md`)
- Data engineering skills: data-python, data-sql, data-pipelines, data-aws, data-iac
- `/ui-audit` command — Audit HTML semantics and CSS for consolidation (5-file CSS enforcement)
- `/orient` command — Orient yourself to this project before starting work
- Skill inheritance for implement-team and diagnose-team agents
- Templates: team, agent, command, skill scaffolding (`core/templates/`)

### Changed
- **refactor-team v3.0.0 → v3.2.0** — 8 agents, 3 entry points (`:audit`, `:clean`, `:refactor`)
  - v3.0.0: Merged clean-team (4 agents) into refactor-team as Phase 1. Added Auditor agent (merged Explorer + Researcher + clean-team Verifier).
  - v3.1.0: Replaced web-specific Stylist + Polisher with universal Formatter. Project-type cleaning profiles.
  - v3.2.0: Absorbed improvement-auditor + web-auditor into `/refactor-team:audit` command.
- **code-quality v2.0** — Absorbed code-standards. Conventions, formatting, and language references consolidated.
- **architecture v3.0** — Absorbed project-structures. Project type profiles and structure evaluation consolidated.
- **unity-csharp v2.0** — Absorbed unity-performance. VR performance targets and profiling consolidated.
- **world-building reorganized** — Skills moved into sub-categories (`unity/`, `vr-chat/`). Sync updated for recursive discovery.
- Moved implement-team from `web/teams/` to `core/teams/` (universal, not web-specific)
- Voice quality pass across all skills, agents, and commands — instructions explain the pain they prevent, not just what to do

### Removed
- **clean-team** — Merged into refactor-team Phase 1
- **improvement-auditor agent** — Absorbed into `/refactor-team:audit`
- **web-auditor agent** — Absorbed into `/refactor-team:audit`
- **code-standards skill** — Merged into code-quality v2.0
- **project-structures skill** — Merged into architecture v3.0
- **unity-performance skill** — Merged into unity-csharp v2.0
- **unity-shaders skill** — Removed (too niche for VRChat/Unity workflow)
- `/deep-scan` command — Replaced by `/refactor-team:audit`
- `/structure` command — Absorbed into `/deep-scan`, then `/refactor-team:audit`
- `/optimize-prompt` command — Removed
- `/review` command — Removed
- CONTRIBUTING.md — Guidelines consolidated into CLAUDE.md

---

## [2.0.0] - 2025-01-15

### Added
- refactor-team v2.0.0 with 7-agent workflow
- Comprehensive skills library (code-quality, architecture, design, security, documentation)
- Web-specific skill scaffolds (web-accessibility, web-css, web-graphql, web-performance, web-react, web-testing)
- Analysis scripts (analyze_complexity.py, analyze_dependencies.py, detect_dead_code.py)
- Skill template with references, scripts, and assets structure

### Changed
- Skills are now shared at repository root, not inside teams
- Agents reference skills via frontmatter `skills:` field

---

## [1.0.0] - 2025-01-01

### Added
- implement-team v1.0.0 with 5-agent TDD workflow
- diagnose-team v1.0.0 with 5-agent diagnostic workflow
- Initial skill definitions
- Plugin structure and manifests
