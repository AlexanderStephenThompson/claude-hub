# Project Standards

**Version:** 3.0
**Last Updated:** 2026-02-09

> Non-negotiable development standards for all agents. These are not preferences—they are requirements.

---

## Overview

This document serves as the index for all project standards. Standards have been organized into separate, focused files for easier navigation and maintenance.

---

## Standards Files

### [Code Quality](./Standards/Code-Quality.md)
**Covers:** Structure, Code Structure, Testing, Naming, Constants, Error Handling, Docstrings

- **3-tier architecture** (01-presentation / 02-logic / 03-data)
- **Code structure** - Early returns, function size, single responsibility
- **Strict Test-Driven Development (TDD)** - Red → Green → Refactor
- **Clear naming conventions** - Directional, readable names, boolean prefixes
- **Constants & clarity** - No magic values, named boolean parameters
- **Error handling** - Fail fast, specific errors, never swallow
- **Comprehensive docstrings** - Living documentation for all public APIs

### [Design](./Standards/Design.md)
**Covers:** UI/UX Standards, Design System, Component Patterns

- **Design system** in `/01-presentation/styles/global.css` (single source of truth)
- **Premium UI philosophy** - S-Tier SaaS quality (Stripe, Airbnb, Linear)
- **Component patterns** - Buttons, forms, cards, modals, tables
- **WCAG AA accessibility** - Inclusive design standards
- **Responsive breakpoints** - Mobile-first approach
- **Semantic HTML** - Accessible, human-readable markup

### [Documentation](./Standards/Documentation.md)
**Covers:** Semantic Versioning, Documentation Requirements

- **Semantic versioning** - `vX.Y.Z — [Program] / [Module]: [Feature]`
- **Release naming** - Human-readable version titles
- **/Documentation folder structure** - Roadmap, architecture, changelog, features
- **Living documentation** - Keep docs updated as you work

### [Security](./Standards/Security.md)
**Covers:** Input Validation, Auth, Data Protection, API Security, Secrets, OWASP Top 10

- **Input validation** - SQL injection, XSS, command injection prevention
- **Authentication & Authorization** - Password storage, session management, access control
- **Data protection** - Encryption requirements, sensitive data masking
- **API security** - Rate limiting, CORS, security headers
- **Secrets management** - Environment variables, rotation policies
- **File upload security** - Validation, safe filenames, magic bytes
- **Logging & monitoring** - Security event tracking
- **OWASP Top 10** - Common vulnerabilities with prevention patterns
- **Security checklist** - Pre-release and code review verification

### [Architecture](./Standards/Architecture.md)
**Covers:** Architecture principles, module boundaries, patterns, anti-patterns

- **North Star** - Small changes stay local
- **Boundaries are sacred** - Modules communicate through contracts only
- **Module boundaries** - Single entry points, no circular dependencies, coupling guidelines
- **Pattern selection** - Function → Module → Class → Factory → Repository
- **Anti-patterns** - God Object, Shotgun Surgery, Cluttered Root, Deep Nesting, and more
- **Testing strategy** - Unit-heavy, minimal E2E
- **When to extract** - Modular monolith first, extract with reason

### [Checklist](./Standards/Checklist.md) ⭐
**Covers:** Complete compliance verification before marking work complete

- **Pre-completion requirements** - All items must pass
- **Code Quality checks** - Architecture, TDD, naming, documentation
- **Design checks** - Tokens, semantic HTML, component states, accessibility
- **Documentation checks** - Versioning, feature files, changelog
- **Security checks** - Input validation, auth, data protection, OWASP

**Use this checklist for EVERY feature before marking it complete.**

---

## Using These Standards

### For Agents (AI):
1. **Read first** - Before starting work, review relevant standard files
2. **Reference during work** - Use standards as checklist while implementing
3. **Cite in docs** - Link to specific standards in feature specs and technical notes
4. **Update when needed** - Propose standard updates through proper channels

### For Developers (Human):
1. **Familiarize** - Read all standards before contributing
2. **Enforce** - Use standards in code reviews
3. **Automate** - Configure linters and tools to enforce standards
4. **Evolve** - Propose improvements based on real experience

---

## Standards Hierarchy

When standards conflict or need interpretation:

1. **Code Quality** - Foundational (structure, testing, naming)
2. **Security** - Non-negotiable (overrides convenience)
3. **Design** - User experience and interface patterns
4. **Documentation** - Communication and versioning

**Rule:** Security always wins. Code quality enables everything else. Design makes it usable. Documentation makes it maintainable.

---

## Quick Reference

| Need | See |
|------|-----|
| **✅ Verify work is complete** | [Checklist](./Standards/Checklist.md) ⭐ |
| **Architecture / folder structure** | [Code Quality](./Standards/Code-Quality.md#1-structure) |
| **Writing tests** | [Code Quality](./Standards/Code-Quality.md#3-strict-test-standards) |
| **Naming files/functions** | [Code Quality](./Standards/Code-Quality.md#4-naming-conventions) |
| **Error handling** | [Code Quality](./Standards/Code-Quality.md#6-error-handling) |
| **Design tokens / CSS variables** | [Design](./Standards/Design.md#1-design-system-single-source-of-truth) |
| **CSS file architecture** | [Design](./Standards/Design.md#2-css-file-architecture) |
| **Component states** | [Design](./Standards/Design.md#6-component-states-required) |
| **Accessibility** | [Design](./Standards/Design.md#8-accessibility-wcag-aa) |
| **Anti-patterns to avoid** | [Design](./Standards/Design.md#10-anti-patterns-do-not-do-these) |
| **Version naming** | [Documentation](./Standards/Documentation.md#1-semantic-versioning) |
| **Feature spec format** | [Documentation](./Standards/Documentation.md#4-feature-specifications) |
| **OWASP vulnerabilities** | [Security](./Standards/Security.md#9-owasp-top-10) |
| **Security checklist** | [Security](./Standards/Security.md#10-security-checklist) |
| **Module boundaries** | [Architecture](./Standards/Architecture.md#4-module-boundaries) |

---

## Version History

### v3.1 - 2026-02-09
- **Content sync** with project skills (bidirectional alignment)
- Design.md: Added "Before Writing New CSS" gate, ARIA patterns, modal focus trapping, dark mode support
- Code-Quality.md: Added testing pyramid table
- Architecture.md: Added "Organize by Feature" principle, anti-pattern rationale explanations
- Checklist.md: 112 → 116 items (+4: ARIA, modal focus, dark mode, check existing styles)
- Fixed breakpoints: 641px → 768px across Design.md and Checklist.md
- Fixed stale checklist count references across all files

### v3.0 - 2026-02-09
- **MAJOR:** Standards upgrade across all files
- Security.md v2.0: Complete rewrite from TBD to full content (10 sections)
- Code-Quality.md v2.0: Added Code Structure, Error Handling, Constants & Clarity
- Architecture.md v2.0: Added Module Boundaries, Anti-Patterns, Pattern Selection
- Design.md v3.0: Added CSS File Architecture, updated spacing/property order
- Checklist.md v2.0: 91 → 112 items (+21 new items)
- Standards.md index updated with new section references

### v2.1 - 2026-01-03
- **Added:** Checklist.md - Comprehensive compliance verification
- All standards now have actionable checklist items
- Checklist required before marking any work complete
- Updated quick reference to highlight checklist

### v2.0 - 2026-01-03
- **BREAKING:** Split monolithic Standards.md into modular files
- Created Standards/ directory with 4 focused files:
  - Code-Quality.md
  - Design.md (streamlined to principles, references design system)
  - Documentation.md
  - Security.md
- Standards.md now serves as index/navigation file

### v1.0 - 2026-01-02
- Initial comprehensive standards document
- Covered all aspects in single file (1,123 lines)
