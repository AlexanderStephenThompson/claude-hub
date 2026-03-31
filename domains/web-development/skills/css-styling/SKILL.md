---
name: css-styling
description: CSS visual styling — design tokens, colors, typography, borders, shadows, animation, and component states
user-invocable: false
---

# CSS Styling Skill

**Version:** 1.0

> Styling is the visual layer — colors, fonts, shadows, borders, and motion. Design tokens centralize these values so one edit propagates everywhere instead of becoming a partial fix.

## The Problem

AI agents hardcode visual values each session. One uses `#3b82f6`, another `rgb(59, 130, 246)`, another picks a slightly different blue. Spacing drifts from `16px` to `1rem` to `15px` across similar components. After a few sessions, a "simple" color change means hunting through every file for every variant of the same value — and missing some. Design tokens solve this by putting every visual value in one place.

## Consumption

- **Builders:** Read `## Builder Checklist` before writing any visual CSS. Every value must come from a token. If no token exists, create one first.
- **Refactorers:** Use `## Enforced Rules` to find hardcoded values. Read narrative sections for token naming and value normalization.
- **Both:** Narrative sections are the authoritative standard. Checklist and rules table are compressed views of the same content.

---

## Scope and Boundaries

**This skill covers:**
- Design tokens (CSS variables in `:root`)
- Token categories: colors, spacing, typography, borders, shadows, z-index, animation
- Color management (semantic colors, neutrals, dark mode)
- Typography (font families, size scales, weights, line heights)
- Containers/surfaces (background, border, shadow, radius)
- Image styling (object-fit, aspect-ratio, filters)
- Animation and transitions (durations, easing, reduced motion)
- Component states (hover, active, focus, disabled)
- Value normalization (hex formats, unit consistency)

**Defers to other skills:**
- `css-selectors`: Naming conventions, specificity, cascade order
- `css-positioning`: Box model, grid, flexbox, layout patterns
- `design`: Design system philosophy, premium UI principles

**Use this skill when:** You're defining colors, choosing font sizes, setting shadows, writing transitions, or tokenizing hardcoded values.

---

## Design Tokens

All visual values live in `global.css` inside a `:root` block. Tokens are the mechanism that prevents CSS drift — when you change `--color-primary`, every button, link, and badge that references it updates automatically.

### Token Categories

| Category | Pattern | Examples |
|----------|---------|----------|
| **Colors — Semantic** | `--color-{purpose}` | `--color-primary`, `--color-error`, `--color-surface` |
| **Colors — Neutrals** | `--color-neutral-{scale}` | `--color-neutral-50` through `--color-neutral-900` |
| **Spacing** | `--space-{scale}` | `--space-1` (4px), `--space-4` (16px), `--space-8` (32px) |
| **Typography** | `--font-size-{name}` | `--font-size-sm`, `--font-size-base`, `--font-size-lg` |
| **Font weight** | `--font-weight-{name}` | `--font-weight-normal`, `--font-weight-bold` |
| **Line height** | `--line-height-{name}` | `--line-height-tight`, `--line-height-normal` |
| **Borders** | `--radius-{size}` | `--radius-sm` (4px), `--radius-md` (6px), `--radius-full` |
| **Shadows** | `--shadow-{size}` | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| **Z-index** | `--z-{name}` | `--z-dropdown`, `--z-modal`, `--z-toast` |
| **Animation** | `--duration-{speed}` | `--duration-fast` (150ms), `--duration-normal` (250ms) |
| **Easing** | `--easing-{name}` | `--easing-default`, `--easing-in`, `--easing-out` |

### The Rule

**If a value appears more than once, it must be a token.** If it appears only once but belongs to a token category (colors, spacing, font sizes), make it a token anyway — consistency matters more than deduplication.

### Extending vs Replacing

If a project already has tokens in `:root`, **extend the existing system**:
- Match the naming convention already in use
- Add new tokens to the existing `:root` block
- Don't create a parallel system

### Token Order in `:root`

Categories appear in this order inside `:root`:

```css
:root {
  /* 1. Colors — Semantic */
  /* 2. Colors — Neutrals */
  /* 3. Typography */
  /* 4. Spacing */
  /* 5. Borders */
  /* 6. Shadows */
  /* 7. Z-index */
  /* 8. Animation */
  /* 9. Breakpoints (reference values) */
}
```

---

## Color

### Semantic Colors

Name colors by purpose, not by hue:

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  --color-bg: var(--color-neutral-50);
  --color-surface: white;
  --color-text: var(--color-neutral-900);
  --color-text-muted: var(--color-neutral-600);
  --color-border: var(--color-neutral-200);
}
```

### Neutral Scale

A 10-step scale from light to dark, used for backgrounds, text, and borders:

```css
:root {
  --color-neutral-50: #f8fafc;   /* Lightest background */
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;  /* Borders */
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;  /* Muted text */
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;  /* Dark surface */
  --color-neutral-900: #0f172a;  /* Primary text */
}
```

### Dark Mode

Override semantic tokens on a theme attribute. Components adapt automatically:

```css
[data-theme="dark"] {
  --color-bg: var(--color-neutral-900);
  --color-surface: var(--color-neutral-800);
  --color-text: var(--color-neutral-50);
  --color-text-muted: var(--color-neutral-400);
  --color-border: var(--color-neutral-700);
}
```

### Color Contrast

WCAG AA minimum ratios:

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text (<18px) | 4.5:1 |
| Large text (≥18px or 14px bold) | 3:1 |
| UI components and graphics | 3:1 |

**Never rely on color alone** to convey meaning. Always pair with an icon, text label, or pattern.

### Value Normalization

All colors must use the same format within a project:

| Inconsistency | Canonical Form |
|---------------|---------------|
| `#fff`, `#ffffff`, `white`, `rgb(255,255,255)` | `#ffffff` (6-digit hex) |
| `rgba(0,0,0,0.1)`, `rgb(0 0 0 / 0.1)` | Pick one, be consistent |

---

## Typography

### Font Scale

```css
:root {
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
}
```

### Rules

- **Use `rem` for font sizes, never `px`** — `rem` respects user browser settings for accessibility
- **Font sizes come from the scale** — Don't use arbitrary sizes like `font-size: 13px`
- **Weight comes from tokens** — `var(--font-weight-bold)`, not `font-weight: 700`
- **Line height matches content type** — `tight` (1.25) for headings, `normal` (1.5) for body text

---

## Containers and Surfaces

Surfaces are the visual "cards" that hold content — defined by background, border, shadow, and radius.

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### Shadow Scale

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

### Border Radius Scale

```css
:root {
  --radius-sm: 0.25rem;   /* 4px — subtle rounding */
  --radius-md: 0.375rem;  /* 6px — standard */
  --radius-lg: 0.5rem;    /* 8px — prominent */
  --radius-xl: 0.75rem;   /* 12px — large cards */
  --radius-full: 9999px;  /* Pills, avatars */
}
```

---

## Images

CSS properties for image presentation (alt text and semantic markup are in `semantic-content`):

```css
/* Responsive image fill */
.image-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Aspect ratio container */
.image-16-9 {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* Rounded avatar */
.avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

/* Image filters */
.image-muted {
  filter: grayscale(50%) opacity(0.8);
}
```

---

## Animation and Transitions

### Duration Scale

```css
:root {
  --duration-fast: 150ms;     /* Hover states, small toggles */
  --duration-normal: 250ms;   /* Modals, dropdowns, tab switches */
  --duration-slow: 350ms;     /* Page transitions, complex animations */
}
```

### Easing Curves

```css
:root {
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);  /* General purpose */
  --easing-in: cubic-bezier(0.4, 0, 1, 1);          /* Entering */
  --easing-out: cubic-bezier(0, 0, 0.2, 1);         /* Leaving */
}
```

### Transition Patterns

```css
/* Single property (preferred — explicit about what animates) */
.btn {
  transition: background-color var(--duration-fast) var(--easing-default);
}

/* Multiple properties */
.card {
  transition:
    box-shadow var(--duration-fast) var(--easing-default),
    transform var(--duration-fast) var(--easing-default);
}

/* Avoid `transition: all` — it's unpredictable and can animate layout properties */
```

### Reduced Motion

**Required.** Users who set `prefers-reduced-motion` must have animations disabled:

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

This is one of the few acceptable uses of `!important` — it must override everything.

---

## Component States

Every interactive element needs 5 visual states. Missing states make the interface feel broken for keyboard and mouse users.

### The 5 Required States

```css
.btn {
  /* 1. Default */
  background-color: var(--color-primary);
  color: white;
  transition: background-color var(--duration-fast) var(--easing-default);
}

.btn:hover {
  /* 2. Hover — visual feedback on mouse over */
  background-color: var(--color-primary-hover);
}

.btn:active {
  /* 3. Active — visual feedback when pressed */
  transform: scale(0.98);
}

.btn:focus-visible {
  /* 4. Focus — keyboard navigation indicator */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  /* 5. Disabled — non-interactive appearance */
  opacity: 0.5;
  cursor: not-allowed;
}
```

### State Consistency

Similar components should have consistent state behavior:
- All buttons hover the same way
- All inputs focus the same way
- All disabled elements look the same

### Accessibility States

```css
/* Focus indicator — NEVER remove without replacement */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Only suppress for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Screen-reader-only content */
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

## Value Normalization

Before tokenizing, normalize inconsistent representations of the same value:

| Inconsistency | Canonical Form |
|---------------|---------------|
| `#fff`, `#ffffff`, `white`, `rgb(255,255,255)` | `#ffffff` (6-digit hex) |
| `16px`, `1rem`, `1em` (for same intent) | Pick one unit, be consistent |
| `0px`, `0em`, `0rem` | `0` (unitless) |
| `margin: 16px 16px 16px 16px` | `margin: 16px` (shorthand) |

---

## Builder Checklist

Before writing visual CSS:

- [ ] All colors use tokens (`var(--color-*)`) — no hardcoded hex/rgb/hsl
- [ ] All spacing uses tokens (`var(--space-*)`) — no hardcoded px/rem
- [ ] All font sizes use tokens (`var(--font-size-*)`) — no hardcoded sizes
- [ ] All shadows use tokens (`var(--shadow-*)`) — no inline shadow values
- [ ] All border-radii use tokens (`var(--radius-*)`)
- [ ] All z-index values use tokens (`var(--z-*)`)
- [ ] All transition durations use tokens (`var(--duration-*)`)
- [ ] Font sizes use `rem`, not `px`
- [ ] Interactive elements have all 5 states (default, hover, active, focus, disabled)
- [ ] Focus indicators are visible on all interactive elements
- [ ] Reduced motion media query is present
- [ ] Dark mode uses semantic token overrides, not separate component styles
- [ ] New tokens are added to `:root` in `global.css` in canonical category order

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-web team).

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `no-hardcoded-color` | error | Hex/rgb/hsl/named colors outside `var(--color-*)` |
| `no-hardcoded-spacing` | warn | Raw px spacing (≥4px) outside `var(--space-*)` |
| `no-hardcoded-font-size` | warn | Font sizes outside `var(--font-size-*)` |
| `no-hardcoded-radius` | warn | Border-radius outside `var(--radius-*)` |
| `no-hardcoded-shadow` | warn | Box/text-shadow outside `var(--shadow-*)` |
| `no-hardcoded-z-index` | warn | Z-index outside `var(--z-*)` |
| `token-category-order` | warn | Token sub-categories out of order in `:root` |
| `no-inline-style` | warn | Inline `style=` attributes in HTML |
| `no-jsx-inline-style` | warn | Inline `style={{}}` in JSX |
