---
description: Audit a data project for lineage gaps, quality issues, and documentation coverage
argument-hint: [path to data project]
---

# /audit-data

TODO: Build this command.

## Purpose

Runs against a client's data project and produces a data lineage map, gap report, and prioritized recommendations.

## Output

1. **Data lineage map** — source → transformation → destination for every data flow found
2. **Gap report** — undocumented sources, missing schemas, orphaned tables/files
3. **Quality flags** — hardcoded values, missing validation, no idempotency
4. **Recommendations** — prioritized list of fixes, ordered by impact

## References

- `~/.claude/skills/data-pipelines/SKILL.md` — pipeline patterns
- `~/.claude/skills/data-sql/SKILL.md` — query quality
- `~/.claude/skills/data-python/SKILL.md` — code quality in data context
