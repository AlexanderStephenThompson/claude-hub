---
name: css-selectors
description: CSS selectors, naming conventions, specificity, cascade order, and dead CSS elimination
user-invocable: false
---

# CSS Selectors Skill

**Version:** 1.0

> Selectors are how CSS finds elements. Get naming, specificity, and cascade right and styles compose predictably. Get them wrong and every edit becomes a game of whack-a-mole.

## The Problem

AI agents create new selectors each session without checking what already exists. After a few sessions, you have `.card`, `.panel`, `.info-box`, and `.content-block` — all doing the same thing with slightly different names. Worse, some use IDs for styling, some chain classes 4 levels deep, and the cascade order is unpredictable because imports are in the wrong sequence. Each new selector makes it harder to know which one actually applies.

## Consumption

- **Builders:** Read `## Builder Checklist` before writing any CSS selectors. Naming and specificity decisions are hard to change later.
- **Refactorers:** Use `## Enforced Rules` to find selector violations. Read narrative sections for naming conventions and consolidation patterns.
- **Both:** Narrative sections are the authoritative standard. Checklist and rules table are compressed views of the same content.

---

## Scope and Boundaries

**This skill covers:**
- Selector types (element, class, ID, attribute, pseudo-class, pseudo-element)
- Specificity rules and how to avoid specificity wars
- BEM naming conventions (Block, Element, Modifier)
- State classes (`.is-active`, `.is-loading`)
- Cascade and import order
- Dead CSS detection and removal
- Near-duplicate selector consolidation
- The `!important` anti-pattern

**Defers to other skills:**
- `css-positioning`: Box model, grid, flexbox, layout patterns
- `css-styling`: Design tokens, colors, typography, shadows, animation
- `design`: Design system philosophy, component states requirements

**Use this skill when:** You're naming classes, debugging specificity issues, cleaning up dead CSS, or consolidating duplicate selectors.

---

## Selector Types

### Singular Selectors

Target a single element by one criterion.

```css
/* Element selector — targets all instances of a tag */
p { }
button { }

/* Class selector — targets elements with a specific class */
.card { }
.btn-primary { }

/* ID selector — targets one unique element (avoid for styling) */
#main-nav { }

/* Universal selector — targets everything */
* { }
```

### Multiple Selectors

Apply the same styles to several selectors at once.

```css
/* Grouped — same styles for multiple selectors */
h1, h2, h3 {
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

/* Shared foundation for near-identical components */
.card, .panel, .info-box {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}
```

### Targeted Selectors

Narrow down targets using combinators, attributes, and pseudo-classes.

```css
/* Descendant — any nested depth */
.nav a { }

/* Child — direct children only */
.nav > li { }

/* Adjacent sibling — immediately after */
h2 + p { }

/* General sibling — any following sibling */
h2 ~ p { }

/* Attribute selectors */
input[type="email"] { }
a[href^="https"] { }    /* starts with */
a[href$=".pdf"] { }     /* ends with */
a[data-active] { }      /* has attribute */

/* Pseudo-classes — state-based */
.btn:hover { }
.btn:focus-visible { }
.btn:disabled { }
.btn:first-child { }
.btn:nth-child(odd) { }
.input:valid { }
.input:invalid { }

/* Pseudo-elements — generated content */
.card::before { }
.card::after { }
.list-item::marker { }
::placeholder { }
::selection { }
```

---

## Naming Conventions

### BEM (Block Element Modifier)

The standard naming system for component-scoped CSS.

```css
/* Block — the component itself */
.product-card { }

/* Element — a child part of the block (double underscore) */
.product-card__image { }
.product-card__title { }
.product-card__price { }

/* Modifier — a variation of the block (double hyphen) */
.product-card--featured { }
.product-card--compact { }

/* State — JS-toggled behavior (dot prefix) */
.product-card.is-selected { }
.product-card.is-loading { }
```

### Naming Rules

| Type | Convention | Examples |
|------|-----------|---------|
| Block | kebab-case, noun-based | `.user-profile`, `.search-bar`, `.nav-menu` |
| Element | `__element` | `.user-profile__avatar`, `.search-bar__input` |
| Modifier | `--modifier` | `.user-profile--compact`, `.btn--primary` |
| State | `.is-state` | `.is-active`, `.is-loading`, `.is-hidden` |
| Utility | `.u-utility` | `.u-visually-hidden`, `.u-text-center`, `.u-mt-4` |
| Layout | `.page-*`, `.grid-*`, `.container` | `.page-layout`, `.grid-3`, `.container` |

### What NOT to Name

| Anti-Pattern | Problem | Fix |
|---|---|---|
| `.blue-text` | Describes appearance, not purpose | `.error-message` or `.text-muted` |
| `.large-padding` | Describes styling, not role | `.section-content` or use a token |
| `.flex-row-gap-4` | Tailwind in disguise | `.nav-items` or `.card-actions` |
| `.div1`, `.div2` | Meaningless | Name by content/purpose |

**The rule:** Class names describe what something **is**, not what it **looks like**.

---

## Specificity

Specificity determines which rule wins when multiple selectors target the same element.

### The Hierarchy

| Level | Selector | Specificity | Use |
|-------|----------|-------------|-----|
| 0 | `*`, combinators | 0,0,0 | Resets only |
| 1 | `p`, `div`, `::before` | 0,0,1 | Element defaults |
| 2 | `.class`, `[attr]`, `:hover` | 0,1,0 | **Almost everything** |
| 3 | `#id` | 1,0,0 | **Avoid for styling** |
| ∞ | `!important` | Overrides all | **Last resort only** |

### Rules

1. **Stay in the class lane.** Almost all styling should use class selectors (specificity 0,1,0). This keeps everything at the same level, so source order and cascade determine the winner — which is predictable.

2. **No ID selectors for styling.** IDs have 10x the specificity of classes. Once you use `#header { color: red; }`, you need another ID or `!important` to override it. IDs are for JavaScript hooks and anchor links, not CSS.

3. **No `!important`.** It breaks the cascade entirely. The only acceptable uses:
   - Accessibility utilities (`.u-visually-hidden` needs to override everything)
   - Reduced motion media query (must override all transitions)
   - Third-party CSS overrides (when you can't change the source)

4. **Avoid deep nesting.** Max 3 levels: `.block .block__element .modifier`. Deeper nesting creates high specificity and brittle selectors.

```css
/* BAD — overly specific, hard to override */
.page .main .content .card .card__header .card__title { }

/* GOOD — flat, predictable */
.card__title { }
```

---

## Cascade and Import Order

The order CSS files load determines which rules win at equal specificity. This is why import order matters.

### Canonical Import Order

```css
@import 'reset.css';       /* 1. Browser normalization */
@import 'global.css';      /* 2. Tokens + element defaults */
@import 'layouts.css';     /* 3. Page structure */
@import 'components.css';  /* 4. UI components */
@import 'overrides.css';   /* 5. Exceptions (wins by loading last) */
```

Each file builds on the previous. Overrides load last so they win by source order, not by cranking up specificity.

### Section Order Within Files

Within each CSS file, organize selectors in a consistent order:

```css
/* =================================================================
   MAJOR SECTION (all caps)
   ================================================================= */

/* Base
   ----------------------------------------------------------------- */
.btn { }

/* Variants
   ----------------------------------------------------------------- */
.btn--primary { }
.btn--ghost { }

/* States
   ----------------------------------------------------------------- */
.btn:hover { }
.btn:active { }
.btn:focus-visible { }
.btn:disabled { }
```

---

## Dead CSS and Consolidation

### Finding Dead CSS

Dead selectors add weight without value. To identify them:

1. **Search for each class name** across all HTML, JSX, TSX, and JS files
2. **Check JavaScript** — classes may be applied dynamically (`classList.add('active')`)
3. **Check conditional rendering** — `className={condition ? 'active' : ''}`
4. **When uncertain, keep it** — flag in your report rather than removing

### Consolidating Near-Duplicates

When multiple selectors do the same thing with slightly different values:

```css
/* Before — three selectors doing the same job */
.card { padding: 16px; border-radius: 8px; background: #ffffff; }
.panel { padding: 1rem; border-radius: 8px; background: #fff; }
.info-box { padding: 16px; border-radius: 0.5rem; background: white; }

/* After — shared foundation + individual overrides */
.card, .panel, .info-box {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}
.panel { border-left: 3px solid var(--color-primary); }
```

### Consolidation Rules

- **80%+ shared properties** → Merge into a grouped selector, keep only differences
- **Identical selectors** → Keep the clearest name, delete others, update all HTML references
- **Near-identical values** (14px vs 16px on same intent) → Normalize to nearest token value
- **Same layout pattern repeated** → Extract to a shared layout class

---

## Builder Checklist

Before writing CSS selectors:

- [ ] Class names describe purpose, not appearance
- [ ] BEM naming for component classes (`.block__element--modifier`)
- [ ] States use `.is-*` prefix
- [ ] No ID selectors for styling
- [ ] No `!important` (except accessibility/reduced-motion)
- [ ] Nesting max 3 levels deep
- [ ] Checked for existing selectors before creating new ones
- [ ] Import order follows cascade sequence (reset → global → layouts → components → overrides)

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-web team).

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `no-important` | warn | `!important` usage |
| `no-id-selector` | warn | `#id` selectors for styling |
| `css-import-order` | warn | Import/link order doesn't match cascade sequence |
| `css-section-order` | warn | Major section headers out of canonical order |
| `css-file-count` | warn/error | More than 5 (warn) or 7 (error) CSS files |
| `css-file-names` | warn | No canonical CSS file names found |
