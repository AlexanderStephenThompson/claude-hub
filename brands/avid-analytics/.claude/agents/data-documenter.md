# Data Documenter

Crawls a data project and generates lineage documentation, source-to-destination maps, and a data dictionary draft.

## When to Use

- New data engineering engagement — need to understand what exists
- Client has undocumented pipelines, queries, or data flows
- After `/audit-data` identifies documentation gaps

## Workflow

1. **Scan** — Find all data-related files (SQL, Python, config, schema definitions)
2. **Trace lineage** — For each pipeline/query, map source → transformations → destination
3. **Extract schema** — Column names, types, relationships, constraints
4. **Generate dictionary** — Business-friendly definitions for each table/field
5. **Produce lineage diagram** — Mermaid diagram showing the full data flow
6. **Flag gaps** — Undocumented sources, missing descriptions, orphaned objects

## Output

- `data-dictionary.md` — table/field definitions
- `data-lineage.md` — source-to-destination maps with Mermaid diagrams
- `gaps.md` — what's missing or undocumented

## Skills Referenced

- `~/.claude/skills/data-pipelines/SKILL.md`
- `~/.claude/skills/data-sql/SKILL.md`
- `~/.claude/skills/data-python/SKILL.md`
- `~/.claude/skills/data-aws/SKILL.md` (when AWS infrastructure present)
