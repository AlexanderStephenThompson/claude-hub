# Web Cleaning Profile

Project type detection: `package.json` exists, or `.html`/`.css`/`.jsx`/`.tsx` files present.

---

## CSS File Consolidation

**This is the highest-priority task for web projects.**

### The 5-File Target (Non-Negotiable for Vanilla CSS)

```
styles/
├── reset.css       # Browser normalization — clean slate
├── global.css      # Design tokens (:root) + element defaults
├── layouts.css     # Page scaffolding, grids
├── components.css  # All component styles
└── overrides.css   # Exceptions — one-offs, page-specific, utilities
```

### Enforcement Rules

| Condition | Action |
|-----------|--------|
| ≤5 files, canonical names | Pass — proceed to other fixes |
| ≤5 files, wrong names | Rename to canonical names before proceeding |
| 6-7 files | Merge until ≤5. Document if truly can't. |
| 8+ files | **STOP.** Create a Restructure Plan (see below) before any other CSS work. |
| 0 canonical names found | **STOP.** Create a Restructure Plan — the project has no recognizable CSS structure. |

### Restructure Plan (When Structure Is Significantly Wrong)

When the Formatter encounters 8+ CSS files OR zero canonical names (`reset.css`, `global.css`, `layouts.css`, `components.css`, `overrides.css`), **stop all other CSS work** and create a plan:

1. **Inventory** — List every CSS file with a one-line summary of its contents
2. **Mapping** — For each file, assign it to one of the 5 canonical destinations:
   - Browser resets → `reset.css`
   - Variables/tokens + element defaults → `global.css`
   - Page layouts, grids → `layouts.css`
   - Component styles → `components.css`
   - Helpers, one-offs, page-specific → `overrides.css`
3. **Execution order** — Which files to merge first (dependencies matter)
4. **Import updates** — Every `@import` or `<link>` that needs updating
5. **Execute the plan** — Merge files in order, delete originals, update imports

Include the Restructure Plan in the handoff to Auditor.

### How to Consolidate

For each CSS file beyond the 5 core files:

1. **Identify its contents** — What styles does it contain?
2. **Determine destination** — Which of the 5 core files should it merge into?
   - Browser resets, normalizations → `reset.css`
   - Variables/tokens, element defaults → `global.css`
   - Page layouts, grids → `layouts.css`
   - Component styles → `components.css`
   - Helper classes (.hidden, .flex, .mt-4), one-offs → `overrides.css`
3. **Merge the content** — Append to destination with a comment showing origin:
   ```css
   /* === Merged from: old-file.css === */
   .merged-styles { ... }
   ```
4. **Delete the original file**
5. **Update all imports/references** — Find every `@import` or `<link>` that referenced the old file

### Exceptions (Must Be Documented)

Only accept >5 files if:
- **CSS Modules** — Framework requires per-component files (can't merge)
- **Third-party CSS** — Vendor CSS that shouldn't be modified
- **50+ components** — May justify splitting `components.css` by domain

If an exception applies, document WHY in a comment at the top of the relevant file.

---

## CSS Consistency (The AI-Generated CSS Problem)

**This is the most important thing this profile fixes.**

AI generates CSS that works locally but drifts globally. Without memory of prior sessions, similar components end up with slightly different padding, margins, colors, and spacing — not by choice, but by independence. The drift itself isn't the problem. **The problem is that every future edit becomes a partial fix.** You change `.card`'s background, but `.panel` uses `#fff`, `.info-box` uses `white`, and `.content-block` uses `rgb(255,255,255)` — same color, different formats, so only one gets updated. Now you're playing whack-a-mole and never confident it's actually fixed everywhere.

**Consolidation makes one edit propagate everywhere.** When every variant uses `var(--color-surface)`, changing that token once updates all of them. No hunting. No partial fixes. That's the goal of everything below.

### Near-Duplicate Detection

Look for rule sets that are 80%+ identical but differ in small ways. These are the variants that cause partial fixes:

```css
/* BEFORE — generated in separate sessions, same intent, different values */
.card {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.panel {
  padding: 1rem;          /* same value, different unit */
  border-radius: 8px;
  background: #fff;       /* same color, different format */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.info-box {
  padding: 16px;
  border-radius: 0.5rem;  /* same value (8px), yet another unit */
  background: white;      /* same color, yet another format */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* An edit to "change the background" touches .card but misses .panel and .info-box
   because they use different representations of the same color. */

/* AFTER — consolidated into one token-based pattern */
.card, .panel, .info-box {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

/* Now changing --color-surface updates ALL of them. One edit, full propagation. */
```

**What to look for:**

| Pattern | Why It Causes Partial Fixes | Fix |
|---------|----------------------------|-----|
| Same value, different unit | `16px` vs `1rem` — a search for one misses the other | Normalize to one unit, then tokenize |
| Same color, different format | `#3b82f6` vs `rgb(59,130,246)` — AI updates one, not the other | Normalize all to token |
| Near-identical spacing | `padding: 14px` vs `16px` on similar components — unclear which is "correct" | Unify to one token value |
| Duplicate layout patterns | Multiple components with the same flex setup, written independently | Extract shared layout class |
| Redundant selectors | `.btn-primary` and `.button-main` doing the same thing | Keep one, search-replace the other |
| Conflicting values | `.header { z-index: 100 }` and `.nav { z-index: 99 }` — fragile stacking | Audit z-index scale, use tokens |

**How to hunt them down:**

1. **Group by visual role** — Find all "card-like" components, all "button-like" components, all "section containers." Compare their properties side by side.
2. **Search for raw values** — Search for common hardcoded values (`16px`, `#fff`, `8px`, `1rem`). Every hit is a potential variant that should be a token.
3. **Check property clusters** — If 3+ selectors share the same `border-radius` + `box-shadow` + `padding` pattern, they're variants of the same design intent.

### Exact Duplicate & Unused CSS Removal

After consolidation, scan for:
- Identical rule sets in different locations → keep one, delete the rest
- Properties repeated within the same selector → keep the last declaration
- Selectors with no matching HTML elements anywhere in the project → remove entirely
- Classes defined in CSS but never applied in any HTML/JSX file → remove entirely

### Value Normalization

Before tokenizing, normalize inconsistent representations of the same value:

```css
/* These are all the same — pick one canonical form */
#fff    →  #ffffff  →  rgb(255,255,255)  →  white
16px    →  1rem     →  1em (at default font-size)
0px     →  0        (unit-less zero is preferred)
```

**Normalization rules:**
- Colors: normalize to the format used by `global.css` (hex6 preferred: `#3b82f6`)
- Spacing: normalize to `px` or `rem` consistently (match project convention)
- Zero values: always unit-less (`0` not `0px`)
- Shorthand: use shorthand where all sides are equal (`margin: 16px` not `margin: 16px 16px 16px 16px`)

### Property Order Normalization

When consolidating or touching CSS rules, normalize property order to match the 5-group convention:

1. **Positioning** — `position`, `top`, `right`, `bottom`, `left`, `z-index`, `float`, `clear`, `inset`
2. **Box Model** — `display`, `flex-*`, `grid-*`, `gap`, `align-*`, `justify-*`, `width`, `height`, `min/max-*`, `margin`, `padding`, `overflow`, `box-sizing`
3. **Typography** — `font-*`, `line-height`, `letter-spacing`, `text-*`, `color`, `white-space`, `word-break`
4. **Visual** — `border-*`, `background-*`, `box-shadow`, `outline`, `opacity`, `transform`, `cursor`, `pointer-events`, `visibility`
5. **Animation** — `transition-*`, `animation-*`, `will-change`

```css
/* BEFORE — properties in random order */
.card {
  background: var(--color-surface);
  padding: var(--space-4);
  position: relative;
  transition: box-shadow var(--duration-fast);
  font-size: var(--font-size-base);
}

/* AFTER — properties grouped by convention */
.card {
  position: relative;
  padding: var(--space-4);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  transition: box-shadow var(--duration-fast);
}
```

**Enforcement:** `check.js` rule `css-property-order` warns when properties appear out of group order.

---

## Token Replacement

After deduplication and normalization, replace hardcoded values with CSS variables.

### Discovery

Scan all CSS files for repeated hardcoded values:

```bash
# Colors: any hex, rgb(), hsl() used more than once
# Spacing: any px/rem value used more than twice
# Typography: any font-size, font-weight, line-height used more than twice
# Borders: any border-radius, border-width used more than twice
# Shadows: any box-shadow value used more than once
# Z-index: any z-index value
```

### Replacement

```css
/* Before */
.card { background: #3b82f6; padding: 16px; border-radius: 8px; }
.badge { background: #3b82f6; padding: 4px 8px; border-radius: 4px; }

/* After */
.card { background: var(--color-primary); padding: var(--space-4); border-radius: var(--radius-md); }
.badge { background: var(--color-primary); padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); }
```

### Token Naming Convention

| Category | Pattern | Examples |
|----------|---------|----------|
| Colors | `--color-{name}` | `--color-primary`, `--color-surface`, `--color-text` |
| Spacing | `--space-{scale}` | `--space-1` (4px), `--space-2` (8px), `--space-4` (16px) |
| Typography | `--font-size-{name}` | `--font-size-sm`, `--font-size-base`, `--font-size-lg` |
| Borders | `--radius-{size}` | `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (16px) |
| Shadows | `--shadow-{size}` | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Z-index | `--z-{name}` | `--z-dropdown`, `--z-modal`, `--z-toast` |

If the project already has a token system, use its naming. Only create new tokens for values that don't have one yet. Add all new tokens to `global.css`.

---

## HTML: Lean Markup

HTML should describe structure, not style. When HTML is clean, you can read it and understand what things *are* without decoding what they *look like*. The CSS handles appearance. The moment HTML starts accumulating classes to control layout, spacing, colors, or states, you've mixed concerns — and now every visual change requires editing HTML instead of just updating a CSS rule or token.

**The goal:** Each element has 1–2 semantic class names that describe *what it is*, and CSS rules handle the rest. If you're reading HTML and see `class="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200"`, that's not HTML — that's CSS written in the wrong file.

### Element Replacements

| Before | After |
|--------|-------|
| `<div class="header">` | `<header>` |
| `<div class="footer">` | `<footer>` |
| `<div class="navigation">` | `<nav>` |
| `<div class="main">` | `<main>` |
| `<div class="sidebar">` | `<aside>` |
| `<div class="article">` | `<article>` |
| `<div class="section">` | `<section>` |
| `<div onclick="...">` | `<button type="button" onclick="...">` |
| `<div class="list">` | `<ul>` or `<ol>` |
| `<div class="table">` (or divs styled as grid data) | `<table>` with `<thead>`, `<tbody>`, `<th>`, `<td>` |

### Heading Hierarchy

- Ensure hierarchy: h1 → h2 → h3 in order. No skipping h2 to go straight to h3.
- Exactly one `<h1>` per page/view.
- Headings are for document structure only. Flag any `<h1>`–`<h6>` used purely for font size/weight — style with CSS classes instead.

### Form Labels

```html
<!-- Before -->
<input type="text" placeholder="Email">

<!-- After -->
<label for="email">Email</label>
<input type="text" id="email" placeholder="Email">
```

### Button Types

All `<button>` elements need explicit `type="button"` or `type="submit"`.

### Image Alt Text

- All `<img>` elements need meaningful `alt` attributes (not empty, not "image").
- Decorative images get `alt=""` explicitly — this tells screen readers to skip them.

### Class Discipline

Classes name *what something is*, not how it looks. CSS rules handle the styling. This keeps HTML readable and means visual changes happen in one place (CSS) instead of scattered across every template.

**Target: 1–3 classes per element.** More than that is a smell.

```html
<!-- BLOATED — styling logic leaked into HTML -->
<div class="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
  <img class="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500" src="avatar.jpg" alt="User avatar">
  <div class="flex flex-col gap-1">
    <span class="text-lg font-semibold text-gray-900 leading-tight">Jane Smith</span>
    <span class="text-sm text-gray-500 font-normal tracking-wide">Engineer</span>
  </div>
</div>

<!-- LEAN — HTML says what it is, CSS says how it looks -->
<article class="user-card">
  <img class="user-card__avatar" src="avatar.jpg" alt="Jane Smith">
  <div class="user-card__info">
    <span class="user-card__name">Jane Smith</span>
    <span class="user-card__role">Engineer</span>
  </div>
</article>
```

The lean version is half the size, instantly readable, and every visual property lives in CSS where tokens can control it.

**What to fix:**

| Pattern | Problem | Action |
|---------|---------|--------|
| 4+ classes on one element | Styling leaked into HTML | Consolidate into 1–2 semantic classes |
| Utility class chains | Layout decisions embedded in markup | Extract to a named CSS rule |
| Redundant classes | `class="mt-4 mt-8"` — which wins? | Remove the conflicting one |
| Presentational class names | `.blue-text`, `.large-padding`, `.float-left` | Rename to describe purpose, not appearance |
| Repeated class patterns | Same 5-class combo on 10 elements | Extract to one semantic class |

**If Tailwind is present:** Don't extend it. Extract utility chains into semantic classes in `components.css` that reference design tokens. New CSS always goes in vanilla `.css` files. Migrate incrementally as you touch files.

### Attribute Hygiene

- **Inline styles** → move to CSS classes. Only exception: truly dynamic values computed at runtime (e.g., `style={{ width: calculatedWidth }}`). Even then, prefer CSS custom properties.
- **Excessive `data-*` attributes** (4+ on one element) → flag for review. Often signals logic that belongs in JS state, not DOM attributes.
- **Redundant boolean attributes** → clean up. `disabled="disabled"` is just `disabled`. `hidden="true"` is just `hidden`.
- **Empty or meaningless attributes** → remove. `class=""`, `id=""`, `title=""` with no value add noise.

---

## Component State Coverage

Interactive elements without complete state coverage create inconsistent UX — buttons that don't look clickable, inputs that lose focus rings, disabled elements that still look active. Every interactive element needs all 5 states defined.

### Required States

| State | Selector | Purpose |
|-------|----------|---------|
| Default | (base selector) | Base appearance |
| Hover | `:hover` | Visual feedback on mouse over |
| Active | `:active` | Visual feedback when pressed |
| Focus | `:focus-visible` | Keyboard navigation indicator |
| Disabled | `:disabled`, `[disabled]`, `.is-disabled` | Non-interactive appearance |

### What to Check

- Are there interactive elements (buttons, links, inputs, selects) missing any of the 5 states?
- Do similar components have matching state treatments? (All buttons should hover the same way)
- Are hover/focus transitions consistent across the UI?
- Do disabled states use consistent opacity/color treatment?
- Are focus indicators visible and meet contrast requirements?

---

## Tier Architecture (Flag Only)

The Formatter does not move files between tiers — that is a structural change owned by the Organizer and the Refactorer. However, the Formatter SHOULD flag tier violations encountered during code cleaning so the Auditor can include them in the audit report.

### What to Flag

While cleaning code, note these patterns in the "Flagged for Auditor" section of your handoff:

| Pattern | Tier Violation | Correct Location |
|---------|---------------|-----------------|
| API calls in React components | Presentation doing data work | `02-logic/api/` or custom hooks |
| Business logic in components (validation, calculations, formatting) | Presentation doing logic work | `02-logic/services/` or `02-logic/validators/` |
| Direct database access outside `03-data/` | Data layer bypass | `03-data/repositories/` |
| UI concerns in service files (JSX, CSS class manipulation, rendering) | Logic doing presentation work | `01-presentation/` |
| Import direction violations (data importing from logic, logic from presentation) | Reverse dependency | Refactor import chain |

### What NOT to Do

- Do NOT move files between tiers (Organizer/Refactorer scope)
- Do NOT refactor imports to fix tier violations (Refactorer scope)
- Do NOT introduce new tier folders (Organizer scope)
- Do NOT block on tier violations — flag them and continue cleaning

---

## Anti-Patterns

- **Don't change visual appearance** — Consolidation should be invisible to users
- **Don't remove CSS that might be used dynamically** — Flag uncertain cases
- **Don't break responsive layouts** — Test after merging
- **Don't over-consolidate** — `components.css` can be large; that's okay
- **Don't ignore framework constraints** — CSS Modules can't merge; document this
