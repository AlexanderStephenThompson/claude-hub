---
name: web-css
description: CSS architecture for vanilla CSS - organization, design tokens, responsive patterns
user-invocable: false
---

# Web CSS Skill

**Version:** 1.0
**Stack:** Vanilla CSS with CSS Variables

> Clean, maintainable CSS without preprocessors or utility frameworks. Design tokens via CSS variables.

---

## Scope and Boundaries

**This skill covers:**
- Design token implementation (CSS variables in :root)
- Token categories (colors, typography, spacing, borders, shadows, animations, z-index)
- Dark mode implementation with CSS variables
- CSS file organization and import order
- BEM-inspired naming conventions
- Mobile-first responsive breakpoints
- Layout patterns (Grid for structure, Flexbox for flow)
- Component states implementation
- CSS property ordering
- CSS anti-patterns

**Defers to other skills:**
- `design`: Design system philosophy, when to use Grid vs Flexbox, premium UI principles
- `web-accessibility`: Focus indicator patterns, reduced motion media queries, screen reader utilities

**Use this skill when:** You need CSS architecture, token implementation, or responsive patterns.
**Use design when:** You need design principles, layout philosophy, or component state requirements.
**Use web-accessibility when:** You need WCAG compliance or accessibility-specific CSS patterns.

---

## Core Principles

1. **Design Tokens First** — All values come from CSS variables.
2. **Component-Scoped** — CSS lives with its component.
3. **Mobile-First** — Base styles for mobile, enhance up.
4. **No Magic Numbers** — Every value has a purpose and comes from the system.
5. **Readable Over Clever** — Obvious code beats clever code.
6. **Consolidate, Don't Duplicate** — Check for existing styles before creating new ones.

---

## Before Writing New CSS

**This is a gate, not a suggestion.** Every new class that duplicates an existing pattern creates a variant. Every variant means future edits only partially propagate — you fix `.card` but miss `.panel` and `.info-box` because they were written independently with different values for the same intent. That's how CSS becomes a whack-a-mole game. Prevention here saves hours of cleanup later.

### Before Writing Any Value

1. **Check `global.css` first** — Does a token already exist for this value? Use it. Never write a raw `16px`, `#3b82f6`, or `8px` when a token like `var(--space-4)`, `var(--color-primary)`, or `var(--radius-md)` exists.
2. **Search for similar styles** — Is there already a button, card, or layout pattern that does this? Reuse it.
3. **Check for near-matches** — Could an existing class work with minor tweaks or a modifier?
4. **Extract if repeated** — If you're writing the same properties a second time, stop and make it one class.

```css
/* BAD — new class that duplicates existing .btn-primary */
.modal-submit-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  border-radius: var(--radius-md);
}

/* GOOD — reuse existing class, add modifier only for what's truly different */
.modal-footer .btn-primary {
  /* Only add what's actually different */
}
```

### What Creates Drift

| Pattern | Why It's Dangerous |
|---------|--------------------|
| Raw values instead of tokens | `16px` in one place, `1rem` in another — same value, invisible to search-and-replace |
| New class for existing pattern | `.action-button` when `.btn-primary` already does the same thing |
| Copy-paste with tweaks | Pasting `.card` styles into `.panel` and changing one property — now they drift independently |
| Inconsistent color formats | `#fff` here, `white` there, `rgb(255,255,255)` elsewhere — all the same, but a find-replace catches only one |

### The Rule

**If a token exists, use it. If a class exists, extend it. Only create something new when nothing existing fits.**

---

## Design Tokens

### Single Source of Truth

All design values live in `styles/global.css` — the single source of truth for CSS variables.

```css
:root {
  /* Colors - Semantic naming */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Neutrals - Numbered scale */
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing - 4px base, 8px scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* Borders */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* Animations */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);

  /* Z-index layers */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-tooltip: 500;
  --z-toast: 600;

  /* Breakpoint values (for reference in JS) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Using Tokens

```css
/* ✅ Good - Uses design tokens */
.button {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--easing-default);
}

.button:hover {
  background-color: var(--color-primary-hover);
}

/* ❌ Bad - Hardcoded values */
.button {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #3b82f6;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}
```

---

## Dark Mode

### CSS Variables for Theming

```css
:root {
  /* Light theme (default) */
  --color-bg: var(--color-neutral-50);
  --color-surface: white;
  --color-text: var(--color-neutral-900);
  --color-text-muted: var(--color-neutral-600);
  --color-border: var(--color-neutral-200);
}

[data-theme="dark"] {
  --color-bg: var(--color-neutral-900);
  --color-surface: var(--color-neutral-800);
  --color-text: var(--color-neutral-50);
  --color-text-muted: var(--color-neutral-400);
  --color-border: var(--color-neutral-700);
}

/* Components automatically adapt */
.card {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

### System Preference Detection

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: var(--color-neutral-900);
    --color-surface: var(--color-neutral-800);
    /* ... dark theme values */
  }
}
```

---

## File Organization

### The 5-File Architecture

All projects use exactly 5 CSS files. Each file is a layer in the cascade, loaded in order so that later layers override earlier ones without specificity hacks. When you know the layer, you know the file.

```
styles/
├── reset.css       # 1. Browser normalization — clean slate
├── global.css      # 2. Design tokens (:root) + element defaults
├── layouts.css     # 3. Page scaffolding, grids, containers
├── components.css  # 4. All component styles (BEM)
└── overrides.css   # 5. Exceptions — one-offs, page-specific, utilities
```

**Enforced by:** `check.js` rules `css-file-count` (warn >5, error >7) and `css-file-names` (warn when no canonical names found).

### 1. `reset.css` — Clean Slate

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

### 2. `global.css` — Design Tokens + Element Defaults

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
- Heading styles (h1–h6 sizes, weights, margins — all using tokens)
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

### 3. `layouts.css` — Page Structure

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

### 4. `components.css` — UI Elements

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

### 5. `overrides.css` — Exceptions

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

### Import Order

The order matters — it's the cascade.

```css
/* In main entry (App.jsx or index.jsx) */
import './styles/reset.css';      /* 1. Browser normalization — clean slate */
import './styles/global.css';     /* 2. Tokens + element defaults */
import './styles/layouts.css';    /* 3. Page structure */
import './styles/components.css'; /* 4. UI components */
import './styles/overrides.css';  /* 5. Exceptions last — wins by source order */
```

### Where Does This Go?

When you're unsure which file something belongs in:

| Ask yourself... | Answer → File |
|-----------------|---------------|
| Is it a browser reset with no design opinion? | `reset.css` |
| Is it a CSS variable or bare-element default? | `global.css` |
| Does it control where things sit on the page? | `layouts.css` |
| Is it a reusable UI component with BEM naming? | `components.css` |
| Is it an exception, one-off, or single-property override? | `overrides.css` |
| Am I creating a 6th file? | **Stop.** It belongs in one of these 5. |

### Internal File Organization

All 5 files use the same section comment conventions:

```css
/* =================================================================
   MAJOR SECTION (all caps)
   ================================================================= */

/* Minor section
   ----------------------------------------------------------------- */
```

Major sections (`===`) separate distinct categories (e.g., BUTTONS, CARDS, FORMS). Minor sections (`---`) separate sub-groups within a category (e.g., Base, Variants, States). This makes every file scannable at a glance.

---

## Naming Conventions

### BEM-Inspired (Simplified)

```css
/* Block */
.product-card { }

/* Element (child of block) */
.product-card__image { }
.product-card__title { }
.product-card__price { }
.product-card__actions { }

/* Modifier (variation) */
.product-card--featured { }
.product-card--sold-out { }

/* State (JS-toggled) */
.product-card.is-loading { }
.product-card.is-selected { }
```

### Naming Rules

| Type | Convention | Example |
|------|------------|---------|
| Block | kebab-case | `.user-profile` |
| Element | `__element` | `.user-profile__avatar` |
| Modifier | `--modifier` | `.user-profile--compact` |
| State | `.is-state` | `.is-active`, `.is-loading` |
| Utility | `u-utility` | `.u-visually-hidden` |

---

## Responsive Design

### Mobile-First Breakpoints

```css
/* Base styles = mobile (no media query) */
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large: 1280px+ */
@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Pattern

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-6);
  }
}
```

### Never Use max-width Queries

```css
/* ❌ Bad - Desktop-first */
@media (max-width: 768px) {
  .sidebar { display: none; }
}

/* ✅ Good - Mobile-first */
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar { display: block; }
}
```

---

## Layout Patterns

### Grid for Structure

```css
/* Page layout with named areas */
.page-layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

@media (min-width: 1024px) {
  .page-layout {
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
    grid-template-columns: 250px 1fr;
  }
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### Flexbox for Flow

```css
/* Navigation items */
.nav {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

/* Card gallery */
.card-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.card-gallery > * {
  flex: 1 1 300px; /* Grow, shrink, min 300px */
}
```

---

## Component States

All interactive elements must have these states:

```css
.button {
  /* Default */
  background-color: var(--color-primary);
  color: white;
  transition: all var(--duration-fast) var(--easing-default);
}

.button:hover {
  /* Hover */
  background-color: var(--color-primary-hover);
}

.button:active {
  /* Active/Pressed */
  transform: scale(0.98);
}

.button:focus-visible {
  /* Focus (keyboard) */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.button:disabled {
  /* Disabled */
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Accessibility

### Focus Indicators

```css
/* Remove default, add custom */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  z-index: var(--z-tooltip);
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface);
}

.skip-link:focus {
  top: var(--space-4);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Only

```css
.u-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Hardcoded values** | No consistency, hard to theme | Use design tokens |
| **!important everywhere** | Specificity wars | Fix selector specificity |
| **Deep nesting** | Hard to override, specificity issues | Max 3 levels |
| **ID selectors for styling** | Too specific | Use classes |
| **Styles in JS** | Splits styling concerns | CSS files with component |
| **Global element selectors** | Affects everything | Scope to component class |
| **max-width media queries** | Desktop-first thinking | Use min-width (mobile-first) |
| **Pixel units for font-size** | Ignores user preferences | Use rem |
| **Float for layout** | Outdated, fragile | Use Grid or Flexbox |
| **Margin for spacing between siblings** | Adds up, hard to manage | Use gap on parent |

---

## Property Order

Organize properties by group. 5 groups, always in this order:

```css
.component {
  /* 1. Positioning */
  position: relative;
  top: 0;
  z-index: var(--z-dropdown);

  /* 2. Box Model */
  display: flex;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  padding: var(--space-4);
  margin: 0;

  /* 3. Typography */
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--color-text);

  /* 4. Visual */
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);

  /* 5. Animation */
  transition: box-shadow var(--duration-fast);
}
```

**Enforced by:** `check.js` rule `css-property-order` (warn).

---

## Checklist

### Design Tokens
- [ ] All colors use CSS variables
- [ ] All spacing uses CSS variables
- [ ] All font sizes use CSS variables
- [ ] All shadows use CSS variables
- [ ] No hardcoded hex colors in component CSS
- [ ] No hardcoded pixel values (except borders)

### Organization
- [ ] Tokens defined in central file
- [ ] CSS colocated with components
- [ ] BEM-style naming used
- [ ] No ID selectors for styling

### Responsive
- [ ] Mobile-first (min-width queries only)
- [ ] Standard breakpoints used
- [ ] Tested at all breakpoints

### Accessibility
- [ ] Focus indicators visible
- [ ] Reduced motion respected
- [ ] Color contrast meets WCAG AA
- [ ] No reliance on color alone

---

## When to Consider Alternatives

| Situation | Consider |
|-----------|----------|
| Large team, many contributors | CSS Modules for guaranteed scoping |
| Rapid prototyping | Tailwind CSS |
| Complex theming needs | CSS-in-JS (styled-components, Emotion) |
| Legacy browser support | PostCSS with autoprefixer |
