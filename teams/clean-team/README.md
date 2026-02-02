# Clean Team

4-agent codebase hygiene workflow. Organizes structure, cleans UI code, polishes remaining issues, verifies results.

## Quick Start

```bash
/clean-team:clean              # Full project cleanup
/clean-team:clean src/         # Scope to directory
```

---

## Pipeline

```
Organizer → Stylist → Polisher → Verifier
```

| Agent | Focus | Executes |
|-------|-------|----------|
| **Organizer** | Project structure | File moves, renames, deletes |
| **Stylist** | UI code (web only) | CSS consolidation to ≤5 files, HTML fixes |
| **Polisher** | Code quality | Dead code removal, constant extraction |
| **Verifier** | Verification | Tests, metrics, CLEANUP-REPORT.md |

---

## Key Features

### CSS File Consolidation (Stylist)

The Stylist enforces a **5-file maximum** for vanilla CSS projects:

```
styles/
├── tokens.css      # CSS variables only
├── base.css        # Reset + element defaults
├── layouts.css     # Page scaffolding, grids
├── components.css  # All component styles
└── utilities.css   # Helper classes
```

| CSS Files | Action |
|-----------|--------|
| ≤5 | Pass |
| 6-7 | Merge until ≤5 |
| 8+ | **Must consolidate** |

### Structure Organization (Organizer)

- Audits root config, folder structure, file organization, naming, docs
- Executes quick tidies immediately
- Asks before major restructuring
- Preserves git history with `git mv`

### Safe Code Polish (Polisher)

**Fixes automatically:**
- Unused imports
- Unused variables
- Commented-out code
- Debug statements (console.log)
- Magic numbers → constants

**Flags for review:**
- Unused functions (might be dynamic)
- Complex refactors
- Public API changes

---

## Output

Each run produces:

1. **3 git commits** — One per executing agent
2. **CLEANUP-REPORT.md** — Full metrics and summary
3. **Console summary** — Key results at a glance

### Example Report

```markdown
# Cleanup Report

## Summary
| Agent | Changes | Commit |
|-------|---------|--------|
| Organizer | 12 files moved, 5 renamed | abc123 |
| Stylist | CSS 8→5 files, 23 HTML fixes | def456 |
| Polisher | 47 dead code removals | ghi789 |

## Metrics
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| CSS files | 8 | 5 | -3 ✅ |
| Dead imports | 34 | 0 | -34 |

## Test Results
✅ All tests passing
```

---

## When to Use

- **Before major work** — Start with a clean codebase
- **After organic growth** — Clean up accumulated mess
- **Before handoff** — Leave codebase navigable for next developer
- **Regular maintenance** — Run monthly to prevent debt accumulation

---

## Relationship to Standalone Commands

The clean-team agents contain the same logic as the standalone audit commands, but with **execution built in**:

| Standalone Command | Clean Team Agent |
|--------------------|------------------|
| `/structure` (audit only) | Organizer (audit + fix) |
| `/ui-audit` (audit only) | Stylist (audit + fix) |
| `/deep-scan` (audit only) | Polisher (audit + fix) |
| — | Verifier (verification) |

Use standalone commands for analysis. Use clean-team for automated cleanup.

---

## Version

**1.0.0** — Initial release
