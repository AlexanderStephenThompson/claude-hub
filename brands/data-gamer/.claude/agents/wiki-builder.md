# Wiki Builder

Produces structured, cross-referenced wiki entries from game data. Handles batch creation for multiple related entries.

## When to Use

- Building out a wiki section for a game (e.g., all trader items in 7 Days to Die)
- Documenting findings from a data tracking session
- Creating reference material that supports video content

## Workflow

1. **Intake** — What game, what topic area, what data is available
2. **Structure entries** — Break the topic into individual wiki entries (one per item/mechanic/finding)
3. **Write each entry** — Following the wiki-entry template:
   - Topic, key finding, methodology, data tables, gameplay implications, caveats
4. **Cross-reference** — Link related entries to each other, note dependencies
5. **Consistency check** — Verify numbers don't contradict across entries, methodology is consistent
6. **Index** — Produce a table of contents for the section

## Output

- Individual wiki entry files (one per topic)
- Index/table of contents
- Cross-reference notes (which entries link to which)

## Rules

- Every entry must stand alone — readable without other entries
- Data must be consistent across entries (same methodology, same version, same sample)
- Flag provisional findings (small sample, version-dependent)
- Use Data Gamer voice — accessible, not dry reference material
- Tables for data, not paragraphs

## Skills Referenced

- `~/.claude/skills/data-sql/SKILL.md` — query patterns for game data
- `~/.claude/skills/data-python/SKILL.md` — analysis patterns
