# Refactoring Checklists

Printable/copyable checklists for both the clean phase and refactor phase.

---

## Pre-Clean Assessment

Before starting the clean phase:

```markdown
## Pre-Clean Checklist

### Environment Ready
- [ ] Code is committed (clean working tree)
- [ ] Can revert if something goes wrong
- [ ] Tests exist and are passing (or noted as absent)

### Scope Defined
- [ ] Cleanup scope is clearly defined (full project or specific path)
- [ ] User expectations set (clean phase produces audit report)
```

---

## Clean Phase Checklists

### Organizer Checklist
```markdown
- [ ] Root free of stray files
- [ ] Config files necessary and current
- [ ] Folder structure reflects project mental model
- [ ] Related files co-located
- [ ] Nesting depth reasonable
- [ ] File names descriptive and consistent
- [ ] File names match primary exports
- [ ] Root README exists
- [ ] Major folders documented
- [ ] Changes committed
```

### Formatter Checklist
```markdown
#### Universal Cleaning
- [ ] Unused imports removed
- [ ] Dead variables removed
- [ ] Commented-out code removed
- [ ] Debug statements removed
- [ ] Magic numbers extracted to constants
- [ ] Deep nesting flattened (>3 levels)
- [ ] Inconsistent naming fixed

#### Project-Type Profile
- [ ] Project type detected (web / unity / python / data / generic)
- [ ] Matching cleaning profile loaded from assets/cleaning-profiles/
- [ ] Type-specific conventions applied
- [ ] Risky changes flagged (not executed)
- [ ] Changes committed
```

---

## Pre-Refactor Assessment

Before starting refactoring:

```markdown
## Pre-Refactor Checklist

### Understand the Code
- [ ] AUDIT-REPORT.md has been read
- [ ] I understand the codebase architecture
- [ ] I know the project type and applicable conventions
- [ ] I've reviewed the prioritized findings

### Verify Safety Net
- [ ] Tests exist for critical paths
- [ ] Tests are passing
- [ ] I can run tests easily and quickly

### Define Scope
- [ ] Refactoring scope defined from audit findings
- [ ] Target intensity level chosen: [ ] SMALL [ ] MEDIUM [ ] DEEP
- [ ] Files/modules to touch are identified

### Environment Ready
- [ ] Code is committed (clean working tree)
- [ ] Branch created if needed
- [ ] Can revert if something goes wrong
```

---

## Phase 1: SMALL (Safe)

```markdown
## Phase 1 Checklist (SMALL)

### Naming
- [ ] Variables have descriptive names
- [ ] Functions have verb-phrase names
- [ ] Booleans prefixed with is/has/should/can
- [ ] No abbreviations or single letters (except loop indices)
- [ ] Names reveal intent, not implementation

### Dead Code Removal
- [ ] Unused imports removed
- [ ] Commented-out code removed (or has ticket reference)
- [ ] Unreachable code removed
- [ ] Unused variables removed
- [ ] Unused functions removed (verified not called)

### Formatting
- [ ] Consistent indentation
- [ ] No trailing whitespace
- [ ] Consistent spacing around operators
- [ ] Line length within limits

### Magic Values
- [ ] Numbers extracted to named constants
- [ ] Repeated strings extracted to constants
- [ ] No magic boolean parameters

### Comments
- [ ] Stale/incorrect comments updated or removed
- [ ] Clarifying comments added where needed
- [ ] TODO comments have ticket references

### Completion
- [ ] All tests passing
- [ ] Changes committed
- [ ] Commit message follows convention
```

---

## Phase 2: MEDIUM (Standard)

```markdown
## Phase 2 Checklist (MEDIUM)

### Prerequisites
- [ ] Phase 1 (SMALL) complete
- [ ] Summary of planned changes prepared
- [ ] Approval received (if required)

### Function Extraction
- [ ] Large functions (>40 lines) identified
- [ ] Logical chunks extracted to named functions
- [ ] Duplicated logic extracted to helpers
- [ ] Each function does one thing

### Simplification
- [ ] Nested conditionals converted to guard clauses
- [ ] Complex boolean expressions simplified
- [ ] Callbacks converted to async/await (where applicable)
- [ ] Unnecessary abstractions inlined

### Organization
- [ ] Functions ordered: public first, helpers below
- [ ] Related functions grouped together
- [ ] Error handling consistent

### Quality Checks
- [ ] No function exceeds 40 lines
- [ ] No nesting deeper than 3 levels
- [ ] No function has more than 5 parameters
- [ ] Cyclomatic complexity reasonable (<10)

### Completion
- [ ] All tests passing
- [ ] Changes committed atomically
- [ ] Each commit message describes what and why
- [ ] Summary of changes documented
```

---

## Phase 3: DEEP (Aggressive)

```markdown
## Phase 3 Checklist (DEEP)

### Prerequisites
- [ ] Phase 1 (SMALL) complete
- [ ] Phase 2 (MEDIUM) complete
- [ ] Deep refactor plan drafted
- [ ] Plan includes:
  - [ ] Current state assessment
  - [ ] Proposed end state
  - [ ] Risk analysis
  - [ ] Migration strategy
  - [ ] Rollback plan
- [ ] Explicit approval received

### Execution Setup
- [ ] Working branch created
- [ ] Baseline commit identified for rollback
- [ ] Checkpoints defined

### Structural Changes
For each major change:
- [ ] Change implemented
- [ ] Tests updated if needed
- [ ] Tests passing
- [ ] Change committed with clear message
- [ ] Breaking changes documented

### Public API Changes
- [ ] All API changes identified
- [ ] Migration notes written
- [ ] Deprecation warnings added (if applicable)
- [ ] Consumers notified (if applicable)

### Documentation
- [ ] Breaking changes listed
- [ ] Migration instructions provided
- [ ] Architecture changes documented
- [ ] README updated if needed

### Final Verification
- [ ] Full test suite passing
- [ ] No regressions in functionality
- [ ] Code review complete (if applicable)
- [ ] Rollback tested or verified possible

### Completion
- [ ] Final commit/merge
- [ ] Summary report created
- [ ] Rollback point documented
```

---

## Post-Refactor Verification

After any refactoring:

```markdown
## Post-Refactor Checklist

### Functional Verification
- [ ] All tests passing
- [ ] Manual smoke test (if applicable)
- [ ] No console errors/warnings introduced

### Code Quality
- [ ] Code is more readable than before
- [ ] No new complexity introduced
- [ ] Follows established conventions

### Documentation
- [ ] Changes summarized
- [ ] Any follow-up work noted
- [ ] Technical debt tracked (if any deferred)

### Cleanup
- [ ] No temporary/debug code left behind
- [ ] No TODOs without ticket references
- [ ] Working tree clean
```

---

## Quick Decision Checklist

When unsure whether to make a change:

```markdown
## Should I Make This Change?

- [ ] Does it improve readability?
- [ ] Does it reduce complexity?
- [ ] Does it follow established patterns?
- [ ] Can I test that it doesn't break anything?
- [ ] Is it within my defined scope?
- [ ] Would another developer thank me for this?

If NO to any: reconsider or defer the change.
```
