<!-- Derived from skill Builder Checklists in ~/.claude/skills/
     For agent consumption, read each skill's ## Builder Checklist section directly.
     This file is a human-readable convenience copy for project browsing. -->

# Standards Compliance Checklist

**Version:** 3.0
**Last Updated:** 2026-03-23

> Only items matching the feature's declared scopes apply. Core and docs scopes are always active.

---

## Scopes

Each checklist item is tagged with one or more scopes. A feature's spec declares which scopes apply, and only matching items need to be verified.

| Scope | When to activate | Example features |
|-------|-----------------|------------------|
| `core` | **Always active** | Every feature (architecture, testing, naming, error handling) |
| `ui` | Feature touches presentation layer | Forms, pages, components, styling, layout |
| `api` | Feature exposes or consumes HTTP endpoints | REST routes, GraphQL resolvers, webhooks |
| `auth` | Feature involves identity or permissions | Login, signup, roles, protected routes |
| `data` | Feature touches persistence or external data | Repositories, migrations, API clients, caching |
| `docs` | **Always active** | Every feature (roadmap, changelog, feature files) |

**Typical scope combinations:**

| Feature type | Active scopes | ~Items |
|-------------|---------------|--------|
| Full-stack feature | `core` `ui` `api` `auth` `data` `docs` | ~116 |
| Frontend-only | `core` `ui` `docs` | ~75 |
| Backend API | `core` `api` `data` `docs` | ~55 |
| Data layer only | `core` `data` `docs` | ~42 |
| Auth feature | `core` `api` `auth` `data` `docs` | ~65 |
| Logic refactor | `core` `docs` | ~35 |

---

## How to Use This Checklist

1. **Check your feature's scopes** — declared in the feature spec's `Scopes:` field
2. **Skip grayed-out sections** — if a scope isn't active, its items don't apply
3. **Verify all active items** — every item in an active scope must pass
4. **In feature files** — record which scopes were verified and by whom

**Rule:** If any active-scope item is unchecked, the work is not complete.

---

## Code Quality Standards `core`
> Reference: [Code-Quality.md](./Code-Quality.md)

### Architecture & Structure `core`
- [ ] **3-tier architecture respected** — Files in correct tier (01-presentation / 02-logic / 03-data)
- [ ] **Valid dependency flow** — Presentation -> Logic -> Data (no reverse imports)
- [ ] **No business logic in components** — Logic lives in services/use-cases
- [ ] **Directory structure follows conventions** — Components have .tsx + .test.tsx + .css + index.ts

### Code Structure `core`
- [ ] **Max 3 levels of nesting** — Early returns and guard clauses used
- [ ] **Functions are short (~30 lines)** — Single-responsibility, one reason to change
- [ ] **Max 3-4 parameters per function** — More means it's doing too much
- [ ] **Explicit over clever** — Readable code preferred over terse one-liners

### 4-Layer TDD `core`
- [ ] **Layer 1 (Unit) tests pass** — Logic works in isolation, edge cases covered, happy path verified
- [ ] **Layer 2 (Integration) tests pass** — Boundaries and wiring verified, modules connect correctly
- [ ] **Layer 3 (Behavioral) tests pass** — User flows work end-to-end (required if `ui` scope active)
- [ ] **Layer 4 (Human) verification passed** — Change-specific manual checks completed
- [ ] **Red -> Green -> Refactor followed** — Tests written before implementation for Layers 1-3
- [ ] **Tests are isolated and deterministic** — No shared state or flaky dependencies

### Naming Conventions `core`
- [ ] **File names follow convention** — PascalCase for components, camelCase for utils, kebab-case for styles
- [ ] **Function names pass read-aloud test** — Natural when spoken aloud
- [ ] **Directional clarity** — Methods like `sendTo()`, `receiveFrom()` (not ambiguous)
- [ ] **No abbreviations** — Clear, full names (not `usr`, `btn`, `msg`)
- [ ] **Booleans prefixed** — `is_`, `has_`, `should_`, `can_` prefixes used

### Constants & Clarity `core`
- [ ] **No magic numbers or strings** — All values extracted to named constants
- [ ] **Boolean parameters use named args** — Not positional `True/False`

### Error Handling `core`
- [ ] **Errors fail fast at boundaries** — Input validated early with specific error types
- [ ] **No empty catch/except blocks** — Errors handled, logged, or re-raised
- [ ] **Specific errors over generic** — Catch what you expect, re-raise what you don't

### Code Documentation `core`
- [ ] **All public APIs have docstrings** — Purpose, parameters, returns, errors, examples
- [ ] **Examples mirror test cases** — Docstring examples match actual tests
- [ ] **No undocumented side effects** — State changes, I/O, mutations documented
- [ ] **Comments explain why, not what** — If code needs explaining, refactor it

---

## Design Standards `ui`
> Reference: [Design.md](./Design.md)
>
> **Skip this entire section if `ui` scope is not active.**

### CSS File Architecture `ui`
- [ ] **5-file architecture followed** — reset.css, global.css, layouts.css, components.css, overrides.css
- [ ] **CSS import order is correct** — reset -> global -> layouts -> components -> overrides
- [ ] **Files contain correct content** — Tokens in global.css, components in components.css, etc.
- [ ] **Checked for existing styles before writing new CSS** — Search tokens, classes, and near-matches first

### Design System Compliance `ui`
- [ ] **ALL values use design tokens** — No hardcoded colors, spacing, fonts, shadows, etc.
- [ ] **Global.css is source of truth** — All tokens from `/01-presentation/styles/global.css`
- [ ] **No magic numbers** — Every value references a CSS variable
- [ ] **Design system referenced for patterns** — Existing components used as templates

### Semantic HTML `ui`
- [ ] **Semantic tags used** — `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- [ ] **Buttons for actions, links for navigation** — `<button>` vs `<a>` used correctly
- [ ] **Forms use proper markup** — `<form>`, `<label>`, `<input>` with correct attributes
- [ ] **Heading hierarchy followed** — No skipped levels (h1 -> h2 -> h3)
- [ ] **Alt text on all images** — Descriptive, not decorative

### CSS Quality `ui`
- [ ] **Human-readable formatting** — One property per line, generous spacing
- [ ] **5-group property order** — Position & Layout -> Box Model -> Typography -> Visual -> Animation
- [ ] **BEM or semantic naming** — Clear class names (`.product-card__title` not `.pc-t`)
- [ ] **No inline styles** — Styles in CSS files, not `style=""` attributes

### Component States `ui`
- [ ] **Default state implemented** — Base appearance defined
- [ ] **Hover state implemented** — Visual feedback on mouse over
- [ ] **Active state implemented** — Visual feedback when pressed
- [ ] **Focus state implemented** — Keyboard navigation indicator (`outline: 2px solid var(--color-focus)`)
- [ ] **Disabled state implemented** — Grayed out, non-interactive

### Accessibility (WCAG AA) `ui`
- [ ] **Color contrast meets WCAG AA** — 4.5:1 for normal text, 3:1 for large text
- [ ] **Keyboard navigation works** — All functionality available via Tab, Enter, Esc, Arrows
- [ ] **Screen reader tested** — ARIA labels correct, semantic HTML used
- [ ] **Focus indicators visible** — Clear outline on focused elements
- [ ] **Form labels present** — All inputs have associated `<label>`
- [ ] **ARIA used only when semantic HTML is insufficient** — Prefer native elements over ARIA roles
- [ ] **Modals trap focus** — Tab cycles within modal, Esc closes, focus returns to trigger
- [ ] **Dark mode supported** — CSS variables used, `[data-theme="dark"]` toggle, `prefers-color-scheme` respected

### Responsive Design `ui`
- [ ] **Mobile-first approach** — Base styles for mobile, `@media (min-width)` for larger screens
- [ ] **Breakpoints followed** — 768px (tablet), 1024px (desktop), 1280px (large)
- [ ] **Works on all screen sizes** — Tested on mobile, tablet, desktop
- [ ] **No horizontal scroll** — Content fits viewport at all sizes

### Anti-Patterns Avoided `ui`
- [ ] **No floating labels** — Labels above inputs (not animated placeholders)
- [ ] **No inline validation** — Validation on blur/submit (not every keystroke)
- [ ] **No generic error messages** — Specific, actionable errors
- [ ] **No critical info in tooltips** — Important info visible, tooltips supplementary only
- [ ] **No disabled buttons without explanation** — Hint text explains why disabled
- [ ] **No custom scrollbars** — System scrollbars used
- [ ] **No hamburger menu on desktop** — Full navigation visible on desktop

---

## Security Standards
> Reference: [Security.md](./Security.md)
>
> **Items are split across `api`, `auth`, and `data` scopes.** Check which are active for your feature.

### Input Validation `api`
- [ ] **All user input validated** — No trust of client-side data
- [ ] **SQL injection prevented** — Parameterized queries used (no string concatenation)
- [ ] **XSS prevented** — User input escaped/sanitized before rendering
- [ ] **CSRF protection implemented** — Tokens used for state-changing operations
- [ ] **File uploads validated** — Type, size, magic bytes checked (not just extension)

### Authentication & Authorization `auth`
- [ ] **Authentication required** — Protected routes check user identity
- [ ] **Authorization enforced** — Users can only access resources they own
- [ ] **Session management secure** — Timeouts, secure cookies, proper logout

### Data Protection `data`
- [ ] **No secrets in code** — API keys, passwords in environment variables (not committed)
- [ ] **Sensitive data encrypted** — Passwords hashed (bcrypt/Argon2), PII protected (AES-256)
- [ ] **HTTPS enforced** — No sensitive data over HTTP

### API Security `api`
- [ ] **Rate limiting configured** — Per-endpoint limits in place
- [ ] **CORS configured restrictively** — Specific origins only, no wildcard in production
- [ ] **Security headers set** — HSTS, X-Content-Type-Options, CSP, X-Frame-Options
- [ ] **Error responses don't leak info** — No stack traces, SQL errors, or file paths in responses

### Logging & Monitoring `api` `data`
- [ ] **Security events logged** — Login attempts, permission denials, rate limits
- [ ] **Sensitive data never logged** — No passwords, tokens, credit cards, or keys in logs

### OWASP Top 10 `api` `auth` `data`
- [ ] **No broken access control** — Users can't access unauthorized resources
- [ ] **No cryptographic failures** — Strong encryption used where needed
- [ ] **No injection vulnerabilities** — All inputs validated/sanitized
- [ ] **No security misconfigurations** — Secure defaults, no debug info in production
- [ ] **No vulnerable dependencies** — Dependencies up-to-date, no known CVEs

---

## Documentation Standards `docs`
> Reference: [Documentation.md](./Documentation.md)

### Versioning `docs`
- [ ] **Version number follows SemVer** — MAJOR.MINOR.PATCH correctly incremented
- [ ] **Release name follows format** — `vX.Y.Z — [Program] / [Module]: [Feature]`
- [ ] **Scope tag included (if applicable)** — `program.module.feature` in kebab-case

### /Documentation Folder `docs`
- [ ] **project-roadmap.md updated** — Milestone status updated
- [ ] **architecture.md updated (if needed)** — New components/flows documented
- [ ] **changelog.md updated** — Version entry added with changes listed
- [ ] **Feature file exists** — One file per feature in correct folder
- [ ] **Module explainer updated** — Feature added to module's feature table

### Feature Files `docs`
- [ ] **User story complete** — As a / I want / So that format
- [ ] **Acceptance criteria testable** — Clear checkboxes for testing
- [ ] **Data model documented** — Schema/types defined if applicable
- [ ] **Technical notes include Standards Checklist reference** — Links to this file
- [ ] **Open questions resolved or flagged** — No "TBD" without tracking

---

## Pre-Completion Checklist `core`

Before marking work as complete, verify:

### Functionality `core`
- [ ] **Feature works as specified** — Acceptance criteria met
- [ ] **No console errors** — Clean browser console
- [ ] **No broken functionality** — Didn't break existing features

### Quality `core`
- [ ] **All tests pass** — Full test suite green
- [ ] **Code reviewed** — Self-review or peer review completed
- [ ] **No TODO/FIXME comments** — All temporary notes resolved

### Documentation `docs`
- [ ] **Code is self-documenting** — Clear naming, well-structured
- [ ] **/Documentation updated** — Roadmap, changelog, feature files current
- [ ] **README updated (if needed)** — New setup steps documented

### Standards `core`
- [ ] **ALL active-scope items checked** — Every item in active scopes verified
- [ ] **No shortcuts taken** — Quality over speed
- [ ] **Ready for production** — Code is maintainable and professional

---

## Scope Summary

Quick count of items per scope (items with multiple scopes are counted once per scope):

| Scope | Items | Sections |
|-------|-------|----------|
| `core` | 37 | Architecture, Code Structure, Testing, Naming, Constants, Error Handling, Code Docs, Pre-Completion |
| `ui` | 40 | CSS Architecture, Design System, Semantic HTML, CSS Quality, Component States, Accessibility, Responsive, Anti-Patterns |
| `api` | 16 | Input Validation, API Security, Logging, OWASP |
| `auth` | 8 | Authentication & Authorization, OWASP |
| `data` | 10 | Data Protection, Logging, OWASP |
| `docs` | 16 | Versioning, Documentation Folder, Feature Files, Pre-Completion Docs |

---

## Checklist Status Indicators

Use these in feature files and pull requests:

| Status | Meaning |
|--------|---------|
| **All standards met** | Ready to merge/deploy |
| **In progress** | Still implementing, some items unchecked |
| **Issues found** | Standards violations need fixing |
| **Blocked** | Cannot proceed until blocker resolved |

---

## Accountability

**For AI Agents:**
- Read the feature's `Scopes:` field before starting
- Only verify items matching active scopes
- Record which scopes were verified in the feature file
- If any active-scope item fails, fix it before proceeding

**For Human Developers:**
- Use scope-filtered checklist in code reviews
- Configure linters/tools to enforce automatically where possible
- Update checklist if standards evolve

**Rule:** Quality is non-negotiable. If it doesn't pass the active checklist, it's not done.
