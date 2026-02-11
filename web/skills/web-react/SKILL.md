---
name: web-react
description: React patterns for vanilla React with Apollo Client - components, hooks, state management
user-invocable: false
---

# Web React Skill

**Version:** 1.0
**Stack:** React (vanilla) + Apollo Client

React gives you infinite freedom to structure components, which means infinite freedom to create a mess. Components grow to 500 lines because "it all goes together." Business logic ends up in JSX because "it's just one function." Server state gets duplicated in useState because "I need to filter it." Every shortcut creates a component that's hard to test, hard to reuse, and hard for the next person to modify.

Small components with extracted hooks and Apollo-managed server state produce code where each piece has one job and one place to find it. No framework abstractions — just clean React.

---

## Core Principles

1. **Components Stay Small** — Under 200 lines. If larger, split it.
2. **Hooks for Logic** — Extract business logic into custom hooks.
3. **Apollo for Server State** — Don't duplicate server state in local state.
4. **Props Down, Events Up** — Clear data flow, no prop drilling beyond 2 levels.
5. **Colocation** — Keep related code together (component + styles + tests).

---

## Component Patterns

### File Size Guidelines

| Size | Status | Action |
|------|--------|--------|
| < 100 lines | Ideal | Keep it |
| 100-200 lines | Watch | Consider splitting if growing |
| > 200 lines | Too big | Split into smaller components |
| > 300 lines | Critical | Immediate refactor needed |

### When to Split

Split when you see: multiple responsibilities, reusable UI patterns, complex conditional rendering, or deeply nested JSX (> 4 levels).

See `assets/component-patterns.md` for ProductCard structure and split-by-responsibility examples.

---

## Hooks Patterns

Extract logic that uses multiple hooks together, contains business logic, could be reused, or makes components hard to read.

### Hook Rules (Enforced)

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Custom hooks must start with `use`
4. Dependencies must be exhaustive (ESLint rule)

See `assets/component-patterns.md` for useProductQuantity hook and QuantitySelector examples.

---

## Apollo Client Patterns

### Server State vs Local State

| Data Type | Where to Store | Example |
|-----------|---------------|---------|
| User data from API | Apollo cache | Profile, preferences |
| List data from API | Apollo cache | Products, orders |
| Form input before submit | Local state | Input values |
| UI state | Local state | Modal open, sidebar collapsed |
| Derived from server data | Computed | Filtered list, totals |

Never duplicate Apollo cache data into local state. Filter/transform inline or with `useMemo`.

See `assets/component-patterns.md` for query, mutation, and optimistic update patterns.

---

## State Management

| Need | Solution |
|------|----------|
| Server data | Apollo Client (useQuery, useMutation) |
| Global UI state | React Context |
| Component UI state | useState |
| Complex component state | useReducer |
| Form state | useState or form library |

Keep contexts focused (one per concern). Don't put frequently-changing data in a single mega-context — split by concern to avoid unnecessary re-renders.

See `assets/component-patterns.md` for ThemeProvider context pattern and context splitting examples.

---

## File Organization

```
src/
├── components/           # Shared/reusable components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── Button.test.jsx
│   └── Modal/
├── features/             # Feature-based organization
│   ├── products/
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # Feature-specific hooks
│   │   ├── graphql/      # Queries and mutations
│   │   └── ProductsPage.jsx
│   └── cart/
├── hooks/                # Shared custom hooks
├── graphql/              # Shared GraphQL (fragments, client setup)
├── utils/                # Pure utility functions
└── App.jsx
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.jsx` |
| Hooks | camelCase with `use` prefix | `useProductQuantity.js` |
| Utils | camelCase | `formatPrice.js` |
| GraphQL queries | SCREAMING_SNAKE | `GET_PRODUCTS` |
| GraphQL files | camelCase | `products.graphql` or `products.js` |

---

## JSX Cleanliness

- **Semantic elements** — Use `<nav>`, `<button>`, `<a>`, `<main>`, `<article>`, not `<div>` for everything
- **No inline styles** — Styles belong in CSS files, not JSX `style={{ }}` props
- **Minimal class lists** — 1-3 classes per element. More than 4 → consolidate into a semantic class

| Need | Use | Not |
|------|-----|-----|
| Navigation | `<nav>`, `<a>` | `<div onClick>` |
| Actions | `<button>` | `<div onClick>` |
| Lists | `<ul>`, `<li>` | `<div>` with bullets |
| Page sections | `<main>`, `<section>`, `<article>` | Nested `<div>` |

See `assets/component-patterns.md` for semantic element, inline style, and class list examples.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Giant components** | Hard to read, test, maintain | Split by responsibility |
| **Prop drilling > 2 levels** | Tight coupling, verbose | Use composition or context |
| **useEffect for derived state** | Unnecessary renders | Use useMemo or compute inline |
| **Duplicating Apollo cache** | Double source of truth | Query directly from cache |
| **Business logic in components** | Hard to test, can't reuse | Extract to hooks |
| **Inline functions in JSX** | New reference each render | useCallback or extract |
| **Missing loading/error states** | Bad UX | Always handle all states |
| **Fetching in useEffect** | Race conditions, no caching | Use Apollo useQuery |
| **Inline styles** | Mixes concerns, hard to maintain | Use CSS classes |
| **Div soup** | Poor accessibility, unclear structure | Use semantic HTML elements |
| **Class bloat (5+ classes)** | Hard to read, maintain | Consolidate to semantic class |

---

## Performance Checklist

- [ ] Components < 200 lines
- [ ] Heavy computations wrapped in useMemo
- [ ] Callbacks wrapped in useCallback when passed as props
- [ ] Lists have stable `key` props
- [ ] Large lists use virtualization
- [ ] Images lazy loaded
- [ ] Code split by route (React.lazy)

---

## When to Consider Alternatives

| Situation | Consider |
|-----------|----------|
| Need SSR/SSG | Next.js or Remix |
| Very simple app | Plain React without Apollo |
| Real-time heavy | Consider subscriptions or WebSockets |
| Complex forms | Form library (React Hook Form) |

---

## References

- `assets/component-patterns.md` — Component, hook, Apollo, state, and JSX examples
