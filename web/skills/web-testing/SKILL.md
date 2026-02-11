---
name: web-testing
description: Testing patterns for React + GraphQL + Prisma stack
user-invocable: false
---

# Web Testing Skill

**Version:** 1.0
**Stack:** React Testing Library + Jest + Prisma

The wrong testing strategy wastes more time than no tests at all. Tests that test implementation break every time you refactor. Tests that share state flake randomly. Tests without error cases give false confidence — your suite is green but your app crashes on the first unexpected input. You write tests, they break for the wrong reasons, and the team stops trusting them.

Behavior-focused tests survive refactoring. Isolated tests never flake. The testing pyramid keeps the suite fast enough that people actually run it. These patterns produce tests you can trust.

---

## Core Principles

1. **Test Behavior, Not Implementation** — Test what users see and do, not internal details.
2. **Pyramid Structure** — Many unit tests, fewer integration, minimal E2E.
3. **Fast Feedback** — Tests should run in seconds, not minutes.
4. **Deterministic** — Same input = same output. No flaky tests.
5. **Isolated** — Tests don't depend on each other or external state.

---

## Testing Pyramid

```
        /\
       /  \      E2E (5%)
      /----\     Critical user journeys only
     /      \
    /--------\   Integration (25%)
   /          \  API boundaries, database
  /------------\
 /              \ Unit (70%)
/________________\ Components, hooks, services, utils
```

| Level | Speed | Confidence | Volume |
|-------|-------|------------|--------|
| Unit | Fast (ms) | Lower | Many |
| Integration | Medium (s) | Medium | Some |
| E2E | Slow (10s+) | Highest | Few |

---

## React Component Testing

Test behavior, not implementation. Use Testing Library queries in priority order: `getByRole` > `getByLabelText` > `getByText` > `getByAltText` > `getByTestId` (last resort).

See `assets/test-examples.md` for complete component test examples (ProductCard, query priority).

---

## Apollo/GraphQL Testing

Wrap components in `MockedProvider` via a `renderWithApollo` helper. Always test: loading state, success path, and error handling.

See `assets/test-examples.md` for Apollo mock setup, query testing, and mutation testing examples.

---

## Custom Hook Testing

Use `renderHook` and `act` from Testing Library. Test initial state, state transitions, and edge cases.

See `assets/test-examples.md` for complete hook test examples (useProductQuantity).

---

## Service/Resolver Testing

Mock Prisma with `jest-mock-extended`. Test happy path, error cases (not found, duplicates), and edge cases.

See `assets/test-examples.md` for service tests, Prisma mock setup, and integration test examples.

---

## Integration Testing

Use a real test database. Reset between test runs. Clean up in reverse dependency order. Test across service boundaries.

See `assets/test-examples.md` for database setup, cleanup, and integration test examples.

---

## File Organization

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx      # Co-located
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts          # Co-located
├── services/
│   ├── product.service.ts
│   └── product.service.test.ts  # Co-located
├── features/
│   └── products/
│       ├── ProductList.tsx
│       └── ProductList.test.tsx # Co-located
└── test-utils/                   # Shared test utilities
    ├── apollo.tsx
    ├── prisma-mock.ts
    └── db.ts
```

Co-locate tests with source. Use `__tests__/` folders as an alternative.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Testing implementation** | Brittle tests, false failures | Test behavior and output |
| **Snapshot overuse** | Large, meaningless diffs | Targeted assertions |
| **No async handling** | Race conditions, flaky tests | Use waitFor, findBy |
| **Shared mutable state** | Tests affect each other | Fresh setup per test |
| **Testing library internals** | Coupling to implementation | Mock at boundaries |
| **Too many E2E tests** | Slow, flaky, hard to debug | More unit/integration |
| **No error case tests** | False confidence | Test unhappy paths |
| **Manual DOM queries** | Fragile, not accessible | Use Testing Library queries |

---

## Checklist

### Component Tests
- [ ] Uses Testing Library queries (getByRole, getByText)
- [ ] Tests user interactions (click, type)
- [ ] Tests loading states
- [ ] Tests error states
- [ ] Uses userEvent for interactions

### Apollo Tests
- [ ] MockedProvider wraps components
- [ ] Tests loading → success path
- [ ] Tests error handling
- [ ] Tests mutation side effects

### Service Tests
- [ ] Prisma properly mocked
- [ ] Happy path tested
- [ ] Error cases tested
- [ ] Edge cases covered

### Integration Tests
- [ ] Uses test database
- [ ] Database cleaned between tests
- [ ] Tests real data flow
- [ ] Tests across service boundaries

---

## When to Consider Alternatives

| Situation | Consider |
|-----------|----------|
| Complex E2E flows | Playwright or Cypress |
| Visual regression | Storybook + Chromatic |
| API contract testing | Pact |
| Performance testing | k6 or Artillery |
| Accessibility testing | axe-core integration |

---

## References

- `assets/test-examples.md` — Complete test examples (component, Apollo, hook, service, integration)
