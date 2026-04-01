---
name: css-positioning
description: CSS layout and positioning — box model, grid, flexbox, responsive patterns, and property ordering
user-invocable: false
---

# CSS Positioning Skill

**Version:** 1.0

> Positioning controls where things sit on the page. Box model sets the size, grid and flexbox arrange the structure, and responsive patterns adapt it across viewports.

## The Problem

AI agents default to the first layout approach that works — usually absolute positioning or deeply nested flexbox — without considering whether grid would be simpler or whether the layout even needs to change at different viewports. Across sessions, similar pages end up with inconsistent layout approaches: one uses grid, another uses flexbox for the same pattern, a third hard-codes widths. The result is layouts that technically work but fight each other when requirements change.

## Consumption

- **Builders:** Read `## Builder Checklist` before writing any layout CSS. Grid vs flexbox is a structural decision that's expensive to change.
- **Refactorers:** Use `## Enforced Rules` to find layout violations. Read narrative sections for correct pattern selection.
- **Both:** Narrative sections are the authoritative standard. Checklist and rules table are compressed views of the same content.

---

## Scope and Boundaries

**This skill covers:**
- Box model (`box-sizing`, `margin`, `padding`, `width`, `height`, `overflow`)
- Grid Layout (`display: grid`, template columns/rows, areas, gap)
- Flexbox (`display: flex`, direction, wrap, alignment, gap)
- Content flow (`position`, `float`, `z-index`, stacking contexts)
- Responsive patterns (mobile-first breakpoints, container widths)
- CSS property ordering (the 5-group convention)
- File architecture for layouts (`layouts.css` role)

**Defers to other skills:**
- `css-selectors`: Naming conventions, specificity, cascade order
- `css-styling`: Design tokens, colors, typography, shadows, animation
- `design`: Layout philosophy (when to use grid vs flexbox), design system principles

**Use this skill when:** You're building page layouts, choosing grid vs flexbox, writing responsive styles, or organizing CSS properties within a rule.

---

## Box Model

Every element is a box. Understanding the model prevents mysterious spacing issues.

```
┌─────────────────────────────────────┐
│ margin                              │
│  ┌──────────────────────────────┐   │
│  │ border                       │   │
│  │  ┌───────────────────────┐   │   │
│  │  │ padding               │   │   │
│  │  │  ┌────────────────┐   │   │   │
│  │  │  │ content         │   │   │   │
│  │  │  └────────────────┘   │   │   │
│  │  └───────────────────────┘   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Rules

- **Always use `box-sizing: border-box`** — Padding and border are included in the element's width/height. This should be set globally in `reset.css`:
  ```css
  *, *::before, *::after { box-sizing: border-box; }
  ```

- **Use `gap` instead of margin for sibling spacing** — On flex/grid parents, `gap` creates consistent gutters without the margin-collapsing headaches:
  ```css
  /* BAD — margin creates edge-case bugs */
  .card { margin-bottom: var(--space-4); }
  .card:last-child { margin-bottom: 0; }

  /* GOOD — gap on parent, clean and predictable */
  .card-list { display: flex; flex-direction: column; gap: var(--space-4); }
  ```

- **Use `margin-inline: auto` for centering** — Centers a block element horizontally:
  ```css
  .container { max-width: 1280px; margin-inline: auto; }
  ```

- **Avoid fixed heights** — Let content determine height. Use `min-height` if a minimum is needed.

### Overflow

| Value | Behavior | Use when... |
|-------|----------|-------------|
| `visible` | Content overflows (default) | Almost always — let content flow |
| `hidden` | Clips overflow silently | Decorative containers, image crops |
| `auto` | Scrollbar only when needed | Scrollable panels, code blocks |
| `scroll` | Always shows scrollbar | Avoid — `auto` is almost always better |

---

## Grid Layout

**Use grid when:** You need a 2D layout (rows AND columns), or a structured page scaffold.

### Page Layout with Named Areas

```css
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

.page-header { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main { grid-area: main; }
.page-footer { grid-area: footer; }
```

### Card Grids

```css
/* Fixed column count */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

/* Auto-fit (responsive without media queries) */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

### When NOT to Use Grid

- Single row/column of items → Use flexbox
- Just centering something → Use flexbox or `margin-inline: auto`
- The layout doesn't need rows AND columns

---

## Flexbox

**Use flexbox when:** You need a 1D layout (single row OR column), alignment, or distribution of space.

### Common Patterns

```css
/* Horizontal navigation */
.nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Vertical stack */
.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Space between (logo left, nav right) */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Centered content (horizontal + vertical) */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

/* Wrapping card gallery */
.card-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}
.card-gallery > * {
  flex: 1 1 300px; /* Grow, shrink, minimum 300px */
}
```

### Flex Properties Cheat Sheet

| Property | On | Does |
|----------|-----|------|
| `justify-content` | Parent | Distributes along main axis |
| `align-items` | Parent | Aligns along cross axis |
| `gap` | Parent | Space between children |
| `flex-direction` | Parent | `row` (default) or `column` |
| `flex-wrap` | Parent | Allow wrapping |
| `flex: 1` | Child | Grow to fill available space |
| `flex: 0 0 auto` | Child | Don't grow or shrink |
| `align-self` | Child | Override parent's `align-items` |

---

## Content Flow and Positioning

### Position Values

| Value | Behavior | Use when... |
|-------|----------|-------------|
| `static` | Normal flow (default) | Almost always — don't change it unless needed |
| `relative` | Normal flow + offset | Nudging an element, creating a positioning context |
| `absolute` | Removed from flow, relative to nearest positioned ancestor | Overlays, badges, positioned icons |
| `fixed` | Removed from flow, relative to viewport | Sticky headers, floating buttons |
| `sticky` | Normal flow until scroll threshold, then sticks | Table headers, section headers |

### Z-Index and Stacking

Z-index only works on positioned elements (`relative`, `absolute`, `fixed`, `sticky`). **Always use tokens** for z-index to prevent stacking conflicts:

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-tooltip: 500;
  --z-toast: 600;
}

.dropdown { z-index: var(--z-dropdown); }
.modal { z-index: var(--z-modal); }
```

**Never use arbitrary z-index values** like `z-index: 9999`. They create conflicts that are impossible to debug.

### Float

**Don't use float for layout.** Use grid or flexbox. Float is only appropriate for wrapping text around an image:

```css
.article-image {
  float: left;
  margin-right: var(--space-4);
  margin-bottom: var(--space-2);
}
```

---

## Responsive Patterns

### Mobile-First Breakpoints

Base styles are mobile. Add complexity at larger viewports with `min-width`:

```css
/* Mobile (base — no media query) */
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Standard Breakpoints

| Name | Width | Typical device |
|------|-------|----------------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |

### Container Pattern

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--space-4);
}

@media (min-width: 768px) {
  .container { padding-inline: var(--space-6); }
}
```

### Never Use `max-width` Queries

```css
/* BAD — desktop-first, have to undo at smaller sizes */
@media (max-width: 768px) {
  .sidebar { display: none; }
}

/* GOOD — mobile-first, add features at larger sizes */
.sidebar { display: none; }
@media (min-width: 768px) {
  .sidebar { display: block; }
}
```

---

## Property Ordering

Within each CSS rule, organize properties by group. The 5-group convention keeps rules scannable:

```css
.component {
  /* 1. Positioning */
  position: relative;
  top: 0;
  z-index: var(--z-dropdown);
  inset: 0;

  /* 2. Box Model */
  display: flex;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  width: 100%;
  height: auto;
  min-width: 0;
  max-width: 100%;
  margin: 0;
  padding: var(--space-4);
  overflow: hidden;
  box-sizing: border-box;

  /* 3. Typography */
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  text-align: left;
  white-space: normal;

  /* 4. Visual */
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  outline: none;
  opacity: 1;
  transform: translateY(0);
  cursor: pointer;

  /* 5. Animation */
  transition: box-shadow var(--duration-fast);
  animation: fade-in var(--duration-normal);
  will-change: transform;
}
```

### The 5 Groups

| # | Group | What goes here |
|---|-------|---------------|
| 1 | **Positioning** | `position`, `top/right/bottom/left`, `inset`, `z-index`, `float`, `clear` |
| 2 | **Box Model** | `display`, `flex-*`, `grid-*`, `gap`, `align-*`, `justify-*`, `width`, `height`, `min/max-*`, `margin`, `padding`, `overflow`, `box-sizing` |
| 3 | **Typography** | `font-*`, `line-height`, `letter-spacing`, `text-*`, `color`, `white-space`, `word-break` |
| 4 | **Visual** | `background-*`, `border-*`, `box-shadow`, `outline`, `opacity`, `transform`, `cursor`, `pointer-events`, `visibility` |
| 5 | **Animation** | `transition-*`, `animation-*`, `will-change` |

---

## File Architecture: `layouts.css`

Layout rules live in `layouts.css` — the third file in the cascade.

**What goes in:** Page scaffolding, grid systems, containers, section spacing, responsive breakpoints for layout shifts.

**What doesn't:** Anything visual — colors, borders, shadows, typography. If it affects how something *looks* rather than where it *sits*, it's a component or override.

```css
/* =================================================================
   CONTAINERS
   ================================================================= */
.container { }

/* =================================================================
   PAGE LAYOUTS
   ================================================================= */
.page-layout { }

/* =================================================================
   GRIDS
   ================================================================= */
.grid-2 { }
.grid-3 { }
.grid-auto { }

/* =================================================================
   SECTIONS
   ================================================================= */
.section { }

/* =================================================================
   RESPONSIVE OVERRIDES
   ================================================================= */
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
```

---

## Builder Checklist

Before writing layout CSS:

- [ ] Grid for 2D layouts (rows + columns), flexbox for 1D (single direction)
- [ ] `box-sizing: border-box` is set globally
- [ ] `gap` for sibling spacing, not margin on children
- [ ] No fixed heights — use `min-height` if needed
- [ ] No floats for layout (grid/flexbox only)
- [ ] Mobile-first: base styles are mobile, `min-width` for larger viewports
- [ ] Standard breakpoints: 640px, 768px, 1024px, 1280px
- [ ] Z-index uses tokens, not arbitrary numbers
- [ ] Properties ordered: Positioning → Box Model → Typography → Visual → Animation
- [ ] Layout classes live in `layouts.css`, not scattered across files

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-web team).

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `css-property-order` | warn | Properties not in 5-group order |
| `mobile-first` | warn | `max-width` media queries instead of `min-width` |
| `no-hardcoded-z-index` | warn | Z-index outside `var(--z-*)` |
| `unit-zero` | warn | `0px`/`0rem` instead of unitless `0` |
