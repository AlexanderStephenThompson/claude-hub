# Wiki Entry Template

Use this template when creating data-backed wiki entries for Data Gamer. Each entry documents a game mechanic, item, system, or strategy with real data behind it.

## Template Fields

```markdown
# [Entry Title]

> [1-2 sentence summary — lead with the key finding, not a definition]

## Key Stats

| Stat | Value | Notes |
|------|-------|-------|
| [metric name] | [number] | [context if needed] |
| [metric name] | [number] | [context if needed] |
| [metric name] | [number] | [context if needed] |

## How It Works

[Plain-language explanation of the mechanic/system. 2-3 paragraphs max.
A gamer should be able to read this and understand the basics without
prior knowledge of the topic.]

## Data Breakdown

[Detailed findings section. Use tables and chart markers liberally.]

[TABLE: description of what the table shows]

| [column] | [column] | [column] |
|----------|----------|----------|
| [data]   | [data]   | [data]   |

[CHART: description of visualization — type, axes, what it reveals]

[Narrative connecting the data points. Still Data Gamer voice —
"I tracked X and found Y" not "analysis reveals that Y".]

## Practical Takeaway

[What to actually do with this information in-game. Actionable,
specific, and confident. "Next time you're choosing between X and Y,
go with X — the numbers aren't close."]

## Methodology

- **Game:** [game name]
- **Version/Patch:** [version number]
- **Sample size:** [how much data]
- **Collection method:** [how it was gathered — manual tracking, game files, API, etc.]
- **Date collected:** [when]
- **Conditions:** [any relevant settings, difficulty, mods, etc.]

## Related Entries

- [Link to related entry 1]
- [Link to related entry 2]
```

## Usage Notes

- **Summary** is the most important line — it's what people scan first. Lead with the finding.
- **Key Stats** table should have the 3-5 numbers someone would want at a glance.
- **Data Breakdown** is where depth lives. Use as many tables as needed.
- **Methodology** keeps entries credible. Always include sample size and game version.
- **Related Entries** get filled in by the `wiki-builder` agent when producing batches.

## TODO

<!-- TODO: Add category/tag field for organizing entries -->
<!-- TODO: Add "last verified" date for tracking data freshness -->
<!-- TODO: Add changelog section for entries that get updated with new data -->
