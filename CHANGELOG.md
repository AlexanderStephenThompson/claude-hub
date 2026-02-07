# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **refactor-team v3.1.0** — Redesigned Phase 1 from 4 agents to 3. Replaced web-specific Stylist + Polisher with universal Formatter. Formatter detects project type and loads cleaning profiles from `assets/cleaning-profiles/`. Profiles: web, unity, python, data. Team now has 8 agents total.

### Added
- **organization skill v1.0** — L1/L2/L3 cognitive-phase folder organization for drives
- `/review` command — Review current work for quality and consistency
- `/ui-audit` command — Audit HTML semantics and CSS for consolidation (with 5-file CSS enforcement)
- `/orient` command — Orient yourself to this project before starting work
- Data engineering skills (data-python, data-sql, data-pipelines, data-aws, data-iac)
- Skill inheritance for implement-team agents (planner, challenger, implementor, security, refactorer)
- Skill inheritance for diagnose-team agents (clarifier, investigator, hypothesizer, resolver, validator)
- Scope and Boundaries sections for design, web-accessibility, and web-css skills
- Skills Inheritance by Agent tables in implement-team and diagnose-team READMEs
- Team template (`core/templates/team/`)
- Agent template (`core/templates/agent/`)
- Command template (`core/templates/command/`)
- CHANGELOG.md (this file)

### Changed
- **refactor-team v3.0.0** — Merged clean-team (4 agents) + refactor-team (7 agents) into unified 9-agent, 2-phase pipeline. Phase 1 CLEAN: Organizer → Stylist → Polisher → Auditor → AUDIT-REPORT.md. Phase 2 REFACTOR: Tester → Planner → Challenger → Refactorer → Verifier. Auditor is new (merges Explorer + Researcher + clean-team Verifier).
- **code-quality v2.0** — Merged code-standards into code-quality. Conventions section added. Language references moved to code-quality/references/.
- **architecture v3.0** — Merged project-structures into architecture. Project type profiles, detection, and structure evaluation absorbed.
- **unity-csharp v2.0** — Merged unity-performance into unity-csharp. VR performance targets and profiling absorbed.
- **world-building reorganized** — Skills moved into sub-categories: Unity/ and VR Chat/. Sync command updated for recursive discovery.
- Renamed `/audit` to `/deep-scan` for clarity
- Renamed `/cleanup` to `/structure`, then merged into `/deep-scan`
- Renamed `/style-audit` to `/ui-audit` with stronger 5-file CSS enforcement
- Moved implement-team from web/teams/ to core/teams/ (universal, not web-specific)
- All teams now live under core/teams/ with marketplace pointing to `./core/teams/<name>`

### Removed
- **clean-team** — Merged into refactor-team v3.0.0 Phase 1
- **code-standards skill** — Merged into code-quality v2.0
- **project-structures skill** — Merged into architecture v3.0
- **unity-performance skill** — Merged into unity-csharp v2.0
- **unity-shaders skill** — Removed (too niche for VRChat/Unity workflow)
- `/structure` command — Merged into `/deep-scan`
- CONTRIBUTING.md — Removed (guidelines now in CLAUDE.md)

---

## [2.0.0] - 2025-01-XX

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

## [1.0.0] - 2025-01-XX

### Added
- implement-team v1.0.0 with 5-agent TDD workflow
- diagnose-team v1.0.0 with 5-agent diagnostic workflow
- Initial skill definitions
- Plugin structure and manifests
