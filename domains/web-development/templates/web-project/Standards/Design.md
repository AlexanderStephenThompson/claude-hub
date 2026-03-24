# Design Standards

**Version:** 3.0
**Last Updated:** 2026-02-09

> Non-negotiable design and user interface standards for all agents. These are not preferences—they are requirements.

---

## Table of Contents

1. [Design System (Single Source of Truth)](#1-design-system-single-source-of-truth)
2. [CSS File Architecture](#2-css-file-architecture)
3. [Core Principles](#3-core-principles)
4. [Semantic HTML Requirements](#4-semantic-html-requirements)
5. [Human-Readable CSS Format](#5-human-readable-css-format)
6. [Component States (Required)](#6-component-states-required)
7. [Layout Philosophy](#7-layout-philosophy)
8. [Accessibility (WCAG AA)](#8-accessibility-wcag-aa)
9. [Premium UI Philosophy](#9-premium-ui-philosophy)
10. [Anti-Patterns (DO NOT DO THESE)](#10-anti-patterns-do-not-do-these)
11. [Responsive Breakpoints](#11-responsive-breakpoints)

---

## 1. Design System (Single Source of Truth)

**The design system lives in `/01-presentation/styles/global.css`** and is generated after the `/Start_Project` interview based on project context.

### Critical Rules

1. **ALWAYS use design tokens** - NEVER use hardcoded values
2. **All values come from `/01-presentation/styles/global.css`** - This is the single source of truth
3. **No magic numbers** - Every color, spacing, size, shadow, etc. must use a CSS variable
4. **Reference the design system** - For component patterns, see `/01-presentation/styles/global.css` and any design system documentation

### Examples

✅ **Correct - Uses design tokens:**
```css
.button {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-body);
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}
```

❌ **Wrong - Hardcoded values:**
```css
.button {
  padding: 8px 16px;           /* ❌ Use var(--space-sm) var(--space-md) */
  font-size: 14px;             /* ❌ Use var(--font-size-body) */
  background: #3B82F6;         /* ❌ Use var(--color-primary) */
  border-radius: 4px;          /* ❌ Use var(--radius-sm) */
  box-shadow: 0 1px 2px black; /* ❌ Use var(--shadow-sm) */
}
```

### Before Writing New CSS

**This is a gate, not a suggestion.** Every new class that duplicates an existing pattern creates drift. Prevention here saves hours of cleanup later.

1. **Check `global.css` first** — Does a token already exist for this value? Use it.
2. **Search for similar styles** — Is there already a class that does this? Reuse it.
3. **Check for near-matches** — Could an existing class work with a modifier?
4. **Extract if repeated** — Same properties appearing a second time? Stop and make it one class.

| Pattern | Why It's Dangerous |
|---------|--------------------|
| Raw values instead of tokens | `16px` in one place, `1rem` in another — same value, invisible to search-and-replace |
| New class for existing pattern | `.action-button` when `.btn-primary` already does the same thing |
| Copy-paste with tweaks | Pasting `.card` styles into `.panel` and changing one property — now they drift independently |

**Rule:** If a token exists, use it. If a class exists, extend it. Only create something new when nothing existing fits.

### What the Design System Contains

The `/01-presentation/styles/global.css` file defines:
- Complete color palette (neutrals, semantic, dark mode)
- Full typography scale (fonts, sizes, weights, line heights)
- Spacing system (4px base)
- Border radii
- Shadows
- Z-index layers
- Animation durations and easings
- Icon sizes
- Breakpoint values (as comments for reference)

**See `/01-presentation/styles/global.css` for the complete design system.**

---

## 2. CSS File Architecture

All projects use exactly 5 CSS files. Each file is a layer in the cascade, loaded in order so that later layers can override earlier ones without specificity hacks. When you know the layer, you know the file.

```
01-presentation/styles/
├── reset.css       # 1. Browser normalization — clean slate
├── global.css      # 2. Design tokens (:root) + element defaults
├── layouts.css     # 3. Page scaffolding, grids, containers
├── components.css  # 4. All component styles (BEM)
└── overrides.css   # 5. Exceptions — one-offs, page-specific, utilities
```

### What Goes Where

| File | Contains | Selectors |
|------|----------|-----------|
| **reset.css** | Box-sizing reset, margin/padding normalization | `*`, `*::before`, `*::after` |
| **global.css** | `:root` design tokens (CSS variables) + element defaults (body, headings, links, forms, images) | `:root`, element selectors (`body`, `h1`, `a`, `input`) |
| **layouts.css** | Page scaffolding, grid systems, container widths, section spacing, responsive breakpoint overrides | Layout-prefixed classes: `.page-*`, `.container`, `.grid-*`, `.section-*` |
| **components.css** | All reusable UI components — buttons, cards, modals, forms, navigation, alerts | BEM-named classes: `.block`, `.block__element`, `.block--modifier` |
| **overrides.css** | Single-purpose utility classes, one-off page-specific exceptions | Utility-prefixed classes: `.u-*` |

### Import Order

Files must be imported in this exact order. The cascade depends on it:

```html
<link rel="stylesheet" href="/01-presentation/styles/reset.css">
<link rel="stylesheet" href="/01-presentation/styles/global.css">
<link rel="stylesheet" href="/01-presentation/styles/layouts.css">
<link rel="stylesheet" href="/01-presentation/styles/components.css">
<link rel="stylesheet" href="/01-presentation/styles/overrides.css">
```

### Scaling Note

For projects with 50+ components, split `components.css` into domain files (`components/forms.css`, `components/navigation.css`) that get bundled. Document the split.

---

## 3. Core Principles

1. **Users First** - Prioritize user needs, workflows, and ease of use in every design decision
2. **Meticulous Craft** - Aim for precision, polish, and high quality in every UI element and interaction
3. **Speed & Performance** - Design for fast load times and snappy, responsive interactions
4. **Simplicity & Clarity** - Clean, uncluttered interface with unambiguous labels and instructions
5. **Focus & Efficiency** - Help users achieve goals quickly with minimal friction
6. **Consistency** - Maintain uniform design language across the entire application
7. **Accessibility (WCAG AA)** - Design for inclusivity with sufficient contrast, keyboard navigation, screen reader support
8. **Opinionated Design (Thoughtful Defaults)** - Establish clear, efficient default workflows and settings, reducing decision fatigue for users

---

## 4. Semantic HTML Requirements

**All HTML must be semantic and human-readable:**

✅ **Good - Semantic HTML:**
```html
<article class="product-card">
  <header>
    <h2>Product Name</h2>
  </header>
  <img src="..." alt="Product description">
  <p>Product description goes here.</p>
  <footer>
    <button type="button">Add to Cart</button>
  </footer>
</article>
```

❌ **Bad - Non-semantic divs:**
```html
<div class="prd-crd">
  <div class="hdr">
    <div class="ttl">Product Name</div>
  </div>
  <div class="img"></div>
  <div class="dsc">Product description goes here.</div>
  <div class="ftr">
    <div class="btn">Add to Cart</div>
  </div>
</div>
```

### Semantic HTML Rules

1. Use semantic tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
2. Buttons for actions: `<button>`, links for navigation: `<a>`
3. Forms use `<form>`, `<label>`, `<input>`, `<select>`, `<textarea>`
4. Lists use `<ul>`, `<ol>`, `<li>` (not divs with bullets)
5. Headings follow hierarchy: `<h1>` → `<h2>` → `<h3>` (no skipping levels)
6. Images have descriptive `alt` text
7. Tables use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` for tabular data

---

## 5. Human-Readable CSS Format

**CSS must be readable and organized:**

✅ **Good - Human-readable:**
```css
.product-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
  background-color: var(--color-neutral-50);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  transition: all var(--duration-fast) var(--easing-standard);
}

.product-card__title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
}
```

❌ **Bad - Unreadable:**
```css
.prd-crd{display:flex;flex-direction:column;gap:16px;padding:24px;background-color:#f9fafb;border-radius:8px;box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}
.prd-crd:hover{box-shadow:0 4px 6px -1px rgba(0,0,0,.1);transform:translateY(-2px);transition:all 150ms ease-in-out}
```

### CSS Formatting Rules

1. One property per line
2. Use design tokens (CSS variables), not hardcoded values
3. 5-group property order: Positioning → Box Model → Typography → Visual → Animation
4. Descriptive class names (BEM or semantic naming)
5. Generous spacing between rule sets
6. Comments for complex sections

---

## 6. Component States (Required)

All interactive components must have consistent states:

| State | Requirement | Example |
|-------|-------------|---------|
| **Default** | Base appearance | Normal button |
| **Hover** | Visual feedback on mouse over | Background darkens |
| **Active** | Visual feedback when pressed | Slight scale down |
| **Focus** | Clear focus indicator (keyboard navigation) | `outline: 2px solid var(--color-focus); outline-offset: 2px;` |
| **Disabled** | Visually distinct, non-interactive | Grayed out, low opacity |

**Every interactive element (buttons, inputs, links, cards) must implement all five states.**

**Reference the design system for specific implementations.**

---

## 7. Layout Philosophy

### Layout Strategy

**CSS Grid with named template areas is the primary layout tool for this project.**

- **Use CSS Grid with named template areas** for ALL structural layout (pages, sections, components, content areas)
- **Grid is semantic, maintainable, and explicit** - the layout structure is visually clear in your CSS
- **Flexbox is for flowing/distributing items** - Navigation items, galleries, tag lists - things that need to flow
- **Mobile-first approach** - Design adapts gracefully to smaller screens

### When to Use What

| Layout Need | Tool | Example |
|-------------|------|---------|
| Page structure | **Grid (named areas)** | Header, sidebar, main, footer |
| Section layout | **Grid (named areas)** | Two-column content, form layout |
| Component structure | **Grid (named areas)** | Card internals, modal layout |
| Navigation items | **Flexbox** | Top nav items, menu items |
| Gallery/flowing items | **Flexbox** | Image grid, card gallery, tag list |

**Default to Grid for structure.** Use Flexbox when items need to flow, distribute, or wrap (navigation, galleries).

### White Space

- Use ample negative space to improve clarity and reduce cognitive load
- Consistent spacing using the spacing scale from design tokens

### Visual Hierarchy

- Guide user's eye using typography (size, weight, color), spacing, and positioning
- Maintain consistent alignment of elements

### CSS Grid: Named Template Areas (Primary Layout Method)

**Why Grid with named template areas:**
- Clean and semantic - layout structure is visually clear in CSS
- Easy to maintain - changing layout is straightforward
- Flexible - simple to adjust for responsive designs
- Named areas behave like containers - apply normal padding/margin/spacing
- Works for page structure AND component internals

**Example 1: Page Layout**
```css
#app-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: var(--space-md);
}

#header { grid-area: header; }
#sidebar { grid-area: sidebar; }
#main { grid-area: main; }
#footer { grid-area: footer; }
```

**Example 2: Component Layout (Product Card)**
```css
.product-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-template-areas:
    "image title"
    "image description"
    "image price"
    "actions actions";
  gap: var(--space-sm);
  padding: var(--space-md);
}

.product-card__image { grid-area: image; }
.product-card__title { grid-area: title; }
.product-card__description { grid-area: description; }
.product-card__price { grid-area: price; }
.product-card__actions { grid-area: actions; }
```

**Example 3: Flexbox for Navigation (Valid Use - Items Flow/Distribute)**
```css
.top-nav {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
}

.top-nav__items {
  display: flex;
  gap: var(--space-sm);
  margin-left: auto; /* Push items to right */
}
```

**Example 4: Flexbox for Gallery (Valid Use - Items Flow/Wrap)**
```css
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.image-gallery__item {
  flex: 1 1 250px; /* Allow items to flow and wrap */
}
```

---

## 8. Accessibility (WCAG AA)

### Required Standards

1. **Color Contrast:** All text must meet WCAG AA contrast ratios
   - Normal text: 4.5:1 minimum
   - Large text (18px+): 3:1 minimum
2. **Keyboard Navigation:** All functionality available via keyboard
3. **Screen Reader Support:** Proper ARIA labels, semantic HTML
4. **Focus Indicators:** Visible focus states for all interactive elements
5. **Alt Text:** Descriptive alt text for all images
6. **Form Labels:** All inputs have associated labels

### Testing

- Test with keyboard only (Tab, Enter, Esc, Arrow keys)
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Run automated accessibility checks (axe, Lighthouse)

### ARIA Usage

Use semantic HTML first. Only add ARIA when HTML alone isn't sufficient.

| ARIA Pattern | When to Use | Example |
|-------------|-------------|---------|
| `role="dialog"` | Custom modal/dialog | `<div role="dialog" aria-modal="true">` |
| `role="alert"` | Urgent notifications | `<div role="alert">Error occurred</div>` |
| `aria-label` | No visible label | `<button aria-label="Close">×</button>` |
| `aria-describedby` | Additional context | `<input aria-describedby="help-text">` |
| `aria-live="polite"` | Dynamic content updates | `<div aria-live="polite">3 results</div>` |

**Rule:** If a semantic HTML element does the job, don't add ARIA. `<button>` is better than `<div role="button">`.

### Modal Focus Trapping

All modals must trap focus:

1. **On open:** Move focus to the first focusable element inside the modal
2. **While open:** Tab cycles within the modal only (never escapes behind it)
3. **On close:** Return focus to the element that triggered the modal
4. **Esc key:** Always closes the modal

### Dark Mode Support

- Use CSS variables for all theme-dependent values (colors, backgrounds, borders)
- Support `[data-theme="dark"]` toggle for user preference
- Respect `prefers-color-scheme: dark` as the system default
- Test both themes for contrast compliance

```css
[data-theme="dark"] {
  --color-bg: var(--color-neutral-900);
  --color-surface: var(--color-neutral-800);
  --color-text: var(--color-neutral-50);
  --color-border: var(--color-neutral-700);
}
```

### Respect User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Premium UI Philosophy

We follow S-Tier SaaS standards (Stripe, Airbnb, Linear):

### Visual Excellence

- Sophisticated typography with perfect spacing and contrast
- Premium color palettes with subtle gradients and depth
- Advanced CSS techniques for polished layouts
- Meticulous attention to detail in every element

### Smooth Interactions

- Purposeful animations that enhance usability (150-300ms duration)
- Delightful micro-interactions (hover states, transitions)
- Snappy, responsive feel (fast load times)

### Advanced Techniques

- Sophisticated shadow systems
- Glassmorphism, gradients, backdrop effects (when appropriate)
- CSS Grid, Flexbox, Container Queries for responsive design

### Performance & Balance

- Ensure premium effects are performant
- Maintain accessibility while adding visual sophistication
- Balance visual quality with loading performance

**Goal:** Make every interface feel like a premium product users would expect to pay more for. Focus on subtle sophistication over flashy effects. Always prioritize user experience while elevating visual quality.

---

## 10. Anti-Patterns (DO NOT DO THESE)

### ❌ Floating Labels
```html
<!-- DON'T: Floating labels are confusing -->
<div class="floating-label">
  <input placeholder=" ">
  <label>Email</label>
</div>
```
**✅ Use standard labels above inputs**

### ❌ Inline Validation (on every keystroke)
```js
// DON'T: Validate while user is typing
input.addEventListener('input', validate);
```
**✅ Validate on blur or submit**

### ❌ Generic Error Messages
```html
<!-- DON'T: Vague errors -->
<p class="error">Invalid input</p>
```
**✅ Specific, actionable errors**
```html
<p class="error">Email must include @ symbol</p>
```

### ❌ Tooltips for Critical Info
```html
<!-- DON'T: Hide important info in tooltips -->
<button title="This will delete everything">Delete</button>
```
**✅ Show critical info directly, use tooltips for supplementary info only**

### ❌ Disabled Buttons Without Explanation
```html
<!-- DON'T: Leave users guessing why button is disabled -->
<button disabled>Submit</button>
```
**✅ Show why button is disabled**
```html
<button disabled>Submit</button>
<p class="hint">Complete all required fields to submit</p>
```

### ❌ Custom Scrollbars
```css
/* DON'T: Override system scrollbars */
::-webkit-scrollbar { width: 5px; background: pink; }
```
**✅ Use system scrollbars (better UX, accessibility)**

### ❌ Hamburger Menu on Desktop
```html
<!-- DON'T: Hide navigation on desktop -->
<button class="hamburger">☰</button>
```
**✅ Show full navigation on desktop, hamburger only on mobile**

---

## 11. Responsive Breakpoints

**Use these breakpoints (mobile-first):**

```css
/* Mobile: 0-767px (base styles, no media query needed) */

/* Tablet: 768px and up */
@media (min-width: 768px) { }

/* Desktop: 1024px and up */
@media (min-width: 1024px) { }

/* Large Desktop: 1280px and up */
@media (min-width: 1280px) { }
```

### Container max-widths
- Mobile: 100% (with padding)
- Tablet: 768px
- Desktop: 1024px
- Large: 1280px

**Never use:** `@media (max-width: ...)` - Always use min-width (mobile-first)

---

## Design System Reference

For component-specific patterns, implementations, and examples:
- **See `/01-presentation/styles/global.css`** for design tokens and base styles
- **See design system documentation** (Figma, Storybook, or pattern library) for component patterns
- **Follow the principles above** when creating new components

**The design system is your source of truth for:**
- Button variants and states
- Form input patterns
- Card layouts
- Modal behavior
- Table structures
- Navigation patterns
- Icon usage
- Animation specifications
- Any component-specific implementation details

**When in doubt:** Reference existing components in the design system rather than inventing new patterns.
