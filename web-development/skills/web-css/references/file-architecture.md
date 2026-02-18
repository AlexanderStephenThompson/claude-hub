# CSS File Architecture Reference

Detailed descriptions of each file in the 5-file CSS system. For the overview and rules, see `SKILL.md`.

---

## 1. `reset.css` — Clean Slate

**What it is:** Browser normalization only. Strips inconsistent defaults so every browser starts from zero. No design decisions, no tokens, no opinions.

**Why it's first:** Everything else builds on a consistent baseline. Without this, you're fighting browser quirks in every file that follows.

**What goes in:**
- Box-sizing reset (`*, *::before, *::after { box-sizing: border-box; }`)
- Margin/padding resets on all elements
- Form element appearance normalization
- Image defaults (`max-width: 100%; display: block;`)
- Table border-collapse
- Button/input font inheritance

**What doesn't go in:** Design tokens, colors, typography choices, or anything referencing `var(--*)`. If it uses a token, it belongs in `global.css`.

**Selectors:** Element selectors only — `*`, `body`, `img`, `input`, `button`, `table`, etc.

**Internal organization:**

```css
/* =================================================================
   BOX MODEL
   ================================================================= */

*, *::before, *::after { box-sizing: border-box; }

/* =================================================================
   DOCUMENT
   ================================================================= */

html { ... }
body { ... }

/* =================================================================
   TYPOGRAPHY
   ================================================================= */

h1, h2, h3, h4, h5, h6 { ... }
p { ... }

/* =================================================================
   MEDIA
   ================================================================= */

img, picture, video, canvas, svg { ... }

/* =================================================================
   FORMS
   ================================================================= */

input, button, textarea, select { ... }

/* =================================================================
   TABLES
   ================================================================= */

table { ... }
```

---

## 2. `global.css` — Design Tokens + Element Defaults

**What it is:** Two sections in one file. Section 1: every CSS variable in a `:root` block. Section 2: element defaults that reference those tokens. This is your project's identity — the colors, sizes, and typographic rhythm that make it yours.

**Why it exists:** Every design value lives here so there's exactly one place to change it. When you update `--color-primary`, every button, link, and badge that references it updates automatically. This is the core mechanism that prevents CSS drift — tokens are the reason one edit can propagate everywhere. Element defaults go here (not in `reset.css`) because they're design decisions, not browser normalization.

**Section 1 — Design Tokens (`:root` block):**
- Colors (semantic: `--color-primary`, `--color-error`; neutrals: `--color-neutral-100` through `--color-neutral-900`)
- Spacing scale (`--space-1` through `--space-16`)
- Typography (font families, size scale, weights, line heights)
- Borders (radius scale)
- Shadows (size scale)
- Z-index layers (`--z-dropdown`, `--z-modal`, `--z-toast`)
- Animation timing (durations, easing curves)
- Breakpoint reference values

**Section 2 — Element Defaults:**
- Body defaults (font family, line height, background, color — all using tokens)
- Heading styles (h1-h6 sizes, weights, margins — all using tokens)
- Link defaults (color, hover state — using tokens)
- List defaults
- Table defaults

**What doesn't go in:** Classes. If you're writing a `.something` selector, it belongs in layouts, components, or overrides.

**The rule:** If a value appears more than once anywhere in your CSS, it should be a token in this file.

**Internal organization:**

```css
/* =================================================================
   DESIGN TOKENS
   ================================================================= */

:root {
  /* Colors — Semantic
     ----------------------------------------------------------------- */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  ...

  /* Colors — Neutrals
     ----------------------------------------------------------------- */
  --color-neutral-50: #f8fafc;
  ...

  /* Typography
     ----------------------------------------------------------------- */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  ...

  /* Spacing
     ----------------------------------------------------------------- */
  --space-1: 0.25rem;
  ...

  /* Borders
     ----------------------------------------------------------------- */
  --radius-sm: 0.25rem;
  ...

  /* Shadows
     ----------------------------------------------------------------- */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  ...

  /* Z-index
     ----------------------------------------------------------------- */
  --z-dropdown: 100;
  ...

  /* Animation
     ----------------------------------------------------------------- */
  --duration-fast: 150ms;
  ...
}

/* =================================================================
   ELEMENT DEFAULTS
   ================================================================= */

/* Body
   ----------------------------------------------------------------- */

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background-color: var(--color-bg);
}

/* Headings
   ----------------------------------------------------------------- */

h1 { font-size: var(--font-size-3xl); ... }
h2 { font-size: var(--font-size-2xl); ... }
...

/* Links
   ----------------------------------------------------------------- */

a { color: var(--color-primary); }
a:hover { color: var(--color-primary-hover); }
```

For full token definitions and values, see `assets/token-reference.md`.

---

## 3. `layouts.css` — Page Structure

**What it is:** The bones of each page. How sections are arranged, how content flows within containers, how the page responds at different widths.

**Why it exists:** Separates structure from decoration. A layout says "this is a two-column grid with a sidebar" — it doesn't say what the sidebar looks like. This separation means you can rearrange pages without touching component styles.

**What goes in:**
- Page scaffolding (`.page-layout`, `.page-header`, `.page-content`, `.page-footer`)
- Grid systems (`.grid-2`, `.grid-3`, `.grid-auto`)
- Container widths and centering
- Section spacing (`.section`, `.section--narrow`)
- Responsive breakpoint overrides for layout shifts
- Flex/grid patterns that define page regions

**What doesn't go in:** Anything visual — colors, borders, shadows, typography. If it affects how something *looks* rather than where it *sits*, it's a component or override.

**Selectors:** Layout-prefixed classes — `.page-*`, `.container`, `.grid-*`, `.section-*`.

**Internal organization:**

```css
/* =================================================================
   CONTAINERS
   ================================================================= */

.container { ... }

/* =================================================================
   PAGE LAYOUTS
   ================================================================= */

.page-layout { ... }

/* =================================================================
   GRIDS
   ================================================================= */

.grid-2 { ... }
.grid-3 { ... }

/* =================================================================
   SECTIONS
   ================================================================= */

.section { ... }

/* =================================================================
   RESPONSIVE OVERRIDES
   ================================================================= */

@media (min-width: 768px) { ... }
@media (min-width: 1024px) { ... }
```

---

## 4. `components.css` — UI Elements

**What it is:** Every reusable UI component. Buttons, cards, modals, forms, navigation, badges, alerts, tooltips — all here, organized by BEM block.

**Why it exists:** One file means one place to look. When you need to change how buttons work, you open `components.css` and search for `.btn`. No hunting across dozens of files.

**What goes in:**
- Buttons (`.btn`, `.btn--primary`, `.btn--ghost`)
- Cards (`.card`, `.card__header`, `.card__body`)
- Forms (`.form-group`, `.form-label`, `.form-input`, `.form-error`)
- Navigation (`.nav`, `.nav__item`, `.nav__link`)
- Modals, dropdowns, tooltips, alerts, badges, tabs, accordions
- Component states (`.btn.is-loading`, `.card.is-selected`)

**What doesn't go in:** Page layouts (that's `layouts.css`) or one-off spacing overrides (that's `overrides.css`).

**Selectors:** BEM-named classes — `.block`, `.block__element`, `.block--modifier`.

**Scaling note:** For projects with 50+ components, split into domain files (`components/forms.css`, `components/navigation.css`) that get bundled. Document the split.

**Internal organization:**

```css
/* =================================================================
   BUTTONS
   ================================================================= */

/* Base
   ----------------------------------------------------------------- */
.btn { ... }

/* Variants
   ----------------------------------------------------------------- */
.btn--primary { ... }
.btn--secondary { ... }
.btn--ghost { ... }

/* States
   ----------------------------------------------------------------- */
.btn:hover { ... }
.btn:active { ... }
.btn:focus-visible { ... }
.btn:disabled { ... }

/* =================================================================
   CARDS
   ================================================================= */

.card { ... }
.card__header { ... }
.card__body { ... }

/* =================================================================
   FORMS
   ================================================================= */

.form-group { ... }
.form-label { ... }
.form-input { ... }

/* ... more components, each with a major section header ... */
```

---

## 5. `overrides.css` — Exceptions

**What it is:** Everything that doesn't fit cleanly into the cascade above. Page-specific adjustments, one-off spacing fixes, utility helpers. Loaded last so it wins by source order, not specificity.

**Why the honest name:** "Utilities" implies these are reusable building blocks. Most aren't — they're exceptions, workarounds, and page-specific tweaks. Calling them "overrides" makes their nature clear: they exist because the standard cascade didn't cover a specific case.

**What goes in:**
- Single-purpose utilities (`.u-visually-hidden`, `.u-text-center`, `.u-mt-4`)
- Page-specific adjustments that don't belong in a component
- Spacing overrides (`.u-mt-4`, `.u-mb-0`, `.u-p-2`)
- Display helpers (`.u-flex`, `.u-block`, `.u-inline`)
- Visibility helpers (`.u-hidden`, `.u-hidden-mobile`)
- Print styles (`@media print { ... }`)
- Third-party integration overrides

**What doesn't go in:** Multi-property styles. If an "override" sets more than 1-2 properties, it's a component — move it to `components.css`.

**Selectors:** Prefixed with `u-` for utilities. Page-specific overrides use scoped selectors (`.page-about .hero { ... }`).

**Internal organization:**

```css
/* =================================================================
   UTILITIES
   ================================================================= */

/* Visibility
   ----------------------------------------------------------------- */
.u-visually-hidden { ... }
.u-hidden { ... }

/* Text
   ----------------------------------------------------------------- */
.u-text-center { ... }
.u-text-right { ... }

/* Spacing
   ----------------------------------------------------------------- */
.u-mt-4 { ... }
.u-mb-0 { ... }

/* Display
   ----------------------------------------------------------------- */
.u-flex { ... }
.u-block { ... }

/* =================================================================
   PAGE-SPECIFIC
   ================================================================= */

/* About page
   ----------------------------------------------------------------- */
...

/* =================================================================
   PRINT
   ================================================================= */

@media print { ... }
```

---

## Import Order

The order matters — it's the cascade.

```css
/* In main entry (App.jsx or index.jsx) */
import './styles/reset.css';      /* 1. Browser normalization — clean slate */
import './styles/global.css';     /* 2. Tokens + element defaults */
import './styles/layouts.css';    /* 3. Page structure */
import './styles/components.css'; /* 4. UI components */
import './styles/overrides.css';  /* 5. Exceptions last — wins by source order */
```

**Enforced by:** `check.js` rule `css-import-order` (error when imports deviate from this sequence).

---

## Internal File Organization

All 5 files use the same section comment conventions:

```css
/* =================================================================
   MAJOR SECTION (all caps)
   ================================================================= */

/* Minor section
   ----------------------------------------------------------------- */
```

Major sections (`===`) separate distinct categories (e.g., BUTTONS, CARDS, FORMS). Minor sections (`---`) separate sub-groups within a category (e.g., Base, Variants, States). This makes every file scannable at a glance.
