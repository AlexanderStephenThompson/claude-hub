# Project Structure

**Version:** 3.0
**Last Updated:** 2026-03-23

> Complete guide to the 3-tier architecture, shared layer, and folder organization.

---

## Overview

This project follows a **strict 3-tier architecture** with feature-based organization within each tier. The architecture validator automatically blocks invalid imports.

**Dependency flow:**
```
01-presentation → 02-logic → 03-data
       ↓              ↓          ↓
     config         config     config      (any tier can import config)
```

**Blocked flows (validator enforced):**
```
03-data → 02-logic           ❌  (no upward imports)
02-logic → 01-presentation   ❌  (no upward imports)
01-presentation → 03-data    ❌  (no layer skipping)
```

Each tier has its own `shared/` folder for internal reuse. Cross-tier types flow downward through the normal dependency chain.

---

## Directory Structure

```
project-root/
├── 01-presentation/          # UI layer — pages, components, layouts
├── 02-logic/                 # Business logic — services, validation, models
├── 03-data/                  # Data layer — repositories, API clients, cache
├── tests/                    # Layer 3 behavioral/E2E tests
├── Config/                   # Environment variables and constants
├── Documentation/            # Project planning and feature specs
├── Standards/                # Code, design, documentation, security standards
├── .claude/                  # AI commands, validators, agents
├── package.json
└── README.md
```

---

## 01-presentation/ (UI Layer)

**Purpose:** What users see and interact with.

**Organize by feature**, not by file type. Related UI files live together.

```
01-presentation/
├── features/                    # Feature-scoped UI
│   ├── meal-plans/
│   │   ├── MealPlanList.tsx
│   │   ├── MealPlanList.test.tsx
│   │   ├── MealPlanForm.tsx
│   │   ├── MealPlanForm.test.tsx
│   │   └── meal-plans.css
│   └── shopping/
│       ├── ShoppingList.tsx
│       ├── ShoppingList.test.tsx
│       └── shopping.css
├── shared/                      # Reusable UI components (not feature-specific)
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Card.tsx
│   ├── Form.tsx
│   └── Modal.tsx
├── layouts/                     # Page shells and structural wrappers
│   ├── AppLayout.tsx
│   └── AuthLayout.tsx
├── pages/                       # Route-level entry points (thin — delegate to features)
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
├── hooks/                       # UI-specific hooks
│   ├── useForm.ts
│   └── useModal.ts
└── styles/                      # Design tokens and global CSS
    └── global.css               # Single source of truth for all design values
```

**Key decisions:**
- `features/` — Feature folders group component + test + CSS together. Adding a feature = one folder.
- `shared/` — Generic components used across features (buttons, cards, modals). Not feature-specific.
- `pages/` — Thin route entry points. They compose feature components, they don't contain logic.
- CSS is co-located with its feature. `meal-plans.css` sits next to the meal plan components.

**Can import from:**
- ✅ `02-logic/` (services, types, domain models)
- ✅ `Config/` (environment, constants)
- ❌ `03-data/` (must go through logic layer)

**CSS strategy:**
- `styles/global.css` — Design tokens (`:root` CSS variables). Source of truth for all visual values. The design token validator blocks hardcoded colors, spacing, fonts, and shadows.
- Feature CSS — Co-located in `features/{feature}/`. Each feature has its own CSS file referencing tokens from `global.css`.
- Shared component CSS — Co-located in `shared/` alongside shared components.

---

## 02-logic/ (Business Logic Layer)

**Purpose:** How it works. Business rules, validation, orchestration.

**Organize by domain**, not by file type.

```
02-logic/
├── meal-plans/
│   ├── MealPlanService.ts
│   ├── MealPlanService.test.ts
│   ├── MealPlan.ts               # Domain model
│   └── mealPlanValidator.ts
├── shopping/
│   ├── ShoppingListService.ts
│   ├── ShoppingListService.test.ts
│   └── ShoppingList.ts
├── users/
│   ├── UserService.ts
│   ├── UserService.test.ts
│   └── User.ts
└── shared/                        # Types and utils shared across logic domains
    ├── types/
    │   └── domain.ts              # Cross-domain types (e.g., PaginatedResult<T>)
    └── utils/
        └── dateRange.ts           # Pure utilities used by multiple services
```

**Key decisions:**
- Each domain folder contains services, models, and validators together
- Domain models (`MealPlan.ts`, `User.ts`) define the shape of business objects
- `shared/` holds types and utilities used across multiple domains within logic
- Services orchestrate data operations and enforce business rules
- No UI awareness — logic layer never imports from presentation

**Can import from:**
- ✅ `03-data/` (repositories, API clients, data types)
- ✅ `Config/` (environment, constants)
- ❌ `01-presentation/` (logic must not know about UI)

---

## 03-data/ (Data Layer)

**Purpose:** Where data comes from and goes to. External APIs, databases, caching.

**Organize by domain**, matching the logic layer.

```
03-data/
├── meal-plans/
│   ├── MealPlanRepository.ts
│   ├── MealPlanRepository.test.ts
│   └── mealPlanMapper.ts          # Raw API response → domain shape
├── shopping/
│   ├── ShoppingListRepository.ts
│   └── ShoppingListRepository.test.ts
├── users/
│   ├── UserRepository.ts
│   └── UserRepository.test.ts
└── shared/                         # Infrastructure shared across data domains
    ├── types/
    │   └── api.ts                  # API response/request shapes (ApiResponse<T>)
    └── api/
        ├── apiClient.ts            # Shared HTTP client
        └── endpoints.ts            # API endpoint constants
```

**Key decisions:**
- Repositories handle CRUD operations for a single domain
- Mappers transform raw API/DB responses into the shapes the logic layer expects
- `shared/` contains infrastructure used across data domains (HTTP client, API types)
- No business logic — data layer just fetches, persists, and transforms

**Can import from:**
- ✅ `Config/` (API endpoints, database config)
- ❌ `02-logic/` (data must not contain business rules)
- ❌ `01-presentation/` (data must not know about UI)

---

## tests/ (Behavioral Tests)

**Purpose:** Layer 3 behavioral/E2E tests that test user flows across all tiers. These don't belong next to any single component — they test the whole system.

```
tests/
└── e2e/
    ├── meal-plan-creation.spec.ts
    ├── shopping-list-generation.spec.ts
    └── login-flow.spec.ts
```

**Key decisions:**
- Organized by user flow, not by component or layer
- Named after what the user does (`meal-plan-creation`), not what code it tests
- Layer 1 and 2 tests live next to their source files. Only Layer 3 lives here.
- Uses Playwright or similar browser automation tools

---

## Config/ (Configuration)

**Purpose:** Environment variables, constants, feature flags.

```
Config/
├── environment.ts             # Environment-specific settings (API URL, flags)
└── constants.ts               # App-wide constants (limits, formats, version)
```

Can be imported by any tier. Contains no business logic.

---

## Documentation/ (Project Planning)

```
Documentation/
├── project-roadmap.md         # Milestones and release plan (source of truth)
├── architecture.md            # System design and data flow
├── changelog.md               # Version history (Keep a Changelog format)
├── Project-Structure.md       # This file
├── bugs/                      # Bug reports (created by /Bug)
├── project-planning/          # Templates for docs generation
└── features/
    └── {program}/
        └── {module}/
            ├── _{module}.md          # Module explainer
            └── {feature-name}.md     # Feature specification
```

---

## Standards/ (Quality Standards)

```
Standards/
├── Architecture.md            # Module boundaries, dependency flow
├── Checklist.md               # Scope-filtered verification checklist
├── Code-Quality.md            # 4-layer TDD, naming, error handling
├── Design.md                  # UI/UX, accessibility, responsive
├── Documentation.md           # Versioning, living documentation
└── Security.md                # OWASP, auth, data protection
```

---

## File Naming Conventions

| Location | Convention | Example |
|----------|-----------|---------|
| Components (`01-presentation/`) | `PascalCase.tsx` | `MealPlanForm.tsx` |
| Component tests | `PascalCase.test.tsx` | `MealPlanForm.test.tsx` |
| Feature CSS | `kebab-case.css` | `meal-plans.css` |
| Services (`02-logic/`) | `PascalCaseService.ts` | `MealPlanService.ts` |
| Repositories (`03-data/`) | `PascalCaseRepository.ts` | `MealPlanRepository.ts` |
| Domain models | `PascalCase.ts` | `MealPlan.ts` |
| Utilities (`shared/utils/`) | `camelCase.ts` | `formatDate.ts` |
| Types (`shared/types/`) | `camelCase.ts` | `domain.ts` |
| E2E tests (`tests/e2e/`) | `kebab-case.spec.ts` | `meal-plan-creation.spec.ts` |

---

## Common Patterns

### Valid Import Flow

```typescript
// 01-presentation/features/meal-plans/MealPlanList.tsx
import { MealPlanService } from '../../../02-logic/meal-plans/MealPlanService';
import type { MealPlan } from '../../../02-logic/meal-plans/MealPlan';

function MealPlanList() {
  const plans = MealPlanService.getAll();
  return <div>{plans.map(...)}</div>;
}

// 02-logic/meal-plans/MealPlanService.ts
import { MealPlanRepository } from '../../03-data/meal-plans/MealPlanRepository';
import type { PaginatedResult } from '../shared/types/domain';

export class MealPlanService {
  static getAll(): PaginatedResult<MealPlan> {
    const repo = new MealPlanRepository();
    return repo.findAll();
  }
}

// 03-data/meal-plans/MealPlanRepository.ts
import { apiClient } from '../shared/api/apiClient';
import type { ApiResponse } from '../shared/types/api';

export class MealPlanRepository {
  async findAll(): Promise<ApiResponse<MealPlan[]>> {
    return apiClient.get('/meal-plans');
  }
}
```

### Invalid Imports (Blocked by Validator)

```typescript
// 03-data/meal-plans/MealPlanRepository.ts
import { MealPlanService } from '../../02-logic/meal-plans/MealPlanService';
// ❌ BLOCKED: Data cannot import from logic

// 01-presentation/features/meal-plans/MealPlanList.tsx
import { MealPlanRepository } from '../../../03-data/meal-plans/MealPlanRepository';
// ❌ BLOCKED: Presentation cannot skip logic layer
```

---

## Architecture Decision Records (ADRs)

**When to create an ADR:**
- Choosing between architectural patterns
- Major technology decisions
- Significant changes to folder structure

**Format:**
```markdown
## ADR-001: Use 3-Tier Architecture

**Date:** 2026-01-03
**Status:** Accepted

**Context:** Need clear separation of concerns and testability.

**Decision:** Implement strict 3-tier architecture with automated enforcement.

**Consequences:**
- Clear boundaries between layers
- Easier to test in isolation
- Prevents spaghetti code
- Requires discipline and validator setup
```
