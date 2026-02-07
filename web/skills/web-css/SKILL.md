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

1. **Check `tokens.css` first** — Does a token already exist for this value? Use it. Never write a raw `16px`, `#3b82f6`, or `8px` when a token like `var(--space-4)`, `var(--color-primary)`, or `var(--radius-md)` exists.
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

All design values live in a global CSS file (e.g., `styles/tokens.css` or `global.css`).

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

All projects use exactly 5 CSS files. This isn't arbitrary — each file is a layer in the cascade, loaded in order so that later layers can override earlier ones without specificity hacks. When you know the layer, you know the file.

```
styles/
├── tokens.css      # 1. Design system values (CSS variables only)
├── base.css        # 2. Reset + element defaults
├── layouts.css     # 3. Page scaffolding, grids
├── components.css  # 4. All component styles
└── utilities.css   # 5. Single-purpose overrides
```

### 1. `tokens.css` — The Design System Foundation

**What it is:** CSS variables only. No selectors besides `:root`. No styles. Just values.

**Why it exists:** Every design value lives here so there's exactly one place to change it. When you update `--color-primary`, every button, link, and badge that references it updates automatically. This is the core mechanism that prevents CSS drift — tokens are the reason one edit can propagate everywhere.

**What goes in:**
- Colors (semantic: `--color-primary`, `--color-error`; neutrals: `--color-neutral-100` through `--color-neutral-900`)
- Spacing scale (`--space-1` through `--space-16`)
- Typography (font families, size scale, weights, line heights)
- Borders (radius scale)
- Shadows (size scale)
- Z-index layers (`--z-dropdown`, `--z-modal`, `--z-toast`)
- Animation timing (durations, easing curves)
- Breakpoint reference values

**What doesn't go in:** Actual styles. If it has a property like `padding`, `color`, or `display`, it belongs in a later file.

**The rule:** If a value appears more than once anywhere in your CSS, it should be a token.

### 2. `base.css` — Reset + Element Defaults

**What it is:** Browser reset and bare-element styling. Sets the consistent baseline that everything else builds on.

**Why it exists:** Browsers have inconsistent defaults. This file normalizes them, then sets your project's typographic and form defaults so you're never fighting the browser later.

**What goes in:**
- Box-sizing reset (`*, *::before, *::after { box-sizing: border-box; }`)
- Margin/padding resets
- Body defaults (font family, line height, background, color — all using tokens)
- Heading styles (h1–h6 sizes, weights, margins — all using tokens)
- Link defaults (color, hover state)
- Form element defaults (input, textarea, select, button resets)
- List defaults
- Table defaults
- Image defaults (`max-width: 100%; display: block;`)

**What doesn't go in:** Classes. If you're writing a `.something` selector, it belongs in layouts, components, or utilities.

**Selectors:** Element selectors only — `body`, `h1`, `a`, `input`, `img`, `table`, etc.

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

**What doesn't go in:** Anything visual — colors, borders, shadows, typography. If it affects how something *looks* rather than where it *sits*, it's a component or utility.

**Selectors:** Layout-prefixed classes — `.page-*`, `.container`, `.grid-*`, `.section-*`.

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

**What doesn't go in:** Page layouts (that's `layouts.css`) or one-off spacing overrides (that's `utilities.css`).

**Selectors:** BEM-named classes — `.block`, `.block__element`, `.block--modifier`.

**Scaling note:** For projects with 50+ components, split into domain files (`components/forms.css`, `components/navigation.css`) that get bundled. Document the split.

### 5. `utilities.css` — Override Helpers

**What it is:** Single-purpose classes that do exactly one thing. Loaded last so they override everything else by cascade position, not specificity.

**Why it exists:** Sometimes you need a one-off override without creating a component modifier. "Hide this on mobile." "Center this text." "Add extra top margin here." Utilities handle these without polluting component styles with edge cases.

**What goes in:**
- Visibility (`.u-visually-hidden`, `.u-hidden`, `.u-hidden-mobile`)
- Text alignment (`.u-text-center`, `.u-text-right`)
- Spacing overrides (`.u-mt-4`, `.u-mb-0`, `.u-p-2`)
- Display helpers (`.u-flex`, `.u-block`, `.u-inline`)
- Width helpers (`.u-w-full`, `.u-w-auto`)

**What doesn't go in:** Multi-property styles. If a "utility" sets more than 1-2 properties, it's a component — move it to `components.css`.

**Selectors:** Prefixed with `u-` to make them instantly recognizable — `.u-text-center`, `.u-mt-4`.

### Import Order

The order matters — it's the cascade.

```css
/* In main entry (App.jsx or index.jsx) */
import './styles/tokens.css';     /* 1. Variables defined — no styles yet */
import './styles/base.css';       /* 2. Reset + element defaults */
import './styles/layouts.css';    /* 3. Page structure */
import './styles/components.css'; /* 4. UI components */
import './styles/utilities.css';  /* 5. Overrides last — wins by source order */
```

### Where Does This Go?

When you're unsure which file something belongs in:

| Ask yourself... | Answer → File |
|-----------------|---------------|
| Is it a raw value (color, size, spacing)? | `tokens.css` |
| Is it styling a bare HTML element (no class)? | `base.css` |
| Does it control where things sit on the page? | `layouts.css` |
| Is it a reusable UI component with BEM naming? | `components.css` |
| Is it a single-property override? | `utilities.css` |
| Am I creating a 6th file? | **Stop.** It belongs in one of these 5. |

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

Organize properties logically:

```css
.component {
  /* 1. Layout */
  display: flex;
  grid-template-columns: 1fr 1fr;

  /* 2. Positioning */
  position: relative;
  top: 0;
  z-index: var(--z-dropdown);

  /* 3. Box Model */
  width: 100%;
  padding: var(--space-4);
  margin: 0;

  /* 4. Typography */
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--color-text);

  /* 5. Visual */
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);

  /* 6. Animation */
  transition: box-shadow var(--duration-fast);
}
```

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
