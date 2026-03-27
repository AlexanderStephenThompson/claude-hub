<!-- Derived from ~/.claude/skills/architecture/SKILL.md
     For agent consumption, read the skill directly.
     This file is a human-readable convenience copy for project browsing. -->

# Architecture Principles

**Version:** 2.0
**Last Updated:** 2026-02-09

> How to structure a project — logically (module design, dependency flow) and physically (folder layout, naming conventions).

---

## Table of Contents

1. [North Star](#1-north-star) - The guiding metric
2. [Core Principles](#2-core-principles) - Foundational rules
3. [The 3 Layers](#3-the-3-layers-reference) - Tier architecture
4. [Module Boundaries](#4-module-boundaries) - Cohesion and coupling
5. [Pattern Selection](#5-pattern-selection) - When to use what
6. [Testing Strategy](#6-testing-strategy) - Test pyramid
7. [Anti-Patterns](#7-anti-patterns) - What to avoid
8. [When to Extract](#8-when-to-extract) - Service boundaries
9. [Observability Basics](#9-observability-basics) - Production readiness
10. [Decision Records](#10-decision-records-optional) - Documenting choices

---

## 1. North Star

**Goal:** Small changes stay local.

**Definition:** A typical feature should touch 1-2 modules, ship quickly, and not require coordinated edits across the system.

If you find yourself editing 5+ files across multiple layers for a simple change, that's a design smell.

---

## 2. Core Principles

### Explicit Over Magic
Prefer readable wiring over convention-heavy frameworks. When someone reads your code, the control flow should be obvious. No `@AutoInject()` decorators that hide what depends on what — use explicit constructor parameters.

### Boundaries Are Sacred
Modules communicate only through contracts (APIs, props, events). No reaching into another module's internals. Import from the module's public API, never from internal files.

### Own Your Data
Each module owns its schema/state. Other modules read via APIs or props, never direct access. If OrderModule needs user data, it calls `UserModule.getUserById()` — it doesn't query the users table directly.

### Optimize for Refactoring
If code is hard to move or rename, it's a design smell. Loose coupling enables safe refactoring.

### Organize by Feature, Not Layer
Feature-based organization keeps related code together. The 3-tier architecture defines the layer boundaries; within each tier, organize by domain.

**Good — feature-based:**
```
02-logic/
  users/
    UserService.ts
    UserValidator.ts
  orders/
    OrderService.ts
    OrderCalculator.ts
```

**Avoid — layer-based within a tier:**
```
02-logic/
  services/
    UserService.ts
    OrderService.ts
  validators/
    UserValidator.ts
    OrderCalculator.ts
```

Feature-based means adding a new feature is one folder, not edits scattered across many.

---

## 3. The 3 Layers (Reference)

This template enforces:

```
01-presentation/  ->  02-logic/  ->  03-data/
```

| Layer | Responsibility | Examples |
|-------|----------------|----------|
| **Presentation** | What users see and interact with | Components, pages, styles |
| **Logic** | How it's built, business rules | Services, use cases, validation |
| **Data** | How it persists, external sources | Repositories, models, adapters |

### Valid Dependency Flow

```
Presentation -> Logic -> Data              (valid)
Data -> Logic                              (blocked)
Logic -> Presentation                      (blocked)
Presentation -> Data                       (blocked - no layer skipping)
```

---

## 4. Module Boundaries

A module is a cohesive unit with a clear public API, hidden implementation, and defined dependencies.

### Module Rules

**Single Entry Point:** Each module exposes its API through an index file. External imports MUST go through it.

**No Circular Dependencies:** Modules cannot depend on each other in a cycle. Break cycles by extracting shared code, using events, or introducing an interface.

**Own Your Data:** Each module owns its data exclusively. Cross-module data is accessed via APIs, never direct DB queries.

### Coupling Guidelines

| Coupling Type | OK? |
|--------------|-----|
| Type import | Always |
| Function call via public API | Usually |
| Direct instantiation | Carefully |
| Shared mutable state | Avoid |

### When Boundaries Get Blurry

If you're unsure whether something belongs in Module A or Module B, ask: "If I delete Module A entirely, does Module B still compile?" If not, the dependency direction needs attention.

---

## 5. Pattern Selection

| Pattern | Use When |
|---------|----------|
| Pure functions | Stateless transformations |
| Module with functions | Grouping related functions |
| Class | State or dependency injection needed |
| Factory | Complex object creation |
| Repository | Data access abstraction |

**Default to simplicity:** Function -> Module -> Class -> Pattern

Start with the simplest option. Only introduce abstraction when the simpler approach becomes painful. Three similar lines of code is better than a premature abstraction.

---

## 6. Testing Strategy

| Type | Purpose | Scope | Volume |
|------|---------|-------|--------|
| **Unit** | Fast, deterministic, domain-heavy | Single function/component | Heavy |
| **Integration** | DB, APIs, external services | Module boundaries | Moderate |
| **E2E** | Critical user paths only | Full stack | Minimal |

**Guidance:**
- Heavy unit tests, moderate integration, minimal E2E
- E2E sprawl leads to brittle, slow test suites
- Contract tests recommended for API boundaries

---

## 7. Anti-Patterns

### Code Architecture

| Anti-Pattern | Symptom | Fix |
|--------------|---------|-----|
| **God Object** | >500 lines, >10 public exports | Extract cohesive submodules |
| **Anemic Domain Model** | Getters/setters only, services do all work | Move behavior to entities |
| **Shotgun Surgery** | Adding a field requires 5+ file changes | Better encapsulation |

### Project Structure

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **Cluttered Root** | 15+ files at project root, stray scripts alongside config | Move everything that isn't an entry point or required config into folders. *The root is the first impression — keep it lean.* |
| **God Folder** | One folder with 40+ files | Group by domain, feature, or function |
| **Ghost Folders** | Empty folders with no files and no clear purpose | Delete unless part of an intentional pattern |
| **Naming Soup** | Mixed casing: `UserProfile.tsx`, `order-utils.ts`, `payment_service.py` | Pick one convention per file type, enforce it. *Folder names describe what's inside, not how it's used.* |
| **Orphaned Files** | Files that nothing imports or references | Verify unused, then delete |
| **Deep Nesting** | 5+ folder levels to reach a single file | Flatten — levels should reflect real boundaries. *Max 4 levels from root to file; every level must earn its place.* |
| **Mirror Trees** | `src/` and `tests/` with identical structures | Co-locate unit tests with source; separate tree only for integration/E2E |
| **Config Explosion** | 10+ config files at root | Consolidate where possible, move to `config/` |

### Red Flags

Stop and reconsider when you see:

| Smell | Problem | Fix |
|-------|---------|-----|
| `shared/common/utils` dumping ground | Ownership unclear, grows forever | Move to owning module or create focused package |
| Cross-module direct imports | Tight coupling, breaks independently | Use APIs, events, or props |
| Direct database access across modules | Hidden dependencies | Build a read API or service |
| "Quick helper" in wrong module | Boundary violation | Move to correct owner |
| Framework magic hiding control flow | Hard to debug, hard to refactor | Make it explicit |
| Feature touching 5+ unrelated files | Poor separation | Refactor boundaries |

---

## 8. When to Extract

Start with a modular monolith (single deployable, clean internal boundaries). Extract to separate services only when:

| Reason | Example |
|--------|---------|
| **Scale** | One part needs independent scaling |
| **Team** | Separate teams need independent deploy cycles |
| **Technology** | A component needs a different runtime/language |

Don't extract for "cleanliness" — that adds operational complexity without benefit.

---

## 9. Observability Basics

For production projects, consider:

- **Structured logging:** JSON logs, not string concatenation. Include context (`{ userId, timestamp }`), not messages (`'User ' + userId + ' logged in'`).
- **Correlation IDs:** Track requests across async operations
- **Error boundaries:** Catch and report, don't swallow silently

---

## 10. Decision Records (Optional)

For significant choices, document:

1. **Context:** What problem are we solving?
2. **Decision:** What did we choose?
3. **Alternatives:** What else did we consider?
4. **Consequences:** What trade-offs are we accepting?

Location: `Documentation/decisions/` (create as needed)

---

## Scaling Principles

| Project Size | Focus On |
|--------------|----------|
| **Small** | North Star, Red Flags |
| **Growing** | Add Testing Strategy, Observability |
| **Team** | Add Decision Records, Module Ownership |

Scale your architecture practices to match your project's actual complexity.
