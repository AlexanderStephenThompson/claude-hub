# Web Audit Checklists

Checklists for web-specific auditors. Launched when web technologies are detected in the project. Each checklist is passed to a parallel sub-agent for focused analysis.

---

## Stack Detection → Auditor Mapping

| Indicator | Auditors to Launch |
|-----------|-------------------|
| Any web project | Layer Architecture, Accessibility, Performance |
| CSS files present | CSS/Styling |
| HTML/JSX files present | Semantic HTML |
| `react` in dependencies | React Components |
| `@apollo/client` or `@apollo/server` | GraphQL/API |
| `prisma` in dependencies | Data Layer |

---

## Layer Architecture Auditor

Architecture boundary violations are structural problems that affect every other audit category. A project with logic in the presentation layer will also have testing gaps, performance issues, and maintainability problems. Check structure first.

Reference: `~/.claude/skills/architecture/references/web.md`

**Automated checks (run first):** `node check.js` detects `tier-structure` (missing/incomplete tier directories) and `tier-imports` (reverse or layer-skipping imports). Start with these results, then verify the items below that automation can't catch.

**Tier Structure:**
- [ ] Three tiers exist and are named clearly (`01-presentation/` / `02-logic/` / `03-data/` or equivalent separation)
- [ ] Each tier has a clear, exclusive responsibility (UI / business logic / data access)
- [ ] Cross-cutting config lives outside the tiers (`config/`, env files)
- [ ] Styles live within the presentation tier (`01-presentation/styles/`), not as a separate root folder
- [ ] No orphan source files outside the tier structure (stray `.ts`/`.tsx` in the project root)

**Dependency Direction:**
- [ ] No imports from data tier into logic tier (`03-data` -> `02-logic`)
- [ ] No imports from logic tier into presentation tier (`02-logic` -> `01-presentation`)
- [ ] No imports from presentation directly into data (`01-presentation` -> `03-data`, skipping logic)
- [ ] Shared types/interfaces defined at tier boundaries, not deep cross-tier coupling
- [ ] Path aliases configured to clarify tier boundaries (`@presentation/`, `@logic/`, `@data/`)

**Layer Purity:**
- [ ] No API calls or data fetching in presentation-tier components
- [ ] No business logic (validation, calculations, formatting) in React components
- [ ] No UI concerns (rendering, JSX, CSS class manipulation) in logic-tier services
- [ ] No business rules in data-tier repositories (pure data access only)
- [ ] State management centralized in logic tier (`02-logic/state/`), not scattered across components

**File Placement:**
- [ ] Components, pages, layouts, UI hooks live in presentation tier
- [ ] Services, use cases, validators, domain models live in logic tier
- [ ] Repositories, database models, API clients, migrations live in data tier
- [ ] No "god files" that span multiple tiers in a single module

**Module Boundaries:**
- [ ] Each module has a single entry point (index file or barrel export)
- [ ] Internal module files not imported directly from outside the module
- [ ] No circular dependencies between modules across tiers

---

## CSS/Styling Auditor

**Automated checks (run first):** `node check.js` detects `css-file-count` (file sprawl), `css-file-names` (non-canonical names), `css-import-order` (wrong cascade order), `css-property-order` (group ordering), and all hardcoded value rules. Start with these results, then verify the items below that automation can't catch.

**Design System & Single Source of Truth:**
- [ ] No foundational CSS file (should have one `global.css` with tokens and element defaults)
- [ ] Design tokens scattered across multiple files instead of one `:root` block
- [ ] Hardcoded hex colors instead of CSS variables
- [ ] Hardcoded pixel values for spacing (should use spacing scale)
- [ ] Hardcoded font sizes (should use typography scale)
- [ ] Inconsistent shadow values (should be tokenized)
- [ ] Inconsistent border-radius values
- [ ] Magic z-index numbers (should use z-index scale)
- [ ] Components defining their own color/spacing values instead of referencing tokens

**Organization & File Structure:**
- [ ] Too many CSS files (consolidate into fewer foundational files)
- [ ] CSS not colocated with components (scattered styles)
- [ ] No clear import order (reset → global → layouts → components → overrides)
- [ ] Missing a base/reset CSS file
- [ ] Inconsistent naming convention (BEM vs camelCase vs random)
- [ ] Deeply nested selectors (> 3 levels deep)
- [ ] ID selectors used for styling (too specific)
- [ ] Styles in JavaScript instead of CSS files
- [ ] Global element selectors that affect everything

**Responsive Design:**
- [ ] Using `max-width` queries (should be mobile-first `min-width`)
- [ ] Inconsistent breakpoint values across files
- [ ] No standard breakpoint scale defined
- [ ] Missing responsive styles for key components
- [ ] Pixel units for container max-widths (should use rem or consistent tokens)
- [ ] No container pattern for content width

**Performance & Maintainability:**
- [ ] `!important` overuse (specificity wars)
- [ ] Dead CSS (selectors with no matching elements)
- [ ] Duplicate styles across multiple files
- [ ] Animations using `width`/`height`/`top`/`left` (should use `transform`/`opacity`)
- [ ] Large CSS files that could be code-split
- [ ] Float-based layouts (should use Grid or Flexbox)
- [ ] Missing `gap` usage (using margin for spacing between siblings)

**CSS Duplication & Consolidation (AI-generated code smell):**
- [ ] Near-identical rules that could be consolidated
- [ ] Repeated property combinations that should be a utility class
- [ ] Similar color values that should be a single token
- [ ] Slight spacing variations that break the scale
- [ ] Multiple button-like styles that could be variants of one base class
- [ ] Repeated media query blocks with similar breakpoints
- [ ] Similar hover/focus states duplicated across components

**Theming & Dark Mode:**
- [ ] No CSS variable-based theming
- [ ] Missing `prefers-color-scheme` support
- [ ] Colors not using semantic variables (e.g., `--color-text` vs `--color-neutral-900`)
- [ ] Hardcoded colors that break in dark mode

**Property Order & Consistency:**
- [ ] Properties not following 5-group convention: Positioning → Box Model → Typography → Visual → Animation
- [ ] Inconsistent property ordering across files (run `check.js` for `css-property-order` warnings)
- [ ] Mixed shorthand and longhand properties
- [ ] Vendor prefixes that should use autoprefixer

---

## Semantic HTML Auditor

**Document Structure:**
- [ ] Multiple `<h1>` elements per page (should be one)
- [ ] Skipped heading levels (`h1` → `h3`, missing `h2`)
- [ ] Missing landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] `<div>` used where `<section>` or `<article>` is appropriate
- [ ] Missing or multiple `<main>` elements
- [ ] `<aside>` missing for sidebar content

**Interactive Elements:**
- [ ] `<div onClick>` instead of `<button>` for actions
- [ ] `<a>` without `href` attribute
- [ ] `<a onClick>` for actions (should be `<button>`)
- [ ] `<button>` used for navigation (should be `<a>`)
- [ ] `<span>` or `<div>` styled as links/buttons
- [ ] Missing `type` attribute on buttons (`type="button"` vs `type="submit"`)

**Lists & Data:**
- [ ] Series of items using `<div>` instead of `<ul>`/`<ol>`
- [ ] Key-value pairs not using `<dl>`/`<dt>`/`<dd>`
- [ ] Tabular data not using `<table>`
- [ ] Tables missing `<thead>`/`<tbody>`
- [ ] Table headers missing `scope` attribute
- [ ] Navigation links not in `<nav>` and `<ul>`

**Forms:**
- [ ] Inputs without associated `<label>` (missing `htmlFor`/`id`)
- [ ] Placeholder text used as only label
- [ ] Related inputs not grouped with `<fieldset>`/`<legend>`
- [ ] Required fields not marked with `aria-required` or `required`
- [ ] Error messages not linked to inputs (`aria-describedby`)
- [ ] Submit buttons missing or poorly labeled

**Media & Figures:**
- [ ] Images without `alt` attribute
- [ ] Decorative images with non-empty `alt` (should be `alt=""`)
- [ ] Images with captions not using `<figure>`/`<figcaption>`
- [ ] `alt` text that just says "image" or filename
- [ ] Missing `loading="lazy"` on below-fold images
- [ ] SVG icons without accessible labels

**Content Elements:**
- [ ] Dates not using `<time datetime="...">`
- [ ] Contact info not using `<address>`
- [ ] Quotations not using `<blockquote>`/`<q>`
- [ ] Code snippets not using `<code>`/`<pre>`
- [ ] Bold/italic for emphasis using `<b>`/`<i>` instead of `<strong>`/`<em>`
- [ ] Abbreviations not using `<abbr>`

---

## React/Component Auditor

- [ ] Components > 200 lines (should be split)
- [ ] Business logic in components (should be in hooks)
- [ ] Prop drilling > 2 levels (consider context or composition)
- [ ] Missing loading/error states in data-fetching components
- [ ] Inconsistent component file structure
- [ ] Missing or inconsistent component naming (PascalCase)
- [ ] Missing key props in lists
- [ ] Direct DOM manipulation instead of React patterns

---

## GraphQL/API Auditor

- [ ] Fat resolvers (business logic should be in services)
- [ ] Missing DataLoader usage (N+1 query risk)
- [ ] Schema not matching client needs (over/under-fetching)
- [ ] Missing error handling in mutations
- [ ] No pagination on list queries
- [ ] Queries/mutations scattered instead of organized by feature
- [ ] No input validation
- [ ] Missing rate limiting

---

## Data Layer Auditor (Prisma)

- [ ] Raw SQL when Prisma methods would work
- [ ] Missing indices on frequently queried fields
- [ ] N+1 queries (missing includes or select optimization)
- [ ] No transaction usage for multi-step operations
- [ ] Schema not matching domain model
- [ ] Missing cascade delete configuration
- [ ] No soft delete pattern where needed

---

## Performance Auditor

- [ ] No code splitting (large initial bundle)
- [ ] Heavy libraries not lazy-loaded
- [ ] Missing image optimization (no lazy loading, no srcset)
- [ ] No caching strategy (Apollo, Redis)
- [ ] Unoptimized re-renders (missing useMemo/useCallback where beneficial)
- [ ] No bundle size monitoring
- [ ] Missing compression (gzip/brotli)

---

## Accessibility Auditor

**Keyboard Navigation:**
- [ ] Interactive elements not focusable (missing `tabIndex` where needed)
- [ ] No visible focus indicators (`:focus-visible` styles)
- [ ] Custom focus styles removed without replacement (`outline: none`)
- [ ] Tab order doesn't follow visual order
- [ ] Positive `tabIndex` values breaking natural order
- [ ] Missing skip link to main content
- [ ] Keyboard traps (focus gets stuck)
- [ ] Modal dialogs don't trap focus

**Screen Readers:**
- [ ] Missing alt text on informative images
- [ ] Decorative images with alt text (noise for SR users)
- [ ] Icon-only buttons without `aria-label`
- [ ] Dynamic content changes not announced (`aria-live`)
- [ ] Status messages not using `role="status"` or `aria-live="polite"`
- [ ] Error messages not using `role="alert"`

**ARIA Usage:**
- [ ] ARIA used where native HTML would work (violates first rule of ARIA)
- [ ] Missing `aria-expanded` on expandable controls
- [ ] Missing `aria-controls` linking buttons to controlled content
- [ ] Modals missing `role="dialog"` and `aria-modal="true"`
- [ ] Missing `aria-hidden="true"` on decorative elements
- [ ] `aria-label` duplicating visible text

**Color & Contrast:**
- [ ] Text color contrast below 4.5:1 (body text)
- [ ] Large text contrast below 3:1
- [ ] UI component contrast below 3:1
- [ ] Color as only indicator of state (error = red only)
- [ ] Focus indicators that don't meet contrast requirements

**Motion & Timing:**
- [ ] Animations without `prefers-reduced-motion` support
- [ ] Auto-playing content without pause controls
- [ ] Time limits without extension options
- [ ] Flashing content (> 3 flashes per second)
