---
description: Generate a dashboard specification from a business question and data source
argument-hint: [business question + data source description]
---

# /dashboard-spec

TODO: Build this command.

## Purpose

Takes a business question and data source description, and outputs a dashboard specification ready for implementation.

## Output

1. **Business question** — restated clearly
2. **Key metrics** — what to measure, with definitions
3. **Dimensions** — how to slice the data (time, category, segment)
4. **Filters** — what the user needs to control
5. **Visualizations** — chart type recommendation for each metric with rationale
6. **Data requirements** — source tables/fields needed, any transformations
7. **Refresh cadence** — how often the data should update

## Rules

- Every metric must have a clear definition (no ambiguous "revenue")
- Recommend the simplest visualization that answers the question
- Name tradeoffs when choosing chart types

## References

- `~/.claude/skills/data-sql/SKILL.md` — query patterns for metrics
- `brand/voice.md` — recommendations name the tradeoff
