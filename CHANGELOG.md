# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02-05

### Added
- **Domain folder structure** — Organized repo into `core/`, `web/`, `world-building/`, `data/`. Sync deploys flat to `~/.claude/`.
- **diagnose-team v1.0.0** — 5-agent diagnostic workflow: Clarifier → Investigator → Hypothesizer → Resolver → Validator
- **`/refactor-team:audit [focus]`** — Standalone parallel audit command with focus modes (css, a11y, perf, structure, security, testing, documentation, type-safety, error-handling). Absorbs improvement-auditor + web-auditor.
- Audit checklist assets (`core.md`, `structure.md`, `web.md`) in `refactor-team/assets/audit-checklists/`
- Cleaning profiles for Formatter agent (`web.md`, `unity.md`, `python.md`, `data.md`)
- Data engineering skills: data-python, data-sql, data-pipelines, data-aws, data-iac
- Organization skill v1.0 — L1/L2/L3 cognitive-phase folder organization for drives
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
- **world-building reorganized** — Skills moved into sub-categories (`Unity/`, `VR Chat/`). Sync updated for recursive discovery.
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
