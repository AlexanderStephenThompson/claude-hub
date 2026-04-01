# Validator Summary

**Version:** 1.0
**Last Updated:** 2026-01-26

> Summary of implemented validators that enforce standards automatically.

---

## Implemented Validators (5)

The following validators are implemented and run via `npm run validate`:

### 1. Design Tokens (`design-tokens.js`)

**Purpose:** Blocks hardcoded CSS values to enforce design system usage.

**What it checks:**
- CSS files for hardcoded colors (hex, rgb, hsl)
- Hardcoded spacing values (px, rem, em)
- Hardcoded font sizes and shadows

**Run individually:** `npm run validate:tokens`

---

### 2. Architecture Boundaries (`architecture-boundaries.js`)

**Purpose:** Enforces 3-tier architecture dependency flow.

**What it checks:**
- Presentation layer (01-presentation/) imports only from logic or config
- Logic layer (02-logic/) imports only from data or config
- Data layer (03-data/) imports only from config
- Blocks reverse dependencies (data importing from logic, etc.)

**Run individually:** `npm run validate:arch`

---

### 3. File Naming (`file-naming.js`)

**Purpose:** Validates file naming conventions.

**What it checks:**
- Components use PascalCase (e.g., `Button.tsx`)
- Services use PascalCase + Service suffix (e.g., `EmailService.ts`)
- Repositories use PascalCase + Repository suffix (e.g., `UserRepository.ts`)
- Utils use camelCase (e.g., `formatDate.ts`)
- CSS files use kebab-case (e.g., `global.css`)
- Tests match source file name + `.test` (e.g., `Button.test.tsx`)

**Run individually:** `npm run validate:naming`

---

### 4. Secret Scanner (`secret-scanner.js`)

**Purpose:** Detects hardcoded secrets to prevent accidental exposure.

**What it checks:**
- API keys and tokens
- Passwords and credentials
- Private keys
- Connection strings with embedded credentials

**Run individually:** `npm run validate:secrets`

---

### 5. Documentation Sync (`documentation-sync.js`)

**Purpose:** Detects drift between documentation files and code reality.

**What it checks:**
- Every feature listed in module explainers has a matching `.md` file
- Feature statuses match between module tables and feature files
- Module progress counts (X/Y) are accurate
- CLAUDE.md has a populated Project State section (if project initialized)

**Run individually:** `npm run validate:sync`

---

## Running Validators

```bash
# Run all validators
npm run validate

# Run individual validators
npm run validate:tokens
npm run validate:arch
npm run validate:naming
npm run validate:secrets
npm run validate:sync
```

---

## Pre-commit Hook

The `.husky/pre-commit` hook runs all validators before every commit. If any validator fails, the commit is blocked until issues are fixed.

---

## Not Yet Implemented

The following validators are referenced in documentation but not yet implemented:

- Test Coverage - coverage thresholds
- Documentation - documentation structure validation
- Semantic HTML - proper HTML usage
- Contrast Checker - WCAG AA color contrast

These may be added in future versions.
