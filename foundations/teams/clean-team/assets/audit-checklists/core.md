# Core Audit Checklists

Checklists for the 4 core (universal) auditors. Pass the relevant checklist to each Task agent in its prompt. These apply to every project regardless of tech stack.

---

## 1. File Organization Auditor

**Naming Conventions:**
- [ ] Inconsistent naming (camelCase vs snake_case vs kebab-case mixing)
- [ ] Vague names (`utils.js`, `helpers.py`, `misc/`, `stuff/`)
- [ ] Names that don't reflect content
- [ ] Numbered files (`file1.js`, `file2.js`)
- [ ] Abbreviations that reduce clarity

**Directory Structure:**
- [ ] Flat structures that should be nested
- [ ] Over-nested structures (> 4 levels deep)
- [ ] Related files scattered across directories
- [ ] Missing standard directories for the project type
- [ ] Orphaned files in root that belong elsewhere

**File Organization:**
- [ ] Files mixing multiple concerns
- [ ] Files too long (>300 lines smell, >500 needs splitting)
- [ ] Related functionality split across too many files
- [ ] Missing index files for clean exports
- [ ] Circular dependencies

---

## 2. Code Quality Auditor

- [ ] Duplicate code across files
- [ ] Dead code (unused exports, commented blocks)
- [ ] Inconsistent patterns (some files use classes, others functions)
- [ ] Missing or inconsistent error handling
- [ ] Hardcoded values that should be constants
- [ ] Configuration scattered instead of centralized
- [ ] Magic numbers without explanation
- [ ] Overly complex functions (high cyclomatic complexity)

---

## 3. Scalability Auditor

- [ ] Monolithic files that will become bottlenecks
- [ ] Tight coupling between modules
- [ ] Missing abstraction layers
- [ ] Patterns that don't scale (switch statements that grow)
- [ ] God objects/classes doing too much
- [ ] Missing dependency injection

---

## 4. Developer Experience Auditor

- [ ] Missing or outdated README
- [ ] No clear entry points
- [ ] Confusing import paths
- [ ] Missing type annotations or documentation
- [ ] No consistent code style enforcement
- [ ] Missing contributing guidelines
- [ ] No architecture documentation
