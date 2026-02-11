# CSS Pattern Examples

Code examples for responsive design, layout patterns, component states, and accessibility.

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
/* Bad - Desktop-first */
@media (max-width: 768px) {
  .sidebar { display: none; }
}

/* Good - Mobile-first */
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
