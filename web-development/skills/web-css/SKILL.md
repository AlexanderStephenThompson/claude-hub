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

All design values live in `styles/global.css` as CSS variables in `:root`. Token categories:

| Category | Examples | Scale |
|----------|----------|-------|
| Colors — Semantic | `--color-primary`, `--color-error` | Named by purpose |
| Colors — Neutrals | `--color-neutral-50` to `--color-neutral-900` | 10-step scale |
| Typography | `--font-size-xs` to `--font-size-3xl` | rem-based |
| Spacing | `--space-1` to `--space-16` | 4px base, 8px scale |
| Borders | `--radius-sm` to `--radius-full` | rem-based |
| Shadows | `--shadow-sm` to `--shadow-xl` | Size scale |
| Z-index | `--z-dropdown` to `--z-toast` | 100-600 |
| Animation | `--duration-fast` to `--duration-slow` | ms-based |

For full token definitions and values, see `assets/token-reference.md`.

**Dark mode:** Override semantic color tokens on `[data-theme="dark"]`. Components adapt automatically. See `assets/token-reference.md` for implementation.

---

## File Organization

### The 5-File Architecture

All projects use exactly 5 CSS files, loaded in cascade order:

```
styles/
├── reset.css       # 1. Browser normalization — clean slate
├── global.css      # 2. Design tokens (:root) + element defaults
├── layouts.css     # 3. Page scaffolding, grids, containers
├── components.css  # 4. All component styles (BEM)
└── overrides.css   # 5. Exceptions — one-offs, page-specific, utilities
```

**Enforced by:** `check.js` rules `css-file-count` (warn >5, error >7) and `css-file-names` (warn when no canonical names found).

For detailed descriptions of each file (what goes in, what doesn't, internal organization), see `references/file-architecture.md`.

### Where Does This Go?

| Ask yourself... | Answer → File |
|-----------------|---------------|
| Is it a browser reset with no design opinion? | `reset.css` |
| Is it a CSS variable or bare-element default? | `global.css` |
| Does it control where things sit on the page? | `layouts.css` |
| Is it a reusable UI component with BEM naming? | `components.css` |
| Is it an exception, one-off, or single-property override? | `overrides.css` |
| Am I creating a 6th file? | **Stop.** It belongs in one of these 5. |

---

## Naming Conventions

### BEM-Inspired (Simplified)

```css
.product-card { }          /* Block */
.product-card__image { }   /* Element (child of block) */
.product-card--featured { } /* Modifier (variation) */
.product-card.is-loading { } /* State (JS-toggled) */
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

- **Mobile-first only:** Use `min-width` breakpoints. Never `max-width`.
- **Standard breakpoints:** 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Grid for structure, Flexbox for flow.**
- **All interactive elements need 5 states:** default, hover, active, focus-visible, disabled.

For code examples (breakpoints, container pattern, grid/flexbox layouts, component states, accessibility patterns), see `assets/css-patterns.md`.

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

## No Tailwind. No PostCSS.

This design system uses **vanilla CSS with design tokens**. No build tools, no utility-class frameworks, no preprocessors.

**Why not Tailwind?** It moves styling decisions into HTML, producing class bloat (`class="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md"`) that's hard to scan, hard to search, and impossible to update from one place. Our design system solves the same problem — consistency — by putting it where it belongs: in CSS variables and semantic class names.

**Why not PostCSS?** Modern CSS supports variables, nesting, `@layer`, `color-mix()`, and container queries natively. PostCSS adds a build step and tooling complexity for features browsers already handle.

**If a project already uses Tailwind or PostCSS:**
1. Don't add more Tailwind utilities or PostCSS plugins
2. New CSS goes in vanilla `.css` files using the 5-file architecture and design tokens
3. When touching existing Tailwind components, extract the utility chains into semantic classes in `components.css` that reference tokens
4. Migrate incrementally — don't rewrite everything at once, but don't extend the old pattern either

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-team). When updating these standards, update the corresponding check.js rules to match — and vice versa.

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `no-hardcoded-color` | error | Hex/rgb/hsl/named colors outside `var(--color-*)` |
| `no-hardcoded-spacing` | warn | Raw px spacing (>=4px) outside `var(--space-*)` |
| `no-hardcoded-font-size` | warn | Font sizes outside `var(--font-size-*)` |
| `no-hardcoded-radius` | warn | Border-radius outside `var(--radius-*)` |
| `no-hardcoded-shadow` | warn | Box/text-shadow outside `var(--shadow-*)` |
| `no-hardcoded-z-index` | warn | Z-index outside `var(--z-*)` |
| `css-property-order` | warn | Properties not in group order (Position > Box Model > Typography > Visual > Animation) |
| `css-import-order` | warn | `@import`/`<link>` order doesn't match cascade sequence |
| `mobile-first` | warn | `max-width` media queries instead of `min-width` |
| `no-important` | warn | `!important` usage |
| `no-id-selector` | warn | `#id` selectors (specificity wars) |
| `unit-zero` | warn | `0px`/`0rem` instead of unitless `0` |
| `css-file-count` | warn/error | More than 5 (warn) or 7 (error) CSS files |
| `css-file-names` | warn | No canonical CSS file names (reset/global/layouts/components/overrides) |

---

## References

- `references/file-architecture.md` — Detailed descriptions of each CSS file
- `assets/token-reference.md` — Full token definitions, usage examples, dark mode
- `assets/css-patterns.md` — Responsive, layout, state, and accessibility code examples
