# Web Cleaning Profile

Project type detection: `package.json` exists, or `.html`/`.css`/`.jsx`/`.tsx` files present.

---

## CSS File Consolidation

**This is the highest-priority task for web projects.**

### The 5-File Target (Non-Negotiable for Vanilla CSS)

```
styles/
├── tokens.css      # CSS variables only
├── base.css        # Reset + element defaults
├── layouts.css     # Page scaffolding, grids
├── components.css  # All component styles
└── utilities.css   # Helper classes
```

### Enforcement Rules

| CSS File Count | Action |
|----------------|--------|
| ≤5 files | Pass — proceed to other fixes |
| 6-7 files | Merge until ≤5. Document if truly can't. |
| 8+ files | **MUST consolidate.** This is the primary task. |

### How to Consolidate

For each CSS file beyond the 5 core files:

1. **Identify its contents** — What styles does it contain?
2. **Determine destination** — Which of the 5 core files should it merge into?
   - Variables/tokens → `tokens.css`
   - Resets, typography defaults → `base.css`
   - Page layouts, grids → `layouts.css`
   - Component styles → `components.css`
   - Helper classes (.hidden, .flex, .mt-4) → `utilities.css`
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

### Exact Duplicate Removal

After consolidation, scan for:
- Identical rule sets in different locations → keep one, delete the rest
- Properties repeated within the same selector → keep the last declaration
- Selectors that are never matched by any HTML element → remove entirely

### Value Normalization

Before tokenizing, normalize inconsistent representations of the same value:

```css
/* These are all the same — pick one canonical form */
#fff    →  #ffffff  →  rgb(255,255,255)  →  white
16px    →  1rem     →  1em (at default font-size)
0px     →  0        (unit-less zero is preferred)
```

**Normalization rules:**
- Colors: normalize to the format used by `tokens.css` (hex6 preferred: `#3b82f6`)
- Spacing: normalize to `px` or `rem` consistently (match project convention)
- Zero values: always unit-less (`0` not `0px`)
- Shorthand: use shorthand where all sides are equal (`margin: 16px` not `margin: 16px 16px 16px 16px`)

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

If the project already has a token system, use its naming. Only create new tokens for values that don't have one yet. Add all new tokens to `tokens.css`.

---

## HTML Semantic Fixes

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

### Heading Hierarchy

Ensure hierarchy: h1 → h2 → h3 in order. No skipping h2 to go straight to h3.

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

All `<img>` elements need meaningful `alt` attributes.

### Inline Style Removal

```html
<!-- Before -->
<div style="margin-top: 20px; color: blue;">

<!-- After (add class to CSS) -->
<div class="section-intro">
```

### Class Bloat

Elements with 5+ classes should consolidate into a semantic class name.

---

## Anti-Patterns

- **Don't change visual appearance** — Consolidation should be invisible to users
- **Don't remove CSS that might be used dynamically** — Flag uncertain cases
- **Don't break responsive layouts** — Test after merging
- **Don't over-consolidate** — `components.css` can be large; that's okay
- **Don't ignore framework constraints** — CSS Modules can't merge; document this
