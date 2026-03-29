---
description: Identify automation candidates and recommend trigger-workflow designs
argument-hint: [process descriptions or path to documentation]
---

# /automation-audit

TODO: Build this command.

## Purpose

Scores manual processes using the prioritization matrix, identifies automation candidates, and recommends a trigger → workflow design for each.

## Workflow

1. List all manual processes from input
2. Score each (frequency x time cost x error risk)
3. Filter: "Does this actually need to happen?" — eliminate before automating
4. For survivors: design trigger → workflow → orchestration chain
5. Recommend tools/approach for each

## Output

1. Scored candidate list
2. For each candidate:
   - Trigger definition (what starts it)
   - Workflow steps (static rules vs. dynamic AI agent)
   - Tool recommendation
   - Estimated time savings
3. Orchestration diagram if multiple automations chain together

## References

- `knowledge/business-acumen.md` — automation section (trigger → workflow → orchestration)
