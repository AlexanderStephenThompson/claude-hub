# CSS Token Reference

Complete design token definitions, usage examples, and dark mode implementation.

---

## Token Definitions

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

---

## Using Tokens

```css
/* Good - Uses design tokens */
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

/* Bad - Hardcoded values */
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
