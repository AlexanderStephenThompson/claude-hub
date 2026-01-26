# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Skill inheritance for implement-team agents (planner, challenger, implementor, security, refactorer)
- Skill inheritance for diagnose-team agents (clarifier, investigator, hypothesizer, resolver, validator)
- Scope and Boundaries sections for design, web-accessibility, and web-css skills
- Skills Inheritance by Agent tables in implement-team and diagnose-team READMEs
- Team template (`templates/team/`)
- Agent template (`templates/agent/`)
- Command template (`templates/command/`)
- CHANGELOG.md (this file)
- CONTRIBUTING.md with guidelines for extending the system

### Changed
- Updated templates/README.md to document all four template types

---

## [2.0.0] - 2025-01-XX

### Added
- refactor-team v2.0.0 with 7-agent workflow
- Comprehensive skills library (code-quality, architecture, design, security, documentation, code-standards)
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
